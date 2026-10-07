# NFR Requirements Questions — u02-team-rosters

## Focus: Non-Functional Requirements for Team Rosters

### Q1: Performance & Indexing
What database indexing strategy should be enforced for team roster queries?
- A. B-tree indexes on `teams.department`, `teams.name`, and composite index on `employee_teams(team_id, employee_id)` (Recommended)
- B. Primary key indexes only
- C. Other (please specify)

[Answer]:A

---

### Q2: Referential Integrity & Transactions
How should multi-entity operations (such as assigning multiple members or deleting teams) be isolated?
- A. Strict PostgreSQL ACID transactions (`BEGIN`/`COMMIT`/`ROLLBACK`) via `withTransaction` helper (Recommended)
- B. Sequential unbundled SQL executions
- C. Other (please specify)

[Answer]:A

---

## Consolidated Summary Confirmation

- Looks correct
- Request changes

[Answer]: Looks correct
