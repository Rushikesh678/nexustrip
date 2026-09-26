# COMPLETE PRODUCT DESIGN: COLLABORATIVE TRIP EXPENSE MANAGER

---

## SECTION A: PRODUCT CONCEPT

**TripLedger** is a collaborative trip planning and expense management platform that makes group-trip finances transparent and settlement painless.

**What it does:**
- Hosts create trips and invite members
- Members and hosts independently track expenses via receipts, photos, or manual entry
- AI automatically extracts details from receipts
- The system dynamically updates everyone's balances in real-time
- At trip's end, the platform calculates the minimum transactions needed to settle
- Users understand exactly what they owe, to whom, and why

**Why it's different:**
- Not just an expense splitter; includes itinerary, budget tracking, and money-saving recommendations
- AI doesn't make financial decisions; users confirm everything
- Designed for the messy reality of group travel (multi-currency, unequal participation, refunds, money requests mid-trip)
- Feels alive with dynamic updates, not like a static accounting tool

**Core principle:** Make complexity feel simple without hiding important details.

---

## SECTION B: RECOMMENDED USER FLOW

### HOST JOURNEY (A–Z)

**Phase 1: Trip Setup**

1. **Sign up / Log in** → Email or OAuth
2. **Create trip** → Single coherent flow (not overwhelming)
   - Trip name (e.g., "Thailand 2024")
   - Destination (for map context, currency hints)
   - Start/end dates
   - Budget (optional; not mandatory to feel pressured)
   - Currency (auto-detect from destination or manual selection)
3. **Add members** → Invite by email; they accept asynchronously
   - Don't force itinerary until members accepted
4. **Set trip rules** (optional, hidden under "Settings")
   - Who can add expenses (everyone or host only)
   - Settlement method (simplify transactions vs. direct payouts)
   - Currency behavior (single currency or allow multi-currency)

**Phase 2: Pre-Trip Planning**

5. **Create itinerary** → Add activities with dates, times, estimated costs
   - This is optional if members just want expense tracking
   - Activities can have estimated budgets (e.g., "Bali food tour: ₹15,000")
6. **Review budget** → See planned vs. actual expenses as the trip approaches
7. **AI savings recommendations** → "You could save ₹8,000 by sharing a villa"

**Phase 3: During Trip**

8. **Add expense** → Single, elegant flow:
   - Quick entry: "Who paid? Who participated? How much?"
   - OR upload bill/photo → AI extracts → confirm → split
9. **See real-time balances** → Dashboard shows everyone's current balance
10. **Approve member expenses** → If host approval is required
    - Or just see them (depending on settings)
11. **Handle mid-trip edge cases:**
    - Someone overpays → Automatic credit shown
    - Someone leaves → Their expenses recalculated
    - Someone joins late → Only charged for relevant activities
    - Money requests from member to member → Host sees but doesn't approve

**Phase 4: Trip End**

12. **View settlement** → "Here's the minimum 3 transactions needed to settle"
13. **Generate report** → PDF with all statistics, spending breakdown, who owes whom
14. **Notify members** → Everyone receives their settlement details
15. **Track repayments** → Mark as paid when money is actually transferred

### MEMBER JOURNEY (Similar, Fewer Permissions)

**Phase 1: Onboarding**

1. **Receive invitation** → Email with trip link
2. **Accept trip** → Creates account if needed
3. **See trip overview** → What is this trip? Who's going? What's the budget?

**Phase 2: During Trip**

4. **View itinerary** → See scheduled activities, estimated costs
5. **View expenses** → See only expenses that affect them
6. **See their balance** → "You owe ₹4,200" or "You're owed ₹1,500"
7. **Add expense** (if allowed)
   - Same flow as host: upload bill or manual entry
   - Host may see in a queue for approval
8. **Request money** → "Alice, I paid ₹2,000 for your share of the villa. Can you Venmo me back?"
9. **Record repayment** → "I paid Bob ₹1,500 cash for my food"
10. **See other members** → View their profile, balance, history

**Phase 3: Trip End**

11. **View settlement** → Exactly what they owe/are owed to whom
12. **Receive report** → Personal spending breakdown
13. **Confirm payment** → Mark settlement as complete when transferred

---

## SECTION C: UX ARCHITECTURE

### Navigation Structure (Proposed)

**Primary navigation (always visible):**
```
Trip Dashboard (overview, balances, action items)
  ├─ Expenses (add, view, edit)
  ├─ People (members, their balances, history)
  └─ Settlement (final calculations, payment tracker)
```

**Secondary navigation (contextual):**
- Itinerary (if trip has activities)
- Budget (if budget set)
- Reports (after trip ends)
- Settings (trip rules, member permissions)

**Why this structure:**
- **3-4 main tabs** keeps cognitive load low
- **Expenses** is the primary action (most frequent)
- **People** shows who's involved and their financial status
- **Settlement** is only really needed at trip end
- Advanced features (itinerary, budget) are discoverable but not in critical path

### Dashboard: The First Screen

When a host or member opens a trip, they see:

```
[Trip Name: Thailand 2024]
[Status: Active • 5 days remaining]

┌─ YOUR BALANCE ────────────────┐
│ You are owed ₹4,200          │
│ You owe ₹1,500               │
│ Net: +₹2,700                 │
└────────────────────────────────┘

┌─ QUICK STATS ─────────────────┐
│ Total spent: ₹32,000          │
│ Your spending: ₹8,200         │
│ Budget: ₹35,000 (91% used)    │
│ Latest: Food tour - ₹3,000    │
└────────────────────────────────┘

┌─ ACTION ITEMS ────────────────┐
│ ✓ 5 members invited           │
│ ! 2 bills awaiting approval   │
│ ✓ Itinerary complete          │
│ 💡 AI found a savings idea    │
└────────────────────────────────┘

[+ Add Expense]  [View All]  [Settlement Preview]
```

**What this answers:**
- "What is happening?" → Total spent, budget status
- "What do I need to do?" → Action items
- "How much do I owe?" → Your balance (prominent)
- "Is the trip going over budget?" → Budget progress
- "Savings opportunities?" → AI recommendation

**Why this design:**
- Balances are the most important information; shown first
- Stats give context without requiring navigation
- Action items prevent surprises
- All major actions (add expense, settlement) are one click away
- No overwhelming detail

---

### Add Expense Flow (Crucial UX)

**OPTION A: Wizard-style (Recommended for simplicity)**

```
Step 1: How do you want to add this expense?
  [ ] Manual entry
  [ ] Upload receipt/photo
  [ ] Take a photo now

Step 2: [AI processes if needed]

Step 3: Who paid?
  [ ] You
  [ ] Alice
  [ ] Bob
  (Dropdown)

Step 4: Who participated?
  [✓] You
  [✓] Alice
  [ ] Bob
  [✓] Charlie
  (Checkboxes)

Step 5: How much? [₹3,000]

Step 6: How should we split this?
  ( ) Equally among participants
  ( ) By item (show items if from receipt)
  ( ) Custom amounts
  ( ) Percentage split
  
  If equally:
    Everyone splits: ₹3,000 ÷ 3 = ₹1,000 each

Step 7: [Review & Confirm]
  - Payer: You
  - Participants: You, Alice, Charlie
  - Total: ₹3,000
  - Split method: Equally
  - Your share: ₹1,000
  - Alice owes: ₹1,000
  - Charlie owes: ₹1,000
  
  [Confirm]  [Edit]

Result: Expense added. Balances update in real-time.
```

**Key UX principles:**
- Linear, clear steps (no "advanced options" button cluttering step 1)
- Each step builds on the previous
- AI is transparent ("AI found 3 items in receipt; review and confirm")
- Split methods revealed only when relevant
- Review page shows exactly what's happening

---

### Itinerary Flow (Optional but Important)

**NOT a detailed day-by-day planner; a linked expense planner**

```
Day 1: Dec 15
├─ Activity: Hotel check-in
│  └─ Estimated cost: ₹8,000 (split 2 ways)
│  └─ Participants: Alice, Charlie
│
├─ Activity: Airport pickup
│  └─ Estimated cost: ₹2,000 (split 4 ways)
│  └─ Actual: ₹2,300
│  └─ Link: See actual expense
│
└─ Activity: Dinner at beachside
   └─ Estimated cost: ₹3,000
   └─ Actual: Not yet tracked
   └─ [+ Add expense for this activity]

[+ Add Activity]
[Budget vs Actual]
```

**Why this design:**
- Activities are linked to expenses, not separate
- Shows estimated vs. actual (budget tracking)
- Makes it obvious which activities are untracked
- Doesn't force a strict itinerary if not needed

---

### Settlement Flow (Clear & Simple)

**NOT a bunch of transactions; a settlement table with one action**

```
SETTLEMENT SUMMARY
Trip ended: Dec 20

BALANCES:
┌────────────┬────────────┬──────────┐
│ Person     │ Paid       │ Owes     │
├────────────┼────────────┼──────────┤
│ You        │ ₹12,000    │ ₹8,000   │
│ Alice      │ ₹5,000     │ ₹6,000   │
│ Bob        │ ₹8,000     │ ₹9,000   │
│ Charlie    │ ₹7,000     │ ₹9,000   │
└────────────┴────────────┴──────────┘

YOUR SETTLEMENT:
You are owed ₹4,000
├─ Alice owes you ₹1,000
├─ Bob owes you ₹1,500
└─ Charlie owes you ₹1,500

PRACTICAL TRANSACTIONS (Simplified):
1. Alice sends you ₹1,000
2. Bob sends you ₹1,500
3. Charlie sends you ₹1,500

[Mark as Settled]  [Email Summary]  [View All Transactions]
```

**Key feature:** Settlement doesn't "force" complex algorithms. It shows:
- What you owe
- Who owes you
- Practical transactions (often just "Person A sends you money")
- Rounding/simplification notes if complex

---

### Report Flow (After Trip)

```
TRIP REPORT: Thailand 2024

OVERVIEW
┌──────────────────────────────────┐
│ Trip duration: 6 days            │
│ Total cost: ₹32,000              │
│ Per-person average: ₹6,400       │
│ Your spending: ₹8,200            │
│ Budget: ₹35,000 (91% used)       │
└──────────────────────────────────┘

SPENDING BY CATEGORY
┌──────────────────────────────────┐
│ Accommodation: ₹12,000 (38%)     │
│ Food: ₹12,000 (38%)              │
│ Activities: ₹6,000 (19%)         │
│ Transport: ₹2,000 (6%)           │
└──────────────────────────────────┘

PER-PERSON BREAKDOWN
┌────────────┬──────────┬──────────┐
│ Person     │ Spent    │ Adjusted │
├────────────┼──────────┼──────────┤
│ You        │ ₹8,200   │ +₹1,800  │
│ Alice      │ ₹5,000   │ -₹1,400  │
│ Bob        │ ₹8,000   │ +₹1,600  │
│ Charlie    │ ₹7,000   │ -₹200    │
└────────────┴──────────┴──────────┘

MAJOR EXPENSES
1. Bali Villa (Dec 14-18): ₹8,000
2. Komodo tour: ₹4,000
3. Group dinner (Dec 16): ₹3,000
...

[Download PDF]  [Share with members]  [Email to all]
```

---

## SECTION D: SCREEN-BY-SCREEN BREAKDOWN

### Essential Screens (MVP)

