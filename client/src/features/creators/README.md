# Creator Discovery & Profiles Module (Frontend)

**Owner**: Tushar Singh
**Domain**: Creator Discovery, Directory Listings, Domain Filtering, and Detailed Profiles
**Status**: Fully Integrated with PostgreSQL Backend (Day 2 Complete)

---

## 1. Module Overview

The **Creator Discovery** feature enables Ryth Core users to discover domain experts, software architects, AI researchers, and digital practitioners across various technical disciplines. Users can filter by domain category, search in real-time, view detailed biographical and skill profiles, and prepare for peer connections.

---

## 2. Directory Structure

```
client/src/features/creators/
├── components/
│   ├── CategoryFilter.jsx   # Horizontal scrolling domain pill filters
│   ├── CreatorCard.jsx      # Warm ivory & forest green editorial creator card
│   ├── CreatorGrid.jsx      # Responsive 1/2/3-column grid layout with skeletons
│   └── CreatorSearch.jsx    # Real-time search input with clear button
├── data/
│   └── mockCreators.js      # Preserved offline development dataset & fallbacks
├── pages/
│   ├── CreatorListingPage.jsx # Main directory page (/creators) with search & pagination
│   └── CreatorProfilePage.jsx # Detailed creator profile (/creators/:id) with UUID routing
├── services/
│   └── creatorsApi.js       # Dedicated API service layer using central Axios instance
└── README.md                # Feature documentation
```

---

## 3. Key Components & Implementation

### 3.1 Creator Listing Page (`/creators`)
- **Live Database Integration**: Fetches creators from `GET /api/creators` backed by PostgreSQL.
- **Search & Debouncing**: Implements a 350ms debounce on keyword input to prevent excessive backend queries.
- **Category Filtering**: Allows quick domain filtering (`All`, `Cloud & DevOps`, `AI & Machine Learning`, `Frontend & Design`, `Backend & Systems`, `Cybersecurity`, `Product & Tech Leadership`). Automatically resets to page 1 upon category change.
- **Pagination**: Supports database-driven page-by-page browsing with previous/next controls, direct page navigation, and mobile-friendly tap targets.
- **Client-Side Sorting**: Sorts currently loaded page results by Name (A-Z) and Experience (High to Low). Explicitly labeled as page-local to avoid misleading users.
- **Stale-Response Protection**: React effect cleanup pattern ensures out-of-order network responses never overwrite active user selections.
- **Empty & Error Handling**: Custom empty states when no creators match filters, with one-click "Reset filters", and an error banner with a "Retry" button.

### 3.2 Creator Profile Page (`/creators/:id`)
- **UUID Route Parameter**: Loads creator records via `/creators/:id` where `:id` is a valid PostgreSQL UUID.
- **Rich Biographical Display**: Presents headline, organization, location, detailed multi-paragraph biography, expertise areas, professional experience timeline, and verified social links (GitHub, LinkedIn, Twitter, Personal Website).
- **Skills & Achievements**: Displays interactive skill badges and honors/certifications with issuing organizations and years.
- **Graceful Error States**:
  - `404 Not Found`: Displayed when an unknown UUID or non-existent creator is requested, with navigation back to the directory.
  - `Error State`: Displayed on network failure with an integrated "Retry" action.
  - `Loading Skeleton`: Animated placeholder matching the profile layout.
- **Decoupled Content Showcase**: Creator educational content (`GET /api/creators/:id/content`) loads independently; if content retrieval fails or returns empty, the profile renders gracefully without interruption.

### 3.3 API Service Layer (`services/creatorsApi.js`)
Wraps the central configured Axios instance (`client/src/services/api.js`) and exports clean async functions:
- `fetchCreators(params)`: Query parameters: `search`, `category`, `skill`, `page`, `limit`.
- `fetchCreatorById(id)`: Fetches complete profile by UUID.
- `searchCreators(params)`: Fast lookup by keyword, skill, and expertise.
- `fetchCreatorContent(id)`: Fetches creator educational resources.

---

## 4. Known Limitations & Dependencies

1. **Sorting Scope**: Sorting by Name or Experience applies to the currently fetched page slice (6 creators per page) rather than issuing a global database re-order.
2. **Content Module Hand-off**: The Content Showcase on the profile page returns an empty state until Anvesha Patel's Content Hub module is connected.
3. **Connections Module Hand-off**: The "Connect" and "Message" buttons trigger UI interaction callbacks; full connection graph invitations and messaging depend on Jatin's Connections module.

