---
id: ewpjwhqsry5j49gdfj9xd0b
title: Logging and Error Handling
desc: ''
updated: 1762365200861
created: 1762362594296
---

# Logging and Error Handling

Developer guide for the `@semantic-flow/logging` package - a production-ready logging and error handling system for the Semantic Flow Node.js platform.

## Overview

The logging system provides:
- **Unified API** for both CLI tools and long-running services
- **Structured logging** with JSON Lines output format
- **Context propagation** using AsyncLocalStorage
- **Type-safe error handling** with custom error types
- **Multiple output channels** (console, file, monitoring)
- **Performance tracking** with built-in timers
- **Pure ESM** with full TypeScript support

## Quick Start

### Basic Usage

```typescript
import { getLogger } from '@semantic-flow/logging';

const logger = getLogger();

logger.info('Application started');
logger.debug('Debug information', { userId: '123' });
logger.error('Something went wrong', new Error('Failed'), { operation: 'db-query' });
```

### CLI Tool Usage

```typescript
import { createCliLogger } from '@semantic-flow/logging';

const logger = createCliLogger({ 
  verbose: process.argv.includes('--verbose'),
  format: 'pretty' 
});

logger.info('Processing files...');
```

### Service Usage

```typescript
import { createServiceLogger, ContextManager } from '@semantic-flow/logging';

const logger = createServiceLogger('semantic-flow-api', {
  enableFileLogging: true,
  enableMonitoring: true,
  environment: process.env.NODE_ENV
});

// HTTP middleware with automatic context propagation
app.use((req, res, next) => {
  const context = {
    operation: 'http-request',
    requestId: req.id,
    metadata: { method: req.method, path: req.path }
  };
  
  ContextManager.run(context, () => {
    req.logger = logger.child({ component: 'http-handler' });
    next();
  });
});
```

### Component-Scoped Logger

```typescript
import { getComponentLogger } from '@semantic-flow/logging';

// Automatically includes component name from file path
const logger = getComponentLogger(import.meta.url);

logger.info('Component initialized'); // Logs with component: 'my-module'
```

## Core Concepts

### Log Levels

The system uses numeric log levels for easy comparison and filtering:

```typescript
enum LogLevel {
  TRACE = 0,   // Detailed trace information
  DEBUG = 10,  // Debug information
  INFO = 20,   // Informational messages
  WARN = 30,   // Warning messages
  ERROR = 40,  // Error messages
  FATAL = 50   // Fatal errors that require attention
}
```

### Log Context

Context is automatically merged and propagated:

```typescript
interface LogContext {
  // Core identification
  operation?: string;
  operationId?: string;
  component?: string;
  function?: string;      // Automatically captured calling function name
  
  // Semantic Flow specific
  meshId?: string;
  nodeId?: string;
  meshName?: string;
  nodeName?: string;
  
  // Performance tracking
  startTime?: number;
  duration?: number;
  memoryUsage?: number;
  
  // Request context
  requestId?: string;
  userId?: string;
  sessionId?: string;
  
  // Flexible metadata
  tags?: Record<string, string>;
  metadata?: Record<string, unknown>;
}
```

#### Function Name Capture

The logger can automatically capture the calling function or method name and include it in the log context. This feature is useful for debugging and tracing but has a performance cost.

**Automatic Capture:**
```typescript
const logger = getLogger();

async function processUserData(userId: string) {
  // Function name 'processUserData' automatically captured
  logger.info('Starting user data processing', { userId });
  // Logs: { function: 'processUserData', userId: '123', ... }
}
```

**Configuration:**
```typescript
initLogger({
  serviceName: 'my-service',
  autoContext: {
    captureFunctionName: true,  // Enable function name capture
    includeTimestamp: true,
    includeHostname: true,
    includeProcessInfo: true
  }
});
```

**Environment-Aware Defaults:**
- **Development**: Function capture is enabled by default (`NODE_ENV !== 'production'`)
- **Production**: Function capture is disabled by default for performance
- **Override**: Can be explicitly enabled/disabled in configuration