| Screen | Purpose | Key Content |
|--------|---------|-------------|
| **Sign Up / Login** | User authentication | Email/password or OAuth; no friction |
| **Create Trip** | Initialize trip | Name, destination, dates, budget, currency |
| **Trip Dashboard** | Overview & actions | Balances, stats, action items, quick add expense |
| **Add Expense (Wizard)** | Expense entry | 7-step flow: method → payer → participants → amount → split → review → confirm |
| **Expenses List** | View & edit | Filterable list; click to edit; AI indicator |
| **Receipt Parser** | AI processing | Upload → extraction → user review → corrections → confirm |
| **People / Members** | Team view | List of members; their balances; click for detail |
| **Settlement** | Final calculations | Balance table; simplified transactions; payment tracker |
| **Trip Settings** | Trip configuration | Rules, permissions, members, budget, currency |

### Secondary Screens (Important but not in critical path)

| Screen | Purpose | Key Content |
|--------|---------|-------------|
| **Itinerary** | Trip activities | Day-by-day activities linked to expenses |
| **Budget Tracking** | Planned vs. actual | Visual progress; category breakdown |
| **Trip Reports** | Analytics & export | Spending breakdown, PDF export, statistics |
| **Money Requests** | Mid-trip balances | Member-to-member "You paid ₹1,000 for my share" |
| **AI Recommendations** | Savings ideas | Accommodation swaps, transport optimization |
| **Audit Log** | Transaction history | Who changed what and when (for transparency) |
| **Member Detail** | Individual view | One person's balance, their expenses, history |

---

## SECTION E: PROGRESSIVE DISCLOSURE STRATEGY

### What Should Be Always Visible

