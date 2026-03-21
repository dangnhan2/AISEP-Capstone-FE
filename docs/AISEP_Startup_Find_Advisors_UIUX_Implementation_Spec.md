# AISEP — Startup Find Advisors UI/UX Implementation Spec

## 1. Purpose

This document defines the UI/UX implementation scope for the **Startup-side Advisor Discovery** feature in AISEP.

The goal is to help Startup users:
- search for suitable advisors/experts,
- evaluate advisor suitability through profile and rating data,
- move into the consulting flow with minimal friction.

This spec covers the discovery portion and the immediate handoff into consulting request creation.

---

## 2. Source Scope from AISEP Documents

### Core startup use cases involved
- **UC-39** Search Advisors/Experts
- **UC-40** View Advisor Profile & Rating
- **UC-41** Manage Consulting (Startup Side)
- **UC-42** Create consulting request
- **UC-45** Select preferred time slots
- **UC-46** Confirm consulting schedule
- **UC-47** Track consulting request status
- **UC-48** View consulting history
- **UC-50** Submit Feedback & Rating for Advisor

### Screen descriptions involved
- **Search Advisors**
- **Advisor Profile & Rating**
- **Create Consulting Request**
- **Select Preferred Time Slots**
- **My Consulting Requests**
- **Confirm Schedule (Startup)**
- **View Consulting Report**
- **Submit Feedback/Rating**

### Business/domain intent
AISEP explicitly positions Startup users as being able to:
- search/choose advisors,
- request consulting sessions,
- review consulting history and feedback.

---

## 3. Feature Boundary

### In scope
1. Advisor search screen
2. Advisor search/filter/sort UX
3. Advisor result cards/list items
4. Advisor detail/profile screen
5. Rating summary and completed session indicators
6. CTA entry into consulting request flow
7. Empty states / validation / loading / error states
8. Search result constraints and role-based visibility

### Adjacent but separate screens
These are connected but should remain separate screens/modules:
- Create Consulting Request
- Select Preferred Time Slots
- My Consulting Requests
- Confirm Schedule
- View Consulting Report
- Submit Feedback/Rating

### Out of scope for this spec
- Advisor-side schedule management
- Advisor-side accept/reject flows
- Payment / pricing engine UX
- Deep messaging/chat implementation
- Admin moderation flows

---

## 4. Product Goals

The feature should let Startup users answer 3 questions quickly:
1. **Who is suitable for my startup’s current need?**
2. **Can I trust this advisor’s expertise and session quality?**
3. **Can I move into requesting a consultation immediately?**

The UX must feel like a **decision-support workflow**, not just a directory.

---

## 5. Primary User Flow

### Main flow
1. Startup opens **Search Advisors**.
2. System shows:
   - search input,
   - expertise filter,
   - experience filter,
   - rating filter,
   - advisor result list.
3. Startup enters one or more criteria.
4. System retrieves only supported matches from active advisor profiles.
5. Startup reviews search results.
6. Startup opens an advisor.
7. System shows **Advisor Profile & Rating**.
8. Startup evaluates expertise, biography, experience, ratings, and completed sessions.
9. Startup clicks **Request Consulting**.
10. System routes to **Create Consulting Request**.
11. Startup continues to preferred time slots and consulting workflow.

### Secondary flows
- Refine search criteria
- Clear all filters
- Save current search state in URL
- Return from profile to results while preserving filters
- Open advisor profile from different result cards without losing search state

---

## 6. Information Architecture

### Screen A — Search Advisors
Purpose:
- discover suitable advisors,
- search by criteria,
- scan multiple options quickly,
- decide whom to inspect further.

### Screen B — Advisor Profile & Rating
Purpose:
- evaluate one advisor in detail,
- review experience/expertise quality,
- assess social proof through rating summary,
- start consulting request flow.

### Connected flow screens
- Create Consulting Request
- Select Preferred Time Slots

---

## 7. Search Advisors — Screen Spec

## 7.1 Page purpose
The page must help startups search advisors by:
- expertise,
- experience,
- rating,
- keyword intent.

