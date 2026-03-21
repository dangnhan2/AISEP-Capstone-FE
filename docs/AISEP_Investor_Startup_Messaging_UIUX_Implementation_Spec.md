# AISEP Investor–Startup Messaging UI/UX Implementation Spec

Version: Draft 1  
Scope owner: Product / UX / FE / BE  
Feature area: Investor Communication / Startup Communication  
Primary artifact type: UI/UX + logical implementation spec

---

## 1. Purpose

This file defines how to implement the **Investor ↔ Startup in-app messaging feature** in AISEP in a way that is consistent with the current project documents and usable by UI/UX, frontend, backend, and AI code generation.

This spec is intentionally written as a **logical implementation spec**, not just a UI prompt. It explains:
- what is explicitly defined in the documents,
- what needs to exist in the product for the feature to work end-to-end,
- what is safe implementation inference,
- what is currently out of scope.

---

## 2. Source-grounded scope

### 2.1 What the SRS explicitly defines

The current SRS explicitly defines the following investor-side messaging use cases:
- **Send In-app Message to Startup**
- **Manage Conversation**
- **View Conversation List**
- **View Conversation History**
- screen: **Messages/Chat** between investor and startup

The SRS also defines the core logic for these use cases:
- investor can send a message from a startup profile or an existing conversation,
- the system can **create a conversation thread if needed**,
- the system must **store the message**,
- the system must **update conversation metadata**,
- the system must **notify the startup**,
- the conversation list must show **summary information and unread indicators**,
- conversation history must support **pagination or infinite scroll**,
- access to a conversation must be validated,
- messages are loaded in **chronological order**,
- there is a business rule that **each Investor–Startup pair maps to at most one active conversation thread**,
- **rate limiting** applies to messaging,
- notification preferences apply to **in-app and email notifications**.

### 2.2 What is not explicitly detailed but is required to implement the feature

The documents describe the feature primarily from the **Investor** perspective. However, because the system must **notify the Startup** and because a conversation thread exists between the two parties, the product must also support a **Startup-side receiving/reading experience**.

That means the following are implementation necessities, even though they are not fully written as separate startup use cases:
- startup can view the conversation list for conversations that involve their startup account,
- startup can open conversation history,
- startup can send replies in the same thread,
- startup can see unread indicators and read-state updates,
- startup can only access conversations that belong to their own startup identity.

This startup-side behavior is treated in this file as an **implementation inference required to complete the documented investor messaging flow**.

### 2.3 Out of scope unless later added

The current documents do **not** clearly define these items, so they should be treated as out of scope for the first implementation unless the team explicitly adds them:
- message attachments or file sending inside chat,
- message editing,
- message deletion or recall,
- typing indicator,
- online presence,
- reactions / emoji responses,
- voice notes,
- group chat,
- advisor chat,
- real-time voice/video call inside chat,
- moderation UI beyond basic abuse/report hooks.

---

## 3. Product intent

The messaging feature exists to support **structured platform communication** between an Investor and a Startup after discovery/interest actions.

This is **not** a generic social chat feature.

The intended product value is:
- Investor can initiate direct conversation from a startup profile or existing thread.
- Startup can respond without leaving AISEP.
- Both sides can continue communication in a controlled, auditable environment.
- Conversation is tied to the investor-startup relationship, not to random public messaging.

Messaging should therefore feel:
- professional,
- trust-oriented,
- business-like,
- contextual,
- lightweight,
- not entertainment-style.

---

## 4. Core business rules to enforce

### BR-MSG-01 — Authentication required
Only authenticated users can access messaging.

### BR-MSG-02 — Role scope
Version 1 supports messaging between:
- **Investor** and **Startup**

Not between:
- Startup ↔ Advisor
- Advisor ↔ Investor
- Startup ↔ Startup
- Investor ↔ Investor

unless separately introduced later.

### BR-MSG-03 — One active thread per investor-startup pair
Each Investor–Startup pair maps to **at most one active conversation thread**.

Implication:
- clicking **Message** from startup profile should open existing thread if one already exists,
- it should create a new thread only if one does not already exist.

