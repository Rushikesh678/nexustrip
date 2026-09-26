const Participant = require('../models/Participant');
const Expense = require('../models/Expense');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const LedgerEntry = require('../models/LedgerEntry');

function calculateOverlapNights(arrivalA, departureA, arrivalB, departureB) {
  const start = new Date(Math.max(new Date(arrivalA).getTime(), new Date(arrivalB).getTime()));
  const end = new Date(Math.min(new Date(departureA).getTime(), new Date(departureB).getTime()));
  if (start >= end) return 0;
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function roundAmount(amount, method = 'last_person') {
  if (isNaN(amount)) return 0;
  switch (method) {
    case 'banker':
      return Math.round(amount * 100) / 100;
    case 'last_person':
      return Math.floor(amount * 100) / 100;
    case 'equal':
    default:
      return Math.round(amount * 100) / 100;
  }
}

function calculateParticipantShare(booking, participant, participants, trip) {
  const errors = [];
  let share = 0;
  let breakdown = '';

  const assignment = booking.assigned_participants?.find(
    a => a.participant_id.toString() === participant._id.toString()
  );

  if (!assignment && booking.allocation_model !== 'equal') {
    errors.push(`Participant ${participant.name} is not assigned to booking ${booking.description}`);
    return { share: 0, breakdown: 'ERROR: Not assigned', valid: false, errors };
  }

  const assignedCount = booking.assigned_participants?.length || participants.length || 1;

  switch (booking.allocation_model) {
    case 'equal':
      share = booking.total_cost / assignedCount;
      breakdown = `Total $${booking.total_cost} ÷ ${assignedCount} participants`;
      break;

    case 'weighted_nights': {
      const pNights = calculateOverlapNights(
        participant.arrival_date || trip.start_date,
        participant.departure_date || trip.end_date,
        booking.start_date,
        booking.end_date
      );
      const totalNights = booking.assigned_participants.reduce((sum, a) => {
        const p = participants.find(x => x._id.toString() === a.participant_id.toString());
        if (!p) return sum;
        return sum + calculateOverlapNights(
          p.arrival_date || trip.start_date,
          p.departure_date || trip.end_date,
          booking.start_date,
          booking.end_date
        );
      }, 0);

      share = totalNights > 0 ? (booking.total_cost / totalNights) * pNights : 0;
      breakdown = `(${pNights} nights ÷ ${totalNights} total nights) × $${booking.total_cost}`;
      break;
    }

    case 'tiered': {
      const tierTotal = booking.assigned_participants.reduce((sum, a) => {
        const p = participants.find(x => x._id.toString() === a.participant_id.toString());
        return sum + (p?.tier_multiplier || 1.0);
      }, 0);
      const multiplier = participant.tier_multiplier || 1.0;
      share = tierTotal > 0 ? (booking.total_cost / tierTotal) * multiplier : 0;
      breakdown = `(Multiplier ${multiplier} ÷ Total ${tierTotal}) × $${booking.total_cost}`;
      break;
    }

    case 'occupancy_based': {
      const qty = assignment ? assignment.quantity : 1;
      const roomies = booking.assigned_participants.filter(a => a.quantity === qty);
      share = roomies.length > 0 ? booking.total_cost / roomies.length : booking.total_cost / assignedCount;
      breakdown = `Group cost $${booking.total_cost} ÷ ${roomies.length || assignedCount} occupants`;
      break;
    }

    case 'consumption_only':
      share = booking.total_cost / assignedCount;
      breakdown = `${assignedCount} participants attended; $${booking.total_cost} total`;
      break;

    case 'custom_fixed':
      share = assignment ? assignment.amount_owed : 0;
      breakdown = `Custom fixed share: $${share}`;
      break;

    default:
      share = booking.total_cost / assignedCount;
      breakdown = `Default equal split: $${booking.total_cost} ÷ ${assignedCount}`;
  }

  share = roundAmount(share, trip.rounding_method);
  return { share, breakdown, valid: true, errors };
}

function calculateSettlement(trip, participants, expenses = [], payments = []) {
  const settlement = {
    tripId: trip._id,
    settlement_date: new Date().toISOString(),
    balances: [],
    transactions_required: [],
    validation_errors: [],
    is_balanced: true
  };

  let sumOwed = 0;
  let sumPaid = 0;

  for (const p of participants) {
    const totalOwed = p.total_owed || 0;
    const totalPaid = p.total_paid || 0;
    const netBalance = totalOwed - totalPaid; // Positive = owes money to group; Negative = owed refund from group

    settlement.balances.push({
      participant_id: p._id,
      name: p.name,
      total_owed: Math.round(totalOwed * 100) / 100,
      total_paid: Math.round(totalPaid * 100) / 100,
      net_balance: Math.round(netBalance * 100) / 100
    });

    sumOwed += totalOwed;
    sumPaid += totalPaid;
  }

  const diff = Math.abs(sumOwed - sumPaid);
  if (diff > 0.05) {
    settlement.validation_errors.push(`Balance sum mismatch: Total Owed ($${sumOwed.toFixed(2)}) ≠ Total Paid ($${sumPaid.toFixed(2)})`);
  }

  // Debtors owe money (net_balance > 0.01)
  const debtors = settlement.balances
    .filter(b => b.net_balance > 0.01)
    .map(b => ({ ...b, remaining: b.net_balance }))
    .sort((a, b) => b.remaining - a.remaining);

  // Creditors are owed money (net_balance < -0.01)
  const creditors = settlement.balances
    .filter(b => b.net_balance < -0.01)
    .map(b => ({ ...b, remaining: -b.net_balance }))
    .sort((a, b) => b.remaining - a.remaining);

  for (const debtor of debtors) {
    for (const creditor of creditors) {
      if (debtor.remaining <= 0.009) break;
      if (creditor.remaining <= 0.009) continue;

      const transfer = Math.min(debtor.remaining, creditor.remaining);
      if (transfer > 0.009) {
        const transferRounded = Math.round(transfer * 100) / 100;
        settlement.transactions_required.push({
          from_participant: debtor.participant_id,
          to_participant: creditor.participant_id,
          amount: transferRounded,
          reason: `Trip Settlement for ${trip.name}`,
          status: 'PENDING'
        });

        debtor.remaining -= transferRounded;
        creditor.remaining -= transferRounded;
      }
    }
  }

  settlement.is_balanced = settlement.validation_errors.length === 0;
  return settlement;
}

async function recalculateParticipantBalances(tripId) {
  const participants = await Participant.find({ trip_id: tripId });
  const expenses = await Expense.find({ tripId, status: { $ne: 'DELETED' } });
  const payments = await Payment.find({ trip_id: tripId, status: 'completed' });
  const bookings = await Booking.find({ trip_id: tripId, status: { $ne: 'cancelled' } });

  for (const p of participants) {
    let totalOwed = 0;
    let totalPaid = 0;

    // From Expenses
    for (const exp of expenses) {
      if (exp.payerId.toString() === p._id.toString()) {
        totalPaid += exp.amount;
      }
      const part = exp.participants?.find(pt => pt.memberId.toString() === p._id.toString());
      if (part) {
        totalOwed += part.share;
      }
    }

    // From Bookings
    for (const b of bookings) {
      if (b.paid_by && b.paid_by.toString() === p._id.toString()) {
        totalPaid += b.amount_paid || b.total_cost;
      }
      const assigned = b.assigned_participants?.find(ap => ap.participant_id.toString() === p._id.toString());
      if (assigned) {
        totalOwed += assigned.amount_owed;
      }
    }

    // From Direct Payments
    for (const pym of payments) {
      if (pym.payer_id.toString() === p._id.toString()) {
        totalPaid += pym.amount;
      }
      if (pym.payee_id.toString() === p._id.toString()) {
        totalOwed += pym.amount;
      }
    }

    p.total_owed = Math.round(totalOwed * 100) / 100;
    p.total_paid = Math.round(totalPaid * 100) / 100;
    p.balance = Math.round((totalPaid - totalOwed) * 100) / 100;

    await p.save();
  }

  return participants;
}

module.exports = {
  calculateOverlapNights,
  roundAmount,
  calculateParticipantShare,
  calculateSettlement,
  recalculateParticipantBalances
};
