# Unit of Work Story Map & Requirement Traceability

## Sources
- User Stories: `stories.md` (user-stories)
- Requirements: `requirements.md` (requirements-analysis)
- Unit Definitions: `unit-of-work.md` (units-generation)
- Unit Dependencies: `unit-of-work-dependency.md` (units-generation)

---

## 1. Story to Unit Mapping

Every user story from `stories.md` is mapped to exactly one primary implementing Unit of Work.

| Story ID | Story Title | Unit ID | Construction Directory | Epic / Domain Focus |
|---|---|---|---|---|
| **US5.1** | PostgreSQL Persistence & REST APIs | **U05** | `u05-core-foundation` | System Foundation & Relational Schema |
| **US5.2** | Solid Card UI Design System (No Glassmorphism) | **U05** | `u05-core-foundation` | UI Theme & Design Tokens |
| **US1.1** | Create & Edit Employee Profiles | **U01** | `u01-employee-directory` | Employee Profile Management |
| **US1.2** | Search & Filter Employee Directory | **U01** | `u01-employee-directory` | Directory Search & Views |
| **US2.1** | Multi-Team Membership Assignment | **U02** | `u02-team-rosters` | Many-to-Many Team Allocation |
| **US2.2** | Team Roster & Details Management | **U02** | `u02-team-rosters` | Team CRUD & Roster Display |
| **US3.1** | Task Creation & Assignment to Teams | **U03** | `u03-task-board` | Team Task Allocation |
| **US3.2** | 3-Stage Kanban Lifecycle Transitions | **U03** | `u03-task-board` | Kanban Workflow State Machine |
| **US4.1** | Real-Time Company KPI Cards | **U04** | `u04-dashboard-analytics` | Top-Level Executive Metrics |
| **US4.2** | Task Distribution & Team Workload Visualizations | **U04** | `u04-dashboard-analytics` | Stage & Workload Aggregations |

---

## 2. Cross-Cutting Concerns

- **Data Integrity & Foreign Keys**: `U05` establishes relational integrity and cascade rules; `U02` and `U03` enforce these constraints during member assignments and task creations.
- **Design Token Compliance**: `U05` defines solid-card tokens, borders, and dark/light palettes; `U01`, `U02`, `U03`, and `U04` consume these tokens across all UI views.
- **API Error Handling**: `U05` provides centralized error handler; `U01`, `U02`, `U03`, and `U04` throw standard HTTP exceptions (400, 404, 409, 500).

---

## 3. Implementation Order Within Units

1. **U05 (`u05-core-foundation`)**:
   - Step 1: Database connection pool & transaction utilities.
   - Step 2: DDL schema migration runner for all tables.
   - Step 3: Base Express/Fastify server setup & error handling middleware.
   - Step 4: Tailwind CSS design tokens & application shell layout.
2. **U01 (`u01-employee-directory`)**:
   - Step 1: Employee data model & SQL queries.
   - Step 2: Employee CRUD REST endpoints & avatar upload handler.
   - Step 3: Directory card grid, table view, search & filter UI.
3. **U02 (`u02-team-rosters`)**:
   - Step 1: Team and `employee_teams` repository layer.
   - Step 2: Team CRUD & member assignment endpoints.
   - Step 3: Team Hub UI cards & roster management modals.
4. **U03 (`u03-task-board`)**:
   - Step 1: Task repository with team foreign keys.
   - Step 2: 3-stage status transition API (`Todo` &rarr; `Pending` &rarr; `Completed`).
   - Step 3: 3-column Kanban board UI with drag-and-drop & status actions.
5. **U04 (`u04-dashboard-analytics`)**:
   - Step 1: SQL aggregation queries for KPIs, task stages, and team workloads.
   - Step 2: Dashboard analytics API endpoint (`GET /api/dashboard/stats`).
   - Step 3: Executive Dashboard UI widgets, progress bars, and workload matrix.
