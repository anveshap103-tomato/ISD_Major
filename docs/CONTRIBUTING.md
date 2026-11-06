# Contribution & Team Workflow Guidelines — Ryth Core

> **Sprint Duration**: 5-Day University Major Project  
> **Problem Statement ID**: 2501010153

---

## 1. Team Responsibilities & Ownership Matrix

| Member | Domain & Ownership | Client Module (`client/src/features/`) | Server Module (`server/src/modules/`) |
| :--- | :--- | :--- | :--- |
| **Anvesha Patel** | Knowledge & Content Hub | `features/content/` | `modules/content/` |
| **Tushar Singh** | Creator Discovery & Profiles | `features/creators/` | `modules/creators/` |
| **Jatin** | Auth, Connections & Feed | `features/connections/` | `modules/auth/`, `modules/connections/`, `modules/feed/` |

---

## 2. Git Workflow & Branching Strategy

To maintain velocity during the 5-day build without code conflicts:

### Branch Naming Conventions:
- Main branch: `main` (production-ready code only)
- Integration branch: `develop` (staging branch for merges)
- Feature branches: `feat/<domain>-<short-description>`
  - Example: `feat/content-article-card` (Anvesha)
  - Example: `feat/creators-search-filter` (Tushar)
  - Example: `feat/auth-jwt-flow` (Jatin)
- Bug fixes: `fix/<issue-description>`

### Commit Message Convention:
Follow the Conventional Commits format:
- `feat(content): add book filtering component`
- `feat(creators): implement search API endpoint`
- `feat(auth): add JWT verification middleware`
- `fix(connections): resolve duplicate connection request issue`
- `docs: update API contracts for feed response`

---

## 3. Module Development Isolation Rules

1. **Feature Directory Boundary**:
   - Only edit files inside your designated module folder in `client/src/features/<module>` and `server/src/modules/<module>`.
2. **Shared Code Modifications**:
   - If changes are needed in `client/src/components/common` or `server/src/middlewares`, coordinate with the team before merging.
3. **Database Schema Updates**:
   - When modifying `server/prisma/schema.prisma`, discuss changes with the team first to prevent migration collisions. Run `npx prisma format` before committing.
4. **Environment Variables**:
   - Never commit `.env` files. If a new variable is needed, add a sanitized key-value pair to `.env.example`.

---

## 4. 5-Day Sprint Milestone Plan

- **Day 1**: Project Initialization, Database migrations setup, Base layouts & Auth flow.
- **Day 2**: Content Hub listing (Anvesha) & Creator Profile directories (Tushar).
- **Day 3**: Networking / Connection Request system & Personalized feed algorithm (Jatin).
- **Day 4**: Android Capacitor integration, end-to-end integration testing, polish UI/UX.
- **Day 5**: Final demo preparation, documentation review, and project submission.

