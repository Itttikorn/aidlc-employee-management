# System Contract & Interface Specification

## Sources
- Unit Definitions: `unit-of-work.md` (units-generation)
- Unit Dependencies: `unit-of-work-dependency.md` (units-generation)
- Domain Components: `components.md` (domain-design)
- Requirements: `requirements.md` (requirements-analysis)
- Team Practices: `team-practices.md` (practices-discovery)

---

## 1. Contracts Overview

| # | Provider Unit | Consumer | Mechanism | Owner |
|---|---|---|---|---|
| **CTR-01** | `u01-employee-directory` | External: Web SPA Client | HTTP / REST (OpenAPI 3.1) | `u01-employee-directory` |
| **CTR-02** | `u02-team-rosters` | External: Web SPA Client | HTTP / REST (OpenAPI 3.1) | `u02-team-rosters` |
| **CTR-03** | `u03-task-board` | External: Web SPA Client | HTTP / REST (OpenAPI 3.1) | `u03-task-board` |
| **CTR-04** | `u04-dashboard-analytics` | External: Web SPA Client | HTTP / REST (OpenAPI 3.1) | `u04-dashboard-analytics` |
| **CTR-05** | `u05-core-foundation` | All Units (`u01`-`u04`) | TypeScript Library / Schema | `u05-core-foundation` |

---

## 2. OpenAPI 3.1 REST API Specification

