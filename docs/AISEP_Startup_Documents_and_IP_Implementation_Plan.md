
# AISEP Startup Documents & IP — UI/Implementation Plan

## 1. Purpose

This file defines the implementation plan for the **Startup Documents & IP** feature in AISEP, based on the SRS and business-domain documents.

The module exists to let a startup:
- upload and manage business/IP-related documents
- control metadata and visibility
- version/replace files
- generate and store document integrity proof via blockchain
- verify authenticity against on-chain records
- expose only permitted document metadata/content to investors under policy

This module is a core trust layer of AISEP, not just a generic file manager.

---

## 2. Source-based scope

### 2.1 Main screens in scope
Per SRS screen descriptions, the Startup Documents & IP feature includes:
1. **Documents & IP (List)**
2. **Upload Document**
3. **Document Details**
4. **Replace File / New Version**
5. **Edit Metadata / Visibility**
6. **Blockchain Verification Status**

### 2.2 Startup use cases in scope
Per SRS use cases, the module includes:
- Manage Documents & IP
- Upload document
- Update document metadata (type, title, tags, visibility)
- Replace document file / create new version
- Delete document
- View document list
- View document details
- Generate document hash
- Submit document hash to blockchain
- Verify document authenticity on-chain
- View blockchain verification status

### 2.3 Blockchain service functions closely related to UI
The SRS also defines two related blockchain-service flows that should be reflected in the UI:
- **Check on-chain hash**
- **Track blockchain transaction status**

### 2.4 Business/domain intent
The business document states AISEP needs this feature because, without it:
- startups can change documents after sharing them
- investors may doubt document integrity
- AISEP has no neutral proof in disputes

The intended main flow is:
1. upload document
2. generate document fingerprint/hash + metadata
3. record proof on blockchain
4. store the original file off-chain

---

## 3. Product goal

The Documents & IP module should help a startup do 4 things well:

1. **Store and organize files safely**
2. **Control what is visible and to whom**
3. **Maintain version clarity**
4. **Prove integrity without exposing document contents on-chain**

This means the UX should feel like a **secure document workspace**, not a simple upload page.

---

## 4. In-scope vs out-of-scope

### 4.1 In scope
- Startup-side document list and management
- Upload new document with metadata
- Edit metadata and visibility
- Replace file / create a new version
- Delete document when allowed
- View document details and preview/download
- Generate hash
- Submit hash to blockchain
- View blockchain verification state
- Verify authenticity against on-chain record
- Track blockchain transaction status
- Show relevant notifications/status states
- Prepare visible metadata correctly for investor-side read-only review

### 4.2 Out of scope for this module
- Full investor document review UI implementation
- Full operation staff review UI implementation
- Legal contract workflows
- OCR or content extraction pipelines themselves
- Storage infrastructure internals
- Full blockchain infra implementation details
- AI evaluation UI itself (only integration points matter here)

---

## 5. Recommended delivery phases

## Phase 1 — Core document management (must-have)
Implement:
- Documents & IP list
- Upload Document
- Document Details
- Edit Metadata / Visibility
- Delete Document
- Replace File / New Version
- Search / filter / sort / pagination
- Empty/loading/error states

Reason:
This is the minimum usable module and is directly defined in SRS.

## Phase 2 — Core blockchain integrity UX
Implement:
- Generate hash
- Submit hash to blockchain
- Blockchain verification status display
- Verify authenticity on-chain
- Transaction reference visibility
- Basic refresh status behavior

Reason:
This is the trust-critical differentiator of AISEP.

## Phase 3 — Advanced blockchain support and operational polish
Implement:
- Blockchain transaction history
- Transaction status tracking
- Detailed confirmation panel
- Notification hooks
- Better conflict/version warnings
- Better investor-facing visibility previews

Reason:
These are very useful and are already supported by the SRS/internal services, but can follow after core CRUD + on-chain submission is stable.

---

## 6. Main user journeys

### Journey A — Upload a new document
1. Startup opens **Documents & IP**
2. Clicks **Upload Document**
3. Selects file
4. Fills metadata:
   - title
   - document type
   - tags
   - visibility
   - description/notes
5. Submits
6. System validates:
   - authenticated startup
   - startup profile exists
   - file exists
   - required metadata exists
   - file format/size allowed
