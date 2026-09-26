# GROUPTRIP LEDGER - DATA SCHEMA & IMPLEMENTATION MODELS

## PART 1: CORE DATA MODELS

### 1.1 Trip Model
```typescript
interface Trip {
  id: string;
  name: string;
  description: string;
  organizer_id: string;
  co_organizers: string[]; // Backup organizers
  
  // Timeline
  start_date: ISO8601Date;
  end_date: ISO8601Date;
  status: TripStatus; // PLANNING, ACTIVE, COMPLETED, CANCELLED
  
  // Financial
  currency: string; // USD, GBP, EUR, etc.
  total_cost_estimated: number;
  total_cost_actual: number;
  payment_deadline: ISO8601Date;
  settlement_deadline: ISO8601Date;
  
  // Settings
  cost_sharing_model: CostSharingModel; // EQUAL, WEIGHTED, TIERED, CUSTOM
  allow_partial_join: boolean;
  allow_partial_payment: boolean;
  refund_policy: RefundPolicy; // FULL, PARTIAL, NONE, CUSTOM
  rounding_method: RoundingMethod; // BANKER, LAST_PERSON, EQUAL_DISTRIBUTION
  
  // Timestamps
  created_at: ISO8601DateTime;
  updated_at: ISO8601DateTime;
}

enum TripStatus {
  PLANNING = "planning",           // Bookings being made
  ACTIVE = "active",               // Trip in progress
  COMPLETED = "completed",         // Trip ended, settlement pending
  SETTLEMENT_IN_PROGRESS = "settlement_in_progress",
  SETTLED = "settled",             // All payments complete
  CANCELLED = "cancelled"          // Trip cancelled entirely
}

enum CostSharingModel {
  EQUAL = "equal",                 // All pay same
  WEIGHTED = "weighted",           // Based on participation days/units
  OCCUPANCY = "occupancy",         // Based on room/transport grouping
  CONSUMPTION = "consumption",     // Only participants in activity pay
  TIERED = "tiered",              // Different percentages (students, workers, sponsors)
  CUSTOM = "custom"                // Manually defined per booking
}

enum RefundPolicy {
  FULL = "full",                   // 100% refund available
  PARTIAL = "partial",             // Partial refund (% specified)
  NONE = "none",                   // No refunds
  CUSTOM = "custom"                // Vendor-specific policy
}

enum RoundingMethod {
  BANKER = "banker",               // Round to nearest cent
  LAST_PERSON = "last_person",     // Last person absorbs rounding diff
  EQUAL_DISTRIBUTION = "equal"     // Distribute rounding diff equally
}
```

---

### 1.2 Participant Model
```typescript
interface Participant {
  id: string;
  trip_id: string;
  user_id: string;
  
  // Identity
  name: string;
  email: string;
  phone?: string;
  
  // Trip Participation
  status: ParticipantStatus;
  arrival_date: ISO8601Date;  // When they join trip
  departure_date: ISO8601Date; // When they leave (may be after trip end)
  
  // Cost Tier (if tiered cost-sharing)
  cost_tier: string; // STUDENT, WORKER, SPONSOR, STANDARD, etc.
  tier_multiplier: number; // Cost % (0.5 for students, 1.0 for standard, 1.5 for sponsor)
  
  // Financial
  total_owed: number; // Calculated: sum of all booking allocations
  total_paid: number; // Sum of all payments made
  balance: number;    // Calculated: total_owed - total_paid (can be negative if overpaid)
  
  // Settings
  payment_method: PaymentMethod;
  venmo_handle?: string;
  paypal_email?: string;
  bank_account?: BankAccount;
  
  // Communication
  last_reminded: ISO8601DateTime;
  communication_preference: CommunicationPreference;
  
  // Tracking
  created_at: ISO8601DateTime;
  updated_at: ISO8601DateTime;
  removed_at?: ISO8601DateTime;  // When/if removed from trip
  removal_reason?: string;
}

enum ParticipantStatus {
  PROVISIONAL = "provisional",     // Conditionally joined; not confirmed
  CONFIRMED = "confirmed",         // Confirmed attendance
  ACTIVE = "active",               // Currently on trip
  DEPARTED = "departed",           // Left trip early
  NO_SHOW = "no_show",            // Registered but didn't attend
  WITHDRAWN = "withdrawn",         // Removed by choice
  REMOVED = "removed",             // Removed by organizer
  GHOSTING = "ghosting"            // Unresponsive; status uncertain
}

enum PaymentMethod {
  CASH = "cash",
  VENMO = "venmo",
  PAYPAL = "paypal",
  BANK_TRANSFER = "bank_transfer",
  CREDIT_CARD = "credit_card",
  PAYMENT_PLATFORM = "payment_platform", // Within app
  OTHER = "other"
}

interface BankAccount {
  account_holder: string;
  account_number: string; // Masked: ****1234
  routing_number: string;  // Masked
  bank_name: string;
}

enum CommunicationPreference {
  EMAIL = "email",
  SMS = "sms",
  IN_APP = "in_app",
  PHONE = "phone"
}
```

