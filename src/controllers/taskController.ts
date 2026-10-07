import { Request, Response, NextFunction } from 'express';
import { taskService, TaskService } from '../services/taskService.js';
import {
  validateCreateTask,
  validateUpdateTask,
  validateUpdateTaskStatus,
  validateTaskFilters
} from '../validators/taskValidator.js';
import { TaskStatus, TaskPriority } from '../types/task.js';

export class TaskController {
  constructor(private readonly service: TaskService = taskService) {}

  getAllTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = validateTaskFilters({
        teamId: req.query.teamId as string | undefined,
        status: req.query.status as TaskStatus | undefined,
        priority: req.query.priority as TaskPriority | undefined,
        assigneeId: req.query.assigneeId as string | undefined,
        search: req.query.search as string | undefined
      });
      const data = await this.service.getTasks(filters);
      res.status(200).json({
        success: true,
        data,
        total: data.length
      });
    } catch (error) {
      next(error);
    }
  };

  getTaskById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const data = await this.service.getTaskById(id);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

  createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedInput = validateCreateTask(req.body);
      const data = await this.service.createTask(validatedInput);
      res.status(201).json({
        success: true,
        data,
        message: 'Task created successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const validatedInput = validateUpdateTask(req.body);
      const data = await this.service.updateTask(id, validatedInput);
      res.status(200).json({
        success: true,
        data,
        message: 'Task updated successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  updateTaskStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const validatedInput = validateUpdateTaskStatus(req.body);
      const data = await this.service.updateTaskStatus(id, validatedInput);
      res.status(200).json({
        success: true,
        data,
        message: `Task status transitioned to ${validatedInput.status}`
      });
    } catch (error) {
      next(error);
    }
  };

  deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.service.deleteTask(id);
      res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}

export const taskController = new TaskController();
