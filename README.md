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

## 5. Getting Started

### Prerequisites
- Node.js (v18.x or later)
- PostgreSQL (running locally or via cloud provider)
- npm or yarn

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd RythCore
   ```

2. **Install dependencies:**
   ```bash
   # From the root directory:
   npm install --workspace=client
   npm install --workspace=server
   ```

3. **Configure Environment Variables:**
   - Copy `.env.example` in `server/` to `server/.env` and update `DATABASE_URL` and `JWT_SECRET`.
   - Copy `.env.example` in `client/` to `client/.env` and configure `VITE_API_BASE_URL`.

4. **Initialize Prisma Database:**
   ```bash
   cd server
   npx prisma generate
   npx prisma db push
   ```

5. **Run Development Servers:**
   - Client: `npm run client:dev` (runs on http://localhost:5173)
   - Server: `npm run server:dev` (runs on http://localhost:5000)

