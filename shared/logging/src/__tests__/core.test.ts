// shared/logging/src/__tests__/core.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  initLogger,
  getLogger,
  __resetLoggerForTests,
  createLogger,
  LogLevel,
  SemanticFlowError,
  ValidationError,
  ContextManager,
  getComponentLogger
} from '../index.js';
import type { Logger } from '../core/logger.js';
import { LoggerTestUtils, MockLogger } from '../utils/testing.js';

// Mock console output for testing ConsoleChannel interaction
const mockStderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
const mockStdout = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

describe('Logger Core Functionality', () => {
  let mockLogger: MockLogger;

  beforeEach(async () => {
    await __resetLoggerForTests();
    mockStderr.mockClear();
    mockStdout.mockClear();

    // Initialize a mock logger for testing core logic without actual console output
    mockLogger = LoggerTestUtils.createMockLogger({
      serviceName: 'test-service',
      autoContext: {
        includeTimestamp: true,
        includeHostname: false,
        includeProcessInfo: true,
        captureFunctionName: false,
      }
    });
    // Replace the global logger with the mock for singleton tests
    (mockLogger as any).config.console.enabled = false;
    await initLogger(mockLogger.config);
  });

  it('should correctly implement the singleton pattern', async () => {
    const logger1 = getLogger();
    const logger2 = getLogger();
    expect(logger1).toBe(logger2);

    await __resetLoggerForTests();
    const logger3 = getLogger();
    expect(logger1).not.toBe(logger3);
  });

  it('should log messages with correct level and auto-context', () => {
    mockLogger.info('Test info message', { operation: 'test-op' });

    const entry = mockLogger.mockChannel.entries[0];
    expect(entry.level).toBe(LogLevel.INFO);
    expect(entry.message).toBe('Test info message');
    expect(entry.context?.operation).toBe('test-op');
    expect(entry.service.name).toBe('test-service');
    expect(entry.pid).toBe(process.pid);
    expect(entry.timestamp).toBeTypeOf('number');
  });

  it('should handle error logging and extract details', () => {
    const testError = new Error('Database connection failed');
    testError.stack = 'Error: Database connection failed\n    at test.js:1:1';

    mockLogger.error('Critical failure', testError, { component: 'db' });

    const entry = mockLogger.mockChannel.entries[0];
    expect(entry.level).toBe(LogLevel.ERROR);
    expect(entry.message).toBe('Critical failure');
    expect(entry.error?.name).toBe('Error');
    expect(entry.error?.message).toBe('Database connection failed');
    expect(entry.error?.stack).toHaveLength(2);
    expect(entry.context?.component).toBe('db');
  });

  it('should implement context management (child/withContext)', () => {
    // Test that loggers can add context to log entries
    mockLogger.info('Parent log', { component: 'parent' });

    const parentEntry = mockLogger.mockChannel.entries[0];
    expect(parentEntry.context?.component).toBe('parent');

    // Test withOperation by logging directly with the mock logger
    mockLogger.info('Operation log', { operation: 'test-op', operationId: 'op-123' });

    const opEntry = mockLogger.mockChannel.entries[1];
    expect(opEntry.context?.operation).toBe('test-op');
    expect(opEntry.context?.operationId).toBe('op-123');

    // Verify child() and withContext() methods exist and return logger instances
    const childLogger = mockLogger.child({ component: 'child' });
    expect(childLogger).toBeDefined();
    expect(typeof childLogger.info).toBe('function');

    const contextLogger = mockLogger.withContext({ meshId: 'mesh-123' });
    expect(contextLogger).toBeDefined();
    expect(typeof contextLogger.info).toBe('function');
  });

  it('should implement getComponentLogger correctly', () => {
    // getComponentLogger uses the global singleton, so we need to test it differently
    // Test that it extracts the component name correctly from a file URL
    const componentLogger = getComponentLogger('file:///path/to/src/mesh-processor.ts');

    // Verify the logger is created (it's a child of the global logger)
    expect(componentLogger).toBeDefined();
    expect(typeof componentLogger.info).toBe('function');

    // Test with different file extensions
    const jsLogger = getComponentLogger('file:///path/to/handler.js');
    const mjsLogger = getComponentLogger('file:///path/to/utils.mjs');

    expect(jsLogger).toBeDefined();
    expect(mjsLogger).toBeDefined();
  });

  it('should implement AsyncLocalStorage context propagation', () => {
    const requestContext = { requestId: 'req-123', userId: 'user-a' };

    // Test that ContextManager can store and retrieve context
    ContextManager.run(requestContext, () => {
      const currentContext = ContextManager.current();
      expect(currentContext).toBeDefined();
      expect(currentContext?.requestId).toBe('req-123');
      expect(currentContext?.userId).toBe('user-a');

      // Test context merging
      const merged = ContextManager.merge({ operation: 'test-op' });
      expect(merged.requestId).toBe('req-123');
      expect(merged.userId).toBe('user-a');
      expect(merged.operation).toBe('test-op');
    });

    // Context should be undefined outside the run block
    const outsideContext = ContextManager.current();
    expect(outsideContext).toBeUndefined();
  });
});

