# NFR Requirements Questions — u01-employee-directory

## Focus: Non-Functional Requirements for Employee Directory

### Q1: API Latency & Query Performance Targets
What are the latency targets and query performance budgets for the Employee Directory API endpoints?
- A. P95 latency < 200ms for paginated search/filter queries, P99 < 500ms under 50 concurrent requests, client-side debounce of 250ms on search input (Recommended)
- B. Strict P95 latency < 50ms with database read replicas and aggressive in-memory caching
- C. P95 latency < 1000ms (standard best-effort for internal enterprise tool)
- X. Other (please specify)

[Answer]: A

---

### Q2: Security, PDPA & Data Sanitization Stance
How should data protection, input sanitization, and PDPA compliance be enforced for employee records?
- A. Enforce strict server-side Zod input sanitization (strip HTML/scripts to prevent XSS), enforce 5MB Base64 payload limit, and ensure PII data is accessible only via authorized internal endpoints without public exposure (Recommended)
- B. Field-level AES-256 database column encryption for full_name and avatar data
- C. Basic framework default escaping only
- X. Other (please specify)

[Answer]: A

---

### Q3: Observability, Error Tracking & Logging Standard
What logging standard and error tracking granularity should be established for Unit 01 operations?
- A. Structured JSON logging (timestamp, level, correlationId, endpoint, executionTimeMs), masking sensitive PII in log messages, with centralized error middleware capturing operational failures (Recommended)
- B. Plain text stdout console logging with standard Apache combined log format
- C. OpenTelemetry distributed tracing spans with Prometheus metrics exporter
- X. Other (please specify)

[Answer]: A

---

## Consolidated Summary Confirmation

- Looks correct
- Request changes

[Answer]: Looks correct