```yaml
openapi: 3.1.0
info:
  title: Employee Management System REST API
  version: 1.0.0
  description: Public client API contracts for Employee Directory, Team Rosters, 3-Stage Task Management, and Executive Analytics.
servers:
  - url: http://localhost:3000/api
    description: Local development / preview server

paths:
  # ---------------------------------------------------------------------------
  # CTR-01: Employee Directory Endpoints (u01-employee-directory)
  # ---------------------------------------------------------------------------
  /employees:
    get:
      summary: List all employees with search and team filtering
      operationId: listEmployees
      parameters:
        - name: search
          in: query
          description: Search text matching name or position
          schema:
            type: string
        - name: teamId
          in: query
          description: Filter employees by assigned team ID
          schema:
            type: integer
      responses:
        '200':
          description: Successfully retrieved employee list
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: true }
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/EmployeeProfile'

    post:
      summary: Create a new employee profile
      operationId: createEmployee
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/CreateEmployeeInput'
      responses:
        '201':
          description: Employee successfully created
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: true }
                  data:
                    $ref: '#/components/schemas/EmployeeProfile'
        '400':
          $ref: '#/components/responses/ValidationError'

  /employees/{id}:
    get:
      summary: Get employee profile by ID
      operationId: getEmployeeById
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: true }
                  data: { $ref: '#/components/schemas/EmployeeProfile' }
        '404':
          $ref: '#/components/responses/NotFoundError'

    put:
      summary: Update employee profile
      operationId: updateEmployee
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/UpdateEmployeeInput'
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: true }
                  data: { $ref: '#/components/schemas/EmployeeProfile' }
        '400':
          $ref: '#/components/responses/ValidationError'
        '404':
          $ref: '#/components/responses/NotFoundError'

    delete:
      summary: Delete employee profile
      operationId: deleteEmployee
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: true }
                  message: { type: string, example: "Employee deleted successfully" }
        '404':
          $ref: '#/components/responses/NotFoundError'

  # ---------------------------------------------------------------------------
  # CTR-02: Team Roster Endpoints (u02-team-rosters)
  # ---------------------------------------------------------------------------
  /teams:
    get:
      summary: List all functional teams with member summaries
      operationId: listTeams
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: true }
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/TeamDetail'
    post:
      summary: Create a new functional team
      operationId: createTeam
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateTeamInput'
      responses:
        '201':
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: true }
                  data: { $ref: '#/components/schemas/TeamDetail' }

  /teams/{id}:
    get:
      summary: Get team details with full member roster
      operationId: getTeamById
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: true }
                  data: { $ref: '#/components/schemas/TeamDetail' }

    put:
      summary: Update team definition
      operationId: updateTeam
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateTeamInput'
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: true }
                  data: { $ref: '#/components/schemas/TeamDetail' }

    delete:
      summary: Delete or archive a team
      operationId: deleteTeam
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: true }
                  message: { type: string, example: "Team deleted successfully" }

  /teams/{id}/members:
    post:
      summary: Assign an employee to a team (Many-to-Many)
      operationId: addTeamMember
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [employeeId]
              properties:
                employeeId: { type: integer }
      responses:
        '201':
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: true }
                  message: { type: string, example: "Member assigned to team" }

  /teams/{id}/members/{employeeId}:
    delete:
      summary: Remove an employee from a team
      operationId: removeTeamMember
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
        - name: employeeId
          in: path
          required: true
          schema: { type: integer }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: true }
                  message: { type: string, example: "Member unassigned from team" }

  # ---------------------------------------------------------------------------
  # CTR-03: Task Board Endpoints (u03-task-board)
  # ---------------------------------------------------------------------------
  /tasks:
    get:
      summary: List tasks with optional team filtering
      operationId: listTasks
      parameters:
        - name: teamId
          in: query
          schema: { type: integer }
        - name: status
          in: query
          schema: { type: string, enum: [Todo, Pending, Completed] }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: true }
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/TaskItem'

    post:
      summary: Create a new task assigned to a team
      operationId: createTask
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateTaskInput'
      responses:
        '201':
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: true }
                  data: { $ref: '#/components/schemas/TaskItem' }

  /tasks/{id}/status:
    patch:
      summary: Transition task status across strict 3-stage lifecycle
      operationId: updateTaskStatus
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [status]
              properties:
                status:
                  type: string
                  enum: [Todo, Pending, Completed]
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: true }
                  data: { $ref: '#/components/schemas/TaskItem' }
        '400':
          $ref: '#/components/responses/ValidationError'

  /tasks/{id}:
    delete:
      summary: Delete a task
      operationId: deleteTask
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: true }
                  message: { type: string, example: "Task deleted successfully" }

  # ---------------------------------------------------------------------------
  # CTR-04: Executive Analytics Endpoints (u04-dashboard-analytics)
  # ---------------------------------------------------------------------------
  /dashboard/stats:
    get:
      summary: Retrieve aggregated executive KPI metrics, stage distributions, and workload
      operationId: getDashboardStats
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: true }
                  data:
                    $ref: '#/components/schemas/DashboardAnalyticsSummary'

components:
  schemas:
    EmployeeProfile:
      type: object
      required: [id, fullName, position, age, avatarUrl, createdAt]
      properties:
        id: { type: integer, example: 1 }
        fullName: { type: string, example: "Sarah Connor" }
        position: { type: string, example: "Senior Backend Architect" }
        age: { type: integer, minimum: 18, example: 34 }
        avatarUrl: { type: string, example: "/uploads/avatars/sarah-connor.png" }
        teams:
          type: array
          items:
            type: object
            properties:
              id: { type: integer }
              name: { type: string }
        createdAt: { type: string, format: date-time }
        updatedAt: { type: string, format: date-time }

    CreateEmployeeInput:
      type: object
      required: [fullName, position, age]
      properties:
        fullName: { type: string, minLength: 2 }
        position: { type: string, minLength: 2 }
        age: { type: integer, minimum: 18 }
        avatar: { type: string, format: binary, description: "Optional photo upload" }
        teamIds: { type: array, items: { type: integer } }

    UpdateEmployeeInput:
      type: object
      properties:
        fullName: { type: string }
        position: { type: string }
        age: { type: integer, minimum: 18 }
        avatar: { type: string, format: binary }
        teamIds: { type: array, items: { type: integer } }

    TeamDetail:
      type: object
      required: [id, name, description, memberCount]
      properties:
        id: { type: integer, example: 10 }
        name: { type: string, example: "Core Engineering" }
        description: { type: string, example: "Platform infrastructure and core services" }
        memberCount: { type: integer, example: 12 }
        members:
          type: array
          items:
            $ref: '#/components/schemas/EmployeeProfile'

    CreateTeamInput:
      type: object
      required: [name]
      properties:
        name: { type: string, minLength: 2 }
        description: { type: string }

    TaskItem:
      type: object
      required: [id, title, teamId, priority, status, createdAt]
      properties:
        id: { type: integer, example: 101 }
        title: { type: string, example: "Migrate auth service to JWT" }
        description: { type: string, example: "Update token verification middleware" }
        teamId: { type: integer, example: 10 }
        teamName: { type: string, example: "Core Engineering" }
        priority: { type: string, enum: [Low, Medium, High], example: "High" }
        status: { type: string, enum: [Todo, Pending, Completed], example: "Todo" }
        createdAt: { type: string, format: date-time }
        updatedAt: { type: string, format: date-time }

    CreateTaskInput:
      type: object
      required: [title, teamId, priority]
      properties:
        title: { type: string, minLength: 3 }
        description: { type: string }
        teamId: { type: integer }
        priority: { type: string, enum: [Low, Medium, High] }

    DashboardAnalyticsSummary:
      type: object
      required: [totalEmployees, activeTeams, totalTasks, completionRate, taskDistribution, teamWorkloads]
      properties:
        totalEmployees: { type: integer, example: 42 }
        activeTeams: { type: integer, example: 6 }
        totalTasks: { type: integer, example: 85 }
        completionRate: { type: number, format: float, example: 68.2 }
        taskDistribution:
          type: object
          properties:
            todo: { type: integer, example: 24 }
            pending: { type: integer, example: 18 }
            completed: { type: integer, example: 43 }
        teamWorkloads:
          type: array
          items:
            type: object
            properties:
              teamId: { type: integer }
              teamName: { type: string }
              taskCount: { type: integer }
              memberCount: { type: integer }

  responses:
    ValidationError:
      description: Invalid request payload
      content:
        application/json:
          schema:
            type: object
            properties:
              success: { type: boolean, example: false }
              error:
                type: object
                properties:
                  code: { type: string, example: "VALIDATION_FAILED" }
                  message: { type: string, example: "Age must be a positive integer" }
                  details: { type: array, items: { type: string } }

    NotFoundError:
      description: Requested entity not found
      content:
        application/json:
          schema:
            type: object
            properties:
              success: { type: boolean, example: false }
              error:
                type: object
                properties:
                  code: { type: string, example: "NOT_FOUND" }
                  message: { type: string, example: "Entity with given ID does not exist" }
```

