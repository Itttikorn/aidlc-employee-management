# NFR Requirements Questions — Unit U05 (u05-core-foundation)

These questions define the tech stack selections, security controls, SQL injection mitigations, and performance targets for the System Foundation.

---

### Question 1: Technology Stack Selection & Library Foundations
What technology stack best fulfills our type safety, PostgreSQL integration, and test automation requirements?
- A. **Node.js LTS + TypeScript + Express + `pg` (node-postgres) + React SPA + Tailwind CSS + Vitest/Supertest** — Strict TypeScript typings across backend and frontend, parameterized SQL queries, and lightweight fast test execution
- B. Python FastAPI + SQLAlchemy + React
- C. Other (please specify)
[Answer]: A

---

### Question 2: Security Controls & SQL Injection Prevention
What security baseline should be enforced within the database client and API layer?
- A. **Parameterized Queries Only + Input Sanitization + Helmet Security Headers + CORS Restriction** — 100% parameterized SQL query templates to eliminate SQL injection; helmet middleware for secure HTTP headers; strict CORS origin limits
- B. Basic query formatting without parameterized SQL templates
- C. Other (please specify)
[Answer]: A

---

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?
- Looks correct
- Request changes

[Answer]: Looks correct
