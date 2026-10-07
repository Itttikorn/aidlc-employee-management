# Scalability Design: Employee Directory (u01-employee-directory)

## 1. Data Scaling & Query Partitioning

- **Indexing Strategy**:
  - `CREATE INDEX idx_employees_name ON employees(full_name);`
  - `CREATE INDEX idx_employees_position ON employees(position);`
  - `CREATE INDEX idx_employee_teams_emp ON employee_teams(employee_id);`
  - `CREATE INDEX idx_employee_teams_team ON employee_teams(team_id);`
- **Stateless Application Layer**: The Express API layer retains zero in-memory session state, allowing horizontal process clustering (via PM2 or container instances) behind a reverse proxy.

---

## 2. Capacity & Threshold Triggers

| Parameter | Normal Threshold | Scale Trigger | Remediation Action |
|---|---|---|---|
| Pool Utilization | < 70% | > 80% for 60s | Increase max pool connections up to database limit |
| P95 Latency | < 200ms | > 400ms | Check for table vacuuming, analyze query execution plan |
| Memory Usage | < 256MB | > 512MB | Inspect for uncollected large Base64 buffers |