Per SRS, this screen must include:
- Search input
- Expertise filter
- Experience filter
- Rating filter
- Result list

Only **active advisor profiles** may appear in results.

---

## 7.2 Recommended layout

### Desktop
- Header / title area
- Search and controls bar
- Left filter sidebar
- Main advisor result grid/list
- Optional top-right sort control

### Mobile / tablet
- Search bar on top
- Filter drawer or bottom sheet
- Result list stacked vertically
- Sticky bottom filter/sort action optional

---

## 7.3 Top header
Show:
- Page title: **Find Advisors**
- Subtitle: short guidance such as:
  - “Find advisors based on expertise, experience, and session quality.”
- Optional helper line:
  - “Choose an advisor and continue to consulting request.”

Optional quick actions:
- My Consulting Requests
- Consulting History

---

## 7.4 Search and filter controls

### Search input
Purpose:
- free-text advisor lookup
- support topic/skill/keyword discovery

Recommended placeholder:
- `Search by expertise, domain, advisor name, or topic...`

Suggested supported query intent:
- expertise area
- startup need
- advisor name
- industry topic
- consulting topic

### Required filters from SRS
1. **Expertise filter**
2. **Experience filter**
3. **Rating filter**

### Recommended additional filters for better UX
These are implementation-level enhancements, not contradictions to the SRS:
- Industry/domain focus
- Consultation format (if available later)
- Availability indicator
- Verification status
- Language

### Sort options
The SRS section for Search Advisors does not explicitly require sort, but adding sort improves usability.
Recommended:
- Best Match
- Highest Rated
- Most Experienced
- Most Sessions Completed
- Recently Active

---

## 7.5 Advisor result list/card structure

Each advisor result should help startups compare suitability quickly.

### Required visible data
Because the SRS says the result list feeds into advisor profile evaluation by expertise/experience/rating, each item should include:
- advisor avatar / photo
- advisor name
- expertise summary
- experience summary
- rating summary
- CTA to view profile

### Recommended advisor card structure

#### Top row
- Avatar / profile photo
- Advisor name
- Verification badge (if available)
- Availability chip (optional)

#### Professional summary
- Primary expertise areas
- Short one-line headline
- Years of experience
- Industry/domain tags

#### Trust / performance row
- Average rating
- Number of reviews or completed sessions
- Completed consulting count

#### Fit / relevance row (recommended)
- “Relevant for fundraising”
- “Strong in product strategy”
- “Works with early-stage startups”

#### Primary actions
- View Profile
- Request Consulting
- Save / shortlist (optional enhancement)

### Data density rule
Do not overload the card.
This is a discovery screen, not the full profile.

---

## 7.6 Empty / loading / error states

### Loading
- skeleton cards
- loading state for filters

### No results
Show:
- no result illustration or neutral empty state
- message such as:
  - “No advisors match your current criteria.”
- actions:
  - Clear filters
  - Broaden expertise
  - Reset rating/experience filters

### Invalid input
If unsupported criteria or malformed parameters are submitted, show inline validation and a safe fallback state.

### Processing failure
Show retry state and preserve current criteria values.

---

## 7.7 Functional rules
- Startup must be authenticated.
- Only supported search criteria are allowed.
- Only active advisor profiles are shown.
- Search state should be restorable when returning from profile to results.

---

## 8. Advisor Profile & Rating — Screen Spec

## 8.1 Page purpose
This screen lets the startup evaluate whether the selected advisor is suitable before sending a consulting request.

Per SRS, the detail screen should include:
- advisor profile view,
- expertise and experience,
- biography,
- rating summary,
- completed sessions,
- action button.

---

## 8.2 Layout recommendation

### Desktop
- Top identity header
- Main content left column
- Summary / CTA right column

### Mobile
- stacked sections
- sticky bottom CTA for Request Consulting optional

---

## 8.3 Profile header
Show:
- advisor photo/avatar
- advisor full name
- professional title/headline
- verification badge if available
- primary expertise chips
- average rating summary
- completed sessions count
- primary CTA: **Request Consulting**
- secondary CTA: Back to Search

Optional:
- recently active
- response rate / response time (only if grounded in real data later)

