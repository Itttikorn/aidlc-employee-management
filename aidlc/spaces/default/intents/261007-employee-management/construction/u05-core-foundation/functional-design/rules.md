# Business & Technical Rules — Unit U05 (u05-core-foundation)

## Sources
- Stories: `stories.md` (user-stories) — US5.1, US5.2
- Requirements: `requirements.md` (requirements-analysis) — FR-5.1, FR-5.2, FR-5.3
- Contracts: `contract-summary.md` (contract-design)
- Team Practices: `team-practices.md` (practices-discovery)

---

## 1. Machine-Readable Rules Specification

```yaml
rules:
  - id: BR5.1
    statement: All relational database tables and foreign key constraints must be created idempotently on system startup.
    category: validation
    applies_to: DatabaseMigrationRunner
    trigger: Application server bootstrap
    logic: >
      IF migration files exist in migrations directory
      THEN execute DDL statements sequentially in a single transaction and record executed filenames in migrations table.
    violation_behaviour: Server startup aborts with fatal error log if DDL migration fails.
    source: FR-5.1, US5.1, AC5.1.1

  - id: BR5.2
    statement: All card containers and UI views must use solid opaque styling with crisp high-contrast borders and zero glassmorphism.
    category: constraint
    applies_to: DesignTokenSystem
    trigger: UI component rendering
    logic: >
      IF rendering a card, panel, modal, or dropdown container
      THEN background must be solid opaque (#1e293b dark / #ffffff light) with 1px border (#334155 dark / #e2e8f0 light) and no backdrop-blur filters.
    violation_behaviour: Rejected during visual regression and styling verification.
    source: FR-5.3, US5.2, AC5.2.1

  - id: BR5.3
    statement: All REST API errors must be mapped to standardized HTTP status codes and uniform JSON error envelopes.
    category: policy
    applies_to: ErrorHandlingMiddleware
    trigger: Uncaught exception in route handler
    logic: >
      IF an error is thrown in any API controller
      THEN map to ApiError with appropriate HTTP status (400, 404, 409, 500) and return { success: false, error: { code, message, details } }.
    violation_behaviour: Middleware prevents unhandled stack trace leaks to client.
    source: FR-5.2, US5.1

  - id: BR5.4
    statement: Multi-table write operations must execute within an isolated ACID transaction and rollback automatically on failure.
    category: policy
    applies_to: TransactionManager
    trigger: Multi-table data modification
    logic: >
      IF executing transactional unit of work
      THEN execute queries inside BEGIN/COMMIT block; IF any statement throws THEN execute ROLLBACK and release connection to pool.
    violation_behaviour: Database state remains unmodified if any step fails.
    source: FR-5.1, NFR-2
```

---

## 2. Business Rules Summary

| Rule ID | Rule Statement | Category | Source | Enforced By |
|---|---|---|---|---|
| **BR5.1** | Idempotent schema migration & foreign key setup | Validation | US5.1 (AC5.1.1) | Migration Runner |
| **BR5.2** | Solid opaque card styling & zero glassmorphism | Constraint | US5.2 (AC5.2.1) | CSS / Tailwind Theme Config |
| **BR5.3** | Standardized JSON REST error envelope | Policy | US5.1 | Global Error Middleware |
| **BR5.4** | ACID transaction isolation and automatic rollback | Policy | FR-5.1, NFR-2 | Database Helper (`withTransaction`) |
