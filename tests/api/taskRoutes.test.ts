import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { taskService } from '../../src/services/taskService.js';
import { NotFoundError, ValidationError } from '../../src/utils/errors.js';

vi.mock('../../src/services/taskService.js', () => ({
  taskService: {
    getTasks: vi.fn(),
    getTaskById: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    updateTaskStatus: vi.fn(),
    deleteTask: vi.fn()
  }
}));

describe('Task API Routes (/api/tasks)', () => {
  let app: any;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createApp();
  });

  describe('GET /api/tasks', () => {
    it('should return list of tasks (200 OK)', async () => {
      const mockTasks = [
        {
          id: 'task-1',
          title: 'Implement Task Board',
          status: 'Todo',
          priority: 'High',
          teamId: 'team-1'
        }
      ];

      (taskService.getTasks as any).mockResolvedValue(mockTasks);

      const res = await request(app).get('/api/tasks?status=Todo');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.total).toBe(1);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return 200 OK with task details when found', async () => {
      const mockTask = {
        id: 'task-1',
        title: 'Task 1',
        status: 'Todo'
      };
      (taskService.getTaskById as any).mockResolvedValue(mockTask);

      const res = await request(app).get('/api/tasks/task-1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('task-1');
    });

    it('should return 404 Not Found if task is missing', async () => {
      (taskService.getTaskById as any).mockRejectedValue(new NotFoundError('Task not found'));

      const res = await request(app).get('/api/tasks/unknown');
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('fail');
    });
  });

  describe('POST /api/tasks', () => {
    it('should return 201 Created on valid task creation', async () => {
      const newTask = {
        id: 'task-new',
        title: 'Build UI',
        teamId: '123e4567-e89b-12d3-a456-426614174000',
        status: 'Todo',
        priority: 'Medium'
      };
      (taskService.createTask as any).mockResolvedValue(newTask);

      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Build UI',
          teamId: '123e4567-e89b-12d3-a456-426614174000'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('task-new');
    });

    it('should return 400 Bad Request on invalid payload', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'A' }); // missing teamId and too short

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('fail');
    });
  });

  describe('PATCH /api/tasks/:id/status', () => {
    it('should return 200 OK on successful status transition', async () => {
      const updated = {
        id: 'task-1',
        title: 'Task 1',
        status: 'Pending'
      };
      (taskService.updateTaskStatus as any).mockResolvedValue(updated);

      const res = await request(app)
        .patch('/api/tasks/task-1/status')
        .send({ status: 'Pending' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('Pending');
    });

    it('should return 400 Bad Request on invalid status value', async () => {
      const res = await request(app)
        .patch('/api/tasks/task-1/status')
        .send({ status: 'InvalidStatus' });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('fail');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should return 200 OK on task deletion', async () => {
      (taskService.deleteTask as any).mockResolvedValue(undefined);

      const res = await request(app).delete('/api/tasks/task-1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('deleted');
    });
  });
});