7. If valid:
   - store file
   - link file to startup
   - show success
   - return to list/detail

### Journey B — Review and manage existing documents
1. Startup opens **Documents & IP list**
2. Uses search/filter/sort
3. Opens **Document Details**
4. Can:
   - preview/download
   - edit metadata
   - replace file / create new version
   - delete if allowed
   - start blockchain actions

### Journey C — Put a finalized document on-chain
1. Startup opens a finalized document
2. Clicks **Generate Hash** if needed
3. Clicks **Submit to Blockchain**
4. System validates eligibility
5. System computes hash
6. System submits blockchain transaction
7. System stores transaction reference and updates status
8. UI shows:
   - transaction status
   - hash / reference
   - latest verification state

### Journey D — Verify integrity later
1. Startup opens **Blockchain Verification Status**
2. Clicks **Check On-chain Hash / Verify Authenticity**
3. System retrieves current system hash
4. System queries blockchain record
5. System compares values
6. UI shows one of:
   - Matched
   - Mismatched
   - Not Found

### Journey E — Track transaction progress
1. Startup opens blockchain history or transaction status panel
2. Selects a transaction / clicks refresh
3. System queries latest state
4. UI shows:
   - Pending
   - Confirmed
   - Failed
   - Not Found

---

## 7. Screen-by-screen implementation plan

## 7.1 Documents & IP (List)

### Purpose
Main management screen for startup documents and IP assets.

### Required UI per SRS
- document list/table
- search field
- type filter
- visibility filter
- sort options
- pagination

### Recommended layout
**Top area**
- Page title: Documents & IP
- short subtitle
- primary CTA: Upload Document

**Utility bar**
- search input
- type filter
- visibility filter
- sort dropdown
- optional “Only blockchain verified” toggle

**Content area**
Use card or table view. Each row/card should show:
- document title
- document type
- tags
- visibility
- latest version
- uploaded/updated time
- blockchain status badge
- quick actions:
  - View Details
  - Edit Metadata
  - Replace Version
  - Delete
  - Verify / Submit to Blockchain (contextual)

### Recommended document list columns
- Title
- Type
- Tags
- Visibility
- Version
- File type / size
- Updated at
- Blockchain status
- Actions

### States
- loading
- empty list
- filtered empty result
- processing error
- mixed-status list
- deleted/archived confirmation refresh state

### Rules to preserve
- only current startup’s documents are shown
- supported filter/sort values only
- if no documents: show empty state
- if processing fails: show error state

---

## 7.2 Upload Document

### Purpose
Upload a new startup document and attach metadata.

### Required UI per SRS
- file upload field
- title input
- document type
- tags
- visibility
- description/notes
- submit
- cancel

### Recommended layout
**Left / top**
- drag-and-drop uploader
- file constraints hint
- supported formats hint

**Right / bottom**
- metadata form

### Recommended fields
- File
- Title *
- Document Type *
- Tags
- Visibility *
- Description / Notes

### Recommended extra helper content
- explain that only the hash goes on-chain, not the file content
- explain visibility impacts who can see metadata/content later
- show file name, size, detected extension immediately after upload

### Validation
- authenticated startup
- startup profile exists
- file selected
- required metadata present
- supported file type
- allowed size
- startup allowed to upload

### Success result
After success:
- show toast/message
- redirect to document details or list
- optionally show prompt:
  - “Generate hash now”
  - “Submit to blockchain later”

---

## 7.3 Document Details

### Purpose
Display full information for one selected document and act as the central action hub.

### Required UI per SRS
- file information
- metadata
- preview/download area
- edit/delete actions

### Recommended layout
**Header**
- document title
- document type badge
- visibility badge
- blockchain status badge
- actions

**Main body**
- preview area
- metadata panel
- version info
- notes/description
- ownership/history summary

**Right-side action panel or sticky footer**
- Edit Metadata
- Replace File / New Version
- Delete
- Generate Hash
- Submit to Blockchain
- Check On-chain Hash
- Refresh Blockchain Status

### Minimum information to show
- title
- current file name
- extension / mime type
- size
- document type
- tags
- visibility
- description
- created at / updated at
- version number or latest version label
- current hash (if exists)
- blockchain reference (if exists)
- verification timestamp/status (if exists)

