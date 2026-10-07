# Construction Delivery & Bolt Sequencing Plan

## Sources
- Requirements: `requirements.md` (requirements-analysis)
- User Stories: `stories.md` (user-stories)
- Unit of Work Definitions: `unit-of-work.md` (units-generation)
- Unit Dependency DAG: `unit-of-work-dependency.md` (units-generation)
- Story Map: `unit-of-work-story-map.md` (units-generation)
- Contract Specification: `contract-summary.md` (contract-design)
- Team Practices: `team-practices.md` (practices-discovery)

---

## 1. Bolt Sequence Overview

A **Bolt** is one planned Construction delivery slice—a pass executing one or more Units of Work through Design, Code Generation, and Build/Test with an explicit Definition of Done and Confidence Hypothesis.

| Bolt # | Name | Units Included | Walking Skeleton? | Primary Focus | Definition of Done |
|---|---|---|---|---|---|
| **Bolt 1** | System Foundation & Persistence | `U05: u05-core-foundation` | Yes (Base) | PostgreSQL connection pool, schema DDL migrations, error middleware, and high-contrast UI design tokens. | DB connection passes health checks, migration scripts execute cleanly, and base test harness runs. |
| **Bolt 2** | Employee Profile & Directory Feature | `U01: u01-employee-directory` | Yes (Integrated Slice) | Full-stack employee profile CRUD, avatar file storage, directory search, and team filter views. | REST endpoints pass unit/integration tests, form validations enforce non-empty fields and positive age, and directory renders in browser. |
| **Bolt 3** | Team Rosters & Allocations | `U02: u02-team-rosters` | No | Team CRUD, member rosters, and many-to-many allocation join table management. | Many-to-many join tests pass, team cards render member counts and avatars, and unlinking members preserves data. |
| **Bolt 4** | 3-Stage Task Management | `U03: u03-task-board` | No | Task CRUD, team assignments, and strict 3-stage Kanban FSM (`Todo` &rarr; `Pending` &rarr; `Completed`). | State transition unit tests pass, tasks enforce valid team IDs, and Kanban UI updates statuses. |
| **Bolt 5** | Executive Dashboard Analytics | `U04: u04-dashboard-analytics` | No | Real-time aggregation of organizational KPIs, task distribution, and team workload matrices. | Aggregation queries execute under 200ms, KPI cards compute correct values, and distribution charts render. |

---

## 2. Detailed Bolt Specifications

### Bolt 1: System Foundation & Persistence (`U05: u05-core-foundation`)
- **Included Units**: `U05`
- **Walking Skeleton Stance**: Walking Skeleton Foundation Base.
- **Definition of Done**:
  - PostgreSQL container configuration with automated schema migration runner (`npm run migrate`).
  - Standardized JSON REST API error handling middleware and transaction wrapper helper.
  - Global CSS tokens (Tailwind configuration with Deep Slate dark / Crisp Pearl light palettes, 1px crisp borders, zero glassmorphism).
- **Confidence Hypothesis**: Proves that the PostgreSQL database container boots reliably, migration scripts create the normalized relational schema without errors, and the backend HTTP server handles requests with standardized envelopes.
- **Expected Demo**: `npm run migrate` creates all 4 tables with foreign keys; server starts on port 3000 and answers `/api/health` with `{ success: true, database: "connected" }`.

### Bolt 2: Employee Profile & Directory Feature (`U01: u01-employee-directory`)
- **Included Units**: `U01`
- **Walking Skeleton Stance**: Completes the Walking Skeleton End-to-End User Slice.
- **Definition of Done**:
  - Employee repository executing parameterized queries on the `employees` table.
  - REST endpoints (`GET /api/employees`, `POST /api/employees`, `PUT /api/employees/:id`, `DELETE /api/employees/:id`).
  - Avatar image upload middleware saving files to local uploads directory with public URL referencing.
  - React Employee Directory view with dual Card Grid and Table modes, real-time search input, and team filter dropdown.
  - Automated unit and API integration test suite passing.
- **Confidence Hypothesis**: Proves that a user can create an employee profile with an avatar photo, persist it to PostgreSQL, and search/filter records in real time in the UI.
- **Expected Demo**: User opens the SPA, fills the Add Employee modal with photo, clicks Save, and sees the new solid card appear immediately in the directory grid.

### Bolt 3: Team Rosters & Multi-Team Allocations (`U02: u02-team-rosters`)
- **Included Units**: `U02`
- **Walking Skeleton Stance**: Feature Slice.
- **Definition of Done**:
  - Team repository and `employee_teams` join table data access layer.
  - REST endpoints (`GET /api/teams`, `POST /api/teams`, `POST /api/teams/:id/members`, `DELETE /api/teams/:id/members/:employeeId`).
  - React Team Hub view with team cards, avatar stacks, and member assignment modals.
  - Automated tests verifying many-to-many allocation and referential integrity upon unassignment.
- **Confidence Hypothesis**: Proves that employees can be allocated to multiple teams without data duplication, and removing assignments does not delete master employee records.
- **Expected Demo**: Assigning an employee to two distinct teams displays their avatar badge on both team cards.

### Bolt 4: 3-Stage Task Management (`U03: u03-task-board`)
- **Included Units**: `U03`
- **Walking Skeleton Stance**: Feature Slice.
- **Definition of Done**:
  - Task repository linked to `teams` foreign key.
  - Strict 3-stage state machine enforcement (`Todo` &rarr; `Pending` &rarr; `Completed`).
  - REST endpoints (`GET /api/tasks`, `POST /api/tasks`, `PATCH /api/tasks/:id/status`, `DELETE /api/tasks/:id`).
  - React 3-column Kanban board UI with drag-and-drop and action button status transitions.
- **Confidence Hypothesis**: Proves that team workload is cleanly organized and tasks advance through unambiguous lifecycle stages without illegal status transitions.
- **Expected Demo**: Dragging a task card from `Todo` to `Pending` updates its status in PostgreSQL and triggers responsive UI feedback.

### Bolt 5: Executive Dashboard Analytics (`U04: u04-dashboard-analytics`)
- **Included Units**: `U04`
- **Walking Skeleton Stance**: Feature & System Completion Slice.
- **Definition of Done**:
  - Optimized SQL aggregation queries computing company KPIs (Total Employees, Active Teams, Total Tasks, Completion Rate %).
  - Task stage distribution calculation and team workload summaries.
  - REST endpoint `GET /api/dashboard/stats`.
  - React Executive Dashboard view with solid KPI metric cards and capacity breakdown tables.
- **Confidence Hypothesis**: Proves that executives gain real-time visibility into organizational throughput with sub-200ms query performance.
- **Expected Demo**: Updating a task to `Completed` in Bolt 4 instantly increments the global completion rate percentage on the dashboard.
