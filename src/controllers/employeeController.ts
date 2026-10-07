import { Request, Response, NextFunction } from 'express';
import { employeeService, EmployeeService } from '../services/employeeService.js';

export class EmployeeController {
  constructor(private readonly service: EmployeeService = employeeService) {}

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { search, teamId, page, limit, sortBy, sortOrder } = req.query;
      const result = await this.service.getEmployees({
        search: search as string | undefined,
        teamId: teamId as string | undefined,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        sortBy: sortBy as any,
        sortOrder: sortOrder as any
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const employee = await this.service.getEmployeeById(id);
      res.status(200).json({
        success: true,
        data: employee
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employee = await this.service.createEmployee(req.body);
      res.status(201).json({
        success: true,
        data: employee,
        message: 'Employee created successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const employee = await this.service.updateEmployee(id, req.body);
      res.status(200).json({
        success: true,
        data: employee,
        message: 'Employee updated successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.service.deleteEmployee(id);
      res.status(200).json({
        success: true,
        message: 'Employee deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}

export const employeeController = new EmployeeController();

