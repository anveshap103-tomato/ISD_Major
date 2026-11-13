# Ryth Core

> **Problem Statement ID**: 2501010153  
> **Duration**: 5-Day Major University Project  
> **Platforms**: Web & Android (Capacitor)

---

## 1. Project Overview

**Ryth Core** is a unified platform connecting learning, creator discovery, and real-world networking. It allows users to explore curated educational content (articles, short-form videos, and books), discover industry professionals and creators, explore their domain expertise, and initiate real-world connections.

### Core User Journey
$$\text{Interest} \longrightarrow \text{Learning} \longrightarrow \text{Creator Discovery} \longrightarrow \text{Connection}$$

---

## 2. Team & Ownership Breakdown

| Team Member | Module / Domain | Scope of Work |
| :--- | :--- | :--- |
| **Anvesha Patel** | **Knowledge & Content Hub** | Articles, short-form videos, books, categories, bookmarks, content search & filtering. |
| **Tushar Singh** | **Creator Discovery & Profiles** | Creator listings, detailed profiles, search, skills, domain expertise filters. |
| **Jatin** | **Authentication, Connections & Personalization** | User auth (signup/login), user profiles, interests, connection requests, and personalized feed. |

*Note: Each team member handles frontend, backend, database integration, and testing within their respective module.*

---

## 3. Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios
- **Mobile Runtime**: Capacitor (Android)
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Version Control**: Git & GitHub

---

## 4. Repository Structure

```
RythCore/
├── docs/                   # Architectural blueprints and specifications
│   ├── ARCHITECTURE.md     # System architecture & data flow
│   ├── API_CONTRACTS.md    # REST API endpoints & payload schemas
│   ├── DATABASE_SCHEMA.md  # Relational database schema & ERD
│   └── CONTRIBUTING.md    # Workflow, git conventions & branch rules
├── client/                 # Frontend application (React + Vite + Capacitor)
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── assets/         # Images, icons, static files
│   │   ├── components/     # Shared UI & layout components
│   │   ├── features/       # Feature-based modular frontend
│   │   │   ├── content/    # [Anvesha] Articles, videos, books, bookmarks
│   │   │   ├── creators/   # [Tushar] Creator listings, profiles, filters
│   │   │   └── connections/# [Jatin] Auth, connection requests, feed
│   │   ├── routes/         # Application routing definitions
│   │   ├── services/       # Axios client & base API configuration
│   │   └── utils/          # Shared helper utilities
│   ├── capacitor.config.json
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                 # Backend REST API (Node.js + Express + Prisma)
│   ├── prisma/             # Prisma schema & database migrations
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/         # Database and third-party configuration
│   │   ├── middlewares/    # Authentication, error handlers, validation
│   │   ├── modules/        # Modular backend domains
│   │   │   ├── auth/       # [Jatin] Authentication endpoints & logic
│   │   │   ├── content/    # [Anvesha] Content endpoints & logic
│   │   │   ├── creators/   # [Tushar] Creator discovery & profile logic
│   │   │   ├── connections/# [Jatin] Networking & connection logic
│   │   │   └── feed/       # [Jatin] Personalized recommendation feed
│   │   ├── utils/          # Shared server utilities
│   │   └── server.js       # Express server entry point
│   └── package.json
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore configuration
└── package.json            # Monorepo workspace configuration
```

---

## 5. Getting Started & Local Setup

