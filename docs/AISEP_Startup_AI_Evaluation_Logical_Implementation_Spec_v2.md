# AISEP — Startup AI Evaluation UI/UX Implementation Spec

## 1. Purpose

This document defines the UI/UX implementation scope for the **Startup-side AI Evaluation** feature in AISEP.

The goal is to help Startup users:
- understand whether their startup is ready for AI evaluation,
- explicitly request an AI evaluation,
- track asynchronous evaluation progress,
- view the latest **Startup Potential Score**,
- review **AI Evaluation History**,
- open the **AI Detailed Report**,
- understand that AI output is **decision support only**, not investment advice.

This spec is intended for UI/UX design and frontend implementation.

---

## 2. Source Scope from AISEP Documents

### Core startup use cases involved
- **UC-35** Request AI Evaluation
- **UC-36** View Startup Potential Score
- **UC-37** View AI Detailed Report
- **UC-38** View AI Evaluation History

### Screen descriptions involved
- **Request AI Evaluation**
- **Startup Potential Score**
- **AI Evaluation History**
- **AI Detailed Report (Startup)**

### Supporting internal service / business logic references
- AI evaluation is requested by Startup explicitly, not generated automatically.
- The request validates startup profile readiness and document sufficiency.
- The request is processed **asynchronously**.
- When completed, the system stores the result and notifies the startup.
- AI evaluation outputs must include traceability metadata such as model version, prompt version, and timestamp.
- AI output is advisory / decision support only.

### Domain guidance from business documents
- AISEP positions AI as a **first-signal / standardization / screening** tool.
- AI should evaluate documents that reflect **business capability**, especially **Pitch Deck** and **Business Plan**.
- AI should **not** be treated as a replacement for formal review, legal review, or investment decision-making.

---

## 3. Feature Boundary

### In scope
1. AI Evaluation landing / module entry
2. Request AI Evaluation screen
3. Readiness checks UI
4. Async job status UI
5. Startup Potential Score summary screen
6. AI Evaluation History list screen
7. AI Detailed Report screen
8. Empty / processing / completed / failed states
9. Compliance disclaimer and report traceability display
10. Routing between current result, history, and detailed report

### Adjacent but separate modules
These may hand off into AI Evaluation but should remain separate modules:
- Startup Profile Management
- Documents & IP
- Document upload / replace / metadata
- Analyze Documents internal AI service flow
- Notification center

### Out of scope for this spec
- AI model implementation
- Prompt engineering internals
- Backend job queue internals
- Admin / operation staff review of exceptional AI evaluation cases
- Investor-side AI evaluation view
- Detailed scoring algorithm internals beyond what the UI must explain

---

## 4. Product Goals

The feature should help Startup users answer 4 questions quickly:
1. **Am I ready to request AI evaluation?**
2. **What is my latest startup potential score?**
3. **What are the main strengths, risks, and gaps the AI found?**
4. **How has my evaluation changed over time?**

The UX must feel like a **guided evaluation workflow**, not a raw analytics dump.

---

## 5. Primary User Flow

### Main flow
1. Startup opens the **AI Evaluation** module.
2. System displays the evaluation entry screen with:
   - profile readiness,
   - document readiness,
   - evaluation scope,
   - latest result summary if any,
   - history entry point.
3. Startup reviews readiness.
4. Startup clicks **Request AI Evaluation**.
5. System validates startup profile and supporting document sufficiency.
6. If valid, system creates an evaluation request and triggers the AI engine.
7. System updates request status asynchronously.
8. Startup sees job progress state.
9. When completed, system stores the result and notifies the startup.
10. Startup opens **Startup Potential Score**.
11. Startup can continue to **AI Detailed Report**.
12. Startup can also view **AI Evaluation History** and open prior runs.

### Secondary flows
- Startup opens AI Evaluation and sees **not ready** state.
- Startup jumps from AI Evaluation to **complete profile**.
- Startup jumps from AI Evaluation to **manage documents**.
- Startup re-runs AI evaluation after updating profile/documents.
- Startup compares the newest evaluation with prior runs through history.

---

## 6. Information Architecture

