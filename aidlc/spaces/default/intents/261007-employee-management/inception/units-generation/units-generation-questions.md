# Units Generation — Decomposition & Dependency Questions

These questions define the Unit of Work decomposition strategy, granularity, and dependency structure for the Construction phase.

---

### Question 1: Unit of Work Boundary & Granularity Strategy
How should the domain components be grouped into implementable Construction Units of Work?
- A. 5 Units of Work (1 Foundation Library + 4 Service Units aligned with Epics 1-5): `U05: u05-core-foundation`, `U01: u01-employee-directory`, `U02: u02-team-rosters`, `U03: u03-task-board`, `U04: u04-dashboard-analytics`
- B. 2 Coarse-Grained Units: `CoreFoundationAndPersonnel` and `TasksAndDashboard`
- C. Other (please specify)
[Answer]: A

---

### Question 2: Walking Skeleton Stance & Integration Slice
Following the affirmed team practice, which unit serves as the foundational slice to prove PostgreSQL schema migrations, API routing, and high-contrast solid card UI rendering?
- A. `U05: u05-core-foundation` as the zero-dependency base library providing PostgreSQL pool, transaction management, base Express/Fastify server, and solid UI layout tokens, immediately integrated with `U01: u01-employee-directory`
- B. Stubbed mock-data layer first without real PostgreSQL persistence
- C. Other (please specify)
[Answer]: A

---

### Question 3: Construction Unit Classification & Design Matrix Scope
What artifact kinds should be assigned to the Construction Units?
- A. `U05 (core-foundation)` as `library` (delivering shared persistence, utilities, and UI tokens), and `U01-U04` as `service` (executable full-stack features with API endpoints, domain models, and UI views)
- B. All units classified as generic `service`
- C. Other (please specify)
[Answer]: A

---

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?
- Looks correct
- Request changes

[Answer]: Looks correct