### BR-MSG-04 — Permission validation
A user can only open a conversation if the thread belongs to them.
- Investor can view only investor-owned threads.
- Startup can view only threads associated with their own startup account.

### BR-MSG-05 — Message content must be valid
Message content must:
- be non-empty,
- pass min/max validation,
- pass security validation,
- respect anti-abuse constraints.

### BR-MSG-06 — Rate limiting
Messaging must be rate-limited according to platform rules.

### BR-MSG-07 — Conversation metadata must update on every send
Every new message must update:
- last message preview,
- last activity time,
- unread counts,
- conversation ordering in the list.

### BR-MSG-08 — Notification trigger
When a new message is sent, the receiving side must be notified using the platform’s notification system.

### BR-MSG-09 — Notification preferences
Notification delivery should follow user preferences for:
- in-app notifications,
- email notifications.

### BR-MSG-10 — No public messaging
There is no public inbox/discovery-to-anyone behavior. Messaging exists only within valid investor-startup communication policy.

### BR-MSG-11 — Chronological history
Conversation history is displayed in chronological order, with older messages loaded on demand.

### BR-MSG-12 — Professional communication context
Message UI and copy should stay business-oriented. This is a structured platform conversation, not a consumer chat app.

---

## 5. Main feature modules

This feature should be implemented as 4 core modules:

1. **Start Message / Open Thread**
2. **Conversation List**
3. **Conversation Detail / Message History**
4. **Notification + Read State**

Optional module for later phase:
5. **Abuse / Report / Block handling**

---

## 6. Route and screen map

Suggested route model:

### Investor side
- `/investor/messages`
- `/investor/messages/[conversationId]`
- message entry points from:
  - `/investor/startups/[id]`
  - recommendation cards
  - watchlist card
  - connection / offer screens

### Startup side
- `/startup/messages`
- `/startup/messages/[conversationId]`
- optional message entry points from:
  - notification center
  - interested investors / connection request detail
  - offer detail

This route structure is an implementation recommendation. The exact pathname can be adapted, but the information architecture should remain equivalent.

---

## 7. Information architecture

### 7.1 Entry points

#### Investor entry points
Investor can open messaging from:
- Startup Profile
- existing Conversation Thread
- Messages main menu
- possibly Offer / Connection Detail

#### Startup entry points
Startup can open messaging from:
- Notifications
- Messages main menu
- received connection / investor interaction detail

### 7.2 Screen types

#### Screen A — Messages / Conversation List
Purpose:
- show all conversation threads for current user,
- show summaries and unread indicators,
- allow opening a thread.

#### Screen B — Conversation Detail
Purpose:
- show message history,
- send reply,
- load older messages,
- mark read state.

#### Screen C — Contextual message entry from Startup Detail
Purpose:
- allow investor to click **Message** and immediately open existing thread or create one.

---

## 8. Screen A — Conversation List

### 8.1 Goal
Provide a fast overview of all active conversations with summary information and unread state.

### 8.2 Layout
Recommended desktop layout:
- page header,
- search/filter bar optional,
- conversation list panel,
- selected thread preview pane optional for desktop split-view,
- empty state for no conversation.

Recommended mobile layout:
- page header,
- conversation list only,
- tap to open thread detail.

### 8.3 Header
#### Investor copy
- Title: `Messages`
- Subtitle: `Communicate with startups in one place`

#### Startup copy
- Title: `Messages`
- Subtitle: `Manage investor conversations related to your startup`

### 8.4 Required list item fields
Each conversation row should show:
- counterpart avatar/logo,
- counterpart display name,
- counterpart role label if useful (`Investor`, `Startup`),
- last message preview,
- last activity time,
- unread count badge,
- optional status chip if conversation is linked to an offer or connection.

### 8.5 Sorting
Default sort:
- latest activity descending.

### 8.6 Optional search
Search can support:
- counterpart name,
- startup name,
- investor/fund name,
- recent message preview.

Search is recommended but not strictly required by the current SRS.

### 8.7 Empty state
If no conversation exists:
- show empty state,
- explain there are no conversations yet,
- provide relevant CTA.

Example:
- Investor: `Start a conversation from a startup profile.`
- Startup: `Investor messages will appear here.`

