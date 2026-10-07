# Functional Specification: Employee Directory (u01-employee-directory)

## 1. Domain Overview & Responsibilities

Unit `u01-employee-directory` provides the personnel directory and profile management subsystem for the Employee Management System. It manages the lifecycle of employee records, validates demographic data according to enterprise and regulatory policies (PDPA), processes profile photos as Base64/URL assets, and delivers responsive search, team filtering, and dual-mode directory browsing (Card Grid and Table views).

---

## 2. Entity-Relationship Model (Derived View)

```mermaid
erDiagram
    EMPLOYEE ||--o{ EMPLOYEE_TEAM : "belongs to"
    TEAM ||--o{ EMPLOYEE_TEAM : "has members"

    EMPLOYEE {
        int id PK
        string full_name "NOT NULL"
        string position "NOT NULL"
        int age "CHECK(age >= 18 AND age <= 120)"
        string avatar_url "Base64 or URL"
        timestamp created_at
        timestamp updated_at
    }

    EMPLOYEE_TEAM {
        int id PK
        int employee_id FK "REFERENCES employees(id) ON DELETE CASCADE"
        int team_id FK "REFERENCES teams(id) ON DELETE CASCADE"
        timestamp assigned_at
    }

    TEAM {
        int id PK
        string name "NOT NULL UNIQUE"
        string description
        timestamp created_at
        timestamp updated_at
    }
```

---

## 3. Workflows & State Machines

### 3.1 Use Case UC-01: Create Employee Profile
**Actor**: HR Administrator / Team Lead
**Trigger**: User clicks "Add Employee" button, fills in profile form modal, and submits.

```mermaid
sequenceDiagram
    autonumber
    actor User as HR Administrator
    participant UI as Frontend SPA (Modal)
    participant API as Employee Controller
    participant Svc as Employee Service
    participant DB as PostgreSQL Database

    User->>UI: Fills Full Name, Position, Age, selects Avatar & Teams
    User->>UI: Clicks "Save Employee"
    UI->>UI: Run client-side Zod validation (BR1.1, BR1.2, BR1.3)
    alt Client Validation Fails
        UI-->>User: Display immediate red border & field error text
    else Client Validation Passes
        UI->>API: POST /api/employees (JSON payload)
        API->>API: Execute server-side schema validation (BR1.1, BR1.2, BR1.3)
        alt Server Validation Fails
            API-->>UI: 400 Bad Request ({ success: false, error: ... })
            UI-->>User: Display server validation error banner
        else Server Validation Passes
            API->>Svc: createEmployee(dto)
            Svc->>DB: BEGIN TRANSACTION
            Svc->>DB: INSERT INTO employees (full_name, position, age, avatar_url) VALUES (...) RETURNING id
            loop For each assigned teamId
                Svc->>DB: INSERT INTO employee_teams (employee_id, team_id) VALUES (...)
            end
            Svc->>DB: COMMIT
            Svc-->>API: Created Employee Profile with Teams
            API-->>UI: 201 Created ({ success: true, data: employeeProfile })
            UI->>UI: Close modal, refresh directory list with new record
            UI-->>User: Display green success toast notification
        end
    end
```

#### Step Sequence:
1. **Input Submission**: Client submits `fullName`, `position`, `age`, optional `avatarUrl` (Base64 string), and optional array of `teamIds`.
2. **Validation**: Validates name length (≥2 chars), position (≥2 chars), age (18..120), and avatar data size (≤5MB).
3. **Atomic Persistence**: Begins database transaction, inserts row into `employees` table, creates junction rows in `employee_teams` for all supplied `teamIds`, and commits transaction.
4. **Response**: Returns normalized `EmployeeProfile` including resolved team objects.

---

### 3.2 Use Case UC-02: Search & Filter Directory
**Actor**: Any User
**Trigger**: User types search keyword into the search input or selects a team from the filter dropdown.

```mermaid
sequenceDiagram
    autonumber
    actor User as Directory Browser
    participant UI as Directory View
    participant API as Employee Controller
    participant DB as PostgreSQL Database

    User->>UI: Types "Architect" in search input (debounce 250ms)
    UI->>API: GET /api/employees?search=Architect&teamId=10&page=1&limit=12
    API->>DB: SELECT e.*, json_agg(t.*) FROM employees e LEFT JOIN employee_teams et ON e.id = et.employee_id LEFT JOIN teams t ON et.team_id = t.id WHERE (e.full_name ILIKE '%Architect%' OR e.position ILIKE '%Architect%') AND (et.team_id = 10) GROUP BY e.id LIMIT 12 OFFSET 0
    DB-->>API: Row set + Total matching count
    API-->>UI: 200 OK ({ success: true, data: employees[], pagination: { total, page, totalPages } })
    UI->>UI: Render solid cards (no blur, 1px border) with matching tags
    UI-->>User: Display filtered employee cards
```

#### Step Sequence:
1. **Query Formulation**: Extracts `search`, `teamId`, `page`, and `limit` query parameters from the request.
2. **Query Execution**: Executes parameterized query with `ILIKE` substring search on name/position (BR1.4) and optional `team_id` filter (BR1.5).
3. **Result Aggregation**: Groups team affiliations per employee as embedded array.
4. **Response Delivery**: Returns structured payload with `data` array and pagination metadata (BR1.7).

---

### 3.3 Use Case UC-03: Delete Employee Profile
**Actor**: HR Administrator
**Trigger**: User confirms deletion on an employee card or detail modal.

#### Step Sequence:
1. **Validation & Existence Check**: Verifies employee ID exists in PostgreSQL.
2. **Transactional Removal**: Executes `DELETE FROM employee_teams WHERE employee_id = :id` followed by `DELETE FROM employees WHERE id = :id` (BR1.6).
3. **Response**: Returns `{ success: true, message: "Employee deleted successfully" }`.

---

## 4. Derived Business Rules Summary

| Rule ID | Statement | Category | Target | Source |
|---|---|---|---|---|
| **BR1.1** | Name & Position validation (min 2 chars, non-empty) | Validation | `employees.full_name`, `employees.position` | FR-1.1, AC1.1.1, AC1.1.2 |
| **BR1.2** | Age validation (integer between 18 and 120) | Validation | `employees.age` | FR-1.1, AC1.1.1, AC1.1.2 |
| **BR1.3** | Avatar image format & payload constraint (max 5MB) | Validation | `employees.avatar_url` | FR-1.1, FR-1.4, AC1.1.1 |
| **BR1.4** | Real-time case-insensitive search by name & position | Policy | Search endpoint | FR-1.3, AC1.2.1 |
| **BR1.5** | Team filter matching via junction table | Policy | Directory query | FR-1.3, AC1.2.2 |
| **BR1.6** | Transactional cascade delete for employee memberships | Constraint | Delete endpoint | FR-1.2, NFR-2 |
| **BR1.7** | Server-side pagination and count metadata calculation | Calculation | Directory list | FR-1.3, NFR-1 |

