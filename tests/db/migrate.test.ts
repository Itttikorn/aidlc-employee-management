import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runMigrations, ensureMigrationTable, getAppliedMigrations } from '../../src/db/migrate.js';
import { pool } from '../../src/config/database.js';
import fs from 'node:fs';
import type { PoolClient } from 'pg';

vi.mock('../../src/config/database.js', () => {
  return {
    pool: {
      connect: vi.fn(),
      query: vi.fn()
    }
  };
});

vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>();
  return {
    ...actual,
    default: {
      ...actual,
      existsSync: vi.fn(),
      readdirSync: vi.fn(),
      readFileSync: vi.fn()
    },
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    readFileSync: vi.fn()
  };
});

describe('Database Migration Runner', () => {
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
    vi.mocked(pool.query).mockResolvedValue({ rows: [], rowCount: 0 } as never);
  });

  it('should ensure schema_migrations table exists', async () => {
    await ensureMigrationTable();
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('CREATE TABLE IF NOT EXISTS schema_migrations')
    );
  });

  it('should return empty list when no migrations have been applied', async () => {
    vi.mocked(pool.query).mockResolvedValueOnce({ rows: [], rowCount: 0 } as never);
    const applied = await getAppliedMigrations();
    expect(applied).toEqual([]);
  });

  it('should return applied migration list', async () => {
    vi.mocked(pool.query)
      .mockResolvedValueOnce({ rows: [], rowCount: 0 } as never) // for ensure table
      .mockResolvedValueOnce({
        rows: [{ version: '001_create_schema.sql', applied_at: new Date() }],
        rowCount: 1
      } as never);

    const applied = await getAppliedMigrations();
    expect(applied).toEqual(['001_create_schema.sql']);
  });

  it('should skip migrations if directory does not exist', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    const applied = await runMigrations('/non-existent-dir');
    expect(applied).toEqual([]);
  });

  it('should apply unapplied SQL migrations in sequence', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue([
      '001_create_schema.sql' as unknown as fs.Dirent
    ]);
    vi.mocked(fs.readFileSync).mockReturnValue('CREATE TABLE test (id INT);');

    // Applied migrations returns empty
    vi.mocked(pool.query)
      .mockResolvedValueOnce({ rows: [], rowCount: 0 } as never)
      .mockResolvedValueOnce({ rows: [], rowCount: 0 } as never);

    const applied = await runMigrations('/dummy-migrations');

    expect(applied).toEqual(['001_create_schema.sql']);
    expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
    expect(mockClient.query).toHaveBeenCalledWith('CREATE TABLE test (id INT);');
    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO schema_migrations'),
      ['001_create_schema.sql']
    );
    expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should rollback transaction when migration execution fails', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue([
      '001_bad_syntax.sql' as unknown as fs.Dirent
    ]);
    vi.mocked(fs.readFileSync).mockReturnValue('BAD SQL SYNTAX;');

    vi.mocked(pool.query)
      .mockResolvedValueOnce({ rows: [], rowCount: 0 } as never)
      .mockResolvedValueOnce({ rows: [], rowCount: 0 } as never);

    mockClient.query.mockImplementation(async (sql: string) => {
      if (sql === 'BAD SQL SYNTAX;') {
        throw new Error('Syntax error in migration SQL');
      }
      return { rows: [], rowCount: 0 };
    });

    await expect(runMigrations('/dummy-migrations')).rejects.toThrow('Syntax error in migration SQL');
    expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    expect(mockClient.release).toHaveBeenCalled();
  });
});
