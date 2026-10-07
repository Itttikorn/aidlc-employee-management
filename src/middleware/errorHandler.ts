import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

interface ErrorResponse {
  status: 'error' | 'fail';
  message: string;
  statusCode: number;
  details?: unknown;
  stack?: string;
}

/**
 * Central Error Handling Middleware
 * Sanitizes errors, formats responses consistently, and conforms to PDPA & security baselines.
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (err instanceof AppError) {
    const statusCode = err.statusCode;
    const status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

    logger.warn('Operational error handled', {
      statusCode,
      message: err.message,
      path: req.path,
      method: req.method,
      details: err.details
    });

    const responsePayload: ErrorResponse = {
      status,
      statusCode,
      message: err.message,
      ...(err.details !== undefined ? { details: err.details } : {}),
      ...(isDevelopment && err.stack ? { stack: err.stack } : {})
    };

    res.status(statusCode).json(responsePayload);
    return;
  }

  // Unhandled / system errors
  logger.error('Unhandled system exception', err, {
    path: req.path,
    method: req.method
  });

  const responsePayload: ErrorResponse = {
    status: 'error',
    statusCode: 500,
    message: isDevelopment ? err.message : 'An unexpected internal server error occurred',
    ...(isDevelopment && err.stack ? { stack: err.stack } : {})
  };

  res.status(500).json(responsePayload);
}

/**
 * 404 Not Found Middleware for unmatched routes
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  const err = new AppError(`Cannot ${req.method} ${req.path} - Endpoint not found`, 404);
  next(err);
}
