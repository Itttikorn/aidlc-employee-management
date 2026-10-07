## Summary

- Builds: Core backend infrastructure, database pooling, transaction manager, migration engine, error handling middleware, Express application bootstrap, and base Tailwind CSS design system setup for Unit 05 (Core Foundation).
- Touches: `package.json`, `tsconfig.json`, `docker-compose.yml`, `src/config/database.ts`, `src/db/migrate.ts`, `migrations/001_create_schema.sql`, `src/utils/transaction.ts`, `src/utils/errors.ts`, `src/utils/logger.ts`, `src/middleware/errorHandler.ts`, `src/app.ts`, `src/server.ts`, `tailwind.config.js`, `postcss.config.js`, `src/styles/theme.css`, `vitest.config.ts`, and test files under `tests/`.
- Tests: 18 unit & integration tests covering database pooling, migration parsing & execution, transaction lifecycle (commit & rollback), error handling middleware & custom AppError hierarchy, and server health check endpoint.

## Testing Contract

```json
{
  "version": 1,
  "methodology": "test-after",
  "source": "team",
  "ordering": "Implement each feature layer (data access, API endpoint, UI component), then author and execute that layer's test suite to verify functionality and contract satisfaction.",
  "scope": "mvp",
  "test_strategy": "standard",
  "project_type": "greenfield",
  "applicable_notes": [
    {
      "layer": "org",
      "text": "We treat tests as a first-class deliverable in every Bolt. The specific\nmethodology (TDD, BDD, ATDD, or classic test-after) is affirmed at\npractices-discovery and recorded in `team.md` under this heading with explicit\n`Methodology` and `Ordering` fields; Code Generation resolves those fields\nindependently from coverage, tooling, and scope notes.\n\nWhen no posture has been affirmed, our default per scope is:\n- **Methodology**: test-after\n- **Ordering**: implement each applicable testable layer, then write and run\n  that layer's tests.\n- `mvp`, `enterprise`, `feature`, `infra`, `classic` add an 80% line-coverage\n  floor and CI execution before merge.\n- `bugfix`, `security-patch` add a targeted regression for the specific\n  bug/vulnerability and require the existing suite to remain green.\n- `express` uses the Minimal strategy: requirement-driven unit tests (one per\n  requirement, with a happy-path floor per component); existing tests remain\n  green.\n- `poc`, `refactor`, `workshop` add no extra new-test floor and require the\n  existing suite to remain green.\n\nThe active `Test Strategy` still applies in every scope and determines test\nvolume/types. Scope floors are additive; they never reduce or replace the\nselected strategy.\n\nBuild and Test verifies defined coverage floors and affirmed quality targets;\nthey may not be weakened to make a step pass.\n\nAffirm a stricter posture in `team.md` if the team commits to one."
    },
    {
      "layer": "team",
      "text": "We treat automated testing as a mandatory deliverable for all business logic and API endpoints.\n- **Methodology**: test-after\n- **Ordering**: Implement each feature layer (data access, API endpoint, UI component), then author and execute that layer's test suite to verify functionality and contract satisfaction.\n- Test coverage standard: Unit tests for state management, entity models, validation rules, and integration tests for REST API endpoints."
    }
  ],
  "obligations": {
    "strategy": "standard",
    "strategy_volume": [
      "Five to eight tests per component.",
      "Unit tests plus integration tests for key boundaries.",
      "Add E2E, performance, or security tests when requirements demand them."
    ],
    "scope_floor": [
      "Meet an 80% line-coverage floor.",
      "Run the selected tests in CI before merge."
    ],
    "combination_rule": "Apply every selected-strategy obligation and every scope-floor obligation; neither replaces the other, and a targeted scope regression may add the narrowest necessary test type beyond the strategy default."
  },
  "plan_profile": {
    "methodology": "test-after",
    "runner_step": "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
    "runner_ready_before_first_test": true,
    "testable_layers": [
      "Data model / database behavior",
      "Repository / data access",
      "Business logic",
      "API / endpoint",
      "Frontend behavior"
    ],
    "steps": [
      "Project structure and production configuration skeleton.",
      "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
      "Data model / database behavior - implement.",
      "Data model / database behavior - write and run its tests after implementation.",
      "Repository / data access - implement.",
      "Repository / data access - write and run its tests after implementation.",
      "Business logic - implement.",
      "Business logic - write and run its tests after implementation.",
      "API / endpoint - implement.",
      "API / endpoint - write and run its tests after implementation.",
      "Frontend behavior - implement.",
      "Frontend behavior - write and run its tests after implementation.",
      "Environment/build configuration.",
      "Documentation and traceability."
    ]
  },
  "input_sha256": "sha256:6581e38cd63cc20d6554961066751ca69c81250df4f83f2c66925e0a1a659356",
  "contract_sha256": "sha256:fd3403273c63310d3b9185acb515a5057de00acc8f26284d9f5dc30617ac2759"
}
```