**Performance Considerations:**
- Function name capture uses stack trace parsing, which has a measurable performance cost
- In production environments with high-throughput logging, consider disabling this feature
- Enable selectively for debugging or development environments
- Manual context provides better control: `logger.info('msg', { function: 'myFunc' })`

**Examples:**

```typescript
// Development mode - automatic capture
process.env.NODE_ENV = 'development';
const logger = getLogger();

class AuthService {
  async login(credentials) {
    // Captures 'AuthService.login' automatically
    logger.info('Login attempt', { email: credentials.email });
  }
}

// Production mode - disabled by default
process.env.NODE_ENV = 'production';
const prodLogger = getLogger();

async function processPayment(orderId) {
  // No automatic function capture in production
  logger.info('Processing payment', { orderId });
}

// Explicit override - enabled in production
const debugLogger = createLogger({
  serviceName: 'payment-service',
  environment: 'production',
  autoContext: {
    captureFunctionName: true  // Force enable for debugging
  }
});
```

### Child Loggers

Child loggers inherit and merge context immutably:

```typescript
const parentLogger = getLogger();
const childLogger = parentLogger.child({ component: 'auth' });
const grandchildLogger = childLogger.withOperation('login', 'op-123');

// Each logger has its own context without affecting parents
childLogger.info('Auth module loaded');
grandchildLogger.info('Login attempt');
```

## API Reference

### Logger Interface

```typescript
interface Logger {
  // Core logging methods
  trace(message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: Error, context?: LogContext): void;
  fatal(message: string, error?: Error, context?: LogContext): void;
  
  // Context management
  withContext(context: LogContext): Logger;
  withOperation(operation: string, operationId?: string): Logger;
  withComponent(component: string): Logger;
  child(context: LogContext): Logger; // Alias for withContext
  
  // Performance tracking
  startTimer(operation: string): Timer;
  
  // Error capture
  captureError(error: unknown, options?: ErrorCaptureOptions): void;
  
  // Lifecycle
  flush(): Promise<void>;
  close(): Promise<void>;
}
```

### Factory Functions

#### `initLogger(config?)`
Initializes the global logger singleton. Call once at application startup.

```typescript
import { initLogger } from '@semantic-flow/logging';

initLogger({
  serviceName: 'my-service',
  environment: 'production',
  console: {
    enabled: true,
    level: LogLevel.INFO,
    format: 'json'
  }
});
```

#### `getLogger()`
Returns the global logger singleton. Automatically picks up AsyncLocalStorage context.

```typescript
import { getLogger } from '@semantic-flow/logging';

const logger = getLogger();
```

#### `createLogger(config?)`
Creates a new, independent logger instance (non-singleton).

```typescript
import { createLogger } from '@semantic-flow/logging';

const customLogger = createLogger({
  serviceName: 'custom-service',
  async: false // Synchronous logging
});
```

#### `createCliLogger(options?)`
Creates a logger optimized for CLI tools with pretty output.

```typescript
import { createCliLogger } from '@semantic-flow/logging';

const logger = createCliLogger({
  verbose: true,  // Enable debug logging
  quiet: false,   // Disable info logging
  format: 'pretty' // Use colored output
});
```

#### `createServiceLogger(serviceName, options?)`
Creates a logger optimized for long-running services with JSON output.

```typescript
import { createServiceLogger } from '@semantic-flow/logging';

const logger = createServiceLogger('api-server', {
  enableFileLogging: true,
  enableMonitoring: true,
  environment: 'production'
});
```

#### `getComponentLogger(sourceUrl)`
Creates a component-scoped logger using `import.meta.url`.

```typescript
import { getComponentLogger } from '@semantic-flow/logging';

const logger = getComponentLogger(import.meta.url);
// Automatically includes component: 'mesh-processor' from file path
```

### Performance Tracking

