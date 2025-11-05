// shared/logging/src/errors/types.ts

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
    // Restore prototype chain for proper instanceof checks
    Object.setPrototypeOf(this, SemanticFlowError.prototype);

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
      // Restore prototype chain for proper instanceof checks
      Object.setPrototypeOf(this, new.target.prototype);
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
    Object.setPrototypeOf(this, ApiError.prototype);
    this.statusCode = statusCode;
  }
}