### 8.8 Error state
If conversation list retrieval fails:
- show retry state,
- preserve page shell,
- do not show misleading empty state.

### 8.9 UX rules
- unread badge must be visually clear,
- active selected thread must be obvious,
- long message preview must truncate cleanly,
- timestamps should use relative time in list, exact time in detail view,
- conversation list should remain scannable.

---

## 9. Screen B — Conversation Detail / History

### 9.1 Goal
Show complete message history of a conversation and allow reply.

### 9.2 Required UI blocks
- conversation header,
- message history,
- load older messages control,
- message composer,
- send action,
- optional conversation context block.

### 9.3 Conversation header should show
- counterpart avatar/logo,
- counterpart name,
- counterpart role / context,
- optional linked startup/investor summary,
- back action,
- optional actions menu.

### 9.4 Message history behavior
History must:
- load recent messages first,
- display in chronological order,
- support loading older messages on demand,
- keep scroll stable during pagination,
- distinguish sender and receiver visually,
- support long multi-line text safely.

### 9.5 Message bubble content
Each message bubble should support:
- text content,
- send timestamp,
- sender alignment,
- failure / retry state if send fails.

Version 1 should remain simple and text-first.

### 9.6 Composer behavior
Composer includes:
- multiline text input,
- send button,
- disabled state when empty,
- loading state while sending.

Validation:
- trim whitespace,
- block blank messages,
- block over-limit messages,
- prevent duplicate rapid sends if a send is already in progress.

### 9.7 Read state behavior
When a user opens a thread:
- validate access,
- load recent messages,
- mark relevant unread messages as read according to implementation policy.

### 9.8 Unavailable thread behavior
If the thread is unavailable or unauthorized:
- show not found / unavailable state,
- do not show another user’s conversation,
- do not silently fallback to another thread.

---

## 10. Contextual Message Entry from Startup Profile

### 10.1 Investor-side primary entry
From startup profile detail, investor clicks **Message**.

System behavior:
1. validate investor authentication,
2. validate messaging permission,
3. check if an active investor-startup thread already exists,
4. if yes, open it,
5. if no, create it,
6. open conversation detail.

### 10.2 UI requirement
The message action should not feel like a generic contact button. It should be clearly tied to the platform communication flow.

Recommended labels:
- `Message Startup`
- `Open Conversation`

Avoid overly casual labels.

---

## 11. Startup-side mirrored experience

This section is an implementation inference required to make the documented investor-side flow usable.

### 11.1 Required startup-side capabilities
Startup should be able to:
- receive conversation notifications,
- open message list,
- see unread indicators,
- open history,
- reply inside the same thread.

### 11.2 Why this is needed
Because the documented investor-side send flow explicitly says the system must **notify startup** and the system maintains a conversation thread. Without startup-side read/reply UI, the feature would be incomplete.

### 11.3 Startup-side UI rules
Startup messaging UI should mirror investor conversation UI with role-adjusted labels.

Conversation row should show:
- investor/fund name,
- optional investor type or organization,
- last message preview,
- last activity,
- unread badge.

Conversation detail should show:
- investor identity summary,
- message history,
- reply composer.

---

## 12. Permissions and access model

### 12.1 Conversation ownership
A conversation must store:
- investor user/account identity,
- startup identity,
- thread status.

### 12.2 Access rules
Investor can access:
- only threads where they are the investor participant.

Startup can access:
- only threads associated with their own startup account.

Operation Staff/Admin access should be treated as moderation/support scope and is out of the primary end-user UI scope.

### 12.3 Unauthorized access handling
If the user tries to open a conversation that does not belong to them:
- return unauthorized or unavailable state,
- do not leak thread existence,
- do not expose participant names or content.

---

## 13. Conversation data model suggestion

This is a recommended implementation model, not an official database design.

### 13.1 Conversation entity
Suggested fields:
- `id`
- `investorUserId`
- `startupId`
- `startupOwnerUserId` if needed
- `status` (`active`, `archived`, `blocked`, `closed`)
- `createdAt`
- `updatedAt`
- `lastMessageAt`
- `lastMessagePreview`
- `investorUnreadCount`
- `startupUnreadCount`
- `createdFromContext` (`startup_profile`, `offer`, `watchlist`, etc.) optional

