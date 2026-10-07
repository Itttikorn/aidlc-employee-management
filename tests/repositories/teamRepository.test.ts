import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TeamRepository } from '../../src/repositories/teamRepository.js';
import { pool } from '../../src/config/database.js';

vi.mock('../../src/config/database.js', () => ({
  pool: {
    query: vi.fn(),
    connect: vi.fn()
  },
  query: vi.fn()
}));

describe('Team Repository', () => {
  let repository: TeamRepository;
  let mockQuery: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    repository = new TeamRepository();
    const dbModule = await import('../../src/config/database.js');
    mockQuery = dbModule.query;
  });

  describe('findAll', () => {
    it('should query teams and map records properly', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 'team-1',
            name: 'Core Infra',
            description: 'Handles platform',
            department: 'Engineering',
            lead_id: 'emp-1',
            lead_name: 'John Doe',
            lead_email: 'john@example.com',
            lead_avatar_url: null,
            member_count: '2',
            members_json: [
              { id: 'emp-1', name: 'John Doe', email: 'john@example.com', role: 'Lead' },
              { id: 'emp-2', name: 'Jane Doe', email: 'jane@example.com', role: 'Core Member' }
            ],
            created_at: new Date(),
            updated_at: new Date()
          }
        ]
      });

      const teams = await repository.findAll({ department: 'Engineering', search: 'Core' });
      expect(teams).toHaveLength(1);
      expect(teams[0].name).toBe('Core Infra');
      expect(teams[0].lead?.name).toBe('John Doe');
      expect(teams[0].memberCount).toBe(2);
      expect(teams[0].members).toHaveLength(2);
    });
  });

  describe('findById', () => {
    it('should return team when found by ID', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 'team-1',
            name: 'Core Infra',
            description: 'Handles platform',
            department: 'Engineering',
            lead_id: null,
            lead_name: null,
            lead_email: null,
            lead_avatar_url: null,
            member_count: 0,
            members_json: [],
            created_at: new Date(),
            updated_at: new Date()
          }
        ]
      });

      const team = await repository.findById('team-1');
      expect(team).not.toBeNull();
      expect(team?.id).toBe('team-1');
      expect(team?.lead).toBeNull();
    });

    it('should return null when team ID does not exist', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const team = await repository.findById('missing');
      expect(team).toBeNull();
    });
  });

  describe('findByName', () => {
    it('should find team by case-insensitive name', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 'team-1',
            name: 'DevSecOps',
            department: 'Security',
            lead_id: null,
            member_count: 0,
            created_at: new Date(),
            updated_at: new Date()
          }
        ]
      });

      const team = await repository.findByName('devsecops');
      expect(team?.name).toBe('DevSecOps');
    });
  });

  describe('create', () => {
    it('should insert new team and return instance', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 'new-team-id',
            name: 'AI Engineering',
            description: 'ML systems',
            department: 'Engineering',
            lead_id: null,
            created_at: new Date(),
            updated_at: new Date()
          }
        ]
      });

      const res = await repository.create({
        name: 'AI Engineering',
        description: 'ML systems',
        department: 'Engineering'
      });

      expect(res.id).toBe('new-team-id');
      expect(res.name).toBe('AI Engineering');
    });
  });

  describe('addMember & removeMember', () => {
    it('should insert member into employee_teams table', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });
      const added = await repository.addMember('team-1', 'emp-1', 'Lead');
      expect(added).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO employee_teams'),
        ['team-1', 'emp-1', 'Lead']
      );
    });

    it('should delete member from employee_teams table', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });
      const removed = await repository.removeMember('team-1', 'emp-1');
      expect(removed).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM employee_teams'),
        ['team-1', 'emp-1']
      );
    });
  });
});
