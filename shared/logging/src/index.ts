// shared/logging/src/index.ts

// Core Types and Interfaces
export * from './core/types.js';
export type { Logger, Timer } from './core/logger.js';

// Core Implementation
export { LoggerImpl } from './core/logger.js';

// Factory and Singleton Functions
export {
  initLogger,
  getLogger,
  createLogger,
  createCliLogger,
  createServiceLogger,
  getComponentLogger,
  __resetLoggerForTests
} from './core/logger.js';

// Error Handling
export {
  SemanticFlowError,
  createErrorType,
  ValidationError,
  ConfigurationError,
  MeshProcessingError,
  ApiError
} from './errors/types.js';

// Context Management
export { ContextManager } from './core/context.js';

// Configuration
export { ConfigLoader } from './config/loader.js';
export { DEFAULT_LOGGER_CONFIG } from './config/defaults.js';

// Channels (only ConsoleChannel for now)
export { ConsoleChannel } from './channels/console.js';

// Utilities (Formatters)
export { safeStringify, stripAnsi, formatJsonLine, formatCritical } from './core/formatters.js';
