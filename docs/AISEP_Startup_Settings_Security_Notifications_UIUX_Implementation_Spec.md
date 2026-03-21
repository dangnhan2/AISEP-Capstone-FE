
# AISEP_Startup_Settings_Security_Notifications_UIUX_Implementation_Spec

## 1. Purpose

This document defines the UI/UX implementation plan for the **Startup Settings – Account & Security** feature in AISEP, based on the project SRS and business rules.

This feature covers:
- **Change Password** for authenticated Startup users
- **Notification Preferences** for Startup users
- UI states, validations, interactions, and implementation notes required for a production-ready web experience

This document is intended for:
- UI/UX designers
- Frontend developers
- QA testers
- AI coding tools generating UI from specifications

---

## 2. Document Scope

### In scope
1. **Settings overview page**
2. **Security section**
   - Change password entry point
   - Change password form or modal
3. **Notification preferences**
   - In-app notification preferences
   - Email notification preferences
4. UI states:
   - loading
   - success
   - error
   - validation
   - empty/help states
5. Interaction rules and implementation notes

### Out of scope
- Forgot password / reset password flow from login
- Notification center list page
- Notification content templates
- Admin notification policy configuration
- OTP / MFA / 2FA feature
- Session/device management UI unless later added explicitly

---

## 3. Source Requirements Summary

The feature is grounded on these requirements:

### 3.1 Change Password
Authenticated users can change their password in **Settings → Security**.
The flow requires:
- Current Password
- New Password
- Confirm New Password
- Save Changes

The system must:
- validate current password
- validate password policy
- validate confirmation match
- update password hash
- optionally revoke other sessions based on policy
- write audit log

### 3.2 Notifications
Logged-in users can:
- view notifications
- mark notifications as read/unread

Notification preferences are stored **per user** and apply to:
- **in-app notifications**
- **email notifications**

Notifications can be paginated and retained by platform policy.

---

## 4. Product Positioning

This screen should feel like:
- a **serious account settings page**
- clear, secure, trustworthy
- simple enough for quick updates
- consistent with AISEP visual style

It should **not** feel like:
- a generic social app settings page
- an admin console
- a compliance-heavy enterprise form
- a cluttered preference matrix

---

## 5. Recommended Feature Structure

Use a **Settings** area with 2 main content groups:

1. **Security**
2. **Notification Preferences**

Recommended routing:

- `/startup/settings`
- `/startup/settings/security`
- `/startup/settings/notifications`

Alternative if keeping one screen:
- a single page with sections and modal/subpage for password change

Best recommendation:
- Keep **Settings overview**
- Open **Change Password** in a dedicated subpage or modal
- Keep **Notification Preferences** editable in-page

---

## 6. Information Architecture

### 6.1 Main page title
**Cài đặt tài khoản & Bảo mật**  
or in English UI: **Account Settings & Security**

### 6.2 Page subtitle
Explain clearly:
- this page manages password and notification options

Example:
> Manage your password and how you receive important platform updates.

### 6.3 Primary content groups
1. Security
2. Notification Preferences

### 6.4 Secondary navigation
Optional left tabs or internal anchors:
- General
- Security
- Notifications

For current scope, **Security** and **Notifications** are enough.

---

## 7. Screen Design – Settings Overview

### 7.1 Layout
Use a centered content column with stacked cards.

Recommended structure:
1. Page header with back action
2. Security card
3. Notification preferences card
4. Sticky or bottom-aligned Save Changes area for notification preferences only

### 7.2 Page header
Include:
- back action
- page title
- subtitle

The back action should not be only an icon.
Use:
- icon + label
- or breadcrumb

Recommended:
- `← Back to Workspace`
- or breadcrumb: `Workspace > Settings`

### 7.3 Security card
Card title: **Security**

Content:
- row for Login Password
- helper description
- action button: **Change Password**

Do not pretend password is editable inline if the actual flow opens another form.

### 7.4 Notifications card
Card title: **Notification Preferences**

Inside the card, split into 2 subsections:

