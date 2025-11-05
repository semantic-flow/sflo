// shared/logging/src/config/schema.ts

// Note: This is a JSON Schema object definition, typically used by a validator like AJV.
// We define it here as a plain object for now.

export const LoggerConfigSchema = {
  type: 'object',
  properties: {
    serviceName: { type: 'string', minLength: 1 },
    serviceVersion: { type: 'string' },
    environment: {
      type: 'string',
      enum: ['development', 'staging', 'production']
    },
    instanceId: { type: 'string' },
    console: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean', default: true },
        level: { type: 'string', enum: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] },
        format: { type: 'string', enum: ['json', 'pretty', 'compact'] },
        colors: { type: 'boolean' },
        timestamps: { type: 'boolean' }
      }
    },
    file: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean', default: false },
        level: { type: 'string', enum: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] },
        format: { type: 'string', enum: ['json', 'pretty', 'compact'] },
        path: { type: 'string' },
        maxSize: { type: 'number', minimum: 1024 },
        maxFiles: { type: 'number', minimum: 1 },
        rotationStrategy: { type: 'string', enum: ['time', 'size'] }
      }
    },
    monitoring: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean', default: false },
        level: { type: 'string', enum: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] },
        provider: { type: 'string', enum: ['sentry', 'datadog', 'newrelic'] },
        dsn: { type: 'string' },
        environment: { type: 'string' },
        sampleRate: { type: 'number', minimum: 0, maximum: 1 }
      }
    },
    async: { type: 'boolean' },
    bufferSize: { type: 'number' },
    flushInterval: { type: 'number' },
    autoContext: {
      type: 'object',
      properties: {
        includeTimestamp: { type: 'boolean' },
        includeHostname: { type: 'boolean' },
        includeProcessInfo: { type: 'boolean' }
      }
    }
  },
  required: ['serviceName']
};
