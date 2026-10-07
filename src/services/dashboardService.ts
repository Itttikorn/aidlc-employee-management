import { dashboardRepository, DashboardRepository } from '../repositories/dashboardRepository.js';
import {
  DashboardStatsResponse,
  DashboardOverview,
  TaskDistribution,
  PriorityDistribution,
  TeamWorkloadSummary
} from '../types/dashboard.js';
import { logger } from '../utils/logger.js';

export class DashboardService {
  constructor(private repo: DashboardRepository = dashboardRepository) {}

  /**
   * Compute comprehensive dashboard analytics and workload metrics.
   */
  async getDashboardStats(): Promise<DashboardStatsResponse> {
    logger.info('Aggregating dashboard analytics');

    const [overviewCounts, statusCounts, priorityCounts, rawWorkloads] = await Promise.all([
      this.repo.getOverviewCounts(),
      this.repo.getStatusCounts(),
      this.repo.getPriorityCounts(),
      this.repo.getTeamWorkloads()
    ]);

    const totalTasks = overviewCounts.totalTasks;
    const completedTasks = statusCounts.Completed || 0;
    const todoTasks = statusCounts.Todo || 0;
    const pendingTasks = statusCounts.Pending || 0;

    // Zero-division safe completion rate
    const completionRate = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 1000) / 10
      : 0.0;

    const overview: DashboardOverview = {
      totalEmployees: overviewCounts.totalEmployees,
      totalTeams: overviewCounts.totalTeams,
      totalTasks: overviewCounts.totalTasks,
      completedTasks,
      completionRate,
      overdueTasksCount: overviewCounts.overdueTasksCount
    };

    const taskDistribution: TaskDistribution = {
      todo: {
        count: todoTasks,
        percentage: totalTasks > 0 ? Math.round((todoTasks / totalTasks) * 1000) / 10 : 0.0
      },
      pending: {
        count: pendingTasks,
        percentage: totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 1000) / 10 : 0.0
      },
      completed: {
        count: completedTasks,
        percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 1000) / 10 : 0.0
      }
    };

    const priorityDistribution: PriorityDistribution = {
      urgent: priorityCounts.Urgent || 0,
      high: priorityCounts.High || 0,
      medium: priorityCounts.Medium || 0,
      low: priorityCounts.Low || 0
    };

    const teamWorkloads: TeamWorkloadSummary[] = rawWorkloads.map((tw) => {
      const teamTotal = Number(tw.total_tasks) || 0;
      const teamCompleted = Number(tw.completed_tasks) || 0;
      const rate = teamTotal > 0 ? Math.round((teamCompleted / teamTotal) * 1000) / 10 : 0.0;

      return {
        teamId: tw.team_id,
        teamName: tw.team_name,
        department: tw.department || 'Engineering',
        memberCount: Number(tw.member_count) || 0,
        totalTasks: teamTotal,
        completedTasks: teamCompleted,
        completionRate: rate
      };
    });

    return {
      overview,
      taskDistribution,
      priorityDistribution,
      teamWorkloads
    };
  }
}

export const dashboardService = new DashboardService();

