# Scalability Requirements: Employee Directory (u01-employee-directory)

## 1. Capacity & Load Targets

| ID | Parameter | Design Target | Scaling Strategy | Verification |
|---|---|---|---|---|
| **NFR1.5** | Personnel Record Capacity | Up to 10,000 active employee records | B-Tree indexing on `id`, `full_name`, `position` | Query Execution Plan Analysis (`EXPLAIN ANALYZE`) |
| **NFR1.6** | Concurrency Baseline | 50 concurrent active directory users | PostgreSQL connection pool sizing (10-20 pool connections) | Concurrent Vitest / Supertest Stress Suite |
| **NFR1.7** | Team Membership Scalability | Up to 50 team memberships per employee | Indexed foreign keys on `employee_teams(employee_id, team_id)` | Many-to-many join benchmark tests |

---

## 2. Growth Projections & Data Volume

- Initial MVP volume: ~50-500 employees.
- Data footprint: ~200KB per employee record including Base64 avatar data (~100MB total database footprint at 500 employees).
- Read/Write ratio: ~95% Reads (Directory search, roster lookups) vs ~5% Writes (Profile updates, new hires).

