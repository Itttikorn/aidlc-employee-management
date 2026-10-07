import { taskRepository, TaskRepository } from '../repositories/taskRepository.js';
import { teamRepository, TeamRepository } from '../repositories/teamRepository.js';
import { employeeRepository, EmployeeRepository } from '../repositories/employeeRepository.js';
import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  UpdateTaskStatusInput,
  TaskFilterOptions,
  TaskStatus
} from '../types/task.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export class TaskService {
  constructor(
    private taskRepo: TaskRepository = taskRepository,
    private teamRepo: TeamRepository = teamRepository,
    private empRepo: EmployeeRepository = employeeRepository
  ) {}

  /**
   * Retrieve all tasks with optional filters.
   */
  async getTasks(filters: TaskFilterOptions = {}): Promise<Task[]> {
    return await this.taskRepo.findAll(filters);
  }

  /**
   * Retrieve single task by ID.
   */
  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepo.findById(id);
    if (!task) {
      throw new NotFoundError(`Task with ID '${id}' not found`);
    }
    return task;
  }

  /**
   * Create a new task with team and assignee referential validation.
   */
  async createTask(input: CreateTaskInput): Promise<Task> {
    logger.info('Creating new task', { title: input.title, teamId: input.teamId });

    // Validate team existence
    const team = await this.teamRepo.findById(input.teamId);
    if (!team) {
      throw new NotFoundError(`Team with ID '${input.teamId}' not found`);
    }

    // Validate assignee if provided
    if (input.assigneeId) {
      const assignee = await this.empRepo.findById(input.assigneeId);
      if (!assignee) {
        throw new NotFoundError(`Assignee employee with ID '${input.assigneeId}' not found`);
      }
    }

    return await this.taskRepo.create(input);
  }

  /**
   * Update task fields with referential checks.
   */
  async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    logger.info('Updating task', { id });

    const current = await this.taskRepo.findById(id);
    if (!current) {
      throw new NotFoundError(`Task with ID '${id}' not found`);
    }

    if (input.teamId && input.teamId !== current.teamId) {
      const team = await this.teamRepo.findById(input.teamId);
      if (!team) {
        throw new NotFoundError(`Team with ID '${input.teamId}' not found`);
      }
    }

    if (input.assigneeId && input.assigneeId !== current.assigneeId) {
      const assignee = await this.empRepo.findById(input.assigneeId);
      if (!assignee) {
        throw new NotFoundError(`Assignee employee with ID '${input.assigneeId}' not found`);
      }
    }

    if (input.status) {
      this.validateStatusTransition(current.status, input.status);
    }

    const updated = await this.taskRepo.update(id, input);
    if (!updated) {
      throw new NotFoundError(`Task with ID '${id}' not found after update`);
    }

    return updated;
  }

  /**
   * Advance or change task status according to 3-stage FSM rules.
   */
  async updateTaskStatus(id: string, input: UpdateTaskStatusInput): Promise<Task> {
    logger.info('Updating task status', { id, newStatus: input.status });

    const current = await this.taskRepo.findById(id);
    if (!current) {
      throw new NotFoundError(`Task with ID '${id}' not found`);
    }

    this.validateStatusTransition(current.status, input.status);

    const updated = await this.taskRepo.update(id, { status: input.status });
    if (!updated) {
      throw new NotFoundError(`Task with ID '${id}' not found`);
    }

    return updated;
  }

  /**
   * Delete task by ID.
   */
  async deleteTask(id: string): Promise<void> {
    logger.info('Deleting task', { id });

    const existing = await this.taskRepo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Task with ID '${id}' not found`);
    }

    const deleted = await this.taskRepo.delete(id);
    if (!deleted) {
      throw new NotFoundError(`Failed to delete task with ID '${id}'`);
    }
  }

  /**
   * Validate Finite State Machine transition.
   */
  private validateStatusTransition(current: TaskStatus, target: TaskStatus): void {
    if (current === target) return;

    const allowedTransitions: Record<TaskStatus, TaskStatus[]> = {
      Todo: ['Pending', 'Completed'],
      Pending: ['Todo', 'Completed'],
      Completed: ['Pending', 'Todo']
    };

    if (!allowedTransitions[current]?.includes(target)) {
      throw new ValidationError(`Invalid task status transition from '${current}' to '${target}'`);
    }
  }
}

export const taskService = new TaskService();