### States
- document exists
- unavailable
- restricted
- no preview available
- not yet hashed
- hash exists but not submitted
- transaction pending
- verified/matched
- mismatch
- not found

---

## 7.4 Edit Metadata / Visibility

### Purpose
Update document metadata without changing content.

### Required UI per SRS
- metadata form
- save
- cancel

### Recommended editable fields
- Title *
- Document Type *
- Tags
- Visibility *
- Description / Notes

### Important UX note
Changing metadata is not the same as replacing the file.
This screen must clearly say:
- **metadata only**
- file content unchanged

### Validation
- document exists
- belongs to current startup
- required metadata valid
- visibility value supported
- visibility/access rules respected

### UX states
- default
- dirty form
- inline validation errors
- save success
- save failed
- cancel/discard confirmation

---

## 7.5 Replace File / New Version

### Purpose
Upload a replacement file or create a new version while preserving document continuity.

### SRS basis
The screen exists in screen descriptions and the use case explicitly includes **replace document file / create new version**.

### Recommended UX choice
Treat this as a **versioning action**, not as a destructive overwrite.

### Suggested behavior
When startup clicks Replace File / New Version:
- show current file/version summary
- upload new file
- optional version note / change note
- confirm whether:
  - this becomes the latest active version
  - previous versions remain in history (recommended)

### Recommended fields
- new file *
- version note / change summary
- optional checkbox: carry over same metadata
- submit
- cancel

### Important design decisions
- preserve version history where possible
- recompute hash for new version
- previous blockchain transaction should remain tied to previous version
- new version should not silently inherit “verified” status from old file

### Required UI warnings
- “Replacing file creates a new content state.”
- “If the old version was blockchain-recorded, the new version must be re-hashed and re-submitted to create new integrity proof.”

---

## 7.6 Delete Document

### Purpose
Delete or logically delete a document when allowed.

### Required UI per SRS
- delete button
- confirmation dialog

### UX behavior
- delete available from list and detail
- require confirmation modal
- explain consequence:
  - removed from active list
  - may remain in internal audit/history depending on policy

### Validation
- document exists
- belongs to startup
- deletion allowed by business rules
- document not restricted from deletion

### Important UI note
If deletion is blocked, explain why in plain language:
- locked because of policy
- linked to review / verification / transaction state
- not permitted for current status

---

## 7.7 Blockchain Verification Status

### Purpose
Show the current blockchain state of a document.

### Required UI per SRS
- verification status display
- transaction reference
- verification timestamp
- refresh button

### Recommended status values
At minimum support:
- Not Submitted
- Pending
- Confirmed / Recorded
- Failed
- Matched
- Mismatch
- Not Found

### Recommended layout
**Summary card**
- current blockchain status
- last checked time
- latest transaction reference

**Technical details**
- current system hash
- on-chain hash/result if available
- verification timestamp
- block number / confirmation info if available

**Actions**
- Refresh Status
- Check On-chain Hash
- View Transaction History
- Submit to Blockchain (if not yet submitted and eligible)

### Important separation
Keep these two concepts distinct in UI:
1. **Submission / transaction status**  
2. **Integrity comparison result**

Example:
- transaction may be confirmed
- but authenticity check result may still be mismatch if file changed later

---

## 7.8 Blockchain History / Transaction Status (recommended phase 3)

### Purpose
Track transaction progress over time.

### Basis
The SRS internal blockchain service includes:
- blockchain history list
- transaction detail panel
- refresh status
- status timeline
- confirmation info panel

### Recommended UI
**History list**
- version
- submitted at
- transaction hash/reference
- network status
- latest refresh time

**Detail panel**
- pending / confirmed / failed / not found
- confirmation block
- confirmation timestamp
- error/retry hint if failed

### Important rule
Every blockchain submission must preserve a trackable transaction reference and history per document version.

---

## 8. Recommended data model for UI/API alignment

## 8.1 Document entity (UI-facing)
Suggested fields:
- id
- startupId
- title
- type
- tags[]
- visibility
- description
- fileName
- fileExtension / mimeType
- fileSize
- storageUrl / previewUrl (policy-based)
- currentVersionNumber
- status
- createdAt
- updatedAt
- deletedAt (optional)

