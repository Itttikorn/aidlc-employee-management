import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import * as dbConfig from '../../src/config/database.js';

describe('Health & Diagnostic Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /health should return 200 and healthy status when database is connected', async () => {
    vi.spyOn(dbConfig, 'checkDatabaseHealth').mockResolvedValueOnce(true);

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'healthy',
      services: {
        database: 'connected'
      }
    });
    expect(response.body.timestamp).toBeDefined();
    expect(response.body.uptime).toBeDefined();
  });

  it('GET /health should return 503 and degraded status when database is disconnected', async () => {
    vi.spyOn(dbConfig, 'checkDatabaseHealth').mockResolvedValueOnce(false);

    const response = await request(app).get('/health');

    expect(response.status).toBe(503);
    expect(response.body).toMatchObject({
      status: 'degraded',
      services: {
        database: 'disconnected'
      }
    });
  });

  it('GET /api should return 200 with API metadata', async () => {
    const response = await request(app).get('/api');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      name: 'Employee Management API',
      version: '1.0.0'
    });
  });

  it('GET /unknown-route should return 404', async () => {
    const response = await request(app).get('/api/does-not-exist');

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      status: 'fail',
      statusCode: 404
    });
  });
});
