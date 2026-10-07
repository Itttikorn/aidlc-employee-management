# Business Rules & Validation Invariants — Unit 03 (Task Board)

## Business Logic Rules

### 1. Finite State Machine Rules (BR-TSK-FSM)
- **BR-TSK-01 (Valid Statuses)**: The status of a task must strictly be one of `['Todo', 'Pending', 'Completed']`. Any other value returns `400 Bad Request`.
- **BR-TSK-02 (Valid State Transitions)**:
  - `Todo` &rarr; `Pending`
  - `Pending` &rarr; `Completed`
  - `Pending` &rarr; `Todo`
  - `Completed` &rarr; `Pending`
  - Direct skip from `Todo` &rarr; `Completed` without entering `Pending` is allowed if directly finished, but `PATCH /api/tasks/:id/status` validates all incoming statuses against allowed states.
- **BR-TSK-03 (Default Status)**: When omitted during creation, task status defaults to `Todo`.

### 2. Task Ownership & Team Invariants (BR-TSK-OWN)
- **BR-TSK-04 (Mandatory Team)**: Every task must be assigned to an existing `team_id`. Creating a task with a non-existent `teamId` returns `404 Not Found`.
- **BR-TSK-05 (Assignee Referential Integrity)**: If `assigneeId` is provided, it must reference an active employee profile in PostgreSQL. Otherwise returns `404 Not Found`.
- **BR-TSK-06 (Title Validation)**: Task titles must be non-empty strings between 2 and 200 characters after trimming whitespace.
- **BR-TSK-07 (Priority Levels)**: Valid priority levels are strictly `['Low', 'Medium', 'High', 'Urgent']`. Default is `Medium`.

### 3. Deletion & Cleanup (BR-TSK-DEL)
- **BR-TSK-08 (Cascade on Team Deletion)**: When a team is deleted, all its associated tasks are deleted automatically via PostgreSQL foreign key cascade.
- **BR-TSK-09 (Nullify on Employee Deletion)**: When an assigned employee is deleted, the task's `assignee_id` is set to `NULL` without deleting the task.
