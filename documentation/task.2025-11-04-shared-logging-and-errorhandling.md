---
id: 3hejrrsh4j7i5p2l7rk38n6
title: 2025 11 04 Shared Logging and Errorhandling
desc: ''
updated: 1762363447931
created: 1762325430077
---

## Prompt
# Semantic Flow Logging & Error Handling System Specification
## Node.js Platform Rewrite

**Version:** 1.0  
**Date:** November 4, 2025  
**Status:** Working Specification

---

## Overview

This specification defines a streamlined, production-ready logging and error handling system for the Semantic Flow platform's Node.js rewrite. It consolidates the best features from the current Deno implementation while addressing identified redundancies and adding improvements for both CLI and service usage.

### Design Goals

1. **Unified Architecture**: Single system supporting both CLI tools and long-running services
2. **Simplified API**: Eliminate redundant functions and streamline the interface  
3. **Enhanced Performance**: Optimized for high-throughput service operations
4. **Better Developer Experience**: Clear patterns, comprehensive documentation, and testing utilities
5. **Production Ready**: Robust error recovery, monitoring, and observability features

---

## Core Architecture

### Module Structure
```
src/logging/
├── core/
│   ├── logger.ts              # Main logger implementation
│   ├── types.ts               # Type definitions and interfaces
│   ├── formatters.ts          # Message formatting utilities
│   └── context.ts             # Context management and merging
├── channels/
│   ├── console.ts             # Console output channel
│   ├── file.ts                # File logging with rotation
│   └── monitoring.ts          # External monitoring (Sentry, etc.)
├── errors/
│   ├── capture.ts             # Error capture and logging
│   ├── recovery.ts            # Error recovery strategies  
│   ├── types.ts               # Error type definitions
│   └── factory.ts             # Error class factory utilities
├── config/
│   ├── loader.ts              # Configuration loading and validation
│   ├── schema.ts              # Configuration schema definitions
│   └── defaults.ts            # Default configurations
├── utils/
│   ├── context.ts             # AsyncLocalStorage context management
│   ├── performance.ts         # Performance monitoring utilities
│   ├── testing.ts             # Testing utilities and mocks
│   └── validation.ts          # Input validation helpers
└── index.ts                   # Main exports
```

---

## Type System

### Core Types

```typescript
// Enhanced log levels with numeric values for easy comparison
export enum LogLevel {
  TRACE = 0,
  DEBUG = 10,
  INFO = 20,
  WARN = 30,
  ERROR = 40,
  FATAL = 50
}

// String literals for configuration mapping
export const LogLevelStrings = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] as const;
export type LogLevelString = typeof LogLevelStrings[number];

// Core log entry structure used throughout the system
export interface LogEntry {
  timestamp: number;                 // Date.now()
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string[];
    code?: string;
  };
  service: { 
    name: string; 
    version?: string; 
    instanceId?: string 
  };
  pid: number;
  hostname?: string;
}

// Comprehensive but streamlined log context
export interface LogContext {
  // Core identification
  operation?: string;
  operationId?: string;
  component?: string;
  
  // Semantic Flow specific context
  meshId?: string;
  nodeId?: string;
  meshName?: string;
  nodeName?: string;
  
  // Performance tracking
  startTime?: number;
  duration?: number;
  memoryUsage?: number;
  
  // Request context (for service mode)
  requestId?: string;
  userId?: string;
  sessionId?: string;
  
  // Error context
  errorCode?: string;
  errorType?: string;
  stackTrace?: string[];
  errorCause?: unknown;
  
  // Flexible metadata
  tags?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

// Error capture options (for logging/reporting)
export interface ErrorCaptureOptions {
  message?: string;
  context?: LogContext;
  logLevel?: LogLevel;
  includeStackTrace?: boolean;
  reportToMonitoring?: boolean;
}

// Error recovery options (for control flow)
export interface ErrorRecoveryOptions<T = unknown> {
  strategy: ErrorRecoveryStrategy;
  fallbackValue?: T;
  retryCount?: number;
  retryDelay?: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

// Base log channel interface for extensibility
export interface LogChannel {
  write(entry: LogEntry): Promise<void> | void;
  flush(): Promise<void>;
  close(): Promise<void>;
  readonly minLevel: LogLevel;
}

// Channel configuration
export interface ChannelConfig {
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

// Main logger configuration
export interface LoggerConfig {
  serviceName: string;
  serviceVersion: string;
  environment: 'development' | 'staging' | 'production';
  instanceId?: string;
  
  // Channel configurations
  console: ChannelConfig;
  file: ChannelConfig;
  monitoring: ChannelConfig;
  
  // Performance settings
  async: boolean;        // true: buffered writes + sync stderr for ERROR/FATAL
                        // false: synchronous writes where possible
  bufferSize: number;
  flushInterval: number;
  
  // Context settings
  autoContext: {
    includeTimestamp: boolean;
    includeHostname: boolean;
    includeProcessInfo: boolean;
  };
}
```

### Error Types

