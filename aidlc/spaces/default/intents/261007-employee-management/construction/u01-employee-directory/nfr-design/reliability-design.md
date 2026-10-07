# Reliability & Resilience Design: Employee Directory (u01-employee-directory)

## 1. Transaction Safety & Cascade Resilience

```mermaid
sequenceDiagram
    participant Svc as EmployeeService
    participant Tx as TransactionManager
    participant DB as PostgreSQL Client

    Svc->>Tx: withTransaction(async (client) => ...)
    Tx->>DB: BEGIN
    alt Operation 1: Insert Employee Success
        Tx->>DB: INSERT INTO employees ...
        alt Operation 2: Insert Teams Success
            Tx->>DB: INSERT INTO employee_teams ...
            Tx->>DB: COMMIT
            Tx-->>Svc: Return Committed Employee
        else Operation 2 Fails (FK Violation / DB Error)
            Tx->>DB: ROLLBACK
            Tx-->>Svc: Throw DatabaseError
        end
    else Operation 1 Fails
        Tx->>DB: ROLLBACK
        Tx-->>Svc: Throw DatabaseError
    end
```

---

## 2. Health Monitoring & Graceful Degradation

- **Database Health Check**: `/api/health` queries `SELECT 1` with a 2-second timeout to verify database connectivity.
- **Graceful Shutdown**: On `SIGTERM` / `SIGINT`, server stops accepting new connections, waits for in-flight requests to complete (timeout 5s), and closes PostgreSQL pool cleanly.