### Screen A — AI Evaluation Home / Entry
Purpose:
- serve as the module entry point,
- explain readiness,
- explain what the AI will evaluate,
- allow the user to start a request,
- show current/latest status if one exists,
- provide entry points to score, report, and history.

### Screen B — Request AI Evaluation
Purpose:
- make the submission action explicit,
- show readiness conditions,
- show evaluation scope,
- confirm that the request will be processed asynchronously.

### Screen C — Startup Potential Score
Purpose:
- present the latest completed overall score,
- show a concise summary and evaluation date,
- route to detailed report.

### Screen D — AI Evaluation History
Purpose:
- show previous evaluation runs,
- support sorting/filtering,
- support opening historical runs.

### Screen E — AI Detailed Report (Startup)
Purpose:
- present the detailed AI-generated report,
- surface strengths, risks, gaps, recommendations,
- provide traceability metadata and compliance disclaimer.

---

## 7. Screen A — AI Evaluation Home / Entry

### Purpose
This is the best default landing screen for the AI Evaluation module.
It should summarize the startup’s AI evaluation state at a glance.

### Recommended layout
**Top summary section**
- page title: `AI Evaluation`
- subtitle explaining AI evaluation is based on startup profile and uploaded documents
- latest evaluation status chip
- last completed evaluation date if available
- primary CTA based on state

**Middle readiness section**
- profile readiness card
- document readiness card
- evaluation scope card

**Bottom navigation section**
- latest result preview card
- history shortcut card
- detailed report shortcut card

### Content blocks

#### A. Header
Show:
- `AI Evaluation`
- short explanation:
  - AI evaluates your startup based on profile data and supported business documents.
- status chip:
  - Not Ready
  - Ready
  - Queued
  - Processing
  - Completed
  - Failed

#### B. Profile Readiness
Show whether required profile data exists.
Recommended checklist items:
- startup profile exists
- stage is selected
- core business summary exists
- team/basic company info exists

UI pattern:
- checklist card
- completion ratio
- missing-item list
- CTA: `Complete Startup Profile`

#### C. Document Readiness
Show whether sufficient supporting documents exist.
Recommended items:
- supported document exists
- at least one eligible business document is available
- documents are readable and owned by current startup

**Important domain rule**
UI should guide users toward **Pitch Deck** and **Business Plan** as the main evaluation inputs.
It should not imply that legal/IP evidence files are equally suitable for AI evaluation.

UI pattern:
- checklist card
- eligible documents summary
- missing-item text
- CTA: `Manage Documents`

#### D. Evaluation Scope
Show what the request will evaluate.
Suggested bullets:
- startup profile data
- selected / eligible business documents
- latest supported data only
- AI output includes score, summary, risks, gaps, and recommendations

Also show note:
- `This evaluation is a decision-support signal only and does not constitute investment advice.`

#### E. Latest Result Preview
If a completed evaluation exists, show:
- latest score
- score summary
- evaluation date
- View Detailed Report button
- View History button

#### F. Request Area
Primary CTA behavior:
- Not Ready → `Complete Requirements`
- Ready → `Request AI Evaluation`
- Queued / Processing → `View Status`
- Completed → `Run New Evaluation`
- Failed → `Retry Evaluation`

---

## 8. Screen B — Request AI Evaluation

### Purpose
This screen makes the submission action explicit and safe.
It should reduce accidental submissions and clearly explain what will be analyzed.

### Required elements from SRS
- Request AI Evaluation button
- Profile readiness section
- Document readiness section
- Evaluation scope display
- Submit button

### Recommended layout
**Left/main column**
- readiness summary
- supported input summary
- evaluation scope description

**Right/side column**
- latest eligible documents summary
- current startup stage / profile snapshot
- submit card

### Core UI sections

#### A. Readiness Summary
Show pass/fail or ready/not-ready for:
- profile requirements
- document requirements
- access/authentication state

#### B. Eligible Inputs Summary
Show the data that will be used, for example:
- startup profile snapshot
- 1–3 eligible documents
- latest update timestamp

For MVP, use read-only display.
Do not let the user build a highly complex custom pipeline unless the backend supports it.