```typescript
// Base error class with enhanced context
export class SemanticFlowError extends Error {
  public readonly code: string;
  public readonly context: Record<string, unknown>;
  public readonly timestamp: Date;
  public readonly recoverable: boolean;
  
  constructor(
    message: string,
    code: string,
    context: Record<string, unknown> = {},
    recoverable = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.context = context;
    this.timestamp = new Date();
    this.recoverable = recoverable;
  }
}

// Error factory to reduce boilerplate
export function createErrorType(
  name: string,
  code: string,
  recoverable = true
): new (message: string, context?: Record<string, unknown>) => SemanticFlowError {
  return class extends SemanticFlowError {
    constructor(message: string, context: Record<string, unknown> = {}) {
      super(message, code, context, recoverable);
      this.name = name;
    }
  };
}

// Specific error types using factory
export const ValidationError = createErrorType('ValidationError', 'VALIDATION_ERROR');
export const ConfigurationError = createErrorType('ConfigurationError', 'CONFIG_ERROR', false);
export const MeshProcessingError = createErrorType('MeshProcessingError', 'MESH_PROCESSING_ERROR');

export class ApiError extends SemanticFlowError {
  public readonly statusCode: number;
  
  constructor(message: string, statusCode: number, context?: Record<string, unknown>) {
    super(message, 'API_ERROR', context);
    this.statusCode = statusCode;
  }
}
```

---

## Core Logger Interface

### Simplified Logger API

```typescript
export interface Logger {
  // Core logging methods (synchronous with async buffering)
  trace(message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: Error, context?: LogContext): void;
  fatal(message: string, error?: Error, context?: LogContext): void;
  
  // Context management (returns immutable context wrappers)
  withContext(context: LogContext): Logger;
  withOperation(operation: string, operationId?: string): Logger;
  withComponent(component: string): Logger;
  child(context: LogContext): Logger; // Alias for withContext
  
  // Performance tracking
  startTimer(operation: string): Timer;
  
  // Error capture (for logging/reporting only)
  captureError(error: unknown, options?: ErrorCaptureOptions): void;
  
  // Lifecycle management
  flush(): Promise<void>;
  close(): Promise<void>;
}

// Child logger semantics documentation:
// - child() returns a thin wrapper sharing transports and buffer with parent
// - context is frozen and shallow-merged per call
// - no mutation or context bleed between child instances

export interface Timer {
  end(context?: LogContext): void;
  checkpoint(label: string, context?: LogContext): void;
}
```

### Factory Functions

```typescript
// Singleton pattern with dependency injection support
export function initLogger(config?: Partial<LoggerConfig>): Logger;
export function getLogger(): Logger;
export function __resetLoggerForTests(): void;

// Factory functions for initialization
export function createLogger(config?: Partial<LoggerConfig>): Logger;
export function createCliLogger(options?: {
  verbose?: boolean;
  quiet?: boolean;
  format?: 'pretty' | 'json';
}): Logger;
export function createServiceLogger(serviceName: string, options?: {
  enableFileLogging?: boolean;
  enableMonitoring?: boolean;
  environment?: string;
}): Logger;

// Component-scoped logger (pure ESM)
export function getComponentLogger(sourceUrl: string /* import.meta.url */): Logger {
  const file = new URL(sourceUrl);
  const base = file.pathname.split("/").pop() ?? "unknown";
  const component = base.replace(/\.(m|c)?js|ts$/, "");
  return getLogger().child({ component });
}
```

---

## Separated Error Handling

### Error Capture (Logging/Reporting)

```typescript
// Pure error capture - only logs and reports, no control flow
export function captureError(error: unknown, options: ErrorCaptureOptions = {}): void {
  // Synchronous logging for ERROR/FATAL levels
  // Async buffering for full reporting
}
```

### Error Recovery (Control Flow)

```typescript
// Error recovery strategies (simplified)
export enum ErrorRecoveryStrategy {
  CONTINUE = 'continue',        // Don't throw, continue execution
  RETHROW = 'rethrow',         // Log then rethrow (default)
  FALLBACK = 'fallback',       // Return fallback value
  RETRY = 'retry'              // Retry operation with backoff
}

// Apply recovery strategy to an error
export async function applyErrorRecovery<T>(
  error: unknown,
  options: ErrorRecoveryOptions<T>
): Promise<T | never> {
  // Implementation handles retry logic, fallbacks, etc.
}

// Convenience wrapper combining capture + recovery
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  options: {
    capture?: ErrorCaptureOptions;
    recovery?: ErrorRecoveryOptions<T>;
  } = {}
): Promise<T | undefined> {
  try {
    return await operation();
  } catch (error) {
    if (options.capture) {
      captureError(error, options.capture);
    }
    if (options.recovery) {
      return await applyErrorRecovery(error, options.recovery);
    }
    throw error; // Default: rethrow
  }
}
```

### Error Classification

```typescript
export class ErrorClassifier {
  static classify(error: unknown): {
    type: string;
    severity: LogLevel;
    recoverable: boolean;
    category: 'system' | 'business' | 'validation' | 'network' | 'unknown';
  };
  
  static shouldReport(error: unknown, threshold: LogLevel): boolean;
  static extractContext(error: unknown): Record<string, unknown>;
}
```

---

## Channel Implementations

### Console Channel

