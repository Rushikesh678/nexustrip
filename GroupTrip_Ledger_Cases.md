# GROUPTRIP LEDGER - COMPREHENSIVE CASE & EDGE CASE TAXONOMY

## SECTION 1: PARTICIPANT LIFECYCLE CASES

### 1.1 PRE-TRIP SCENARIOS

#### Case 1.1.1: Standard Participant Addition
- **Trigger:** Organizer adds participant to trip at creation
- **Action:** Participant assigned to all default bookings (accommodation, transportation)
- **Settlement:** Participant's share of base costs calculated immediately
- **Validation:** No payment due until participant has incurred costs

#### Case 1.1.2: Late Joiner (Mid-Planning)
- **Trigger:** New participant joins after some bookings locked
- **Precondition:** Some costs already incurred/paid
- **Action:** 
  - Determine which existing bookings apply to new participant
  - Recalculate shares for affected bookings
  - Calculate backdated owed amount
- **Settlement:** 
  - New participant owes proportional share of already-paid costs
  - Example: If 4 people paid $400 for hotel (trip days 1-5), and participant joins on day 2, they owe share for days 2-5 only
- **Edge Case:** Late joiner arrives after activity already happened

#### Case 1.1.3: Conditional Participation
- **Trigger:** Participant conditionally signs up (e.g., "if I can get time off")
- **Action:** Mark as "provisional" until confirmed
- **Settlement:** 
  - Provisional participants' costs flagged separately
  - If confirmed → merge into settlement
  - If declined → remove from all associated costs, adjust others' shares
- **Validation:** Provisional participants cannot make payments until confirmed

---

### 1.2 MID-TRIP DEPARTURES & REDUCTIONS

#### Case 1.2.1: Participant Leaves Trip Early
- **Trigger:** Participant departs before trip end
- **Precondition:** Some costs already paid, some still pending
- **Action:**
  - Identify all bookings participant was part of up to departure date
  - Identify all bookings after departure date
  - Remove participant from post-departure bookings
  - Recalculate remaining participants' shares
- **Settlement Scenarios:**
  - **Scenario A:** Participant has overpaid
    - Owed refund = overpaid amount
    - Refund source: organizer's account or pool
  - **Scenario B:** Participant underpaid
    - Participant must pay remaining balance before leaving
  - **Scenario C:** Participant paid via payment app already
    - Refund processed back to their payment method
- **Example:**
  - Group hotel: $2000 for 5 people × 5 nights = $400/person
  - Participant leaves after night 2: their share = $160
  - If they already paid $400, refund $240
- **Edge Case:** Participant leaves during shared transportation → fractional cost allocation

#### Case 1.2.2: Participant Removes from Single Activity (Not Leaving Trip)
- **Trigger:** Participant opts out of one activity but stays for others
- **Action:**
  - Remove only from specified activity booking
  - Keep in accommodation and other activities
  - Recalculate activity cost split among remaining participants
- **Settlement:**
  - If activity already paid: refund participant's share (minus any non-refundable portion)
  - If activity not yet paid: adjust participant's final owed amount
- **Validation:** Ensure participant not double-counted in remaining activities

#### Case 1.2.3: Participant "Ghosting" (No Communication)
- **Trigger:** Participant unresponsive, departure unclear
- **Action (Platform Default):**
  - Assume participant remains until trip end (conservative approach)
  - Flag in organizer dashboard as "status uncertain"
  - Send automated reminders at T-7, T-3, T-1 before trip
- **Settlement Hold:** Freeze this participant's settlement until confirmed departure/arrival

---

### 1.3 PARTICIPANT MODIFICATIONS

#### Case 1.3.1: Room/Transportation Changes
- **Trigger:** Participant wants different room, cabin, or transport option
- **Precondition:** Original booking already paid
- **Action:**
  - Calculate cost difference between original and new booking
  - If upgrade: participant pays difference
  - If downgrade: participant refunded difference
  - Update group's total booking cost if vendor charges changed
- **Settlement:**
  - Add/subtract difference from participant's owed balance
  - Recalculate other participants' shares if room/transport grouping affected
- **Example:**
  - Original: shared double room $400 (2 people)
  - Upgrade to single: $600
  - Participant owes extra $200
  - Remaining roommate's share may change if room now split between remaining people

#### Case 1.3.2: Activity Substitution
- **Trigger:** Participant swaps one activity for another (e.g., hiking → spa day)
- **Precondition:** Both activities have costs
- **Action:**
  - Remove from original activity cost split
  - Add to new activity cost split
  - Recalculate both activities' per-person shares
- **Settlement:**
  - Calculate cost difference
  - If new activity more expensive: participant pays difference
  - If new activity cheaper: participant refunded difference
  - If activity already paid: immediately settle difference

---

## SECTION 2: BOOKING & EXPENSE CASES

### 2.1 BOOKING CREATION & ASSIGNMENT

#### Case 2.1.1: All-Inclusive Booking (Everyone Participates)
- **Trigger:** Organizer creates booking applicable to entire group
- **Example:** Coach transportation, group accommodation
- **Action:** Auto-assign to all current participants
- **Settlement:** Divide total cost equally (or per agreed model)
- **Validation:** Confirm all participants meet booking requirements (e.g., passport validity for flights)

#### Case 2.1.2: Selective Booking (Subset of Participants)
- **Trigger:** Only some participants book activity/accommodation
- **Example:** Optional hiking, room preferences (2-bed vs 3-bed)
- **Action:** Organizer manually selects participants OR participants self-select
- **Settlement:** Only assigned participants share cost
- **Conflict Resolution:** If participant self-selects but group organizer wants different split, escalate to decision

#### Case 2.1.3: Layered Bookings (Dependent Bookings)
- **Trigger:** One booking depends on another (e.g., activity only available with accommodation at venue)
- **Action:**
  - Link bookings as dependent
  - If parent booking changes, flag all dependent bookings
  - Require explicit confirmation for dependent bookings
- **Settlement:** Treat as single cost block; proportional shares apply to entire block

#### Case 2.1.4: Dynamic Group Size (Late Discovery)
- **Trigger:** Booking created for 12 people, then organizer discovers only 10 joining
- **Precondition:** Booking already locked with vendor at group rate
- **Action:**
  - Recalculate per-person share across 10 instead of 12
  - Non-refundable "overage" cost: split among actual participants or organizer absorbs
- **Settlement:**
  - Example: Airbnb for 12 @ $1200 total (booked), actual 10 people
  - Option A: $1200 ÷ 10 = $120/person (rest absorbed by organizer or external sponsor)
  - Option B: $1200 ÷ 12 @ original + calculate "surplus" to redistribute

---

### 2.2 BOOKING CANCELLATIONS & MODIFICATIONS

#### Case 2.2.1: Full Booking Cancellation (Non-Refundable)
- **Trigger:** Organizer cancels entire booking (e.g., venue closed)
- **Precondition:** Booking was paid in full; non-refundable terms
- **Action:**
  - Mark booking as "CANCELLED - NON-REFUNDABLE"
  - Cost remains on ledger but flagged as "sunk cost"
  - Recalculate group's total trip cost to reflect sunk cost
