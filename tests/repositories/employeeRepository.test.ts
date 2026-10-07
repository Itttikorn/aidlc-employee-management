import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmployeeRepository } from '../../src/repositories/employeeRepository.js';
import { pool } from '../../src/config/database.js';

vi.mock('../../src/config/database.js', () => ({
  pool: {
    query: vi.fn(),
    connect: vi.fn()
  }
}));

describe('Employee Repository', () => {
  let repository: EmployeeRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new EmployeeRepository();
  });

  describe('findAll', () => {
    it('should return paginated list of employees with team associations', async () => {
      const mockCount = { rows: [{ total: '1' }] };
      const mockEmployees = {
        rows: [
          {
            id: 'emp-1',
            name: 'Alice Johnson',
            full_name: 'Alice Johnson',
            email: 'alice@example.com',
            role: 'Lead Architect',
            position: 'Lead Architect',
            age: 34,
            avatar_url: 'https://example.com/avatar.png',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            teams: [{ id: 'team-1', name: 'Engineering', description: 'Core team' }]
          }
        ]
      };

      (pool.query as any)
        .mockResolvedValueOnce(mockCount)
        .mockResolvedValueOnce(mockEmployees);

      const result = await repository.findAll({ search: 'Alice', page: 1, limit: 10 });

      expect(result.pagination.total).toBe(1);
      expect(result.data.length).toBe(1);
      expect(result.data[0].name).toBe('Alice Johnson');
      expect(result.data[0].teams?.length).toBe(1);
      expect(result.data[0].teams?.[0].name).toBe('Engineering');
    });

    it('should handle team filtering option', async () => {
      (pool.query as any)
        .mockResolvedValueOnce({ rows: [{ total: '0' }] })
        .mockResolvedValueOnce({ rows: [] });

      const result = await repository.findAll({ teamId: 'team-123' });

      expect(result.pagination.total).toBe(0);
      expect(result.data).toEqual([]);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INNER JOIN employee_teams'),
        expect.arrayContaining(['team-123'])
      );
    });
  });

  describe('findById', () => {
    it('should return an employee record if found', async () => {
      (pool.query as any).mockResolvedValueOnce({
        rows: [
          {
            id: 'emp-123',
            name: 'Bob Ross',
            full_name: 'Bob Ross',
            email: 'bob@example.com',
            role: 'Designer',
            position: 'Designer',
            birthdate: '1984-06-15',
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            teams: []
          }
        ]
      });

      const employee = await repository.findById('emp-123');
      expect(employee).not.toBeNull();
      expect(employee?.name).toBe('Bob Ross');
      expect(employee?.birthDate).toBe('1984-06-15');
      expect(typeof employee?.age).toBe('number');
    });

    it('should return null if employee is not found', async () => {
      (pool.query as any).mockResolvedValueOnce({ rows: [] });

      const employee = await repository.findById('non-existent');
      expect(employee).toBeNull();
    });
  });

  describe('create', () => {
    it('should insert employee and associate teams within a transaction', async () => {
      const mockClient = {
        query: vi.fn(),
        release: vi.fn()
      };

      (pool.connect as any).mockResolvedValue(mockClient);

      mockClient.query
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: 'new-emp-id' }] }) // INSERT employee
        .mockResolvedValueOnce({}) // INSERT team 1
        .mockResolvedValueOnce({
          rows: [
            {
              id: 'new-emp-id',
              name: 'Charlie Brown',
              full_name: 'Charlie Brown',
              email: 'charlie@example.com',
              role: 'Developer',
              position: 'Developer',
              birthdate: '1998-04-12',
              age: 28,
              avatar_url: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              teams: [{ id: 'team-1', name: 'Frontend' }]
            }
          ]
        }) // findById
        .mockResolvedValueOnce({}); // COMMIT

      const created = await repository.create({
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        role: 'Developer',
        birthDate: '1998-04-12',
        teamIds: ['team-1']
      });

      expect(created.id).toBe('new-emp-id');
      expect(created.birthDate).toBe('1998-04-12');
      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('should return employee if found by email', async () => {
      (pool.query as any).mockResolvedValueOnce({
        rows: [
          {
            id: 'emp-10',
            name: 'Eve',
            email: 'eve@example.com',
            role: 'QA',
            age: 29
          }
        ]
      });

      const emp = await repository.findByEmail('eve@example.com');
      expect(emp?.email).toBe('eve@example.com');
    });

    it('should return null if email is not found', async () => {
      (pool.query as any).mockResolvedValueOnce({ rows: [] });
      const emp = await repository.findByEmail('missing@example.com');
      expect(emp).toBeNull();
    });
  });

  describe('update', () => {
    it('should update employee profile and overwrite team associations', async () => {
      const mockClient = {
        query: vi.fn(),
        release: vi.fn()
      };
      (pool.connect as any).mockResolvedValue(mockClient);

      mockClient.query
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({
          rows: [{ id: 'emp-1', name: 'Old', email: 'old@example.com', role: 'Dev', age: 20 }]
        }) // findById existing
        .mockResolvedValueOnce({ rows: [{ id: 'emp-1' }] }) // UPDATE employees
        .mockResolvedValueOnce({}) // DELETE employee_teams
        .mockResolvedValueOnce({}) // INSERT employee_teams team-2
        .mockResolvedValueOnce({
          rows: [
            { id: 'emp-1', name: 'Updated', email: 'updated@example.com', role: 'Lead', age: 21, teams: '[{"id":"team-2","name":"Backend"}]' }
          ]
        }) // findById updated
        .mockResolvedValueOnce({}); // COMMIT

      const res = await repository.update('emp-1', {
        name: 'Updated',
        email: 'updated@example.com',
        role: 'Lead',
        age: 21,
        teamIds: ['team-2']
      });

      expect(res?.name).toBe('Updated');
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE employees'),
        expect.anything()
      );
    });

    it('should return null if employee to update does not exist', async () => {
      const mockClient = { query: vi.fn(), release: vi.fn() };
      (pool.connect as any).mockResolvedValue(mockClient);
      mockClient.query
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({ rows: [] }) // findById
        .mockResolvedValueOnce({}); // COMMIT

      const res = await repository.update('non-existent', { name: 'None' });
      expect(res).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete team associations and employee record atomically', async () => {
      const mockClient = {
        query: vi.fn(),
        release: vi.fn()
      };

      (pool.connect as any).mockResolvedValue(mockClient);

      mockClient.query
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({}) // DELETE employee_teams
        .mockResolvedValueOnce({ rowCount: 1 }) // DELETE employees
        .mockResolvedValueOnce({}); // COMMIT

      const deleted = await repository.delete('emp-to-delete');
      expect(deleted).toBe(true);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM employee_teams WHERE employee_id = $1'),
        ['emp-to-delete']
      );
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM employees WHERE id = $1'),
        ['emp-to-delete']
      );
    });
  });
});