#### C. Submit Confirmation
Before actual submit, show:
- request scope
- async processing expectation
- disclaimer that results are advisory only
- note that duplicate or invalid requests may be restricted

Possible CTA pattern:
- `Submit AI Evaluation`
- secondary text: `Processing may take time. You will receive status updates.`

### Validation / guardrails
If not ready:
- disable submit button
- show concrete missing items
- route the user to Startup Profile or Documents & IP

If duplicate request restriction applies:
- show warning such as `An active evaluation request is already in progress.`
- provide `View Current Status`

### Submission states
- idle
- validating
- submitting
- queued
- processing
- failed to submit

---

## 9. Async Job Status UX

AI evaluation is a long-running flow and must be treated as an async job.

### Supported job statuses
At minimum, support:
- `Queued`
- `Processing`
- `Completed`
- `Failed`

### Status card design
Show:
- current status
- request created time
- most recent status update time
- short explanation
- auto-refresh or manual refresh button

### Status-specific UX

#### Queued
- Show queued state calmly.
- Tell user the request has been accepted.
- CTA: `View History`

#### Processing
- Show progress-style waiting state.
- Do not fake a percentage unless backend provides one.
- CTA: `Refresh`

#### Completed
- Show success state.
- CTA: `View Potential Score`
- CTA: `View Detailed Report`

#### Failed
- Show failure state with retry guidance.
- CTA: `Retry Evaluation`
- CTA: `Review Requirements`

### Notification behavior
When the evaluation completes or fails, the startup should receive a notification.
The UI should assume notification + in-module status both exist.

---

## 10. Screen C — Startup Potential Score

### Purpose
This is the summary result screen for the newest completed evaluation.
It must be fast to scan.

### Required SRS elements
- potential score display
- score summary
- evaluation date
- View Detailed Report button

### Recommended layout
**Hero score block**
- large score number
- score label: `Startup Potential Score`
- short interpretation label (optional if supported)
- latest evaluation date

**Summary insight block**
- concise narrative summary
- top strengths summary
- top concerns summary

**Action row**
- `View Detailed Report`
- `View Evaluation History`
- `Run New Evaluation`

### Good UX behavior
- The score should be visually dominant.
- The summary should be concise.
- This screen should never feel like the full report.
- It should help the user decide whether to go deeper.

### Empty state
If no completed result exists:
- show empty state with `No completed AI evaluation yet`
- CTA: `Request AI Evaluation`

---

## 11. Screen D — AI Evaluation History

### Purpose
Allow Startup users to review previous AI evaluations over time.

### Required SRS elements
- evaluation history list
- date column
- status column
- score column
- sort/filter controls

### Recommended layout
A table or card-list view with:
- date/time
- run status
- score
- run label/version
- action to open report

### Suggested columns
- Evaluation Date
- Status
- Score
- Scope / Input Snapshot (optional)
- Model Version (optional)
- Prompt Version (optional)
- Actions

### Filters / sorting
Minimum controls:
- sort by newest / oldest
- filter by status
- filter by date range (optional)

### Row actions
- View Score Summary
- View Detailed Report
- Retry (only if failed and policy allows)

### Important UX notes
- Keep the list easy to scan.
- Highlight latest completed result.
- Distinguish failed / incomplete / completed clearly.
- Preserve audit-style traceability without looking overly technical.

### Empty state
If there is no history:
- `No AI evaluation history yet`
- CTA: `Request AI Evaluation`

---

## 12. Screen E — AI Detailed Report (Startup)

### Purpose
This screen shows the full AI analysis for a selected completed evaluation.

### Caution
The SRS explicitly names this screen, but does not fully enumerate every section in the startup-side report UI.
Therefore, the detailed structure below combines:
- the named startup screen,
- the startup score/report requirements,
- the investor-side AI report viewing structure,
- the internal AI analysis output structure,
- report traceability / compliance requirements.

This is a **derived implementation spec**, not a verbatim one-line copy from the document.

### Recommended layout
**Top summary header**
- report title
- evaluation date
- status
- overall score
- disclaimer chip