#### A. In-app Notifications
Examples:
- System alerts
- Verification/KYC updates
- Advisor & investor interactions
- Document/IP status
- AI evaluation updates

#### B. Email Notifications
Examples:
- Security alerts
- Verification/KYC updates
- Advisor & investor interactions
- Weekly newsletter / product updates

---

## 8. Change Password UX Specification

### 8.1 Why the current version is not enough
The settings page may show a “Change Password” action, but the actual SRS flow requires a full form.
So the UI must provide a form with all required fields.

### 8.2 Recommended implementation options

#### Option A — Dedicated subpage
Route:
- `/startup/settings/security/change-password`

Pros:
- clearer
- more scalable
- easier for validation and error handling
- better on mobile

#### Option B — Modal
Use only if:
- product prefers fast inline action
- the modal can support validation and error states clearly

Best recommendation:
**Use a dedicated subpage or full-width drawer/modal with enough space.**

### 8.3 Required fields
1. Current Password
2. New Password
3. Confirm New Password

### 8.4 Required actions
- Save Changes
- Cancel

Optional:
- Show/hide password toggle per field

### 8.5 Field behavior
#### Current Password
- required
- password type
- can toggle visibility

#### New Password
- required
- password type
- can toggle visibility
- show password policy helper

#### Confirm New Password
- required
- password type
- can toggle visibility
- must match new password

### 8.6 Password policy helper
Show helper text under New Password, for example:
- minimum length
- uppercase/lowercase rules
- number/special character rule if applicable

If exact policy is not yet finalized in backend, keep helper generic but prepared for configuration.

### 8.7 Validation rules
- user must be authenticated
- current password must be correct
- new password must satisfy password policy
- confirm password must match
- new password should ideally not equal current password if backend enforces it

### 8.8 Change password states
#### Default
All fields empty

#### Invalid input
Show inline field errors

#### Incorrect current password
Show field-level error on Current Password

#### Password mismatch
Show field-level error on Confirm New Password

#### Saving
Disable action button and show loading state

#### Success
Show success toast:
- “Password changed successfully.”

Optional follow-up helper:
- “Other sessions may be revoked according to system policy.”

#### Failure
Show error toast:
- “Failed to update password. Please try again.”

### 8.9 Unsaved changes
If the user typed anything and tries to leave:
- show discard changes confirmation

### 8.10 Security UX notes
- do not display password strength meter unless it is accurate and backed by real validation
- do not expose internal security details
- do not auto-save password changes
- always require explicit Save Changes

---

## 9. Notification Preferences UX Specification

### 9.1 Core principle
Notification preferences in AISEP apply to both:
- in-app notifications
- email notifications

The UI must reflect both channels clearly.

### 9.2 Recommended group structure

#### Group 1 — Essential Notifications
These are important for trust/security/compliance.
Examples:
- Security alerts
- Login-related alerts
- Verification/KYC status updates
- Critical account notices

Recommendation:
- keep some of these always on if product policy requires it
- if not editable, mark them as **Required**

#### Group 2 — Startup Activity Notifications
Examples:
- Investor interest / connection activity
- Advisor interaction
- Offer / request updates
- Consulting schedule changes
- Document review or verification updates
- AI evaluation completion or status changes

#### Group 3 — Optional Communications
Examples:
- Newsletter
- Product updates
- Weekly highlights
- Feature announcements

### 9.3 Channel model
Each preference should ideally support:
- In-app
- Email

Recommended UI pattern:
- category name + description
- 2 controls on the right:
  - In-app
  - Email

Example row:

| Notification Type | In-app | Email |
|---|---|---|
| Security Alerts | On (locked) | On (locked or editable) |
| Verification Updates | On | On |
| Advisor & Investor Interactions | On | On |
| Newsletter | Off | On/Off |

If a simpler version is needed:
- split into two sections:
  - In-app notifications
  - Email notifications

### 9.4 Recommended control type
Use:
- **toggle switches**
not passive circles

Avoid control styles that look like read-only status indicators.

### 9.5 Required categories for Startup
Recommended minimum categories:

