# AISEP – Startup Profile UI Implementation Spec

*Purpose: one implementation-ready file for FE/UI work on Startup Profile, based strictly on the uploaded SRS and business/domain notes.*

| Applies to | Role: Startup |
| --- | --- |
| Screens | Startup Profile, Edit Startup Profile, Visibility controls, key states |
| Primary source basis | SRS: Create Startup Profile / Update Startup Profile / View Startup Profile / Screen Descriptions / Business Rules |
| Use this file for | UI design, FE implementation, API payload mapping, QA scope alignment |

## 1. What must be built

- A view screen: Startup Profile.

- An edit screen: Edit Startup Profile.

- Visibility state inside the profile: View Startup Visibility Status, Enable Visibility to Investors, Disable Visibility to Investors.

- The profile must exist before startup can use downstream features such as document upload or AI evaluation readiness.

## 2. Source-grounded scope

- SRS explicitly defines Startup Profile and Edit Startup Profile as separate screens.

- View Startup Profile must show: profile summary section, logo area, business information fields, visibility status, and Update Profile button.

- Create Startup Profile explicitly lists the initial input fields: startup name, company logo, industry selection, business description, founding date, team size, business stage, website, contact information, and address/location.

- Business/domain notes add the standardized startup data structure used across discovery and comparison: startup name, tagline, stage, primary industry, location, website/product/demo link, logo, problem statement, solution summary, market scope, product status, current needs, founder names, founder roles, team size, validation status, and optional short metric summary.

- Investor-side Startup Details in SRS requires sections such as Overview, Stage/Industry, Team, Highlights, and Documents. For startup self-profile, these sections are safe UI groupings for the same underlying profile data, but they are layout assumptions rather than direct startup-side SRS wording.

> **Note:** Assumption policy: anything in this spec marked “UI structuring assumption” is a layout/organization decision inferred from the docs to make implementation clean. It does not invent new business rules.

## 3. Screen map and recommended IA

| Screen | Mandatory from SRS | Recommended content groups | Notes |
| --- | --- | --- | --- |
| Startup Profile | Yes | Header / Overview / Business / Stage & market / Team / Validation / Visibility / Highlights / Quick actions | Business, Team, Visibility are mandatory. Section grouping beyond that is a UI structuring assumption. |
| Edit Startup Profile | Yes | Tab A: Basic Identity; Tab B: Business & Market; Tab C: Team & Validation; Tab D: Visibility | SRS only says editable profile fields + save/cancel. Tab structure is recommended for usability. |

## 4. Startup Profile (view screen) – exact UI contract

### 4.1 Header area

- Show startup name as primary title.

- Show logo in a fixed visual block.

- Show stage, primary industry, location, and visibility status in the first viewport.

- Primary action: Update Profile.

- Secondary status chip: profile visibility to investors (Visible / Hidden / Pending approval if applicable).

### 4.2 Mandatory content blocks

| Block | Must show | Data source basis | Implementation note |
| --- | --- | --- | --- |
| Profile summary section | Startup name, logo, headline summary, visibility status, Update Profile button | View Startup Profile interface + Create Startup Profile fields | Mandatory |
| Business information fields | Industry, business description, founding date, website, contact info, address/location | Create Startup Profile interface | Mandatory |
| Stage / market | Stage, market scope, product status, current needs | Business/domain notes; investor-side profile sections | Recommended but strongly aligned with discovery/comparison logic |
| Team | Founder names, founder roles, team size | Business/domain notes + Create Startup Profile team size | Recommended and high-value |
| Validation / traction | Validation status, optional short metric summary | Business/domain notes | Recommended |
| Highlights | Short problem statement, solution summary, selected milestones if available | Business/domain notes + investor-side “Highlights section” | UI structuring assumption |
| Documents teaser | Only a compact link/count/CTA to Documents & IP, not full document management here | Cross-feature relation in SRS | Optional shortcut; do not duplicate full doc list unless product chooses unified profile |

### 4.3 Recommended visual hierarchy

- Row 1: logo, startup name, tagline/headline, stage, industry, location, visibility.

- Row 2: problem statement + solution summary.

- Row 3: grouped facts (market scope, product status, current needs, founding date).

- Row 4: team snapshot and validation snapshot.

- Bottom action row: Update Profile, Manage Documents, Request AI Evaluation (only if readiness rules allow).

## 5. Edit Startup Profile – exact UI contract

### 5.1 Required behavior from SRS

- Load current profile values.

- Show editable profile fields.

- Provide Save and Cancel.

- Validate updated data before save.

- Check permission for restricted fields.

- On success: refresh profile and show success feedback.

- On invalid input: show validation feedback.

### 5.2 Recommended form architecture

| Tab / section | Fields | Why this grouping |
| --- | --- | --- |
| A. Basic identity | Startup name; logo; tagline; primary industry; stage; founding date; website/product/demo link; contact information; address/location | Matches creation fields and keeps “who we are” together |
| B. Business & market | Business description; problem statement; solution summary; market scope; product status; current needs | Matches the standardized startup structure used for discovery/comparison |
| C. Team & validation | Founder names; founder roles; team size; validation status; optional short metric summary | Supports investor evaluation and recommendation quality |
| D. Visibility | Visibility status; enable/disable visibility; helper text about investor discoverability | Required by SRS use cases UC-21 to UC-23 |

## 6. Master field inventory

