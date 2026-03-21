# AISEP Startup ↔ Advisor Mentoring Workflow UI/UX Implementation Spec

Version: 1.0  
Target: Web application (primary), mobile support for core Startup flows  
Primary roles: Startup, Advisor  
Secondary roles: System / Notification Service / Operation Staff (oversight only)

---

## 1. Purpose

This document defines a production-oriented UI/UX implementation plan for the **Startup ↔ Advisor mentoring / consulting workflow** in AISEP.

The goal is to help product, design, frontend, and backend teams implement the mentoring flow consistently with the AISEP SRS and business workflow.

This is **not** a generic chat-based mentoring feature. In AISEP, Startup–Advisor collaboration is a **structured consulting workflow** with explicit request, scheduling, confirmation, execution, reporting, and feedback steps.

---

## 2. Source-backed functional scope

### 2.1 Startup-side use cases in scope
- UC-39 Search Advisors/Experts
- UC-40 View Advisor Profile & Rating
- UC-41 Manage Consulting (Startup Side)
- UC-42 Create consulting request
- UC-43 Update consulting request
- UC-44 Cancel consulting request
- UC-45 Select preferred time slots
- UC-46 Confirm consulting schedule
- UC-47 Track consulting request status
- UC-48 View consulting history
- UC-49 View consulting report
- UC-50 Submit Feedback & Rating for Advisor

### 2.2 Advisor-side use cases in scope
- UC-108 Manage Consulting Schedule
- UC-109 Accept / Reject Consulting Request
- UC-110 View consulting schedule request
- UC-111 Propose / Confirm Consulting Time
- UC-112+ consulting delivery actions (session/report/feedback-related workflow)

### 2.3 Screen scope from SRS
Startup-side screens:
- Search Advisors
- Advisor Profile & Rating
- Create Consulting Request
- Select Preferred Time Slots
- My Consulting Requests
- Confirm Schedule (Startup)
- View Consulting Report
- Submit Feedback/Rating

Advisor-side screens:
- Incoming Consulting Requests
- Request Details
- My Consultings
- Session / Meeting
- Confirm Schedule (Advisor)
- Submit Consulting Report
- Ratings & Feedback

---

## 3. Product principle

The mentoring relationship in AISEP should be implemented as a **managed consulting lifecycle**, not as free-form networking.

That means the UI must always answer these questions:
1. What is the current session/request status?
2. What action is allowed now?
3. What information is locked vs editable?
4. What is the next step for Startup?
5. What is the next step for Advisor?
6. Has the session been confirmed, conducted, completed, and reviewed?

---

## 4. Canonical workflow

## 4.1 Core lifecycle from SRS
Primary status lifecycle:
- `Requested`
- `Accepted`
- `Rejected`
- `Scheduled`
- `Completed`
- `Cancelled`

Business rules:
- Requests move through `Requested → Accepted/Rejected → Scheduled → Completed/Cancelled`
- Requests can only be updated/cancelled before Advisor response
- Sessions require confirmed schedules before they can proceed
- Requests may auto-cancel if not responded to within a configured timeframe
- Feedback can only be submitted once per completed session
- Rejected requests must include a rejection reason
- Advisors can propose alternative time slots

## 4.2 Business workflow detail from domain doc
More fine-grained business flow:
- `Requested`
- `Accepted / Rejected`
- `Scheduled`
- `Conducted`
- `Completed`
- `Feedback Submitted`

### Recommended implementation mapping
To avoid conflict between the stricter SRS lifecycle and the richer business flow, implement both as follows:

### A. Public session/request status (top-level)
Used in lists, dashboards, filters:
- Requested
- Accepted
- Rejected
- Scheduled
- Completed
- Cancelled

### B. Internal workflow flags / sub-states
Used in detail views and progress timelines:
- `startup_schedule_confirmed: boolean`
- `advisor_schedule_confirmed: boolean`
- `conducted_confirmed_by_startup: boolean`
- `conducted_confirmed_by_advisor: boolean`
- `report_submitted: boolean`
- `feedback_submitted: boolean`