- **Settlement:**
  - Sunk cost redistributed equally among all participants (default)
  - OR organizer absorbs
  - OR participants vote on redistribution
- **Decision Needed:** How to handle $0 recovered funds
- **Example:** 
  - $500 activity cancelled, no refund available
  - 5 participants: $500 ÷ 5 = $100 additional cost per person OR organizer eats loss

#### Case 2.2.2: Full Booking Cancellation (Refundable)
- **Trigger:** Organizer cancels; refund received from vendor
- **Action:**
  - Reverse all participant costs for booking
  - Credit refund back to group's payment pool
  - If refund < total paid: difference treated as sunk cost (see 2.2.1)
  - If refund > total paid: rare; typically not possible
- **Settlement:**
  - Full reversal of booking on all participants' accounts
  - Refund deposited to group account (organizer or settlement pool)
  - Participants' net settlement reduced accordingly

#### Case 2.2.3: Partial Cancellation (Reduce Group Size in Locked Booking)
- **Trigger:** Cancelling some participants' spots in oversized booking
- **Precondition:** Booking reserved for 12; only 8 spots being cancelled
- **Action:**
  - Determine if vendor allows partial cancellation
  - If yes: negotiate refund for 4 spots
  - If no: sunk cost for 4 seats + remaining 8 split full cost
- **Settlement:**
  - **Path A (Partial Refund Granted):**
    - Refund amount added to group pool
    - Remaining participants' share recalculated
    - Cancelled participants' accounts zeroed for that booking
  - **Path B (No Partial Refund):**
    - All 12 spots remain cost liability
    - 4 empty spots redistributed to 8 participants OR absorbed by organizer
- **Example:**
  - Flight for 12 people @ $5000
  - 4 people cancel, airline refunds $1200 (partial, with fees)
  - Remaining 8 people owe: ($5000 - $1200) ÷ 8 = $475/person

#### Case 2.2.4: Booking Modification (Dates Changed)
- **Trigger:** Organizer changes accommodation check-out date or flight departure time
- **Precondition:** Vendor allows modification; may incur change fees
- **Action:**
  - Vendor confirms new dates and any additional charges
  - Recalculate cost if date change affects price
  - Add/subtract modification fees to cost
  - Notify participants of change
- **Settlement:**
  - If cost increased: add difference to participants' owed amount
  - If cost decreased: credit difference back
  - If modification fees charged: determine if absorbed by organizer or participants
- **Validation:** Ensure all participants can attend modified dates

#### Case 2.2.5: Upgrade/Downgrade Within Booking
- **Trigger:** Organizer upgrades accommodation category or transportation class
- **Precondition:** Booking modifiable; cost difference known
- **Action:**
  - Vendor confirms upgrade/downgrade and new cost
  - Calculate cost delta
- **Settlement:**
  - Upgrade: participants pay additional amount
  - Downgrade: participants refunded amount
  - If split unevenly (some upgraded, some not): create two separate lines in ledger
- **Example:**
  - Original: 3-star hotel $90/person/night
  - Upgraded to 4-star: $110/person/night
  - All participants owe additional $20/night × 5 nights = $100 extra

---

### 2.3 PAYMENT RECORDING & TRACKING

#### Case 2.3.1: Organizer Pays for Booking Upfront
- **Trigger:** Organizer pays vendor from personal account before trip
- **Action:**
  - Record payment in system with amount, date, booking, payment method
  - Mark participants' balances as "owed to organizer"
  - Calculate each participant's share
- **Settlement:**
  - Each participant owed their proportional share
  - Participants reimburse organizer (via platform or external)
  - Organizer's account in system zeroed after receiving reimbursements
- **Tracking:** Link payment receipt to booking for audit trail

#### Case 2.3.2: Participant Pays (Not Organizer)
- **Trigger:** Participant A books and pays for shared activity on behalf of group
- **Action:**
  - Record payment under Participant A's name
  - Mark other participants as owing to Participant A (not organizer)
- **Settlement:**
  - Other participants owe Participant A their share
  - Participant A's account credited with reimbursements
  - Final settlement: Participant A pays organizer if any group-level costs remain

#### Case 2.3.3: Multiple Advance Payments (Pre-Trip)
- **Trigger:** Over time, different participants pay different amounts for different bookings
- **Example:**
  - Week 1: Participant A pays $500 for flights
  - Week 2: Organizer pays $800 for hotel
  - Week 3: Participant B pays $200 for activities
- **Action:** Record each payment separately; track who paid what
- **Settlement:**
  - Calculate final per-person owed amount
  - Compare to what each person has already paid
  - Settle differences at trip end or before departure
- **Validation:** Prevent double-payments (same participant paying same cost twice)

#### Case 2.3.4: Payment App Integration (Venmo, PayPal, etc.)
- **Trigger:** Participants settle via external payment app
- **Action:**
  - Record payment in system manually (or via API if integrated)
  - Mark as "settled via [app]"
  - Optional: request receipt upload for audit trail
- **Settlement:**
  - Track payment status (pending, completed, failed)
  - If payment failed: flag in organizer dashboard, resend payment request
  - Link payment to specific booking/participant owed amount

#### Case 2.3.5: Payment Made But Booking Not Yet Confirmed
- **Trigger:** Participant pays organizer, but vendor booking not locked
- **Precondition:** Payment in system; booking in draft state
- **Action:** Flag as "risky" - payment recorded but dependent on booking confirmation
- **Risk:** If booking fails (vendor cancels), payment becomes refundable
- **Settlement:**
  - Only consider payment "safe" after vendor confirmation
  - If booking fails: refund participant immediately and mark as "booking failed - refund issued"

#### Case 2.3.6: Overpayment Detection
- **Trigger:** Participant pays more than their calculated share
- **Example:** Participant pays $500 but owes only $400
- **Action:**
  - System flags as "overpayment: $100"
  - Two options presented to organizer:
    - A) Refund overpayment to participant
    - B) Credit overpayment to future trip expenses (if applicable)
- **Settlement:**
  - Default: refund overpayment
  - Only credit forward if participant explicitly consents

#### Case 2.3.7: Underpayment Detection
- **Trigger:** Participant pays less than their calculated share
- **Example:** Participant pays $300 but owes $400
- **Action:**
  - System flags as "underpayment: $100"
  - Organizer notification sent
  - Participant flagged for follow-up before trip departure
- **Settlement:**
  - Underpayment only acceptable if approved by organizer in writing
  - Default: payment rejected, request full amount