```typescript
export class ConsoleChannel implements LogChannel {
  public readonly minLevel: LogLevel;
  
  constructor(private config: ChannelConfig['console']) {
    this.minLevel = config.level;
  }
  
  write(entry: LogEntry): void {
    // Guard against entries below minimum level
    if (entry.level < this.minLevel) return;
    
    // Always synchronous for console - push async work to buffer
    if (entry.level >= LogLevel.ERROR) {
      this.writeSynchronous(entry);
    } else {
      this.writeStandard(entry);
    }
  }
  
  flush(): Promise<void> {
    // Console doesn't buffer, so flush is a no-op
    return Promise.resolve();
  }
  
  close(): Promise<void> {
    return Promise.resolve();
  }
  
  // Synchronous critical path for errors
  private writeSynchronous(entry: LogEntry): void {
    const line = this.formatCritical(entry);
    try {
      process.stderr.write(line);
    } catch {
      // Best effort - never throw from logging
    }
  }
  
  // Standard output for non-critical levels
  private writeStandard(entry: LogEntry): void {
    const line = process.stdout.isTTY 
      ? this.formatForTTY(entry) 
      : this.formatForPipe(entry);
    try {
      process.stdout.write(line);
    } catch {
      // Best effort - never throw from logging
    }
  }
  
  // Smart formatting based on environment
  private formatForTTY(entry: LogEntry): string;
  private formatForPipe(entry: LogEntry): string;
  private formatCritical(entry: LogEntry): string;
}
```

### File Channel

```typescript
export class FileChannel implements LogChannel {
  public readonly minLevel: LogLevel;
  private buffer: LogEntry[] = [];
  private flushTimer: NodeJS.Timer | null = null;
  
  constructor(private config: ChannelConfig['file']) {
    this.minLevel = config.level;
  }
  
  write(entry: LogEntry): void {
    // Guard against entries below minimum level
    if (entry.level < this.minLevel) return;
    
    // Always async for file channel - add to buffer
    this.buffer.push(entry);
    this.scheduleFlush();
  }
  
  // Single-flight flush to prevent concurrent flushes
  private inflight?: Promise<void>;
  
  flush(): Promise<void> {
    return this.inflight ?? (this.inflight = this.flushImpl().finally(() => this.inflight = undefined));
  }
  
  close(): Promise<void> {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    return this.flushBuffer();
  }
  
  // Enhanced rotation with compression and atomic operations
  private rotateIfNeeded(): Promise<void>; // Uses fs.rename for atomicity
  private compressOldLogs(): Promise<void>;
  private scheduleFlush(): void;
  private flushImpl(): Promise<void>; // Uses fs.writev for batched writes
  
  // File opened with O_APPEND for safe concurrent writes
  // Reopen file descriptor after rotation
}
```

### Monitoring Channel

```typescript
export class MonitoringChannel implements LogChannel {
  public readonly minLevel: LogLevel;
  private buffer: LogEntry[] = [];
  private rateLimiter: RateLimiter;
  
  constructor(private config: ChannelConfig['monitoring']) {
    this.minLevel = config.level;
    this.rateLimiter = new RateLimiter(config.sampleRate || 1.0);
  }
  
  write(entry: LogEntry): void {
    // Guard against entries below minimum level
    if (entry.level < this.minLevel) return;
    
    // Apply sampling and rate limiting
    if (!this.shouldSample(entry)) return;
    
    // Always async for monitoring - add to buffer with timeout protection
    this.buffer.push(entry);
    this.scheduleFlush();
  }
  
  // Single-flight flush to prevent concurrent monitoring flushes
  private inflight?: Promise<void>;
  
  flush(): Promise<void> {
    return this.inflight ?? (this.inflight = this.flushImpl().finally(() => this.inflight = undefined));
  }
  
  close(): Promise<void> {
    return this.flushWithTimeout();
  }
  
  // Provider-specific implementations
  private sentryAdapter: SentryAdapter;
  private datadogAdapter?: DatadogAdapter;
  
  // Smart sampling and rate limiting with timeout protection
  private shouldSample(entry: LogEntry): boolean;
  private scheduleFlush(): void;
  private flushImpl(): Promise<void>; // Bounds batch size and applies per-entry deadlines
  
  // Drop counter for monitoring timeouts/failures
  private droppedCount = 0;
  public getDroppedCount(): number { return this.droppedCount; }
}

// Missing primitive definitions
class RateLimiter {
  constructor(private rate: number) {}
  allow(): boolean { return Math.random() < this.rate; }
}

interface SentryAdapter {
  send(entry: LogEntry): Promise<void>;
}

interface DatadogAdapter {
  send(entry: LogEntry): Promise<void>;
}
```

---

## Configuration System

### Async Flag Semantics

The `async` configuration flag controls write behavior:

- **`async: true`** (default): Non-blocking buffered writes for all channels. ERROR/FATAL levels also emit synchronously to `process.stderr` for immediate visibility.
- **`async: false`**: Console and file channels use `writeSync` on ERROR/FATAL and best-effort synchronous writes for other levels. Monitoring channel remains buffered with best-effort flush. **Warning**: Synchronous I/O can impact performance significantly under load.

### Schema-Based Configuration

```typescript
// JSON Schema for logger configuration
export const LoggerConfigSchema = {
  type: 'object',
  properties: {
    serviceName: { type: 'string', minLength: 1 },
    serviceVersion: { type: 'string' },
    environment: { 
      type: 'string', 
      enum: ['development', 'staging', 'production'] 
    },
    console: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean', default: true },
        level: { type: 'string', enum: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] },
        format: { type: 'string', enum: ['json', 'pretty', 'compact'] }
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
    }
  },
  required: ['serviceName']
};

// Configuration loader with multiple sources
export class ConfigLoader {
  static load(sources: {
    defaults?: Partial<LoggerConfig>;
    configFile?: string;
    environment?: Record<string, string>;
    cliArgs?: Record<string, unknown>;
  }): LoggerConfig;
  
  static validate(config: unknown): LoggerConfig;
  static merge(...configs: Partial<LoggerConfig>[]): LoggerConfig;
  
  // Map string level names to enum values
  static parseLogLevel(level: string): LogLevel {
    const index = LogLevelStrings.indexOf(level as LogLevelString);
    return index >= 0 ? (index * 10) as LogLevel : LogLevel.INFO;
  }
}
```