---

### 1.3 Booking Model
```typescript
interface Booking {
  id: string;
  trip_id: string;
  
  // Identity
  vendor_id: string;                // External vendor (airline, hotel, etc.)
  vendor_name: string;
  booking_reference: string;        // Vendor confirmation #
  type: BookingType;
  description: string;
  
  // Dates & Capacity
  start_date: ISO8601Date;
  end_date: ISO8601Date;
  quantity: number;                 // # of rooms, seats, tickets, etc.
  
  // Cost
  total_cost: number;               // Total charged by vendor
  cost_per_unit: number;            // Price per room/seat/ticket
  currency: string;
  tax_amount?: number;
  service_charge?: number;
  change_fee?: number;              // Applied if booking modified
  
  // Participants & Allocation
  assigned_participants: {           // Who is assigned to this booking
    participant_id: string;
    share_calculation: ShareCalculation;
    amount_owed: number;            // Their calculated share
    quantity: number;               // # of units (beds, seats) they occupy
  }[];
  
  allocation_model: CostAllocationModel;
  
  // Vendor Refund Policy
  refund_policy: RefundPolicy;
  cancellation_deadline: ISO8601Date;
  refund_percentage: number;        // E.g., 100% if cancelled by date, 50% after
  
  // Payment Status
  payment_status: BookingPaymentStatus;
  amount_paid: number;              // How much has been paid to vendor
  amount_owed_to_vendor: number;    // How much more is needed
  paid_by: string;                  // participant_id who paid
  paid_date: ISO8601DateTime;
  payment_receipt_id?: string;      // Link to payment record
  
  // Booking Status
  status: BookingStatus;
  confirmation_date?: ISO8601DateTime;
  cancellation_date?: ISO8601DateTime;
  cancellation_reason?: string;
  refund_received_date?: ISO8601DateTime;
  refund_amount?: number;
  
  // Dependencies
  dependent_on_booking?: string;    // booking_id this depends on
  dependents: string[];             // booking_ids that depend on this
  
  // Modifications
  modifications: BookingModification[];
  
  // Tracking
  created_at: ISO8601DateTime;
  updated_at: ISO8601DateTime;
  notes: string;
}

enum BookingType {
  ACCOMMODATION = "accommodation",  // Hotel, Airbnb, dorm
  TRANSPORTATION = "transportation", // Flight, bus, car rental
  ACTIVITY = "activity",            // Tour, restaurant, adventure
  MEAL = "meal",                    // Group dinner, breakfast
  OTHER = "other"
}

enum BookingPaymentStatus {
  NOT_PAID = "not_paid",           // No payment sent yet
  PARTIALLY_PAID = "partially_paid", // Some payment sent
  PAID_IN_FULL = "paid_in_full",   // Full payment sent
  AWAITING_CONFIRMATION = "awaiting_confirmation", // Paid but unconfirmed
  OVERPAID = "overpaid",           // Paid more than owed
  REFUND_PENDING = "refund_pending" // Awaiting refund from vendor
}

enum BookingStatus {
  DRAFT = "draft",                 // Not yet confirmed with vendor
  REQUESTED = "requested",         // Confirmation requested
  CONFIRMED = "confirmed",         // Vendor confirmed
  MODIFIED = "modified",           // Changes made after confirmation
  CANCELLED = "cancelled",         // Cancelled with vendor
  COMPLETED = "completed",         // Trip/activity complete
  DISPUTE = "dispute"              // Issue with vendor/booking
}

interface ShareCalculation {
  model: CostAllocationModel;
  base_share: number;              // Before any adjustments
  participation_weight?: number;   // Days/nights/units they're involved in
  multiplier?: number;             // Tiered pricing multiplier
  final_share: number;
}

enum CostAllocationModel {
  EQUAL = "equal",
  WEIGHTED_NIGHTS = "weighted_nights",
  WEIGHTED_QUANTITY = "weighted_quantity",
  OCCUPANCY_BASED = "occupancy_based",
  CONSUMPTION_ONLY = "consumption_only",
  CUSTOM_FIXED = "custom_fixed"
}

interface BookingModification {
  id: string;
  modification_date: ISO8601DateTime;
  type: ModificationType;
  previous_value: any;
  new_value: any;
  reason: string;
  cost_impact: number;            // Positive = increase, negative = decrease
  approved_by: string;            // participant_id or organizer_id
  status: ModificationStatus;
}

enum ModificationType {
  DATE_CHANGE = "date_change",
  QUANTITY_CHANGE = "quantity_change",
  ROOM_UPGRADE = "room_upgrade",
  ROOM_DOWNGRADE = "room_downgrade",
  ACTIVITY_SWAP = "activity_swap",
  PARTICIPANT_ADD = "participant_add",
  PARTICIPANT_REMOVE = "participant_remove"
}

enum ModificationStatus {
  PENDING = "pending",             // Awaiting vendor confirmation
  CONFIRMED = "confirmed",         // Vendor confirmed modification
  REJECTED = "rejected",           // Vendor rejected modification
  ROLLED_BACK = "rolled_back"      // Modification reversed
}
```

