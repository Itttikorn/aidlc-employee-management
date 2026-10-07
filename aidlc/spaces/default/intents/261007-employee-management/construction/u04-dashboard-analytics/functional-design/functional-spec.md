# Functional Specification — Unit 04 (Executive Dashboard & Analytics)

## Overview & Scope
Unit 04 (`u04-dashboard-analytics`) delivers an executive overview dashboard providing high-level operational intelligence across the entire employee directory, teams, and task boards. It computes real-time aggregation metrics, task stage completion rates, and department workload distributions.

---

## REST API Contracts

### 1. `GET /api/dashboard/stats`
- **Description**: Returns consolidated summary statistics and workload distributions.
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "overview": {
        "totalEmployees": 42,
        "totalTeams": 6,
        "totalTasks": 28,
        "completionRate": 64.3,
        "overdueTasksCount": 3
      },
      "taskDistribution": {
        "todo": { "count": 6, "percentage": 21.4 },
        "pending": { "count": 4, "percentage": 14.3 },
        "completed": { "count": 18, "percentage": 64.3 }
      },
      "priorityDistribution": {
        "urgent": 2,
        "high": 8,
        "medium": 14,
        "low": 4
      },
      "teamWorkloads": [
        {
          "teamId": "uuid",
          "teamName": "Core Infrastructure",
          "department": "Engineering",
          "memberCount": 5,
          "totalTasks": 10,
          "completedTasks": 8,
          "completionRate": 80.0
        }
      ],
      "recentActivity": [
        {
          "type": "task_completed",
          "title": "Migrate PostgreSQL Connection Pool",
          "teamName": "Core Infrastructure",
          "timestamp": "2026-10-07T08:00:00Z"
        }
      ]
    }
  }
  ```

---

## User Interface Specification (Executive Dashboard Tab)

1. **Top Navigation Tab**: "📊 Dashboard" tab alongside "Employees", "Teams", and "Tasks".
2. **Top KPI Stats Row**: 4 solid metric cards with 1px border contrast:
   - **Total Employees**: Count + active workforce status badge.
   - **Active Teams**: Total teams configured.
   - **Total Tasks**: Active tasks + overdue alert badge.
   - **Completion Rate**: Circular or linear progress bar (% of tasks in `Completed` status).
3. **Task Stage Breakdown Section**:
   - Visual progress bar showing distribution across **To Do** (blue), **In Progress** (amber), and **Completed** (emerald).
   - Priority distribution pills (`Urgent`, `High`, `Medium`, `Low`).
4. **Team Performance & Workload Table**:
   - Table displaying Team Name, Department, Members, Task Load, and Progress Bar with % completion.
