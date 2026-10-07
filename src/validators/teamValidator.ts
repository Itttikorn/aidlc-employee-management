import { z } from 'zod';
import { CreateTeamInput, UpdateTeamInput, AddTeamMemberInput, TeamFilterOptions } from '../types/team.js';

export const createTeamSchema = z.object({
  name: z
    .string({ required_error: 'Team name is required' })
    .trim()
    .min(2, { message: 'Team name must be at least 2 characters' })
    .max(100, { message: 'Team name cannot exceed 100 characters' }),
  description: z
    .string()
    .trim()
    .max(500, { message: 'Description cannot exceed 500 characters' })
    .nullable()
    .optional(),
  department: z
    .string()
    .trim()
    .min(2, { message: 'Department must be at least 2 characters' })
    .max(100, { message: 'Department cannot exceed 100 characters' })
    .default('Engineering'),
  leadId: z
    .string()
    .uuid({ message: 'Invalid team lead ID format' })
    .nullable()
    .optional()
});

export const updateTeamSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Team name must be at least 2 characters' })
    .max(100, { message: 'Team name cannot exceed 100 characters' })
    .optional(),
  description: z
    .string()
    .trim()
    .max(500, { message: 'Description cannot exceed 500 characters' })
    .nullable()
    .optional(),
  department: z
    .string()
    .trim()
    .min(2, { message: 'Department must be at least 2 characters' })
    .max(100, { message: 'Department cannot exceed 100 characters' })
    .optional(),
  leadId: z
    .string()
    .uuid({ message: 'Invalid team lead ID format' })
    .nullable()
    .optional()
});

export const addTeamMemberSchema = z.object({
  employeeId: z
    .string({ required_error: 'Employee ID is required' })
    .uuid({ message: 'Invalid employee ID format' }),
  role: z
    .string()
    .trim()
    .min(2, { message: 'Role must be at least 2 characters' })
    .max(50, { message: 'Role cannot exceed 50 characters' })
    .default('Core Member')
});

export const teamFilterSchema = z.object({
  department: z.string().trim().optional(),
  search: z.string().trim().optional()
});

export function validateCreateTeam(input: unknown): CreateTeamInput {
  return createTeamSchema.parse(input) as CreateTeamInput;
}

export function validateUpdateTeam(input: unknown): UpdateTeamInput {
  return updateTeamSchema.parse(input) as UpdateTeamInput;
}

export function validateAddTeamMember(input: unknown): AddTeamMemberInput {
  return addTeamMemberSchema.parse(input) as AddTeamMemberInput;
}

export function validateTeamFilters(input: unknown): TeamFilterOptions {
  return teamFilterSchema.parse(input) as TeamFilterOptions;
}
