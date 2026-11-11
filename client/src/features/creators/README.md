# Creator Discovery & Profiles Module (Frontend)

**Owner**: Tushar Singh
**Domain**: Creator Discovery, Directory Listings, Domain Filtering, Detailed Profiles, Connections Integration & Content Showcase
**Status**: Day 3 Live Integration Complete (`feature/day-3-live-creator-discovery`)

---

## 1. Module Overview

The **Creator Discovery** feature enables Ryth Core users to discover domain experts, software architects, AI researchers, and practitioners across technical disciplines. Users can search across multi-attribute creator records (including skills), filter by domain category, view detailed PostgreSQL-backed creator profiles, initiate live connection requests via Jatin's Connections APIs, and inspect a creator's Content Showcase.

---

## 2. Directory Structure

```
client/src/features/creators/
├── components/
│   ├── CategoryFilter.jsx         # Horizontal scrolling domain pill filters
│   ├── ConnectButton.jsx          # Accessible live Connect / Accept / Status button
│   ├── CreatorCard.jsx            # Editorial creator card with live Connect & View Profile actions
│   ├── CreatorGrid.jsx            # Responsive 1/2/3-column grid layout with skeletons & retry
│   ├── CreatorSearch.jsx          # Real-time search input with clear & submit controls
│   ├── HeroArtwork.jsx            # Editorial SVG/geometric artwork in directory hero
│   ├── ProfileAbout.jsx           # Multi-paragraph bio & expertise areas
│   ├── ProfileAchievements.jsx    # Honors, certifications & awards grid
│   ├── ProfileContentShowcase.jsx # Creator Content Showcase (ARTICLE, VIDEO, BOOK)
│   ├── ProfileExperience.jsx      # Career timeline section
│   ├── ProfileHeader.jsx          # Profile header card, social links & live ConnectButton
│   └── ProfileSkills.jsx          # Skills taxonomy tags with category badge
├── constants/
│   └── categories.js              # Verified domain categories matching PostgreSQL values
├── data/
│   └── mockCreators.js            # Legacy Day 1 reference dataset (unused in production views)
├── hooks/
│   └── useConnectionStatus.js     # Connection status derivation & request/accept mutations
├── pages/
│   ├── CreatorListingPage.jsx     # Main directory page (/creators) with live search & pagination
│   └── CreatorProfilePage.jsx     # Detailed creator profile (/creators/:id) with UUID routing
├── services/
│   ├── connectionsApi.js          # Live Connections API wrapper (/api/connections/*)
│   └── creatorsApi.js             # Creator Discovery API wrapper (/api/creators/*)
└── README.md                      # Feature documentation
```

---

## 3. Key Components & Implementation

### 3.1 Creator Listing Page (`/creators`)
- **Live Database Integration**: Fetches creators from `GET /api/creators` backed by PostgreSQL (`mockCreators.js` is not imported on production pages).
- **Multi-Attribute Search & Debouncing**: 350ms debounced search (plus immediate Enter/Search submission) querying case-insensitively across `user.name`, `professionalTitle`, `organization`, `biography`, `introduction`, and `skills` (`CreatorSkill.skillName`).
- **Category Filtering & Pagination**: Uses `CREATOR_CATEGORIES` (`All`, `AI & Machine Learning`, `Cloud & DevOps`, `Frontend & Design`, `Backend & Systems`, `Cybersecurity`, `Product & Tech Leadership`) matching stored database values. Resets synchronously to page 1 on search or category changes.
- **Page-Local Sorting**: Sorts the currently fetched page slice by Name (A-Z) or Experience (High to Low), clearly displaying `(Current page only)` when multiple pages exist.
- **Stale-Response Protection**: Effect cleanup guards (`let ignore = false`) ensure earlier responses never overwrite active queries.

### 3.2 Creator Profile Page (`/creators/:id`)
- **UUID Routing**: Uses `CreatorProfile.id` UUID in `/creators/:id` (with client-side UUID regex validation before firing API requests).
- **Profile Sections**: Renders header, social links, biography, expertise areas, career timeline, skills, achievements, and mentorship sidebar with safe defaults for null/optional fields.
- **Resilient States**: Checks `error` state (network / 5xx with **Retry** button) before `notFound` (`404` / invalid UUID), preventing network errors from displaying `"Creator Not Found"`.

### 3.3 Live Connections Integration
- **Service (`services/connectionsApi.js`)**: Wraps `/api/connections/request` (`POST`), `/api/connections` (`GET`), and `/api/connections/:id` (`PATCH`) via the shared authenticated Axios client.
- **Hook (`hooks/useConnectionStatus.js`)**: Derives connection state from `fetchUserConnections()` and handles optimistic updates, self-request checks, `409 ALREADY_CONNECTED`, and `409 REQUEST_ALREADY_EXISTS` recovery.
- **UI Component (`components/ConnectButton.jsx`)**:
  - Supported UI states: `IDLE` (`Connect`), `PENDING_SENT` (`Pending`), `PENDING_RECEIVED` (`Accept Request`), `CONNECTED` (`Connected`), `SELF` (`Your Profile` / `You`), and `UNAUTHENTICATED` (`Sign in to Connect`).
  - Header and sidebar buttons on `CreatorProfilePage` share fetched `connectionsData` and stay synchronized via `onActionSuccess`.
- **Identifier Contract**: Profile navigation uses **`CreatorProfile.id`**, whereas connection requests send **`creator.userId` (`User.id`)** as `receiverId`.

### 3.4 Creator Content Showcase (`components/ProfileContentShowcase.jsx`)
- **Independent Data Loading**: `CreatorProfilePage` loads `GET /api/creators/:id/content` in a separate `useEffect` with `isContentLoading`, `contentError`, and `handleRetryContent` so content latency or failure never blocks the profile display.
- **Supported Types & Fields**: Supports `ARTICLE`, `VIDEO`, and `BOOK` badges/filter tabs, thumbnails (with `onError` hiding), titles, descriptions, categories, formatted publication dates, and safe external (`target="_blank"`) or internal (`/`) link navigation.
- **UI States**: Dedicated localized loading skeleton, inline error + **Retry Content Load** banner (for non-501 errors), and editorial empty state with link to `/content`.

---

## 4. Known Limitations & Dependencies

1. **Content Hub Backend Pending**: Anvesha Patel's Content Hub backend (`server/src/modules/content/content.service.js`) currently returns `501 NOT_IMPLEMENTED`, and `Content` in `schema.prisma` lacks a foreign-key relationship to `CreatorProfile` or `User` (only a plain `author` string exists). `GET /api/creators/:id/content` returns `{ content: [], count: 0 }`, so `ProfileContentShowcase` displays its empty state until live content records and creator linkage are available.
2. **Connections Page Navigation Pending**: `Connect` and `Accept Request` work live on creator cards and profile pages, while the top navigation `"Connections"` link in `Navbar.jsx` points to `#` pending Jatin's dedicated Connections page.
3. **Page-Local Sorting**: Sorting by Name or Experience applies only to the currently fetched page slice (6 creators per page) rather than global database ordering.
