import pg, { PoolConfig, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';
import { DatabaseError } from '../utils/errors.js';

dotenv.config();

const poolConfig: PoolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      max: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS || '30000', 10),
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT_MS || '2000', 10),
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'employee_mgmt',
      max: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS || '30000', 10),
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT_MS || '2000', 10),
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    };

export const pool = new pg.Pool(poolConfig);

pool.on('error', (err) => {
  logger.error('Unexpected error on idle PostgreSQL client pool', err);
});

/**
 * Execute a parameterized query using the pool.
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    logger.debug('Executed database query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    logger.error('Database query execution failed', error, { text });
    throw new DatabaseError(
      error instanceof Error ? error.message : 'Database query execution failed',
      { queryText: text }
    );
  }
}

/**
 * Check if the database connection is healthy.
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const res = await pool.query('SELECT 1 AS ok');
    return res.rows.length > 0 && res.rows[0].ok === 1;
  } catch (error) {
    logger.error('Database health check ping failed', error);
    return false;
  }
}

/**
 * Close database pool connections cleanly.
 */
export async function closeDatabasePool(): Promise<void> {
  try {
    await pool.end();
    logger.info('Database connection pool successfully closed');
  } catch (error) {
    logger.error('Error closing database connection pool', error);
    throw error;
  }
}
