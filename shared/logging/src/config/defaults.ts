// shared/logging/src/config/defaults.ts

import type { LoggerConfig } from '../core/types.js';
import { LogLevel } from '../core/types.js';

export const DEFAULT_LOGGER_CONFIG: LoggerConfig = {
  serviceName: 'unknown-service',
  serviceVersion: '0.0.0',
  environment: (process.env.NODE_ENV as any) || 'development',

  console: {
    enabled: true,
    level: LogLevel.INFO,
    format: 'pretty',
    console: {
      colors: true,
      timestamps: true,
    }
  },
  file: {
    enabled: false,
    level: LogLevel.DEBUG,
    format: 'json',
    file: {
      path: './logs/app.log',
      maxSize: 10485760, // 10MB
      maxFiles: 5,
      rotationStrategy: 'size',
    }
  },
  monitoring: {
    enabled: false,
    level: LogLevel.ERROR,
    format: 'json',
    monitoring: {
      provider: 'sentry',
      sampleRate: 1.0,
    }
  },

  async: true,
  bufferSize: 1000,
  flushInterval: 5000, // 5 seconds

  autoContext: {
    includeTimestamp: true,
    includeHostname: true,
    includeProcessInfo: true,
    // Enable function capture only in development (performance cost in production)
    captureFunctionName: (process.env.NODE_ENV !== 'production'),
  }
};