### 13.2 Message entity
Suggested fields:
- `id`
- `conversationId`
- `senderRole` (`investor`, `startup`)
- `senderUserId`
- `content`
- `contentType` (`text`) for version 1
- `createdAt`
- `deliveryStatus` (`sent`, `failed`) optional
- `readAt` or participant-specific read tracking

### 13.3 Unread model
Simple model:
- maintain unread count per participant on conversation,
- mark read when thread opens.

More advanced model can be added later if needed.

---

## 14. API contract suggestion

### 14.1 Open or create conversation
`POST /api/messages/conversations/open`

Input:
- counterpart startup id or investor id depending on side
- optional context source

Behavior:
- return existing active thread if present,
- otherwise create one.

### 14.2 List conversations
`GET /api/messages/conversations`

Supports:
- pagination,
- optional search,
- unread filter optional.

### 14.3 Get conversation detail
`GET /api/messages/conversations/:conversationId`

Returns:
- thread metadata,
- recent messages,
- participant summary,
- pagination cursor for older messages.

### 14.4 Load older messages
`GET /api/messages/conversations/:conversationId/messages?cursor=...`

### 14.5 Send message
`POST /api/messages/conversations/:conversationId/messages`

Input:
- message content

Behavior:
- validate permission,
- validate content,
- store message,
- update metadata,
- update unread count,
- trigger notification.

### 14.6 Mark read
`POST /api/messages/conversations/:conversationId/read`

Behavior:
- mark unread messages as read for current user,
- reset unread counter for current user.

---

## 15. Notifications behavior

### 15.1 When to notify
Create a notification when:
- a new message is received.

### 15.2 Notification channels
Notification delivery should support:
- in-app notification,
- email notification when allowed by user preference.

### 15.3 Notification payload suggestion
- sender display name,
- short preview of message,
- timestamp,
- deep link to conversation.

### 15.4 Notification preference respect
If email notification is disabled:
- still keep in-app notification if that channel is enabled.

### 15.5 Read state interaction with notifications
Opening the conversation should update:
- unread conversation badge,
- related in-app notification read state if your system chooses to link them.

---

## 16. Conversation states

### 16.1 Normal states
- no conversations yet
- has conversations
- thread active
- unread messages present
- thread read

### 16.2 Loading states
- list loading
- thread loading
- send in progress
- older messages loading

### 16.3 Empty states
- no conversations
- conversation has no messages yet immediately after creation

### 16.4 Error states
- failed to load list
- failed to load thread
- failed to send message
- rate limit exceeded
- unauthorized / unavailable thread

### 16.5 Restricted states
- messaging not allowed by policy
- user blocked/suspended
- startup inaccessible under policy

---

## 17. Validation rules

### 17.1 Message input validation
- required
- non-empty after trim
- maximum length enforced
- sanitize unsafe input
- reject content violating policy or abuse protections

### 17.2 Thread open validation
- current user authenticated,
- counterpart accessible,
- conversation belongs to actor or may be created under policy,
- no duplicate active thread for same investor-startup pair.

### 17.3 Send action validation
- conversation exists and is accessible,
- sender is permitted,
- rate limit not exceeded,
- message content valid.

---

## 18. UX copy guidance

### 18.1 Conversation list empty state copy
Investor:
- `No conversations yet`
- `Start a conversation from a startup profile.`

Startup:
- `No investor messages yet`
- `Investor conversations will appear here when they contact your startup.`

### 18.2 Send validation copy
- `Please enter a message.`
- `This message is too long.`
- `You cannot send messages right now.`
- `Unable to send message. Please try again.`

### 18.3 Access/unavailable copy
- `Conversation unavailable.`
- `You do not have access to this conversation.`

### 18.4 Professional tone
Use calm, business-like wording. Avoid playful chat copy.

---

## 19. Suggested UI component inventory

### List page components
- PageHeader
- SearchInput optional
- ConversationList
- ConversationListItem
- UnreadBadge
- EmptyState
- ErrorState

### Thread page components
- ConversationHeader
- ParticipantSummary
- MessageList
- MessageBubble
- LoadOlderButton or InfiniteScroller
- MessageComposer
- SendButton
- RetrySendInlineState