### C. Derived timeline steps shown in UI
- Request sent
- Advisor responded
- Time agreed
- Session conducted
- Report available
- Feedback submitted

This lets the UI reflect the richer mentoring process without breaking the SRS lifecycle model.

---

## 5. User journeys

## 5.1 Startup primary journey
1. Startup opens **Search Advisors**
2. Filters/searches advisors
3. Opens **Advisor Profile & Rating**
4. Clicks **Request Consulting**
5. Fills **Create Consulting Request**
6. Selects **Preferred Time Slots**
7. Submits request → status becomes `Requested`
8. Tracks request in **My Consulting Requests**
9. If Advisor accepts and proposes/confirms time → Startup opens **Confirm Schedule**
10. Startup confirms schedule → session proceeds as `Scheduled`
11. After session time passes, Startup may confirm the session was conducted
12. Startup opens **View Consulting Report** after Advisor submits report
13. Startup submits **Feedback & Rating**
14. Session remains in history as completed mentoring/consulting record

## 5.2 Advisor primary journey
1. Advisor opens **Incoming Consulting Requests**
2. Reviews **Request Details**
3. Accepts or rejects request
4. If accepted, proposes or confirms time
5. Session appears in **My Consultings**
6. Advisor opens **Session / Meeting**
7. Advisor may confirm the session was conducted
8. Advisor submits consulting report
9. Advisor later sees rating/feedback in **Ratings & Feedback**

---

## 6. IA and screen architecture

## 6.1 Startup-side IA
### A. Discovery
- Search Advisors
- Advisor Profile & Rating

### B. Requesting
- Create Consulting Request
- Select Preferred Time Slots

### C. Tracking & execution
- My Consulting Requests
- Request Detail
- Confirm Schedule (Startup)
- Session Detail / Meeting Detail (if split)

### D. Completion
- View Consulting Report
- Submit Feedback/Rating
- Consulting History

## 6.2 Advisor-side IA
### A. Intake
- Incoming Consulting Requests
- Request Details

### B. Scheduling
- Confirm Schedule (Advisor)
- Availability / Time Slots

### C. Delivery
- My Consultings
- Session / Meeting
- Submit Consulting Report

### D. Outcome
- Ratings & Feedback
- Consulting history within My Consultings

---

## 7. Navigation model

## 7.1 Startup navigation entry points
Recommended sidebar/menu items:
- Advisors
- My Consulting Requests
- Consulting History

Recommended CTAs from advisor-related screens:
- View Advisor
- Request Consulting
- Select Time Slots
- Track Status
- Confirm Schedule
- View Report
- Submit Feedback

## 7.2 Advisor navigation entry points
Recommended sidebar/menu items:
- Incoming Requests
- My Consultings
- Availability
- Ratings & Feedback

---

## 8. Detailed screen implementation

# 8.1 Search Advisors (Startup)

## Purpose
Allow Startup to discover advisors and shortlist the right advisor before sending a request.

## Layout
- Page header
- Search input
- Filter panel
- Result count + sort
- Advisor card grid/list

## Required UI elements
- Search by advisor name / expertise / keyword
- Filters:
  - expertise area
  - industry/domain
  - rating
  - availability indicator
  - language (optional)
  - service type / mentoring scope (optional)
- Sort:
  - Best match
  - Highest rating
  - Most relevant expertise
  - Recently active

## Advisor card content
- advisor avatar
- advisor name
- expertise headline
- short bio snippet
- average rating
- total reviews
- key expertise tags
- availability hint
- primary CTA: View Profile
- secondary CTA: Request Consulting

## Empty/loading/error states
- loading skeleton cards
- no advisors found
- filters too narrow
- advisor unavailable
- search failed

---

# 8.2 Advisor Profile & Rating (Startup)

