import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import pg from 'pg';
import { pool, query, checkDatabaseHealth, closeDatabasePool } from '../../src/config/database.js';
import { DatabaseError } from '../../src/utils/errors.js';

vi.mock('pg', () => {
  const mPool = {
    query: vi.fn(),
    end: vi.fn().mockResolvedValue(undefined),
    on: vi.fn(),
    connect: vi.fn()
  };
  return {
    default: {
      Pool: vi.fn(() => mPool)
    },
    Pool: vi.fn(() => mPool)
  };
});

describe('Database Configuration & Connection Pooling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should instantiate connection pool successfully', () => {
    expect(pool).toBeDefined();
    expect(pool.query).toBeDefined();
  });

  it('should execute parameterized queries correctly', async () => {
    const mockRows = [{ id: '1', name: 'Engineering' }];
    vi.mocked(pool.query).mockResolvedValueOnce({
      rows: mockRows,
      rowCount: 1,
      command: 'SELECT',
      oid: 0,
      fields: []
    } as never);

    const res = await query('SELECT * FROM teams WHERE id = $1', ['1']);
    expect(res.rows).toEqual(mockRows);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM teams WHERE id = $1', ['1']);
  });

  it('should throw DatabaseError and log when query fails', async () => {
    vi.mocked(pool.query).mockRejectedValueOnce(new Error('Connection timeout'));

    await expect(query('SELECT 1')).rejects.toThrow(DatabaseError);
  });

  it('should return true when health check ping succeeds', async () => {
    vi.mocked(pool.query).mockResolvedValueOnce({
      rows: [{ ok: 1 }],
      rowCount: 1,
      command: 'SELECT',
      oid: 0,
      fields: []
    } as never);

    const isHealthy = await checkDatabaseHealth();
    expect(isHealthy).toBe(true);
  });

  it('should return false when health check ping fails', async () => {
    vi.mocked(pool.query).mockRejectedValueOnce(new Error('DB unreachable'));

    const isHealthy = await checkDatabaseHealth();
    expect(isHealthy).toBe(false);
  });

  it('should close pool cleanly on shutdown', async () => {
    await closeDatabasePool();
    expect(pool.end).toHaveBeenCalled();
  });
});
