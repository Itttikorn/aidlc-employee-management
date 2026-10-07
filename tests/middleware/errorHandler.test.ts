import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { errorHandler, notFoundHandler } from '../../src/middleware/errorHandler.js';
import { NotFoundError, ValidationError, AppError } from '../../src/utils/errors.js';

describe('Error Handling Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      path: '/api/test',
      method: 'GET'
    };
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };
    mockNext = vi.fn();
  });

  it('should handle AppError and send custom status and JSON response', () => {
    const error = new NotFoundError('Team not found');

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'fail',
        statusCode: 404,
        message: 'Team not found'
      })
    );
  });

  it('should handle ValidationError and include details object', () => {
    const details = [{ field: 'email', message: 'Required' }];
    const error = new ValidationError('Invalid inputs', details);

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'fail',
        statusCode: 400,
        message: 'Invalid inputs',
        details
      })
    );
  });

  it('should handle standard unhandled errors with 500 status and generic message in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const error = new Error('Secret database password leaked in syntax error');

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      statusCode: 500,
      message: 'An unexpected internal server error occurred'
    });

    process.env.NODE_ENV = originalEnv;
  });

  it('should route 404 for unmatched paths via notFoundHandler', () => {
    notFoundHandler(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: 'Cannot GET /api/test - Endpoint not found'
      })
    );
  });
});
