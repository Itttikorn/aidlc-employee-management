import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { employeeService } from '../../src/services/employeeService.js';
import { NotFoundError, ConflictError } from '../../src/utils/errors.js';

vi.mock('../../src/services/employeeService.js', () => ({
  employeeService: {
    getEmployees: vi.fn(),
    getEmployeeById: vi.fn(),
    createEmployee: vi.fn(),
    updateEmployee: vi.fn(),
    deleteEmployee: vi.fn()
  }
}));

describe('Employee API Routes (/api/employees)', () => {
  let app: any;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createApp();
  });

  describe('GET /api/employees', () => {
    it('should return paginated list of employees (200 OK)', async () => {
      const mockResult = {
        data: [
          {
            id: 'emp-1',
            name: 'John Doe',
            fullName: 'John Doe',
            email: 'john@example.com',
            role: 'Engineer',
            position: 'Engineer',
            age: 30,
            teams: []
          }
        ],
        pagination: { total: 1, page: 1, limit: 12, totalPages: 1 }
      };

      (employeeService.getEmployees as any).mockResolvedValue(mockResult);

      const res = await request(app).get('/api/employees?search=John&page=1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.pagination.total).toBe(1);
    });
  });

  describe('GET /api/employees/:id', () => {
    it('should return 200 OK with employee profile when found', async () => {
      const mockEmp = {
        id: 'emp-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Engineer'
      };
      (employeeService.getEmployeeById as any).mockResolvedValue(mockEmp);

      const res = await request(app).get('/api/employees/emp-1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('emp-1');
    });

    it('should return 404 Not Found when employee does not exist', async () => {
      (employeeService.getEmployeeById as any).mockRejectedValue(new NotFoundError('Employee not found'));

      const res = await request(app).get('/api/employees/unknown');
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('fail');
      expect(res.body.message).toContain('not found');
    });
  });

  describe('POST /api/employees', () => {
    it('should return 201 Created when employee profile is valid', async () => {
      const newEmp = {
        id: 'emp-new',
        name: 'Alice',
        email: 'alice@example.com',
        role: 'Designer',
        age: 26
      };
      (employeeService.createEmployee as any).mockResolvedValue(newEmp);

      const res = await request(app)
        .post('/api/employees')
        .send({ name: 'Alice', email: 'alice@example.com', role: 'Designer', age: 26 });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('emp-new');
    });

    it('should return 409 Conflict when email already exists', async () => {
      (employeeService.createEmployee as any).mockRejectedValue(new ConflictError('Email already exists'));

      const res = await request(app)
        .post('/api/employees')
        .send({ name: 'Duplicate', email: 'dup@example.com', role: 'Dev' });

      expect(res.status).toBe(409);
      expect(res.body.status).toBe('fail');
      expect(res.body.message).toContain('already exists');
    });
  });

  describe('PUT /api/employees/:id', () => {
    it('should return 200 OK when employee is updated', async () => {
      const updated = {
        id: 'emp-1',
        name: 'Alice Updated',
        email: 'alice@example.com',
        role: 'Lead Designer'
      };
      (employeeService.updateEmployee as any).mockResolvedValue(updated);

      const res = await request(app)
        .put('/api/employees/emp-1')
        .send({ name: 'Alice Updated' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Alice Updated');
    });
  });

  describe('DELETE /api/employees/:id', () => {
    it('should return 200 OK when employee is deleted', async () => {
      (employeeService.deleteEmployee as any).mockResolvedValue(undefined);

      const res = await request(app).delete('/api/employees/emp-1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('deleted');
    });
  });
});