## Detailed Execution Steps

### Step 1: Project Structure and Production Configuration Skeleton
- Initialize Node.js TypeScript project environment (`package.json`, `tsconfig.json`, `.env.example`, `.gitignore`).
- Configure scripts for build, start, dev, test, and database migrations.
- [Traceability: FR-1, FR-2, NFR-SEC-1]

### Step 2: Bootstrap Test Runner and Unit Scoped Test Configuration
- Configure Vitest (`vitest.config.ts`) with coverage thresholds (80% minimum floor), TypeScript path aliases, and mock utilities.
- Record exact unit test execution command (`npx vitest run tests/u05-core-foundation`).
- [Traceability: NFR-MAINT-1, NFR-REL-1]

### Step 3: Data Model & Database Behavior - Implementation
- Create database configuration module (`src/config/database.ts`) with PostgreSQL client connection pooling, health checks, and retry mechanisms.
- Create database migration script (`src/db/migrate.ts`) and initial schema migration (`migrations/001_create_schema.sql`) establishing `employees`, `teams`, `employee_teams`, and `tasks` tables with proper indexes, triggers for `updated_at`, and foreign keys with cascading integrity.
- [Traceability: ENT-001, ENT-002, ENT-003, ENT-004, BR1.1, BR1.2]

### Step 4: Data Model & Database Behavior - Tests
- Author tests in `tests/config/database.test.ts` and `tests/db/migrate.test.ts` verifying connection pool instantiation, query execution, error handling on pool failures, and migration execution/idempotency.
- Execute unit test suite to verify data layer tests pass.
- [Traceability: ENT-001, ENT-002, ENT-003, ENT-004]

### Step 5: Data Access & Transaction Utilities - Implementation
- Implement transaction manager helper (`src/utils/transaction.ts`) providing `withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T>` supporting atomic operations, auto-rollback on failure, and automatic client release.
- Implement standard custom error hierarchy (`src/utils/errors.ts`) with `AppError`, `NotFoundError`, `ValidationError`, `ConflictError`, `DatabaseError`.
- Implement structured logger utility (`src/utils/logger.ts`).
- [Traceability: NFR-SEC-2, NFR-REL-1, BR2.1]

### Step 6: Data Access & Transaction Utilities - Tests
- Author tests in `tests/utils/transaction.test.ts` and `tests/utils/errors.test.ts` verifying commit on success, rollback on error, client release in all cases, and error serialization.
- Execute tests to verify passing state.
- [Traceability: NFR-SEC-2, NFR-REL-1]

### Step 7: API & Middleware Layer - Implementation
- Implement central Express application (`src/app.ts`) and server entrypoint (`src/server.ts`).
- Implement error handling middleware (`src/middleware/errorHandler.ts`) with structured JSON error responses, PDPA-safe message masking in production, and standard HTTP status codes.
- Implement health check endpoint (`GET /health` and `GET /api/health`) reporting system and database connection status.
- [Traceability: FR-1, NFR-SEC-1, NFR-SEC-2]

### Step 8: API & Middleware Layer - Tests
- Author integration tests in `tests/middleware/errorHandler.test.ts` and `tests/api/health.test.ts` validating error capture, status codes, sanitization of stack traces, and health check output.
- Execute tests to verify green state.
- [Traceability: FR-1, NFR-SEC-1]

### Step 9: Frontend Design System & Theme Styling - Implementation
- Configure Tailwind CSS (`tailwind.config.js`, `postcss.config.js`) and base theme stylesheet (`src/styles/theme.css`).
- Enforce strict solid card tokens, crisp high-contrast borders, custom brand color palette, and strictly ZERO glassmorphism / background blur filters.
- [Traceability: FR-1, FR-2, NFR-UI-1]

### Step 10: Environment, Docker & Documentation
- Author `docker-compose.yml` for local PostgreSQL 16 instance.
- Author `README.md` and documentation on setting up local environment and running tests.
- Produce `code-summary.md`, `source-manifest.json`, and `traceability.json`.
- [Traceability: FR-1, FR-2, NFR-SEC-1, NFR-SEC-2, NFR-REL-1, NFR-MAINT-1]