---

### 1.4 Payment Model
```typescript
interface Payment {
  id: string;
  trip_id: string;
  
  // Who Paid Whom
  payer_id: string;                // Participant who made payment
  payee_id: string;                // Who receives payment (organizer or another participant)
  
  // Payment Details
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  payment_app: PaymentApp?;        // If via external app
  transaction_id?: string;         // From external app
  
  // Allocation
  allocated_to: {                  // What booking(s) this payment covers
    booking_id: string;
    amount: number;
  }[];
  
  // Status
  status: PaymentStatus;
  payment_date: ISO8601DateTime;
  confirmation_date?: ISO8601DateTime;
  failure_reason?: string;
  
  // Tracking
  receipt_uploaded?: boolean;
  receipt_url?: string;
  notes: string;
  
  // Disputes
  disputed: boolean;
  dispute_reason?: string;
  dispute_status?: DisputeStatus;
  
  created_at: ISO8601DateTime;
  updated_at: ISO8601DateTime;
}

enum PaymentStatus {
  INITIATED = "initiated",         // Payment request sent
  PENDING = "pending",             // Awaiting user confirmation
  COMPLETED = "completed",         // Payment received
  FAILED = "failed",               // Payment failed
  CANCELLED = "cancelled",         // Payment cancelled by payer
  REFUNDING = "refunding",         // Refund in process
  REFUNDED = "refunded",           // Refund completed
  CHARGEBACK = "chargeback"        // Payment disputed/chargebacked
}

enum PaymentApp {
  VENMO = "venmo",
  PAYPAL = "paypal",
  SQUARE_CASH = "square_cash",
  GOOGLE_PAY = "google_pay",
  APPLE_PAY = "apple_pay",
  BANK_TRANSFER = "bank_transfer",
  CHECK = "check",
  CRYPTO = "crypto",
  OTHER = "other"
}

enum DisputeStatus {
  PENDING_REVIEW = "pending_review",
  INVESTIGATING = "investigating",
  RESOLVED = "resolved",
  ESCALATED = "escalated"
}

interface Refund {
  id: string;
  trip_id: string;
  original_payment_id: string;
  booking_id?: string;             // If refund tied to booking
  
  refund_reason: RefundReason;
  refund_trigger: RefundTrigger;
  
  refund_amount: number;
  refund_method: PaymentMethod;
  refund_date_processed: ISO8601DateTime;
  refund_status: PaymentStatus;      // INITIATED, COMPLETED, FAILED, PENDING
  
  initiated_by: string;              // participant_id or organizer_id
  approved_by?: string;              // If required approval
  
  created_at: ISO8601DateTime;
  updated_at: ISO8601DateTime;
}

enum RefundReason {
  BOOKING_CANCELLED = "booking_cancelled",
  PARTICIPANT_WITHDREW = "participant_withdrew",
  OVERPAYMENT = "overpayment",
  VENDOR_ERROR = "vendor_error",
  ORGANIZER_DISCRETION = "organizer_discretion",
  PARTIAL_REFUND_FROM_VENDOR = "partial_refund_from_vendor",
  INSURANCE_CLAIM = "insurance_claim"
}

enum RefundTrigger {
  BOOKING_CANCELLATION = "booking_cancellation",
  PARTICIPANT_DEPARTURE = "participant_departure",
  COST_RECALCULATION = "cost_recalculation",
  DISPUTE_RESOLUTION = "dispute_resolution",
  FORCE_MAJEURE = "force_majeure"
}
```