### Environment Variable Mapping

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
SF_LOG_FILE_MAX_SIZE=10485760
SF_LOG_FILE_MAX_FILES=5

# Monitoring
SF_LOG_MONITORING_ENABLED=true
SF_LOG_MONITORING_PROVIDER=sentry
SF_LOG_MONITORING_DSN=https://...
SF_LOG_MONITORING_SAMPLE_RATE=0.1
```

---

## Context Management

### AsyncLocalStorage Integration

```typescript
// Automatic context propagation using Node.js AsyncLocalStorage
export class ContextManager {
  private static als = new AsyncLocalStorage<LogContext>();
  
  static run<T>(context: LogContext, fn: () => T): T {
    return this.als.run(context, fn);
  }
  
  static runAsync<T>(context: LogContext, fn: () => Promise<T>): Promise<T> {
    return this.als.run(context, fn);
  }
  
  static current(): LogContext | undefined {
    return this.als.getStore();
  }
  
  static merge(context: LogContext): LogContext {
    const current = this.current();
    return current ? { ...current, ...context } : context;
  }
}

// HTTP middleware integration (framework-agnostic example)
import { randomUUID } from 'node:crypto';

export function createRequestLogger(
  req: { id?: string; method: string; path: string; get(header: string): string | undefined },
  res: unknown,
  next: () => void
) {
  const requestContext: LogContext = {
    operation: 'http-request',
    requestId: req.id || randomUUID(),
    metadata: {
      method: req.method,
      path: req.path,
      userAgent: req.get('User-Agent')
    }
  };
  
  ContextManager.run(requestContext, () => {
    (req as any).logger = getLogger().child({ component: 'http-handler' });
    next();
  });
}
```

---

## Performance Enhancements

### Async Logging with Buffering

```typescript
export class AsyncLogBuffer {
  private buffer: LogEntry[] = [];
  private flushTimer: NodeJS.Timer | null = null;
  
  constructor(
    private maxSize: number = 1000,
    private flushInterval: number = 5000
  ) {}
  
  add(entry: LogEntry): void;
  flush(): Promise<void>;
  private autoFlush(): void;
}
```

### Performance Monitoring

```typescript
export class PerformanceTracker {
  static trackOperation<T>(
    operation: string,
    fn: () => Promise<T>,
    logger: Logger
  ): Promise<T>;
  
  static createTimer(operation: string, logger: Logger): Timer;
  
  // Memory usage tracking
  static trackMemory(logger: Logger): void;
  
  // Log volume metrics  
  static getLogMetrics(): {
    totalLogs: number;
    logsByLevel: Record<LogLevel, number>;
    errorRate: number;
    avgResponseTime: number;
  };
}
```

---

## Testing Utilities

### Mock Logger

```typescript
export class MockLogger implements Logger {
  public logs: LogEntry[] = [];
  public capturedErrors: Array<{ error: unknown; options?: ErrorCaptureOptions }> = [];
  
  // Implement all Logger methods with recording
  trace(message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: Error, context?: LogContext): void;
  fatal(message: string, error?: Error, context?: LogContext): void;
  
  captureError(error: unknown, options?: ErrorCaptureOptions): void {
    this.capturedErrors.push({ error, options });
    // Also create a log entry for the error
    const entry: LogEntry = {
      timestamp: Date.now(),
      level: options?.logLevel || LogLevel.ERROR,
      message: options?.message || (error instanceof Error ? error.message : String(error)),
      context: options?.context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n'),
        code: (error as any).code
      } : undefined,
      service: { name: 'test-service' },
      pid: process.pid
    };
    this.logs.push(entry);
  }
  
  // Test utilities
  findLogsByLevel(level: LogLevel): LogEntry[];
  findLogsByComponent(component: string): LogEntry[];
  findLogsByOperation(operation: string): LogEntry[];
  hasErrorWithCode(code: string): boolean;
  clearLogs(): void {
    this.logs.length = 0;
    this.capturedErrors.length = 0;
  }
}

export class LoggerTestUtils {
  static createMockLogger(): MockLogger;
  static createTestConfig(): LoggerConfig;
  static waitForLogs(logger: MockLogger, count: number, timeout?: number): Promise<void>;
}
```

### Integration Test Helpers

```typescript
export class LoggerIntegrationTests {
  static async testFileRotation(config: LoggerConfig): Promise<TestResult>;
  static async testErrorHandling(config: LoggerConfig): Promise<TestResult>;
  static async testPerformance(config: LoggerConfig): Promise<PerformanceResult>;
  static async testMonitoringIntegration(config: LoggerConfig): Promise<TestResult>;
}
```

---

## Usage Examples

### CLI Tool Usage

```typescript
import { createCliLogger, getComponentLogger } from '@semantic-flow/logging';

const logger = createCliLogger({ 
  verbose: process.argv.includes('--verbose'),
  format: 'pretty' 
});

// Component-scoped logger using import.meta.url
const componentLogger = getComponentLogger(import.meta.url);

