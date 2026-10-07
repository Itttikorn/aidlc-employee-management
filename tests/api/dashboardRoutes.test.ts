import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { dashboardService } from '../../src/services/dashboardService.js';

vi.mock('../../src/services/dashboardService.js', () => ({
  dashboardService: {
    getDashboardStats: vi.fn()
  }
}));

describe('Dashboard API Routes (/api/dashboard)', () => {
  let app: any;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createApp();
  });

  describe('GET /api/dashboard/stats', () => {
    it('should return aggregated dashboard statistics (200 OK)', async () => {
      const mockStats = {
        overview: {
          totalEmployees: 24,
          totalTeams: 6,
          totalTasks: 42,
          completedTasks: 21,
          completionRate: 50.0,
          overdueTasksCount: 3
        },
        taskDistribution: {
          todo: { count: 11, percentage: 26.2 },
          pending: { count: 10, percentage: 23.8 },
          completed: { count: 21, percentage: 50.0 }
        },
        priorityDistribution: {
          urgent: 4,
          high: 12,
          medium: 16,
          low: 10
        },
        teamWorkloads: [
          {
            teamId: 't-1',
            teamName: 'Backend Core',
            department: 'Engineering',
            memberCount: 5,
            totalTasks: 20,
            completedTasks: 12,
            completionRate: 60.0
          }
        ]
      };

      (dashboardService.getDashboardStats as any).mockResolvedValue(mockStats);

      const res = await request(app).get('/api/dashboard/stats');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.overview.totalEmployees).toBe(24);
      expect(res.body.data.overview.completionRate).toBe(50.0);
      expect(res.body.data.taskDistribution.completed.count).toBe(21);
      expect(res.body.data.teamWorkloads).toHaveLength(1);
    });

    it('should forward errors to error handler middleware', async () => {
      (dashboardService.getDashboardStats as any).mockRejectedValue(new Error('Database query failure'));

      const res = await request(app).get('/api/dashboard/stats');
      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
      expect(res.body.statusCode).toBe(500);
    });
  });
});