---

### 1.5 Ledger Entry Model
```typescript
interface LedgerEntry {
  id: string;
  trip_id: string;
  
  // Transaction
  entry_type: LedgerEntryType;
  entry_date: ISO8601DateTime;
  
  // Parties Involved
  participant_id: string;          // Person's account being updated
  operator_id: string;             // Who caused this entry (organizer, system, etc.)
  
  // Amount
  debit: number;                   // Amount they owe
  credit: number;                  // Amount they've paid / owed to them
  balance_after: number;           // Running balance
  
  // Reference
  booking_id?: string;
  payment_id?: string;
  refund_id?: string;
  
  // Description & Notes
  description: string;
  notes?: string;
  
  // Metadata
  affected_booking_ids: string[];  // All bookings affected by this entry
  recalculation_trigger?: string;  // Why was balance recalculated?
  
  created_at: ISO8601DateTime;
}

enum LedgerEntryType {
  BOOKING_ASSIGNED = "booking_assigned",     // Participant added to booking
  BOOKING_REMOVED = "booking_removed",       // Participant removed from booking
  BOOKING_COST_ADJUSTED = "booking_cost_adjusted",
  COST_SHARE_RECALCULATED = "cost_share_recalculated",
  PAYMENT_RECORDED = "payment_recorded",
  REFUND_ISSUED = "refund_issued",
  OVERPAYMENT_CREDITED = "overpayment_credited",
  ROUNDING_ADJUSTMENT = "rounding_adjustment",
  MANUAL_ADJUSTMENT = "manual_adjustment",
  DISPUTE_HOLD = "dispute_hold",
  SETTLEMENT_FINALIZED = "settlement_finalized"
}
```

---

## PART 2: CALCULATION ALGORITHMS

