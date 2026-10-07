# Code Generation Plan — u01-employee-directory

## Summary

- Builds: Employee directory models, repositories, business logic service, REST API routes/controllers, and interactive UI views for directory search, filtering, and CRUD operations.
- Touches: `src/models/`, `src/types/`, `src/repositories/`, `src/services/`, `src/controllers/`, `src/routes/`, `src/client/`, `tests/`
- Tests: 25-30 automated tests across models, repositories, services, controllers, API routes, and client components verifying validation, transaction handling, search/filter, and error handling.

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

## Implementation Plan

- [ ] **Step 1: Project structure and production configuration skeleton**
  - Verify directory layout for `src/types/`, `src/models/`, `src/repositories/`, `src/services/`, `src/controllers/`, `src/routes/`, and `src/client/`.
  - [Traceability: FR-1.1, FR-1.2, FR-1.3]

- [ ] **Step 2: Bootstrap test runner configuration and verify unit-scoped command**
  - Verify Vitest configuration and ensure unit test command `npx vitest run tests/employee/` is executable.
  - [Traceability: Testing-Contract, NFR-REL-01]

- [ ] **Step 3: Data model and validation types — Implement**
  - Implement TypeScript types and Zod schemas in `src/types/employee.ts` and `src/validators/employeeValidator.ts` covering full name, position, age (18..120), Base64 avatar (<=5MB limit), and team association arrays.
  - [Traceability: US-01, AC1.1.1, AC1.1.2, BR1.1, BR1.2, BR1.3]

- [ ] **Step 4: Data model and validation types — Write and run tests**
  - Create `tests/validators/employeeValidator.test.ts` covering valid schemas, boundary age checks, string length restrictions, and avatar payload bounds (5-8 unit tests).
  - [Traceability: AC1.1.1, AC1.1.2, BR1.1, BR1.2, BR1.3]

- [ ] **Step 5: Repository & database access layer — Implement**
  - Implement `src/repositories/employeeRepository.ts` supporting paginated query with substring ILIKE matching on full name/position (BR1.4), team filtering via junction table (BR1.5), employee insertion with transactional team junction rows (BR1.6), and atomic cascading delete.
  - [Traceability: US-02, US-03, AC1.2.1, AC1.2.2, BR1.4, BR1.5, BR1.6, BR1.7]

- [ ] **Step 6: Repository & database access layer — Write and run tests**
  - Create `tests/repositories/employeeRepository.test.ts` with mocked PostgreSQL pool verifying CRUD queries, search SQL parameters, team junction transactions, and rollback behavior.
  - [Traceability: AC1.2.1, AC1.2.2, BR1.4, BR1.5, BR1.6]

- [ ] **Step 7: Business logic service layer — Implement**
  - Implement `src/services/employeeService.ts` coordinating profile creation, validation, search/filtering orchestrations, and deletion lifecycle.
  - [Traceability: US-01, US-02, US-03, FR-1.1, FR-1.2, FR-1.3]

- [ ] **Step 8: Business logic service layer — Write and run tests**
  - Create `tests/services/employeeService.test.ts` verifying service methods, error propagation, and business rule enforcement.
  - [Traceability: US-01, US-02, US-03, BR1.1, BR1.2, BR1.3, BR1.6]

- [ ] **Step 9: REST API controller & routes layer — Implement**
  - Implement `src/controllers/employeeController.ts` and `src/routes/employeeRoutes.ts` exposing `GET /api/employees`, `GET /api/employees/:id`, `POST /api/employees`, `PUT /api/employees/:id`, and `DELETE /api/employees/:id`, and mount to Express `src/app.ts`.
  - [Traceability: US-01, US-02, US-03, AC1.1.1, AC1.1.2, AC1.2.1, AC1.2.2]

- [ ] **Step 10: REST API controller & routes layer — Write and run tests**
  - Create `tests/api/employeeRoutes.test.ts` integration tests with `supertest` verifying HTTP status codes (200, 201, 400, 404, 500) and response schemas.
  - [Traceability: AC1.1.1, AC1.1.2, AC1.2.1, AC1.2.2]

- [ ] **Step 11: Frontend UI components & directory views — Implement**
  - Implement responsive HTML/JS/CSS client directory interface in `src/client/` (or static SPA) featuring solid cards with 1px contrast borders (no blur/glassmorphism), search bar with debounce, team dropdown filter, dual Grid/Table toggle, and employee creation/edit modal with explicit `data-testid` attributes.
  - [Traceability: US-01, US-02, US-03, AC1.1.1, AC1.2.1, AC1.2.2, NFR-TECH-01]

- [ ] **Step 12: Frontend UI components — Write and run tests**
  - Create `tests/client/directory.test.ts` verifying rendering, debounce search interaction, and modal form submission.
  - [Traceability: US-01, US-02, US-03]

- [ ] **Step 13: Environment, build configuration, and full suite validation**
  - Verify full unit test pass and coverage standard via `npx vitest run tests/` ensuring >=80% line coverage.
  - [Traceability: NFR-REL-01, NFR-PERF-01]

- [ ] **Step 14: Documentation, source manifest, and traceability completion**
  - Generate `code-summary.md`, `source-manifest.json`, and `traceability.json`.
  - [Traceability: All Unit 01 requirements]

