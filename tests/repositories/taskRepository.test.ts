import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskRepository } from '../../src/repositories/taskRepository.js';

vi.mock('../../src/config/database.js', () => ({
  pool: {
    query: vi.fn(),
    connect: vi.fn()
  },
  query: vi.fn()
}));

describe('Task Repository', () => {
  let repository: TaskRepository;
  let mockQuery: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    repository = new TaskRepository();
    const dbModule = await import('../../src/config/database.js');
    mockQuery = dbModule.query;
  });

  describe('findAll', () => {
    it('should query tasks with team and assignee joins', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 'task-1',
            title: 'Setup Redis Cache',
            description: 'Implement caching layer',
            status: 'Todo',
            priority: 'High',
            team_id: 'team-1',
            team_name: 'Backend Engineering',
            team_department: 'Engineering',
            assignee_id: 'emp-1',
            assignee_name: 'Alex Mercer',
            assignee_email: 'alex@company.com',
            assignee_avatar_url: null,
            due_date: '2026-10-31',
            created_at: new Date(),
            updated_at: new Date()
          }
        ]
      });

      const tasks = await repository.findAll({ status: 'Todo', priority: 'High' });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('Setup Redis Cache');
      expect(tasks[0].teamName).toBe('Backend Engineering');
      expect(tasks[0].assignee?.name).toBe('Alex Mercer');
    });
  });

  describe('findById', () => {
    it('should return task when found by ID', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 'task-1',
            title: 'Setup Redis Cache',
            description: null,
            status: 'Todo',
            priority: 'Medium',
            team_id: 'team-1',
            team_name: 'Backend',
            team_department: 'Engineering',
            assignee_id: null,
            assignee_name: null,
            assignee_email: null,
            assignee_avatar_url: null,
            due_date: null,
            created_at: new Date(),
            updated_at: new Date()
          }
        ]
      });

      const task = await repository.findById('task-1');
      expect(task).not.toBeNull();
      expect(task?.assignee).toBeNull();
    });

    it('should return null if task does not exist', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const task = await repository.findById('missing');
      expect(task).toBeNull();
    });
  });

  describe('create', () => {
    it('should insert task and return full joined entity', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [{ id: 'new-task-id' }] }) // INSERT
        .mockResolvedValueOnce({
          rows: [
            {
              id: 'new-task-id',
              title: 'New Created Task',
              description: 'Details',
              status: 'Todo',
              priority: 'Medium',
              team_id: 'team-1',
              team_name: 'Core',
              team_department: 'Engineering',
              assignee_id: null,
              assignee_name: null,
              assignee_email: null,
              assignee_avatar_url: null,
              due_date: null,
              created_at: new Date(),
              updated_at: new Date()
            }
          ]
        }); // findById

      const created = await repository.create({
        title: 'New Created Task',
        description: 'Details',
        teamId: 'team-1'
      });

      expect(created.id).toBe('new-task-id');
      expect(created.title).toBe('New Created Task');
    });
  });

  describe('delete', () => {
    it('should execute DELETE query and return true', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });
      const res = await repository.delete('task-1');
      expect(res).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith('DELETE FROM tasks WHERE id = $1', ['task-1']);
    });
  });
});