### 2.1 Cost Allocation Algorithm
```typescript
function calculateParticipantShare(
  booking: Booking,
  participant: Participant,
  participants: Participant[],
  trip: Trip
): {
  share: number;
  breakdown: string;
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  let share = 0;
  let breakdown = "";
  
  // Step 1: Validate participant is assigned
  const assignment = booking.assigned_participants.find(
    a => a.participant_id === participant.id
  );
  if (!assignment) {
    errors.push(`Participant ${participant.id} not assigned to booking ${booking.id}`);
    return { share: 0, breakdown: "ERROR: Not assigned", valid: false, errors };
  }
  
  // Step 2: Validate participant is within trip date range
  if (participant.arrival_date > booking.end_date || 
      participant.departure_date < booking.start_date) {
    errors.push(`Participant dates (${participant.arrival_date} - ${participant.departure_date}) don't overlap booking (${booking.start_date} - ${booking.end_date})`);
    return { share: 0, breakdown: "ERROR: Date mismatch", valid: false, errors };
  }
  
  // Step 3: Apply allocation model
  const assignedParticipants = booking.assigned_participants.length;
  
  switch (booking.allocation_model) {
    case CostAllocationModel.EQUAL:
      share = booking.total_cost / assignedParticipants;
      breakdown = `Total $${booking.total_cost} ÷ ${assignedParticipants} participants`;
      break;
      
    case CostAllocationModel.WEIGHTED_NIGHTS:
      const participantNights = calculateOverlapNights(
        participant.arrival_date,
        participant.departure_date,
        booking.start_date,
        booking.end_date
      );
      const totalNights = booking.assigned_participants.reduce((sum, a) => {
        const p = participants.find(x => x.id === a.participant_id);
        const nights = calculateOverlapNights(
          p!.arrival_date, p!.departure_date,
          booking.start_date, booking.end_date
        );
        return sum + nights;
      }, 0);
      share = (booking.total_cost / totalNights) * participantNights;
      breakdown = `(${participantNights} nights ÷ ${totalNights} total nights) × $${booking.total_cost}`;
      break;
      
    case CostAllocationModel.TIERED:
      const tierTotal = booking.assigned_participants.reduce((sum, a) => {
        const p = participants.find(x => x.id === a.participant_id);
        return sum + (p?.tier_multiplier || 1);
      }, 0);
      const multiplier = participant.tier_multiplier || 1;
      share = (booking.total_cost / tierTotal) * multiplier;
      breakdown = `(Multiplier ${multiplier} ÷ Total multiplier ${tierTotal}) × $${booking.total_cost}`;
      break;
      
    case CostAllocationModel.OCCUPANCY_BASED:
      const roommates = booking.assigned_participants.filter(
        a => a.quantity === assignment.quantity // Same room/vehicle
      );
      share = booking.total_cost / roommates.length;
      breakdown = `Room cost $${booking.total_cost} ÷ ${roommates.length} roommates`;
      break;
      
    case CostAllocationModel.CONSUMPTION_ONLY:
      // Only participants who explicitly marked "attending"
      const attendees = booking.assigned_participants.length;
      share = booking.total_cost / attendees;
      breakdown = `${attendees} participants attended; cost $${booking.total_cost}`;
      break;
      
    case CostAllocationModel.CUSTOM_FIXED:
      share = assignment.final_share;
      breakdown = `Custom fixed amount: $${share}`;
      break;
      
    default:
      errors.push(`Unknown allocation model: ${booking.allocation_model}`);
      return { share: 0, breakdown: "ERROR: Unknown model", valid: false, errors };
  }
  
  // Step 4: Apply rounding
  share = roundAmount(share, trip.rounding_method);
  breakdown += ` = $${share.toFixed(2)} (after rounding)`;
  
  // Step 5: Validate
  if (share < 0) {
    errors.push(`Calculated share is negative: $${share}`);
    return { share, breakdown, valid: false, errors };
  }
  
  return { share, breakdown, valid: true, errors };
}

function roundAmount(amount: number, method: RoundingMethod): number {
  switch (method) {
    case RoundingMethod.BANKER:
      // Round to nearest cent; ties go to even
      return Math.round(amount * 100) / 100;
    case RoundingMethod.LAST_PERSON:
      // Don't round here; handle separately
      return Math.floor(amount * 100) / 100;
    case RoundingMethod.EQUAL_DISTRIBUTION:
      return Math.round(amount * 100) / 100;
    default:
      return Math.round(amount * 100) / 100;
  }
}

function calculateOverlapNights(
  arrivalA: string, departureA: string,
  arrivalB: string, departureB: string
): number {
  const start = new Date(Math.max(
    new Date(arrivalA).getTime(),
    new Date(arrivalB).getTime()
  ));
  const end = new Date(Math.min(
    new Date(departureA).getTime(),
    new Date(departureB).getTime()
  ));
  
  if (start >= end) return 0;
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}
```

---

### 2.2 Settlement Calculation Algorithm
```typescript
interface Settlement {
  trip_id: string;
  settlement_date: ISO8601DateTime;
  
  participant_balances: {
    participant_id: string;
    name: string;
    total_owed: number;
    total_paid: number;
    net_balance: number;  // Positive = owes money; Negative = owed refund
  }[];
  
  transactions_required: {
    from_participant: string;
    to_participant: string;
    amount: number;
    reason: string;
  }[];
  
