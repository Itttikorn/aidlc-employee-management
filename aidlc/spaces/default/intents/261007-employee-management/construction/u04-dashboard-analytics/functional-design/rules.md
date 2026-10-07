# Business Rules & Calculation Invariants — Unit 04 (Dashboard Analytics)

## Computation Invariants

### 1. Calculation Invariants (BR-DASH-01 to 04)
- **BR-DASH-01 (Zero Division Safety)**: If `totalTasks` is 0, overall `completionRate` and task percentage distributions must safely evaluate to `0.0` (never `NaN` or `Infinity`).
- **BR-DASH-02 (Precision Standards)**: All percentage metrics must be bounded between `0.0` and `100.0` and rounded to 1 decimal place.
- **BR-DASH-03 (Overdue Task Standard)**: A task is considered overdue strictly when `status != 'Completed'`, `due_date IS NOT NULL`, and `due_date < CURRENT_DATE`.
- **BR-DASH-04 (Team Workload Completeness)**: The team workloads list must include all active teams, even those with 0 tasks assigned.

### 2. Performance & Security Rules (BR-DASH-05 to 06)
- **BR-DASH-05 (Read-Only Safety)**: The analytics endpoint must execute strictly read-only parameterized queries.
- **BR-DASH-06 (Sub-200ms Latency)**: Aggregation queries must use existing B-Tree indexes on `status`, `team_id`, and `due_date` without performing full table scans where indexed lookups apply.