---

## 8.4 Main content sections

### Section 1 — Expertise & Experience
Required by SRS.
Show:
- expertise areas
- years of experience
- key domain/industry knowledge
- startup stages served
- service categories or mentoring topics

### Section 2 — Biography
Required by SRS.
Show:
- short professional biography
- advisor background summary
- notable credentials / companies / achievements

### Section 3 — Rating Summary
Required by SRS.
Show:
- average rating
- rating distribution (optional)
- total completed sessions used for rating basis
- short review highlights if available

Important:
The SRS notes rating data must come from valid completed sessions.
Do not display rating widgets that imply unverified open reviews.

### Section 4 — Completed Sessions
Required by SRS.
Show:
- completed consulting count
- optionally grouped by topic or startup stage

### Section 5 — Suitable For (recommended)
This is a UX enhancement to help the startup decide faster.
Show concise fit signals such as:
- fundraising prep
- product strategy
- go-to-market
- hiring / operations
- legal/compliance guidance (if supported)

### Section 6 — Action Area
Show:
- Request Consulting
- optional Save Advisor
- optional View Similar Advisors

---

## 8.5 Right column / summary panel
Suggested content:
- advisor quick facts
- average rating
- completed sessions
- primary expertise
- verification status
- CTA: Request Consulting
- helper note:
  - “You’ll continue to create a consulting request and propose preferred time slots.”

---

## 8.6 Advisor unavailable states
If profile is unavailable:
- show not available state
- CTA back to search
- preserve prior search criteria

If rating data is partially unavailable:
- still display profile
- downgrade rating section gracefully
- show neutral helper text

---

## 9. Handoff to Consulting Request Flow

Although consulting request creation is a separate feature, the advisor discovery screens must hand off cleanly into it.

### Entry points
- Search result card → Request Consulting
- Advisor Profile → Request Consulting

### Data that should pass into request flow
- advisorId
- advisor display name
- advisor expertise summary
- origin source (search card or profile screen)
- current startupId from session

### Next screens in sequence
1. Create Consulting Request
2. Select Preferred Time Slots
3. My Consulting Requests
4. Confirm Schedule

---

## 10. Suggested Data Model for UI

## 10.1 Search result advisor item
```ts
interface AdvisorSearchItem {
  id: string;
  fullName: string;
  avatarUrl?: string;
  headline?: string;
  expertiseAreas: string[];
  yearsOfExperience?: number;
  averageRating?: number;
  reviewCount?: number;
  completedSessions?: number;
  verificationLabel?: string;
  isActive: boolean;
  availabilityHint?: string;
}
```

## 10.2 Advisor detail model
```ts
interface AdvisorProfileDetail {
  id: string;
  fullName: string;
  avatarUrl?: string;
  headline?: string;
  biography?: string;
  expertiseAreas: string[];
  yearsOfExperience?: number;
  domainTags?: string[];
  stageFocus?: string[];
  averageRating?: number;
  ratingBreakdown?: { score: number; count: number }[];
  completedSessions?: number;
  verificationLabel?: string;
  isActive: boolean;
}
```

## 10.3 Search/filter state model
```ts
interface AdvisorSearchFilters {
  query?: string;
  expertise?: string[];
  experienceRange?: string;
  ratingMin?: number;
  sortBy?: 'best_match' | 'highest_rated' | 'most_experienced' | 'most_sessions' | 'recently_active';
}
```

---

## 11. Component List

### Search Advisors page
- PageHeader
- SearchInput
- FilterSidebar / FilterDrawer
- ExpertiseFilter
- ExperienceFilter
- RatingFilter
- SortDropdown
- AdvisorResultCard
- ResultCountBar
- EmptyState
- Pagination or infinite list wrapper

### Advisor Profile page
- Breadcrumbs
- AdvisorHeroHeader
- ExpertiseSection
- BiographySection
- RatingSummaryCard
- CompletedSessionsCard
- QuickFactsPanel
- RequestConsultingButton
- UnavailableState

---

## 12. UI States Checklist

### Search page states
- default empty search
- searched with results
- searched with no results
- invalid criteria
- loading
- load failed
- filter applied
- filter cleared