| Field | View screen | Edit control | Required for create | Recommended validation | Source status |
| --- | --- | --- | --- | --- | --- |
| Startup name | Yes, title | Text input | Yes | Required; non-empty | Explicit in SRS |
| Logo | Yes | Image upload | Yes | Supported file type/size | Explicit in SRS |
| Tagline | Yes | Short text | No | Short max length | Business doc only |
| Primary industry | Yes | Select | Yes | Must match supported taxonomy | Explicit + business doc |
| Stage | Yes | Select | Yes (business stage) | Must match supported taxonomy | Explicit + business doc |
| Founding date | Optional view | Date input | Yes | Valid date only | Explicit in SRS |
| Website / product link / demo link | Yes | URL input(s) | Yes (website) | Valid URL format | Explicit + business doc |
| Contact information | Optional view or structured sub-section | Text/email/phone inputs | Yes | Format per field | Explicit in SRS |
| Address / location | Yes | Location input | Yes | Required; location taxonomy if used | Explicit in SRS |
| Business description | Yes | Textarea | Yes | Required; sensible max length | Explicit in SRS |
| Problem statement | Yes | Textarea | No | Short to medium max length | Business doc only |
| Solution summary | Yes | Textarea | No | Short to medium max length | Business doc only |
| Market scope | Yes | Select (B2B/B2C/B2G/B2B2C) | No | Supported enum only | Business doc only |
| Product status | Yes | Select | No | Supported enum only | Business doc only |
| Current needs | Yes | Multi-select | No | Supported enum values only | Business doc only |
| Founder names | Yes | Repeater list | No | At least 1 if team block shown | Business doc only |
| Founder roles | Yes | Repeater list / paired with founders | No | Role text or supported enum | Business doc only |
| Team size | Yes | Number/select | Yes | Positive range | Explicit + business doc |
| Validation status | Yes | Select | No | Supported enum only | Business doc only |
| Optional short metric summary | Yes | Short textarea | No | Short length only | Business doc only |
| Visibility status | Yes | Toggle or segmented control | N/A | State must respect policy | Explicit in SRS |

## 7. Visibility and discoverability behavior

- Startup must be able to view its current visibility status.

- Startup must be able to enable visibility to investors.

- Startup must be able to disable visibility to investors.

- Only one startup profile is allowed per startup account.

- Visibility should be surfaced both on the view screen and in the edit flow.

- If platform policy requires approval of startup public profile or sensitive verified-profile changes, the UI should support a non-editable “pending review” status when applicable.

### Recommended UI states for visibility

- Visible to investors.

- Hidden from investors.

- Pending approval / pending review (only if backend exposes this state).

- Restricted by policy (read-only status with explanatory helper text).

## 8. Validation and state handling

| State / rule | Where | Expected UI behavior | Source basis |
| --- | --- | --- | --- |
| Profile does not exist | View or edit entry | Show empty/creation state; CTA = Create Startup Profile | SRS create/view |
| Invalid field input | Edit screen | Inline error + block save | SRS update validation |
| Restricted field cannot be changed | Edit screen | Disable field or show locked state + helper text | SRS update profile |
| Access restricted | View or edit | Show permission error state | BR-30 / BR-50 |
| Save success | Edit screen | Toast/banner and refreshed profile | SRS update profile |
| Processing failure | Any | Global error banner / retry | SRS MSG008 flows |

## 9. Suggested frontend data model

```json
{
  "startupName": "",
  "logoUrl": "",
  "tagline": "",
  "primaryIndustry": "",
  "stage": "",
  "foundingDate": "",
  "websiteUrl": "",
  "productUrl": "",
  "demoUrl": "",
  "contact": {
    "email": "",
    "phone": ""
  },
  "location": {
    "displayText": ""
  },
  "businessDescription": "",
  "problemStatement": "",
  "solutionSummary": "",
  "marketScope": "",
  "productStatus": "",
  "currentNeeds": [],
  "team": {
    "teamSize": null,
    "founders": [
      {"name": "", "role": ""}
    ]
  },
  "validationStatus": "",
  "metricSummary": "",
  "visibilityStatus": "",
  "lastUpdatedAt": ""
}
```

## 10. Implementation checklist (definition of done)

- Startup Profile screen exists and matches role Startup.

- Edit Startup Profile screen exists and loads current values.

- View screen shows logo, business information, visibility status, and Update Profile button.

- Field taxonomy supports stage, industry, market scope, product status, current needs, team, and validation.

- Visibility can be viewed and changed through the UI.

- Validation errors are inline and save is blocked when data is invalid.

- Read-only / locked behavior exists for restricted fields.

- If no profile exists, user is routed to a creation/onboarding state instead of a broken blank page.

- Screen supports web responsive layout; mobile can stack sections but must preserve the same data contract.

## 11. What not to do

- Do not reduce Startup Profile to only the create-form fields if the product also needs investor-readable standardized data.

- Do not bury visibility status in a hidden settings area; it is part of the profile contract.

- Do not mix full Documents & IP management into the profile screen; link to it instead unless product explicitly chooses a unified profile.

- Do not invent investor-only fields such as match score or watchlist notes in the startup self-profile.

- Do not allow edits to restricted fields if backend policy marks them locked.

## 12. Source traceability summary

| Document basis | Used for | Confidence |
| --- | --- | --- |
| SRS – Create Startup Profile / Update Startup Profile / View Startup Profile | Mandatory screens, required controls, validation, save/cancel, role restrictions | High |
| SRS – Screen Descriptions | Confirms Startup Profile and Edit Startup Profile as dedicated screens | High |
| SRS – Business Rules BR-30, BR-46, BR-50 and related profile/document rules | Permissions, single profile per startup, role-based access | High |
| Business/domain notes – Startup field structure | Standardized profile fields needed for discovery/comparison and investor readability | High for field taxonomy, medium for exact startup-side layout |
| Investor-side Startup Details in SRS | Used only to structure startup-side sections more clearly | Medium; UI structuring assumption |

End of spec. This file is intended to be implementation-facing and deliberately avoids adding business rules beyond what is supported by the uploaded AISEP documents.
