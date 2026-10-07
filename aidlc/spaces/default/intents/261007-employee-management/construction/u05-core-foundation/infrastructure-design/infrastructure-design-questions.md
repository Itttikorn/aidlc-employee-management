# Infrastructure Design Questions — Unit U05 (u05-core-foundation)

These questions define the CI/CD pipeline automation, test automation stages, and local runtime orchestration for the System Foundation.

---

### Question 1: CI/CD Pipeline Automation & Quality Gates
What pipeline stages and quality gates should be automated for local and CI environments?
- A. **4-Stage Pipeline** — Linting & Typecheck (`npm run lint`, `tsc --noEmit`) &rarr; Automated Unit & API Integration Tests (`npm test`) &rarr; Frontend & Backend Build Packaging (`npm run build`) &rarr; Local/Preview Runtime Bootstrap
- B. Build packaging only without automated test execution
- C. Other (please specify)
[Answer]: A

---

### Question 2: Local Container & Database Runtime Strategy
How should PostgreSQL be provisioned and managed for local development and integration testing?
- A. **Docker Compose with Healthcheck Verification** — `docker-compose.yml` defining PostgreSQL 16 on standard port 5432 with health check probe, coupled with standard fallback for local native PostgreSQL service
- B. Cloud-only hosted database
- C. Other (please specify)
[Answer]: A

---

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?
- Looks correct
- Request changes

[Answer]: Looks correct
