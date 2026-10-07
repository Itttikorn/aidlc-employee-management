# Domain Entity Models & Aggregates — Unit 04 (Dashboard Analytics)

## Overview
Unit 04 is a read-only analytics service that computes cross-domain aggregations across the `employees`, `teams`, `employee_teams`, and `tasks` tables without introducing separate persistent transaction tables.

---

## Data Transfer Objects & Aggregate Structures

### 1. `DashboardOverview`
- **`totalEmployees`** (`number`): Total rows in `employees`.
- **`totalTeams`** (`number`): Total rows in `teams`.
- **`totalTasks`** (`number`): Total rows in `tasks`.
- **`completionRate`** (`number`): Percentage `(completedTasks / totalTasks) * 100`, rounded to 1 decimal place (0.0 if `totalTasks == 0`).
- **`overdueTasksCount`** (`number`): Total tasks where `status != 'Completed'` and `due_date < CURRENT_DATE`.

### 2. `TaskDistribution`
- **`todo`**: `{ count: number, percentage: number }`
- **`pending`**: `{ count: number, percentage: number }`
- **`completed`**: `{ count: number, percentage: number }`

### 3. `PriorityDistribution`
- **`urgent`** (`number`): Count of tasks with priority `Urgent`.
- **`high`** (`number`): Count of tasks with priority `High`.
- **`medium`** (`number`): Count of tasks with priority `Medium`.
- **`low`** (`number`): Count of tasks with priority `Low`.

### 4. `TeamWorkloadSummary`
- **`teamId`** (`string` UUID)
- **`teamName`** (`string`)
- **`department`** (`string`)
- **`memberCount`** (`number`)
- **`totalTasks`** (`number`)
- **`completedTasks`** (`number`)
- **`completionRate`** (`number`)

### 5. `DashboardStatsResponse`
- Encompasses `overview`, `taskDistribution`, `priorityDistribution`, and `teamWorkloads`.
