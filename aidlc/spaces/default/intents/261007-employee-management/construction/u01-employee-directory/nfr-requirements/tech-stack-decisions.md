# Technology Stack Decisions: Employee Directory (u01-employee-directory)

## 1. Technology Selections & Architectural Rationale

| Layer | Technology Choice | Version / Library | Rationale |
|---|---|---|---|
| **Runtime & Language** | Node.js + TypeScript | Node >= 20, TS 5.5 | Type safety across entire entity model and API boundary; zero unhandled `any`. |
| **HTTP Framework** | Express.js | Express 4.19 | Established enterprise framework with robust middleware ecosystem and error handling. |
| **Database Driver & Pool** | PostgreSQL (`pg`) | pg 8.12 | Native PostgreSQL connection pooling with parameterization and transaction support. |
| **Validation Layer** | Zod | Zod 3.23 | Schema validation for employee creation/update inputs and query parameter parsing. |
| **Testing Framework** | Vitest + Supertest | Vitest 1.6, Supertest 7.0 | Fast in-memory unit and REST endpoint integration testing. |
| **Styling & UI Tokens** | Tailwind CSS | Tailwind 3.4 | Utility-first styling with high-contrast, crisp 1px borders and strictly NO glassmorphism. |

---

## 2. Decision Log

- **ADR-01 (Database Persistence)**: Adopt PostgreSQL relational persistence with foreign keys rather than document NoSQL to guarantee relational integrity between employees, teams, and tasks.
- **ADR-02 (Avatar Storage)**: Use Base64 data strings for profile photos directly in database for simple portable deployment without external S3/blob dependencies.
- **ADR-03 (UI Design Tokens)**: Mandate solid opaque cards with clear borders across all views to satisfy team rules against glassmorphism and low contrast.

