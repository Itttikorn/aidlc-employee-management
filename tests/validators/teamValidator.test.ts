import { describe, it, expect } from 'vitest';
import {
  validateCreateTeam,
  validateUpdateTeam,
  validateAddTeamMember,
  validateTeamFilters
} from '../../src/validators/teamValidator.js';
import { ZodError } from 'zod';

describe('Team Validator', () => {
  describe('validateCreateTeam', () => {
    it('should validate valid team payload', () => {
      const input = {
        name: 'Core Infrastructure',
        description: 'Handles databases, CI/CD, and hosting',
        department: 'Engineering',
        leadId: '123e4567-e89b-12d3-a456-426614174000'
      };
      const result = validateCreateTeam(input);
      expect(result.name).toBe('Core Infrastructure');
      expect(result.department).toBe('Engineering');
    });

    it('should assign default department if omitted', () => {
      const input = { name: 'UX Design Team' };
      const result = validateCreateTeam(input);
      expect(result.department).toBe('Engineering');
    });

    it('should reject team with name shorter than 2 characters', () => {
      expect(() => validateCreateTeam({ name: 'A' })).toThrow(ZodError);
    });

    it('should reject invalid leadId uuid format', () => {
      expect(() => validateCreateTeam({ name: 'Valid Team', leadId: 'invalid-uuid' })).toThrow(ZodError);
    });
  });

  describe('validateUpdateTeam', () => {
    it('should accept partial updates', () => {
      const input = { description: 'Updated description' };
      const result = validateUpdateTeam(input);
      expect(result.description).toBe('Updated description');
    });

    it('should reject invalid team name on update', () => {
      expect(() => validateUpdateTeam({ name: ' ' })).toThrow(ZodError);
    });
  });

  describe('validateAddTeamMember', () => {
    it('should validate valid member assignment', () => {
      const input = {
        employeeId: '123e4567-e89b-12d3-a456-426614174000',
        role: 'Lead'
      };
      const result = validateAddTeamMember(input);
      expect(result.role).toBe('Lead');
    });

    it('should default role to Core Member if omitted', () => {
      const input = { employeeId: '123e4567-e89b-12d3-a456-426614174000' };
      const result = validateAddTeamMember(input);
      expect(result.role).toBe('Core Member');
    });

    it('should reject invalid employee UUID', () => {
      expect(() => validateAddTeamMember({ employeeId: 'not-a-uuid' })).toThrow(ZodError);
    });
  });

  describe('validateTeamFilters', () => {
    it('should trim filter parameters', () => {
      const filters = validateTeamFilters({ department: ' Engineering ', search: ' Core ' });
      expect(filters.department).toBe('Engineering');
      expect(filters.search).toBe('Core');
    });
  });
});

