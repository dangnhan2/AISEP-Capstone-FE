# AISEP Startup–Advisor Payment UI/UX Implementation Spec

Version: Draft 1  
Audience: Product Designer, UI/UX Designer, Frontend Engineer, Backend Engineer, AI UI generation tools  
Scope: Startup side + Advisor side + minimum shared payment states for consulting workflow  
Status: Product extension aligned to AISEP consulting flow and business direction

---

## 1. Purpose

This document defines how to implement **payment UI/UX for Startup ↔ Advisor consulting sessions** in AISEP.

The goal is to make payment:
- understandable to Startup before booking,
- fair to Advisor,
- resistant to abuse/fake sessions,
- consistent with the existing consulting lifecycle,
- easy for AI-generated UI and frontend teams to implement.

This spec follows the existing AISEP consulting workflow and extends it with payment in a way that does **not break the current SRS lifecycle**.

---

## 2. Source-aligned product decision

### 2.1 What the documents already define

The AISEP business document already states that:
- Advisors can **set their own hourly rate** and define supported session durations.
- The system can derive session prices from the hourly rate.
- AISEP takes **15% commission** for each consulting session.
- The Startup–Advisor consulting workflow is structured, not free-form.

The SRS also already defines the consulting lifecycle:
- `Requested → Accepted/Rejected → Scheduled → Completed/Cancelled`
- startup can only update/cancel before advisor response
- consulting sessions require confirmed schedules before they proceed
- operation staff can oversee consulting issues, validate reports, and mark sessions as completed/disputed/resolved.

### 2.2 Product decision for payment model

This implementation uses **Approach A**:

- **Startup pays the listed session price** shown on the platform.
- **Advisor commission is deducted from the advisor payout**, not added as a separate surcharge to Startup checkout.
- The platform keeps **15% commission** from the advisor payout.

### 2.3 Why this approach is chosen

This is the cleanest UX because:
- Startup sees a single session price with no surprise fee added later.
- Advisor pricing logic remains consistent with “advisor sets the rate.”
- The phrase “AISEP takes 15% commission” is treated as **platform commission from advisor earnings**, not a visible surcharge added to Startup.
- Checkout is simpler and more conversion-friendly.

### 2.4 Payment policy summary used by UI

For UI purposes, the system should present:
- **Session price** = what Startup pays
- **Platform commission (15%)** = deducted from Advisor payout
- **Advisor receives** = net payout after platform commission

Example:
- Advisor hourly rate: `$80/hour`
- Duration selected: `60 minutes`
- Session price shown to Startup: `$80`
- Platform commission: `$12`
- Advisor net payout: `$68`

Important:
- **Startup does not need to see the advisor net payout** in standard booking UI.
- **Advisor must see the gross session price, platform fee, and estimated payout** in advisor-side payout screens.

---

## 3. Relationship to the existing consulting flow

Payment must not start at the wrong moment.

### 3.1 Existing consulting flow from AISEP

Existing consulting logic already implies:
1. Startup searches/selects advisor
2. Startup creates consulting request
3. Advisor accepts or rejects
4. Both sides agree on schedule
5. Session is conducted
6. Advisor submits report
7. Startup submits feedback

### 3.2 Where payment should be inserted

**Do not charge immediately when Startup clicks “Send Request.”**

Correct placement:
1. **Create Request** → no charge yet
2. **Advisor Accepts / proposes time**
3. **Schedule becomes agreed / confirmable**
4. **Startup confirms schedule**
5. **Payment checkout begins**
6. **Payment is authorized / captured into held state**
7. **Session happens**
8. **Advisor submits report**
9. **System/ops decides release eligibility**
10. **Payout released to advisor**, or refund/dispute flow begins

### 3.3 Why payment should happen after schedule confirmation

This avoids UX and business problems when:
- advisor rejects the request,
- advisor proposes another slot,
- startup cancels before advisor response,
- schedule is never finalized,
- session becomes disputed.

---

## 4. Payment state model

This spec adds a **payment state machine** alongside the existing consulting state machine.