---

## 3. Shared Database Relational Schema Contract (CTR-05)

```yaml
schema:
  tables:
    - name: employees
      columns:
        - name: id
          type: SERIAL PRIMARY KEY
        - name: full_name
          type: VARCHAR(255) NOT NULL
        - name: position
          type: VARCHAR(255) NOT NULL
        - name: age
          type: INTEGER NOT NULL CHECK (age > 0)
        - name: avatar_url
          type: VARCHAR(1024)
        - name: created_at
          type: TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        - name: updated_at
          type: TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP

    - name: teams
      columns:
        - name: id
          type: SERIAL PRIMARY KEY
        - name: name
          type: VARCHAR(255) NOT NULL UNIQUE
        - name: description
          type: TEXT
        - name: created_at
          type: TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        - name: updated_at
          type: TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP

    - name: employee_teams
      columns:
        - name: id
          type: SERIAL PRIMARY KEY
        - name: employee_id
          type: INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE
        - name: team_id
          type: INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE
        - name: assigned_at
          type: TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      constraints:
        - name: unique_employee_team
          type: UNIQUE (employee_id, team_id)

    - name: tasks
      columns:
        - name: id
          type: SERIAL PRIMARY KEY
        - name: title
          type: VARCHAR(255) NOT NULL
        - name: description
          type: TEXT
        - name: team_id
          type: INTEGER NOT NULL REFERENCES teams(id) ON DELETE RESTRICT
        - name: priority
          type: VARCHAR(50) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High'))
        - name: status
          type: VARCHAR(50) NOT NULL CHECK (status IN ('Todo', 'Pending', 'Completed'))
        - name: created_at
          type: TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        - name: updated_at
          type: TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
```

---

## 4. Contract Ownership Rules

1. **Spec Ownership**:
   - `u01-employee-directory` owns all `/api/employees` endpoints and `employees` table schema.
   - `u02-team-rosters` owns all `/api/teams` endpoints and `teams` & `employee_teams` schemas.
   - `u03-task-board` owns all `/api/tasks` endpoints and `tasks` table schema.
   - `u04-dashboard-analytics` owns all `/api/dashboard` analytics endpoints.
   - `u05-core-foundation` owns database pooling, transaction handling, error envelopes, and design tokens.
2. **Backward Compatibility & Additive Changes**:
   - All REST response payloads use non-breaking additive fields. Consumers ignore unrecognized fields.
3. **Breaking Change Protocol**:
   - Any schema modifications to shared foreign keys require updating `u05-core-foundation` migration scripts and dependent unit repository tests before merging.

---

## 5. Open Questions

| Contract | Question | Blocks |
|---|---|---|
| None | All endpoint paths, HTTP methods, payloads, and relational constraints are fully defined. | None |
