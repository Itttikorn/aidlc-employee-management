import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { teamService } from '../../src/services/teamService.js';
import { NotFoundError, ConflictError } from '../../src/utils/errors.js';

vi.mock('../../src/services/teamService.js', () => ({
  teamService: {
    getTeams: vi.fn(),
    getTeamById: vi.fn(),
    createTeam: vi.fn(),
    updateTeam: vi.fn(),
    deleteTeam: vi.fn(),
    addMember: vi.fn(),
    removeMember: vi.fn(),
    getMembers: vi.fn()
  }
}));

describe('Team API Routes (/api/teams)', () => {
  let app: any;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createApp();
  });

  describe('GET /api/teams', () => {
    it('should return list of teams (200 OK)', async () => {
      const mockTeams = [
        {
          id: 'team-1',
          name: 'Core Platform',
          department: 'Engineering',
          memberCount: 3,
          members: []
        }
      ];

      (teamService.getTeams as any).mockResolvedValue(mockTeams);

      const res = await request(app).get('/api/teams?department=Engineering');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.total).toBe(1);
    });
  });

  describe('GET /api/teams/:id', () => {
    it('should return 200 OK with team profile when found', async () => {
      const mockTeam = {
        id: 'team-1',
        name: 'Core Platform',
        department: 'Engineering',
        memberCount: 1
      };
      (teamService.getTeamById as any).mockResolvedValue(mockTeam);

      const res = await request(app).get('/api/teams/team-1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Core Platform');
    });

    it('should return 404 Not Found when team does not exist', async () => {
      (teamService.getTeamById as any).mockRejectedValue(new NotFoundError('Team not found'));

      const res = await request(app).get('/api/teams/unknown');
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('fail');
    });
  });

  describe('POST /api/teams', () => {
    it('should return 201 Created on valid team creation', async () => {
      const newTeam = {
        id: 'team-new',
        name: 'DevOps',
        department: 'Engineering'
      };
      (teamService.createTeam as any).mockResolvedValue(newTeam);

      const res = await request(app)
        .post('/api/teams')
        .send({ name: 'DevOps', department: 'Engineering' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('team-new');
    });

    it('should return 409 Conflict if team name is duplicate', async () => {
      (teamService.createTeam as any).mockRejectedValue(new ConflictError('Team name already exists'));

      const res = await request(app)
        .post('/api/teams')
        .send({ name: 'Duplicate Team' });

      expect(res.status).toBe(409);
      expect(res.body.status).toBe('fail');
    });
  });

  describe('PUT /api/teams/:id', () => {
    it('should return 200 OK on team update', async () => {
      const updated = {
        id: 'team-1',
        name: 'Platform Engineering',
        department: 'Engineering'
      };
      (teamService.updateTeam as any).mockResolvedValue(updated);

      const res = await request(app)
        .put('/api/teams/team-1')
        .send({ name: 'Platform Engineering' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Platform Engineering');
    });
  });

  describe('DELETE /api/teams/:id', () => {
    it('should return 200 OK on deletion', async () => {
      (teamService.deleteTeam as any).mockResolvedValue(undefined);

      const res = await request(app).delete('/api/teams/team-1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('deleted');
    });
  });

  describe('POST /api/teams/:id/members & GET /api/teams/:id/members', () => {
    it('should add member to team (200 OK)', async () => {
      (teamService.addMember as any).mockResolvedValue(undefined);
      (teamService.getMembers as any).mockResolvedValue([
        { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Alice', role: 'Core Member' }
      ]);

      const res = await request(app)
        .post('/api/teams/team-1/members')
        .send({ employeeId: '123e4567-e89b-12d3-a456-426614174000', role: 'Core Member' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });

    it('should delete member from team (200 OK)', async () => {
      (teamService.removeMember as any).mockResolvedValue(undefined);

      const res = await request(app).delete('/api/teams/team-1/members/123e4567-e89b-12d3-a456-426614174000');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});

