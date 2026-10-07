import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskService } from '../../src/services/taskService.js';
import { NotFoundError, ValidationError } from '../../src/utils/errors.js';

describe('Task Service', () => {
  let mockTaskRepo: any;
  let mockTeamRepo: any;
  let mockEmpRepo: any;
  let service: TaskService;

  beforeEach(() => {
    mockTaskRepo = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    };
    mockTeamRepo = {
      findById: vi.fn()
    };
    mockEmpRepo = {
      findById: vi.fn()
    };
    service = new TaskService(mockTaskRepo, mockTeamRepo, mockEmpRepo);
  });

  describe('getTasks & getTaskById', () => {
    it('should return tasks with filters', async () => {
      mockTaskRepo.findAll.mockResolvedValue([{ id: 'task-1', title: 'Task 1' }]);
      const res = await service.getTasks({ status: 'Todo' });
      expect(mockTaskRepo.findAll).toHaveBeenCalledWith({ status: 'Todo' });
      expect(res).toHaveLength(1);
    });

    it('should return single task when found', async () => {
      mockTaskRepo.findById.mockResolvedValue({ id: 'task-1', title: 'Task 1' });
      const res = await service.getTaskById('task-1');
      expect(res.title).toBe('Task 1');
    });

    it('should throw NotFoundError when task does not exist', async () => {
      mockTaskRepo.findById.mockResolvedValue(null);
      await expect(service.getTaskById('missing')).rejects.toThrow(NotFoundError);
    });
  });

  describe('createTask', () => {
    it('should create task when team and assignee exist', async () => {
      const input = {
        title: 'New Feature Task',
        teamId: 'team-1',
        assigneeId: 'emp-1',
        status: 'Todo' as const,
        priority: 'Medium' as const
      };

      mockTeamRepo.findById.mockResolvedValue({ id: 'team-1', name: 'Dev Team' });
      mockEmpRepo.findById.mockResolvedValue({ id: 'emp-1', name: 'Alice' });
      mockTaskRepo.create.mockResolvedValue({ id: 'task-new', ...input });

      const res = await service.createTask(input);
      expect(res.id).toBe('task-new');
      expect(mockTaskRepo.create).toHaveBeenCalledWith(input);
    });

    it('should throw NotFoundError if team does not exist', async () => {
      mockTeamRepo.findById.mockResolvedValue(null);
      await expect(service.createTask({
        title: 'Task',
        teamId: 'invalid-team'
      })).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if assigneeId does not exist', async () => {
      mockTeamRepo.findById.mockResolvedValue({ id: 'team-1' });
      mockEmpRepo.findById.mockResolvedValue(null);
      await expect(service.createTask({
        title: 'Task',
        teamId: 'team-1',
        assigneeId: 'invalid-emp'
      })).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateTask & updateTaskStatus (FSM)', () => {
    it('should allow valid FSM status transitions', async () => {
      mockTaskRepo.findById.mockResolvedValue({ id: 'task-1', status: 'Todo' });
      mockTaskRepo.update.mockResolvedValue({ id: 'task-1', status: 'Pending' });

      const updated = await service.updateTaskStatus('task-1', { status: 'Pending' });
      expect(updated.status).toBe('Pending');
    });

    it('should update task directly to Completed', async () => {
      mockTaskRepo.findById.mockResolvedValue({ id: 'task-1', status: 'Pending' });
      mockTaskRepo.update.mockResolvedValue({ id: 'task-1', status: 'Completed' });

      const updated = await service.updateTaskStatus('task-1', { status: 'Completed' });
      expect(updated.status).toBe('Completed');
    });

    it('should throw NotFoundError if task does not exist during status update', async () => {
      mockTaskRepo.findById.mockResolvedValue(null);
      await expect(service.updateTaskStatus('missing', { status: 'Completed' })).rejects.toThrow(NotFoundError);
    });

    it('should update task details when valid', async () => {
      mockTaskRepo.findById.mockResolvedValue({ id: 'task-1', title: 'Old Title', teamId: 'team-1' });
      mockTaskRepo.update.mockResolvedValue({ id: 'task-1', title: 'New Title', teamId: 'team-1' });

      const res = await service.updateTask('task-1', { title: 'New Title' });
      expect(res.title).toBe('New Title');
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      mockTaskRepo.findById.mockResolvedValue({ id: 'task-1' });
      mockTaskRepo.delete.mockResolvedValue(true);

      await expect(service.deleteTask('task-1')).resolves.toBeUndefined();
      expect(mockTaskRepo.delete).toHaveBeenCalledWith('task-1');
    });

    it('should throw NotFoundError if task to delete does not exist', async () => {
      mockTaskRepo.findById.mockResolvedValue(null);
      await expect(service.deleteTask('missing')).rejects.toThrow(NotFoundError);
    });
  });
});