## Purpose
Allow Startup to assess advisor fit before requesting a session.

## Layout
- header summary
- main profile content left
- rating / availability / CTA panel right

## Required sections
### A. Identity & credibility
- advisor name
- verification badge/status if applicable
- professional headline
- public links

### B. Professional background
- experience summary
- expertise areas
- industries served
- mentorship philosophy
- services offered

### C. Ratings & reviews
- average rating
- review count
- selected feedback snippets

### D. Availability summary
- next available slot
- available days/time hints

### E. Primary actions
- Request Consulting
- Save / bookmark advisor (optional)

## Rules
- Startup must not be able to request if advisor is inactive or ineligible
- unavailable advisors should show disabled CTA + explanation

---

# 8.3 Create Consulting Request (Startup)

## Purpose
Create a structured request linked to a selected advisor.

## Interface requirements from SRS
The request form must contain:
- selected advisor summary
- objectives
- scope
- preferred format
- additional notes
- submit button

## Recommended layout
- advisor summary header
- 2-column or stacked form
- sticky action bar with Save Draft (optional) and Submit

## Required fields
### A. Advisor context
- advisor name
- expertise snapshot
- advisor link back

### B. Request content
- consulting objective(s) *(required)*
- scope / session topic *(required)*
- preferred format *(required, supported options only)*
  - online call
  - video meeting
  - document review
  - strategy discussion
  - hybrid/other if supported
- expected duration *(recommended)*
- additional notes *(optional but recommended)*

### C. Startup context helper block
- startup name
- startup stage
- key context for advisor
- relevant documents selected / attached if supported

## Actions
- Cancel
- Continue to Select Preferred Time Slots
- Submit Request

## Validation
- advisor must be active and eligible
- required fields completed
- values must follow supported options
- request cannot be created for unauthorized advisor state

## Success outcome
- request created successfully
- initial status = `Requested`
- route to Request Detail / My Consulting Requests

## Error states
- invalid input
- advisor no longer eligible
- duplicate/ineligible request if policy exists
- processing failed

---

# 8.4 Select Preferred Time Slots (Startup)

## Purpose
Allow Startup to propose preferred consulting slots.

## Layout
- request summary header
- timezone info
- slot picker/calendar area
- selected slot summary
- notes/help section

## UI requirements
- show timezone clearly
- show advisor available blocks if known
- let startup select one or more preferred slots
- show selected durations
- prevent conflicting or invalid times

## Actions
- Back to Request Form
- Save Preferred Slots
- Submit Request

## Validation
- selected slots must be valid future times
- selected slots must respect configured scheduling constraints
- required minimum slot selection if policy exists

## States
- no slots selected
- invalid slot
- slot conflict
- saved successfully

---

# 8.5 My Consulting Requests (Startup)

## Purpose
Central tracking screen for all requests and sessions.

## Layout
- page header
- status tabs or filters
- requests list/table/cards
- row actions

## Filters
- All
- Requested
- Accepted
- Rejected
- Scheduled
- Completed
- Cancelled

## Each row/card should show
- advisor name
- topic / objective summary
- latest status
- created date
- next scheduled time if any
- confirmation state if relevant
- primary next action

## Row actions by status
### Requested
- View Details
- Edit Request
- Cancel Request

### Accepted
- View Details
- Review proposed time
- Confirm Schedule (if ready)

### Rejected
- View Details
- View rejection reason
- Request another advisor

### Scheduled
- View Session
- Confirm Schedule (if pending)
- Add to calendar (optional)

### Completed
- View Report
- Submit Feedback (if not submitted)

### Cancelled
- View Details
- Duplicate request / Request new session (optional)

---

# 8.6 Request Detail (Startup)

## Purpose
Show one request/session end-to-end with contextual actions.

## Sections
- advisor summary
- request objective and scope
- proposed/preferred time slots
- current status
- timeline/progress tracker
- notes/history
- allowed actions

