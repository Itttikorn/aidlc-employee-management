# Performance & Reliability Requirements — Unit 02 (Team Rosters)

## Performance Thresholds (NFR-PERF-01 to 03)
- **Response Latency**: `GET /api/teams` roster list with aggregated member counts and avatars must complete in $< 100\text{ms}$ for up to 500 teams and 2,000 employees.
- **Join Query Optimization**: Use optimized SQL `LEFT JOIN` and `JSON_AGG` queries to fetch teams and their member rosters in a single query execution rather than N+1 queries.
- **Database Indexing**: Enforce index on `teams.department`, index on `teams.name`, and composite index on `employee_teams(team_id, employee_id)`.

## Reliability & Fault Tolerance (NFR-REL-01 to 03)
- **Atomic Membership Management**: Assigning members, changing roles, and removing teams must execute inside ACID transactions via `withTransaction`.
- **Idempotency**: Adding an existing member with the same role returns clean success without duplicate rows.
- **Connection Resilience**: Connection drops during batch operations must trigger immediate rollback and release the client back to the pool.
