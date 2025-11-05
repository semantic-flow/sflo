// shared/logging/src/core/context.ts

import { AsyncLocalStorage } from 'node:async_hooks';
import type { LogContext } from './types.js';

/**
 * Manages asynchronous context propagation using Node.js AsyncLocalStorage.
 * This allows loggers to automatically pick up context (like request IDs)
 * across asynchronous operations.
 */
export class ContextManager {
  // AsyncLocalStorage instance to store LogContext per async execution context
  private static als = new AsyncLocalStorage<LogContext>();

  /**
   * Runs a synchronous function within a specific logging context.
   * @param context The context to establish.
   * @param fn The function to run.
   * @returns The result of the function.
   */
  static run<T>(context: LogContext, fn: () => T): T {
    return this.als.run(context, fn);
  }

  /**
   * Runs an asynchronous function within a specific logging context.
   * @param context The context to establish.
   * @param fn The asynchronous function to run.
   * @returns A promise resolving to the result of the function.
   */
  static runAsync<T>(context: LogContext, fn: () => Promise<T>): Promise<T> {
    // AsyncLocalStorage handles promise chaining automatically
    return this.als.run(context, fn);
  }

  /**
   * Retrieves the current logging context from the AsyncLocalStorage store.
   * @returns The current LogContext or undefined if none is set.
   */
  static current(): LogContext | undefined {
    return this.als.getStore();
  }

  /**
   * Merges a new context with the current context from AsyncLocalStorage.
   * @param context The new context to merge.
   * @returns The merged LogContext.
   */
  static merge(context: LogContext): LogContext {
    const current = this.current();
    // Shallow merge: new context overrides current context properties
    return current ? { ...current, ...context } : context;
  }
}