### 4.1 Consulting lifecycle (existing)
- `Requested`
- `Accepted`
- `Rejected`
- `Scheduled`
- `Completed`
- `Cancelled`

### 4.2 Payment lifecycle (new)
- `UNPAID`
- `CHECKOUT_PENDING`
- `PAYMENT_FAILED`
- `PAID_HELD`
- `RELEASE_READY`
- `RELEASED`
- `REFUND_PENDING`
- `REFUNDED`
- `DISPUTED`

### 4.3 Recommended mapping between consulting status and payment status

| Consulting Status | Payment Status | Meaning |
|---|---|---|
| Requested | UNPAID | No payment yet |
| Accepted | UNPAID | Request accepted, but schedule/payment not finalized |
| Scheduled (not fully confirmed) | CHECKOUT_PENDING | Schedule exists, waiting for Startup payment |
| Scheduled + paid | PAID_HELD | Startup has paid, funds are held |
| Completed + report valid | RELEASE_READY | Session appears eligible for payout release |
| Completed + payout done | RELEASED | Advisor paid out |
| Cancelled before payment | UNPAID | Nothing charged |
| Cancelled after payment | REFUND_PENDING / REFUNDED | Payment reversal or refund flow |
| In dispute | DISPUTED | Hold payout until resolution |

### 4.4 Important rule

`PAID_HELD` means:
- Startup payment succeeded,
- money is collected/authorized,
- payout to Advisor has **not** been released yet.

This is the anti-abuse anchor of the entire payment UX.

---

## 5. Core product rules for payment

These rules should guide both UI and backend.

### PR-01 Advisor pricing source
Advisor defines:
- hourly rate
- supported durations (e.g. 30/60/90 minutes)
- supported formats if applicable

### PR-02 Session price derivation
The system derives session price from:
- hourly rate
- selected duration

### PR-03 Platform commission
Platform commission is **15% of the session price** and is deducted from advisor payout.

### PR-04 No payment on raw request creation
Creating a consulting request does **not** charge Startup.

### PR-05 Payment starts only after schedule is finalized enough to proceed
Checkout starts only when the session has a confirmed/agreed schedule and the request is in a payment-eligible state.

### PR-06 Payout is held until post-session completion conditions are satisfied
Advisor payout should not be released until the session has enough completion evidence.

### PR-07 Disputes freeze payout
If a session is disputed, the payout remains unreleased until the issue is resolved.

### PR-08 Cancel policy must differentiate pre-payment vs post-payment
- Before payment: simple cancellation
- After payment: refund logic required

### PR-09 Logs and auditability
All payment actions must be auditable:
- checkout created
- payment success/failure
- refund requested/completed
- dispute raised/resolved
- payout released

---

## 6. Screen architecture

This payment extension introduces new screens/cards while reusing existing consulting screens.

### 6.1 Startup-side screens
1. **Create Consulting Request** (existing, now includes pricing preview)
2. **Preferred Time Slots / Confirm Schedule** (existing)
3. **Consulting Checkout** (new)
4. **Payment Result** (new: success/failed)
5. **Consulting Request Detail** (existing, now includes payment status card)
6. **Startup Payment History** (new, optional but recommended)
7. **Refund / Dispute Detail** (new or nested within request detail)

### 6.2 Advisor-side screens
1. **Advisor Profile** (existing, now shows pricing)
2. **Incoming Consulting Request Detail** (existing, shows pricing context)
3. **My Consultings / Session Detail** (existing, shows payment status)
4. **Earnings / Payouts** (already present in screen list, should absorb consulting payout UI)

### 6.3 Operation-side screens
1. **Consulting Oversight** (existing)
2. **Review reported consulting issues** (existing)
3. **Session dispute resolution / payout hold state** (new sub-view or expansion inside oversight)

---

## 7. Startup-side UX flow in detail

## 7.1 Step 1 — Advisor discovery

Relevant screen: Advisor list / Advisor profile

Startup should see on advisor card/profile:
- hourly rate
- supported durations
- derived session prices
- whether consultation is free or paid
- expertise areas
- availability context if available