## Contextual actions
### If Requested
- Edit Request
- Cancel Request

### If Accepted and waiting time resolution
- Review advisor response
- Confirm or adjust via scheduling flow

### If Scheduled
- Confirm Schedule
- View meeting details

### If after session time passed and eligible
- Confirm Conducted

### If report available
- View Consulting Report

### If completed and no feedback yet
- Submit Feedback

---

# 8.7 Confirm Schedule (Startup)

## Purpose
Record Startup confirmation for the agreed consulting time.

## SRS requirements
- session detail view
- scheduled time display
- confirm button

## Required content
- advisor info
- final agreed date/time
- timezone
- format/location/link
- duration
- reschedule policy/help text
- status and confirmation states

## Actions
- Confirm Schedule
- Back

## Validation
- session belongs to current startup
- session is in confirmable scheduled state
- confirmation still allowed

## Success
- record startup confirmation
- update confirmation state
- show success message

## UX note
Use dual-confirmation indicators if both sides must confirm:
- Startup confirmed / not confirmed
- Advisor confirmed / not confirmed

Only when schedule is sufficiently confirmed should the timeline mark the session as ready.

---

# 8.8 Session / Meeting Detail (Shared concept)

## Purpose
Operational screen for an upcoming or ongoing consulting session.

## Required information
- advisor/startup identities
- confirmed schedule
- meeting format
- meeting link / location
- objective summary
- materials/documents if allowed
- reminder status (optional)

## Actions for Startup
- view session details
- confirm conducted (if eligible and time has passed)
- open report once available

## Actions for Advisor
- view session details
- confirm conducted (if applicable)
- submit consulting report

---

# 8.9 Confirm Conducted (Startup)

## Purpose
Allow Startup to confirm the scheduled session actually took place.

## SRS notes
This is explicitly defined in functional requirements even though not highlighted in the earlier screen list.

## UI pattern
Preferred as a confirmation action within Session Detail rather than a separate full page.

## Conditions
- startup authenticated
- session belongs to startup
- scheduled time has passed
- session eligible for confirmation

## UI content
- scheduled session info
- confirmation explanation
- confirm conducted button
- optional issue/report problem link

## State handling
- already confirmed
- too early to confirm
- confirmation blocked by status
- success
- failure

---

# 8.10 View Consulting Report (Startup)

## Purpose
Allow Startup to view the advisor's post-session report and deliverables.

## SRS requirements
- completed session list / entry point
- session details
- consulting report display area
- deliverables section
- read-only display

## Layout
- report header
- session metadata
- summary
- detailed recommendations
- deliverables/files
- advisor conclusion
- next steps

## Actions
- Download report (if allowed)
- Back to session
- Submit Feedback

## States
- report available
- no report yet
- access restricted
- report loading
- retrieval failed

---

# 8.11 Submit Feedback & Rating (Startup)

## Purpose
Collect structured feedback after a completed session.

## SRS requirements
- completed session selector
- advisor information
- rating field
- feedback comment
- submit button

## Form fields
- rating (required, allowed range only)
- feedback comment (optional or required by policy)

## Validation
- session belongs to startup
- session completed
- feedback not already submitted
- rating value within allowed range

## Success
- feedback stored
- advisor rating updated/linked
- request/session detail reflects feedback submitted

## UX notes
- feedback must be submitted only once per completed session
- clearly show if already submitted
- consider read-only submitted view after success

---

# 8.12 Incoming Consulting Requests (Advisor)

## Purpose
Give Advisor a triage inbox for mentoring requests.

## Layout
- tabs/filters by status
- request cards/list
- response SLAs / response time left if configured

## Each item should show
- startup name
- request objective
- topic/scope
- requested format
- preferred slots count
- submitted date
- status
- primary action: View Details

---

# 8.13 Request Details (Advisor)

## Purpose
Let Advisor review a request deeply before responding.

## Sections
- startup summary
- request objective and scope
- preferred format
- additional notes
- preferred time slots
- status and action panel