async function processFiles(files: string[]) {
  const timer = componentLogger.startTimer('process-files');
  
  try {
    componentLogger.info(`Processing ${files.length} files`);
    
    for (const file of files) {
      const fileLogger = componentLogger.withContext({ 
        operation: 'process-file',
        metadata: { filename: file }
      });
      
      await processFile(file, fileLogger);
    }
    
    timer.end({ metadata: { filesProcessed: files.length } });
  } catch (error) {
    captureError(error, {
      message: 'Failed to process files',
      context: { metadata: { files } },
      reportToMonitoring: true
    });
    throw error;
  }
}
```

### Service Usage

```typescript
import { createServiceLogger, getComponentLogger, ContextManager } from '@semantic-flow/logging';

const logger = createServiceLogger('semantic-flow-api', {
  enableFileLogging: true,
  enableMonitoring: true,
  environment: process.env.NODE_ENV
});

// Component-specific logger for this module
const componentLogger = getComponentLogger(import.meta.url);

app.use((req, res, next) => {
  const requestContext = {
    operation: 'api-request',
    requestId: req.id,
    metadata: {
      method: req.method,
      path: req.path,
      userAgent: req.get('User-Agent')
    }
  };
  
  ContextManager.run(requestContext, () => {
    req.logger = componentLogger.child({ component: 'http-handler' });
    next();
  });
});
```

### Error Handling

```typescript
import { captureError, withErrorHandling, ErrorRecoveryStrategy } from '@semantic-flow/logging';

// Simple error capture (logging only)
async function riskyOperation() {
  try {
    await doSomethingRisky();
  } catch (error) {
    captureError(error, {
      message: 'Risky operation failed',
      context: { operation: 'risky-op' },
      includeStackTrace: true
    });
    // Continue with fallback logic
  }
}

// Combined error handling with recovery
const result = await withErrorHandling(
  () => callExternalAPI(),
  {
    capture: {
      context: { operation: 'external-api-call' },
      reportToMonitoring: true
    },
    recovery: {
      strategy: ErrorRecoveryStrategy.RETRY,
      retryCount: 3,
      fallbackValue: null,
      retryDelay: 1000
    }
  }
);

// AsyncLocalStorage context propagation with ESM
const componentLogger = getComponentLogger(import.meta.url);

ContextManager.runAsync(
  { operation: 'batch-process', userId: 'user123' },
  async () => {
    // All logging within this scope automatically includes the context
    componentLogger.info('Starting batch process'); // Automatically includes operation + userId + component
    
    await processItems();
    
    componentLogger.info('Batch process completed');
  }
);

// Dynamic import example for configuration loading
async function loadConfig() {
  try {
    const configModule = await import('./config.js');
    return configModule.default;
  } catch (error) {
    captureError(error, {
      message: 'Failed to load configuration module',
      context: { operation: 'config-load' }
    });
    throw error;
  }
}
```

---

## Migration Guide

### From Deno Implementation

1. **Logger Initialization**: Use `initLogger()` at startup, then `getLogger()` or `getComponentLogger(import.meta.url)` anywhere
2. **Error Handling**: Replace both `handleError` and `handleCaughtError` with `captureError()` + optional recovery
3. **Configuration**: Use schema-based config with singleton pattern
4. **Context Management**: Use `AsyncLocalStorage` for automatic context propagation
5. **Async Methods**: All logging methods are synchronous (with internal async buffering)
6. **Context Creation**: Use immutable `child()` loggers instead of mutable context updates

### Breaking Changes

- Log levels changed to enum with numeric values
- Context merging behavior simplified
- File rotation configuration consolidated
- Sentry integration moved to generic monitoring channel

---

## Implementation Plan

### Phase 1: Core Infrastructure (Week 1-2)
- [ ] Type definitions and interfaces
- [ ] Basic logger implementation
- [ ] Console channel implementation
- [ ] Configuration system
- [ ] Unit tests for core functionality

### Phase 2: Advanced Features (Week 3-4)
- [ ] File channel with rotation
- [ ] Monitoring channel (Sentry)
- [ ] Unified error handling
- [ ] Performance tracking
- [ ] Integration tests

### Phase 3: CLI/Service Integration (Week 5)
- [ ] CLI logger factory
- [ ] Service logger factory  
- [ ] Context management utilities
- [ ] Documentation and examples

### Phase 4: Testing & Documentation (Week 6)
- [ ] Comprehensive test suite
- [ ] Performance benchmarks
- [ ] Migration documentation
- [ ] API documentation

#### Detailed Test Plan

**Core Functionality Tests:**
- **Deterministic clocks**: Inject `now()` function into logger; use Vitest fake timers for predictable timestamps
- **Rotation tests**: Force size-based rotation with tiny `maxSize`; assert new file created and file descriptor reopened
- **Signal tests**: Simulate SIGINT/SIGTERM with child process; assert `flush()` called before exit
- **No-throw contract**: Intentionally throw inside a channel's `write` method; ensure logger falls back to console and does not crash caller
- **ESM component detection**: Test `getComponentLogger(import.meta.url)` with various file paths and extensions

**Advanced Feature Tests:**
- **Monitoring timeouts**: Stub adapter with delayed promise; assert drop counters increment when deadlines exceeded
- **ALS propagation**: Assert `ContextManager.current()` context merged into log entries across `await` points
- **Recursive logging protection**: Trigger error within logging code; verify fallback to console.error without infinite loops
- **Back-pressure handling**: Fill buffers beyond capacity; verify graceful degradation and dropped message counts
- **Pure ESM integrity**: Verify no `require()` calls in bundled output; test dynamic import usage

---

## Success Criteria

1. **Performance**: 50% faster than current Deno implementation
2. **Memory Usage**: 30% lower memory footprint
3. **API Simplicity**: 40% fewer public methods/functions
4. **Test Coverage**: 95% code coverage
5. **Documentation**: Complete API docs and usage examples
6. **Migration**: Clear migration path from Deno version

---

## Production Considerations

### JSON Lines Output Format

All structured log output follows the JSON Lines format (newline-delimited JSON) for ingestion by log processors like FluentBit, Loki, or Elasticsearch:

```typescript
// Each log entry is a single JSON object terminated by \n
{"timestamp":1699027200000,"level":20,"message":"Server started","service":{"name":"api","version":"1.0.0"},"pid":12345}
{"timestamp":1699027201000,"level":40,"message":"Database connection failed","error":{"name":"Error","message":"Connection timeout"},"service":{"name":"api","version":"1.0.0"},"pid":12345}
```

### Flush Guarantees

The `flush()` method provides the following guarantees:
- Drains buffers of all enabled channels within a bounded time (default 5s timeout)
- Never throws - errors are logged to console as fallback
- Returns when all pending entries are written or timeout is reached
- Safe to call multiple times concurrently

### Critical Path Reliability

```typescript
// Synchronous logging for ERROR/FATAL ensures immediate output
function logSyncCritical(entry: LogEntry): void {
  const line = JSON.stringify({
    t: entry.timestamp,
    lvl: entry.level,
    msg: entry.message,
    rid: entry.context?.requestId
  }) + '\n';
  
  try { 
    process.stderr.write(line); 
  } catch {
    // Never throw from logging - best effort only
  }
  
  // Optional: Synchronous file write for critical errors
  // if (criticalFd) fs.writeSync(criticalFd, line);
}