### UI copy recommendation
- `From $40 / 30 min`
- `Hourly rate: $80`
- `Available durations: 30m, 60m, 90m`

### Rules
- If the advisor has no valid pricing setup, paid booking cannot proceed.
- If only some durations are supported, unsupported durations must be hidden or disabled.

---

## 7.2 Step 2 — Create Consulting Request modal/page

This is the modal the user already designed.

### Required fields
- selected advisor summary
- session objective / desired outcome
- problem / context
- optional specific questions / notes
- scope
- preferred format
- duration

### New section to add
#### `Session price`
Display a compact pricing summary inside the request form:
- `Selected duration: 60 minutes`
- `Session price: $80`
- `Payment timing: You will pay after the schedule is confirmed.`

### Important UX note
Do **not** collect card/payment method here yet.

### Footer helper text
Recommended:
- `You will only be charged after both sides confirm the session schedule.`

### CTA
Keep:
- `Send Request`

### After submit
- request status becomes `Requested`
- payment remains `UNPAID`
- user is redirected to request detail or my consulting requests

---

## 7.3 Step 3 — Schedule confirmation phase

Relevant screens:
- Advisor proposes/accepts
- Startup confirms schedule
- Request detail / session detail

### Payment logic here
Once the schedule is sufficiently finalized, the system should show a prominent **Payment Required** state.

### Startup sees on request detail
A new payment card:
- `Status: Awaiting payment`
- `Session price: $80`
- `Schedule: Tue, 12 Mar 2026 · 14:00–15:00`
- `Advisor: Nguyen Minh Quan`
- CTA: `Proceed to Payment`

### Guardrail
If schedule changes again before payment, pricing should refresh if duration changes.

---

## 7.4 Step 4 — Consulting Checkout

This is a new dedicated screen/modal.

### Purpose
Collect payment from Startup only when the session is eligible for payment.

### Layout
Recommended structure:

#### A. Session Summary card
- advisor name
- startup name (optional)
- scope/topic
- format
- agreed date/time
- selected duration

#### B. Price Breakdown card
- `Session price: $80`
- `Platform fee: Included in advisor payout`
- `You pay: $80`

Important: do **not** show platform fee as added surcharge to Startup total.

#### C. Payment Method section
- saved card / add new card
- bank transfer if supported
- wallet if supported

#### D. Policy summary
- `Payment will be held until the session is completed according to platform policy.`
- `If the session is cancelled or disputed, refund policy will apply.`

#### E. CTA area
- secondary: `Cancel`
- primary: `Pay & Confirm`

### Checkout states
- loading totals
- payment method invalid
- payment processing
- success
- failed

---

## 7.5 Step 5 — Payment success

After successful checkout:
- payment state becomes `PAID_HELD`
- consulting session remains `Scheduled`
- request detail should update to show:
  - `Payment secured`
  - `Funds are being held until the session is completed`

### Success screen content
- success icon
- session summary
- payment reference ID
- amount paid
- payment timestamp
- next steps

### Recommended next CTAs
- `View Session Details`
- `Back to My Consultings`

---

## 7.6 Step 6 — Session conducted

Existing consulting flow already includes conducted/completed behavior.

### Payment UX impact
After the session occurs:
- session may show `Awaiting report` / `Under review` / `Pending release`
- Startup should understand that the payment is **not yet refunded or released automatically** until the workflow reaches the required completion conditions.

### Request detail / session detail card
Recommended payment state card:
- `Payment status: Held`
- `Release condition: Waiting for advisor report / session completion validation`

---

## 7.7 Step 7 — Completion and payout release

When the completion conditions are satisfied:
- consulting status becomes effectively completed
- payment status becomes `RELEASE_READY`, then `RELEASED`

### Startup UI
Startup should see:
- `Payment completed`
- `Session marked as completed`
- `Advisor payout released`

This can be a neutral informational state rather than a prominent financial UI.

---

## 7.8 Step 8 — Feedback and closure

