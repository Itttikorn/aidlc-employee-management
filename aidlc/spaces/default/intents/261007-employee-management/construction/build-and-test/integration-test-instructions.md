# Integration Test Instructions — Employee Management System

## 1. Test Scope & Architecture

### 1.1 Boundaries Covered
- **HTTP REST Endpoints**: Express routing, request validation, error formatting, and HTTP status codes (`GET /api/employees`, `POST /api/employees`, `GET /api/employees/:id`, `PUT /api/employees/:id`, `DELETE /api/employees/:id`).
- **Database Transactions**: PostgreSQL transaction handling (`withTransaction`), commit/rollback mechanics, and referential cascade deletions.
- **Diagnostics & Health**: `/health` and `/api/health` system probes.

## 2. Test Execution Commands

### 2.1 Running Full Test Suite
```bash
npm test
```

### 2.2 Scoped Integration Tests
```bash
npx vitest run tests/api/
```

### 2.3 Coverage Verification
```bash
npm run test:coverage
```

