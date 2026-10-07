# Target User Personas

## Sources
- Initial description: [desc]
- Scope definition: [scope]
- Requirements: [requirements]
- Questions: [questions]

---

## 1. Persona 1: HR Administrator (Primary User)
- **Role**: HR Operations Specialist / Employee Administrator
- **Primary Goals**:
  - Quickly create, view, update, and search employee directory records.
  - Upload employee avatars and maintain accurate positions and ages.
  - Assign employees to appropriate functional teams.
- **Pain Points**:
  - Slow spreadsheets with stale data and broken employee photos.
  - Inability to reflect employees belonging to multiple project/functional teams.
- **Context**: Accesses the web application daily via desktop browser.

---

## 2. Persona 2: Team Lead / Engineering Manager
- **Role**: Functional Team Lead / Project Manager
- **Primary Goals**:
  - Manage team rosters and view assigned team tasks.
  - Move tasks seamlessly across the 3-stage lifecycle (`Todo` -> `Pending` -> `Completed`).
  - Balance workload across team members.
- **Pain Points**:
  - Unclear task progress and bottlenecks between in-progress and completion states.
  - Rigid tools that do not support cross-team collaboration.
- **Context**: Interacts frequently with the 3-column Kanban board during standups and sprint reviews.

---

## 3. Persona 3: Executive Leadership / Director
- **Role**: Company Director / Department Head
- **Primary Goals**:
  - View instant, real-time organizational KPIs and progress rates.
  - Inspect task distribution across `Todo`, `Pending`, and `Completed` stages.
  - Understand team workloads and organizational capacity.
- **Pain Points**:
  - Lack of centralized high-level visibility; having to ask multiple leads for status reports.
- **Context**: Views Executive Dashboard on desktop and tablets for strategic tracking.

---

## 4. Persona Priority & Relationships Matrix

| Persona | Priority Ranking | Key Views Interacted With | Primary Value |
|---|---|---|---|
| **HR Administrator** | Primary (P1) | `/employees`, `/teams` | Clean data entry, avatar management, multi-team assignments |
| **Team Lead** | Primary (P1) | `/teams`, `/tasks` (Kanban) | 3-stage task velocity, team roster visibility |
| **Executive Leader** | Secondary (P2) | `/dashboard` | Company-wide KPI visibility and capacity breakdown |