### Advisor profile states
- full profile loaded
- partial rating data loaded
- profile unavailable
- advisor inactive / not accessible
- request CTA loading

---

## 13. Validation & Business Constraints

### Search Advisors
- user must be authenticated as Startup
- only supported filter parameters allowed
- only active advisor profiles returned

### View Advisor Profile & Rating
- advisor profile must exist and be active
- rating data must come from valid completed sessions
- if rating data is missing, profile still displays

### Consulting request entry
- advisor must still be eligible/active at request time
- if not eligible, block handoff and show a safe message

---

## 14. Interaction Rules

### Search results behavior
- preserve filter state in query params where possible
- back navigation from profile returns to prior search state
- clicking card body opens profile
- clicking primary CTA may go directly to request flow

### Filters
- multi-select expertise
- single-select or range-based experience
- rating as min threshold
- clear all filters action

### Accessibility
- keyboard navigable filters
- visible focus styles
- readable color contrast
- support screen-reader labels on rating stars and CTA buttons

---

## 15. Suggested API Surface (UI-facing)

### Search advisors
`GET /api/v1/startup/advisors`

Suggested query params:
- `q`
- `expertise[]`
- `experienceRange`
- `ratingMin`
- `sortBy`
- `page`
- `pageSize`

### Get advisor profile detail
`GET /api/v1/startup/advisors/:advisorId`

### Start consulting request draft
`POST /api/v1/startup/consulting-requests`

---

## 16. UX Copy Guidance

### Search page
- Title: `Find Advisors`
- Subtitle: `Search for experts based on expertise, experience, and session quality.`

### Empty state
- `No advisors match your current criteria.`
- `Try broadening your expertise or rating filters.`

### Advisor profile CTA
- `Request Consulting`
- `Back to Results`

### Error copy
- `We couldn’t load advisor results right now.`
- `Please try again.`

---

## 17. Recommended Visual Direction

- premium SaaS workspace
- startup-facing but professional
- clear trust hierarchy
- expertise and rating should be visually scannable
- avoid directory clutter
- avoid social-media style vanity metrics
- prioritize relevance and decision support

---

## 18. QA / Acceptance Checklist

### Search Advisors
- [ ] Search input works with supported parameters
- [ ] Expertise filter works
- [ ] Experience filter works
- [ ] Rating filter works
- [ ] Only active advisors appear
- [ ] No-result state is shown correctly
- [ ] Invalid criteria are handled safely
- [ ] Error state preserves entered criteria
- [ ] Search state persists when returning from profile

### Advisor Profile & Rating
- [ ] Profile loads correctly for active advisor
- [ ] Expertise and experience are displayed
- [ ] Biography is displayed
- [ ] Rating summary is displayed when available
- [ ] Completed sessions are displayed
- [ ] Missing rating data does not block profile rendering
- [ ] Unavailable advisor state is handled
- [ ] Request Consulting CTA routes correctly

### Handoff
- [ ] Advisor id passes correctly into consulting request flow
- [ ] Back navigation preserves prior results state
- [ ] Unauthorized access is blocked

---

## 19. Engineering Notes

- Preserve search state in the URL for usability.
- Build discovery UI and profile UI as separate route-level pages.
- Keep result card fields lightweight; fetch full advisor detail lazily on profile page.
- Design request CTA to integrate with Create Consulting Request without duplicating form logic.
- Future enhancements can include AI-based advisor recommendation, but this should not be assumed in the initial Search Advisors scope unless product explicitly adds it later.

---

## 20. Final Implementation Recommendation

Implement the feature in **2 phases**:

### Phase 1 — Required by SRS
- Search Advisors page
- advisor filters: expertise / experience / rating
- advisor result list
- advisor detail/profile page
- request consulting CTA handoff

### Phase 2 — UX polish / enhancement
- best match sort
- save advisor / shortlist
- richer rating distribution
- advisor fit reasons
- recently active / availability indicators

This keeps the implementation fully aligned with the documented AISEP scope while leaving room for polish without blocking the core startup advisory discovery flow.