#### Case 2.3.8: Payment Reversal (Refund Request Post-Payment)
- **Trigger:** Participant paid but now wants refund (e.g., can't attend after all)
- **Precondition:** Payment already received and possibly transferred to vendor
- **Action:**
  - If payment not yet used: full reversal possible
  - If payment used (vendor already charged): check vendor cancellation policy
- **Settlement:**
  - Refund to participant depends on vendor refund policy
  - If vendor non-refundable: participant absorbs loss OR organizer absorbs
  - If vendor refundable: participant gets full refund
- **Timing:** Clarify when refund is processed (immediate vs. after trip vs. per vendor)

---

## SECTION 3: COST-SHARING & ALLOCATION CASES

### 3.1 STANDARD COST-SHARING MODELS

#### Case 3.1.1: Equal Split (Most Common)
- **Model:** All participants share cost equally
- **Example:** $1000 accommodation ÷ 5 people = $200/person
- **When to Use:** Common costs with equal benefit (transportation, group meal)
- **Edge Case:** Odd participant counts (see 3.1.6)
- **Settlement:** Simple per-person calculation; rounding rules apply (see 3.1.6)

#### Case 3.1.2: Participant-Weighted Split
- **Model:** Participants contribute based on # of nights, days, or meals involved
- **Example:**
  - Accommodation: 5 people × 5 nights ÷ total night-units
  - Person A: 5 nights = 5 units
  - Person B: 3 nights = 3 units (left early)
  - Total: 23 units; $1000 ÷ 23 = $43.48/unit
  - Person A owes: $43.48 × 5 = $217.40
  - Person B owes: $43.48 × 3 = $130.44
- **Validation:** Participants must have defined duration in system
- **Recalculation Trigger:** Participant leaves early or joins late

#### Case 3.1.3: Occupancy-Based Split (Rooms/Transportation)
- **Model:** Cost split by actual occupancy, not people count
- **Example:**
  - 2-bedroom house: $600 total
  - Room A: 3 people → $300 ÷ 3 = $100/person
  - Room B: 2 people → $300 ÷ 2 = $150/person
- **Setup Requirement:** Define rooms/units and assign participants
- **Recalculation:** If person moves rooms, both rooms' per-person cost updates
- **Complex Case:** Shared common areas
  - Solution: Split common area cost equally, then add room-specific costs

#### Case 3.1.4: Consumption-Based Split (Meals, Activities)
- **Model:** Only participants consuming service pay
- **Example:**
  - Group breakfast: 5 people attend, 2 opt out
  - $80 breakfast ÷ 5 = $16/person (not 7)
- **Tracking:** Explicit opt-in/out required for consumption costs
- **Validation:** Prevent participant from being charged for activity they didn't attend
- **Settlement:** Clear separation between fixed costs (accommodation) and variable costs (activities)

#### Case 3.1.5: Tiered Cost-Sharing (By Income or Role)
- **Model:** Participants pay different percentages (e.g., students pay 50%, full-time workers pay 100%)
- **Setup:** Organizer defines tiers; assigns participants to tiers
- **Example:**
  - Tier 1 (Students): 50% of average share
  - Tier 2 (Full-time): 100% of average share
  - Tier 3 (Wealthy benefactor): 150% of average share
  - $1000 cost, 5 people (1 benefactor, 2 full-time, 2 students)
  - Average share: $1000 ÷ 5 = $200
  - Benefactor: $200 × 1.5 = $300
  - Full-time: $200 × 1.0 = $200 (each)
  - Students: $200 × 0.5 = $100 (each)
  - Total: $300 + $200 + $200 + $100 + $100 = $900 (shortfall)
  - **Resolution:** Either increase everyone's percentage or benefactor pays $200 more
- **Ethical Note:** Transparent consent required from all participants

#### Case 3.1.6: Rounding & Micro-Payments
- **Problem:** $100 ÷ 3 people = $33.333...
- **Solution Options:**
  - Option A: Round each person's share (may create $0.01-$0.02 surpluses)
  - Option B: Round down everyone, last person pays difference
  - Option C: Banker's rounding (round to nearest cent)
- **Default Recommendation:** Option B (transparent "last person adjustment")
- **Settlement Ledger:**
  - Person A: $33.33
  - Person B: $33.33
  - Person C: $33.34 (absorbs difference)
- **Validation:** Total must equal original cost exactly

---

### 3.2 COMPLEX COST-SHARING SCENARIOS

#### Case 3.2.1: Shared Accommodation Upgrade (Room Preferences)
- **Scenario:**
  - Base accommodation: 3-bed room, $300/night ($100/person)
  - Room upgrade option: suite with ensuite bathrooms, +$75/night
  - 3 people want upgrade; 2 prefer base room
- **Settlement:**
  - Base room (2 people): $300 ÷ 2 = $150/person
  - Upgrade room (3 people): ($300 + $75) ÷ 3 = $125/person
  - Total cost distributed: $300 + $375 = $675 ✓
- **Negotiation Case:** If total accommodation budget fixed at $600, upgrade requires either:
  - All 5 people pay additional $15 each, OR
  - Only 3 people splitting upgrade cost, others split base cost as above
- **Recalculation:** If one person in upgrade room leaves, cost recalculated to remaining 2 in that room

#### Case 3.2.2: Activity with Tiered Pricing
- **Scenario:**
  - Group activity: $200 total for up to 6 people
  - 7 people want to attend
  - Vendor says: must pay for 2 slots @ 2 different times (5 people @ $100, then 2 people @ additional time)
- **Options:**
  - Option A: Split among all 7 (some attend off-peak)
  - Option B: Only 5 people attend peak time (2 people find alternative activity)
- **Settlement:**
  - If all attend: $200 ÷ 7 = $28.57/person for 5 people, $200 ÷ 2 = $100/person for 2 people (different times)
  - This creates unequal cost for same activity (time-based pricing)
  - Resolution: Document why cost differs; ensure participants aware

#### Case 3.2.3: Shared Meal with Dietary Restrictions (Different Prices)
- **Scenario:**
  - Group dinner: 8 people booked
  - 3 people with dietary restrictions at specialized restaurant, $25/person
  - 5 people at standard restaurant, $15/person
  - Both parts of organized meal
- **Settlement Option A (Equal Share):**
  - Total cost: (3 × $25) + (5 × $15) = $75 + $75 = $150
  - Per-person: $150 ÷ 8 = $18.75 (everyone pays same despite different meal)
- **Settlement Option B (Proportional):**
  - Each person pays their own meal cost (no group share)
  - Dietary restriction people pay $25; others pay $15
  - Undermines "group meal" concept but more economically fair
- **Recommendation:** Use Option A for group bonding costs; Option B for personal preferences
- **Ethical:** Dietary restrictions should not result in higher cost for those individuals

#### Case 3.2.4: Transportation with Variable Occupancy
- **Scenario:**
  - Charter bus: $1000 for round-trip, 20 seats max
  - Only 12 people attend
  - 2 people drop out day 1 after paying
  - 3 people join halfway through trip
- **Calculation Complexity:**
  - Base: $1000 ÷ 12 = $83.33/person
  - 2 people who dropped out: Do they still owe full share? Partial?
  - 3 people who joined halfway: Do they owe half? Proportional to days/km traveled?
- **Solutions:**
  - Time-proportional: Each person pays for days they rode
  - Distance-proportional: Each person pays for km they rode
  - Fixed cost + usage fee: $400 flat split, $600 usage-based
- **Recommendation:** Establish policy at booking time, not during trip

#### Case 3.2.5: Group Discount Leverage (One Booking, Multiple Rates)
- **Scenario:**
  - Activity company offers: 5+ people @ 20% discount
  - 10 people sign up, but 3 are "floating" (uncertain)
  - Only 7 confirmed; 3 floating
  - If book for 10, get discount; if only 7, no discount
- **Options:**
  - Option A: Book for 10, include floating people, hope they join
  - Option B: Book for 7 only, exclude floating people
  - Option C: Book for 10, floating people pay premium to cover risk
- **Settlement:**
  - **If Option A & all 10 attend:** $discount_price × 10 ÷ 10
  - **If Option A & only 7 attend:** 
    - $discount_price applies to booking (paid for 10)
    - $discount_price × 10 ÷ 7 = higher per-person cost (pay for 10, have 7)
    - Organizer absorbs cost of 3 empty seats
  - **If Option C:** Floating people pay (discount_price + premium) to offset risk
- **Recommendation:** Only include certain participants in discount calculation

---

## SECTION 4: REFUND & DISPUTE CASES

### 4.1 REFUND SCENARIOS

#### Case 4.1.1: Vendor Refund Received (In Full)
- **Trigger:** Booking cancelled by organizer; vendor refunds entire amount
- **Precondition:** Group has paid vendor already
- **Settlement Sequence:**
  1. Vendor refund received in organizer's account
  2. Reverse all participant balances for that booking
  3. Optionally: credit refund back to participants (if separately paid), or roll into trip credit
- **Timing:** Immediate (if same-day processing) or within 5-7 business days
- **Ledger Entry:** 
  - Original: "+$1000 Hotel booking (assigned to 5 people, $200 each)"
  - Refund: "-$1000 Hotel booking - REFUNDED"
  - Participant balances: All debits for $200 removed

#### Case 4.1.2: Vendor Refund Received (Partial)
- **Trigger:** Cancellation with fees; vendor refunds less than paid
- **Example:** 
  - Paid: $1000
  - Refunded: $800 (20% cancellation fee)
  - Shortfall: $200
- **Settlement Options:**
  - Option A: Participants refunded $800 ÷ 5 = $160/person; $200 loss absorbed by organizer
  - Option B: Participants refunded $1000 ÷ 5 = $200/person; organizer covers $200 shortfall
  - Option C: All participants pay for loss; $1000 ÷ 5 = $200 still owed, even though only $800 refunded
- **Default Recommendation:** Option A (organizer absorbs cancellation fee)
- **Ledger Entry:**
  - Original: "+$1000 Hotel"
  - Cancellation: "-$800 Hotel - Partial Refund Received; -$200 Hotel - Cancellation Fee (Organizer absorbs)"

#### Case 4.1.3: Vendor Non-Refundable Booking (Paid Upfront)
- **Trigger:** Non-refundable rate selected; cancellation requested
- **Precondition:** Policy clearly stated at booking
- **Settlement:**
  - Cost remains on ledger as "sunk cost"
  - Participants still owe original amount (no refund)
  - Organizer makes policy decision: absorb loss or charge participants
- **Communication:** Ensure participants aware non-refundable rate was selected
- **Ledger Entry:**
  - Original: "+$1000 Hotel (Non-Refundable Rate)"
  - Cancellation: "CANCELLED - NON-REFUNDABLE"
  - Participant balance: $200 still owed (or $0 if organizer absorbs)

#### Case 4.1.4: Insurance Refund (Trip Cancellation Insurance)
- **Trigger:** Trip cancelled due to force majeure (COVID, weather, etc.); insurance payout received
- **Precondition:** Trip insurance purchased upfront
- **Example:**
  - Total trip cost: $10,000
  - Insurance payout received: $9,500 (admin fee deducted)
  - Shortfall: $500
- **Settlement:**
  - Refund insurance payout amount to participants: $9,500 ÷ 5 = $1,900/person
  - Organizer covers $500 insurance admin fee OR participants each pay $100 more
- **Ledger Entry:**
  - Original: "+$10,000 Total Trip Cost"
  - Insurance Payout: "-$9,500 Insurance Reimbursement"
  - Remaining: "$500 (to be absorbed)"

#### Case 4.1.5: Refund to External Payment Method
- **Trigger:** Participant paid via Venmo; booking cancelled; refund due
- **Action:**
  - System identifies original payment method (Venmo)
  - Organizer initiates refund through Venmo
  - OR organizer reimburses from personal account + clarifies payment flow
- **Risk:** Payment method may no longer be active; refund may fail
- **Fallback:** If payment method inactive, organizer asks for new payment destination
- **Ledger:** Mark as "Refund issued via Venmo - [date]" with transaction ID

#### Case 4.1.6: Credit Vs. Refund Election (Participant Choice)
- **Scenario:**
  - Booking cancelled; refund available
  - Organizer offers: Full refund OR same amount as credit for future trip
  - Participant chooses credit
- **Settlement:**
  - Participant's balance zeroed for cancelled booking
  - Credit noted in participant's account: "Trip X Credit: $200"
  - Credit can be applied to future trip or requested as cash after [date]
- **Tax Implication:** Verify accounting treatment (potentially deferred revenue)

#### Case 4.1.7: Refund Request by Participant (Post-Payment Withdrawal)
- **Trigger:** Participant wants to withdraw after paying
- **Preconditions:**
  - Payment received
  - Trip date approaching
  - Vendor cancellation policy unknown or strict
- **Organizer's Dilemma:**
  - If refund denied: Participant frustrated; possible reputation damage
  - If refund granted: Organizer out funds; vendor may still charge
- **Resolution Framework:**
  1. Check vendor cancellation policy
  2. If refund possible from vendor: refund participant from vendor refund
  3. If no vendor refund available: Offer credit or require participant to eat cost
- **Communication:** Establish refund policy at trip creation time (before payments)
- **Ledger:**
  - If granted: "-$[amount] Participant Refund Request - [Reason]"
  - If denied: Participant communication, note in system for escalation

---

### 4.2 DISPUTE CASES

#### Case 4.2.1: Disagreement Over Cost Allocation
- **Scenario:**
  - Organizer allocated $100/person for shared dinner
  - Participant claims they ate $60 meal, should only pay $60
  - Others say it's a group cost, everyone pays equal share
- **Evidence Review:**
  - Receipt shows itemized costs
  - Participant's meal cost: $60
  - Others' average: $25 (shared appetizers, wine, dessert)
- **Resolution Options:**
  - Option A: Hold to group cost model (participant pays $100)
  - Option B: Refund participant $40 (pay only for own meal)
  - Option C: Split shared costs (appetizers, wine, dessert) equally; each person pays for own entree
- **Recommendation:** Option C (most fair for future trips)
- **Escalation:** If organizer & participant disagree, third-party vote among group

#### Case 4.2.2: Disagreement Over Who Attended Activity
- **Scenario:**
  - Activity booked for 8 people; organizer charged all 8
  - Participant claims they missed activity; should not be charged
  - No attendance tracker at activity
- **Evidence:**
  - Activity booked in advance: list of 8 names
  - No cancellation request from participant
  - No refund requested from vendor
- **Resolution:**
  - If participant can provide evidence (photo elsewhere, email saying "can't attend"), refund warranted
  - If no evidence, charge stands (participant should have notified organizer in advance)
- **Recommendation:** Implement check-in process for activities (QR codes, organizer verification, etc.)

#### Case 4.2.3: Disputed Payment (Participant Claims Already Paid)
- **Scenario:**
  - Organizer says Participant A still owes $200
  - Participant A claims they paid via Venmo last month
  - No record in system
- **Evidence Review:**
  - Check Venmo transaction history
  - If Venmo transaction exists: Update system, mark as reconciled
  - If no Venmo record: Ask for receipt/screenshot
- **Resolution:**
  - If screenshot authentic: Manually record payment in system
  - If Venmo confirmed payment to organizer's account: Update immediately
  - If disputed payment method: Escalate to independent verification
- **Recommendation:** Always log payments in system; don't rely on external payment apps alone

#### Case 4.2.4: Hidden Costs / Cost Surprises
- **Scenario:**
  - Organizer quoted $150/person for accommodation
  - Last-minute: Cleaning fee $100, parking fee $50, resort fee $20 per room
  - Total becomes $180-185/person
  - Participant claims breach of original quote
- **Resolution:**
  - Review original communication: Was quote "final" or "estimated"?
  - If "final": Organizer absorbs extra fees
  - If "estimated": Participants informed of extra fees, must approve
  - Recommendation: Always disclose potential hidden costs at booking
- **Ledger:**
  - "Accommodation": $150/person
  - "Resort Fees (undisclosed at booking)": $20/person (organizer absorbs) OR request approval
  - "Cleaning Fee (negotiable)": $100 total (organizer negotiates or absorbs)

#### Case 4.2.5: Payment App Dispute (Venmo/PayPal Chargebacks)
- **Scenario:**
  - Participant paid $500 via Venmo 2 months ago
  - Participant now disputes payment via PayPal/bank (chargeback)
  - Funds reversed; organizer out $500
- **Precondition:** Participant received benefit (attended trip)
- **Resolution:**
  - Contact participant: "Why chargebackafter attending trip?"
  - If fraud claimed: Escalate to Venmo fraud team
  - If legitimate dispute: Attempt settlement
  - If no resolution: Organizer may pursue small claims court
- **Prevention:** Use documented payment methods (invoice, receipt) for transparency
- **Ledger:** Mark as "Disputed Payment - Chargeback" until resolved

#### Case 4.2.6: Organizer Disappears (Funds Held)
- **Scenario:**
  - Group paid total $5000 to organizer
  - Organizer fell ill/unavailable; trip proceeds without organizer
  - Participants need settlement but organizer unreachable
- **Prevention:** 
  - Co-organizer designated
  - Trip funds held in platform escrow, not personal account
- **Resolution:**
  - Co-organizer takes over settlement
  - If no co-organizer: Platform intervenes; refund remaining balances
- **Recommendation:** **Implement escrow/payment holding** for all group payments

---

## SECTION 5: SETTLEMENT & FINALIZATION CASES

### 5.1 SETTLEMENT CALCULATION

#### Case 5.1.1: Two-Way Settlement (Participant ↔ Organizer)
- **Setup:**
  - Organizer paid all upfront costs: $5000
  - 5 participants each owe: $1000
- **Settlement:**
  - Each participant pays organizer $1000
  - After 5 payments, organizer's balance = $0
- **Ledger:** Straightforward; minimal complexity

#### Case 5.1.2: Multi-Way Settlement (Multiple Payers)
- **Setup:**
  - Organizer paid: $2000 (flights)
  - Participant A paid: $1500 (accommodation)
  - Participant B paid: $500 (activities)
  - Total: $4000 ÷ 5 people = $800/person
- **Balances:**
  - Organizer paid $2000, owes $800 → net owed $1200
  - Participant A paid $1500, owes $800 → net owed $700 (or owed $200 credit?)
  - Participant B paid $500, owes $800 → owes organizer $300
  - Participants C & D owe $800 each
- **Settlement Algorithm (Minimum Transactions):**
  1. Sum net positions: who owes total, who is owed total
  2. Use matching algorithm to minimize transactions
  - Organizer is owed $1200
  - Participant A is owed $700
  - Participant B owes $300
  - Participants C & D owe $800 each
  - **Optimal settlement:**
    - C pays Organizer $800
    - D pays Organizer $400; pays Participant A $400
    - B pays Participant A $300 (or Organizer, then Organizer pays A)
  - **Result:** 3 transactions instead of 5
- **Complexity:** Graph algorithm to minimize transaction count (NP-hard for many participants)
- **Recommendation:** Implement "pay organizer" default; then "pay directly among participants" for transparency

#### Case 5.1.3: Late Payments Post-Trip
- **Trigger:** After trip ends, participants still haven't paid
- **Timeline:**
  - T+1 week: Send reminder (gentle)
  - T+2 weeks: Second reminder (firmer)
  - T+4 weeks: Final notice + escalation
- **Escalation Options:**
  - Option A: Public group posting ("X still owes Y")
  - Option B: One-on-one conversation
  - Option C: Automated payment reminders via platform
- **Default:** Use Option C (automated, privacy-respecting)
- **Legal:** Clarify if this is "debt" requiring formal collection efforts

#### Case 5.1.4: Partial Settlements (Payments Received Mid-Settlement)
- **Scenario:**
  - Day 1: Organizer sent settlement request to 5 participants
  - Day 2: Participant C pays $800
  - Day 5: Participant A pays $700
  - Day 8: Participant B still hasn't paid
- **Handling:**
  - Mark paid participants as "settled"
  - Continue reminders for Participant B
  - Organizer's reconciliation: $800 + $700 + ? + ? + ? vs. $4000 owed
- **Grace Period:** Determine acceptable timeline (7 days? 14 days? 30 days?)
- **Recommendation:** Set payment deadline at trip creation time

#### Case 5.1.5: Final Settle-Up with Reallocation
- **Scenario:**
  - Trip ended; all payments received
  - Organizer received $4800 (target was $5000)
  - Shortfall: $200 (unpaid portion)
  - Organizer absorbs $200 OR reallocate among participants
- **Options:**
  - Option A: Organizer eats $200 (out-of-pocket)
  - Option B: Reallocate $200 ÷ 5 = $40 additional per participant
  - Option C: Reallocate only among participants who caused shortfall
- **Recommendation:** Option A (organizer absorbs as "coordination cost")
- **Ledger Entry:**
  - "Trip Shortfall (Unpaid Balance): $200"
  - "Organizer Absorption: $200"

---

### 5.2 FINAL RECONCILIATION

#### Case 5.2.1: Reconciliation w/ Vendor Final Invoice
- **Trigger:** Vendor sends final invoice post-trip
- **Precondition:** Organizer paid estimated amount upfront
- **Scenarios:**
  - **Scenario A (Vendor undercharged):** 
    - Paid: $5000
    - Final invoice: $4800
    - Refund: $200
  - **Scenario B (Vendor overcharged):**
    - Paid: $5000
    - Final invoice: $5300
    - Additional owed: $300
  - **Scenario C (Perfect match):**
    - Paid: $5000
    - Final invoice: $5000
- **Action:**
  - Scenario A: Refund participants or credit to organizer
  - Scenario B: Organizer pays additional; reallocates to participants
  - Scenario C: No further action
- **Timing:** Vendor invoices often arrive 2-4 weeks post-trip
- **Recommendation:** Hold 5-10% as contingency until final invoices received

#### Case 5.2.2: Currency Conversion Losses (International Trips)
- **Trigger:** Bookings in multiple currencies; exchange rates fluctuate
- **Example:**
  - Accommodation booked in GBP: £2000 @ $1.25 = $2500 USD
  - Flight booked in EUR: €1000 @ $1.10 = $1100 USD
  - Hotels charged at final bill: £2000 @ $1.20 = $2400 USD (lost $100)
  - Flights charged at final bill: €1000 @ $1.15 = $1150 USD (gained $50)
  - Net: Lost $50
- **Settlement:**
  - Should participants absorb exchange rate loss? Or organizer?
  - Default: Organizer absorbs (part of planning cost)
  - Alternative: Distribute loss proportionally (add $50 ÷ 5 = $10 per participant)
- **Recommendation:** Book in local currency; absorb FX as coordination cost

#### Case 5.2.3: Tax & Service Charges (Discovered Post-Trip)
- **Trigger:** Venue adds taxes/service charges on final invoice
- **Example:**
  - Venue quoted: $1000
  - Final invoice: $1000 + $180 tax + $200 service charge = $1380
  - Additional owed: $380
- **Settlement:**
  - If quoted as "before tax": participants expected to pay tax; charge additional
  - If quoted as "inclusive": Organizer absorbs as negotiation failure
- **Recommendation:** Always confirm whether quotes are "before" or "after" tax/service

---

## SECTION 6: EDGE CASES & SPECIAL SCENARIOS

### 6.1 GROUP DYNAMIC CHANGES

#### Case 6.1.1: Romantic Couple Breakup (Mid-Trip)
- **Scenario:**
  - Couple booked shared accommodation; break up during trip
  - Both want to stay on trip; one wants separate room
- **Action:**
  - One or both move to different accommodation
  - Recalculate original room cost (1 person instead of 2)
  - Calculate cost of new arrangement
- **Settlement:**
  - Original room cost splits between remaining occupant (if any) and empty cost
  - New room cost allocated to person who moved
  - May result in higher per-person costs for original room
- **Example:**
  - Original shared room: $400 for 2 people = $200/each
  - One person moves; room now for 1 person: still $400 (not cheaper)
  - Remaining person pays $400; moved person pays for new room
  - Group adjustment: may need to reallocate costs

#### Case 6.1.2: Uninvited Guest Joins
- **Scenario:**
  - Friend of participant shows up; wants to join trip
  - Accommodation fully booked; no extra bed
  - Participant offers to share bed with guest
- **Action:**
  - Participant makes personal accommodation decision
  - Guest still owes share of group costs (transportation, meals, activities)
  - Organizer must approve; update participant count in bookings
- **Settlement:**
  - New person added to activity/meal costs
  - Recalculate per-person costs for future bookings
  - Accommodation cost for original participant unchanged (already paid)
  - New person may need to book separate accommodation or arrange with participant
- **Validation:** Ensure vendor capacity allows additional participant

#### Case 6.1.3: Group Size Pressure (VIP Guest Joins)
- **Scenario:**
  - Trip organizer's parent/elder wants to join last-minute
  - Group wants to offer reduced cost to honor elder
  - Other participants may feel set precedent
- **Action:**
  - Discuss reduction with group; get consensus
  - If approved: Reduced tier (see 3.1.5 - Tiered Cost-Sharing)
  - If not approved: Full cost applies
- **Ledger:** Transparent documentation of decision
- **Risk:** Other participants may demand reciprocal reductions

#### Case 6.1.4: Participant Conflict (Irreconcilable Differences)
- **Scenario:**
  - Two participants have deep conflict; can't share rooms or transportation
  - Both want to stay on trip
  - Group must separate them
- **Action:**
  - Accommodate separation (different rooms, different transport, different activities)
  - Recalculate costs for both separated arrangements
  - May result in higher total cost (fewer people per room = higher per-person cost)
- **Settlement:**
  - Determine who is financially responsible for cost increase:
    - Option A: Both parties split additional cost equally
    - Option B: Initiator of conflict pays additional cost
    - Option C: Group absorbs additional cost
  - Default: Option A (equal responsibility)

#### Case 6.1.5: Participant Medical Emergency (Unexpected Early Departure)
- **Trigger:** Participant hospitalized; forced to leave trip
- **Action:**
  - Remove participant from remaining activities/accommodation
  - Refund remaining days/activities if possible
  - Recalculate remaining participants' shares
- **Settlement:**
  - Refund portion of costs for days not attended
  - Participating participants' shares may increase (fewer people splitting fixed costs)
  - Hotel: 5 people ÷ 5 nights → 4 people ÷ 4 nights (last night per-person cost higher)
- **Insurance:** Check if travel insurance covers medical emergency refunds
- **Compassion:** Consider group decision to partially absorb cost for medical emergency (not organizer's fault)

---

### 6.2 BOOKING ISSUES

#### Case 6.2.1: Overbooking (Sold Out; Fewer Spots Than Registered)
- **Trigger:** Activity sold out; only 8 spots available but 10 people registered
- **Action:**
  - Vendor confirms reduced availability
  - 2 people must be excluded or waitlisted
- **Resolution Options:**
  - Option A: First 8 to pay get spot (FIFO)
  - Option B: Random lottery
  - Option C: Organizer selects (potential favoritism)
  - Option D: Find alternative activity for 2 people
- **Recommendation:** Option B (lottery) for fairness
- **Settlement:**
  - 8 people pay activity cost
  - 2 people refunded deposits (if paid) or don't owe (if not)
  - Consider: Do 2 excluded people pay for alternative activity organizer arranges?

#### Case 6.2.2: Booking Confirmation Delay (Vendor Unresponsive)
- **Trigger:** Organizer submitted booking request; vendor hasn't confirmed 2 weeks before trip
- **Precondition:** Payment not yet sent; waiting for confirmation
- **Action:**
  - Follow up with vendor daily
  - Prepare backup bookings at other vendors
  - Communicate with group about uncertainty
- **Settlement:**
  - If booking confirmed: proceed as normal
  - If booking fails: pivot to backup + recalculate costs
  - If costs increase with backup: determine who absorbs increase (organizer vs. participants)
- **Recommendation:** Establish vendor contact deadline (e.g., 3 weeks before trip)

#### Case 6.2.3: Booking Downgrade (Better Option Unavailable)
- **Trigger:** Organizer booked 5-star accommodation; vendor confirms only 3-star available
- **Precondition:** Trip is T-1 week; no time to rebook elsewhere
- **Action:**
  - Vendor offers partial refund or credit
  - Organizer decides: Accept downgrade + refund OR rebook elsewhere (at higher cost)
- **Settlement:**
  - If accept downgrade + refund: Each participant refunded $[difference]/5
  - If rebook elsewhere: New cost, possible cost increase; determine who absorbs
- **Communication:** Inform group immediately; offer choice if possible

#### Case 6.2.4: Booking Upgrade (Better Option Available at Same Price)
- **Trigger:** Vendor informs of upgrade opportunity (no additional cost)
- **Precondition:** Trip confirmed; new better option opened up
- **Action:**
  - Organizer confirms with group
  - If accepted: Update booking; no cost change
  - If declined: Keep original booking
- **Settlement:**
  - No cost difference: no settlement needed
  - Group gets surprise upgrade (morale boost)

#### Case 6.2.5: Booking Error (Organizer Booked Wrong Dates/People)
- **Trigger:** Organizer booked hotel for Sept 5-10 but trip is Sept 4-11 (missed first night)
- **Precondition:** Error discovered 2 weeks before trip
- **Action:**
  - Contact vendor; request modification for 1 additional night
  - Vendor may charge change fee or require rebooking
- **Settlement:**
  - If vendor allows free modification: no cost change
  - If vendor charges fee: Organizer absorbs (their error) OR participants split fee
  - If rebooking required at higher cost: Organizer absorbs OR negotiates group share
- **Recommendation:** Organizer assumes responsibility for booking errors

---

### 6.3 FINANCIAL EDGE CASES

#### Case 6.3.1: Participant Bankruptcy/Financial Hardship (Can't Pay)
- **Trigger:** After trip, participant claims financial hardship; can't pay share
- **Precondition:** No travel insurance; no prior financial disclosure
- **Options:**
  - Option A: Full forgiveness (group absorbs cost)
  - Option B: Partial forgiveness (participant pays 50%)
  - Option C: Payment plan (participant pays over 6 months)
  - Option D: No forgiveness (pursue small claims if needed)
- **Group Vote:** Let group decide on compassion vs. fairness
- **Recommendation:** Establish policy upfront; include insurance for such scenarios
- **Ledger:** Document decision and reason (for future disputes)

#### Case 6.3.2: Organizer Personal Subsidy (Intentional Underpayment)
- **Trigger:** Organizer decides to subsidize entire group's costs
- **Example:** Organizer pays $5000 for $8000 trip; participants each pay $600 instead of $1000
- **Action:** Organizer explicitly documents this as a gift/subsidy
- **Settlement:**
  - Participants owe: $600 each = $3000 total
  - Organizer covers: $5000
  - No "debt" created; organizer voluntarily paid difference
- **Ledger:** Note: "Organizer voluntary subsidy: $2000"
- **Tax Implication:** Organizer may claim gift tax exemption (if applicable in jurisdiction)

#### Case 6.3.3: Payment Sent to Wrong Person (Misdirected)
- **Trigger:** Participant A sends payment to Participant B instead of organizer
- **Precondition:** Similar names; unclear payment instruction
- **Action:**
  - Participant A realizes error; asks for refund from Participant B
  - Participant B may be unwilling to refund
- **Resolution:**
  - Encourage Participant B to refund (not their money)
  - If refusal: Participant A contacts organizer; organizer reconciles
  - Organizer manually updates records; transfers funds from Participant B's account
- **Prevention:** Use payment app group links or unique identifiers
- **Ledger:** Document misdirected payment; manual correction recorded

#### Case 6.3.4: Partial Payment After Settlement Closed
- **Trigger:** After trip, after all settlements completed, participant sends payment
- **Precondition:** Participant was marked as "unpaid"; then sent payment 3 months later
- **Action:**
  - Payment received; participant marked as "settled"
  - Organizer's accounts already reconciled; no action needed
- **Settlement:**
  - If payment was to Organizer: Organizer's balance increased
  - If payment was to another participant: That participant's balance increased
- **Recommendation:** Close settlement window (e.g., 30 days post-trip); after that, refund late payments

#### Case 6.3.5: Inflation Adjustment (Long Trip, Costs Rise During Trip)
- **Trigger:** Multi-week trip; local inflation causes activity prices to rise mid-trip
- **Example:**
  - Week 1 activities: $100/person (booked in advance)
  - Week 2 activities: $150/person (prices rose due to local demand)
- **Settlement:**
  - Week 1 participants pay $100
  - Week 2 participants pay $150
  - Unequal cost for similar activities (time-based inflation)
- **Group Discussion:** Is this acceptable? Or should everyone pay average ($125)?
- **Recommendation:** Lock prices in advance; accept inflation cost differences as unavoidable

#### Case 6.3.6: Corporate Sponsorship (External Funding)
- **Trigger:** Company sponsors $3000 of $8000 trip cost
- **Precondition:** Participants still owe their share; sponsorship reduces total cost
- **Settlement:**
  - Total trip cost: $8000 - $3000 (sponsorship) = $5000 for participants
  - Per-person share: $5000 ÷ 5 = $1000 (instead of $1600)
  - Organizer manages sponsorship funds separately
- **Ledger:**
  - "Trip Total Cost: $8000"
  - "Corporate Sponsorship: -$3000"
  - "Participant Cost: $5000"
  - "Per-Person Share: $1000"
- **Tax:** Sponsorship may have tax implications (check with accountant)

---

## SECTION 7: SYSTEM CONSTRAINTS & VALIDATION RULES

### 7.1 DATA CONSISTENCY RULES

**Rule 7.1.1: Cost Conservation**
- Sum of individual participant shares must equal total booking cost (± $0.01 rounding)
- Validation: After any calculation, verify total = sum of parts

**Rule 7.1.2: Payment Precedence**
- Participant cannot pay for cost they haven't been assigned to
- Validation: Before recording payment, confirm participant is listed for that booking

**Rule 7.1.3: Temporal Consistency**
- Booking can't be cancelled if already refunded
- Cancellation refund can't exceed original booking cost
- Validation: Check booking state before processing cancellation

**Rule 7.1.4: Participant Presence**
- Participant can't be removed from trip entirely if they've paid towards shared costs
- They can only be removed from individual activities/accommodations
- Validation: Check payment status before allowing removal

**Rule 7.1.5: Duration Validation**
- Participant's stay duration must fall within trip date range
- Early departure date must be after arrival date
- Validation: Trip start ≤ participant arrival ≤ participant departure ≤ trip end

### 7.2 ERROR PREVENTION

**Error 7.2.1: Duplicate Booking**
- System should prevent same booking being recorded twice
- Detection: Check for duplicate booking with same vendor, dates, participant set
- Resolution: Merge duplicates or ask organizer to confirm

**Error 7.2.2: Orphaned Payments**
- Payment recorded but no matching booking assignment
- Detection: Scan for payments without assigned booking
- Resolution: Organizer must assign payment to booking or reverse it

**Error 7.2.3: Negative Balances**
- Participant balance should never go below $0 (unless refund owed TO them)
- Detection: Alert if participant balance < $0
- Resolution: Either reverse payment or record as "organizer credit" to participant

**Error 7.2.4: Overly Rounding**
- Rounding errors accumulate across many participants
- Detection: Compare ledger total to individual sum
- Resolution: Use banker's rounding (round to nearest cent) and adjust final person if needed

---

## SECTION 8: DECISION TREES FOR COMMON SCENARIOS

### Decision Tree 8.1: Participant Departure
```
Participant wants to leave trip?
├─ Before trip starts?
│  ├─ Refund available from vendors?
│  │  ├─ Yes → Refund participant their share
│  │  └─ No → Determine if cancellation fee applies
│  │         ├─ Refundable rate → Participant absorbs fee; gets remainder
│  │         └─ Non-refundable → Organizer or group decision on who absorbs
│  └─ No cancellation ever made → Participant still owes full share
│
├─ During trip?
│  ├─ Before which date/activity?
│  │  └─ Calculate costs for days attended only
│  ├─ Refund available for remaining days?
│  │  ├─ Yes → Refund participant for unattended days
│  │  └─ No → Participant absorbs; remaining group's costs may increase (fewer people)
│  └─ Remaining participants split freed-up costs
│
└─ After trip ends?
   └─ No refund available; settlement as planned
```

### Decision Tree 8.2: Cost Overrun
```
Final costs exceed estimated trip cost?
├─ How much over?
│  ├─ < 5% ($500 on $10k trip) → Organizer absorbs; minor adjustment
│  ├─ 5-15% → Organizer absorbs OR split with group
│  └─ > 15% → Major issue; group vote on sharing
│
├─ What caused overrun?
│  ├─ Vendor cost increase (not organizer's fault)
│  │  └─ Organizer or group absorption
│  ├─ Organizer booking error → Organizer absorbs
│  ├─ Participant-driven additions → Requesting participants pay surcharge
│  └─ Unexpected hidden costs (fees, taxes) → Determine if foreseeable
│
└─ Decision: Who absorbs overage?
   ├─ Organizer (sunk cost of planning)
   ├─ Participants (equal share of overage)
   ├─ Requesting participants only (if specific additions)
   └─ Group vote (if uncertain)
```

### Decision Tree 8.3: Refund Dispute
```
Participant requests refund post-payment?
├─ What's the reason?
│  ├─ Personal circumstances (job loss, illness)?
│  │  └─ Escalate to group; recommend 50-75% refund
│  ├─ Organizer error (wrong booking, date)?
│  │  └─ Full refund; organizer responsible
│  ├─ Vendor cancellation?
│  │  └─ Refund per vendor policy; organizer absorbs gap
│  └─ Participant changed mind (no material reason)?
│     └─ Depends on cancellation policy; recommend 0-50% refund
│
├─ Has refund already been issued from vendor?
│  ├─ Yes → Process refund to participant immediately
│  └─ No → Check vendor cancellation policy
│     ├─ Free cancellation → Request refund; pass to participant
│     ├─ With fee → Participant absorbs fee; gets remainder
│     └─ Non-refundable → Organizer decision (absorb or deny)
│
└─ When to refund?
   ├─ T-4 weeks (pre-trip) → Full refund available; process immediately
   ├─ T-2 weeks → Partial refund; vendor fees apply
   └─ T-0 weeks (during/after trip) → No refund typical; escalate with compassion
```

---

## SECTION 9: LEDGER ENTRY EXAMPLES

### Example 9.1: Complete Trip Settlement

**Trip:** Denver Ski Weekend (5 people, 3 nights)

**Bookings:**
1. Hotel: $300/night × 3 nights = $900 (2-bed + 1-single split)
2. Ski Passes: $200/person × 5 = $1000 (all participate)
3. Group Dinner: $60/person × 5 = $300 (all attend)
4. Airport Transport: $50/person × 5 = $250 (shared van)

**Total Trip Cost: $2450**
**Per-Person Average: $490**

**Participant Breakdown:**
- Participant A: 3 nights (full duration)
- Participant B: 3 nights (full duration)
- Participant C: 2 nights (leaves early after day 1)
- Participant D: 3 nights (full duration)
- Participant E: 3 nights (full duration)

**Ledger:**

| Booking | Cost | Allocation Model | Participant A | Participant B | Participant C | Participant D | Participant E | Total |
|---------|------|---|---|---|---|---|---|---|
| Hotel Double | $500 | Split 2 ways (A + B) | $250 | $250 | $0 | $0 | $0 | $500 |
| Hotel Single C | $300 | C only (2 nights) | $0 | $0 | $200 | $0 | $0 | $200 |
| Hotel Single D | $300 | D only | $0 | $0 | $0 | $300 | $0 | $300 |
| Hotel Single E | $300 | E only | $0 | $0 | $0 | $0 | $300 | $300 |
| Hotel Single (C's 3rd night unused) | $100 | Sunk cost | $20 | $20 | $20 | $20 | $20 | $100 |
| Ski Passes | $1000 | 5 ways (all attend) | $200 | $200 | $200 | $200 | $200 | $1000 |
| Group Dinner | $300 | 5 ways | $60 | $60 | $60 | $60 | $60 | $300 |
| Transport | $250 | 5 ways | $50 | $50 | $50 | $50 | $50 | $250 |
| **TOTAL OWED** | **$2450** | | **$580** | **$580** | **$530** | **$630** | **$630** | **$2450** |

**Payments Received:**
- Participant A: Paid $500 (underpaid $80) → Still owes $80
- Participant B: Paid $600 (overpaid $20) → Owed refund $20
- Participant C: Paid $530 (exact) → Settled
- Participant D: Paid $0 → Owes $630
- Participant E: Paid $650 (overpaid $20) → Owed refund $20

**Final Settlement:**
- Participant A: Owes $80
- Participant B: Refund $20
- Participant C: Settled
- Participant D: Owes $630
- Participant E: Refund $20

**Total Collected: $1650 | Total Owed Back: $40 | Net Organizer: $1610** (covers out-of-pocket payments)

---

### Example 9.2: Mid-Trip Modification Ledger

**Initial Booking:** 6 people, accommodation $600/night × 3 nights = $1800

**Mid-Trip Change:** Participant 4 decides to leave after night 1 and wants refund

**Recalculation:**
- Night 1: 6 people ÷ $600 = $100/person (Participant 4 charged $100)
- Nights 2-3: 5 people ÷ $1200 = $240/person (Participant 4 not charged)

**Refund Check:**
- Participant 4 was charged: $300 (for 3 nights)
- Participant 4 attended: 1 night
- Vendor refund for 2 nights: $400 (100% refundable)
- Participant 4 refund: $300 - $100 = $200

**Updated Ledger:**
- Participants 1-3, 5-6: Each still owes $300
- Participant 4: Refunded $200; owes $100

**New Total: $1800 (unchanged, vendor refund applied to group)**

---

## SECTION 10: IMPLEMENTATION CHECKLIST

### Must-Haves:
- [ ] Cost conservation validation (sum = total)
- [ ] Payment tracking (who paid what, when, how)
- [ ] Booking state management (draft, confirmed, cancelled, refunded)
- [ ] Participant lifecycle (add, remove, modify, leave early)
- [ ] Settlement calculation (who owes whom, how much)
- [ ] Refund processing (vendor refunds, participant refunds)
- [ ] Ledger auditing (full history, all changes)
- [ ] Payment app integration (Venmo, PayPal, etc.)

### Should-Haves:
- [ ] Conflict resolution (disputed costs, disagreements)
- [ ] Insurance handling (trip cancellation, medical)
- [ ] Currency conversion (international trips)
- [ ] Tax/fee handling (hidden costs, service charges)
- [ ] Organizer subsidy tracking
- [ ] Group voting (for major decisions)
- [ ] Notifications (payment reminders, cost updates)

### Nice-to-Haves:
- [ ] AI cost optimization (recommend savings)
- [ ] Settlement minimization (graph algorithm for fewer transactions)
- [ ] Predictive alerts (early departure risk, payment late)
- [ ] Historical analytics (average costs, trends)
- [ ] Mobile check-in (confirm activity attendance)
- [ ] Expense photo uploads (receipt auditing)
