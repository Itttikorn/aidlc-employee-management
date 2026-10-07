# Logical Component Inventory: Employee Directory (u01-employee-directory)

## 1. Component Boundaries & Responsibilities

```mermaid
flowchart TD
    subgraph UI ["Frontend Web SPA"]
        DirView["EmployeeDirectoryView"]
        CardComp["EmployeeCard (Solid Container)"]
        TableComp["EmployeeTable"]
        FormModal["EmployeeFormModal"]
    end

    subgraph API ["Express Server Layer"]
        Router["EmployeeRouter (/api/employees)"]
        Validator["Zod Validation Middleware"]
        Controller["EmployeeController"]
    end

    subgraph Domain ["Business & Data Layer"]
        Service["EmployeeService"]
        TxMgr["TransactionManager (u05)"]
        Repo["EmployeeRepository"]
    end

    subgraph DB ["Database"]
        PG[("PostgreSQL")]
    end

    DirView --> Router
    FormModal --> Router
    Router --> Validator --> Controller --> Service --> TxMgr --> Repo --> PG
```

---

## 2. Component Inventory & Blast Radius

| Component | Layer | Scope & Responsibilities | Failure Domain & Blast Radius |
|---|---|---|---|
| `EmployeeController` | API | HTTP parsing, query parameters, status mapping | Isolated to `/api/employees` endpoints |
| `EmployeeService` | Domain | Multi-table orchestration, business logic | Internal domain layer; isolated to personnel mutations |
| `EmployeeRepository` | Data Access | Parameterized SQL queries, connection pool usage | Database query boundary; transient DB errors handled via TxMgr |
| `EmployeeDirectoryView` | Presentation | Search debounce, view mode toggle, state management | Client SPA view; rendering errors captured by React ErrorBoundary |

