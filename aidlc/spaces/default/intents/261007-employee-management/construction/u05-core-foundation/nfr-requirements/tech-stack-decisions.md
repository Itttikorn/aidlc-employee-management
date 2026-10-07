# Technology Stack Decisions — Unit U05 (u05-core-foundation)

## Sources
- Stories: `stories.md` (user-stories) — US5.1, US5.2
- Requirements: `requirements.md` (requirements-analysis) — FR-5.1, FR-5.2, FR-5.3, NFR-1, NFR-3
- Team Practices: `team-practices.md` (practices-discovery)

---

## 1. Selected Technology Stack

| Layer / Concern | Technology Selection | Version / Standard | Rationale |
|---|---|---|---|
| **Runtime & Language** | Node.js + TypeScript | Node >= 20.x, TS 5.x (`strict: true`) | Enforces 100% type safety and prevents unhandled `any` types across the full stack. |
| **Backend Framework** | Express.js | Express 4.x / 5.x | Battle-tested, minimal overhead, rich ecosystem for middleware (CORS, Helmet, Multer). |
| **Database & Client** | PostgreSQL + `pg` (node-postgres) | PostgreSQL 16+, `pg` 8.x | Normalized relational schema with foreign key cascades, connection pooling, and ACID transaction support. |
| **Frontend Framework** | React + Vite | React 18 / 19, Vite 5+ | Lightning-fast HMR dev server and component-based UI architecture. |
| **Design System / Styling** | Tailwind CSS | Tailwind 3.x | Solid opaque card styles (`#1e293b` / `#ffffff`), crisp 1px borders, zero glassmorphism, responsive breakpoints. |
| **Test Automation** | Vitest / Node Test Runner + Supertest | Latest | Fast in-memory unit tests and real HTTP REST API integration tests. |

---

## 2. Decision Rationale & Trade-Offs

- **Why `pg` directly instead of an ORM (Prisma/TypeORM)**:
  - Direct SQL with `pg` provides complete visibility over queries, zero abstraction overhead, instant execution of DDL migration scripts, and sub-millisecond connection pooling without heavy ORM engine overhead.
- **Why Tailwind CSS with Custom Solid Theme**:
  - Eliminates glassmorphism and background blur by declaring explicit opaque solid surface utility classes, satisfying affirmed team rules and WCAG 2.1 AA contrast requirements.
