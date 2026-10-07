# Business Rules & Validation Invariants — Unit 02 (Team Rosters)

## Business Logic Rules

### 1. Team Creation & Modification Rules (BR-TEAM-01 to 04)
- **BR-TEAM-01 (Unique Name)**: Team names must be case-insensitively unique across the organization. Duplicate names result in `409 Conflict`.
- **BR-TEAM-02 (Name Constraints)**: Team names must be non-empty strings between 2 and 100 characters after trimming whitespace.
- **BR-TEAM-03 (Department Standard)**: The department must be a non-empty string between 2 and 100 characters.
- **BR-TEAM-04 (Team Lead Validation)**: If `leadId` is provided, it must reference an existing employee profile in PostgreSQL. Setting an invalid lead ID throws `400 Bad Request` or `404 Not Found`.

### 2. Member Assignment Rules (BR-MEM-01 to 04)
- **BR-MEM-01 (Multi-Team Membership)**: An employee can be assigned to multiple teams simultaneously.
- **BR-MEM-02 (Duplicate Assignment Guard)**: Assigning an employee to a team they already belong to is idempotent or returns `409 Conflict` if duplicate insertion is attempted.
- **BR-MEM-03 (Role Tagging)**: Valid roles in a team are `Lead`, `Core Member`, `Contributor`. Default is `Core Member`.
- **BR-MEM-04 (Auto Lead Synchronization)**: When a member is designated as Team Lead on the team entity, they are automatically enrolled into `employee_teams` with role `Lead` if not already a member.

### 3. Deletion & Referential Integrity (BR-DEL-01 to 03)
- **BR-DEL-01 (Transactional Member Cascade)**: Deleting a team automatically removes all `employee_teams` junction rows in a single atomic database transaction.
- **BR-DEL-02 (Employee Preservation)**: Deleting a team never modifies or deletes employee records.
- **BR-DEL-03 (Member Unlinking)**: Removing a member from a team removes the junction row but leaves the employee profile intact.
