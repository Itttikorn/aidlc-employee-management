# Unit Test Instructions — u01-employee-directory

## 1. Test Framework Setup & Configuration
- **Runner**: Vitest (`vitest.config.ts`).
- **Assertion Framework**: Vitest standard assertions (`describe`, `it`, `expect`, `vi`).
- **HTTP Integration Testing**: `supertest` with Express `app`.

## 2. Unit-Scoped Execution Command
To execute the automated test suite scoped strictly to Unit 01 (`u01-employee-directory`):

```bash
npx vitest run tests/employee/ tests/validators/ tests/repositories/ tests/services/ tests/controllers/ tests/api/employeeRoutes.test.ts
```

*Note: Do not run a bare project-wide command during unit development. The command above targets only Unit 01 test specifications.*

## 3. Test Coverage & Quality Targets
- **Line Coverage Target**: >= 80% line coverage for all Unit 01 modules.
- **Volume & Strategy**: Standard Strategy (5-8 tests per component) plus integration test coverage across the REST API controller boundary.
- **Assertion Coverage**:
  - Validation: String length constraints, age bounds (18..120), Base64 avatar payload limits (<=5MB).
  - Data Access: Transactional commit/rollback on team junction rows, search SQL substring filtering, pagination counting.
  - API Routes: Status codes 200, 201, 400, 404, 500, JSON error responses adhering to error contract.

## 4. Mocking & Test Data Management
- **Database Mocking**: Use `vi.mock('../../src/config/database')` or mock `Pool` client for pure unit tests without requiring a live PostgreSQL instance.
- **Transaction Rollback Testing**: Verify that errors thrown during `employee_teams` insertion trigger `ROLLBACK` on the transactional client.
- **Sample Test Fixtures**:
  - Valid Employee: `{ fullName: "Jane Doe", position: "Software Engineer", age: 30, avatarUrl: "data:image/png;base64,iVBOR...", teamIds: [1] }`
  - Underage Employee: `{ fullName: "John Minor", position: "Intern", age: 17 }` -> Expect Validation Error (400)
  - Search query: `?search=Software&teamId=1&page=1&limit=10`