After completion:
- feedback form becomes available
- payment card remains visible in history but no longer primary

---

## 8. Advisor-side UX flow in detail

## 8.1 Advisor pricing setup

Advisor profile / service setup should include:
- hourly rate
- supported durations
- whether consultation is paid/free
- optional notes about what is included

### Derived pricing preview for advisor
Show:
- `30 min = $40`
- `60 min = $80`
- `90 min = $120`

### Payout note
Show clearly:
- `AISEP platform commission: 15%`
- `Estimated payout for 60 min: $68`

This is where advisor should understand the commission model.

---

## 8.2 Advisor request detail

When advisor opens an incoming request, they should see:
- requested duration
- estimated session price
- expected payout after platform commission

### Example
- Session price: `$80`
- Platform fee: `$12`
- You receive: `$68`

### Why this matters
Advisor should know payout before accepting.

---

## 8.3 Advisor session detail

After startup payment succeeds:
- advisor sees `Payment secured`
- payout state remains `Held`
- advisor sees when payout is expected to release

### Suggested status copy
- `Startup payment received and held`
- `Payout will be released after session completion and platform checks`

---

## 8.4 Advisor earnings / payouts screen

This screen already exists in the SRS screen list and should absorb the payment logic.

### Sections recommended
- available balance
- held balance
- released payouts
- pending disputes
- payout history

### Per-session payout row should show
- session title / startup name
- gross session price
- platform commission
- advisor net payout
- payout status
- payout date or estimated release date

### Advisor statuses
- `Held`
- `Ready to Release`
- `Released`
- `Refunded`
- `Disputed`

---

## 9. Operation/Oversight payment responsibilities

Because the business document explicitly warns about fake session abuse and fake report abuse, operation oversight must be able to intervene.

### Ops should be able to see
- session details
- payment status
- payout hold status
- report submission state
- dispute flag
- refund state

### Ops actions recommended
- mark session completed
- mark in dispute
- resolve dispute
- approve payout release
- approve refund outcome

### Important product principle
This does **not** mean every session must be manually reviewed.
It means the system should support operational review for risky/problematic cases.

---

## 10. New UI sections/components to add

## 10.1 Advisor card / advisor profile pricing widget
Show:
- hourly rate
- duration pills
- calculated prices
- paid/free indicator

## 10.2 Create request pricing preview
Show inside request form:
- selected duration
- session price
- payment timing note

## 10.3 Payment required card in request detail
Show:
- payment state
- amount due
- due action
- CTA to checkout

## 10.4 Checkout screen
Core components:
- session summary
- breakdown card
- payment method selector
- policy note
- pay button

## 10.5 Payment status card in session detail
Show:
- current payment state
- amount
- timestamps
- hold/release explanation
- refund/dispute CTA if policy allows

## 10.6 Advisor payout card
Show:
- session price
- platform fee
- net payout
- payout status

---

## 11. Detailed data model guidance

This section is implementation-oriented and can be adapted to backend naming.

## 11.1 Core entities

### ConsultingSession / ConsultingRequest
Suggested fields:
- `id`
- `startupId`
- `advisorId`
- `status`
- `objective`
- `problemContext`
- `additionalNotes`
- `scope[]`
- `preferredFormat`
- `durationMinutes`
- `agreedStartAt`
- `agreedEndAt`
- `startupConfirmedScheduleAt`
- `advisorConfirmedScheduleAt`
- `conductedAt`
- `completedAt`

### AdvisorPricing
- `advisorId`
- `hourlyRate`
- `currency`
- `supportedDurations[]`
- `isPaidConsultation`
- `platformCommissionRate` = 0.15

### SessionPayment
- `id`
- `consultingSessionId`
- `startupId`
- `advisorId`
- `currency`
- `grossAmount`
- `platformCommissionAmount`
- `advisorNetAmount`
- `paymentStatus`
- `paymentMethodType`
- `paymentReference`
- `checkoutCreatedAt`
- `paidAt`
- `heldAt`
- `releaseReadyAt`
- `releasedAt`
- `refundRequestedAt`
- `refundedAt`
- `disputedAt`
- `failureReason`

