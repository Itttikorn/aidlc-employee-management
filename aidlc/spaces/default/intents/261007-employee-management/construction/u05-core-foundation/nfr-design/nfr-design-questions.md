# NFR Design Questions — Unit U05 (u05-core-foundation)

These questions define the technical security architectures, connection pool sizing, and logical library components for the System Foundation.

---

### Question 1: Database Connection Pool Sizing & Lifecycle Design
What pool sizing and connection timeout parameters should be configured for the PostgreSQL client?
- A. **`max: 20` Connections, 30s Idle Timeout, 2s Connection Timeout** — Optimized for local development, test runners, and standard web traffic with connection retry logic
- B. Single persistent connection without connection pooling
- C. Other (please specify)
[Answer]: A

---

### Question 2: Security Middleware Architecture
What modular middleware pipeline should be structured in `u05-core-foundation`?
- A. **Layered Middleware Stack** — `helmet()` (security headers) &rarr; `cors()` (origin whitelist) &rarr; `express.json({ limit: '10mb' })` (body limit) &rarr; request logger &rarr; routes &rarr; `errorHandler`
- B. Route handlers without global security middleware
- C. Other (please specify)
[Answer]: A

---

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?
- Looks correct
- Request changes

[Answer]: Looks correct