  validation_errors: string[];
  is_balanced: boolean;  // Sum of all balances = 0
}

function calculateSettlement(trip: Trip, participants: Participant[]): Settlement {
  const settlement: Settlement = {
    trip_id: trip.id,
    settlement_date: new Date().toISOString(),
    participant_balances: [],
    transactions_required: [],
    validation_errors: []
  };
  
  // Step 1: Calculate balances
  let totalOwed = 0;
  let totalPaid = 0;
  
  for (const participant of participants) {
    const balance = {
      participant_id: participant.id,
      name: participant.name,
      total_owed: participant.total_owed,
      total_paid: participant.total_paid,
      net_balance: participant.total_owed - participant.total_paid
    };
    
    settlement.participant_balances.push(balance);
    totalOwed += balance.total_owed;
    totalPaid += balance.total_paid;
  }
  
  // Step 2: Validate balance
  const balanceDifference = Math.abs(totalOwed - totalPaid);
  if (balanceDifference > 0.01) {
    settlement.validation_errors.push(
      `Balance mismatch: Total owed $${totalOwed.toFixed(2)} ≠ Total paid $${totalPaid.toFixed(2)}`
    );
  }
  
  // Step 3: Determine required transactions (greedy algorithm)
  const debtors = settlement.participant_balances
    .filter(b => b.net_balance > 0.01)
    .sort((a, b) => b.net_balance - a.net_balance);
  
  const creditors = settlement.participant_balances
    .filter(b => b.net_balance < -0.01)
    .sort((a, b) => a.net_balance - b.net_balance);
  
  for (const debtor of debtors) {
    let remaining = debtor.net_balance;
    
    for (const creditor of creditors) {
      if (remaining <= 0.01) break;
      
      const transfer = Math.min(remaining, -creditor.net_balance);
      if (transfer > 0.01) {
        settlement.transactions_required.push({
          from_participant: debtor.participant_id,
          to_participant: creditor.participant_id,
          amount: transfer,
          reason: `Settlement for trip ${trip.id}`
        });
        
        remaining -= transfer;
        creditor.net_balance += transfer;
      }
    }
  }
  
  // Step 4: Final validation
  const finalBalance = settlement.participant_balances.reduce((sum, b) => sum + b.net_balance, 0);
  settlement.is_balanced = Math.abs(finalBalance) < 0.01;
  
  return settlement;
}
```

---

### 2.3 Participant Departure Recalculation
```typescript
function recalculateAfterDeparture(
  trip: Trip,
  departingParticipant: Participant,
  departureDate: ISO8601Date,
  affectedBookings: Booking[]
): {
  updated_bookings: Booking[];
  participant_refund: number;
  error_messages: string[];
} {
  const results = {
    updated_bookings: [] as Booking[],
    participant_refund: 0,
    error_messages: [] as string[]
  };
  
  for (const booking of affectedBookings) {
    // Check if this booking ends before departure date
    if (new Date(booking.end_date) <= new Date(departureDate)) {
      // Participant was part of entire booking; no change
      results.updated_bookings.push(booking);
      continue;
    }
    
    // Booking extends past departure date
    if (new Date(booking.start_date) >= new Date(departureDate)) {
      // Booking entirely after departure; remove participant
      const updatedAssignments = booking.assigned_participants.filter(
        a => a.participant_id !== departingParticipant.id
      );
      
      if (updatedAssignments.length === 0) {
        results.error_messages.push(
          `Booking ${booking.id} has no remaining participants after removal`
        );
      }
      
      // Recalculate all participants' shares
      const newTotalOwed = booking.total_cost;
      const costPerParticipant = newTotalOwed / updatedAssignments.length;
      
      booking.assigned_participants = updatedAssignments.map(a => ({
        ...a,
        amount_owed: costPerParticipant
      }));
      
      // Refund departing participant's share
      const oldShare = booking.total_cost / (updatedAssignments.length + 1);
      results.participant_refund += oldShare;
      
      results.updated_bookings.push(booking);
      continue;
    }
    
    // Booking spans departure date; split calculation
    const daysBeforeDeparture = calculateOverlapNights(
      booking.start_date,
      departureDate,
      booking.start_date,
      booking.end_date
    );
    const totalDays = calculateOverlapNights(
      booking.start_date,
      booking.end_date,
      booking.start_date,
      booking.end_date
    );
    
    const participantCostBeforeDeparture = 
      (booking.total_cost / totalDays) * daysBeforeDeparture / 
      booking.assigned_participants.length;
    
    // Recalculate for remaining participants (after departure)
    const daysAfterDeparture = totalDays - daysBeforeDeparture;
    const remainingParticipants = booking.assigned_participants.filter(
      a => a.participant_id !== departingParticipant.id
    );
    
    const costAfterDeparture = 
      (booking.total_cost / totalDays) * daysAfterDeparture;
    const costPerRemainingParticipant = 
      costAfterDeparture / remainingParticipants.length;
    
    // Update booking with split costs
    booking.assigned_participants = remainingParticipants.map(a => ({
      ...a,
      amount_owed: participantCostBeforeDeparture + costPerRemainingParticipant
    }));
    
    results.updated_bookings.push(booking);
    
    // Participant refund for days after departure
    const refundAmount = (booking.total_cost / totalDays) * daysAfterDeparture / 
                        (remainingParticipants.length + 1);
    results.participant_refund += refundAmount;
  }
  
  return results;
}
```

---

## PART 3: VALIDATION RULES

```typescript
interface ValidationRule {
  id: string;
  name: string;
  check: (data: any) => boolean;
  errorMessage: string;
}

