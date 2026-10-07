# Scalability & Observability Requirements — Unit 02 (Team Rosters)

## Scalability Invariants
- **Multi-Tenant / Multi-Department Support**: Support flexible departmental categorization (`Engineering`, `Design`, `Product`, `Marketing`, `Sales`, `Executive`).
- **Connection Pool Sizing**: Maintain standard 20-connection pool sizing with graceful queueing for high concurrent reads.

## Observability & Audit
- **Structured Audit Logging**: Emit structured JSON logs with correlation IDs for team creation, member additions, role changes, and deletions:
  - `TeamCreated`: `{ teamId, name, department, leadId }`
  - `TeamMemberAdded`: `{ teamId, employeeId, role }`
  - `TeamMemberRemoved`: `{ teamId, employeeId }`
  - `TeamDeleted`: `{ teamId, unlinkedMemberCount }`
- **Error Tracking**: Log all 4xx/5xx team failures with context (e.g. `teamId`, `userId`, `errorStack`).
