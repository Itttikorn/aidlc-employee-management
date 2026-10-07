import { app } from './app.js';
import { logger } from './utils/logger.js';
import { checkDatabaseHealth, closeDatabasePool } from './config/database.js';

const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer(): Promise<void> {
  const isDbHealthy = await checkDatabaseHealth();
  if (isDbHealthy) {
    logger.info('Connected to PostgreSQL database successfully');
  } else {
    logger.warn('Initial database health check failed. Starting HTTP server in degraded state.');
  }

  const server = app.listen(PORT, () => {
    logger.info(`Employee Management server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });

  const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down HTTP server gracefully.`);
    server.close(async () => {
      logger.info('HTTP server closed.');
      await closeDatabasePool();
      process.exit(0);
    });

    // Force exit after 10s timeout
    setTimeout(() => {
      logger.error('Forced shutdown due to timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

if (process.env.NODE_ENV !== 'test') {
  startServer().catch((err) => {
    logger.error('Fatal error starting server', err);
    process.exit(1);
  });
}