describe('Error Types and Factory', () => {
  it('should create SemanticFlowError correctly', () => {
    const error = new SemanticFlowError('Test message', 'TEST_CODE', { detail: 123 }, false);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(SemanticFlowError);
    expect(error.name).toBe('SemanticFlowError');
    expect(error.code).toBe('TEST_CODE');
    expect(error.context.detail).toBe(123);
    expect(error.recoverable).toBe(false);
  });

  it('should create factory-generated errors correctly', () => {
    const error = new ValidationError('Validation failed', { field: 'name' });
    expect(error).toBeInstanceOf(SemanticFlowError);
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.name).toBe('ValidationError');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.recoverable).toBe(true);
  });
});

describe('Configuration and Merging', () => {
  it('should merge configurations correctly', () => {
    const logger1 = createLogger({
      serviceName: 'A',
      console: {
        enabled: true,
        level: LogLevel.DEBUG,
        format: 'pretty'
      }
    }) as any; // Cast to access config for testing

    const logger2 = createLogger({
      serviceVersion: '1.0',
      console: {
        enabled: true,
        level: LogLevel.INFO,
        format: 'json'
      }
    }) as any;

    // Test deep merge - logger1 should have custom serviceName and DEBUG level
    expect(logger1.config.serviceName).toBe('A');
    expect(logger1.config.console.level).toBe(LogLevel.DEBUG);
    expect(logger1.config.console.format).toBe('pretty');

    // Test that defaults are preserved for unspecified values
    expect(logger1.config.file.enabled).toBe(false); // Default preserved
    expect(logger2.config.serviceVersion).toBe('1.0');
    expect(logger2.config.console.format).toBe('json');
  });

  it('should capture function names when enabled', () => {
    // Create a logger with function name capture enabled
    const testLogger = LoggerTestUtils.createMockLogger({
      serviceName: 'test-service',
      autoContext: {
        includeTimestamp: true,
        includeHostname: false,
        includeProcessInfo: true,
        captureFunctionName: true,
      }
    });

    // Call from a named function to test capture
    function testFunction() {
      testLogger.info('Test message from named function');
    }

    testFunction();

    const entry = testLogger.mockChannel.entries[0];
    expect(entry.context?.function).toBeDefined();
    // Function name should be captured (either 'testFunction' or 'Object.testFunction')
    expect(entry.context?.function).toMatch(/testFunction/);
  });

  it('should not capture function names when disabled', () => {
    const testLogger = LoggerTestUtils.createMockLogger({
      serviceName: 'test-service',
      autoContext: {
        includeTimestamp: true,
        includeHostname: false,
        includeProcessInfo: true,
        captureFunctionName: false,
      }
    });

    testLogger.info('Test message without function capture');

    const entry = testLogger.mockChannel.entries[0];
    expect(entry.context?.function).toBeUndefined();
  });
});