```typescript
const timer = logger.startTimer('data-processing');

// Do work...

timer.checkpoint('validation-complete', { recordCount: 100 });

// More work...

timer.end({ totalRecords: 500, duration: 1234 });
```

## Configuration

### Logger Configuration

```typescript
interface LoggerConfig {
  serviceName: string;
  serviceVersion: string;
  environment: 'development' | 'staging' | 'production';
  instanceId?: string;
  
  // Channel configurations
  console: ChannelConfig;
  file: ChannelConfig;
  monitoring: ChannelConfig;
  
  // Performance settings
  async: boolean;        // Buffered writes vs synchronous
  bufferSize: number;    // Buffer size for async writes
  flushInterval: number; // Auto-flush interval (ms)
  
  // Auto-context settings
  autoContext: {
    includeTimestamp: boolean;
    includeHostname: boolean;
    includeProcessInfo: boolean;
    captureFunctionName: boolean;  // Enable automatic function name capture
  };
}
```

**Auto-Context Configuration Details:**

- `includeTimestamp`: Adds timestamp to every log entry (default: `true`)
- `includeHostname`: Includes hostname in log entries (default: `true`)
- `includeProcessInfo`: Includes process ID in log entries (default: `true`)
- `captureFunctionName`: Automatically captures calling function/method name (default: `NODE_ENV !== 'production'`)
  - **Enabled by default in development** for better debugging
  - **Disabled by default in production** for performance
  - Can be explicitly overridden in configuration

### Channel Configuration

```typescript
interface ChannelConfig {
  enabled: boolean;
  level: LogLevel;
  format: 'json' | 'pretty' | 'compact';
  
  // Channel-specific options
  console?: {
    colors?: boolean;
    timestamps?: boolean;
  };
  file?: {
    path?: string;
    maxSize?: number;
    maxFiles?: number;
    rotationStrategy?: 'time' | 'size';
  };
  monitoring?: {
    provider: 'sentry' | 'datadog' | 'newrelic';
    dsn?: string;
    environment?: string;
    sampleRate?: number;
  };
}
```

### Environment Variables

```bash
# Service identification
SF_SERVICE_NAME=semantic-flow-service
SF_SERVICE_VERSION=2.0.0
SF_ENVIRONMENT=production

# Console logging
SF_LOG_CONSOLE_ENABLED=true
SF_LOG_CONSOLE_LEVEL=info
SF_LOG_CONSOLE_FORMAT=pretty

# File logging
SF_LOG_FILE_ENABLED=true
SF_LOG_FILE_PATH=./logs/sf-service.log
SF_LOG_FILE_LEVEL=debug

# Monitoring
SF_LOG_MONITORING_ENABLED=true
SF_LOG_MONITORING_PROVIDER=sentry
SF_LOG_MONITORING_DSN=https://...

# Auto-context settings
SF_LOG_AUTO_CONTEXT_CAPTURE_FUNCTION_NAME=true  # Enable function name capture
```

## Error Handling

### Error Types

The system provides typed error classes with automatic context capture:

```typescript
import { 
  SemanticFlowError,
  ValidationError,
  ConfigurationError,
  MeshProcessingError,
  ApiError
} from '@semantic-flow/logging';

// Throw typed errors
throw new ValidationError('Invalid input', { field: 'email' });
throw new ApiError('Not found', 404, { resource: 'user' });

// Custom error types
import { createErrorType } from '@semantic-flow/logging';

const DatabaseError = createErrorType('DatabaseError', 'DB_ERROR', true);
throw new DatabaseError('Connection failed', { host: 'localhost' });
```

### Error Capture

```typescript
import { captureError } from '@semantic-flow/logging';

try {
  await riskyOperation();
} catch (error) {
  captureError(error, {
    message: 'Operation failed',
    context: { operation: 'risky-op' },
    includeStackTrace: true,
    reportToMonitoring: true
  });
  // Continue with fallback logic
}
```

### Error Properties