// Safe JSON serialization with limits and circular protection
const MAX_CTX = 20_000, MAX_MSG = 2_000, MAX_STACK = 50;

function safeStringify(value: any, maxLength = MAX_CTX): string {
  try {
    const seen = new WeakSet();
    const result = JSON.stringify(value, (key, val) => {
      if (typeof val === 'object' && val !== null) {
        if (seen.has(val)) return '[Circular]';
        seen.add(val);
      }
      if (typeof val === 'string' && val.length > MAX_MSG) {
        return val.slice(0, MAX_MSG) + '...[truncated]';
      }
      return val;
    });
    return result.length > maxLength ? result.slice(0, maxLength) + '...[truncated]' : result;
  } catch {
    return '[Unserializable]';
  }
}

// Strip ANSI escape codes for non-TTY output
function stripAnsi(text: string): string {
  return text.replace(/\x1b\[[0-9;]*m/g, '');
}

// PII redaction hook (optional per channel)
type RedactFn = (key: string, value: any) => any;
type RedactConfig = string[] | RedactFn;

function applyRedaction(entry: LogEntry, redact?: RedactConfig): LogEntry {
  if (!redact) return entry;
  
  if (Array.isArray(redact)) {
    // Field-based redaction
    const redactFields = new Set(redact);
    return JSON.parse(JSON.stringify(entry, (key, value) => 
      redactFields.has(key) ? '[REDACTED]' : value
    ));
  } else {
    // Custom redaction function
    return JSON.parse(JSON.stringify(entry, redact));
  }
}

// Ensure JSON lines contain no ANSI codes
function formatJsonLine(entry: LogEntry, redact?: RedactConfig): string {
  const redacted = applyRedaction(entry, redact);
  const serialized = safeStringify(redacted);
  return stripAnsi(serialized) + '\n';
}
```

### Graceful Shutdown

```typescript
const SAFE_CLOSE_MS = 2000;

// Comprehensive process termination hooks
process.on('beforeExit', async () => {
  await getLogger().flush();
});

process.on('SIGTERM', () => void gracefulExit(0));
process.on('SIGINT', () => void gracefulExit(130));

process.on('uncaughtException', (error) => {
  // Sync-log minimal line to stderr first
  const line = JSON.stringify({
    t: Date.now(),
    lvl: LogLevel.FATAL,
    msg: 'Uncaught exception - process terminating',
    err: error.message
  }) + '\n';
  try { process.stderr.write(line); } catch {}
  
  // Then capture full error context
  captureError(error, { 
    logLevel: LogLevel.FATAL,
    message: 'Uncaught exception - process terminating',
    includeStackTrace: true 
  });
  void gracefulExit(1);
});

process.on('unhandledRejection', (reason) => {
  captureError(reason as unknown, { 
    logLevel: LogLevel.ERROR,
    message: 'Unhandled promise rejection',
    includeStackTrace: true 
  });
});

function safeGetLogger(): Logger | undefined {
  try {
    return getLogger();
  } catch {
    return undefined;
  }
}

async function gracefulExit(code: number) {
  try {
    const logger = safeGetLogger();
    if (logger) {
      // Race between proper close and timeout
      await Promise.race([
        logger.close(),
        new Promise(resolve => setTimeout(resolve, SAFE_CLOSE_MS))
      ]);
    }
  } catch {
    // Best effort - don't block exit
  } finally {
    process.exit(code);
  }
}
```

### Guard Against Recursive Logging

```typescript
// Use AsyncLocalStorage to prevent recursive logging per async context
const recursionGuard = new AsyncLocalStorage<boolean>();

class LoggerImpl implements Logger {
  private log(level: LogLevel, message: string, error?: Error, context?: LogContext): void {
    if (recursionGuard.getStore()) {
      // Prevent infinite loops in error handling - use direct console
      console.error('Recursive logging detected:', message);
      return;
    }
    
    recursionGuard.run(true, () => {
      this.writeToChannels(level, message, error, context);
    });
  }
  
  trace(message: string, context?: LogContext): void {
    this.log(LogLevel.TRACE, message, undefined, context);
  }
  
  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, undefined, context);
  }
  
  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, undefined, context);
  }
  
  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, undefined, context);
  }
  
  error(message: string, error?: Error, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, error, context);
  }
  
  fatal(message: string, error?: Error, context?: LogContext): void {
    this.log(LogLevel.FATAL, message, error, context);
  }
  
  private writeToChannels(level: LogLevel, message: string, error?: Error, context?: LogContext): void {
    // Implementation that might trigger errors and recursive logging
  }
}
```

---

## Understanding Error Recovery Strategies

Error recovery strategies control **what happens after an error is logged**, not the logging itself:

```typescript
// Example: Processing a batch of files
for (const file of files) {
  await withErrorHandling(
    () => processFile(file),
    {
      capture: { 
        message: `Failed to process ${file}`,
        context: { operation: 'file-processing', filename: file }
      },
      recovery: {
        strategy: ErrorRecoveryStrategy.CONTINUE, // Keep processing other files
        // Don't let one bad file stop the whole batch
      }
    }
  );
}

