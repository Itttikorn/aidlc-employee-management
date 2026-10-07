import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmployeeService } from '../../src/services/employeeService.js';
import { NotFoundError, ConflictError } from '../../src/utils/errors.js';

describe('Employee Service', () => {
  let mockRepo: any;
  let service: EmployeeService;

  beforeEach(() => {
    mockRepo = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    };
    service = new EmployeeService(mockRepo);
  });

  describe('getEmployees', () => {
    it('should query repository with parsed filter options', async () => {
      mockRepo.findAll.mockResolvedValue({
        data: [],
        pagination: { total: 0, page: 1, limit: 12, totalPages: 1 }
      });

      const result = await service.getEmployees({ search: 'Dev', page: 1 });
      expect(mockRepo.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'Dev', page: 1, limit: 12 })
      );
      expect(result.pagination.total).toBe(0);
    });
  });

  describe('getEmployeeById', () => {
    it('should return employee when found', async () => {
      const mockEmp = { id: 'emp-1', name: 'John Doe', email: 'john@example.com' };
      mockRepo.findById.mockResolvedValue(mockEmp);

      const res = await service.getEmployeeById('emp-1');
      expect(res).toEqual(mockEmp);
    });

    it('should throw NotFoundError when employee does not exist', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.getEmployeeById('non-existent')).rejects.toThrow(NotFoundError);
    });
  });

  describe('createEmployee', () => {
    it('should create employee if email is unique and inputs are valid', async () => {
      const input = {
        name: 'New Person',
        email: 'unique@example.com',
        role: 'Engineer',
        birthDate: '1995-03-20'
      };

      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue({ id: 'new-id', ...input, age: 31 });

      const res = await service.createEmployee(input);
      expect(res.id).toBe('new-id');
      expect(mockRepo.create).toHaveBeenCalled();
    });

    it('should throw ConflictError if email already exists', async () => {
      const input = {
        name: 'Existing Person',
        email: 'duplicate@example.com',
        role: 'Engineer'
      };

      mockRepo.findByEmail.mockResolvedValue({ id: 'existing-id', email: 'duplicate@example.com' });

      await expect(service.createEmployee(input)).rejects.toThrow(ConflictError);
      expect(mockRepo.create).not.toHaveBeenCalled();
    });
  });

  describe('updateEmployee', () => {
    it('should update employee when valid', async () => {
      const existing = { id: 'emp-1', name: 'Old Name', email: 'old@example.com', role: 'Dev' };
      mockRepo.findById.mockResolvedValue(existing);
      mockRepo.update.mockResolvedValue({ ...existing, name: 'New Name' });

      const res = await service.updateEmployee('emp-1', { name: 'New Name' });
      expect(res.name).toBe('New Name');
    });

    it('should throw ConflictError if updated email collides with another employee', async () => {
      const existing = { id: 'emp-1', name: 'Old Name', email: 'old@example.com', role: 'Dev' };
      mockRepo.findById.mockResolvedValue(existing);
      mockRepo.findByEmail.mockResolvedValue({ id: 'emp-2', email: 'taken@example.com' });

      await expect(service.updateEmployee('emp-1', { email: 'taken@example.com' })).rejects.toThrow(ConflictError);
    });

    it('should throw NotFoundError if repo update returns null', async () => {
      const existing = { id: 'emp-1', name: 'Old Name', email: 'old@example.com', role: 'Dev' };
      mockRepo.findById.mockResolvedValue(existing);
      mockRepo.update.mockResolvedValue(null);

      await expect(service.updateEmployee('emp-1', { name: 'New' })).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteEmployee', () => {
    it('should delete employee successfully', async () => {
      mockRepo.findById.mockResolvedValue({ id: 'emp-1' });
      mockRepo.delete.mockResolvedValue(true);

      await expect(service.deleteEmployee('emp-1')).resolves.toBeUndefined();
      expect(mockRepo.delete).toHaveBeenCalledWith('emp-1');
    });

    it('should throw NotFoundError if employee to delete does not exist', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.deleteEmployee('emp-99')).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if repo delete returns false', async () => {
      mockRepo.findById.mockResolvedValue({ id: 'emp-1' });
      mockRepo.delete.mockResolvedValue(false);

      await expect(service.deleteEmployee('emp-1')).rejects.toThrow(NotFoundError);
    });
  });
});

