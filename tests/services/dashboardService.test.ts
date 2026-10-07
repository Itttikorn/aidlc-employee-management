import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DashboardService } from '../../src/services/dashboardService.js';

describe('Dashboard Service', () => {
  let mockRepo: any;
  let service: DashboardService;

  beforeEach(() => {
    mockRepo = {
      getOverviewCounts: vi.fn(),
      getStatusCounts: vi.fn(),
      getPriorityCounts: vi.fn(),
      getTeamWorkloads: vi.fn()
    };
    service = new DashboardService(mockRepo);
  });

  describe('getDashboardStats', () => {
    it('should aggregate metrics with calculated percentages and completion rate', async () => {
      mockRepo.getOverviewCounts.mockResolvedValue({
        totalEmployees: 20,
        totalTeams: 5,
        totalTasks: 10,
        overdueTasksCount: 2
      });

      mockRepo.getStatusCounts.mockResolvedValue({
        Todo: 3,
        Pending: 2,
        Completed: 5
      });

      mockRepo.getPriorityCounts.mockResolvedValue({
        Urgent: 1,
        High: 3,
        Medium: 4,
        Low: 2
      });

      mockRepo.getTeamWorkloads.mockResolvedValue([
        {
          team_id: 't-1',
          team_name: 'Frontend Team',
          department: 'Engineering',
          member_count: '4',
          total_tasks: '6',
          completed_tasks: '3'
        }
      ]);

      const result = await service.getDashboardStats();

      // Overview verification
      expect(result.overview.totalEmployees).toBe(20);
      expect(result.overview.totalTeams).toBe(5);
      expect(result.overview.totalTasks).toBe(10);
      expect(result.overview.completedTasks).toBe(5);
      expect(result.overview.completionRate).toBe(50.0);
      expect(result.overview.overdueTasksCount).toBe(2);

      // Status distribution verification
      expect(result.taskDistribution.todo).toEqual({ count: 3, percentage: 30.0 });
      expect(result.taskDistribution.pending).toEqual({ count: 2, percentage: 20.0 });
      expect(result.taskDistribution.completed).toEqual({ count: 5, percentage: 50.0 });

      // Priority distribution verification
      expect(result.priorityDistribution).toEqual({
        urgent: 1,
        high: 3,
        medium: 4,
        low: 2
      });

      // Team workloads verification
      expect(result.teamWorkloads).toHaveLength(1);
      expect(result.teamWorkloads[0]).toEqual({
        teamId: 't-1',
        teamName: 'Frontend Team',
        department: 'Engineering',
        memberCount: 4,
        totalTasks: 6,
        completedTasks: 3,
        completionRate: 50.0
      });
    });

    it('should safely handle 0 tasks without NaN or division by zero', async () => {
      mockRepo.getOverviewCounts.mockResolvedValue({
        totalEmployees: 0,
        totalTeams: 0,
        totalTasks: 0,
        overdueTasksCount: 0
      });

      mockRepo.getStatusCounts.mockResolvedValue({
        Todo: 0,
        Pending: 0,
        Completed: 0
      });

      mockRepo.getPriorityCounts.mockResolvedValue({
        Urgent: 0,
        High: 0,
        Medium: 0,
        Low: 0
      });

      mockRepo.getTeamWorkloads.mockResolvedValue([]);

      const result = await service.getDashboardStats();

      expect(result.overview.completionRate).toBe(0.0);
      expect(result.taskDistribution.todo.percentage).toBe(0.0);
      expect(result.taskDistribution.pending.percentage).toBe(0.0);
      expect(result.taskDistribution.completed.percentage).toBe(0.0);
      expect(result.teamWorkloads).toEqual([]);
    });

    it('should default department when missing in raw workload', async () => {
      mockRepo.getOverviewCounts.mockResolvedValue({
        totalEmployees: 5,
        totalTeams: 1,
        totalTasks: 2,
        overdueTasksCount: 0
      });

      mockRepo.getStatusCounts.mockResolvedValue({ Todo: 2, Pending: 0, Completed: 0 });
      mockRepo.getPriorityCounts.mockResolvedValue({ Urgent: 0, High: 2, Medium: 0, Low: 0 });

      mockRepo.getTeamWorkloads.mockResolvedValue([
        {
          team_id: 't-2',
          team_name: 'Special Operations',
          department: null,
          member_count: '2',
          total_tasks: '2',
          completed_tasks: '0'
        }
      ]);

      const result = await service.getDashboardStats();
      expect(result.teamWorkloads[0].department).toBe('Engineering');
      expect(result.teamWorkloads[0].completionRate).toBe(0.0);
    });
  });
});