const VALIDATION_RULES: ValidationRule[] = [
  {
    id: "cost_conservation",
    name: "Cost Conservation",
    check: (booking: Booking) => {
      const sum = booking.assigned_participants.reduce(
        (total, a) => total + a.amount_owed, 0
      );
      return Math.abs(sum - booking.total_cost) < 0.01;
    },
    errorMessage: "Sum of participant shares must equal booking total cost"
  },
  
  {
    id: "participant_date_overlap",
    name: "Participant-Booking Date Overlap",
    check: (participant: Participant, booking: Booking) => {
      return participant.arrival_date <= booking.end_date &&
             participant.departure_date >= booking.start_date;
    },
    errorMessage: "Participant's stay must overlap with booking dates"
  },
  
  {
    id: "positive_share",
    name: "Positive Share Amount",
    check: (share: number) => share >= 0,
    errorMessage: "Participant share cannot be negative"
  },
  
  {
    id: "no_duplicate_payment",
    name: "No Duplicate Payment",
    check: (payment: Payment, existingPayments: Payment[]) => {
      return !existingPayments.some(p =>
        p.payer_id === payment.payer_id &&
        p.amount === payment.amount &&
        Math.abs(new Date(p.payment_date).getTime() - 
                 new Date(payment.payment_date).getTime()) < 60000 // Within 60 seconds
      );
    },
    errorMessage: "Duplicate payment detected"
  },
  
  {
    id: "payment_before_refund",
    name: "Payment Before Refund",
    check: (booking: Booking) => {
      return booking.amount_paid > 0 || booking.status !== BookingStatus.CONFIRMED;
    },
    errorMessage: "Cannot refund booking that hasn't been paid"
  },
  
  {
    id: "sequential_dates",
    name: "Sequential Dates",
    check: (trip: Trip) => {
      return new Date(trip.start_date) <= new Date(trip.end_date);
    },
    errorMessage: "Trip start date must be before end date"
  }
];
```

---

## PART 4: STATE TRANSITION RULES

```typescript
interface StateTransition {
  from: string;
  to: string;
  preconditions: Precondition[];
  side_effects: SideEffect[];
}

interface Precondition {
  check: (currentState: any) => boolean;
  errorMessage: string;
}

interface SideEffect {
  execute: (state: any) => void;
  description: string;
}

