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

## 6. Creator Discovery Module (Day 3 Status)

The **Creator Discovery** module (`/creators` and `/creators/:id`) is integrated with PostgreSQL via Prisma ORM 7 and connected to Jatin's live Connections APIs.

### Features Implemented:
- **Directory Listing (`/creators`)**: Displays live PostgreSQL practitioners with role, organization, location, category badge, bio, top skills, and live Connect actions (`mockCreators.js` is not used in production pages).
- **Multi-Attribute Search & Debouncing**: Case-insensitive 350ms debounced search across creator names, professional titles, organizations, biographies/introductions, and skills (`CreatorSkill.skillName`).
- **Domain Category Filtering & Pagination**: Filters across the 6 stored categories (`AI & Machine Learning`, `Cloud & DevOps`, `Frontend & Design`, `Backend & Systems`, `Cybersecurity`, `Product & Tech Leadership`), resets pagination synchronously to page 1, and preserves page-local sorting (`(Current page only)` indicator).
- **Detailed Profiles (`/creators/:id`)**: Loads profiles by `CreatorProfile.id` PostgreSQL UUID, with safe handling of optional/null fields, error-first Retry recovery, and 404 Not Found states.
- **Live Connections Integration**: Creator cards and profile headers/sidebars integrate `connectionsApi.js`, `useConnectionStatus.js`, and `ConnectButton.jsx` against `/api/connections/*` (`Connect`, `Pending`, `Connected`, `Accept Request`, `Your Profile`/`You`, and `Sign in to Connect`). Profile navigation uses `CreatorProfile.id`; connection requests pass `creator.userId` (`User.id`) as `receiverId`.
- **Creator Content Showcase**: `ProfileContentShowcase.jsx` loads `GET /api/creators/:id/content` independently from profile loading, supports `ARTICLE`, `VIDEO`, and `BOOK` type badges/filters, thumbnails, descriptions, dates, and localized loading/error/retry/empty states.

### Available Backend API Endpoints:
- `GET /api/creators`: Paginated listing with `search` (including skills), `category`, `skill`, `page`, and `limit` query parameters.
- `GET /api/creators/search`: Dedicated search endpoint across practitioner credentials and skills.
- `GET /api/creators/:id`: Detailed creator profile lookup by UUID (exposes both `id` and `userId`).
- `GET /api/creators/:id/content`: Creator educational resources endpoint.
- `POST /api/connections/request`, `GET /api/connections`, `PATCH /api/connections/:id`: Jatin's Connections endpoints consumed by Creator Discovery.

---

## 7. Known Limitations & Teammate Module Hand-offs

- **Page-Local Sorting**: In the directory listing, sorting by Name (A-Z) or Experience applies to the currently fetched page slice (6 items) rather than issuing a global database re-order.
- **Content Hub Backend Pending**: Anvesha Patel's Content Hub backend (`server/src/modules/content/content.service.js`) currently returns `501 NOT_IMPLEMENTED`, and `Content` lacks a foreign-key relationship to `CreatorProfile` or `User`. `GET /api/creators/:id/content` returns `{ content: [], count: 0 }`, and the Creator Content Showcase renders an empty state until real content records and creator linkage are added.
- **Connections Navigation Page Pending**: While inline `Connect` and `Accept Request` actions on creator cards and profiles use live `/api/connections/*` endpoints, the top navigation `"Connections"` link in `Navbar.jsx` points to `#` pending Jatin's dedicated Connections dashboard page.

