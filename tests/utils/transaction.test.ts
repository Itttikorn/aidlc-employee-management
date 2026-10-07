import { describe, it, expect, vi, beforeEach } from 'vitest';
import { withTransaction } from '../../src/utils/transaction.js';
import { pool } from '../../src/config/database.js';
import { DatabaseError } from '../../src/utils/errors.js';
import type { PoolClient } from 'pg';

vi.mock('../../src/config/database.js', () => {
  return {
    pool: {
      connect: vi.fn(),
      query: vi.fn()
    }
  };
});

describe('Transaction Manager Utility', () => {
  let mockClient: {
    query: ReturnType<typeof vi.fn>;
    release: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = {
      query: vi.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
      release: vi.fn()
    };
    vi.mocked(pool.connect).mockResolvedValue(mockClient as unknown as PoolClient);
  });

  it('should execute transaction callback, commit and release client on success', async () => {
    const result = await withTransaction(async (client) => {
      await client.query('INSERT INTO teams (name) VALUES ($1)', ['Design']);
      return { success: true };
    });

    expect(result).toEqual({ success: true });
    expect(pool.connect).toHaveBeenCalled();
    expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
    expect(mockClient.query).toHaveBeenCalledWith('INSERT INTO teams (name) VALUES ($1)', ['Design']);
    expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should rollback transaction and release client when callback throws', async () => {
    const customError = new Error('Insert failed due to constraint');

    await expect(
      withTransaction(async () => {
        throw customError;
      })
    ).rejects.toThrow('Insert failed due to constraint');

    expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
    expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should handle non-Error thrown objects by wrapping in DatabaseError', async () => {
    await expect(
      withTransaction(async () => {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw 'string error';
      })
    ).rejects.toThrow(DatabaseError);

    expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    expect(mockClient.release).toHaveBeenCalled();
  });
});
