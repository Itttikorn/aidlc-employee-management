# NFR Design Questions — u01-employee-directory

## Focus: Architectural Patterns & Design Strategies for Employee Directory

### Q1: Database Query & Connection Pooling Strategy
What query execution and connection pooling pattern should be designed for employee directory operations?
- A. Single optimized parameterized SQL query with `LEFT JOIN employee_teams` and `json_agg(teams)` with connection pool (min 2, max 10 connections, idle timeout 30s) (Recommended)
- B. Two-phase query: select employee IDs first, then batch query team affiliations in application memory
- C. ORM active-record pattern with lazy-loading team relations on access
- X. Other (please specify)

[Answer]:A

---

### Q2: Security Middleware & Header Hardening
What middleware architecture should be employed for security header injection and input sanitization?
- A. Standard Express middleware stack with Helmet for security headers (HSTS, CSP, X-Frame-Options), CORS restricted to authorized frontend origins, and Zod validator middleware for request body and query parsing (Recommended)
- B. Custom header injection functions without external security packages
- C. Reverse proxy (Nginx/CloudFront) header injection only with bare Express app
- X. Other (please specify)

[Answer]:A

---

### Q3: Correlation ID & Error Interceptor Design
How should request tracking and operational error handling be integrated across the API layer?
- A. Async request middleware generating UUIDv4 `X-Correlation-ID` (or propagating incoming header), binding to logger context for all queries, with centralized error middleware mapping domain errors (AppError, ValidationError, DatabaseError) to structured HTTP responses (Recommended)
- B. Route-level try-catch blocks with manual console.error logging
- C. Global unhandled rejection handlers without per-request correlation tokens
- X. Other (please specify)

[Answer]:A

---

## Consolidated Summary Confirmation

- Looks correct
- Request changes

[Answer]: Looks correct

