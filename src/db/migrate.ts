import fs from 'node:fs';
import path from 'node:path';
import { pool } from '../config/database.js';
import { logger } from '../utils/logger.js';

interface MigrationRow {
  version: string;
  applied_at: Date;
}

/**
 * Ensures the schema_migrations tracking table exists.
 */
export async function ensureMigrationTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

/**
 * Retrieves list of already applied migration versions.
 */
export async function getAppliedMigrations(): Promise<string[]> {
  await ensureMigrationTable();
  const res = await pool.query<MigrationRow>(
    'SELECT version FROM schema_migrations ORDER BY version ASC'
  );
  return res.rows.map((row) => row.version);
}

/**
 * Runs all pending migrations in alphabetical order.
 */
export async function runMigrations(migrationsDir?: string): Promise<string[]> {
  const dir = migrationsDir || path.resolve(process.cwd(), 'migrations');
  logger.info('Starting database migration process', { migrationsDir: dir });

  if (!fs.existsSync(dir)) {
    logger.warn('No migrations directory found, skipping migrations', { dir });
    return [];
  }

  await ensureMigrationTable();
  const applied = await getAppliedMigrations();

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const newlyApplied: string[] = [];

  for (const file of files) {
    if (applied.includes(file)) {
      logger.debug('Migration already applied, skipping', { file });
      continue;
    }

    const filePath = path.join(dir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      logger.info(`Applying migration: ${file}`);

      await client.query(sql);
      await client.query(
        'INSERT INTO schema_migrations (version, applied_at) VALUES ($1, CURRENT_TIMESTAMP)',
        [file]
      );

      await client.query('COMMIT');
      newlyApplied.push(file);
      logger.info(`Successfully applied migration: ${file}`);
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error(`Failed to apply migration: ${file}`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  logger.info('Migration process complete', { newlyAppliedCount: newlyApplied.length });
  return newlyApplied;
}

// Direct execution support via tsx
if (process.argv[1]?.endsWith('migrate.ts') || process.argv[1]?.endsWith('migrate.js')) {
  runMigrations()
    .then((applied) => {
      console.log(`Migrations complete. Applied ${applied.length} migration(s).`);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