## Main actions
- Accept Request
- Reject Request
- Propose Alternative Time
- Confirm Time

## Rejection UX
Rejected consulting requests must include a rejection reason.
Provide:
- rejection reason selector
- optional free-text note
- confirm rejection action

---

# 8.14 Confirm Schedule (Advisor)

## Purpose
Advisor confirms or proposes final consulting time.

## UI requirements
- preferred slots from startup
- advisor availability context
- final agreed slot picker/selector
- confirmation action
- optional reschedule note

## States
- accepted but unscheduled
- proposed alternative slot
- final slot agreed
- waiting startup confirmation

---

# 8.15 My Consultings (Advisor)

## Purpose
Advisor’s operational board for accepted/scheduled/completed mentoring sessions.

## Sections
- upcoming
- today
- completed
- cancelled

## Each item
- startup name
- topic
- time
- status
- next action

---

# 8.16 Submit Consulting Report (Advisor)

## Purpose
Close the consulting delivery loop with a formal report.

## Recommended report structure
- session summary
- diagnosed problems
- recommendations
- action items
- deliverables / attachments
- follow-up suggestions

## UX requirements
- structured form, not one long textarea only
- draft save optional
- submit final report
- lock after submission if policy requires

---

# 8.17 Ratings & Feedback (Advisor)

## Purpose
Allow Advisor to view feedback received after completed sessions.

## UI content
- rating summary
- per-session reviews
- startup name
- date
- topic
- optional response action if supported

---

## 9. Shared status model and UI behavior

## 9.1 Top-level status behavior

### Requested
Meaning:
- startup has sent request
- advisor has not responded yet

Allowed startup actions:
- edit request
- cancel request
- view detail

Allowed advisor actions:
- accept
- reject
- view details

### Accepted
Meaning:
- advisor accepted request
- scheduling still being finalized or transitioning to scheduled

Allowed startup actions:
- view request
- review proposed times

Allowed advisor actions:
- propose/confirm consulting time

### Rejected
Meaning:
- advisor declined request

Required UI:
- rejection reason visible
- no editing/canceling needed after final rejection
- CTA to request another advisor

### Scheduled
Meaning:
- time is agreed/recorded and ready for execution

Allowed startup actions:
- confirm schedule
- view session detail
- confirm conducted when eligible

Allowed advisor actions:
- confirm schedule
- view session detail
- submit report after delivery stage

### Completed
Meaning:
- session is done and completed according to workflow

Allowed startup actions:
- view report
- submit feedback (once)

Allowed advisor actions:
- view session outcome
- see rating later

### Cancelled
Meaning:
- request/session ended without completion

Required UI:
- cancellation source if useful
- no further scheduling/report actions

---

## 9.2 Derived progress tracker
Use a horizontal or vertical stepper in detail pages:
- Request Sent
- Advisor Responded
- Time Confirmed
- Session Conducted
- Report Submitted
- Feedback Submitted

This tracker is better for UX than exposing only raw status labels.

---

## 10. Editability rules

## 10.1 Startup request editability
Before advisor response:
- objectives editable
- scope editable
- preferred format editable
- notes editable
- preferred slots editable
- cancel allowed

After advisor responds:
- request core details locked
- schedule-related actions depend on status

## 10.2 Advisor response editability
- once rejected, request is terminal unless policy allows reopen
- once final time confirmed, changes should route through reschedule flow rather than silent edit

---

## 11. Notifications UX

The mentoring flow should generate in-app notifications, and email if user preferences allow it.

## 11.1 Notification events
Startup should receive:
- advisor accepted request
- advisor rejected request
- advisor proposed/confirmed time
- schedule reminder
- report submitted
- feedback status/update if relevant

Advisor should receive:
- new consulting request
- startup updated request before response
- startup confirmed schedule
- schedule reminder
- startup confirmed conducted if relevant
- feedback submitted