## 8.2 Document version entity
Suggested fields:
- id
- documentId
- versionNumber
- fileName
- fileSize
- mimeType
- hashValue
- versionNote
- createdAt
- createdBy
- isLatest

## 8.3 Blockchain record entity
Suggested fields:
- id
- documentId
- documentVersionId
- hashValue
- transactionReference
- network
- status
- verificationResult
- submittedAt
- confirmedAt
- lastCheckedAt
- blockNumber
- errorMessage

### Suggested enums
**visibility**
- PRIVATE
- INVESTOR_VISIBLE
- ADVISOR_VISIBLE
- SHARED_BY_POLICY
- PUBLIC_METADATA_ONLY (only if product supports it explicitly)

**blockchain submission status**
- NOT_SUBMITTED
- PENDING
- CONFIRMED
- FAILED
- NOT_FOUND

**authenticity result**
- UNKNOWN
- MATCHED
- MISMATCHED
- NOT_FOUND

---

## 9. Validation and business-rule translation for UI

### Upload validation
- startup authenticated
- startup profile exists
- file selected
- required metadata provided
- file format allowed
- file size allowed

### Metadata edit validation
- document exists
- owned by current startup
- title/type/visibility valid

### Delete validation
- document exists
- ownership valid
- not restricted from deletion

### Blockchain submission validation
- document exists
- eligible for verification
- startup has permission
- only hash goes on-chain

### On-chain check validation
- document exists
- hash exists
- blockchain reference exists or lookup data available
- blockchain service reachable

### Transaction tracking validation
- transaction belongs to current startup document
- valid reference exists
- blockchain service available

### UX message mapping
Use the SRS message logic consistently:
- success → MSG001 equivalent
- invalid input → MSG002 equivalent
- unavailable/not found → MSG003 / MSG006 depending on case
- restricted/not allowed → MSG005
- destructive confirmation → MSG007
- processing/system failure → MSG008

---

## 10. Permissions and visibility model

This module must enforce strict ownership and visibility logic.

### Startup side
- startup can only manage its own documents
- startup can only edit/delete documents it owns and is allowed to modify
- document list/detail must never leak another startup’s documents

### Investor side dependency
The investor-side document review uses:
- visible document metadata
- blockchain verification status labels
- terms acceptance before access
- access logging

Therefore the startup-side visibility field is not cosmetic.
It directly affects downstream investor access behavior.

### Key implementation note
Visibility must be treated as a **policy field**, not just a UI label.

---

## 11. Interaction with blockchain and degraded mode

The SRS says:
- document hash generation should be deterministic (same file -> same SHA-256 hash)
- blockchain verification must match on-chain stored hash with full correctness
- if blockchain RPC is unavailable, the system should still allow upload and local hash generation, while on-chain submission can be queued/retried
- blockchain submission is asynchronous; transaction hash/reference can be returned early, confirmation tracked later

### Required UI implications
- do not block upload just because blockchain is down
- show degraded but usable state:
  - uploaded successfully
  - hash generated locally
  - blockchain submission pending / retryable
- surface asynchronous states clearly

---

## 12. Suggested UI badges and labels

### Document status badges
- Draft
- Active
- Archived
- Deleted (if shown internally)

### Visibility badges
- Private
- Visible to Investors
- Visible to Advisors
- Restricted
- Shared by Policy

### Blockchain badges
- Not Submitted
- Pending On-chain
- Recorded
- Matched
- Mismatch
- Failed
- Not Found

### Version badges
- Latest
- Previous Version
- Updated
- Replaced

---

## 13. Edge cases and failure states

Handle these explicitly:

### Upload
- unsupported file type
- oversized file
- corrupted file
- network interruption during upload

### Detail
- document no longer available
- preview not supported
- restricted access
- file metadata exists but storage object missing

### Metadata
- invalid visibility value
- duplicate/empty title if policy forbids
- concurrent update conflict

### Versioning
- upload new version fails after file select
- old version has blockchain record but new version not yet hashed
- user thinks old verification still applies to new file

