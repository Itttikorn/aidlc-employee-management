# Architecture Decision Records (ADRs) — Domain Design

## Sources
- Requirements: `requirements.md` (requirements-analysis)
- User Stories: `stories.md` (user-stories)
- Team Practices: `team-practices.md` (practices-discovery)
- Refined Mockups: `mockups.md` (refined-mockups)
- Component Catalogue: `components.md` (domain-design)

---

### ADR-001: Domain Decomposition into 4 Bounded Components + Core Foundation

- **Context**: The Employee Management System requires modular organization supporting employee directories, multi-team assignments, a 3-stage Kanban workflow, and executive metrics. We need an architectural decomposition that ensures high cohesion, loose coupling, and clean unit boundaries for construction.
- **Decision**: Decompose the application into 4 distinct domain components (`EmployeeManagementComponent`, `TeamManagementComponent`, `TaskManagementComponent`, `DashboardAnalyticsComponent`) supported by a shared `CoreFoundationComponent`.
- **Consequences**:
  - *Positive*: Clear component boundaries; isolated testability; zero entity ownership ambiguity; modular code structure ready for parallel construction units.
  - *Negative*: Inter-component interactions require explicit validation across component boundaries (e.g. validating employee ID when assigning to a team).
- **Alternatives Rejected**:
  - *Monolithic Combined Domain*: Merging Employees and Teams into a single broad domain was rejected because employees must exist independently of teams, and team allocation logic has a distinct change frequency.

---

### ADR-002: Explicit Join Entity Ownership for Many-to-Many Employee-Team Allocations

- **Context**: Employees can be assigned to zero, one, or multiple teams simultaneously (US2.1). Deleting an employee or removing a team membership must maintain strict referential integrity without cascading unwanted deletions to either core entity.
- **Decision**: Place the `EmployeeTeamAssignment` join relation under `TeamManagementComponent` ownership with explicit foreign key references to `Employee` and `Team`.
- **Consequences**:
  - *Positive*: Team rosters and memberships can be manipulated dynamically; deleting a team assignment unlinks the member without destroying profile data; strict PostgreSQL foreign key constraints ensure zero orphaned records.
  - *Negative*: Querying an employee's full profile with active team tags requires joining through the `EmployeeTeamAssignment` table.
- **Alternatives Rejected**:
  - *Storing Team IDs Array in Employee Record*: Storing an array of team IDs directly on the `Employee` entity was rejected due to lack of referential integrity, difficulty indexing relational joins, and violation of 3NF relational modeling.

---

### ADR-003: Strict 3-Stage Finite State Machine for Task Lifecycle

- **Context**: Tasks must follow a strict 3-stage workflow (`Todo` &rarr; `Pending` &rarr; `Completed`) to support Kanban operations and executive metric calculations (FR-3.2, US3.2).
- **Decision**: Encapsulate the 3-stage state machine within `TaskManagementComponent`, enforcing transition validity at both the API controller and service layer.
- **Consequences**:
  - *Positive*: Unambiguous task progress tracking; prevents illegal state transitions (e.g. jumping to undefined states); simplifies Kanban column mapping and executive completion rate aggregation.
  - *Negative*: Custom or ad-hoc interim statuses cannot be added without updating the domain state machine.
- **Alternatives Rejected**:
  - *Free-form Status Strings*: Allowing arbitrary user-defined status strings was rejected because it would compromise automated KPI calculations and Kanban board consistency.

---

### ADR-004: Decoupled Read-Only Analytics Layer for Executive Dashboard

- **Context**: The Executive Dashboard aggregates real-time organizational metrics (total employees, active teams, total tasks, and completion rate %). We need fast calculation without locking transactional write tables.
- **Decision**: Implement `DashboardAnalyticsComponent` as a dedicated read-only analytical projection layer that executes optimized SQL aggregation queries across domain tables.
- **Consequences**:
  - *Positive*: Decouples high-frequency dashboard reads from transactional domain operations; allows indexing specifically for aggregation queries; clean separation of analytics from CRUD business logic.
  - *Negative*: Any schema modifications in underlying tables must be reflected in dashboard aggregation queries.
- **Alternatives Rejected**:
  - *Scattering Metric Queries Across Individual Controllers*: Having each domain controller calculate its own metrics on the fly was rejected due to query duplication and lack of unified dashboard caching.

---

### ADR-005: Modular Avatar Asset Storage with URI References on Employee Entity

- **Context**: Employee profiles include optional/required photo uploads (FR-1.4, US1.1). We need a storage approach that supports local development/preview execution while remaining cloud-ready.
- **Decision**: Implement a modular storage abstraction in `CoreFoundationComponent` (saving files to local static upload directory in development with support for S3/object storage), storing only the public URL/URI string on the `Employee` entity.
- **Consequences**:
  - *Positive*: Database stays lightweight without binary bloat; media files can be served efficiently via static middleware or CDN; easy to swap storage providers.
  - *Negative*: Requires file cleanup handlers if an employee profile photo is deleted or updated.
- **Alternatives Rejected**:
  - *Direct Binary Base64 Storage in PostgreSQL*: Storing binary image data directly in database columns was rejected due to database table bloat, slower query performance, and high memory overhead during directory searches.
