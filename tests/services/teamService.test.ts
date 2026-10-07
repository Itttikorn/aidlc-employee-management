import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TeamService } from '../../src/services/teamService.js';
import { NotFoundError, ConflictError } from '../../src/utils/errors.js';

describe('Team Service', () => {
  let mockTeamRepo: any;
  let mockEmpRepo: any;
  let service: TeamService;

  beforeEach(() => {
    mockTeamRepo = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      addMember: vi.fn(),
      removeMember: vi.fn(),
      getMembers: vi.fn()
    };
    mockEmpRepo = {
      findById: vi.fn()
    };
    service = new TeamService(mockTeamRepo, mockEmpRepo);
  });

  describe('getTeams', () => {
    it('should retrieve teams with filters', async () => {
      mockTeamRepo.findAll.mockResolvedValue([{ id: 'team-1', name: 'Platform Engineering' }]);
      const res = await service.getTeams({ department: 'Engineering' });
      expect(mockTeamRepo.findAll).toHaveBeenCalledWith({ department: 'Engineering' });
      expect(res).toHaveLength(1);
    });
  });

  describe('getTeamById', () => {
    it('should return team when found', async () => {
      mockTeamRepo.findById.mockResolvedValue({ id: 'team-1', name: 'Platform' });
      const res = await service.getTeamById('team-1');
      expect(res.name).toBe('Platform');
    });

    it('should throw NotFoundError when team is not found', async () => {
      mockTeamRepo.findById.mockResolvedValue(null);
      await expect(service.getTeamById('missing')).rejects.toThrow(NotFoundError);
    });
  });

  describe('createTeam', () => {
    it('should create team and auto-enroll lead if leadId is supplied', async () => {
      const input = {
        name: 'DevSecOps',
        department: 'Security',
        leadId: 'emp-100'
      };

      mockTeamRepo.findByName.mockResolvedValue(null);
      mockEmpRepo.findById.mockResolvedValue({ id: 'emp-100', name: 'Alice' });
      mockTeamRepo.create.mockResolvedValue({ id: 'team-sec', ...input });
      mockTeamRepo.addMember.mockResolvedValue(true);
      mockTeamRepo.findById.mockResolvedValue({ id: 'team-sec', ...input, memberCount: 1 });

      const res = await service.createTeam(input);
      expect(res.id).toBe('team-sec');
      expect(mockTeamRepo.addMember).toHaveBeenCalledWith('team-sec', 'emp-100', 'Lead');
    });

    it('should throw ConflictError if team name already exists', async () => {
      mockTeamRepo.findByName.mockResolvedValue({ id: 'existing', name: 'DevSecOps' });
      await expect(service.createTeam({ name: 'DevSecOps' })).rejects.toThrow(ConflictError);
    });

    it('should throw NotFoundError if leadId does not exist', async () => {
      mockTeamRepo.findByName.mockResolvedValue(null);
      mockEmpRepo.findById.mockResolvedValue(null);
      await expect(service.createTeam({ name: 'DevSecOps', leadId: 'invalid-lead' })).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateTeam', () => {
    it('should update team and auto-enroll new lead', async () => {
      mockTeamRepo.findById.mockResolvedValue({ id: 'team-1', name: 'DevOps', leadId: 'old-lead' });
      mockTeamRepo.findByName.mockResolvedValue(null);
      mockEmpRepo.findById.mockResolvedValue({ id: 'new-lead', name: 'Bob' });
      mockTeamRepo.addMember.mockResolvedValue(true);
      mockTeamRepo.update.mockResolvedValue({ id: 'team-1', name: 'DevOps', leadId: 'new-lead' });

      const res = await service.updateTeam('team-1', { leadId: 'new-lead' });
      expect(res.leadId).toBe('new-lead');
      expect(mockTeamRepo.addMember).toHaveBeenCalledWith('team-1', 'new-lead', 'Lead');
    });

    it('should throw ConflictError if updated name collides with another team', async () => {
      mockTeamRepo.findById.mockResolvedValue({ id: 'team-1', name: 'Team A' });
      mockTeamRepo.findByName.mockResolvedValue({ id: 'team-2', name: 'Team B' });

      await expect(service.updateTeam('team-1', { name: 'Team B' })).rejects.toThrow(ConflictError);
    });
  });

  describe('deleteTeam', () => {
    it('should delete team successfully', async () => {
      mockTeamRepo.findById.mockResolvedValue({ id: 'team-1' });
      mockTeamRepo.delete.mockResolvedValue(true);

      await expect(service.deleteTeam('team-1')).resolves.toBeUndefined();
      expect(mockTeamRepo.delete).toHaveBeenCalledWith('team-1');
    });

    it('should throw NotFoundError if team does not exist', async () => {
      mockTeamRepo.findById.mockResolvedValue(null);
      await expect(service.deleteTeam('missing')).rejects.toThrow(NotFoundError);
    });
  });

  describe('addMember & removeMember', () => {
    it('should add member when team and employee exist', async () => {
      mockTeamRepo.findById.mockResolvedValue({ id: 'team-1' });
      mockEmpRepo.findById.mockResolvedValue({ id: 'emp-1' });
      mockTeamRepo.addMember.mockResolvedValue(true);

      await expect(service.addMember('team-1', { employeeId: 'emp-1', role: 'Contributor' })).resolves.toBeUndefined();
      expect(mockTeamRepo.addMember).toHaveBeenCalledWith('team-1', 'emp-1', 'Contributor');
    });

    it('should remove member from roster', async () => {
      mockTeamRepo.findById.mockResolvedValue({ id: 'team-1' });
      mockTeamRepo.removeMember.mockResolvedValue(true);

      await expect(service.removeMember('team-1', 'emp-1')).resolves.toBeUndefined();
      expect(mockTeamRepo.removeMember).toHaveBeenCalledWith('team-1', 'emp-1');
    });
  });
});
