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

## 6. Creator Discovery Module (Day 2 Status)

The **Creator Discovery** module (`/creators`) is fully database-backed and integrated with PostgreSQL via Prisma ORM 7.

### Features Implemented:
- **Directory Listing (`/creators`)**: Displays verified domain practitioners with role, organization, location, bio, and top skills.
- **Search & Debouncing**: Case-insensitive 350ms debounced search querying across creator names, professional titles, organizations, and skills.
- **Domain Category Filtering**: Fast pill filters for `Cloud & DevOps`, `AI & Machine Learning`, `Frontend & Design`, `Backend & Systems`, `Cybersecurity`, and `Product & Tech Leadership`.
- **Database Pagination**: Efficient database `take`/`skip` pagination with total count and page indicators.
- **Detailed Profiles (`/creators/:id`)**: Rich profile views keyed by PostgreSQL UUID, displaying comprehensive biographies, verified social links, experience history, and honors/certifications.
- **Resilient UI States**: Skeleton loading placeholders, graceful error handling with retry actions, 404 not found views, and race condition protection.

### Available Backend API Endpoints:
- `GET /api/creators`: Paginated listing with `search`, `category`, `skill`, `page`, and `limit` query parameters.
- `GET /api/creators/search`: Dedicated auto-complete/search endpoint across practitioner credentials and skills.
- `GET /api/creators/:id`: Detailed creator profile lookup by UUID.
- `GET /api/creators/:id/content`: Associated educational resources authored by the creator.

---

## 7. Known Limitations & Teammate Module Hand-offs

- **Page-Local Sorting**: In the directory listing, sorting by Name (A-Z) or Experience applies to the currently fetched page slice (6 items) rather than issuing a global database re-order.
- **Content Module Hand-off**: `GET /api/creators/:id/content` currently returns an empty collection `{ content: [], count: 0 }` until Anvesha Patel's Content Hub module is integrated.
- **Connections Module Hand-off**: Connection request and messaging buttons trigger client-side callbacks; backend graph connections will connect once Jatin's Connections module is merged.

