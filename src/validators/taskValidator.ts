import { z } from 'zod';
import {
  CreateTaskInput,
  UpdateTaskInput,
  UpdateTaskStatusInput,
  TaskFilterOptions
} from '../types/task.js';

const taskStatusEnum = z.enum(['Todo', 'Pending', 'Completed'], {
  errorMap: () => ({ message: "Status must be 'Todo', 'Pending', or 'Completed'" })
});

const taskPriorityEnum = z.enum(['Low', 'Medium', 'High', 'Urgent'], {
  errorMap: () => ({ message: "Priority must be 'Low', 'Medium', 'High', or 'Urgent'" })
});

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Due date must be in YYYY-MM-DD format' })
  .nullable()
  .optional();

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Task title is required' })
    .trim()
    .min(2, { message: 'Title must be at least 2 characters' })
    .max(200, { message: 'Title cannot exceed 200 characters' }),
  description: z
    .string()
    .trim()
    .max(2000, { message: 'Description cannot exceed 2000 characters' })
    .nullable()
    .optional(),
  status: taskStatusEnum.default('Todo'),
  priority: taskPriorityEnum.default('Medium'),
  teamId: z
    .string({ required_error: 'Team ID is required' })
    .uuid({ message: 'Invalid team ID format' }),
  assigneeId: z
    .string()
    .uuid({ message: 'Invalid assignee ID format' })
    .nullable()
    .optional(),
  dueDate: dateStringSchema
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { message: 'Title must be at least 2 characters' })
    .max(200, { message: 'Title cannot exceed 200 characters' })
    .optional(),
  description: z
    .string()
    .trim()
    .max(2000, { message: 'Description cannot exceed 2000 characters' })
    .nullable()
    .optional(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  teamId: z
    .string()
    .uuid({ message: 'Invalid team ID format' })
    .optional(),
  assigneeId: z
    .string()
    .uuid({ message: 'Invalid assignee ID format' })
    .nullable()
    .optional(),
  dueDate: dateStringSchema
});

export const updateTaskStatusSchema = z.object({
  status: taskStatusEnum
});

export const taskFilterSchema = z.object({
  teamId: z.string().uuid().optional(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  assigneeId: z.string().uuid().optional(),
  search: z.string().trim().optional()
});

export function validateCreateTask(input: unknown): CreateTaskInput {
  return createTaskSchema.parse(input) as CreateTaskInput;
}

export function validateUpdateTask(input: unknown): UpdateTaskInput {
  return updateTaskSchema.parse(input) as UpdateTaskInput;
}

export function validateUpdateTaskStatus(input: unknown): UpdateTaskStatusInput {
  return updateTaskStatusSchema.parse(input) as UpdateTaskStatusInput;
}

export function validateTaskFilters(input: unknown): TaskFilterOptions {
  return taskFilterSchema.parse(input) as TaskFilterOptions;
}
