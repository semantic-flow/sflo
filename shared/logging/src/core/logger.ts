// shared/logging/src/core/logger.ts

import type {
  LogChannel,
  LogEntry,
  LogContext,
  LoggerConfig,
  ErrorCaptureOptions
} from './types.js';
import { LogLevel } from './types.js';
import { ConsoleChannel } from '../channels/console.js';
import { ConfigLoader } from '../config/loader.js';
import { DEFAULT_LOGGER_CONFIG } from '../config/defaults.js';
import { ContextManager } from './context.js';
import { captureFunctionName } from '../utils/stack-trace.js';
import os from 'node:os';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

// --- Global Singleton Instance ---

let _logger: Logger | undefined;

// --- Interfaces (from spec lines 279-313) ---

export interface Timer {
  end(context?: LogContext): void;
  checkpoint(label: string, context?: LogContext): void;
}

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

// --- Implementation ---

// Simple Timer implementation (placeholder for full PerformanceTracker)
class SimpleTimer implements Timer {
  private startTime: number;
  private operation: string;
  private logger: LoggerImpl;

  constructor(operation: string, logger: LoggerImpl) {
    this.operation = operation;
    this.logger = logger;
    this.startTime = Date.now();
  }

  end(context: LogContext = {}): void {
    const duration = Date.now() - this.startTime;
    this.logger.info(`Operation '${this.operation}' completed.`, {
      ...context,
      operation: this.operation,
      duration,
    });
  }

  checkpoint(label: string, context: LogContext = {}): void {
    const duration = Date.now() - this.startTime;
    this.logger.debug(`Checkpoint '${label}' reached in operation '${this.operation}'.`, {
      ...context,
      operation: this.operation,
      duration,
      metadata: { ...context.metadata, checkpoint: label },
    });
  }
}

// Basic implementation of the Logger interface
export class LoggerImpl implements Logger {
  private channels: LogChannel[];
  public readonly config: LoggerConfig; // Expose config for factory functions
  private baseContext: LogContext;
  private hostname: string | undefined;
  private serviceInfo: { name: string; version?: string; instanceId?: string };
  private pid: number;

  constructor(config: LoggerConfig, baseContext: LogContext = {}, channels?: LogChannel[]) {
    this.config = config;
    // Use provided channels if available (for child loggers), otherwise initialize new ones
    this.channels = channels ?? this.initializeChannels(config);
    this.hostname = config.autoContext.includeHostname ? os.hostname() : undefined;
    this.pid = process.pid;

    // Build service info with proper optional handling
    this.serviceInfo = { name: config.serviceName };
    if (config.serviceVersion !== undefined) {
      this.serviceInfo.version = config.serviceVersion;
    }
    if (config.instanceId !== undefined) {
      this.serviceInfo.instanceId = config.instanceId;
    }
    this.baseContext = this.buildBaseContext(baseContext);
  }

  private initializeChannels(config: LoggerConfig): LogChannel[] {
    const channels: LogChannel[] = [];

    // Only ConsoleChannel is implemented so far
    if (config.console.enabled) {
      channels.push(new ConsoleChannel(config.console));
    }

    // Future channels (File, Monitoring) will be added here

    return channels;
  }

  private buildBaseContext(context: LogContext): LogContext {
    // Base context is just the user-provided context
    // System info (hostname, pid, service) is added at log entry creation time
    return { ...context };
  }

  // Core logging logic
  private log(level: LogLevel, message: string, error?: Error, context: LogContext = {}): void {
    // 1. Capture function name if enabled (before any other processing)
    let functionName: string | undefined;
    if (this.config.autoContext.captureFunctionName && !context.function) {
      functionName = captureFunctionName(2); // Skip 2 frames: log() and the public method (info/debug/etc)
    }

    // 2. Merge context (base context + call context + captured function name)
    const mergedContext = {
      ...this.baseContext,
      ...context,
      ...(functionName && { function: functionName }),
    };

    // 3. Build LogEntry
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      message,
      context: mergedContext,
      service: this.serviceInfo,
      pid: this.pid,
      ...(this.hostname !== undefined && { hostname: this.hostname }),
    };

    // 3. Extract error details if present
    if (error) {
      const stack = error.stack ? error.stack.split('\n') : undefined;
      const code = (error as any).code;
      entry.error = {
        name: error.name,
        message: error.message,
        ...(stack !== undefined && { stack }),
        ...(code !== undefined && { code }),
      };
    }

    // 4. Write to all channels
    for (const channel of this.channels) {
      // Note: Channels handle their own level filtering
      try {
        channel.write(entry);
      } catch (e) {
        // Critical: If a channel fails, log to console.error as fallback
        console.error(`Logger channel failed to write entry: ${e}`, entry);
      }
    }
  }

  // --- Logger Interface Methods ---

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

  // Context management (returns a new LoggerImpl instance with merged context)
  // IMPORTANT: Child loggers share the parent's channel instances to avoid resource leaks
  withContext(context: LogContext): Logger {
    const newContext = { ...this.baseContext, ...context };
    // Share channels with the parent to avoid creating duplicate channel instances
    return new LoggerImpl(this.config, newContext, this.channels);
  }

  withOperation(operation: string, operationId?: string): Logger {
    const context: LogContext = { operation };
    if (operationId !== undefined) {
      context.operationId = operationId;
    }
    return this.withContext(context);
  }

  withComponent(component: string): Logger {
    return this.withContext({ component });
  }

  child(context: LogContext): Logger {
    return this.withContext(context);
  }

  // Performance tracking
  startTimer(operation: string): Timer {
    return new SimpleTimer(operation, this);
  }

  // Error capture (placeholder implementation)
  captureError(error: unknown, options?: ErrorCaptureOptions): void {
    // This is a placeholder. Full implementation will be in errors/capture.ts
    const level = options?.logLevel ?? LogLevel.ERROR;
    const message = options?.message ?? (error instanceof Error ? error.message : String(error));
    const context = options?.context;

    if (error instanceof Error) {
      this.log(level, message, error, context);
    } else {
      this.log(level, message, undefined, { ...context, errorCause: error });
    }
  }

  // Lifecycle management
  async flush(): Promise<void> {
    await Promise.all(this.channels.map(c => c.flush()));
  }

  async close(): Promise<void> {
    await Promise.all(this.channels.map(c => c.close()));
  }
}