## 11.2 Notification UI behavior
Each notification should include:
- event title
- concise description
- date/time
- deep link to request/session/report detail

---

## 12. Required components

### Global/shared
- status badge
- progress stepper
- empty state
- confirmation modal
- rejection reason modal
- toast system
- sticky action bar
- timeline list
- calendar/slot picker
- review/rating stars

### Consulting-specific
- advisor summary card
- startup summary card
- request summary block
- schedule agreement card
- session readiness card
- report viewer
- deliverables list
- feedback form

---

## 13. Data model guidance for UI

## 13.1 Advisor list item
- advisorId
- fullName
- avatarUrl
- verificationStatus
- expertiseHeadline
- expertiseTags[]
- industries[]
- averageRating
- reviewCount
- availabilitySummary
- isEligible
- nextAvailableAt

## 13.2 Consulting request
- requestId
- startupId
- advisorId
- status
- objectives
- scope
- preferredFormat
- expectedDuration
- additionalNotes
- preferredSlots[]
- advisorResponse
- rejectionReason
- createdAt
- updatedAt

## 13.3 Session scheduling fields
- agreedStartAt
- agreedEndAt
- timezone
- startupScheduleConfirmed
- advisorScheduleConfirmed
- proposedAlternativeSlots[]
- meetingMode
- meetingLink
- meetingLocation

## 13.4 Completion/report fields
- conductedConfirmedByStartup
- conductedConfirmedByAdvisor
- reportId
- reportSubmittedAt
- deliverables[]
- feedbackSubmitted
- ratingValue
- feedbackComment

---

## 14. Suggested API/front-end route model

## 14.1 Startup routes
- `/startup/advisors`
- `/startup/advisors/:advisorId`
- `/startup/consulting/create?advisor=:advisorId`
- `/startup/consulting/:requestId/slots`
- `/startup/consulting/requests`
- `/startup/consulting/:requestId`
- `/startup/consulting/:requestId/confirm-schedule`
- `/startup/consulting/:requestId/report`
- `/startup/consulting/:requestId/feedback`
- `/startup/consulting/history`

## 14.2 Advisor routes
- `/advisor/requests`
- `/advisor/requests/:requestId`
- `/advisor/consultings`
- `/advisor/consultings/:sessionId`
- `/advisor/consultings/:sessionId/confirm-schedule`
- `/advisor/consultings/:sessionId/report`
- `/advisor/feedback`

---

## 15. Interaction rules and CTA hierarchy

## 15.1 Startup-side CTA priority by screen
### Search Advisors
Primary: View Profile  
Secondary: Request Consulting

### Advisor Profile
Primary: Request Consulting  
Secondary: Save/Bookmark advisor

### Create Request
Primary: Continue / Submit Request  
Secondary: Cancel

### Request Detail
Primary depends on state:
- Requested → Edit Request / Cancel Request
- Accepted → Review Time / Confirm Schedule
- Scheduled → View Session / Confirm Conducted when eligible
- Completed → View Report / Submit Feedback

## 15.2 Advisor-side CTA priority
### Incoming Requests
Primary: View Details

### Request Details
Primary: Accept Request / Confirm Time  
Secondary: Reject Request

### Session / Meeting
Primary: Submit Report or Confirm Conducted depending on state

---

## 16. Validation and blocking states

## 16.1 Startup request validations
- startup authenticated
- advisor active and eligible
- required request fields completed
- supported values only
- request belongs to current startup when editing/canceling/viewing
- request still editable before advisor response

## 16.2 Scheduling validations
- selected/proposed times are future times
- session belongs to current user
- session is in confirmable scheduled state before confirmation
- conducted confirmation only allowed after scheduled time has passed

## 16.3 Feedback validations
- session belongs to startup
- session completed
- feedback not already submitted
- rating within allowed range

---

## 17. Empty, error, and edge states

## 17.1 Search Advisors
- no advisors yet
- no matches
- unavailable advisor
- network error