### SessionDispute (optional dedicated model)
- `id`
- `consultingSessionId`
- `paymentId`
- `raisedByRole`
- `reason`
- `status`
- `createdAt`
- `resolvedAt`

---

## 12. API / interaction guidance

These are suggested interaction endpoints for frontend planning.

### Pricing & booking
- `GET /advisors/:id/pricing`
- `POST /consulting-requests`
- `POST /consulting-requests/:id/confirm-schedule`

### Checkout
- `GET /consulting-sessions/:id/payment-summary`
- `POST /consulting-sessions/:id/create-checkout`
- `POST /payments/:id/confirm`
- `GET /payments/:id`

### Refund / dispute
- `POST /consulting-sessions/:id/report-issue`
- `POST /payments/:id/request-refund`
- `GET /consulting-sessions/:id/payment-history`

### Advisor payouts
- `GET /advisor/earnings`
- `GET /advisor/payouts`

---

## 13. Validation rules

## 13.1 Create Request validation
- advisor must exist
- advisor must be bookable
- duration must be supported by advisor
- price must be derivable

## 13.2 Payment eligibility validation
- session must belong to current startup
- session must be in payment-eligible state
- schedule must be sufficiently confirmed
- payment must not already be completed for the active session version

## 13.3 Payout release validation
- session must not be in dispute
- completion conditions must be satisfied
- payout must not already be released

## 13.4 Refund validation
- refund policy must allow refund
- payment must exist and be in refundable state

---

## 14. UI state handling

## 14.1 Startup states

### Request form
- no pricing available
- pricing loaded
- unsupported duration
- request sent

### Request detail
- unpaid
- awaiting advisor response
- awaiting schedule confirmation
- awaiting payment
- paid and held
- completed
- refunded
- disputed

### Checkout
- loading payment summary
- payment method missing
- processing
- success
- failed

## 14.2 Advisor states
- pricing not configured
- payment pending from startup
- payment secured / held
- payout pending
- payout released
- payout disputed

## 14.3 Operation states
- normal release path
- review required
- dispute open
- dispute resolved
- refund completed

---

## 15. Suggested screen-by-screen implementation details

## 15.1 Startup — Create Consulting Request

### New UI section
`Session price`

### Fields shown
- Duration selected
- Session price
- Payment timing note

### Example copy
- `Session price: $80`
- `You will only pay after the session schedule is confirmed.`

---

## 15.2 Startup — Consulting Request Detail

### New card: Payment
When payment is required:
- title: `Payment`
- state badge: `Awaiting payment`
- amount: `$80`
- helper: `Your session is scheduled. Complete payment to secure it.`
- CTA: `Proceed to Payment`

When paid:
- state badge: `Payment secured`
- helper: `Funds are being held until the session is completed according to platform policy.`

When refunded:
- state badge: `Refunded`
- helper: `Your payment has been refunded.`

When disputed:
- state badge: `In dispute`
- helper: `This session is under review. Payout remains on hold until resolution.`

---

## 15.3 Startup — Checkout

### Price section
- Session price
- Total to pay
- Currency

### Payment note
- `AISEP does not add an extra fee to your checkout total.`
- `The platform commission is deducted from advisor payout.`

Use this note carefully. It is helpful, but can be hidden behind an info tooltip if you want less clutter.

---

## 15.4 Advisor — Earnings & Payouts

### Row content
- Startup name
- Session date
- Duration
- Gross price
- Platform commission 15%
- Net payout
- Payout status

### Summary cards
- Held earnings
- Available for payout
- Released this month
- Refunded/disputed amount

---

## 16. Copywriting recommendations

## 16.1 Startup-facing copy
Use clear, reassuring, non-financial-jargon language.

Good examples:
- `You will only pay after the schedule is confirmed.`
- `Payment secured`
- `Funds are being held until the session is completed.`
- `Your payment has been refunded.`
- `This payment is under review due to a reported issue.`

Avoid overly legal copy in the primary UI.

