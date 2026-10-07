# Infrastructure Design Questions — u01-employee-directory

## Focus: Infrastructure Specifications & CI/CD Pipeline for Employee Directory

### Q1: Deployment & Runtime Environment Model
What deployment and compute topology should be specified for the Employee Directory service?
- A. Standard Node.js Express server process running via `tsx` (dev) / compiled `dist/server.js` (production), container-ready with standard environment configuration (`DATABASE_URL`, `PORT`, `NODE_ENV`) (Recommended)
- B. AWS Lambda serverless function behind API Gateway with Serverless Express wrapper
- C. Docker Compose multi-container stack with Nginx reverse proxy and PostgreSQL container
- X. Other (please specify)

[Answer]: A

---

### Q2: CI/CD Pipeline & Branch Promotion Strategy
What automated CI validation and promotion workflow should be established for Unit 01?
- A. Tiered branch workflow (`feature/(feature_name)` -> `staging` -> `dev` -> `main`) with automated CI pipeline executing linting (`eslint`), TypeScript type-check (`tsc`), and full Vitest automated test suite (`npm test`) on each pull request (Recommended)
- B. Single branch deployment directly to production upon commit to `main`
- C. Manual test verification with script-based deployment trigger
- X. Other (please specify)

[Answer]: A

---

### Q3: Database Schema Migration Strategy
How should PostgreSQL database schema migrations be executed across environments?
- A. Automatic transactional schema migration on server startup (`src/db/migrate.ts`), with CLI migration script option (`npm run migrate`) for pre-deploy CI pipelines (Recommended)
- B. Manual execution of raw SQL scripts by database administrator
- C. External ORM schema sync tool during build
- X. Other (please specify)

[Answer]: B

---

## Consolidated Summary Confirmation
- **Deployment Topology**: Standard Node.js Express server process (`tsx` in dev, `dist/server.js` in production), container-ready with standard environment configuration (`DATABASE_URL`, `PORT`, `NODE_ENV`).
- **CI/CD Pipeline & Promotion**: Tiered branch workflow (`feature/*` -> `staging` -> `dev` -> `main`) with automated CI pipeline executing linting (`eslint`), type-checking (`tsc`), and Vitest automated test suite (`npm test`).
- **Database Migrations**: Manual execution of raw SQL scripts by database administrator across target environments.

[Answer]: Looks correct