### Shared components
- Avatar / Logo fallback
- RelativeTime
- StatusBadge
- NotificationBadge
- Skeleton loaders

---

## 20. Accessibility requirements

- keyboard navigable conversation list,
- visible focus states,
- proper contrast for unread badges and timestamps,
- screen-reader labels for send button and unread counts,
- message composer should support standard text entry and submission without requiring pointer input,
- timestamps should have machine-readable exact values where possible,
- do not rely only on color to indicate sender side or unread state.

---

## 21. Mobile behavior

### 21.1 Mobile IA
Use a 2-step pattern:
- messages list,
- thread detail.

### 21.2 Sticky composer
On mobile thread view:
- keep composer anchored to bottom,
- handle keyboard overlap correctly,
- preserve scroll behavior when keyboard opens.

### 21.3 Message list density
Keep conversation rows compact but readable.

### 21.4 Unread visibility
Unread badge should remain obvious even on narrow screens.

---

## 22. AI generation guidance

Use this guidance if generating UI from AI tools.

### 22.1 What AI must preserve
- professional business chat tone,
- investor-startup context,
- one-to-one conversation model,
- unread indicators,
- list + thread structure,
- simple text-only messaging in version 1.

### 22.2 What AI must not invent
- attachments,
- stickers,
- emoji reactions,
- voice message,
- typing indicator,
- group chat,
- read receipt checkmarks if not supported,
- random social-media style metrics.

### 22.3 Preferred visual style
- premium SaaS workspace,
- clean neutral surfaces,
- compact but readable layout,
- enterprise-professional rather than casual consumer messenger.

---

## 23. Integration points with other modules

### 23.1 Startup Profile / Startup Detail
Investor can start or open conversation from startup detail.

### 23.2 Notifications
New messages trigger notifications.

### 23.3 Connection / Offer flow
Messaging may be contextually linked from connection or offer screens, but should still reuse the same investor-startup thread.

### 23.4 Auth / role shell
Message routes must respect role-based layout and access guards.

---

## 24. Suggested implementation phases

### Phase 1 — Core documented scope
- investor opens or creates conversation from startup profile,
- investor message send,
- investor conversation list,
- investor conversation detail/history,
- startup receives notification,
- startup can open list, view history, and reply,
- unread count updates.

### Phase 2 — Quality improvements
- search conversations,
- empty state polish,
- better context linking from offers/connections,
- message failure retry UX,
- abuse/report entry point.

### Phase 3 — Optional extension
- archive thread,
- moderation tooling,
- attachment support,
- richer thread context.

---

## 25. QA checklist

### Functional
- [ ] investor can start a conversation from startup profile
- [ ] existing thread is reused instead of creating duplicate thread
- [ ] investor can see conversation list
- [ ] conversation list is sorted by latest activity
- [ ] unread indicators update correctly
- [ ] investor can open conversation history
- [ ] message history loads in chronological order
- [ ] older messages can be loaded
- [ ] investor can send valid message
- [ ] invalid/blank message is blocked
- [ ] startup receives notification
- [ ] startup can open same conversation and reply
- [ ] unauthorized conversation access is blocked
- [ ] rate limit response is handled gracefully

### UX
- [ ] empty state is not confused with error state
- [ ] loading states are visible
- [ ] send action has disabled/loading state
- [ ] timestamps are readable
- [ ] unread badges are noticeable
- [ ] mobile composer is usable with keyboard open

### Security
- [ ] thread access is validated server-side
- [ ] messages are sanitized
- [ ] unauthorized IDs do not leak thread existence
- [ ] rate limiting is enforced

---

## 26. Final implementation recommendation

Implement messaging in AISEP as a **professional one-to-one investor-startup conversation system** with:
- one active thread per investor-startup pair,
- message send from startup profile or existing thread,
- conversation list with unread indicators,
- conversation history with chronological loading,
- startup-side mirrored inbox/reply capability,
- notification-driven re-engagement,
- no social-chat extras in version 1.

This is the most logical implementation that stays faithful to the current project documents while filling the minimum product gaps necessary for a complete, working messaging experience.
