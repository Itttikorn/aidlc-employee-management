# Security Test Instructions — Employee Management System

## 1. Security Scope & Compliance

### 1.1 Policy & PDPA Controls (NFR-SEC-01)
- **Input Sanitization & Injection Prevention**: Parameterized PostgreSQL queries across all repository layers preventing SQL injection.
- **Payload Bound Checks**: Strict 5MB request body ceiling preventing Denial of Service (DoS) memory exhaust via large Base64 strings.
- **PII & Data Protection**: Sensitive internal exception details suppressed in production environments via centralized error middleware.

## 2. Security Test Execution

### 2.1 Automated Security & Validation Tests
```bash
npx vitest run tests/validators/ tests/middleware/errorHandler.test.ts
```

### 2.2 Static Code Analysis & Dependency Audit
```bash
npm audit
```

