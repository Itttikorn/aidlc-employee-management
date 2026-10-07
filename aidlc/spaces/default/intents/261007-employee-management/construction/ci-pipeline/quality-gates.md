# CI Quality Gates & Policy Enforcement

## Quality Gate Summary
The Employee Management System enforces automated quality gates at every push and pull request. Code merges are blocked unless all gates pass unconditionally.

## Gate Criteria

### Gate 1: Type Safety & Compilation
- **Requirement**: No TypeScript errors under strict mode (`tsconfig.json`).
- **Enforcement Command**: `npm run typecheck` (`tsc --noEmit`).
- **Tolerance**: 0 errors allowed.

### Gate 2: Database Migration Integrity
- **Requirement**: Database migrations must apply cleanly to an empty PostgreSQL database instance.
- **Enforcement Command**: `npm run migrate`.
- **Validation**:
  - `001_initial_schema.sql` establishes baseline schema.
  - `002_employee_directory_enhancements.sql` ensures `birthdate DATE` dynamic age structure, column aliases, and indexes.
- **Tolerance**: Zero migration errors, transactional rollback verified on failure.

### Gate 3: Automated Test Execution
- **Requirement**: Complete unit, integration, and API test suites must execute and pass.
- **Enforcement Command**: `npm test` / `npm run test:coverage`.
- **Current Baseline**: 67 tests passing across 10 test suites in under 2 seconds.
- **Tolerance**: Zero test failures or unhandled promise rejections.

### Gate 4: Code Coverage Threshold
- **Requirement**: Code line and branch coverage must exceed MVP quality thresholds.
- **Enforcement Tool**: `@vitest/coverage-v8` (`vitest run --coverage`).
- **Thresholds**:
  - Minimum Lines: $\ge 80\%$ (Current: $96.16\%$)
  - Minimum Statements: $\ge 80\%$ (Current: $96.16\%$)
  - Minimum Functions: $\ge 80\%$ (Current: $97.22\%$)
  - Minimum Branches: $\ge 75\%$ (Current: $84.09\%$)

### Gate 5: Production Build Artifacts
- **Requirement**: TypeScript codebase must compile cleanly to ES modules in `dist/`.
- **Enforcement Command**: `npm run build && test -f dist/server.js`.
- **Tolerance**: Clean exit code 0, entrypoint `dist/server.js` generated.

## Remediation & Override Policy
- **Failed Quality Gate**: Pull request cannot be merged. Developer must resolve type errors, fix failing tests, or add missing tests before re-running CI.
- **Overrides**: Strictly prohibited for security and data integrity constraints.