## 16.2 Advisor-facing copy
Use transparent payout language.

Good examples:
- `Session price`
- `Platform commission`
- `Estimated payout`
- `Payout on hold`
- `Payout released`

---

## 17. Cancellation, refund, and dispute logic

This section should be very clear for implementation.

### 17.1 Cancellation before payment
- session/request can be cancelled under normal consulting rules
- no refund needed
- payment remains `UNPAID`

### 17.2 Cancellation after payment but before session
Recommended default behavior:
- payment moves to `REFUND_PENDING`
- then `REFUNDED`
- payout not released

### 17.3 Cancellation after session start / conducted state
Do not auto-refund blindly.
Possible outcomes:
- dispute
- manual ops review
- partial/conditional refund if policy allows

### 17.4 Fake session / fake report risk
If there is a report/issue signal or manual flag:
- payment enters or remains `DISPUTED`
- payout is frozen
- ops reviews and resolves

---

## 18. Notifications to include

Notifications should be sent in-app and optionally by email.

### Startup notifications
- request accepted
- schedule confirmed
- payment required
- payment success
- payment failed
- refund processed
- dispute opened/resolved

### Advisor notifications
- new paid request opportunity
- startup completed payment
- payout ready
- payout released
- dispute opened/resolved

### Operation notifications
- flagged disputed paid session
- payout release blocked by issue

---

## 19. Accessibility and UX quality requirements

- use clear status badges with text, not color alone
- buttons must have deterministic labels
- payment summary must be readable without scrolling excessively
- checkout total must be visually dominant
- all timestamps must use consistent timezone handling
- destructive or irreversible actions must require confirmation

---

## 20. Recommended route map

Startup side:
- `/startup/advisors`
- `/startup/advisors/:advisorId`
- `/startup/consulting/requests/new`
- `/startup/consulting/requests/:requestId`
- `/startup/consulting/sessions/:sessionId/checkout`
- `/startup/payments`

Advisor side:
- `/advisor/requests/:requestId`
- `/advisor/consultings/:sessionId`
- `/advisor/earnings`

Ops side:
- `/ops/consulting-oversight`
- `/ops/consulting-issues/:issueId`

---

## 21. Suggested acceptance criteria

### Create request pricing
- session price updates immediately when duration changes
- unsupported duration cannot be submitted
- startup can submit request without paying yet

### Payment trigger
- startup only sees checkout CTA after schedule becomes payment-eligible
- startup cannot pay twice for the same active session version

### Checkout
- total amount equals the selected session price
- no additional startup platform surcharge appears in Approach A
- payment success updates session detail correctly

### Payout
- advisor sees gross price, platform commission, and net payout
- payout remains held until eligible
- disputed sessions do not release payout automatically

### Refunds / disputes
- cancelled post-payment sessions move through refund states correctly
- dispute freezes payout
- resolved dispute ends in either release or refund outcome

---

## 22. AI-generation guidance

If this spec is used to generate UI with AI tools, the AI should follow these rules:

1. Do not put payment at the first request creation click.
2. Treat payment as a step after schedule confirmation.
3. Show one simple total to Startup.
4. Deduct 15% commission from Advisor payout, not from Startup checkout.
5. Always model held funds before release.
6. Include dispute/refund states in the session detail and payout flows.
7. Keep payment status tightly connected to consulting session status.
8. Avoid generic e-commerce UI patterns that ignore the consulting lifecycle.

---

## 23. Final implementation summary

The correct AISEP payment UX for Startup ↔ Advisor consulting should work like this:

- Advisor sets hourly rate and durations.
- Startup sees clear session prices before requesting.
- Startup creates request without paying immediately.
- After the schedule is finalized, Startup pays the session price.
- The platform holds the funds.
- Advisor commission (15%) is deducted from advisor payout.
- Payout releases only after completion conditions are satisfied.
- Refund/dispute states are explicitly supported.
- Operation Staff can intervene in risky or disputed cases.

This keeps the product aligned with the AISEP structured consulting workflow while making payment practical, fair, and abuse-resistant.