#### Security Alerts
Includes:
- password/security events
- suspicious login notifications if available
- important account notices

#### Verification & KYC Updates
Includes:
- verification submitted
- more info requested
- approved
- rejected
- resubmission-related notices

#### Investor & Advisor Interactions
Includes:
- someone viewed or engaged with startup profile if supported
- consulting request/schedule updates
- connection-related activity
- feedback-related alerts

#### Documents & IP Updates
Includes:
- upload processing result
- metadata/visibility related notices
- blockchain verification result
- authenticity check result if surfaced

#### AI Evaluation Updates
Includes:
- evaluation started
- evaluation completed
- report ready
- issue/failure if surfaced

#### Newsletter / Platform Updates
Includes:
- optional non-essential communications

### 9.6 Save behavior
Notification preferences should:
- not auto-save on every toggle unless explicitly decided by product
- allow multiple changes and then one Save action

Recommended behavior:
- `Save Changes` button is disabled until at least one setting changes

### 9.7 Required states
#### Default
Saved preferences loaded

#### Dirty state
At least one preference changed

#### Saving
Disable controls or save button appropriately

#### Success
Show toast:
- “Notification preferences updated successfully.”

#### Failure
Show toast:
- “Failed to save notification preferences. Please try again.”

### 9.8 Always-on rules
If product decides some notifications are mandatory:
- show toggle as locked or disabled
- add helper text:
  - “Required for account security”
  - “This notification cannot be turned off”

This is especially recommended for:
- security alerts
- essential verification notices

---

## 10. UI Components to Implement

### 10.1 Page header
- Back button with label
- Page title
- Subtitle

### 10.2 Settings card
Reusable card component with:
- title
- optional icon
- content body
- footer actions if needed

### 10.3 Setting row
Reusable row with:
- label
- short description
- control or action

### 10.4 Toggle switch
States:
- on
- off
- disabled
- loading

### 10.5 Password field
States:
- default
- focus
- error
- disabled
- show/hide toggle

### 10.6 Save bar
Can be:
- inline footer action area
- sticky bottom save bar if the page grows longer

### 10.7 Toast messages
Need:
- success
- error
- warning/info if needed

---

## 11. Recommended Screen Set

### Screen A — Settings Overview
Contains:
- Security section
- Notification preferences section

### Screen B — Change Password
Contains:
- Current Password
- New Password
- Confirm New Password
- Save Changes
- Cancel

### Optional Screen C — Notification Preferences Expanded
Only needed if settings become more complex later

---

## 12. Detailed Content Proposal

### 12.1 Settings Overview copy
#### Title
Cài đặt tài khoản & Bảo mật

#### Subtitle
Quản lý mật khẩu và cách bạn nhận các cập nhật quan trọng từ nền tảng.

### 12.2 Security section copy
#### Title
Bảo mật

#### Row title
Mật khẩu đăng nhập

#### Description
Cập nhật mật khẩu định kỳ để tăng tính bảo mật cho tài khoản của bạn.

#### Action
Đổi mật khẩu

### 12.3 Notification Preferences copy
#### Title
Tùy chọn thông báo

#### Essential note
Một số thông báo bảo mật và xác minh có thể luôn được bật để bảo vệ tài khoản của bạn.

#### Categories
- Cảnh báo bảo mật
- Cập nhật xác minh / KYC
- Tương tác với cố vấn & nhà đầu tư
- Tài liệu & IP
- AI Evaluation
- Bản tin & cập nhật nền tảng

---

## 13. Layout Recommendation

### Desktop
- centered content area
- max width around 900–1100px
- stacked sections
- comfortable vertical spacing
- right-aligned section actions

### Tablet
- same stack
- reduce padding and card width

### Mobile
- full width cards
- sticky bottom save button for preferences
- password change should use full page, not tiny modal

---

## 14. Interaction Rules

### 14.1 Save Changes button
Notification settings:
- disabled when no changes
- enabled when dirty
- loading during save

Change password:
- disabled until required inputs are valid enough to submit
- backend still re-validates everything