**Main report body**
- executive summary
- breakdown sections
- strengths
- risks / concerns
- gaps / missing information
- recommendations / improvement actions

**Right side panel or top metadata area**
- model version
- prompt version
- report timestamp
- input snapshot summary
- links to history / latest score

### Recommended report sections

#### A. Executive Summary
Show:
- concise overall narrative
- what the AI thinks is strongest
- what needs the most work

#### B. Overall Score + Breakdown
Show:
- overall score
- category-level breakdowns if backend supports them

Example categories can be:
- Team
- Market
- Product / Solution
- Business model / traction
- Readiness / execution

Only render categories actually supported by backend.
Do not hardcode fake scoring categories if the API does not provide them.

#### C. Key Strengths
Show top strengths identified by AI.
Keep this concise and structured.

#### D. Risks / Concerns
Show main concerns or risk areas.
Use calm language.
Avoid alarmist phrasing.

#### E. Gaps / Missing Information
Because internal AI analysis explicitly mentions missing information and gaps, this section should surface what the startup may still need to improve or provide.

#### F. Recommendations
Show specific improvement opportunities and next steps.
These should be clearly labeled as **AI-generated recommendations**.

#### G. Traceability / Report Metadata
Show:
- evaluation timestamp
- model version
- prompt version
- report/run ID
- source input summary if available

#### H. Compliance Disclaimer
Always display a disclaimer such as:
- `This report is generated for decision support and preparation purposes only. It is not investment advice and does not replace formal human review.`

### Action buttons
- `Back to Score Summary`
- `View History`
- `Run New Evaluation`
- `Export / Download Report` (only if supported)

---

## 13. Readiness Rules in the UI

The UI must present readiness as a first-class concept.

### Readiness dimensions
1. **Profile readiness**
2. **Document readiness**
3. **Eligibility / request state**

### Suggested readiness levels
- Not ready
- Partially ready
- Ready

### Suggested messages
- `Complete your startup profile before requesting AI evaluation.`
- `Upload at least one eligible business document to continue.`
- `Your startup is ready for AI evaluation.`

### UX rule
Never let the user discover missing requirements only after a failed submit if the system can know them ahead of time.

---

## 14. Document Eligibility Guidance

### What the UI should encourage
The business document strongly suggests AI should evaluate **Pitch Deck** and **Business Plan** because these reflect startup business capability.

### What the UI should avoid implying
Do not imply that all document types are equally valid AI-evaluation inputs.
In particular, legal/IP proof documents should not be presented as the same class of AI evaluation inputs.

### UI suggestions
In the AI Evaluation module, use labels such as:
- `Eligible for AI evaluation`
- `Recommended for evaluation`
- `Not used by AI evaluation`

This makes document readiness more trustworthy and understandable.

---

## 15. Data & Component Requirements

### Core data needed by the frontend
- latest evaluation record
- evaluation status
- score
- score summary
- evaluation date
- detailed report content
- evaluation history records
- readiness summary
- eligible document summary
- report metadata:
  - model version
  - prompt version
  - timestamp

### Core reusable components
- status chip
- readiness checklist card
- score hero card
- report section card
- history table/list
- empty state block
- async processing state block
- compliance disclaimer block
- report metadata pill/row component

---

## 16. Page State Matrix

### Module entry states
- no evaluation yet + not ready
- no evaluation yet + ready
- queued
- processing
- completed
- failed

### Score screen states
- completed result available
- no completed result
- access restricted
- load failed

### History states
- populated history
- empty history
- filtered empty history
- load failed

### Detailed report states
- report available
- report not found
- access restricted
- render failed

---

## 17. Validation Rules for the UI

### Request submission validation
- user must be authenticated
- startup profile and required data must exist
- supporting documents must be sufficient
- duplicate / invalid requests may be restricted

### History validation
- only records that belong to the current startup may be shown
- sort/filter values must be supported

### Detail/report validation
- only the startup’s own result is displayed
- only completed evaluations should open full report content unless backend supports partial views

---

## 18. Error / Empty / Warning States

### Common empty states
- No AI evaluation yet
- No completed result yet
- No history yet
- No eligible documents available

