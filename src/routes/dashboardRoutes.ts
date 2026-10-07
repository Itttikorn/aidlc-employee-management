import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController.js';

export const dashboardRouter = Router();

// Dashboard Analytics Route
dashboardRouter.get('/stats', dashboardController.getStats);
