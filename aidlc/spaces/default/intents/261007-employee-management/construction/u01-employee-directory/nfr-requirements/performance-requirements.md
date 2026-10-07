# Performance Requirements: Employee Directory (u01-employee-directory)

## 1. Targets & Latency Budgets

| ID | Category | Target | Metric / Benchmark | Verification Method |
|---|---|---|---|---|
| **NFR1.1** | API Response Time | P95 < 200ms, P99 < 500ms | GET /api/employees (Search & Paginated List) | Automated Load Tests (50 concurrent virtual users) |
| **NFR1.2** | Write Latency | P95 < 250ms | POST / PUT / DELETE /api/employees | API Integration Suite |
| **NFR1.3** | Client UI Debounce | 250ms | Real-time search input trigger delay | Vitest Component Tests |
| **NFR1.4** | Payload Size | Max 5.5MB request payload | HTTP Request Body with Base64 Avatar | Middleware Payload Enforcement Tests |

---

## 2. Resource Constraints & Optimization Strategy

- **Database Queries**: Search queries use indexed `ILIKE` on `full_name` and `position` with standard integer index on `employee_teams.team_id`.
- **Pagination Overhead**: Strict limit capping (default 12 for grid, 25 for table, max 100) to prevent unbounded memory consumption.
- **Client Rendering**: Solid card DOM rendering without heavy GPU filters or canvas processing to ensure 60fps scrolling on standard enterprise hardware.

