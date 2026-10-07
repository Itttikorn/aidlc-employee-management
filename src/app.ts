import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { checkDatabaseHealth } from './config/database.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import path from 'node:path';
import { employeeRouter } from './routes/employeeRoutes.js';
import { teamRouter } from './routes/teamRoutes.js';

export function createApp(): Express {
  const app = express();

  // Standard middleware
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));

  // Static assets serving
  const clientDir = path.resolve(process.cwd(), 'src/client');
  const stylesDir = path.resolve(process.cwd(), 'src/styles');
  app.use('/client', express.static(clientDir));
  app.use('/styles', express.static(stylesDir));

  // Serve Single Page Application at root
  app.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(clientDir, 'index.html'));
  });

  // Health check endpoint
  app.get(['/health', '/api/health'], async (_req: Request, res: Response) => {
    const dbHealthy = await checkDatabaseHealth();
    const status = dbHealthy ? 'healthy' : 'degraded';
    const statusCode = dbHealthy ? 200 : 503;

    res.status(statusCode).json({
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: dbHealthy ? 'connected' : 'disconnected'
      }
    });
  });

  // Employee Directory & Team routes
  app.use('/api/employees', employeeRouter);
  app.use('/api/teams', teamRouter);

  // Base API route
  app.get('/api', (_req: Request, res: Response) => {
    res.json({
      name: 'Employee Management API',
      version: '1.0.0',
      description: 'API for Employee Directory, Teams, Tasks, and Analytics'
    });
  });

  // 404 handler
  app.use(notFoundHandler);

  // Error handling middleware
  app.use(errorHandler);

  return app;
}

export const app = createApp();