### Prerequisites
- **Node.js**: v18.x or v20.x or later
- **npm**: v9.x or later
- **PostgreSQL**: v14+ (running locally or via a hosted cloud provider)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd RythCore
   ```

2. **Install dependencies:**
   ```bash
   # Install dependencies across all workspaces from the monorepo root:
   npm install
   ```

3. **Configure Environment Variables:**
   - **Backend (`server/.env`)**:
     ```bash
     cp server/.env.example server/.env
     ```
     Update `DATABASE_URL` with your PostgreSQL connection string and `PORT` (default: `5000` or `5001`):
     ```env
     PORT=5001
     NODE_ENV=development
     DATABASE_URL="postgresql://postgres:password@localhost:5432/ryth_core?schema=public"
     JWT_SECRET=your_jwt_secret_key_here
     CLIENT_URL=http://localhost:5173
     ```
   - **Frontend (`client/.env`)**:
     ```bash
     cp client/.env.example client/.env
     ```
     Ensure `VITE_API_BASE_URL` points to your backend:
     ```env
     VITE_API_BASE_URL=http://localhost:5001/api
     ```

4. **Initialize & Seed PostgreSQL Database:**
   ```bash
   cd server

   # 1. Validate the Prisma 7 schema
   npx prisma validate

   # 2. Generate Prisma Client with PostgreSQL adapter
   npx prisma generate

   # 3. Apply database migrations
   npx prisma migrate dev

   # 4. Seed the database with verified creator profiles
   npm run prisma:seed
   ```

5. **Start Development Servers:**
   From the repository root:
   ```bash
   # Start backend API (http://localhost:5001):
   npm run server:dev

   # Start frontend client (http://localhost:5173):
   npm run client:dev
   ```

6. **Production Build:**
   ```bash
   # Build the React frontend for production:
   npm run client:build
   ```

---

## 6. Module 2 — Creator Discovery & Profiles

**Owner:** Tushar Singh \
**Complete Specification:** [Detailed Module 2 Documentation](docs/MODULE_2_CREATOR_DISCOVERY.md)

The **Creator Discovery & Profiles** module (`/creators` and `/creators/:id`) provides a curated, high-performance directory of industry practitioners, deep professional profiles, multi-attribute search, domain category filters, and live real-world networking integration.

### Core Capabilities:
- **Directory Listing (`/creators`)**: Displays live PostgreSQL practitioners with roles, organizations, locations, domain badges, biographies, top technical skills, and live Connect actions.
- **Multi-Attribute Search & Debouncing**: Case-insensitive 350ms debounced search matching across creator names, professional titles, organizations, biographies/introductions, and granular technical skills (`CreatorSkill.skillName`).
- **Domain Category Filtering & Pagination**: Filter across 6 verified engineering domains (`AI & Machine Learning`, `Cloud & DevOps`, `Frontend & Design`, `Backend & Systems`, `Cybersecurity`, `Product & Tech Leadership`, and `All`). Includes pagination with out-of-range boundary clamping and page-local sorting (`Relevance`, `Experience`, `Name`).
- **Detailed Profiles (`/creators/:id`)**: Comprehensive practitioner profiles supporting dual UUID lookup (`CreatorProfile.id` or `User.id`), editorial biographies, chronological career timelines, verified certifications/achievements, and defensive data mapping (`safeCreator`).
- **Decoupled Content Showcase**: `ProfileContentShowcase.jsx` independently loads `GET /api/creators/:id/content` with type filtering (`Articles`, `Videos`, `Books`) and editorial empty states linked to `/content`.
- **Live Connections Integration**: Reusable `ConnectButton.jsx` and `useConnectionStatus.js` hooked into Jatin's `/api/connections/*` endpoints with 6 state machine representations (`Connect`, `Pending`, `Connected`, `Accept Request`, `Your Profile`/`You`, and `Sign in to Connect`).
- **Mobile & Accessibility Parity**: Responsive 3-col/2-col/1-col layouts, `>= 44×44px` touch targets, `env(safe-area-inset-bottom)` spacing, `overflow-x-clip`, and native browser delegation via `@capacitor/browser`.
- **Regression Verification:** **88/88 automated regression tests passed** across data contracts, pagination, search, filters, profile routing, content, and Express HTTP endpoints.

### Available Backend API Endpoints:
- `GET /api/creators`: Paginated listing with `search`, `category`, `skill`, `page`, and `limit` query parameters.
- `GET /api/creators/search`: Dedicated search endpoint across practitioner credentials and skills.
- `GET /api/creators/:id`: Detailed creator profile lookup by UUID (supports `CreatorProfile.id` or `User.id`).
- `GET /api/creators/:id/content`: Creator published educational resources endpoint.
- Consumes: `POST /api/connections/request`, `GET /api/connections`, `PATCH /api/connections/:id` (Jatin's Connections module).

---

## 7. Known Limitations & Teammate Module Hand-offs

- **Page-Local Sorting**: In the directory listing, sorting by Name (A-Z) or Experience applies to the currently fetched page slice (6 items) rather than issuing a global database re-order.
- **Content Hub Backend Pending**: Anvesha Patel's Content Hub backend (`server/src/modules/content/content.service.js`) currently returns `501 NOT_IMPLEMENTED`, and `Content` lacks a foreign-key relationship to `CreatorProfile` or `User`. `GET /api/creators/:id/content` returns `{ content: [], count: 0 }`, and the Creator Content Showcase renders an empty state until real content records and creator linkage are added.
- **Connections Navigation Page Pending**: While inline `Connect` and `Accept Request` actions on creator cards and profiles use live `/api/connections/*` endpoints, the top navigation `"Connections"` link in `Navbar.jsx` points to `#` pending Jatin's dedicated Connections dashboard page.

---

## 8. Mobile Platforms (Capacitor 8.6: Android & iOS)

The same React + Vite frontend (`client/dist`) is packaged for both **Android** (`client/android/`) and **iOS** (`client/ios/`) via **Capacitor 8.6** (`com.rythcore.app` / `Ryth Core`).

### Prerequisites (All Mobile Platforms)
- **Node.js:** `>= 22.0.0` (required by `@capacitor/cli@8.6.0`)
- **Installed Capacitor Packages:** `@capacitor/core@^8.6.0`, `@capacitor/cli@^8.6.0`, `@capacitor/android@^8.6.0`, `@capacitor/ios@^8.6.0`, `@capacitor/app@^8.1.2`, `@capacitor/browser@^8.0.5`

### Capacitor Build & Sync Commands
Whenever frontend code or environment variables change, rebuild and sync both native platforms:
```bash
cd client
npm run build
npx cap sync android
npx cap sync ios
```

### Android Setup & Build
1. **Prerequisites:** Install **Android Studio** (Otter 2025.2.1+ or newer) with **JDK 21+** (`JAVA_HOME` configured) and **Android SDK Platform 36** (`compileSdkVersion = 36`, `targetSdkVersion = 36`, `minSdkVersion = 24`, AGP `8.13.0`, Gradle `8.14.3`).
2. **Sync web assets & plugins:**
   ```bash
   cd client
   npm run build
   npx cap sync android
   ```
3. **Build debug APK or open in Android Studio:**
   ```bash
   # CLI debug APK build:
   cd client/android
   ./gradlew assembleDebug
   # Output: client/android/app/build/outputs/apk/debug/app-debug.apk

   # Or open in Android Studio to run on an emulator/device:
   cd client
   npm run cap:open:android
   ```

### iOS Setup & Build (Xcode & iPhone Simulator)
1. **Prerequisites:** **Xcode** (macOS; tested on Xcode 27.2 / iOS 27.0 Simulator, deployment target iOS `15.0`, `UIScene` lifecycle enabled) and **CocoaPods** (`pod`):
   ```bash
   brew install cocoapods
   ```
2. **Sync web assets & install iOS Pods (`Pods/` + `App.xcworkspace`):**
   ```bash
   cd client
   npm run build
   npx cap sync ios
   ```
3. **Open in Xcode:**
   ```bash
   npm run cap:open:ios
   # Opens client/ios/App/App.xcworkspace (always use .xcworkspace, not .xcodeproj, after pod install)
   ```
4. **Run on iPhone Simulator:** Select an iPhone simulator target (e.g., `iPhone 18 Pro`) in the Xcode toolbar and press **Run (`Cmd + R`)**, or build from CLI:
   ```bash
   xcodebuild -workspace client/ios/App/App.xcworkspace -scheme App -configuration Debug -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 18 Pro' build
   ```
5. **Backend URL Note:** `VITE_API_BASE_URL` currently defaults to `http://localhost:5001/api`. For physical devices or production builds, update `VITE_API_BASE_URL` in `client/.env` to a deployed HTTPS backend URL before running `npm run build` and `npx cap sync`.

