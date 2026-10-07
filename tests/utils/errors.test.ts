import { describe, it, expect } from 'vitest';
import {
  AppError,
  NotFoundError,
  ValidationError,
  ConflictError,
  DatabaseError,
  UnauthorizedError
} from '../../src/utils/errors.js';

describe('Custom Error Hierarchy', () => {
  it('should initialize AppError with correct defaults', () => {
    const error = new AppError('Something went wrong', 500, true, { field: 'name' });
    expect(error.message).toBe('Something went wrong');
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(true);
    expect(error.details).toEqual({ field: 'name' });
    expect(error).toBeInstanceOf(Error);
  });

  it('should initialize NotFoundError with status 404', () => {
    const error = new NotFoundError('Employee not found');
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Employee not found');
    expect(error.isOperational).toBe(true);
  });

  it('should initialize ValidationError with status 400 and detail payload', () => {
    const details = [{ field: 'email', message: 'Invalid email format' }];
    const error = new ValidationError('Invalid input parameters', details);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Invalid input parameters');
    expect(error.details).toEqual(details);
  });

  it('should initialize ConflictError with status 409', () => {
    const error = new ConflictError('Email already exists');
    expect(error.statusCode).toBe(409);
    expect(error.message).toBe('Email already exists');
  });

  it('should initialize DatabaseError with status 500', () => {
    const error = new DatabaseError('Foreign key violation');
    expect(error.statusCode).toBe(500);
    expect(error.message).toBe('Foreign key violation');
  });

  it('should initialize UnauthorizedError with status 401', () => {
    const error = new UnauthorizedError();
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Unauthorized access');
  });
});
