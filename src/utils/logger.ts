/**
 * Structured Logger Utility
 * Provides JSON-structured logging with correlation and timestamp support.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogPayload {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export const logger = {
  info(message: string, context?: Record<string, unknown>): void {
    logMessage('info', message, context);
  },

  warn(message: string, context?: Record<string, unknown>): void {
    logMessage('warn', message, context);
  },

  error(message: string, error?: Error | unknown, context?: Record<string, unknown>): void {
    const errorObj = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    } : (error ? { name: 'UnknownError', message: String(error) } : undefined);

    logMessage('error', message, context, errorObj);
  },

  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true') {
      logMessage('debug', message, context);
    }
  }
};

function logMessage(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
  error?: { name: string; message: string; stack?: string }
): void {
  const payload: LogPayload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context ? { context } : {}),
    ...(error ? { error } : {})
  };

  const output = JSON.stringify(payload);
  if (level === 'error') {
    console.error(output);
  } else if (level === 'warn') {
    console.warn(output);
  } else {
    console.log(output);
  }
}
