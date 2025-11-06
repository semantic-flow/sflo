// shared/logging/src/core/types.ts

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

// Comprehensive but streamlined log context
export interface LogContext {
  // Core identification
  operation?: string;
  operationId?: string;
  component?: string;
  function?: string;  // Calling function/method name (auto-captured if enabled)

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
    instanceId?: string;
  };
  pid: number;
  hostname?: string;
}

// Error capture options (for logging/reporting)
export interface ErrorCaptureOptions {
  message?: string;
  context?: LogContext;
  logLevel?: LogLevel;
  includeStackTrace?: boolean;
  reportToMonitoring?: boolean;
}

// Error recovery strategies (simplified)
export enum ErrorRecoveryStrategy {
  CONTINUE = 'continue',        // Don't throw, continue execution
  RETHROW = 'rethrow',         // Log then rethrow (default)
  FALLBACK = 'fallback',       // Return fallback value
  RETRY = 'retry'              // Retry operation with backoff
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
    captureFunctionName: boolean;  // Captures calling function name (performance cost)
  };
}
