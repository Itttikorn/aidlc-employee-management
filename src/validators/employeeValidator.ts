import { z } from 'zod';

export function calculateAge(birthDate: string | Date): number {
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export const createEmployeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(150, 'Name cannot exceed 150 characters').optional(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(150, 'Full name cannot exceed 150 characters').optional(),
  email: z.string().email('Invalid email address').max(255, 'Email cannot exceed 255 characters'),
  role: z.string().min(2, 'Role must be at least 2 characters').max(100, 'Role cannot exceed 100 characters').optional(),
  position: z.string().min(2, 'Position must be at least 2 characters').max(100, 'Position cannot exceed 100 characters').optional(),
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid birthdate format'
  }).refine((val) => {
    const age = calculateAge(val);
    return age >= 18 && age <= 120;
  }, {
    message: 'Employee must be between 18 and 120 years old based on birthdate'
  }).nullable().optional(),
  avatarUrl: z.string().max(7000000, 'Avatar payload exceeds maximum allowed size (5MB)').nullable().optional(),
  teamIds: z.array(z.string()).optional()
}).refine((data) => data.name !== undefined || data.fullName !== undefined, {
  message: 'Either name or fullName must be provided',
  path: ['name']
}).refine((data) => data.role !== undefined || data.position !== undefined, {
  message: 'Either role or position must be provided',
  path: ['role']
});

export const updateEmployeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(150, 'Name cannot exceed 150 characters').optional(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(150, 'Full name cannot exceed 150 characters').optional(),
  email: z.string().email('Invalid email address').max(255, 'Email cannot exceed 255 characters').optional(),
  role: z.string().min(2, 'Role must be at least 2 characters').max(100, 'Role cannot exceed 100 characters').optional(),
  position: z.string().min(2, 'Position must be at least 2 characters').max(100, 'Position cannot exceed 100 characters').optional(),
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid birthdate format'
  }).refine((val) => {
    const age = calculateAge(val);
    return age >= 18 && age <= 120;
  }, {
    message: 'Employee must be between 18 and 120 years old based on birthdate'
  }).nullable().optional(),
  avatarUrl: z.string().max(7000000, 'Avatar payload exceeds maximum allowed size (5MB)').nullable().optional(),
  teamIds: z.array(z.string()).optional()
});

export const employeeQuerySchema = z.object({
  search: z.string().optional(),
  teamId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  sortBy: z.enum(['name', 'email', 'role', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['ASC', 'DESC']).default('DESC')
});