// Example: Critical database connection
const db = await withErrorHandling(
  () => connectToDatabase(),
  {
    capture: {
      message: 'Database connection failed',
      reportToMonitoring: true
    },
    recovery: {
      strategy: ErrorRecoveryStrategy.RETRY,
      retryCount: 5,
      retryDelay: 2000,
      // Keep trying - app can't work without DB
    }
  }
);

// Example: Optional feature that might fail
const userPreferences = await withErrorHandling(
  () => loadUserPreferences(userId),
  {
    capture: {
      message: 'Failed to load user preferences',
      context: { userId }
    },
    recovery: {
      strategy: ErrorRecoveryStrategy.FALLBACK,
      fallbackValue: DEFAULT_PREFERENCES,
      // App works fine with defaults
    }
  }
);
```

---

## Questions for Review

1. Should error recovery strategies be pluggable?

---

## Future Enhancements (v2+)

Items suggested in review but deferred for initial implementation:

1. **Plugin Architecture**: `logger.use(plugin)` for extensible middleware
2. **Circuit Breaker**: Automatic monitoring channel fallback during outages  
3. **ErrorClassifier Registry**: Pluggable error classification rules
4. **Advanced Performance Tracking**: Built-in metrics collection and analysis
5. **Log Event Streaming**: Global event emitter for real-time log processing
6. **Pluggable Formatters**: Custom format registration system
7. **Advanced Context Features**: Structured event fields, correlation IDs
8. **Log Compression**: Automatic compression of rotated log files
9. **Source Location Capture**: Optional `file`, `line`, `col` fields from stack traces in debug builds
10. **Custom Formatters**: `registerFormatter(name, fn)` for pluggable output formats beyond json/pretty/compact

These features can be added incrementally based on usage patterns and requirements.

### Nice-to-Have Before v1

- **Monitoring Timeouts**: Per-entry deadlines and token-bucket rate limiting for monitoring channels
- **Enhanced Error Context**: Automatic source location capture in development mode
- **Advanced Sampling**: Intelligent sampling based on error patterns and frequency

---

## Critical Review Summary

**ChatGPT's feedback addressed key architectural issues:**

✅ **Fixed**: Async/sync API inconsistency  
✅ **Fixed**: Split error handling into capture + recovery concerns  
✅ **Fixed**: Added LogChannel interface for extensibility  
✅ **Fixed**: Added synchronous critical path for ERROR/FATAL  
✅ **Fixed**: Added AsyncLocalStorage for context propagation  
✅ **Fixed**: Added singleton pattern with DI support  
✅ **Added**: Error class factory to reduce boilerplate  
✅ **Added**: Context immutability clarification  
✅ **Added**: Production reliability safeguards  

📋 **Deferred**: Plugin architecture, circuit breakers, advanced features

The specification now provides a solid foundation that can be extended incrementally.

---

---

## Packaging and Runtime Requirements

### Node.js Support
- **Minimum version**: Node.js >=24 (requires `AsyncLocalStorage` and `fs.writev`)
- **Module format**: **Pure ESM** only. All published JS is ES Modules. No CommonJS build.
- **Package metadata**:
  ```json
  {
    "name": "@semantic-flow/logging",
    "version": "1.0.0",
    "type": "module",
    "main": "./dist/index.js",
    "module": "./dist/index.js",
    "types": "./dist/index.d.ts",
    "exports": {
      ".": {
        "types": "./dist/index.d.ts",
        "import": "./dist/index.js"
      },
      "./package.json": "./package.json"
    },
    "engines": { "node": ">=18.17" }
  }
  ```

### TypeScript Configuration
- **Compile ESM-only types**:
  ```json
  // tsconfig.build.json
  {
    "compilerOptions": {
      "module": "ES2022",
      "target": "ES2022",
      "moduleResolution": "bundler",
      "declaration": true,
      "declarationMap": true,
      "emitDeclarationOnly": false,
      "outDir": "dist",
      "sourceMap": true,
      "inlineSources": true,
      "verbatimModuleSyntax": true,
      "exactOptionalPropertyTypes": true,
      "lib": ["ES2022"]
    },
    "include": ["src"]
  }
  ```

### Runtime ESM Hygiene
- **No `require()`**: Use `import`/`import()` everywhere
- **Replace `__dirname/__filename`**:
  ```typescript
  import { fileURLToPath } from "node:url";
  import { dirname } from "node:path";
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  ```
- **JSON imports**:
  ```typescript
  import schema from "./schema.json" with { type: "json" };
  ```
- **CLI entry point**:
  ```javascript
  #!/usr/bin/env node
  import { run } from '../dist/cli.js';
  run();
  ```

### Consumer Requirements
- **Pure ESM consumers**: Standard `import` statements
- **CommonJS consumers**: Must use dynamic `import('@semantic-flow/logging')`
- **Tree-shaking**: Channels kept in separate files for optimal bundling

### Testing (Vitest)
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'node',
    isolate: true
  }
});
```

