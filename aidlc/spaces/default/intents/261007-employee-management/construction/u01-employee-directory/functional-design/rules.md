# Business Rules: Employee Directory (u01-employee-directory)

## 1. Source of Truth Business Rules

```yaml
rules:
  - id: BR1.1
    statement: Employee full name and position are mandatory and must meet minimum character length requirements.
    category: validation
    applies_to: Employee.full_name, Employee.position
    trigger: On employee creation or update request
    logic: "IF trim(full_name) is empty OR length(trim(full_name)) < 2 OR trim(position) is empty OR length(trim(position)) < 2 THEN reject request"
    violation_behavior: Return 400 Bad Request with field-level validation errors detailing invalid name or position length.
    source: FR-1.1, AC1.1.1, AC1.1.2

  - id: BR1.2
    statement: Employee age must be a positive integer within valid working age boundaries (18 to 120).
    category: validation
    applies_to: Employee.age
    trigger: On employee creation or update request
    logic: "IF age is not an integer OR age < 18 OR age > 120 THEN reject request"
    violation_behavior: Return 400 Bad Request with error message stating age must be an integer between 18 and 120.
    source: FR-1.1, AC1.1.1, AC1.1.2

  - id: BR1.3
    statement: Avatar data must be a valid image URL or Base64 data URI string within 5MB payload limit.
    category: validation
    applies_to: Employee.avatar_url
    trigger: On avatar upload or profile save
    logic: "IF avatar_url is provided AND (length(avatar_url) > 5242880 OR NOT (avatar_url matches valid URL or data:image/ URI)) THEN reject request; ELSE IF avatar_url is omitted THEN set default avatar placeholder"
    violation_behavior: Return 400 Bad Request with invalid image format or payload exceeded error.
    source: FR-1.1, FR-1.4, AC1.1.1

  - id: BR1.4
    statement: Text search query filters employee directory by case-insensitive substring match across name and position.
    category: policy
    applies_to: Employee Directory Query
    trigger: On GET /api/employees with 'search' parameter
    logic: "IF search query parameter 'q' is provided THEN filter employees WHERE full_name ILIKE ('%' || q || '%') OR position ILIKE ('%' || q || '%')"
    violation_behavior: N/A (Yields matching subset or empty result set)
    source: FR-1.3, AC1.2.1

  - id: BR1.5
    statement: Team filter restricts employee list to individuals assigned to the specified team ID.
    category: policy
    applies_to: Employee Directory Query
    trigger: On GET /api/employees with 'teamId' parameter
    logic: "IF teamId query parameter is provided THEN join employee_teams WHERE employee_teams.team_id = teamId"
    violation_behavior: N/A (Yields team members subset or empty result set)
    source: FR-1.3, AC1.2.2

  - id: BR1.6
    statement: Hard deletion of an employee cascades to remove all associated team memberships in employee_teams within a single atomic transaction.
    category: constraint
    applies_to: Employee Deletion Workflow
    trigger: On DELETE /api/employees/:id
    logic: "IF employee exists THEN within transaction DELETE FROM employee_teams WHERE employee_id = :id; DELETE FROM employees WHERE id = :id; ELSE return 404 Not Found"
    violation_behavior: Return 404 Not Found if employee ID does not exist; return 500 on transaction failure and rollback.
    source: FR-1.2, NFR-2

  - id: BR1.7
    statement: Directory listing supports deterministic pagination with configurable page size and total count metadata.
    category: calculation
    applies_to: Employee Directory Query
    trigger: On GET /api/employees with pagination parameters
    logic: "IF limit and page parameters are provided THEN apply LIMIT limit OFFSET (page - 1) * limit; return data array along with total count, current page, and totalPages"
    violation_behavior: Default to page=1, limit=12 for grid view or limit=25 for table view if parameters invalid or omitted.
    source: FR-1.3, NFR-1
```

---

## 2. Business Rules Summary

| Rule ID | Statement | Category | Trigger | Source |
|---|---|---|---|---|
| **BR1.1** | Name & Position validation (min 2 chars, non-empty) | Validation | Create / Update | FR-1.1, AC1.1.1, AC1.1.2 |
| **BR1.2** | Age validation (integer between 18 and 120) | Validation | Create / Update | FR-1.1, AC1.1.1, AC1.1.2 |
| **BR1.3** | Avatar image format & payload constraint (max 5MB) | Validation | Avatar upload | FR-1.1, FR-1.4, AC1.1.1 |
| **BR1.4** | Real-time case-insensitive search by name & position | Policy | Search query | FR-1.3, AC1.2.1 |
| **BR1.5** | Team filter matching via junction table | Policy | Team filter | FR-1.3, AC1.2.2 |
| **BR1.6** | Transactional cascade delete for employee memberships | Constraint | Employee delete | FR-1.2, NFR-2 |
| **BR1.7** | Server-side pagination and count metadata calculation | Calculation | Directory list | FR-1.3, NFR-1 |