1. **Your balance** (the most important number)
2. **Add Expense** (the primary action)
3. **Dashboard stats** (spending, budget)
4. **People/Members** tab (who's involved)
5. **Settlement** tab (final numbers)

### What Should Be Visible Only When Relevant

1. **"Approval needed"** badge → Only shows if host approval is required and there are pending expenses
2. **"Budget exceeded"** warning → Only shows if actual > planned
3. **AI recommendation card** → Only appears if AI found something worth suggesting
4. **Itinerary tab** → Only appears if activities exist
5. **"Someone joined late"** notice → Only if it happened

### What Should Be Behind "Settings"

1. Trip rules (who can add expenses)
2. Settlement method (simplify vs. direct)
3. Member permissions
4. Currency settings
5. Approval settings

### What Should Be "Details on Demand"

1. **Edit an expense** → Click the expense; form appears
2. **See expense detail** → Click to expand; shows all splits
3. **View member history** → Click member; shows their activity
4. **Change split method** → Only available when editing
5. **View AI confidence** → Only shown if extraction was uncertain

---

## SECTION F: DYNAMIC BEHAVIOR

### Real-Time Updates (When & Why)

**Update when:**
- An expense is added (everyone's balance changes)
- An expense is edited (recalculate all affected balances)
- A member is added/removed (future expenses change)
- A repayment is recorded (settlement updates)

**Should happen automatically without page refresh:**
- Balance updates on dashboard
- Budget progress bars
- Participant counts in activities
- Action item status (e.g., "2 bills awaiting approval" → "1 bill...")

**Don't need real-time:**
- Itinerary updates (rarely change mid-trip)
- Member join notifications (can be batched)
- Trip reports (only needed at end)

### Example: Adding a ₹5,000 Expense

**What should happen immediately:**

1. **Host's screen:**
   - Expense appears in list (with loading indicator while processing)
   - Dashboard balances update
   - Action item "2 bills awaiting approval" appears (if host approval enabled)
   - Budget progress bar moves slightly right
   - Participant balances change

2. **Affected members' screens (if online):**
   - They see a subtle notification: "New expense added: Group dinner ₹5,000"
   - If they view dashboard, they see their balance updated
   - If they view expenses, new expense is visible
   - **No page reload needed** (use WebSocket or polling)

3. **Backend:**
   - New expense document created
   - Participant balance records updated
   - Transaction logged in audit log
   - Notification queued for affected members

**Timeline:**
- T+0ms: Expense submitted
- T+100ms: Backend processes, updates DB
- T+150ms: WebSocket broadcast to affected clients
- T+200ms: UI updates on all connected clients

### Example: Editing an Expense

If the host changes a ₹5,000 expense to ₹6,000:

1. **Same dynamic updates as above**, but:
2. **History is maintained** (audit log shows "Edited from ₹5,000 to ₹6,000 at 3:45 PM")
3. **Affected members notified** with a note: "Alice adjusted 'Group dinner' from ₹5,000 to ₹6,000 (your share now ₹1,200 instead of ₹1,000)"
4. **Balances recalculated** immediately

### Example: Member Leaves Trip

If Charlie leaves on day 3:

1. **Future expenses** no longer include Charlie
2. **Past expenses** remain historically accurate (Charlie still shows on day 1-2 expenses)
3. **Settlement recalculated** (Charlie's final balance is only for what they participated in)
4. **UI shows:** "Charlie left trip on Dec 17. Expenses after this date don't include them."
5. **Host sees warning:** "Charlie owes ₹2,000. Settle before they leave?"

---

## SECTION G: AI FEATURES

### AI Feature 1: Receipt Parsing

**The problem:** Manually entering expenses is tedious and error-prone.

**The solution:** Upload a photo/PDF; AI extracts structured data; user confirms.

**Detailed UX:**

```
STEP 1: Upload
[Click to upload or drag-drop]
Accepts: JPG, PNG, PDF, Screenshots

STEP 2: Processing
[Loading animation]
"Analyzing receipt... this usually takes 5-10 seconds"

STEP 3: Extraction Result
┌────────────────────────────────┐
│ PARSED DATA (Review)           │
│                                │
│ Merchant:  [Restaurant XYZ]    │ ← editable
│ Date:      [Dec 16, 2024]      │ ← editable
│ Currency:  [INR]               │ ← editable
│                                │
│ ITEMS:                         │
│ ├─ Pasta Carbonara    ₹450     │ ← editable
│ ├─ Caesar Salad       ₹350     │ ← editable
│ ├─ Wine (shared)      ₹800     │ ← editable
│ └─ Beer              ₹200      │ ← editable
│                                │
│ Subtotal:  ₹1,800              │ ← auto-calculated
│ Tax:       ₹360                │ ← editable
│ Tip:       ₹240                │ ← editable
│ Total:     ₹2,400              │ ← auto-calculated
│                                │
│ Confidence: 94% (High)         │ ← indicator
└────────────────────────────────┘

[Edit]  [Confirm & Continue]  [Upload Different]
```

**Key design decisions:**

1. **Confidence indicator** → Shows user if AI is uncertain (e.g., "45% - Poor image quality")
2. **Every field is editable** → No data is locked in
3. **Items are listed** → If AI couldn't parse items, show "Could not identify items" with manual entry option
4. **Auto-calculations** → Tax + items + tip must equal total (system enforces)
5. **After confirmation** → Go straight to "Who paid? Who participated? How to split?"

**Handling failure cases:**

| Scenario | Response |
|----------|----------|
| **Blurry image** | Show confidence: 30%. Suggest re-upload. Manual entry option. |
| **Multiple receipts** | Show both. Ask: "Is this one transaction or two?" |
| **Handwritten receipt** | Confidence: 10%. Say "I'm not good at handwriting. Please enter manually." |
| **Missing items** | Say "I couldn't identify all items. You can add/edit them below." |
| **Currency mismatch** | "Receipt shows INR, but your trip is in USD. Which is correct?" |
| **Duplicate upload** | "I've seen this receipt before (Dec 16, ₹2,400). Did you mean to add it again?" |
| **No total visible** | "I can't find the total. Please enter it manually." |

**Why this UX works:**
- AI is transparent (shows what it extracted)
- User always has control
- Failures are explicit, not silent
- No "magic" that could go wrong without user knowing
- AI is a time-saver, not a black box

---

### AI Feature 2: Money-Saving Recommendations

**The problem:** Groups often overspend without realizing cheaper options exist.

**The solution:** During planning, AI suggests alternatives with clear cost/benefit trade-offs.

**Detailed UX:**

```
SETTINGS SCREEN → BUDGET

Budget: ₹35,000
Spent: ₹18,000
Remaining: ₹17,000

💡 AI FOUND A POTENTIAL SAVINGS

Accommodation Optimization
┌────────────────────────────────┐
│ Current setup:                 │
│ • 2 rooms (3-star) × 4 nights  │
│   ₹4,000 each = ₹8,000 total  │
│                                │
│ Alternative:                   │
│ • 1 villa (Airbnb) × 4 nights  │
│   ₹6,000 total (₹1,500/person) │
│                                │
│ SAVINGS: ₹2,000 (25%)          │
│ TRADE-OFF: 10min further from  │
│            central area        │
│                                │
│ [Learn More]  [Dismiss]        │
└────────────────────────────────┘

Additional Recommendations:
├─ Transport: Share one car instead of two → Save ₹3,000
├─ Food: Book group cooking class instead of restaurants → Save ₹2,500
└─ Activities: Combine two activities into one → Save ₹1,500 (one less taxi)
```

**How to phrase recommendations:**

❌ "Option A is better."
✅ "Option A costs ₹2,000 less but takes 10 minutes longer."

❌ "Share a villa to save money."
✅ "Villa: ₹6,000 (₹1,500/person) vs. 2 rooms: ₹8,000 (₹2,000/person). Savings: ₹2,000."

❌ "Optimize your budget."
✅ "Your trip is at 51% of budget. If spending stays constant, you'll have ₹17,000 left."

**Important constraints:**

1. **Only show when relevant** → Don't suggest accommodation changes once booked
2. **Respect user context** → "Recommend train over taxi" only if destination has train
3. **Transparency** → Explain what data AI used (e.g., "Based on 4 people, current bookings")
4. **Low barrier to dismiss** → Easy [X] to close; don't be pushy
5. **Actionable** → Show links to actually book alternatives if AI recommends

**Why this feature is valuable:**
- Happens during planning (when decisions are flexible)
- Provides concrete numbers (not vague advice)
- Respects user autonomy (suggest, don't force)
- Fits naturally into budget view

---

## SECTION H: EDGE CASES MATRIX

### User Lifecycle

| Edge Case | Business Rule | UI Behavior | Backend Behavior | Audit Trail |
|-----------|---------------|-------------|------------------|------------|
| **User joins late (day 3 of 5)** | Only charged for activities/accommodation from day 3 onward | Show "Joined Dec 17" badge; disable expenses before this date; expenses from day 3 onward include them | Add user; set `joinedDate = Dec 17`; recalculate expenses where `expenseDate >= joinedDate` | Log: "User joined trip on Dec 17" |
| **User leaves early (day 4 of 5)** | Charged only through day 4; future expenses exclude them | Show "Left Dec 18" badge; alert host "Charlie owes ₹2,000; settle before they leave?" | Set `leftDate = Dec 18`; future expenses exclude them; keep past expenses accurate | Log: "User left trip on Dec 18" |
| **User leaves permanently** | Same as early departure; final settlement is calculated without them | Settlement shows "Charlie (left Dec 18)" separately; note: "Charlie owes ₹2,000" | Archive connection; don't delete | Log: "User removed from trip; outstanding balance: ₹2,000" |
| **User removed by host** | Same as leaving; they can't see trip anymore | User sees "You were removed from this trip" with reason (if provided) | Access revoked; connection archived | Log: "Host removed user; reason: [if given]" |
| **User doesn't participate in activity** | Expense doesn't apply to them; they're not charged | When adding expense, host deselects them; their balance doesn't change | Participant list excludes them; expense splits among others | Log: "User not included in expense" |
| **User partially participates (e.g., skips one meal)** | Host can override split; they pay less | Host manually adjusts their split: "They only ate 2/3 of meal; they pay 2/3" | Allows custom split per participant | Log: "Custom split applied: User pays 66% of meal" |

### Expense Scenarios

| Edge Case | Business Rule | UI Behavior | Backend Behavior | Audit Trail |
|-----------|---------------|-------------|------------------|------------|
| **Expense edited after created** | All affected balances recalculated; history preserved | Show "Last edited: 3:45 PM by Alice" on expense detail; notification to affected members | Update expense; recalculate participant balances; log previous version | Log: "Expense edited: ₹5,000 → ₹6,000; participants affected: [names]" |
| **Expense deleted** | Reversed entirely; balances recalculated | Show confirmation: "This will refund all participants. Continue?" | Delete expense; reverse all participant debits; recalculate balances | Log: "Expense deleted: [details]; refunded to all participants" |
| **Duplicate expense (same expense added twice)** | Host is warned; can merge or delete one | "This looks like a duplicate of [Dinner, ₹3,000, Dec 16]. Keep both?" | System detects duplicates: same merchant, amount, date (within 5 min), same payer | Log: "Duplicate detected; user chose to [keep/delete]" |
| **Wrong payer (Alice paid but marked as Bob)** | Easily correctable; recalculate balances | Click expense → Edit payer → Confirm. Balances update immediately | Update payer; recalculate balances for both Alice and Bob | Log: "Payer changed from Bob to Alice; balances adjusted" |
| **Wrong participants (forgot to include Charlie)** | Add/remove participants; recalculate splits | Edit expense → Checkboxes → Update. Show "Split recalculated" | Update participant list; recalculate all splits | Log: "Participants changed: added Charlie; split adjusted from ₹1,000 to ₹800" |
| **Partial refund (paid ₹3,000, vendor refunds ₹2,000)** | Create negative expense for refund amount | Host: "Vendor refunded ₹1,000. Want to process?" → Shows how refund allocates | Create new expense entry: `{type: "refund", amount: -1000, applies_to: [expense_id]}` | Log: "Partial refund recorded: ₹1,000 from expense; participants adjusted" |
| **Full refund** | Reverse entire expense; zero out participant debits | Same as above, but refund amount = original amount | Create refund entry for full amount | Log: "Full refund recorded; expense reversed" |
| **Expense paid in multiple transactions** | Host creates expense for total; notes payment method | Expense shows: "Paid in 2 transactions: ₹2,000 (card) + ₹1,000 (cash)" | Create single expense; add `paymentMethods: [{method: 'card', amount: 2000}, ...]` | Log: "Multiple payment methods recorded for expense" |
| **One person paid for everyone** | Fully supported; they're marked as payer; everyone else owes them | Payer: Alice; Participants: Everyone. Alice's balance shows large credit. Others show debit to Alice. | Payer ≠ Participant list; system handles correctly | Log: "Alice paid ₹6,000 for 5 people; owes ₹5,000, paid ₹1,000" |
| **One person paid for one other person** | Only those two are participants; others unaffected | Participants: Alice (payer), Bob (participant only). Charlie, David not charged. | Participant list has 2 people; split divided by 2 | Log: "Alice paid ₹1,000 for Bob only" |
| **Split by item** | After AI extracts items, user assigns items to people | Pasta → Alice, Bob. Salad → Charlie. Wine → Everyone. Auto-calculates shares. | Participant shares calculated per item; total cross-checked | Log: "Split by item: [item: participant mapping]; totals verified" |
| **Unequal split (one person paid more)** | Host enters custom amounts | Enter amounts manually or percentages. System verifies total = expense. | Allows custom amounts per participant; validates total | Log: "Unequal split: Alice ₹700, Bob ₹500, Charlie ₹800" |
| **Percentage split** | Host enters percentages that must sum to 100% | Enter percentages or drag sliders. System shows actual amounts. | Validates sum = 100%; calculates actual amounts | Log: "Percentage split: Alice 50%, Bob 25%, Charlie 25%" |

### Money & Payments

| Edge Case | Business Rule | UI Behavior | Backend Behavior | Audit Trail |
|-----------|---------------|-------------|------------------|------------|
| **Multiple currencies** | Allow; show exchange rates; track separately until settlement | Expense in INR; trip also has USD. Show: "₹3,000 (≈ $36 USD at current rate)". Settlement shows both. | Store original currency; maintain exchange rate snapshot; settle separately or convert | Log: "Expense in INR; exchange rate used: [rate]; conversion: ₹3,000 = $36" |
| **Currency conversion at settlement** | Convert at end-of-trip rate; show conversion loss/gain | Settlement page: "Exchange rates: INR/USD = 83.5. Alice's USD expenses: ₹16,750 (₹200 conversion gain)" | Final settlement uses agreed conversion rate (trip default or user-specified) | Log: "Settlement converted at rate: [rate]" |
| **Rounding errors** | Last participant in settlement absorbs rounding | Alice owes ₹1,000.00, Bob ₹1,000.00, Charlie ₹1,000.01 (for total of ₹3,000) | System rounds down to cents; last person gets rounding overage | Log: "Rounding applied: Charlie paid 1₹000.01 (rounded from 1₹000.007)" |
| **Very small balances (₹1 or less)** | Consider forgiven in settlement; ask user | Settlement: "Charlie's balance: ₹0.50. Forgive this small amount?" [Yes] [No] | If forgiven, create record; don't require payment | Log: "Small balance forgiven: ₹0.50" |
| **Someone pays another directly (outside app)** | Record repayment; update balance | Member: "I sent Bob ₹1,500 cash today" → System creates repayment record; balances adjust | Create repayment entry; update balance; don't move funds | Log: "Repayment recorded: Alice paid Bob ₹1,500 (cash, recorded manually)" |
| **Cash payment (no external app)** | Record in system; settlement shows "settled in cash" | Settlement: "Pay Bob ₹1,500 [Mark as Paid]" → Host or member marks paid | System doesn't move money; tracks status as "payment recorded" | Log: "Payment recorded as settled (no funds moved)" |
| **Partial repayment** | Accept; update balance accordingly | Alice owes Bob ₹1,500. Alice pays ₹1,000. System shows: "Remaining: ₹500" | Update balance; don't mark as settled | Log: "Partial payment: ₹1,000 of ₹1,500; remaining: ₹500" |
| **Advance payment (before settling)** | Record as a repayment/credit; subtract from final settlement | Alice: "I'm paying Bob ₹500 now instead of at the end" → Balance shows credit | Create prepayment entry; adjust final balance | Log: "Advance payment: Alice paid Bob ₹500 (settled later in trip)" |

### Trip & Activity

| Edge Case | Business Rule | UI Behavior | Backend Behavior | Audit Trail |
|-----------|---------------|-------------|------------------|------------|
| **Trip cancelled** | All expenses remain for record; settlement shows "Cancelled" status; balances can still be settled | Show notice: "Trip cancelled Dec 20. Balances: [still shown]. Settlement is optional." | Mark trip as cancelled; don't delete data; allow settlement if desired | Log: "Trip cancelled; reason: [if given]; decision: settle anyway?" |
| **Trip dates changed** | Itinerary updates; accommodation/activity costs may need manual adjustment | Show: "Trip dates changed from Dec 14-20 to Dec 14-21. Check your bookings." | Update trip dates; flag expenses outside new date range for review | Log: "Trip dates changed; expenses reviewed: [list of affected expenses]" |
| **Members added after trip starts** | See "User joins late" above | Show "Added mid-trip" badge; only charge from join date | Same as late join | Same as late join |
| **Members removed after trip starts** | See "User leaves early" above | Show "Removed" badge; settlement with final balance | Same as early leave | Same as early leave |
| **Multiple simultaneous activities** | Expenses can be assigned to specific activity; show activity context | Expense detail shows: "Assigned to: Komodo boat tour (Dec 17)" | Expense has `activityId` field; can filter/group by activity | Log: "Expense linked to activity: [activity name]" |
| **Separate sub-groups (some people do activity X, others do Y)** | Each expense independently tracks participants | Activity 1 (Snorkeling): Alice, Bob. Activity 2 (Spa): Charlie, David. Expenses separate. | Expenses track independently; balances track per-person; no forced grouping | Log: "Expenses tracked for separate groups; no cross-subsidization" |

### AI Processing

| Edge Case | Business Rule | UI Behavior | Backend Behavior | Audit Trail |
|-----------|---------------|-------------|------------------|------------|
| **Incorrect receipt parsing** | User can edit extracted data before confirming | Show extracted data; all fields editable; validation on confirm | Save user-corrected data; flag AI confidence as lower for learning | Log: "AI extraction corrected by user: [changes made]" |
| **Missing items on receipt** | User adds items manually or leaves as-is | Show "3 items extracted" → User can [Add Item] or [Proceed] | Allow custom item entry; validate totals | Log: "Items added manually: [item names]" |
| **Duplicate receipt** | Warn user; suggest merge or skip | Show: "Similar receipt found: Group dinner, Dec 16, ₹3,000. Add anyway?" | Check against existing expenses; don't automatically skip | Log: "Duplicate warning shown; user chose to [add/skip]" |
| **AI confidence is low** | Show confidence %; suggest manual entry or re-upload | "Confidence: 30% (image too blurry). [Retake photo] or [Enter manually]" | Flag confidence in metadata; allow manual override | Log: "Low confidence extraction: 30%; user chose manual entry" |
| **User disagrees with AI** | Full override; AI learns from corrections (optional) | "AI extracted ₹3,000 but receipt shows ₹3,200. [Correct] → ₹3,200 saved." | Accept correction; optionally send feedback for ML retraining | Log: "AI correction: ₹3,000 → ₹3,200; confidence impact: [training note]" |
| **Receipt in multiple currencies** | Warn user; ask which is the trip currency | "Receipt shows: ₹2,000 and $25. Which currency for this trip?" | Create expense in specified currency; note original in metadata | Log: "Multi-currency receipt; user selected: [currency]" |
| **AI cannot identify merchant** | Ask user to enter; don't fail | "I couldn't identify the merchant. Please enter: [text field]" | Accept user input; save for future reference | Log: "Merchant entered manually: [name]" |
| **AI cannot determine participants** | Ask user; show all trip members as options | "Who participated? [Checkboxes for all members]" (pre-populated with common participants) | Require user selection; don't auto-guess | Log: "Participants selected manually (AI couldn't determine)" |

---

## SECTION I: FINANCIAL ARCHITECTURE

### Expense Splitting Models

**Model 1: Equally**
```
Expense: ₹3,000
Participants: Alice, Bob, Charlie
Split: ₹3,000 ÷ 3 = ₹1,000 each

Balances:
- Alice owes ₹1,000
- Bob owes ₹1,000
- Charlie owes ₹1,000
```

**Model 2: By Item**
```
Expense: Group dinner ₹3,000
Items:
- Pasta Carbonara ₹800 → Alice, Bob
- Caesar Salad ₹600 → Charlie
- Wine ₹900 → Everyone (Alice, Bob, Charlie)
- Dessert ₹700 → Bob, Charlie

Breakdown:
- Alice: ₹800 (pasta, shared) + ₹300 (wine 1/3) = ₹1,100
- Bob: ₹800 (pasta, shared) + ₹300 (wine 1/3) + ₹700 (dessert 1/2) = ₹1,800
- Charlie: ₹600 (salad) + ₹300 (wine 1/3) + ₹700 (dessert 1/2) = ₹1,600

Wait, that's ₹4,500 total. Let me recalculate:

Actually:
- Pasta shared by 2 (Alice, Bob): ₹800 ÷ 2 = ₹400 each
- Salad (Charlie): ₹600
- Wine shared by 3: ₹900 ÷ 3 = ₹300 each
- Dessert shared by 2 (Bob, Charlie): ₹700 ÷ 2 = ₹350 each

Total: (400 + 400) + 600 + (300 + 300 + 300) + (350 + 350) = 800 + 600 + 900 + 700 = ₹3,000 ✓

Balances:
- Alice: 400 (pasta) + 300 (wine) = ₹700
- Bob: 400 (pasta) + 300 (wine) + 350 (dessert) = ₹1,050
- Charlie: 600 (salad) + 300 (wine) + 350 (dessert) = ₹1,250
```

**Model 3: Percentage**
```
Expense: ₹3,000
Split:
- Alice: 40% = ₹1,200
- Bob: 35% = ₹1,050
- Charlie: 25% = ₹750
(Total: 100%, sum: ₹3,000)
```

**Model 4: Custom Amounts**
```
Expense: ₹3,000
Split:
- Alice: ₹1,500 (she paid more for her fancy meal)
- Bob: ₹900
- Charlie: ₹600
(Total: ₹3,000)
```

**Key principle:** Splits must always sum to the original expense amount. The system enforces this.

### Balance Calculation

```
For each participant in a trip:

totalOwed = SUM of (their share in every expense where they participated)
totalPaid = SUM of (amount they paid when they were the payer)

balance = totalPaid - totalOwed

Interpretation:
- balance > 0: They've overpaid; they're owed money
- balance = 0: They're even
- balance < 0: They owe money
```

**Example with 4 people:**

```
Expenses:
1. Hotel (Host paid): ₹8,000 split 4 ways = ₹2,000 each
2. Food (Alice paid): ₹3,000 split 3 ways (not Bob) = ₹1,000 each
3. Activities (Bob paid): ₹4,000 split 4 ways = ₹1,000 each

Calculation:

Alice:
  totalOwed = 2,000 (hotel) + 0 (she paid, not participant only) + 1,000 (activities) = 3,000
  totalPaid = 3,000 (food)
  balance = 3,000 - 3,000 = 0 (even)

Bob:
  totalOwed = 2,000 (hotel) + 0 (not food participant) + 1,000 (activities) = 3,000
  totalPaid = 4,000 (activities)
  balance = 4,000 - 3,000 = 1,000 (owed ₹1,000)

Charlie:
  totalOwed = 2,000 (hotel) + 1,000 (food) + 1,000 (activities) = 4,000
  totalPaid = 0
  balance = 0 - 4,000 = -4,000 (owes ₹4,000)

Host:
  totalOwed = 2,000 (hotel, they're a participant) + 1,000 (food) + 1,000 (activities) = 4,000
  totalPaid = 8,000 (hotel)
  balance = 8,000 - 4,000 = 4,000 (owed ₹4,000)

Verification:
  Owed: Bob 1,000 + Host 4,000 = 5,000
  Owes: Charlie 4,000 = 4,000
  
  Hmm, doesn't balance. Let me recalculate...
  
  Actually, the issue is that Alice owes ₹1,000 for food (she paid it but is a participant):
  
  Alice owes ₹1,000 for food she participated in, but she also paid ₹3,000.
  So her balance is: +3,000 (paid) - 1,000 (owes for food) - 2,000 (owes for hotel) - 1,000 (owes for activities) = -1,000
  
  Let me restart with clearer logic:
  
  Alice:
    - Hotel: owes ₹2,000; paid ₹0 (host paid) → net: -₹2,000
    - Food: owes ₹1,000 (she was participant); paid ₹3,000 → net: +₹2,000
    - Activities: owes ₹1,000; paid ₹0 → net: -₹1,000
    - Total balance: -2,000 + 2,000 - 1,000 = -₹1,000 (owes ₹1,000)
  
  Bob:
    - Hotel: owes ₹2,000; paid ₹0 → net: -₹2,000
    - Food: owes ₹0 (not participant); paid ₹0 → net: ₹0
    - Activities: owes ₹1,000; paid ₹4,000 → net: +₹3,000
    - Total balance: -2,000 + 0 + 3,000 = +₹1,000 (owed ₹1,000)
  
  Charlie:
    - Hotel: owes ₹2,000; paid ₹0 → net: -₹2,000
    - Food: owes ₹1,000; paid ₹0 → net: -₹1,000
    - Activities: owes ₹1,000; paid ₹0 → net: -₹1,000
    - Total balance: -2,000 - 1,000 - 1,000 = -₹4,000 (owes ₹4,000)
  
  Host:
    - Hotel: owes ₹2,000; paid ₹8,000 → net: +₹6,000
    - Food: owes ₹1,000 (assuming they ate); paid ₹0 → net: -₹1,000
    - Activities: owes ₹1,000; paid ₹0 → net: -₹1,000
    - Total balance: 6,000 - 1,000 - 1,000 = +₹4,000 (owed ₹4,000)
  
  Verification:
    Owed: Bob +₹1,000 + Host +₹4,000 = +₹5,000
    Owes: Alice -₹1,000 + Charlie -₹4,000 = -₹5,000 ✓ Balanced!
```

### Settlement Simplification

**Problem:** 4 people with complex balance, requires many transactions.

**Solution:** Greedy algorithm to minimize transactions.

```
Balances:
- Alice: -₹1,000 (owes)
- Bob: +₹1,000 (owed)
- Charlie: -₹4,000 (owes)
- Host: +₹4,000 (owed)

Greedy algorithm:
1. Separate into debtors and creditors
   Debtors: Alice (-₹1,000), Charlie (-₹4,000)
   Creditors: Bob (+₹1,000), Host (+₹4,000)

2. Match largest debtor to largest creditor
   Charlie (-₹4,000) → Host (+₹4,000)
   Transaction: Charlie pays Host ₹4,000
   Remaining: Host now 0, Charlie now 0

3. Match remaining
   Alice (-₹1,000) → Bob (+₹1,000)
   Transaction: Alice pays Bob ₹1,000
   Remaining: Bob now 0, Alice now 0

Result:
Transaction 1: Alice pays Bob ₹1,000
Transaction 2: Charlie pays Host ₹4,000

Total: 2 transactions (minimal)
```

**Why greedy works:** It minimizes transactions by always pairing largest pairs first. For most groups (3-6 people), this is optimal or near-optimal.

**Handling rounding:**

```
If split results in ₹3,000 ÷ 3 = ₹1,000.00... (exact)
No issue.

If split results in ₹3,000 ÷ 3 = ₹1,000.00, ₹1,000.00, ₹999.99
(Very small rounding)

Solution:
- Round down to cents throughout
- Last person in settlement absorbs small rounding difference
- Example: If rounding causes -₹0.03 for last person, show: "Charlie pays ₹1,000.03 (absorbs rounding)"

This keeps arithmetic clean and transparent.
```

### Handling Refunds

**Scenario 1: Partial refund (vendor refunds ₹2,000 of ₹3,000 expense)**

```
Original expense: ₹3,000, split 3 ways, each owes ₹1,000

Refund received: ₹2,000

Options:
A) Proportional refund
   Refund ₹2,000 back to each participant proportionally
   Each refund: ₹2,000 ÷ 3 = ₹666.67
   New balance: ₹1,000 - ₹666.67 = ₹333.33 each
   Payer's balance: -₹1,000 (what they paid) + ₹2,000 (refund) + ₹333.33 (their share) = ?
   
   Actually, this is complex. Cleaner approach:

B) Create refund as negative expense
   Original: +₹3,000 expense (split 3 ways)
   Refund: -₹2,000 expense (split 3 ways) = each gets -₹666.67
   Net expense: ₹1,000 (split 3 ways) = each owes ₹333.33
   
   Balances recalculated automatically.
```

**Scenario 2: Full refund**

```
Original expense: ₹3,000 (split 3 ways)
Refund: ₹3,000

Create refund entry: -₹3,000 (split 3 ways)
Result: All participants' balances for this expense become zero.
Payer's balance: -₹3,000 (what they paid) + ₹3,000 (refund) = ₹0
```

### Multiple Currencies

**Approach 1: Single currency trip**

```
Trip declared in INR.
All expenses in INR.
All settlements in INR.
Simple.
```

**Approach 2: Multi-currency trip**

```
Trip declared in "mixed" or primary (INR).
Some expenses in INR, some in USD, some in EUR.

Settlement:
1. Store original currency for each expense.
2. At settlement time, convert all to primary currency using current (or pre-agreed) rate.
3. Show both original and converted.

Display:
  "Alice's expenses:
   - ₹8,000 (hotel)
   - $200 USD (food, ≈ ₹16,700 at 83.5 rate)
   - €50 (gift, ≈ ₹4,150 at 88 rate)
   
   Total: ₹28,850"

Conversion rate:
- Store rate used in settlement for transparency.
- Allow host to set rate manually or use current rate.
- Show "Conversion at rate: INR/USD = 83.5" for audit.

Rounding:
- Convert each expense; round to cents.
- Small rounding differences absorbed by last person (same as single currency).
```

---

## SECTION J: MONGODB DATA MODELS

### Core Collections

#### User
```javascript
{
  _id: ObjectId,
  email: string,
  passwordHash: string,
  name: string,
  avatar?: string,
  createdAt: Date,
  updatedAt: Date
}
```

#### Trip
```javascript
{
  _id: ObjectId,
  hostId: ObjectId (ref User),
  name: string,
  destination: string,
  startDate: Date,
  endDate: Date,
  currency: string (e.g., "INR", "USD"),
  status: string (PLANNING | ACTIVE | COMPLETED | CANCELLED),
  
  // Metadata
  budget?: number,
  approximateCostPerPerson?: number,
  
  // Settings
  settings: {
    allowMemberExpenses: boolean (default true),
    requireHostApproval: boolean (default false),
    allowMultipleCurrencies: boolean (default false),
    settlementMethod: string (SIMPLIFY | DIRECT)
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

**Why `settings` are embedded:** Trip settings are rarely queried independently; they belong with the trip.

#### TripMember
```javascript
{
  _id: ObjectId,
  tripId: ObjectId (ref Trip),
  userId: ObjectId (ref User),
  
  // Participation
  status: string (INVITED | ACCEPTED | ACTIVE | LEFT | REMOVED),
  joinedDate: Date (when they actually joined),
  leftDate?: Date (if they left early),
  
  // Financial
  totalOwed: number (calculated, stored for quick access),
  totalPaid: number (calculated, stored for quick access),
  balance: number (totalPaid - totalOwed),
  
  createdAt: Date,
  updatedAt: Date
}
```

**Why store calculated fields:** Avoid recalculating for every query. Update when expenses change.

#### Expense
```javascript
{
  _id: ObjectId,
  tripId: ObjectId (ref Trip),
  payerId: ObjectId (ref TripMember) - who actually paid,
  
  // Description
  description: string (e.g., "Group dinner"),
  merchant?: string,
  category?: string (ACCOMMODATION | FOOD | TRANSPORT | ACTIVITY | OTHER),
  
  // Amount
  amount: number,
  currency: string,
  originalCurrency?: string (if different),
  exchangeRate?: number (if currency converted),
  
  // Details
  date: Date,
  receiptUrl?: string (s3 link to uploaded receipt),
  aiParsed: boolean,
  aiConfidence?: number (0-100),
  
  // Participants
  participants: [
    {
      memberId: ObjectId (ref TripMember),
      share: number (their portion),
      shareType: string (EQUAL | CUSTOM | PERCENTAGE | BY_ITEM),
      customAmount?: number (if CUSTOM),
      customPercentage?: number (if PERCENTAGE)
    }
  ],
  
  // Status
  status: string (PENDING | APPROVED | POSTED | REFUNDED | DELETED),
  approvalStatus?: string (PENDING_APPROVAL | APPROVED | REJECTED) - if host approval required,
  
  // Audit
  editHistory: [
    {
      editedAt: Date,
      editedBy: ObjectId,
      changes: { field: string, before: any, after: any }[]
    }
  ],
  
  createdAt: Date,
  updatedAt: Date
}
```

**Why participants are embedded:** Each expense has a fixed set of participants and amounts; no need to reference separately.

**Why editHistory is embedded:** Audit trail belongs with the expense.

#### Payment / Repayment
```javascript
{
  _id: ObjectId,
  tripId: ObjectId (ref Trip),
  
  fromMemberId: ObjectId (ref TripMember),
  toMemberId: ObjectId (ref TripMember),
  
  amount: number,
  currency: string,
  
  // Payment method
  method: string (CASH | VENMO | PAYPAL | BANK_TRANSFER | OTHER),
  transactionId?: string (external app ID, if applicable),
  
  // Status
  status: string (RECORDED | PENDING | COMPLETED | FAILED),
  
  // Context
  reason?: string (e.g., "Settlement of trip balance"),
  note?: string,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Why separate from Expense:** Payments can be independent (person A pays person B outside of formal settlement).

#### Settlement
```javascript
{
  _id: ObjectId,
  tripId: ObjectId (ref Trip),
  status: string (IN_PROGRESS | FINALIZED),
  
  // Calculated at settlement time
  balances: {
    memberId: ObjectId (ref TripMember),
    balance: number (calculated)
  }[],
  
  transactions: [
    {
      from: ObjectId (memberId),
      to: ObjectId (memberId),
      amount: number,
      status: string (PENDING | COMPLETED),
      paymentId?: ObjectId (ref Payment)
    }
  ],
  
  // Metadata
  calculatedAt: Date,
  finalizedAt?: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Why separate collection:** Settlement is calculated once and stored for reference/history.

#### Bill / ReceiptData (Transient, optional)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref User),
  tripId: ObjectId (ref Trip),
  
  // Uploaded file
  fileUrl: string (s3 link),
  fileName: string,
  uploadedAt: Date,
  
  // AI extraction
  extractedData: {
    merchant?: string,
    date?: Date,
    currency?: string,
    items: [{ name: string, quantity: number, price: number }]?,
    subtotal?: number,
    tax?: number,
    discount?: number,
    tip?: number,
    total?: number,
    confidence: number (0-100)
  },
  
  // Status
  status: string (UPLOADED | PROCESSING | COMPLETED | FAILED),
  error?: string (if failed),
  
  // Link to expense (after user confirms)
  expenseId?: ObjectId (ref Expense),
  
  createdAt: Date,
  updatedAt: Date
}
```

**Why separate:** Bill is temporary; once it becomes an Expense, it's no longer needed. Keeps Expense collection clean.

#### AuditLog
```javascript
{
  _id: ObjectId,
  tripId: ObjectId (ref Trip),
  
  action: string (EXPENSE_CREATED | EXPENSE_EDITED | EXPENSE_DELETED | MEMBER_ADDED | MEMBER_LEFT | etc),
  actorId: ObjectId (ref User),
  target: { type: string, id: ObjectId }, // what was changed
  
  changes?: {
    field: string,
    before: any,
    after: any
  }[],
  
  reason?: string,
  
  createdAt: Date
}
```

**Why separate:** Audit log is append-only; useful for transparency and debugging.

#### Notification (Optional, can use message queue instead)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref User),
  tripId: ObjectId (ref Trip),
  
  type: string (EXPENSE_ADDED | BALANCE_CHANGED | SETTLEMENT_READY | etc),
  title: string,
  message: string,
  
  relatedEntity: { type: string, id: ObjectId }, // links to Expense, Payment, etc
  
  read: boolean,
  readAt?: Date,
  
  channels: [string], // IN_APP | EMAIL | PUSH
  
  createdAt: Date
}
```

---

### Important Indexes

```javascript
// User
db.users.createIndex({ email: 1 }, { unique: true })

// Trip
db.trips.createIndex({ hostId: 1, status: 1 })
db.trips.createIndex({ startDate: 1, endDate: 1 })

// TripMember
db.tripMembers.createIndex({ tripId: 1, userId: 1 }, { unique: true })
db.tripMembers.createIndex({ tripId: 1, status: 1 })
db.tripMembers.createIndex({ userId: 1, status: 1 })

// Expense
db.expenses.createIndex({ tripId: 1, date: -1 })
db.expenses.createIndex({ tripId: 1, payerId: 1 })
db.expenses.createIndex({ tripId: 1, status: 1 })
db.expenses.createIndex({ tripId: 1, "participants.memberId": 1 })

// Payment
db.payments.createIndex({ tripId: 1, status: 1 })
db.payments.createIndex({ fromMemberId: 1, toMemberId: 1 })

// Settlement
db.settlements.createIndex({ tripId: 1, status: 1 })

// AuditLog
db.auditLogs.createIndex({ tripId: 1, createdAt: -1 })
```

---

### Relationship Diagram

```
User
  ├─ creates → Trip (hostId)
  ├─ joins → TripMember (userId)
  └─ pays → Payment (fromMemberId, toMemberId)

Trip
  ├─ has ← TripMember (tripId)
  ├─ has ← Expense (tripId)
  ├─ has ← Payment (tripId)
  └─ has ← Settlement (tripId)

TripMember
  ├─ pays → Expense (payerId)
  ├─ participates in → Expense (via participants array)
  └─ owes ← Payment (fromMemberId, toMemberId)

Expense
  ├─ paid by → TripMember (payerId)
  ├─ includes → TripMember (participants[].memberId)
  └─ has → Bill (fileUrl reference)

Settlement
  ├─ calculates → TripMember (balances[].memberId)
  └─ has → Payment (transactions[].paymentId)

AuditLog
  ├─ tracks changes to any document
  └─ linked by (target.type, target.id)
```

---

### Data Consistency Rules

```
Rule 1: Expense.participants must contain at least 1 member
Rule 2: Sum of Expense.participants[].share === Expense.amount
Rule 3: TripMember.balance must equal SUM(totalPaid) - SUM(totalOwed)
Rule 4: Settlement.balances[x].balance == calculated balance (for transparency)
Rule 5: All Currency fields must match Trip.currency or be convertible
Rule 6: Expense.date must be between Trip.startDate and Trip.endDate (or soon after)
Rule 7: TripMember.status transitions: INVITED → ACCEPTED → ACTIVE → LEFT
Rule 8: Deleted expenses must maintain historical audit log
```

---

## SECTION K: BACKEND ARCHITECTURE

### Core Services

#### ExpenseService
```
Operations:
- createExpense(tripId, expenseData)
  → Validate participants, amount, split
  → Create Expense document
  → Update TripMember balances
  → Create AuditLog
  → Emit WebSocket event for real-time update
  
- editExpense(expenseId, changes)
  → Recalculate affected TripMember balances
  → Store editHistory
  → Create AuditLog
  → Notify affected members
  
- deleteExpense(expenseId)
  → Reverse all participant debits
  → Create AuditLog
  → Notify affected members
  
- getExpensesByTrip(tripId, filters?)
  → Return expenses with filters: status, date range, category
  
- getExpensesByMember(tripId, memberId)
  → Return only expenses where memberId participated or paid
```

#### BalanceService
```
Operations:
- calculateMemberBalance(memberId, tripId)
  → Query all Expenses where memberId participated
  → Sum totalOwed = all their shares
  → Query all Expenses where memberId paid
  → Sum totalPaid
  → Return balance = totalPaid - totalOwed
  → Cache in TripMember.balance
  
- recalculateAllBalances(tripId)
  → For each TripMember in trip:
    → Calculate balance
    → Update TripMember document
  → Return updated balances
  
- getBalanceBreakdown(memberId, tripId)
  → Return detailed breakdown: who they owe, who owes them
```

#### SettlementService
```
Operations:
- calculateSettlement(tripId)
  → Get all TripMembers and their balances
  → Separate into debtors and creditors
  → Apply greedy algorithm to minimize transactions
  → Create Settlement document (not finalized)
  → Return proposed transactions
  
- finalizeSettlement(tripId)
  → Create Settlement with status FINALIZED
  → Generate report
  → Send notifications to all members
  → Allow Payment recording against settlement transactions
  
- recordPayment(settlementId, fromMemberId, toMemberId, amount)
  → Create Payment document
  → Mark settlement transaction as COMPLETED
  → Update TripMember balances
  → Emit notification
```

#### ReceiptParsingService (AI)
```
Operations:
- parseReceipt(fileUrl)
  → Use OCR/ML model (e.g., Claude vision, AWS Textract)
  → Extract: merchant, date, items, amounts, tax, total, currency
  → Return structured data + confidence score
  → Handle failures gracefully (return low confidence, let user override)
  
- validateExtraction(extractionData)
  → Check: items sum ≈ total (±5%)
  → Check: currency is valid
  → Check: date is valid
  → Return validation result
```

#### NotificationService
```
Operations:
- notify(userId, type, context)
  → Create Notification document
  → Send via configured channels (in-app, email, push)
  → Track read status
  
- handleExpenseAdded(expenseId)
  → Identify affected members
  → Send: "Alice added expense: ₹3,000 group dinner (you owe ₹1,000)"
  
- handleBalanceChanged(tripId, memberId)
  → Send: "Your balance changed: you now owe ₹2,000"
  
- handleSettlementReady(tripId)
  → Send: "Trip ended. Settlement ready. You owe ₹4,200 to Bob."
```

#### MoneyRequestService
```
Operations:
- createRequest(fromMemberId, toMemberId, amount, message)
  → Create MoneyRequest document (not defined yet, but similar to Payment)
  → Notify recipient
  
- acceptRequest(requestId)
  → Convert to Payment
  → Update balances
  
- declineRequest(requestId)
  → Mark as declined
  → Notify requester
```

---

### API Endpoints (RESTful)

#### Trip Management
```
POST   /api/trips
       Create trip
       Body: { name, destination, startDate, endDate, budget, currency }
       Returns: Trip with tripId

GET    /api/trips/:tripId
       Get trip details
       Returns: Trip + summary stats

PUT    /api/trips/:tripId
       Update trip (host only)
       Body: { name, destination, startDate, endDate, budget, status, settings }
       Returns: Updated Trip

DELETE /api/trips/:tripId
       Cancel trip (host only)
```

#### Members
```
POST   /api/trips/:tripId/members
       Invite member
       Body: { email }
       Returns: TripMember with status INVITED

GET    /api/trips/:tripId/members
       List all members
       Returns: [TripMember]

PUT    /api/trips/:tripId/members/:memberId
       Update member (host) or accept invitation (member)
       Body: { status } or { action: 'accept' }
       Returns: Updated TripMember

DELETE /api/trips/:tripId/members/:memberId
       Remove member (host)
       Returns: { success }
```

#### Expenses
```
POST   /api/trips/:tripId/expenses
       Create expense
       Body: { payerId, description, amount, currency, participants, date }
       Returns: Expense

GET    /api/trips/:tripId/expenses
       List expenses
       Query: ?status=&category=&startDate=&endDate=
       Returns: [Expense]

GET    /api/trips/:tripId/expenses/:expenseId
       Get expense detail
       Returns: Expense with full breakdown

PUT    /api/trips/:tripId/expenses/:expenseId
       Edit expense
       Body: { changes... }
       Returns: Updated Expense

DELETE /api/trips/:tripId/expenses/:expenseId
       Delete expense
       Returns: { success }
```

#### Receipts & AI
```
POST   /api/receipts/upload
       Upload receipt image/PDF
       Body: FormData { file, tripId }
       Returns: { billId, status }

GET    /api/receipts/:billId
       Get extraction status & data
       Returns: Bill { extractedData, status, confidence }

PUT    /api/receipts/:billId
       Correct extraction; confirm
       Body: { corrections to extractedData }
       Returns: { confirmed: true }

POST   /api/receipts/:billId/toExpense
       Convert confirmed receipt to Expense
       Body: { participants, splitMethod }
       Returns: Expense
```

#### Balances
```
GET    /api/trips/:tripId/balances
       Get all member balances
       Returns: [{ memberId, balance, totalOwed, totalPaid }]

GET    /api/trips/:tripId/balances/:memberId
       Get specific member's balance & breakdown
       Returns: { memberId, balance, owes: [{ toId, amount }], owed: [{ fromId, amount }] }
```

#### Settlement
```
GET    /api/trips/:tripId/settlement
       Calculate settlement (doesn't finalize)
       Returns: { balances, proposedTransactions, status: IN_PROGRESS }

POST   /api/trips/:tripId/settlement/finalize
       Finalize settlement
       Returns: Settlement { transactions, status: FINALIZED }

POST   /api/trips/:tripId/settlement/record-payment
       Record a payment against settlement
       Body: { from, to, amount, method, transactionId }
       Returns: { payment, settlementStatus }
```

#### Reports
```
GET    /api/trips/:tripId/report
       Get trip report
       Returns: { totalCost, byCategory, perPerson, major expenses, stats }

GET    /api/trips/:tripId/report/export
       Export as PDF
       Returns: PDF file
```

#### Notifications
```
GET    /api/notifications
       List user's notifications
       Query: ?tripId=&read=false
       Returns: [Notification]

PUT    /api/notifications/:notificationId
       Mark as read
       Body: { read: true }
       Returns: Notification
```

---

## SECTION L: FRONTEND ARCHITECTURE

### State Management (Redux)

```
Store structure:
{
  auth: {
    user: User | null,
    isLoading: boolean,
    error: string | null
  },
  
  trips: {
    currentTrip: Trip | null,
    tripList: [Trip],
    isLoading: boolean
  },
  
  members: {
    [tripId]: {
      members: [TripMember],
      balances: {
        [memberId]: { balance, totalOwed, totalPaid }
      }
    }
  },
  
  expenses: {
    [tripId]: {
      list: [Expense],
      isLoading: boolean,
      filters: { status, category, dateRange }
    }
  },
  
  receipt: {
    uploadStatus: UPLOADING | PROCESSING | COMPLETED | ERROR,
    extractedData: {},
    confidence: number
  },
  
  settlement: {
    [tripId]: {
      balances: {},
      proposedTransactions: [],
      status: IN_PROGRESS | FINALIZED
    }
  },
  
  notifications: {
    list: [Notification],
    unreadCount: number
  }
}
```

### Component Structure

```
App/
├─ Layout/
│  ├─ Navigation.jsx (main nav: Dashboard, Expenses, People, Settlement)
│  ├─ Header.jsx (trip name, status, quick actions)
│  └─ Sidebar.jsx (secondary nav: Itinerary, Budget, Settings)
│
├─ Pages/
│  ├─ HomePage.jsx (list of trips)
│  ├─ TripDashboard.jsx (main dashboard)
│  ├─ ExpensesPage.jsx
│  ├─ PeoplePage.jsx
│  ├─ SettlementPage.jsx
│  ├─ ItineraryPage.jsx
│  ├─ BudgetPage.jsx
│  ├─ ReportPage.jsx
│  └─ SettingsPage.jsx
│
├─ Expenses/
│  ├─ ExpenseForm.jsx (wizard for adding expense)
│  ├─ ExpenseList.jsx (list view)
│  ├─ ExpenseDetail.jsx (click to view/edit)
│  ├─ ExpenseEditor.jsx (edit form)
│  └─ SplitCalculator.jsx (calculate splits)
│
├─ Receipts/
│  ├─ ReceiptUpload.jsx (drag-drop upload)
│  ├─ ReceiptParser.jsx (AI processing UI)
│  ├─ ExtractionReview.jsx (review AI output)
│  └─ ItemEditor.jsx (edit parsed items)
│
├─ Settlement/
│  ├─ SettlementSummary.jsx (balances table)
│  ├─ TransactionList.jsx (proposed transactions)
│  └─ PaymentTracker.jsx (record payments)
│
├─ Common/
│  ├─ Modal.jsx
│  ├─ Notification.jsx
│  ├─ LoadingSpinner.jsx
│  ├─ Charts.jsx (for budget, spending)
│  ├─ Avatar.jsx
│  └─ CurrencyInput.jsx
│
└─ Hooks/
   ├─ useTrip.js (fetch trip data)
   ├─ useMembers.js (fetch members & balances)
   ├─ useExpenses.js (CRUD expenses)
   ├─ useReceipt.js (upload & parse)
   └─ useSettlement.js (calculate & finalize)
```

### Key Components & Interactions

#### ExpenseForm (Wizard)
```jsx
ExpenseForm (step-based):
  [Step 1: Method]
    - Manual / Upload Receipt / Take Photo
    - OnSelect → proceed to Step 2 or upload
  
  [Step 2: Payer]
    - Dropdown: You / Alice / Bob
    - OnSelect → Step 3
  
  [Step 3: Participants]
    - Checkboxes: [✓] You, [✓] Alice, [ ] Bob
    - OnChange → recalculate split
  
  [Step 4: Amount]
    - Input: ₹3,000
    - OnChange → validate, recalculate split
  
  [Step 5: Split Method]
    - Radio: Equally / By Item / Custom / Percentage
    - OnSelect → show split breakdown
  
  [Step 6: Review]
    - Summary of all choices
    - [Confirm] → POST /api/expenses

Each step has [Back] to edit.
```

#### ReceiptParser
```jsx
ReceiptParser (async workflow):
  1. Upload
     - DragDrop component
     - OnDrop → POST /api/receipts/upload
  
  2. Processing
     - Loading spinner
     - Polling GET /api/receipts/:billId until status !== PROCESSING
  
  3. Review
     - Display extractedData
     - All fields are inputs (editable)
     - Confidence indicator
     - Validation: items sum ≈ total
  
  4. Convert to Expense
     - [Confirm & Continue] → ExpenseForm with pre-filled data
```

#### DashboardBalancesWidget
```jsx
BalancesWidget:
  - Real-time updates via WebSocket
  - Shows: You are owed ₹X / You owe ₹Y / Net: ±₹Z
  - Color coding: Red (owe), Green (owed), Neutral (even)
  - Click → SettlementPage for details
```

#### SettlementPage
```jsx
Settlement:
  1. Balances Table
     - Name | Paid | Owes | Net
     - Color: Red (owe), Green (owed)
  
  2. Your Settlement
     - You are owed ₹4,200
     - Alice owes you ₹1,000
     - Bob owes you ₹1,500
     - Charlie owes you ₹1,700
  
  3. Transactions
     - Simplified list of who sends to whom
     - [Mark as Paid] for each
  
  4. Export
     - [Download PDF]
     - [Email to all members]
```

---

## SECTION M: REAL-TIME ARCHITECTURE

### When WebSocket/Real-Time Updates Justify Complexity

**Worth it:**
1. **Balance updates** → Most important; users check frequently
2. **Expense added** → Team should see immediately
3. **Settlement ready** → Critical notification
4. **Member joined** → Affects expense calculations

**Not worth it:**
1. **Itinerary updates** → Rare; polling is fine
2. **Settings changes** → Host-only; not time-sensitive
3. **Notifications** → Email + in-app polling is sufficient
4. **Reports** → Batch generated; real-time not needed

### Recommended: Socket.IO with Rooms

```javascript
// Server (Node.js + Socket.IO)

io.on('connection', (socket) => {
  socket.on('joinTrip', (tripId) => {
    socket.join(`trip:${tripId}`);
  });
  
  // When expense is created
  expenseService.createExpense(...).then(() => {
    io.to(`trip:${tripId}`).emit('expenseAdded', {
      expense,
      affectedMembers: [...]
    });
  });
  
  // When balance changes
  balanceService.recalculateAllBalances(tripId).then((balances) => {
    io.to(`trip:${tripId}`).emit('balancesUpdated', balances);
  });
  
  socket.on('disconnect', () => {
    // cleanup
  });
});
```

```javascript
// Client (React)

useEffect(() => {
  const socket = io();
  
  socket.emit('joinTrip', tripId);
  
  socket.on('expenseAdded', (data) => {
    dispatch(addExpense(data.expense));
    dispatch(updateBalances(data.balances));
    // UI updates automatically via Redux
  });
  
  socket.on('balancesUpdated', (balances) => {
    dispatch(updateBalances(balances));
  });
  
  return () => socket.disconnect();
}, [tripId]);
```

### Fallback: Polling (If WebSocket too complex)

```javascript
// Poll every 5-10 seconds for expense list & balances
const [expenses, setExpenses] = useState([]);

useEffect(() => {
  const interval = setInterval(async () => {
    const data = await fetch(`/api/trips/${tripId}/expenses`).then(r => r.json());
    setExpenses(data);
  }, 5000);
  
  return () => clearInterval(interval);
}, [tripId]);
```

**Trade-off:** Polling is simpler but less responsive. For most use cases, polling every 5-10 seconds is acceptable.

**Recommendation for MVP:** Start with polling. Add WebSocket later if needed.

---

## SECTION N: NOTIFICATIONS

### Notification Types & Channels

| Event | Type | In-App | Email | Push | Timing |
|-------|------|--------|-------|------|--------|
| **You were added to a trip** | INVITED | Yes | Yes | Yes | Immediately |
| **You were included in an expense** | EXPENSE_ADDED | Yes | Optional | Optional | Immediately |
| **Expense edited (affects you)** | EXPENSE_EDITED | Yes | Optional | No | Immediately |
| **Your balance changed** | BALANCE_CHANGED | Yes (subtle) | No | Optional | Real-time or batched |
| **Someone requested money from you** | MONEY_REQUEST | Yes | Yes | Yes | Immediately |
| **Trip budget exceeded** | BUDGET_ALERT | Yes | Optional | No | Immediately |
| **AI found a savings** | RECOMMENDATION | Yes | No | No | When added |
| **Settlement is ready** | SETTLEMENT_READY | Yes | Yes | Yes | Trip end |
| **Someone marked payment as paid** | PAYMENT_RECEIVED | Yes | Optional | No | Immediately |

### Notification Preferences

**User settings:**
```
For each notification type:
  [ ] In-app
  [ ] Email
  [ ] Push

Default: In-app + Email for critical (INVITED, SETTLEMENT_READY, MONEY_REQUEST)
         In-app only for informational (EXPENSE_ADDED, BALANCE_CHANGED)
```

### Key Design Principles

1. **Don't spam.** Batch updates if many expenses added in short time.
2. **Be specific.** "Alice added 'Group dinner' (₹3,000); you owe ₹1,000" not "Expense added."
3. **Actionable.** Link to relevant page (trip dashboard, settlement, etc).
4. **Optional.** User controls all channels; can disable any.
5. **Unobtrusive.** In-app notifications don't block UI; appear as badges or toasts.

---

## SECTION O: MVP vs. V2 vs. Future

### MVP (3-6 weeks)

**Must have:**
- User auth (email + password)
- Create trip, invite members
- Add expense (manual entry only)
- Expense list & edit
- Balance tracking & display
- Settlement calculation & simplification
- Basic report (spending by category, per-person)

**Key features:**
- Dashboard with balances, stats
- Expense wizard (5-step flow)
- People tab (members & balances)
- Settlement tab (simplified transactions)
- Notifications (in-app only)
- AuditLog (for transparency)

**Tech stack:**
- MongoDB, Express, React, Node
- No WebSocket (polling or manual refresh)
- No AI (manual receipt entry)
- Basic styling (Tailwind CSS or similar)

**Out of scope:**
- AI receipt parsing
- Money-saving recommendations
- Itinerary management
- Multi-currency (single currency only)
- Money requests between members
- Advanced split methods (by item, custom)

---

### V2 (1-2 months after MVP)

**Additions:**
- **AI Receipt Parsing**
  - Upload photo/PDF
  - Extract: merchant, items, amounts, tax
  - User confirmation workflow
  
- **Itinerary Management**
  - Add activities with dates
  - Link expenses to activities
  - Budget tracking per activity
  
- **Money Requests**
  - "Request ₹1,000 from Alice"
  - Acceptance / decline workflow
  - Integrated into settlement
  
- **Advanced Splits**
  - Split by item
  - Custom amounts
  - Percentage split
  
- **Multi-Currency**
  - Support multiple currencies per trip
  - Conversion at settlement
  - Exchange rate transparency
  
- **Improved UX**
  - WebSocket for real-time updates
  - Better mobile experience
  - Drag-drop for expense editing
  
- **Reports**
  - PDF export
  - Email summary
  - Spending charts

---

### Advanced / Future

**Longer-term:**
- **AI Recommendations**
  - Accommodation optimization
  - Transport cost savings
  - Budget forecasting
  
- **Social features**
  - Trip photos/gallery
  - Comments on expenses
  - Chat for trip discussion
  
- **Payment integration**
  - Venmo/PayPal API for direct settlement
  - Payment status tracking
  - Automatic notifications when paid
  
- **Recurring trips**
  - Template previous trips
  - Quick re-invite members
  
- **Advanced analytics**
  - Spending trends over multiple trips
  - Savings opportunities across trips
  
- **Mobile app**
  - Native iOS/Android
  - Offline receipt capture
  - Push notifications
  
- **Admin dashboard** (for teams)
  - Manage multiple trips
  - Bulk operations

---

## SECTION P: BIGGEST UX RISKS & Mitigations

### Risk 1: Overwhelming Feature Set

**Problem:** Users see too many options (itinerary, budget, expenses, settlement, reports) and don't know what to do.

**Mitigation:**
- Progressive disclosure: Show only critical tabs (Expenses, People, Settlement)
- Dashboard answers key questions immediately (balance, budget, action items)
- Advanced features (Itinerary, Budget tracking) hidden under tab or settings
- First-time users see a 3-step onboarding: Create trip → Invite members → Add first expense

---

### Risk 2: Complex Expense Splitting

**Problem:** Users don't understand how to split unequally or by item; they create multiple expenses instead.

**Mitigation:**
- Default to "Equally" (handles 80% of cases)
- Advanced split methods revealed only when user clicks "Custom"
- Show live preview: "Everyone pays ₹1,000"
- Each step of wizard shows clear outcome
- Hover help: "Split equally by default. Click 'Custom' for other options."

---

### Risk 3: Settlement Confusion

**Problem:** Final settlement shows a confusing list of transactions. Users don't know if they calculated correctly.

**Mitigation:**
- Show both: "Balance table" (accounting view) + "Your settlement" (personal view)
- Personal view shows: "You are owed ₹4,200. Alice owes ₹1,000, Bob owes ₹1,500, Charlie owes ₹1,700."
- Show how calculated: "Total spent: ₹32,000. You paid: ₹12,000. Your fair share: ₹8,000. Difference: ₹4,000 (owed)."
- Option to download detailed report

---

### Risk 4: Real-Time Updates Causing Confusion

**Problem:** If user is editing an expense and simultaneously another user adds an expense, balance updates may confuse them.

**Mitigation:**
- Prevent editing while another user is editing (pessimistic locking or toast warning)
- Balance updates are subtle (not disruptive)
- User can manually refresh if they think something changed
- Email notification after trip ends with final settlement

---

### Risk 5: Edge Cases Silently Breaking

**Problem:** User leaves trip; system doesn't recalculate expenses; they're charged for activities they didn't attend.

**Mitigation:**
- When user leaves, show warning: "You'll be charged for [list of future activities]. Continue?"
- Future expenses automatically exclude departed members
- Past expenses remain unchanged (historical accuracy)
- Settlement shows "Charlie (left Dec 18)" with their final balance

---

### Risk 6: AI Receipt Parsing Failing Silently

**Problem:** User uploads receipt, AI confidence is 10%, but user doesn't notice and confirms bad data.

**Mitigation:**
- Show confidence score prominently: "Confidence: 45% (Low)"
- If confidence < 50%, recommend: "Image too blurry. [Retake photo] or [Enter manually]"
- All extracted fields are editable
- Validation: "Items (₹1,800) don't match total (₹3,000). Please review."
- User must explicitly confirm before data is saved

---

### Risk 7: Currency Handling

**Problem:** Trip in INR, expense in USD; exchange rates fluctuate; settlement is confusing.

**Mitigation (MVP):** Don't support multi-currency. Force single currency at trip creation.
**Mitigation (V2+):** Show both original and converted amounts. Use trip's default rate (editable). Log conversion for audit.

---

### Risk 8: Multiple Participants, Complex Splits

**Problem:** User wants to split dinner unequally (Alice ate expensive meal, Bob ate cheap meal); they don't know how.

**Mitigation:**
- Wizard offers options: Equally / By Item / Custom
- "By Item" is selected by default if AI extracted items
- User drags items to participants: Pasta → Alice, Salad → Bob, Wine → Everyone
- System calculates and shows: "Alice ₹800, Bob ₹600"
- Visual clarity prevents errors

---

## SECTION Q: IMPROVEMENTS TO ORIGINAL IDEA

### Major Improvement 1: Simplify the "Add Expense" Flow

**Original idea:**
```
Add expense → Who paid? → Who participated? → Amount? → Split method → Confirm
```

**Problem:** 6 steps feels long, especially on mobile.

**Improvement:**
```
Quick entry (for 90% of cases):
1. Enter amount: ₹3,000
2. Select who paid: You
3. Select who participated: [Checkboxes, default to everyone]
4. [Confirm]

Advanced (click "Custom" if needed):
- Split method (equally, by item, custom, percentage)
- Edit each participant's share

Result: Most expenses take 10 seconds. Complex ones take 30 seconds. Default is "equally" (simplest).
```

**Why better:** Reduces cognitive load; most trips have simple equal splits; advanced options are discoverable but not forced.

---

### Major Improvement 2: Emphasize "Your Balance" Above Everything

**Original idea:** Dashboard shows stats, expenses, action items.

**Problem:** Users don't immediately know "How much do I owe?"

**Improvement:**
```
TOP OF DASHBOARD (Biggest, Clearest):
┌─────────────────────────────────┐
│     YOUR BALANCE                │
│     You owe: ₹4,200             │
│     (or "You are owed: ₹2,000") │
└─────────────────────────────────┘

Below that: Stats, action items, recent expenses
```

**Why better:** Answers the #1 question ("How much do I owe?") before anything else. Color coding (red = owe, green = owed) is instant visual feedback.

---

### Major Improvement 3: Remove Explicit "Itinerary" from MVP

**Original idea:** Host creates itinerary with activities and dates.

**Problem:** 
- Not everyone uses itineraries (just want expense tracking)
- Adds complexity if not needed
- Overlaps with activities in expense management

**Improvement:**
- Skip itinerary in MVP
- Expenses are grouped by category (Food, Accommodation, Activities, etc.)
- Optional: Add "Activity" field to expenses: "Komodo tour - ₹4,000"
- In V2+, add formal itinerary if demand warrants

**Why better:** Reduces scope; users who need itinerary can still track via expense categories.

---

### Major Improvement 4: Member-Added Expenses Don't Require Host Approval

**Original idea:** Host can require approval for all member expenses.

**Problem:** Approval workflow slows down trip; adds friction; rarely needed.

**Improvement:**
- Default: Members can add expenses freely
- All members see all expenses immediately (real-time)
- Host can still edit/delete if needed
- Only "approval" is for flagging suspicious expenses (e.g., "This charge seems high")

**Why better:** Trust-based model; faster; avoids bottleneck; host retains oversight without blocking.

---

### Major Improvement 5: Don't Force Settlement at Trip End

**Original idea:** After trip, show settlement; users must record payments.

**Problem:** 
- Users might not settle immediately (different timezones, delayed payments)
- Forcing settlement creates pressure
- Trip should remain "open" for flexible settlement

**Improvement:**
- At trip end, show "Settlement calculated" but don't force action
- Users can record payments whenever (trip end + 30 days, 60 days, never)
- Each payment is recorded independently
- Trip status shows "Pending settlement" (not alarming)
- Email reminder 7 days after trip end

**Why better:** Realistic; reduces pressure; still tracks payments; allows flexible settlement.

---

### Major Improvement 6: Deemphasize "Host vs. Member" Roles

**Original idea:** Host creates trip, manages everything. Members are passive.

**Problem:** Creates hierarchy; members want autonomy; feels rigid.

**Improvement:**
- **Host:** Creates trip, invites members, can edit any expense (with audit log), approves settlement
- **Members:** Can add expenses, request money, edit their own expenses, see everything
- **No "approval" for member expenses by default** (trust-based)
- Both can see all financial data equally

**Why better:** More collaborative; feels less like "host controls"; realistic for friend groups where trust is assumed.

---

### Major Improvement 7: "Money Requests" as First-Class Feature

**Original idea:** Mentioned briefly; handled after settlement.

**Problem:** Mid-trip balance requests are common (Alice: "Bob, I paid ₹1,000 for your food, send me back")

**Improvement:**
- Add "Request Money" button on dashboard
- Form: "Who do you want to request from?" → Amount → Message
- Recipient gets notification: "Alice requested ₹1,000 from you"
- Options: Accept / Decline / Negotiate amount
- Auto-incorporates into final settlement

**Why better:** Handles real-world behavior; reduces surprises at settlement time.

---

### Major Improvement 8: "Budget" is Aspirational, Not Enforced

**Original idea:** Host sets budget; system warns if exceeded.

**Problem:** Real trips often exceed budget; warnings feel accusatory.

**Improvement:**
- Budget is optional ("How much are you hoping to spend?")
- Show: "You're at 85% of budget" (not alarming)
- Show: "At current pace, you'll spend ₹38,000 (₹3,000 over budget)"
- No "Budget exceeded!" warnings
- Framing: Informational, not judgmental

**Why better:** Realistic; provides useful context without causing stress.

---

### Major Improvement 9: Currency Defaults to Destination

**Original idea:** User must select currency manually.

**Problem:** Extra step; error-prone.

**Improvement:**
- Host enters destination
- App auto-suggests currency (Bali → INR, Bangkok → THB, NYC → USD)
- User can override if needed
- All expenses default to trip currency (but can be marked as other currency)

**Why better:** One less step; fewer currency mistakes.

---

### Major Improvement 10: Notification Defaults are Smart

**Original idea:** User controls every notification channel.

**Problem:** Overwhelming settings; most users don't customize.

**Improvement:**
- **Smart defaults:**
  - Trip invitation → Email + In-app
  - Expense added (affects you) → In-app only (not email)
  - Settlement ready → Email + In-app
  - Balance changed → Subtle in-app badge (no notification)
  
- Users can override per trip if desired

**Why better:** Sane defaults prevent notification fatigue.

---

## SECTION R: COMPLETE USER JOURNEY

### HOST JOURNEY (Detailed Timeline)

#### Phase 1: Setup (T-7 days)

1. **Sign up**
   - Email + password
   - Create profile
   - Done in 2 minutes

2. **Create trip**
   - Trip name: "Thailand 2024"
   - Destination: "Bali, Indonesia"
   - Dates: Dec 14 - Dec 20
   - Budget: ₹35,000 (optional)
   - Currency: INR (auto-filled based on destination)
   - [Create]

3. **Invite members**
   - [+ Add member]
   - Email: alice@example.com → Sent invite
   - Email: bob@example.com → Sent invite
   - Email: charlie@example.com → Sent invite
   - [View pending invitations]

4. **See dashboard**
   - Trip: Thailand 2024
   - Status: Planning
   - Members: 3 (1 accepted, 2 pending)
   - Budget: ₹35,000
   - [Waiting for members to accept]

#### Phase 2: Planning (T-5 days)

5. **Wait for members**
   - Members receive emails, accept invitations
   - Dashboard updates: "4/4 members accepted"

6. **Set budget & rules** (optional)
   - Go to Settings
   - Rules: Allow members to add expenses (default: yes)
   - Settlement method: Simplify transactions (default: yes)
   - [Save]

#### Phase 3: Trip Start (T-0, Dec 14)

7. **First expense: Hotel**
   - [+ Add Expense]
   - Method: Manual entry
   - Amount: ₹8,000
   - Payer: You
   - Participants: Everyone
   - Split: Equally
   - [Confirm]
   - Dashboard updates: You paid ₹8,000; everyone owes ₹2,000

8. **View balances**
   - Dashboard shows:
     - Alice: owes ₹2,000
     - Bob: owes ₹2,000
     - Charlie: owes ₹2,000
     - You: owed ₹6,000 net

#### Phase 4: During Trip (Dec 15-19)

9. **Alice adds expense (food)**
   - Alice uploads receipt for ₹3,000 meal
   - AI extracts: Restaurant, items, total
   - Alice confirms extraction
   - Selects participants: Herself, You, Bob (Charlie not there)
   - Split: Equally → Each owes ₹1,000
   - Expense added

10. **Host sees real-time update**
    - Dashboard: Alice's balance changes
    - Notification: "Alice added expense: ₹3,000 (you owe ₹1,000)"
    - Your balance updates: owed ₹7,000 net (was ₹6,000)

11. **Bob adds expense (activity)**
    - Bob uploads ₹4,000 tour bill
    - Participants: Everyone
    - Split: Equally → Each owes ₹1,000
    - Expense added

12. **Dynamic updates**
    - All members see balances change in real-time
    - Dashboard shows spending by category
    - Budget progress: ₹15,000 / ₹35,000 (43%)

13. **Member leaves early (Charlie)**
    - Charlie leaves Dec 18 (day 5 of 6)
    - Host gets notification: "Charlie left trip"
    - System recalculates:
      - Charlie only charged for expenses Dec 14-18
      - Remaining 2 members absorb Dec 19-20 accommodation
      - Charlie's final balance: -₹4,500 (owes)

#### Phase 5: Trip End (Dec 20)

14. **View settlement**
    - Dashboard: [Settlement] tab
    - Table:
      ```
      Person | Paid    | Owes   | Net
      Alice  | ₹3,000  | ₹6,000 | -₹3,000
      Bob    | ₹4,000  | ₹6,000 | -₹2,000
      Charlie| ₹0      | ₹4,500 | -₹4,500
      You    | ₹12,000 | ₹6,000 | +₹6,000
      ```

15. **Review simplified transactions**
    - Proposed:
      1. Alice pays You ₹3,000
      2. Bob pays You ₹2,000
      3. Charlie pays You ₹4,500
    - [Confirm Settlement]

16. **Download report**
    - [Export as PDF]
    - Report includes:
      - Total cost: ₹32,000
      - Per-person average: ₹8,000
      - Category breakdown: Hotel ₹8,000, Food ₹3,000, Activities ₹4,000, etc.
      - Per-person spending: Alice ₹8,000 (overpaid ₹3,000), etc.
      - Settlement summary

17. **Share with members**
    - [Email to all members]
    - Each member receives:
      - Their personal summary
      - Settlement amount
      - Link to trip report

18. **Track payments**
    - Alice pays ₹3,000 (Venmo)
    - You mark as "Paid"
    - Bob sends ₹2,000 (Bank transfer)
    - You mark as "Paid"
    - Charlie pays cash before leaving
    - You mark as "Paid"

19. **Trip complete**
    - All payments recorded
    - Settlement status: Complete
    - Trip archived

---

### MEMBER JOURNEY (Alice's Experience)

#### Phase 1: Invitation (T-7 days)

1. **Receive invite**
   - Email: "Bob invited you to Thailand 2024"
   - [Join Trip]

2. **Create account** (if needed)
   - Email: alice@example.com
   - Password setup
   - Profile creation

3. **View trip overview**
   - Trip: Thailand 2024
   - Host: Bob
   - Members: 4
   - Dates: Dec 14-20
   - Budget: ₹35,000
   - Status: Awaiting your confirmation
   - [Accept]

#### Phase 2: Before Trip (T-5 to T-0)

4. **See planned expenses**
   - Host added: Hotel ₹8,000
   - Budget progress: ₹8,000 / ₹35,000
   - [View all]

5. **Check your balance**
   - Dashboard: "You owe ₹2,000 (for hotel)"

#### Phase 3: During Trip (Dec 15-19)

6. **Add expense (food)**
   - [+ Add Expense]
   - Upload receipt: ₹3,000 meal
   - AI processes
   - Participants: You, Bob, Host (Charlie not there)
   - Split: Equally
   - [Confirm]

7. **See expense added**
   - Dashboard: "Your expense ₹3,000 added"
   - Your balance updated: "You owe ₹3,000 total" (hotel ₹2,000 + food ₹1,000)

8. **View all expenses**
   - Expenses tab shows:
     - Hotel ₹8,000 (Host paid, Dec 14)
     - Food ₹3,000 (You paid, Dec 15)
     - Activities ₹4,000 (Bob paid, Dec 17)

9. **Request money from Bob** (optional)
   - Bob paid ₹4,000 activity you participated in
   - You owe Bob ₹1,000 (your share)
   - [Request Money] → "Bob, send ₹1,000 for activity?"
   - Bob declines or sends via Venmo
   - You record: "Paid Bob ₹1,000 (Venmo)"

10. **See real-time balance updates**
    - Others add expenses
    - Your balance updates automatically
    - No page refresh needed

#### Phase 4: Trip End (Dec 20)

11. **See settlement summary**
    - Dashboard: "Settlement ready"
    - Your balance: "You owe ₹3,000 total"
    - To whom:
      - Bob: ₹1,000
      - Host: ₹2,000

12. **Receive final report**
    - Email with trip summary
    - Your spending: ₹3,000
    - What you owe: ₹3,000
    - Who you owe: Bob (₹1,000), Host (₹2,000)

13. **Make payments**
    - Send Bob ₹1,000 via Venmo
    - Mark in app: "Paid Bob ₹1,000"
    - Send Host ₹2,000 via Bank transfer
    - Mark in app: "Paid Host ₹2,000"

14. **Trip complete**
    - Settlement marked as complete
    - Trip archived

---

### WHERE FLOWS OVERLAP

- **Both see:** Dashboard, expenses, balances, settlement
- **Both can add:** Expenses (unless host disables for members)
- **Both can view:** Reports, audit logs
- **Only host can:** Invite members, set rules, edit settings
- **Only host can (default):** Approve expenses (if required)
- **Members can:** Request money, add expenses, view all data

**Key insight:** Flows are nearly identical. Difference is permissions, not interface. This keeps the app simple.

---

## FINAL SUMMARY

### Architecture Overview

```
Frontend (React)
  ├─ Redux state management
  ├─ Component-based (Pages, Forms, Widgets)
  └─ Real-time via polling (MVP) or WebSocket (V2+)

Backend (Node.js + Express)
  ├─ RESTful API
  ├─ Core services (Expense, Balance, Settlement, Receipt parsing)
  ├─ MongoDB for persistence
  └─ Socket.IO for real-time (optional)

Database (MongoDB)
  ├─ User, Trip, TripMember
  ├─ Expense, Payment, Settlement
  ├─ AuditLog, Notification
  └─ Indexes for performance

AI (Receipt parsing)
  ├─ Claude Vision or AWS Textract
  ├─ Extract: merchant, items, tax, total
  └─ User-confirms before saving
```

### Key UX Principles

1. **Balance first:** Answer "How much do I owe?" before anything else
2. **Progressive disclosure:** Hide complexity; reveal only when needed
3. **Trust-based:** Members can add expenses; no approval needed (default)
4. **Transparency:** Audit logs, calculation explanations, AI confidence scores
5. **Simplicity:** Wizard-style forms; one question at a time
6. **Real-time:** Balance updates immediately when expense added
7. **Empathy:** Handle edge cases gracefully (member leaves, currency changes, refunds)

### Success Metrics

A successful product will enable users to answer these questions **without needing help:**

1. "What is this trip?" → Overview on dashboard
2. "Who's involved?" → People tab
3. "What have we spent?" → Dashboard stats
4. "How much do I owe?" → Big, clear balance at top
5. "Who do I pay?" → Settlement page
6. "Did I calculate correctly?" → Detailed breakdown & audit log

If a user can answer all 6 without confusion, the product is successful.

---

## END OF DESIGN DOCUMENT

This design prioritizes **simplicity without sacrificing power**. It handles the messiness of real group travel while keeping the UI clean and approachable.

The MVP focuses on the core loop: Add expense → See balances → Settle. Everything else is additive.

Good luck building!
