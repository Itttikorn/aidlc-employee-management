# Unit Test Instructions — Unit 05 (Core Foundation)

## Test Framework Setup & Configuration

- **Framework**: Vitest (v1.6+) with TypeScript support.
- **Assertion Library**: Vitest built-in assertions (`expect`, `describe`, `it`, `beforeEach`, `afterEach`, `vi`).
- **Configuration File**: `vitest.config.ts` in workspace root.
- **Coverage Tool**: `@vitest/coverage-v8` with minimum 80% line and branch coverage threshold.

## Unit Test Execution Command

To run tests specifically scoped to Unit 05 (Core Foundation):

```bash
npx vitest run tests/u05-core-foundation
```

Or run all foundation test suites individually:

```bash
npx vitest run tests/config/database.test.ts tests/db/migrate.test.ts tests/utils/transaction.test.ts tests/utils/errors.test.ts tests/middleware/errorHandler.test.ts tests/api/health.test.ts
```

## Test Suites & Coverage Targets

### 1. Database Configuration Suite (`tests/config/database.test.ts`)
- **Target**: `src/config/database.ts`
- **Tests**:
  - Pool initialization with environment variables (host, port, user, password, database).
  - Health check function returns true on successful database ping (`SELECT 1`).
  - Health check returns false and logs error on query failure.
  - Pool close function terminates active client connections cleanly.
  - Custom query execution helper wraps `pool.query` correctly with parameters.

### 2. Migration Runner Suite (`tests/db/migrate.test.ts`)
- **Target**: `src/db/migrate.ts`
- **Tests**:
  - Creates `schema_migrations` tracking table if not already present.
  - Reads SQL migration files in correct sequential order.
  - Executes unapplied migrations within a database transaction.
  - Records applied migration version into `schema_migrations`.
  - Skips already applied migrations (idempotent execution).
  - Rolls back transaction and reports error when migration script fails.

### 3. Transaction Manager Suite (`tests/utils/transaction.test.ts`)
- **Target**: `src/utils/transaction.ts`
- **Tests**:
  - Acquires client from pool and executes `BEGIN`.
  - Commits transaction and releases client on successful callback execution.
  - Issues `ROLLBACK` and releases client when callback throws an exception.
  - Propagates original error back to the caller.

### 4. Custom Error Hierarchy Suite (`tests/utils/errors.test.ts`)
- **Target**: `src/utils/errors.ts`
- **Tests**:
  - `AppError` correctly sets HTTP status code, operational flag, and message.
  - `NotFoundError` defaults to 404.
  - `ValidationError` defaults to 400 and captures validation details/field errors.
  - `ConflictError` defaults to 409.
  - `DatabaseError` defaults to 500.

### 5. Error Handler Middleware Suite (`tests/middleware/errorHandler.test.ts`)
- **Target**: `src/middleware/errorHandler.ts`
- **Tests**:
  - Catches `AppError` subclasses and sends matching HTTP status and JSON response.
  - Catches unhandled standard errors and sends 500 status with generic message in production.
  - Sanitizes sensitive database details and stack traces in non-development environments.
  - Logs structured error details including request path, method, and correlation ID.

### 6. Health API Suite (`tests/api/health.test.ts`)
- **Target**: `src/app.ts` (`GET /health`)
- **Tests**:
  - Returns HTTP 200 and status `healthy` with uptime and timestamp.
  - Returns HTTP 503 and status `degraded` if database connection fails.

## Mocking & Stubbing Guidance

- Use `vi.mock('pg')` to mock `Pool` and `PoolClient` for isolated unit tests without requiring a live PostgreSQL instance.
- For integration testing with Docker PostgreSQL, set `DATABASE_URL` in `.env.test`.
- Mock file system calls (`fs.readdir`, `fs.readFile`) in migration unit tests to test error handling cleanly.
