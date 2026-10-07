# CI Pipeline Configuration & Automation

## Overview & Architecture
The Continuous Integration (CI) pipeline for the Employee Management System provides automated verification across linting, static typechecking, database migrations, comprehensive unit/integration test suites with coverage thresholds, and production build artifact validation.

## Workflow Triggers & Environments
- **Pipeline Runner**: GitHub Actions (`.github/workflows/ci.yml`)
- **Runtime Environment**: Ubuntu Latest (`ubuntu-latest`) with Node.js 20.x and npm caching.
- **Trigger Events**:
  - `push` to branches: `main`, `master`
  - `pull_request` to branches: `main`, `master`

## Job Definitions

### 1. Code Quality & Typecheck (`lint-and-typecheck`)
- **Purpose**: Verify TypeScript compilation and type safety without emitting build files.
- **Commands**:
  ```bash
  npm ci
  npm run typecheck # tsc --noEmit
  ```
- **Success Criteria**: Zero type errors across all application and test TypeScript files.

### 2. Automated Tests & Coverage Gate (`test-and-coverage`)
- **Purpose**: Spin up ephemeral PostgreSQL 16 service container, execute database migrations, and run the test suite with coverage enforcement.
- **Services**:
  - PostgreSQL 16 Alpine container with healthchecks enabled (`pg_isready`).
- **Environment Configuration**:
  ```bash
  DATABASE_URL: postgres://postgres:postgrespassword@localhost:5432/employee_management_test
  NODE_ENV: test
  PORT: 3000
  ```
- **Commands**:
  ```bash
  npm ci
  npm run migrate
  npm run test:coverage # vitest run --coverage
  ```
- **Success Criteria**: 100% test pass rate (all 67 tests passing) and code coverage exceeding the 80% line coverage threshold.

### 3. Production Build Verification (`build`)
- **Purpose**: Ensure clean transpilation of TypeScript source code into production-ready ES modules in `dist/`.
- **Dependencies**: Depends on both `lint-and-typecheck` and `test-and-coverage`.
- **Commands**:
  ```bash
  npm ci
  npm run build # tsc
  test -f dist/server.js
  ```
- **Success Criteria**: Clean exit code 0 and presence of `dist/server.js`.

## Dependency & Artifact Management
- **Lockfile Integrity**: `npm ci` enforces clean, reproducible installs from `package-lock.json`.
- **Cache Strategy**: GitHub Actions `cache: 'npm'` caches `~/.npm` across workflow runs based on package lockfile hash.