### Common warning states
- Profile incomplete
- Document readiness insufficient
- Another evaluation is already running
- Some required data is outdated

### Common error states
- Processing failed
- Could not load history
- Could not load detailed report
- Access restricted

### Message behavior
Use the platform’s common message strategy:
- success for accepted/finished actions
- warning for missing readiness / not enough data
- error for processing failure or restricted access

---

## 19. Navigation Model

### Recommended routes
- `/startup/ai-evaluation`
- `/startup/ai-evaluation/request`
- `/startup/ai-evaluation/score`
- `/startup/ai-evaluation/history`
- `/startup/ai-evaluation/:evaluationId`

### Route behavior
- latest score route should default to newest completed result
- history route should preserve filter/sort state where practical
- detailed report route should be directly linkable

---

## 20. Suggested API Contract Shape

This is a frontend-oriented suggestion, not a mandatory backend design.

### A. Get AI evaluation dashboard state
Response may include:
- readiness summary
- latest evaluation record
- latest completed result
- current active job if any
- eligible documents summary

### B. Submit evaluation request
Request:
- optional selected input snapshot if supported

Response:
- accepted request id
- initial status = queued or processing

### C. Get latest score summary
Response:
- score
- summary
- evaluation date
- evaluation id

### D. Get evaluation history
Response list:
- evaluation id
- created at
- completed at
- status
- score
- model version
- prompt version

### E. Get evaluation report detail
Response:
- overall score
- summary
- breakdown sections
- strengths
- risks
- gaps
- recommendations
- model version
- prompt version
- timestamp

---

## 21. Accessibility & UX Quality Notes

- Do not rely on color alone for status.
- Status chips must include text labels.
- History table and score summary must be keyboard navigable.
- Long-running states must be understandable to screen readers.
- Scores should not be the only visible output; textual explanation is required.
- Disclaimers must remain readable and not hidden behind tooltips only.

---

## 22. QA / Acceptance Checklist

### Request AI Evaluation
- readiness is shown before submission
- submit is blocked when readiness is insufficient
- duplicate active request is handled correctly
- async job status changes are reflected in UI

### Startup Potential Score
- latest completed result is shown
- score summary and evaluation date are visible
- empty state appears when no completed result exists
- detailed report route works

### Evaluation History
- history list loads correctly
- sort/filter works
- status labels are clear
- opening a historical result works

### AI Detailed Report
- overall score and summary render correctly
- strengths / risks / gaps / recommendations render correctly
- traceability metadata is visible
- compliance disclaimer is visible

### State handling
- queued, processing, completed, failed all render properly
- loading, empty, and error states are covered
- navigation between entry / score / history / detail is coherent

---

## 23. Implementation Notes / Design Guidance

### Important guidance 1
Treat **AI Evaluation** as a workflow, not a single page.
The user journey must move naturally from:
- readiness,
- request,
- waiting,
- summary result,
- deep report,
- history.

### Important guidance 2
Do not over-promise certainty.
The entire UI must reinforce that AI output is a support layer.

### Important guidance 3
Keep score UX explainable.
The startup should never see only a number with no explanation.

### Important guidance 4
Keep report UX actionable.
The report should help the startup improve their investment-readiness materials and profile quality.

---

## 24. Recommended MVP Priorities

### MVP must-have
1. AI Evaluation entry screen with readiness
2. Request AI Evaluation submission flow
3. Async status handling
4. Startup Potential Score screen
5. AI Evaluation History screen
6. AI Detailed Report screen
7. Compliance disclaimer

### Phase 2 nice-to-have
- richer breakdown charts
- score change delta vs previous run
- compare two historical runs
- export report
- tighter document selection controls

---

## 25. Final Recommendation

Implement Startup AI Evaluation as a dedicated module with **4 visible user-facing screens**:
- Request AI Evaluation
- Startup Potential Score
- AI Evaluation History
- AI Detailed Report

Use the module entry page to manage readiness and active job states.
This will align best with the SRS, preserve the async nature of the AI workflow, and give Startup users a clear, trustworthy path from request to result review.
