import { describe, it, expect } from 'vitest';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  employeeQuerySchema
} from '../../src/validators/employeeValidator.js';

describe('Employee Validator', () => {
  describe('createEmployeeSchema', () => {
    it('should validate a valid employee creation input with name, role, and birthDate', () => {
      const input = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Developer',
        birthDate: '1995-06-15',
        teamIds: ['123e4567-e89b-12d3-a456-426614174000']
      };

      const parsed = createEmployeeSchema.parse(input);
      expect(parsed.name).toBe('John Doe');
      expect(parsed.email).toBe('john.doe@example.com');
      expect(parsed.birthDate).toBe('1995-06-15');
    });

    it('should validate with birthDate and compute valid age', () => {
      const input = {
        fullName: 'Jane Smith',
        email: 'jane.smith@example.com',
        position: 'Architect',
        birthDate: '1990-05-15'
      };

      const parsed = createEmployeeSchema.parse(input);
      expect(parsed.fullName).toBe('Jane Smith');
      expect(parsed.birthDate).toBe('1990-05-15');
    });

    it('should reject underage birthdate (< 18 years old)', () => {
      const now = new Date();
      const underAgeYear = now.getFullYear() - 10;
      const input = {
        name: 'Young Kid',
        email: 'kid@example.com',
        role: 'Intern',
        birthDate: `${underAgeYear}-01-01`
      };

      expect(() => createEmployeeSchema.parse(input)).toThrow(/between 18 and 120 years old/);
    });

    it('should reject invalid email format', () => {
      const input = {
        name: 'John Doe',
        email: 'not-an-email',
        role: 'Developer'
      };

      expect(() => createEmployeeSchema.parse(input)).toThrow(/Invalid email/);
    });

    it('should reject under-age employee (birthDate indicating < 18 years)', () => {
      const now = new Date();
      const underAgeYear = now.getFullYear() - 17;
      const input = {
        name: 'Junior Developer',
        email: 'junior@example.com',
        role: 'Intern',
        birthDate: `${underAgeYear}-01-01`
      };

      expect(() => createEmployeeSchema.parse(input)).toThrow(/between 18 and 120 years old/);
    });

    it('should reject over-age employee (birthDate indicating > 120 years)', () => {
      const now = new Date();
      const overAgeYear = now.getFullYear() - 130;
      const input = {
        name: 'Senior Person',
        email: 'senior@example.com',
        role: 'Advisor',
        birthDate: `${overAgeYear}-01-01`
      };

      expect(() => createEmployeeSchema.parse(input)).toThrow(/between 18 and 120 years old/);
    });

    it('should reject short name (< 2 chars)', () => {
      const input = {
        name: 'A',
        email: 'a@example.com',
        role: 'Developer'
      };

      expect(() => createEmployeeSchema.parse(input)).toThrow(/at least 2 characters/);
    });

    it('should reject missing name/fullName or role/position', () => {
      const input1 = {
        email: 'missing@example.com',
        role: 'Developer'
      };
      expect(() => createEmployeeSchema.parse(input1)).toThrow(/Either name or fullName must be provided/);

      const input2 = {
        name: 'Missing Role',
        email: 'missing@example.com'
      };
      expect(() => createEmployeeSchema.parse(input2)).toThrow(/Either role or position must be provided/);
    });
  });

  describe('employeeQuerySchema', () => {
    it('should apply defaults for page, limit, and sort parameters', () => {
      const parsed = employeeQuerySchema.parse({});
      expect(parsed.page).toBe(1);
      expect(parsed.limit).toBe(12);
      expect(parsed.sortBy).toBe('createdAt');
      expect(parsed.sortOrder).toBe('DESC');
    });

    it('should parse search and filter criteria correctly', () => {
      const query = {
        search: 'Jane',
        teamId: 'team-uuid-1',
        page: '2',
        limit: '20',
        sortBy: 'name',
        sortOrder: 'ASC'
      };

      const parsed = employeeQuerySchema.parse(query);
      expect(parsed.search).toBe('Jane');
      expect(parsed.teamId).toBe('team-uuid-1');
      expect(parsed.page).toBe(2);
      expect(parsed.limit).toBe(20);
      expect(parsed.sortBy).toBe('name');
      expect(parsed.sortOrder).toBe('ASC');
    });
  });
});

