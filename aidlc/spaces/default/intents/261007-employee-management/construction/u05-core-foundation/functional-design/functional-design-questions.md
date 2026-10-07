# Functional Design Questions — Unit U05 (u05-core-foundation)

These questions define the functional behavior, database connection lifecycle, migration runner semantics, error handling envelopes, and design token integration for the System Foundation.

---

### Question 1: Database Migration Runner & Bootstrap Semantics
How should the DDL schema migrations for `employees`, `teams`, `employee_teams`, and `tasks` be executed and tracked?
- A. **Versioned SQL Migration Files with Auto-Execution on Startup** — Sequential SQL files (`001_create_schema.sql`) executed automatically via a lightweight migration helper on server start, creating tables and foreign key indices idempotently (`CREATE TABLE IF NOT EXISTS`)
- B. Manual database setup via external DBA scripts
- C. Other (please specify)
[Answer]: A

---

### Question 2: Centralized Error Handling & Exception Normalization
How should unexpected runtime exceptions and validation errors be normalized across API routes?
- A. **Custom `ApiError` Class & Global Express Error Middleware** — Express error handler catches all thrown `ApiError` instances, logs structured metadata, and returns standard HTTP envelopes (`{ success: false, error: { code, message, details } }`)
- B. Per-route ad-hoc `try/catch` blocks formatting custom JSON objects
- C. Other (please specify)
[Answer]: A

---

### Question 3: Global Design Token Architecture & CSS Tokens
How should the high-contrast solid card tokens be structured for application-wide consumption?
- A. **Tailwind CSS Configuration & CSS Custom Properties** — Defined in `tailwind.config.js` and global CSS with clear high-contrast tokens (`surface-card`, `border-card-contrast`, `text-primary`, `text-secondary`, zero blur filters) supporting seamless dark and light mode switching
- B. Inline hardcoded style strings inside React components
- C. Other (please specify)
[Answer]: A

---

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?
- Looks correct
- Request changes

[Answer]: Looks correct