```typescript
class SemanticFlowError extends Error {
  readonly code: string;           // Error code (e.g., 'VALIDATION_ERROR')
  readonly context: Record<string, unknown>; // Additional context
  readonly timestamp: Date;        // When the error occurred
  readonly recoverable: boolean;   // Whether recovery is possible
}
```

## Context Management

### AsyncLocalStorage

The system uses AsyncLocalStorage for automatic context propagation across async operations:

```typescript
import { ContextManager } from '@semantic-flow/logging';

const requestContext = { 
  requestId: 'req-123', 
  userId: 'user-456' 
};

ContextManager.run(requestContext, () => {
  // All logging within this scope automatically includes the context
  logger.info('Processing request'); 
  // Logs: { requestId: 'req-123', userId: 'user-456', ... }
  
  await processRequest();
});
```

### Context Merging

Context is merged hierarchically:

```typescript
// Global context
const globalLogger = getLogger();

// Component context
const componentLogger = globalLogger.child({ component: 'auth' });

// Operation context
const operationLogger = componentLogger.withOperation('login');

// Call context
operationLogger.info('Login successful', { userId: '123' });

// Final context includes all levels:
// { component: 'auth', operation: 'login', userId: '123', ... }
```

## Testing

### Mock Logger

Use the `MockLogger` for testing:

```typescript
import { LoggerTestUtils, MockLogger } from '@semantic-flow/logging';
import { describe, it, expect, beforeEach } from 'vitest';

describe('My Module', () => {
  let mockLogger: MockLogger;

  beforeEach(() => {
    mockLogger = LoggerTestUtils.createMockLogger({
      serviceName: 'test-service'
    });
  });

  it('should log messages correctly', () => {
    mockLogger.info('Test message', { userId: '123' });
    
    const entry = mockLogger.mockChannel.entries[0];
    expect(entry.level).toBe(LogLevel.INFO);
    expect(entry.message).toBe('Test message');
    expect(entry.context?.userId).toBe('123');
  });

  it('should capture errors', () => {
    const error = new Error('Test error');
    mockLogger.captureError(error);
    
    expect(mockLogger.capturedErrors).toHaveLength(1);
    expect(mockLogger.capturedErrors[0].error).toBe(error);
  });
});
```

### Test Utilities

```typescript
// Find logs by level
const errors = mockLogger.findLogsByLevel(LogLevel.ERROR);

// Find logs by component
const authLogs = mockLogger.findLogsByComponent('auth');

// Find logs by operation
const loginLogs = mockLogger.findLogsByOperation('login');

// Check for specific error codes
const hasValidationError = mockLogger.hasErrorWithCode('VALIDATION_ERROR');

// Clear logs between tests
mockLogger.clearLogs();
```

### Reset Singleton for Tests

```typescript
import { __resetLoggerForTests } from '@semantic-flow/logging';

beforeEach(() => {
  __resetLoggerForTests();
});
```

## Best Practices

### 1. Initialize Early

Initialize the logger at application startup:

```typescript
// index.ts
import { initLogger } from '@semantic-flow/logging';

initLogger({
  serviceName: process.env.SERVICE_NAME || 'my-service',
  environment: process.env.NODE_ENV as any || 'development'
});

// Rest of application...
```

### 2. Use Component Loggers

Create component-scoped loggers for better traceability:

```typescript
// auth-service.ts
import { getComponentLogger } from '@semantic-flow/logging';

const logger = getComponentLogger(import.meta.url);

export class AuthService {
  login(credentials) {
    logger.info('Login attempt', { email: credentials.email });
  }
}
```

### 3. Structure Your Context

Use consistent context keys across your application:

```typescript
// Good: Consistent structure
logger.info('User created', {
  operation: 'user-creation',
  metadata: { userId: '123', email: 'user@example.com' }
});

// Avoid: Flat, inconsistent structure
logger.info('User created', {
  userId: '123',
  email: 'user@example.com',
  op: 'create-user'
});
```