### CI/CD Requirements
- **JSON Lines validation**: Lint commit examples to ensure valid JSONL with newline at end
- **Console hygiene**: Enforce no `console.log` in src except inside `ConsoleChannel` or emergency fallback
- **ESM purity check**: Block accidental CJS fields in package.json or `*.cjs` files in dist/
- **Type checking**: Ensure all examples compile without errors
- **Performance benchmarks**: Automated benchmarks comparing against previous versions

### Build Tool Configuration

**TypeScript Compiler (tsc)**:
```bash
tsc --project tsconfig.build.json
```

**tsup**:
```bash
tsup src/index.ts --format esm --dts --sourcemap
```

**Rollup**:
```javascript
export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'esm',
    sourcemap: true
  }
};
```

**esbuild**:
```javascript
esbuild --bundle src/index.ts --format=esm --outfile=dist/index.js --sourcemap
```

### Optional Runtime Guardrails
```typescript
// Add once at package init to catch CJS usage
if (typeof require !== 'undefined') {
  throw new Error('This package is ESM-only. Use import().');
}
```

## TODO

[x] Create the `@semantic-flow/logging` package structure (directories, `package.json`, `tsconfig.json`).
[x] Implement type definitions and interfaces in `shared/logging/src/core/types.ts`.
[x] Implement error types and factory in `shared/logging/src/errors/types.ts` and `shared/logging/src/errors/factory.ts`.
[x] Implement the `ConsoleChannel` and `LogChannel` interface.
[x] Implement the core `Logger` interface and basic `LoggerImpl`.
[x] Implement the configuration system.
[x] Implement main exports and factory functions.
[x] Implement unit tests for core functionality.


## Decision

- modern ESM only, targeting NodeJS >=24


## Summary

Phase 1: Core Infrastructure for the Shared Logging and Error Handling System (`@semantic-flow/logging`) is complete, following the specification in [`documentation/task.2025-11-04-shared-logging-and-errorhandling.md`](documentation/task.2025-11-04-shared-logging-and-errorhandling.md:1).

**Summary of Accomplishments:**

1.  **Package Setup:** Created the `shared/logging/` package structure, including `package.json` and `tsconfig.json` configured for Pure ESM and Node.js >=18.17.
2.  **Core Types:** Implemented all core types and interfaces in [`shared/logging/src/core/types.ts`](shared/logging/src/core/types.ts:1), including `LogLevel`, `LogEntry`, `LogContext`, `LogChannel`, and `LoggerConfig`.
3.  **Error Handling:** Implemented the base [`SemanticFlowError`](shared/logging/src/errors/types.ts:4) class and the `createErrorType` factory function in [`shared/logging/src/errors/types.ts`](shared/logging/src/errors/types.ts:1).
4.  **Configuration:** Implemented the configuration schema, default values, and the `ConfigLoader` class with deep merging and log level parsing in `shared/logging/src/config/`.
5.  **Console Channel:** Implemented the synchronous [`ConsoleChannel`](shared/logging/src/channels/console.ts:9) and necessary formatting utilities (`safeStringify`, `stripAnsi`, `formatCritical`) in [`shared/logging/src/channels/console.ts`](shared/logging/src/channels/console.ts:1) and [`shared/logging/src/core/formatters.ts`](shared/logging/src/core/formatters.ts:1).
6.  **Core Logger:** Implemented the [`Logger`](shared/logging/src/core/logger.ts:23) interface and [`LoggerImpl`](shared/logging/src/core/logger.ts:91) class, including auto-context generation, channel dispatch, and basic timer functionality.
7.  **Context Management:** Implemented the [`ContextManager`](shared/logging/src/core/context.ts:12) using `AsyncLocalStorage` for context propagation.
8.  **Factory Functions:** Implemented the singleton pattern (`initLogger`, `getLogger`) and specialized factory functions (`createCliLogger`, `createServiceLogger`) in [`shared/logging/src/core/logger.ts`](shared/logging/src/core/logger.ts:1).
9.  **Exports:** Consolidated all public exports in [`shared/logging/src/index.ts`](shared/logging/src/index.ts:1).
10. **Unit Tests:** Implemented core unit tests in [`shared/logging/src/__tests__/core.test.ts`](shared/logging/src/__tests__/core.test.ts:1) using a `MockLogger` utility, covering singleton behavior, context propagation, and error handling.

The project is now ready to proceed to Phase 2: Advanced Features, starting with the File Channel implementation.
