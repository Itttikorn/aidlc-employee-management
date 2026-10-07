# Performance Test Instructions — Employee Management System

## 1. Objectives & Metrics

### 1.1 Target Benchmarks (NFR-PERF-01)
- **Directory Search Latency**: P95 response time < 200ms for employee search and filtering queries under 100 concurrent requests.
- **Payload Limits**: 5MB maximum request body size limit enforcing memory bounds on Base64 image ingestion.

## 2. Benchmark Execution Procedure

### 2.1 Local Benchmark Execution
Run lightweight load verification via `autocannon` or `k6`:
```bash
npx autocannon -c 50 -d 10 http://localhost:3000/api/employees
```

### 2.2 Latency Verification
Inspect response latency metrics in test results to ensure P95 < 200ms threshold compliance.