### 4. Log at Appropriate Levels

- **TRACE**: Very detailed debugging (rarely used in production)
- **DEBUG**: Detailed debugging for development
- **INFO**: Normal application flow
- **WARN**: Potentially harmful situations
- **ERROR**: Error events that might still allow the app to continue
- **FATAL**: Severe errors that will likely abort the application

### 5. Include Error Objects

Always include the error object when logging errors:

```typescript
// Good: Includes error object and context
try {
  await operation();
} catch (error) {
  logger.error('Operation failed', error, { operation: 'data-sync' });
}

// Bad: Only logs message
catch (error) {
  logger.error(`Operation failed: ${error.message}`);
}
```

### 6. Use Timers for Performance Tracking

Track operation performance consistently:

```typescript
async function processData(data) {
  const timer = logger.startTimer('data-processing');
  
  try {
    await validateData(data);
    timer.checkpoint('validation-complete');
    
    await transformData(data);
    timer.checkpoint('transformation-complete');
    
    await saveData(data);
    timer.end({ recordCount: data.length });
  } catch (error) {
    timer.end({ error: true });
    throw error;
  }
}
```

### 7. Graceful Shutdown

Ensure logs are flushed on shutdown:

```typescript
process.on('SIGTERM', async () => {
  await getLogger().flush();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await getLogger().flush();
  process.exit(130);
});
```

### 8. Avoid Logging Sensitive Data

Redact sensitive information:

```typescript
// Bad: Logs password
logger.debug('Login attempt', { username, password });

// Good: Redacts password
logger.debug('Login attempt', { 
  username, 
  passwordLength: password.length 
});
```

## JSON Lines Output

All structured logs use JSON Lines format (newline-delimited JSON):

```json
{"timestamp":1699027200000,"level":20,"message":"Server started","service":{"name":"api","version":"1.0.0"},"pid":12345}
{"timestamp":1699027201000,"level":40,"message":"Database connection failed","error":{"name":"Error","message":"Connection timeout"},"service":{"name":"api","version":"1.0.0"},"pid":12345}
```

This format is ideal for log processors like FluentBit, Loki, or Elasticsearch.

## Implementation Files

### Core Implementation

- [`shared/logging/src/core/types.ts`](../shared/logging/src/core/types.ts) - Type definitions
- [`shared/logging/src/core/logger.ts`](../shared/logging/src/core/logger.ts) - Logger implementation
- [`shared/logging/src/core/context.ts`](../shared/logging/src/core/context.ts) - Context management
- [`shared/logging/src/core/formatters.ts`](../shared/logging/src/core/formatters.ts) - Formatting utilities

### Error Handling

- [`shared/logging/src/errors/types.ts`](../shared/logging/src/errors/types.ts) - Error types and factory

### Configuration

- [`shared/logging/src/config/loader.ts`](../shared/logging/src/config/loader.ts) - Config loader
- [`shared/logging/src/config/defaults.ts`](../shared/logging/src/config/defaults.ts) - Default config
- [`shared/logging/src/config/schema.ts`](../shared/logging/src/config/schema.ts) - Config schema

### Channels

- [`shared/logging/src/channels/console.ts`](../shared/logging/src/channels/console.ts) - Console output

### Utilities

- [`shared/logging/src/utils/stack-trace.ts`](../shared/logging/src/utils/stack-trace.ts) - Stack trace parsing and function name capture

### Testing

- [`shared/logging/src/utils/testing.ts`](../shared/logging/src/utils/testing.ts) - Test utilities
- [`shared/logging/src/__tests__/core.test.ts`](../shared/logging/src/__tests__/core.test.ts) - Core tests

## See Also

- [Task Specification](task.2025-11-04-shared-logging-and-errorhandling.md) - Full system specification
- [Developer General Guidance](dev.general-guidance.md) - General development guidelines
- [Developer Patterns](dev.patterns.md) - Common development patterns
