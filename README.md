# Ryth Core

Ryth Core is a web application with an Android build path for learning resources, creator discovery, and professional connections. It is a five-day major project (Problem Statement ID `2501010153`).

## Project scope

- **Knowledge & Content Hub (Anvesha Patel):** browse articles, videos, and books; search and filter by category and type; view resource details; manage bookmarks.
- **Creator Discovery & Profiles (Tushar Singh):** browse and search creator profiles, filter by domain/skills, and view profile details.
- **Authentication, Connections & Personalization (Jatin):** register/login, user profile and interests, connection requests, and personalized feed.

The personalized feed is currently a placeholder. See [Known gaps](#known-gaps).

## Technology

- React 18, Vite, Tailwind CSS, React Router, Axios
- Node.js, Express, Prisma ORM 7, PostgreSQL
- Capacitor 8 for Android (the repository also contains an iOS project, but iOS is not listed as a delivered project platform)

## Repository layout

```text
client/                 React/Vite application and Capacitor projects
  src/features/         auth, connections, content, creators, onboarding
  src/routes/            frontend routes
  src/services/          shared API client
server/                 Express API
  prisma/                Prisma schema, migrations, and seed data
  src/modules/           auth, users, content, creators, connections, feed
docs/                    architecture, API contracts, schema, contribution notes
```

## Prerequisites

- Node.js 22 or later is recommended for the current Capacitor 8 toolchain.
- npm
- PostgreSQL (the repository does not specify a minimum supported PostgreSQL version)
- Android Studio and Android SDK for building/running the Android app

## Local setup

From the repository root:

```bash
npm install
```

Create the server environment file and configure a PostgreSQL database, a private JWT secret, and the frontend origin:

```bash
cp server/.env.example server/.env
```

Set `DATABASE_URL`, `JWT_SECRET`, `PORT` (defaults to `5000`), and `CLIENT_URL` in `server/.env`. `CLIENT_URL` may contain comma-separated origins. The server also permits localhost and Vercel origins.

Create the client environment file:

```bash
cp client/.env.example client/.env
```

Set `VITE_API_BASE_URL` to the backend API URL, for example `http://localhost:5000/api` (the server defaults to port `5000`). When unset, the client uses `http://localhost:5001/api` on localhost and `https://ryth-core-hi4b.onrender.com/api` on other hostnames. Native Android builds must use a reachable backend URL; `localhost` on a phone refers to the phone itself. Vite embeds this setting at build time, so rebuild and resync the Android app after changing it.

From the repository root, generate the Prisma client, apply migrations to your development database, and load the included sample records:

```bash
cd server
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
cd ..
```

Only run migrations against a database you are authorized to modify. For a shared or production database, coordinate with its owner and use the deployment migration procedure.

Start the backend and frontend in separate terminals from the repository root:

```bash
npm run server:dev
npm run client:dev
```

The API health endpoint is `GET /health`. The Vite development server uses port `5173`.

## Build and Android

Build the web client from the repository root:

```bash
npm run client:build
```

To sync the built web assets with Android and open the native project:

```bash
cd client
npm run build
npx cap sync android
npm run cap:open:android
```

Android Studio is required to run the app on an emulator/device or produce a native release. The `client/android` project defines the native Android build configuration.

## Application routes

Frontend routes are defined in `client/src/routes/index.jsx`:

| Route | Purpose | Access |
| --- | --- | --- |
| `/login` | Sign in | Public |
| `/register` | Create an account | Public |
| `/` | Landing/home placeholder | Authenticated |
| `/onboarding` | User interests onboarding | Authenticated |
| `/content` | Content Hub listing, search, filters, pagination, bookmarks | Authenticated |
| `/content/:id` | Content resource details | Authenticated |
| `/creators` | Creator directory | Authenticated |
| `/creators/:id` | Creator profile | Authenticated |
| `/connections` | Connection requests and existing connections | Authenticated |

## Backend API modules

All module routes are mounted under `/api` by `server/src/server.js`:

- `/api/auth` — registration, login, and current-user authentication.
- `/api/users` — profile read/update and interest read/update operations. Profile and interest updates require authentication; `GET /api/users/interests` is public.
- `/api/content` — content listing/detail, categories, and authenticated bookmarks.
- `/api/creators` — public creator listing/search, details, and creator content endpoint.
- `/api/connections` — authenticated connection request and status operations.
- `/api/feed` — currently has no active route; the feed router is mounted, but its only route is commented out. Requests to `/api/feed` therefore do not return a feed.

See [API contracts](docs/API_CONTRACTS.md) for request/response details and [database schema](docs/DATABASE_SCHEMA.md) for the current data model.

## Content Hub notes

The Content Hub page loads records from the backend API; `client/src/features/content/data/mockContent.js` is not used by that page. It supports article, video, and book records, category and type filters, search, pagination, detail retrieval, and bookmarks. Category and content listing/detail endpoints are public; bookmark listing and changes require authentication. YouTube URLs in supported formats are embedded on the detail page; other video URLs do not get an in-page player, though the resource link remains available. Search requests are cancelled when their query or filters change, and bookmark UI state handles duplicate-save and already-removed responses.

The current content model stores a title, description, URL, type, category, and author text. It does not store a full article body or link content records to creator profiles. The detail page therefore presents the description and a link to the source. The creator profile showcase currently has no creator-attributed content to display until attribution is designed and added.

## Creator module

The creator directory and profile module is implemented in `client/src/features/creators` and `server/src/modules/creators`. Its detailed behavior and module-specific verification notes are documented in [Module 2: Creator Discovery](docs/MODULE_2_CREATOR_DISCOVERY.md).

## Known gaps

- **Personalized feed:** the controller returns `501 Not Implemented`, and the route that would call it is commented out. There is no active personalized-feed API endpoint.
- **Creator/content attribution:** content has a plain-text author and no creator foreign-key relation. The current creator content service returns an empty list, so creator profiles cannot show linked resources. Adding attribution requires an agreed data model and a forward database migration.
- **Article reading:** the app does not store or render full article text; it shows the resource description and links to the external source. Confirm whether this meets the required reader experience.
- **Deployment verification:** source code and a successful local client build do not verify production API/database configuration or Android behavior. Verify the deployed app and native device flows against the live backend.
- **Regression coverage:** the client package has no automated test script or configured frontend test runner. The Content Hub should receive repeatable automated or documented manual regression checks for listing, search, filters, details, bookmarks, and resource links.
- **Documentation alignment:** some older module documents may describe earlier implementation status. Treat the current source, migration history, and API contract as authoritative and update stale module notes as they are reviewed.

## Project documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API contracts](docs/API_CONTRACTS.md)
- [Database schema](docs/DATABASE_SCHEMA.md)
- [Contribution workflow](docs/CONTRIBUTING.md)
- [Creator Discovery module](docs/MODULE_2_CREATOR_DISCOVERY.md)

