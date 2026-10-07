import { describe, it, expect } from 'vitest';
import {
  validateCreateTask,
  validateUpdateTask,
  validateUpdateTaskStatus,
  validateTaskFilters
} from '../../src/validators/taskValidator.js';
import { ZodError } from 'zod';

describe('Task Validator', () => {
  describe('validateCreateTask', () => {
    it('should validate valid task creation input', () => {
      const input = {
        title: 'Implement Database Connection Pooling',
        description: 'Set max connections to 20',
        status: 'Todo',
        priority: 'High',
        teamId: '123e4567-e89b-12d3-a456-426614174000',
        assigneeId: '223e4567-e89b-12d3-a456-426614174000',
        dueDate: '2026-10-31'
      };
      const result = validateCreateTask(input);
      expect(result.title).toBe('Implement Database Connection Pooling');
      expect(result.priority).toBe('High');
      expect(result.status).toBe('Todo');
    });

    it('should assign default status (Todo) and priority (Medium) if omitted', () => {
      const input = {
        title: 'Draft architecture overview',
        teamId: '123e4567-e89b-12d3-a456-426614174000'
      };
      const result = validateCreateTask(input);
      expect(result.status).toBe('Todo');
      expect(result.priority).toBe('Medium');
    });

    it('should reject task title shorter than 2 characters', () => {
      expect(() => validateCreateTask({
        title: 'A',
        teamId: '123e4567-e89b-12d3-a456-426614174000'
      })).toThrow(ZodError);
    });

    it('should reject invalid teamId uuid format', () => {
      expect(() => validateCreateTask({
        title: 'Valid Title',
        teamId: 'invalid-team-uuid'
      })).toThrow(ZodError);
    });

    it('should reject invalid status value', () => {
      expect(() => validateCreateTask({
        title: 'Valid Title',
        teamId: '123e4567-e89b-12d3-a456-426614174000',
        status: 'InReview' as any
      })).toThrow(ZodError);
    });

    it('should reject invalid dueDate format', () => {
      expect(() => validateCreateTask({
        title: 'Valid Title',
        teamId: '123e4567-e89b-12d3-a456-426614174000',
        dueDate: '31/10/2026'
      })).toThrow(ZodError);
    });
  });

  describe('validateUpdateTask', () => {
    it('should accept partial task update', () => {
      const input = { priority: 'Urgent' as const, description: 'Updated note' };
      const result = validateUpdateTask(input);
      expect(result.priority).toBe('Urgent');
      expect(result.description).toBe('Updated note');
    });
  });

  describe('validateUpdateTaskStatus', () => {
    it('should validate valid status change', () => {
      const result = validateUpdateTaskStatus({ status: 'Pending' });
      expect(result.status).toBe('Pending');
    });

    it('should reject unknown status string', () => {
      expect(() => validateUpdateTaskStatus({ status: 'Done' })).toThrow(ZodError);
    });
  });

  describe('validateTaskFilters', () => {
    it('should validate filter parameters', () => {
      const filters = validateTaskFilters({
        status: 'Todo',
        priority: 'Urgent',
        search: '  migration  '
      });
      expect(filters.status).toBe('Todo');
      expect(filters.priority).toBe('Urgent');
      expect(filters.search).toBe('migration');
    });
  });
});
