# Units of Work Specification

## Sources
- Requirements: `requirements.md` (requirements-analysis)
- User Stories: `stories.md` (user-stories)
- Component Catalogue: `components.md` (domain-design)
- Architecture Decisions: `decisions.md` (domain-design)
- Team Practices: `team-practices.md` (practices-discovery)

---

## 1. Units of Work Summary

The system is decomposed into 5 distinct, independently testable Units of Work. Each unit defines clear architectural boundaries, deployment classifications, and implementation scopes for the Construction phase.

| Unit ID | Directory | Name | Kind | Complexity | Deployment Model | Summary |
|---|---|---|---|---|---|---|
| **U05** | `u05-core-foundation` | System Foundation & Design Tokens | `library` | M | Embedded / Shared | PostgreSQL pool, migrations, transaction helpers, error handlers, and solid card design tokens (**Walking Skeleton base**). |
| **U01** | `u01-employee-directory` | Employee Directory & Profile Management | `service` | M | Standalone Service | Employee profile CRUD, avatar image handling, real-time search & team filtering. |
| **U02** | `u02-team-rosters` | Team Rosters & Multi-Team Allocations | `service` | M | Standalone Service | Team CRUD, member rosters, and many-to-many allocation join management. |
| **U03** | `u03-task-board` | 3-Stage Team Task Management | `service` | M | Standalone Service | Task CRUD, team assignments, and strict 3-stage Kanban FSM (`Todo` &rarr; `Pending` &rarr; `Completed`). |
| **U04** | `u04-dashboard-analytics` | Executive Dashboard & Analytics | `service` | S | Standalone Service | Real-time calculation of organizational KPIs, task distribution, and team workload matrices. |

---

## 2. Unit Definitions & Responsibilities

### Unit U05: `u05-core-foundation`
- **Kind**: `library`
- **Complexity**: M (Medium)
- **Deployment Model**: Embedded Shared Library / Kernel
- **Responsibilities**:
  - PostgreSQL database connection pooling (`pg` client with connection retry and health checks).
  - Schema migration runner executing DDL scripts for all normalized tables and foreign key constraints.
  - Transaction manager utility for multi-table atomic operations.
  - Standardized REST API error handling middleware and response envelope.
  - Design token definitions (Tailwind CSS configuration, high-contrast dark/light palette, crisp 1px borders, zero glassmorphism).
- **Implementation Constraints**:
  - Strict TypeScript typings; zero unhandled `any` types.
  - Must establish the Walking Skeleton integration baseline before feature units are implemented.

### Unit U01: `u01-employee-directory`
- **Kind**: `service`
- **Complexity**: M (Medium)
- **Deployment Model**: Standalone Service / Feature Module
- **Responsibilities**:
  - Employee entity model and database access layer for the `employees` table.
  - REST API endpoints for employee CRUD (`GET /api/employees`, `POST /api/employees`, `PUT /api/employees/:id`, `DELETE /api/employees/:id`).
  - Avatar image upload processing and static asset serving.
  - Frontend Employee Directory view with dual Card Grid and Table modes, real-time search input, and team filter dropdown.
- **Implementation Constraints**:
  - Strict validation of employee fields (Full Name required, Position required, Age positive integer).
  - Adherence to Thailand PDPA standards for personal identifiable data handling.

### Unit U02: `u02-team-rosters`
- **Kind**: `service`
- **Complexity**: M (Medium)
- **Deployment Model**: Standalone Service / Feature Module
- **Responsibilities**:
  - Team entity model and `employee_teams` many-to-many join table repository.
  - REST API endpoints for team management (`GET /api/teams`, `POST /api/teams`, `PUT /api/teams/:id`, `DELETE /api/teams/:id`, `POST /api/teams/:id/members`, `DELETE /api/teams/:id/members/:employeeId`).
  - Frontend Team Hub view displaying solid team cards, member count badges, avatar stacks, and member assignment modals.
- **Implementation Constraints**:
  - Referential integrity: removing a team assignment must never delete employee or team master records.

### Unit U03: `u03-task-board`
- **Kind**: `service`
- **Complexity**: M (Medium)
- **Deployment Model**: Standalone Service / Feature Module
- **Responsibilities**:
  - Task entity model and repository for the `tasks` table with foreign keys to `teams`.
  - Strict 3-stage finite state machine enforcement (`Todo` &rarr; `Pending` &rarr; `Completed`).
  - REST API endpoints for task lifecycle management (`GET /api/tasks`, `POST /api/tasks`, `PATCH /api/tasks/:id/status`, `DELETE /api/tasks/:id`).
  - Frontend 3-column Kanban board UI with drag-and-drop support, quick move actions, and team filtering.
- **Implementation Constraints**:
  - Reject invalid state transitions at API and service layers.
  - Every task must link to an existing active team.

### Unit U04: `u04-dashboard-analytics`
- **Kind**: `service`
- **Complexity**: S (Small)
- **Deployment Model**: Standalone Service / Feature Module
- **Responsibilities**:
  - Optimized SQL aggregation queries computing top-level KPIs (Total Employees, Active Teams, Total Tasks, Completion Rate %).
  - Task stage distribution calculation (counts and percentages across `Todo`, `Pending`, `Completed`).
  - Team workload and capacity summary calculation.
  - REST API endpoint `GET /api/dashboard/stats`.
  - Frontend Executive Dashboard view with solid KPI metric cards, progress bars, and team workload tables.
- **Implementation Constraints**:
  - Read-only queries with sub-200ms latency.