### 14.2 Back navigation
If there are unsaved changes:
- show discard confirmation

### 14.3 Error handling
Inline errors for:
- empty required password fields
- invalid format if needed
- confirmation mismatch

Toast/global errors for:
- save failure
- session/auth issues
- server/network failure

---

## 15. Accessibility Notes

Must support:
- keyboard navigation
- visible focus states
- label-control associations
- sufficient color contrast
- icon + text, not icon-only where meaning is important
- not relying on color alone to indicate on/off state

For password fields:
- accessible show/hide toggle labels

For toggles:
- announce checked/unchecked state properly

---

## 16. UX Problems in the Current UI and Required Fixes

### Current issue 1
The page only shows a “Change Password” button but not the actual SRS-required fields.

**Fix:** add a complete change password flow.

### Current issue 2
The page only shows email preferences while the business rule says preferences apply to **both in-app and email**.

**Fix:** add in-app preferences or redesign preference model to support both channels.

### Current issue 3
The current round check controls look like status markers, not interactive settings controls.

**Fix:** replace with toggle switches or proper checkboxes.

### Current issue 4
The page does not visibly distinguish mandatory vs optional notifications.

**Fix:** mark essential notifications as required/locked where appropriate.

### Current issue 5
The current page does not show enough save states and form feedback.

**Fix:** add dirty state, disabled save state, saving state, success toast, failure toast, and unsaved changes warning.

---

## 17. Frontend Implementation Notes

### Suggested state model
```ts
type NotificationChannelSetting = {
  inApp: boolean;
  email: boolean;
};

type StartupNotificationPreferences = {
  securityAlerts: NotificationChannelSetting;
  verificationUpdates: NotificationChannelSetting;
  interactions: NotificationChannelSetting;
  documentsAndIP: NotificationChannelSetting;
  aiEvaluation: NotificationChannelSetting;
  newsletter: NotificationChannelSetting;
};

type ChangePasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};
```

### Suggested frontend concerns
- fetch settings on page load
- store original notification values for dirty check
- validate password form before submit
- use optimistic UI only for small toggles if product explicitly wants it
- otherwise use explicit save

### Dirty check
- compare current preferences vs original loaded preferences
- compare password fields vs empty state

### Security note
- never keep password values longer than needed
- clear password fields after success
- do not log password field values in frontend logs

---

## 18. QA Checklist

### Change Password
- [ ] Current Password field exists
- [ ] New Password field exists
- [ ] Confirm New Password field exists
- [ ] Save Changes works
- [ ] Cancel works
- [ ] Incorrect current password shows error
- [ ] Password mismatch shows error
- [ ] Success toast appears
- [ ] Failure toast appears
- [ ] Unsaved changes warning works

### Notification Preferences
- [ ] Preferences load from backend
- [ ] Supports in-app preferences
- [ ] Supports email preferences
- [ ] Essential notifications are marked clearly
- [ ] Toggle states are interactive and accessible
- [ ] Save button only activates when changed
- [ ] Save success state works
- [ ] Save failure state works

### General UX
- [ ] Back navigation is clear
- [ ] Copy is understandable
- [ ] Contrast is sufficient
- [ ] Mobile layout remains usable
- [ ] No misleading controls

---

## 19. Recommended Final UX Decision

### Final recommendation
Implement this feature as:

1. **Settings Overview**
   - Security section
   - Notification Preferences section

2. **Change Password Subpage**
   - full password form with validation and submit flow

3. **Notification Preferences Model**
   - support both in-app and email
   - separate essential vs optional notifications
   - use toggle switches
   - save explicitly

This approach is the closest to the AISEP requirements while keeping the UX clean and scalable.

---

## 20. Definition of Done

The UI/UX implementation for Startup Settings is complete when:
- Change Password fully matches the SRS flow
- Notification Preferences support both in-app and email channels
- required save/error/success states exist
- essential notifications are handled clearly
- the settings UI is understandable, accessible, and production-ready
- the flow is consistent with AISEP’s role-based startup experience
