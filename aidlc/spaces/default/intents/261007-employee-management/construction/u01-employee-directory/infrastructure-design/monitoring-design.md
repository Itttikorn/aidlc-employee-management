# Monitoring & Observability Design — u01-employee-directory

## 1. Observability Architecture

### 1.1 Health Checks & Readiness Probes
The server exposes structured health endpoints for load balancer and runtime monitoring:
- `GET /health/live`: Returns `200 OK` (`{"status":"UP"}`) confirming event loop responsiveness.
- `GET /health/ready`: Checks PostgreSQL database connection via `SELECT 1`. Returns `200 OK` (`{"status":"READY","db":"UP"}`) if reachable, or `503 Service Unavailable` if database connectivity fails.

### 1.2 Structured Logging
- **Log Format**: JSON formatted logs in production; colorized pretty print in local development.
- **Log Fields**:
  - `timestamp`: ISO-8601 UTC timestamp.
  - `level`: `INFO`, `WARN`, `ERROR`, `DEBUG`.
  - `requestId`: Correlation ID per HTTP request (`X-Request-ID`).
  - `method`, `url`, `statusCode`, `responseTimeMs`: HTTP access metadata.
  - `error`: Error message and sanitized stack trace (redacting PII).

## 2. Metrics & Telemetry

### 2.1 Key Performance Indicators
- **Request Latency**: P50, P95, P99 response time for `/api/employees` listing, search, and mutations. Target: P95 < 200ms.
- **Error Rates**: 4xx and 5xx response ratios. Alert threshold: 5xx > 1% over 5m window.
- **Database Pool Utilization**: Active vs idle client connections, connection acquisition wait time.

