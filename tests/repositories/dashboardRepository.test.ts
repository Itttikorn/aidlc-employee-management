import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DashboardRepository } from '../../src/repositories/dashboardRepository.js';

vi.mock('../../src/config/database.js', () => ({
  pool: {
    query: vi.fn(),
    connect: vi.fn()
  },
  query: vi.fn()
}));

describe('Dashboard Repository', () => {
  let repository: DashboardRepository;
  let mockQuery: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    repository = new DashboardRepository();
    const dbModule = await import('../../src/config/database.js');
    mockQuery = dbModule.query;
  });

  describe('getOverviewCounts', () => {
    it('should return aggregated high-level counts', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            total_employees: '12',
            total_teams: '4',
            total_tasks: '25',
            overdue_tasks: '3'
          }
        ]
      });

      const counts = await repository.getOverviewCounts();
      expect(counts).toEqual({
        totalEmployees: 12,
        totalTeams: 4,
        totalTasks: 25,
        overdueTasksCount: 3
      });
    });

    it('should return zeros when row is empty or null', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const counts = await repository.getOverviewCounts();
      expect(counts).toEqual({
        totalEmployees: 0,
        totalTeams: 0,
        totalTasks: 0,
        overdueTasksCount: 0
      });
    });
  });

  describe('getStatusCounts', () => {
    it('should return grouped status counts', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          { status: 'Todo', count: '10' },
          { status: 'Pending', count: '5' },
          { status: 'Completed', count: '15' }
        ]
      });

      const counts = await repository.getStatusCounts();
      expect(counts).toEqual({
        Todo: 10,
        Pending: 5,
        Completed: 15
      });
    });

    it('should default missing statuses to 0', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ status: 'Completed', count: '2' }]
      });

      const counts = await repository.getStatusCounts();
      expect(counts).toEqual({
        Todo: 0,
        Pending: 0,
        Completed: 2
      });
    });
  });

  describe('getPriorityCounts', () => {
    it('should return grouped priority counts', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          { priority: 'Urgent', count: '2' },
          { priority: 'High', count: '4' },
          { priority: 'Medium', count: '8' },
          { priority: 'Low', count: '6' }
        ]
      });

      const counts = await repository.getPriorityCounts();
      expect(counts).toEqual({
        Urgent: 2,
        High: 4,
        Medium: 8,
        Low: 6
      });
    });
  });

  describe('getTeamWorkloads', () => {
    it('should return team workload summaries', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            team_id: 'team-1',
            team_name: 'Core Platform',
            department: 'Engineering',
            member_count: '5',
            total_tasks: '10',
            completed_tasks: '8'
          },
          {
            team_id: 'team-2',
            team_name: 'Design System',
            department: 'Product Design',
            member_count: '3',
            total_tasks: '0',
            completed_tasks: '0'
          }
        ]
      });

      const workloads = await repository.getTeamWorkloads();
      expect(workloads).toHaveLength(2);
      expect(workloads[0].team_name).toBe('Core Platform');
      expect(workloads[0].total_tasks).toBe('10');
      expect(workloads[0].completed_tasks).toBe('8');
    });
  });
});

