const PDFDocument = require('pdfkit');

function generateTripPDFReport(trip, participants, expenses, bookings, settlement, res) {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="TripLedger_${trip.name.replace(/[^a-zA-Z0-9]/g, '_')}_Report.pdf"`);

  doc.pipe(res);

  // Title & Header
  doc.fontSize(24).fillColor('#111111').text(`TripLedger Report: ${trip.name}`, { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor('#4b5563').text(`Destination: ${trip.destination || 'N/A'} | Dates: ${new Date(trip.start_date).toLocaleDateString()} - ${new Date(trip.end_date).toLocaleDateString()}`, { align: 'center' });
  doc.moveDown(1.5);

  // Quick Overview Box
  doc.fontSize(16).fillColor('#2563eb').text('1. Executive Overview');
  doc.moveDown(0.5);

  const totalExpenseCost = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBookingCost = bookings.reduce((sum, b) => sum + b.total_cost, 0);
  const grandTotal = totalExpenseCost + totalBookingCost;
  const perPersonAvg = participants.length > 0 ? grandTotal / participants.length : 0;

  doc.fontSize(11).fillColor('#1f2937')
    .text(`• Total Trip Expenses Recorded: $${totalExpenseCost.toFixed(2)}`)
    .text(`• Total Locked Bookings: $${totalBookingCost.toFixed(2)}`)
    .text(`• Grand Total Cost: $${grandTotal.toFixed(2)}`)
    .text(`• Number of Participants: ${participants.length}`)
    .text(`• Average Per-Person Share: $${perPersonAvg.toFixed(2)}`);

  doc.moveDown(1.5);

  // Participant Balances
  doc.fontSize(16).fillColor('#2563eb').text('2. Participant Financial Summary');
  doc.moveDown(0.5);

  participants.forEach(p => {
    const net = (p.total_owed || 0) - (p.total_paid || 0);
    const statusText = net > 0 ? `Owes $${net.toFixed(2)}` : net < 0 ? `Owed $${Math.abs(net).toFixed(2)}` : 'Settled (Even)';
    doc.fontSize(11).fillColor('#111111').text(`${p.name} (${p.email})`);
    doc.fontSize(10).fillColor('#4b5563').text(`   Total Paid: $${(p.total_paid || 0).toFixed(2)} | Total Owed: $${(p.total_owed || 0).toFixed(2)} | Net Position: ${statusText}`);
    doc.moveDown(0.3);
  });

  doc.moveDown(1.5);

  // Settlement Transactions Required
  doc.fontSize(16).fillColor('#2563eb').text('3. Required Settlement Transactions');
  doc.moveDown(0.5);

  if (settlement && settlement.transactions_required && settlement.transactions_required.length > 0) {
    settlement.transactions_required.forEach((tx, idx) => {
      const fromP = participants.find(p => p._id.toString() === tx.from_participant.toString())?.name || 'Participant';
      const toP = participants.find(p => p._id.toString() === tx.to_participant.toString())?.name || 'Participant';
      doc.fontSize(11).fillColor('#111111').text(`${idx + 1}. ${fromP}  ➜  ${toP}:  $${tx.amount.toFixed(2)} (${tx.status || 'PENDING'})`);
    });
  } else {
    doc.fontSize(11).fillColor('#16a34a').text('All balances are currently even or no pending settlement transactions.');
  }

  doc.moveDown(2);
  doc.fontSize(9).fillColor('#9ca3af').text(`Generated automatically by TripLedger on ${new Date().toLocaleString()}`, { align: 'center' });

  doc.end();
}

module.exports = {
  generateTripPDFReport
};