## 17.2 Request creation
- advisor ineligible
- missing required fields
- unsupported values
- submit failed

## 17.3 Request tracking
- no requests yet
- request auto-cancelled by timeout
- status changed by another actor before action
- request no longer editable/cancellable

## 17.4 Scheduling
- no mutually suitable slot
- slot expired
- schedule already confirmed
- session cancelled before confirmation

## 17.5 Session/report
- report not submitted yet
- report access restricted
- deliverable missing
- session not eligible for conducted confirmation

## 17.6 Feedback
- already submitted
- session not completed
- invalid rating

---

## 18. Recommended UI patterns

## 18.1 Status badge colors (example system)
- Requested = neutral blue/gray
- Accepted = positive blue/teal
- Rejected = red
- Scheduled = purple/indigo
- Completed = green
- Cancelled = gray

## 18.2 Timeline pattern
Use a vertical activity timeline in request/session detail:
- request created
- advisor accepted/rejected
- schedule confirmed
- reminder sent
- session conducted
- report submitted
- feedback submitted

## 18.3 Schedule confirmation card
Show:
- agreed slot
- timezone
- who confirmed
- outstanding confirmation state
- meeting mode/link

## 18.4 Report viewer
Prefer structured sections over raw text dump.

## 18.5 Feedback UI
Use:
- 5-star rating
- optional text comment
- submission lock after success

---

## 19. Accessibility and usability

- all actions keyboard accessible
- status not conveyed by color alone
- slot picker accessible with keyboard and screen readers where possible
- focus order must be logical
- destructive actions require confirmation
- dates/times must show timezone clearly
- mobile cards must preserve next-step clarity

---

## 20. Mobile guidance

Mobile should support core startup features as noted in SRS.

Recommended mobile scope:
- search advisors
- view advisor profile
- create request
- track request status
- confirm schedule
- view report
- submit feedback

Mobile UI pattern:
- stacked cards instead of dense tables
- bottom action sheet for status-specific actions
- compact timeline
- calendar slot picker optimized for touch

---

## 21. Suggested implementation sequence

### Phase 1 — Startup discovery + request creation
- Search Advisors
- Advisor Profile
- Create Consulting Request
- Select Preferred Time Slots

### Phase 2 — Core request lifecycle
- My Consulting Requests
- Request Detail
- Edit / Cancel Request
- Advisor Incoming Requests + Request Details
- Accept / Reject

### Phase 3 — Scheduling and session execution
- Confirm Schedule (both sides)
- Session Detail
- Conducted confirmation
- reminders integration

### Phase 4 — Delivery and outcome
- Submit Consulting Report
- View Consulting Report
- Submit Feedback
- Ratings & Feedback
- Consulting History

---

## 22. QA checklist

## 22.1 Discovery
- Search returns relevant advisors
- filters combine correctly
- unavailable advisor CTA disabled correctly

## 22.2 Request creation
- cannot submit empty required fields
- advisor ineligible blocks submission
- valid request creates `Requested` status

## 22.3 Edit/cancel rules
- request editable only before advisor response
- cancel blocked when not allowed
- messages shown correctly on invalid action

## 22.4 Scheduling
- both roles can see final agreed time
- confirmation updates state correctly
- session cannot proceed without confirmed schedule

## 22.5 Conducted/report/feedback
- conducted confirmation only after session time passes
- report view only if available and accessible
- feedback allowed only once per completed session

## 22.6 History and notifications
- completed sessions appear in history
- reminders link to correct detail screens
- status notifications match current lifecycle

---

## 23. Final implementation guidance

When coding this feature, treat it as a **workflow product**, not a set of disconnected CRUD pages.

The most important UX rule is:

> Every mentoring-related screen must clearly show the current state, the next allowed action, and why other actions are unavailable.

If this rule is followed consistently, the Startup ↔ Advisor mentoring flow will feel structured, reliable, and aligned with AISEP’s intended operating model.

