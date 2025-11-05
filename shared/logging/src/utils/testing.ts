// shared/logging/src/utils/testing.ts

import type {
  LogEntry,
  LogContext,
  ErrorCaptureOptions,
  LoggerConfig,
  LogChannel
} from '../core/types.js';
import { LogLevel } from '../core/types.js';
import type { Logger, Timer } from '../core/logger.js';
import { LoggerImpl } from '../core/logger.js';
import { DEFAULT_LOGGER_CONFIG } from '../config/defaults.js';

/**
 * A mock implementation of LogChannel that captures entries in an array.
 */
export class MockChannel implements LogChannel {
  public readonly minLevel: LogLevel;
  public entries: LogEntry[] = [];

  constructor(minLevel: LogLevel = LogLevel.TRACE) {
    this.minLevel = minLevel;
  }

  write(entry: LogEntry): void {
    if (entry.level >= this.minLevel) {
      this.entries.push(entry);
    }
  }

  flush(): Promise<void> {
    return Promise.resolve();
  }

  close(): Promise<void> {
    return Promise.resolve();
  }
}

/**
 * A mock implementation of Logger that records logs and captured errors.
 * It uses a MockChannel internally.
 */
export class MockLogger extends LoggerImpl implements Logger {
  public logs: LogEntry[] = [];
  public capturedErrors: Array<{ error: unknown; options?: ErrorCaptureOptions }> = [];
  public mockChannel: MockChannel;

  constructor(config: LoggerConfig = DEFAULT_LOGGER_CONFIG, baseContext: LogContext = {}) {
    // Override channel initialization to use MockChannel
    const mockConfig: LoggerConfig = {
      ...config,
      console: { ...config.console, enabled: false },
      file: { ...config.file, enabled: false },
      monitoring: { ...config.monitoring, enabled: false },
    };

    super(mockConfig, baseContext);

    // Replace the internal channels with a single MockChannel
    this.mockChannel = new MockChannel(config.console.level); // Use console level as default capture level
    (this as any).channels = [this.mockChannel];
  }

  // Override log methods to ensure they use the internal MockChannel
  // (LoggerImpl already implements these via the private log method)

  // Override captureError to record captured errors explicitly
  captureError(error: unknown, options?: ErrorCaptureOptions): void {
    if (options !== undefined) {
      this.capturedErrors.push({ error, options });
    } else {
      this.capturedErrors.push({ error });
    }
    super.captureError(error, options);
  }

  // Test utilities
  findLogsByLevel(level: LogLevel): LogEntry[] {
    return this.mockChannel.entries.filter(e => e.level === level);
  }

  findLogsByComponent(component: string): LogEntry[] {
    return this.mockChannel.entries.filter(e => e.context?.component === component);
  }

  findLogsByOperation(operation: string): LogEntry[] {
    return this.mockChannel.entries.filter(e => e.context?.operation === operation);
  }

  hasErrorWithCode(code: string): boolean {
    return this.capturedErrors.some(e => (e.error as any)?.code === code);
  }

  clearLogs(): void {
    this.mockChannel.entries.length = 0;
    this.capturedErrors.length = 0;
  }
}

export class LoggerTestUtils {
  static createMockLogger(config?: Partial<LoggerConfig>): MockLogger {
    const finalConfig = { ...DEFAULT_LOGGER_CONFIG, ...config } as LoggerConfig;
    return new MockLogger(finalConfig);
  }

  static createTestConfig(): LoggerConfig {
    return DEFAULT_LOGGER_CONFIG;
  }

  // Placeholder for waitForLogs (requires async testing framework integration)
  static async waitForLogs(logger: MockLogger, count: number, timeout: number = 100): Promise<void> {
    return new Promise((resolve, reject) => {
      const check = () => {
        if (logger.mockChannel.entries.length >= count) {
          resolve();
        } else {
          setTimeout(check, 10);
        }
      };
      setTimeout(() => reject(new Error(`Timeout waiting for ${count} logs`)), timeout);
      check();
    });
  }
}
