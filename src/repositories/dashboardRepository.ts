import { query } from '../config/database.js';

export interface RawOverviewCounts {
  total_employees: string | number;
  total_teams: string | number;
  total_tasks: string | number;
  overdue_tasks: string | number;
}

export interface RawStatusCount {
  status: string;
  count: string | number;
}

export interface RawPriorityCount {
  priority: string;
  count: string | number;
}

export interface RawTeamWorkload {
  team_id: string;
  team_name: string;
  department: string;
  member_count: string | number;
  total_tasks: string | number;
  completed_tasks: string | number;
}

export class DashboardRepository {
  /**
   * Fetch high-level entity counts and overdue task count.
   */
  async getOverviewCounts(): Promise<{
    totalEmployees: number;
    totalTeams: number;
    totalTasks: number;
    overdueTasksCount: number;
  }> {
    const sql = `
      SELECT
        (SELECT COUNT(*) FROM employees) AS total_employees,
        (SELECT COUNT(*) FROM teams) AS total_teams,
        (SELECT COUNT(*) FROM tasks) AS total_tasks,
        (SELECT COUNT(*) FROM tasks WHERE status != 'Completed' AND due_date IS NOT NULL AND due_date < CURRENT_DATE) AS overdue_tasks
    `;

    const res = await query<RawOverviewCounts>(sql);
    const row = res.rows[0] || {
      total_employees: 0,
      total_teams: 0,
      total_tasks: 0,
      overdue_tasks: 0
    };

    return {
      totalEmployees: Number(row.total_employees) || 0,
      totalTeams: Number(row.total_teams) || 0,
      totalTasks: Number(row.total_tasks) || 0,
      overdueTasksCount: Number(row.overdue_tasks) || 0
    };
  }

  /**
   * Fetch task counts grouped by 3-stage status.
   */
  async getStatusCounts(): Promise<Record<string, number>> {
    const sql = `
      SELECT status, COUNT(*) AS count
      FROM tasks
      GROUP BY status
    `;

    const res = await query<RawStatusCount>(sql);
    const result: Record<string, number> = {
      Todo: 0,
      Pending: 0,
      Completed: 0
    };

    for (const row of res.rows) {
      result[row.status] = Number(row.count) || 0;
    }

    return result;
  }

  /**
   * Fetch task counts grouped by priority.
   */
  async getPriorityCounts(): Promise<Record<string, number>> {
    const sql = `
      SELECT priority, COUNT(*) AS count
      FROM tasks
      GROUP BY priority
    `;

    const res = await query<RawPriorityCount>(sql);
    const result: Record<string, number> = {
      Urgent: 0,
      High: 0,
      Medium: 0,
      Low: 0
    };

    for (const row of res.rows) {
      result[row.priority] = Number(row.count) || 0;
    }

    return result;
  }

  /**
   * Fetch team workloads and completion progress per team.
   */
  async getTeamWorkloads(): Promise<RawTeamWorkload[]> {
    const sql = `
      SELECT
        t.id AS team_id,
        t.name AS team_name,
        t.department,
        COUNT(DISTINCT et.employee_id) AS member_count,
        COUNT(DISTINCT tsk.id) AS total_tasks,
        COUNT(DISTINCT CASE WHEN tsk.status = 'Completed' THEN tsk.id END) AS completed_tasks
      FROM teams t
      LEFT JOIN employee_teams et ON t.id = et.team_id
      LEFT JOIN tasks tsk ON t.id = tsk.team_id
      GROUP BY t.id
      ORDER BY total_tasks DESC, t.name ASC
    `;

    const res = await query<RawTeamWorkload>(sql);
    return res.rows;
  }
}

export const dashboardRepository = new DashboardRepository();