const BOOKING_STATE_TRANSITIONS: StateTransition[] = [
  {
    from: BookingStatus.DRAFT,
    to: BookingStatus.REQUESTED,
    preconditions: [
      {
        check: (booking: Booking) => booking.assigned_participants.length > 0,
        errorMessage: "Booking must have at least one participant"
      },
      {
        check: (booking: Booking) => booking.total_cost > 0,
        errorMessage: "Booking must have cost"
      }
    ],
    side_effects: [
      {
        execute: (booking: Booking) => {
          booking.updated_at = new Date().toISOString();
        },
        description: "Update timestamp"
      }
    ]
  },
  
  {
    from: BookingStatus.CONFIRMED,
    to: BookingStatus.CANCELLED,
    preconditions: [
      {
        check: (booking: Booking) => {
          const now = new Date();
          const cancelDeadline = new Date(booking.cancellation_deadline);
          return now < cancelDeadline;
        },
        errorMessage: "Cancellation deadline passed; cannot cancel"
      }
    ],
    side_effects: [
      {
        execute: (booking: Booking, trip: Trip) => {
          booking.cancellation_date = new Date().toISOString();
          trip.total_cost_actual -= booking.total_cost;
        },
        description: "Mark as cancelled; adjust trip total"
      }
    ]
  },
  
  {
    from: BookingStatus.CANCELLED,
    to: BookingStatus.CONFIRMED,
    preconditions: [
      {
        check: (booking: Booking) => booking.refund_received_date === null,
        errorMessage: "Cannot confirm booking that was refunded"
      }
    ],
    side_effects: [
      {
        execute: (booking: Booking) => {
          booking.cancellation_date = null;
          booking.cancellation_reason = null;
        },
        description: "Clear cancellation details"
      }
    ]
  }
];

const PARTICIPANT_STATE_TRANSITIONS: StateTransition[] = [
  {
    from: ParticipantStatus.PROVISIONAL,
    to: ParticipantStatus.CONFIRMED,
    preconditions: [],
    side_effects: [
      {
        execute: (participant: Participant) => {
          participant.status = ParticipantStatus.CONFIRMED;
        },
        description: "Confirm participation"
      }
    ]
  },
  
  {
    from: ParticipantStatus.CONFIRMED,
    to: ParticipantStatus.DEPARTED,
    preconditions: [
      {
        check: (participant: Participant) => {
          return new Date() >= new Date(participant.departure_date);
        },
        errorMessage: "Departure date has not been reached"
      }
    ],
    side_effects: [
      {
        execute: (participant: Participant, trip: Trip) => {
          // Trigger cost recalculation
          // Trigger refund processing
        },
        description: "Process early departure"
      }
    ]
  }
];
```

---

## PART 5: API ENDPOINTS (Example REST)

```typescript
// Trips
POST   /api/v1/trips                           // Create trip
GET    /api/v1/trips/:tripId                   // Get trip details
PUT    /api/v1/trips/:tripId                   // Update trip
DELETE /api/v1/trips/:tripId                   // Cancel trip

// Participants
POST   /api/v1/trips/:tripId/participants      // Add participant
GET    /api/v1/trips/:tripId/participants      // List participants
PUT    /api/v1/trips/:tripId/participants/:pid // Update participant
DELETE /api/v1/trips/:tripId/participants/:pid // Remove participant

// Bookings
POST   /api/v1/trips/:tripId/bookings          // Create booking
GET    /api/v1/trips/:tripId/bookings          // List bookings
PUT    /api/v1/trips/:tripId/bookings/:bid     // Update booking
DELETE /api/v1/trips/:tripId/bookings/:bid     // Cancel booking

// Payments
POST   /api/v1/trips/:tripId/payments          // Record payment
GET    /api/v1/trips/:tripId/payments          // List payments
POST   /api/v1/trips/:tripId/payments/:pid/dispute  // Dispute payment

// Refunds
POST   /api/v1/trips/:tripId/refunds           // Issue refund
GET    /api/v1/trips/:tripId/refunds           // List refunds

// Settlement
GET    /api/v1/trips/:tripId/settlement        // Calculate settlement
POST   /api/v1/trips/:tripId/settlement/finalize    // Finalize

// Ledger
GET    /api/v1/trips/:tripId/ledger            // View full ledger
GET    /api/v1/trips/:tripId/participants/:pid/ledger  // Participant ledger
```

This schema provides complete foundation for implementation. Each model includes validation, state transitions, and audit trails.