// --- Factory Functions (from spec lines 319-343) ---

/**
 * Initializes the global logger singleton. Must be called once at startup.
 * If called multiple times, it merges the new config with the existing one and properly closes old channels.
 * @param config Optional partial configuration.
 * @returns The initialized Logger instance.
 */
export async function initLogger(config?: Partial<LoggerConfig>): Promise<Logger> {
  const initialConfig = _logger
    ? (_logger as LoggerImpl).config // Use existing config if present
    : DEFAULT_LOGGER_CONFIG;

  const finalConfig = ConfigLoader.merge(initialConfig, config || {});

  // If logger exists, close old channels gracefully before replacing
  if (_logger) {
    await _logger.close().catch(e => console.error("Error closing old logger channels:", e));
  }

  _logger = new LoggerImpl(finalConfig);
  return _logger;
}

/**
 * Retrieves the global logger singleton. Initializes with defaults if not yet called.
 * Note: If the logger hasn't been initialized yet, this creates a synchronous default instance.
 * For proper async initialization with channel cleanup, use initLogger() at startup.
 * @returns The global Logger instance.
 */
export function getLogger(): Logger {
  if (!_logger) {
    // Initialize synchronously with defaults if accessed before explicit init
    // This is safe because there are no old channels to close
    const finalConfig = ConfigLoader.merge(DEFAULT_LOGGER_CONFIG, {});
    _logger = new LoggerImpl(finalConfig);
  }
  // If running within an AsyncLocalStorage context, return a child logger
  const currentContext = ContextManager.current();
  if (currentContext) {
    return _logger.child(currentContext);
  }
  return _logger;
}

/**
 * Resets the global logger instance for testing purposes.
 * Properly closes any existing logger channels before resetting.
 */
export async function __resetLoggerForTests(): Promise<void> {
  if (_logger) {
    await _logger.close().catch(e => console.error("Error closing logger in test reset:", e));
  }
  _logger = undefined;
}

/**
 * Creates a new Logger instance (non-singleton).
 * @param config Optional partial configuration.
 * @returns A new Logger instance.
 */
export function createLogger(config?: Partial<LoggerConfig>): Logger {
  const finalConfig = ConfigLoader.merge(DEFAULT_LOGGER_CONFIG, config || {});
  return new LoggerImpl(finalConfig);
}

/**
 * Creates a logger optimized for CLI usage.
 * @param options CLI specific options.
 * @returns A new Logger instance.
 */
export function createCliLogger(options?: {
  verbose?: boolean;
  quiet?: boolean;
  format?: 'pretty' | 'json';
}): Logger {
  const level = options?.verbose ? 'debug' : options?.quiet ? 'warn' : 'info';
  const format = options?.format || 'pretty';

  let serviceName = 'cli-tool';
  if (process.argv[1]) {
    try {
      serviceName = fileURLToPath(process.argv[1]).split('/').pop() || 'cli-tool';
    } catch {
      // If process.argv[1] is not a valid file URL, use default
      serviceName = 'cli-tool';
    }
  }

  const config: Partial<LoggerConfig> = {
    console: {
      enabled: true,
      level: level as any, // ConfigLoader will parse string to enum
      format,
    },
    async: false, // CLI often benefits from synchronous output
    serviceName,
  };

  return createLogger(config);
}

/**
 * Creates a logger optimized for long-running service usage.
 * @param serviceName The name of the service.
 * @param options Service specific options.
 * @returns A new Logger instance.
 */
export function createServiceLogger(serviceName: string, options?: {
  enableFileLogging?: boolean;
  enableMonitoring?: boolean;
  environment?: string;
}): Logger {
  const config: Partial<LoggerConfig> = {
    serviceName,
    environment: options?.environment as any || 'production',
    console: {
      enabled: true,
      level: LogLevel.INFO,
      format: 'json',
    },
    file: {
      enabled: options?.enableFileLogging || false,
      level: LogLevel.DEBUG,
      format: 'json',
    },
    monitoring: {
      enabled: options?.enableMonitoring || false,
      level: LogLevel.ERROR,
      format: 'json',
    },
    async: true, // Services benefit from async buffering
  };

  return createLogger(config);
}

/**
 * Creates a component-scoped logger that automatically includes the component name.
 * Uses the global logger singleton.
 * @param sourceUrl The import.meta.url of the calling module.
 * @returns A child Logger instance with component context.
 */
export function getComponentLogger(sourceUrl: string /* import.meta.url */): Logger {
  const file = fileURLToPath(sourceUrl);
  const parts = file.split("/");
  const base = parts.pop() ?? "unknown";
  const component = base.replace(/\.(m|c)?js|ts$/, "");

  // Use ContextManager.merge to ensure ALS context is preserved
  const mergedContext = ContextManager.merge({ component });

  return getLogger().child(mergedContext);
}
