import { PoolClient } from 'pg';
import { pool } from '../config/database.js';
import { logger } from './logger.js';
import { DatabaseError } from './errors.js';

/**
 * Execute a callback within an isolated PostgreSQL transaction.
 * Automatically handles BEGIN, COMMIT, ROLLBACK, and client release.
 *
 * @param callback Async function receiving an active PoolClient
 * @returns Result of the callback execution
 */
export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    logger.debug('Transaction BEGIN executed');

    const result = await callback(client);

    await client.query('COMMIT');
    logger.debug('Transaction COMMIT executed');

    return result;
  } catch (error) {
    logger.warn('Transaction failed, executing ROLLBACK', {
      error: error instanceof Error ? error.message : String(error)
    });
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      logger.error('Error during transaction ROLLBACK', rollbackError);
    }

    if (error instanceof Error) {
      throw error;
    }
    throw new DatabaseError('Transaction failed with an unknown error');
  } finally {
    client.release();
    logger.debug('Transaction client released to pool');
  }
}
