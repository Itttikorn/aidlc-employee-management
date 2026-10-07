import { Request, Response, NextFunction } from 'express';
import { dashboardService, DashboardService } from '../services/dashboardService.js';

export class DashboardController {
  constructor(private readonly service: DashboardService = dashboardService) {}

  getStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getDashboardStats();
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };
}

export const dashboardController = new DashboardController();