### Blockchain
- no hash exists yet
- no transaction exists yet
- pending too long
- failed submission
- on-chain mismatch
- on-chain not found
- blockchain RPC unavailable

---

## 14. Suggested implementation backlog

## Sprint / batch 1 — Core CRUD UI
- [ ] Documents & IP list page
- [ ] search/filter/sort/pagination
- [ ] Upload Document page/modal
- [ ] Document Details page
- [ ] Edit Metadata page/modal
- [ ] Delete confirmation flow
- [ ] shared status badges
- [ ] empty/loading/error states

## Sprint / batch 2 — Versioning
- [ ] Replace File / New Version flow
- [ ] version history block on details
- [ ] latest version indicator
- [ ] re-hash requirement warnings for new versions

## Sprint / batch 3 — Blockchain core
- [ ] hash generation UI trigger
- [ ] submit to blockchain flow
- [ ] blockchain verification status card
- [ ] check on-chain hash flow
- [ ] refresh status behavior
- [ ] transaction reference display

## Sprint / batch 4 — Blockchain history and polish
- [ ] transaction history view
- [ ] transaction detail panel
- [ ] refresh transaction status
- [ ] notification hooks
- [ ] degraded mode handling
- [ ] improved error explanations

---

## 15. API/UI contract recommendations

These are implementation recommendations, not direct SRS quotes.

### Suggested endpoints
- `GET /startup/documents`
- `POST /startup/documents`
- `GET /startup/documents/:id`
- `PATCH /startup/documents/:id/metadata`
- `POST /startup/documents/:id/version`
- `DELETE /startup/documents/:id`
- `POST /startup/documents/:id/hash`
- `POST /startup/documents/:id/blockchain-submit`
- `POST /startup/documents/:id/check-onchain`
- `GET /startup/documents/:id/blockchain-status`
- `GET /startup/documents/:id/blockchain-history`
- `POST /startup/transactions/:txId/refresh`

### Suggested FE architecture
- shared document badge components
- shared document metadata form schema
- dedicated blockchain status card component
- separate hooks/services for:
  - document CRUD
  - upload
  - versioning
  - blockchain actions

---

## 16. QA checklist / Definition of Done

The module is done when:

### Core management
- startup can upload a new document with required metadata
- startup can view list/detail of its own documents
- startup can search/filter/sort documents
- startup can edit metadata
- startup can delete only when allowed
- startup can replace a file as a new version

### Blockchain trust flow
- system can generate deterministic hash for a document
- startup can submit eligible document hash to blockchain
- system stores transaction reference
- startup can view blockchain verification status
- startup can run authenticity check and see Matched / Mismatch / Not Found
- startup can track transaction states at least as Pending / Confirmed / Failed / Not Found

### Safety / policy
- RBAC enforced on every action
- visibility values affect downstream access correctly
- access errors and restricted actions show correct UX
- audit/log hooks exist for relevant actions

### UX quality
- list/detail patterns consistent
- inline validation present
- destructive actions confirmed
- long-running blockchain actions show async states clearly
- degraded mode still allows upload + local hash generation

---

## 17. Key implementation decisions to keep stable

1. **Documents are versioned assets, not just files**
2. **Visibility is a policy field, not decoration**
3. **Blockchain proof is per document version**
4. **Confirmed blockchain submission != guaranteed authenticity forever**
5. **Authenticity must compare current system hash vs on-chain record**
6. **Uploads must still work even if blockchain service is temporarily unavailable**
7. **This module feeds investor trust and document review flows later**

---

## 18. Short version for AI coding

Build a **Startup Documents & IP workspace** with 6 main screens:
- Documents & IP List
- Upload Document
- Document Details
- Replace File / New Version
- Edit Metadata / Visibility
- Blockchain Verification Status

Required startup actions:
- upload document
- edit metadata
- replace file / create new version
- delete document when allowed
- view document list/detail
- generate document hash
- submit hash to blockchain
- verify authenticity on-chain
- view blockchain verification status
- track transaction status

Important rules:
- only startup-owned documents are visible/manageable
- upload requires file + metadata
- blockchain only stores hash, not file content
- authenticity check must distinguish Match / Mismatch / Not Found
- version history must not falsely inherit old verification to new files
- upload must still work in degraded mode if blockchain is temporarily unavailable
