// shared/logging/src/utils/stack-trace.ts

/**
 * Captures the calling function name from the call stack.
 * This is an expensive operation and should only be enabled in development environments.
 * 
 * @param skipFrames Number of stack frames to skip (default: 3 to skip this function + logger.log() + logger.info/debug/etc)
 * @returns The function name or undefined if it cannot be determined
 */
export function captureFunctionName(skipFrames: number = 3): string | undefined {
  try {
    // Create an error to capture the stack trace
    const stack = new Error().stack;
    if (!stack) {
      return undefined;
    }

    // Split stack into lines
    const lines = stack.split('\n');

    // Skip the specified number of frames
    // Typical stack for logger.info() call:
    // 0: Error
    // 1: captureFunctionName (this function)
    // 2: LoggerImpl.log (private method)
    // 3: LoggerImpl.info/debug/error/etc (public method)
    // 4: <actual calling function> <- We want this one
    const targetLine = lines[skipFrames + 2]; // +2 to skip this function and reach the caller

    if (!targetLine) {
      return undefined;
    }

    // Extract function name using regex patterns
    // Patterns we need to handle:
    // 1. "at functionName (file.js:line:col)"
    // 2. "at ClassName.methodName (file.js:line:col)"
    // 3. "at async functionName (file.js:line:col)"
    // 4. "at Object.<anonymous> (file.js:line:col)" - skip these
    // 5. "at file.js:line:col" - anonymous function

    // Match: "at [async] [ClassName.]functionName"
    const match = targetLine.match(/at\s+(?:async\s+)?(?:([^.\s]+)\.)?([^\s(]+)/);

    if (match) {
      const [, className, methodName] = match;

      // Skip anonymous functions
      if (methodName === '<anonymous>' || methodName === 'Object') {
        return undefined;
      }

      // Return "ClassName.methodName" or just "functionName"
      return className ? `${className}.${methodName}` : methodName;
    }

    return undefined;
  } catch (error) {
    // Never throw from logging infrastructure
    return undefined;
  }
}

/**
 * Extracts a clean stack trace from an error, removing internal logging frames.
 * 
 * @param error The error to extract stack from
 * @param maxFrames Maximum number of frames to include (default: 10)
 * @returns Array of stack frames or undefined
 */
export function extractStackTrace(error: Error, maxFrames: number = 10): string[] | undefined {
  if (!error.stack) {
    return undefined;
  }

  const lines = error.stack.split('\n');

  // Filter out internal logging frames and limit to maxFrames
  const frames = lines
    .slice(1) // Skip the error message line
    .filter(line => {
      // Filter out internal logger frames
      return !line.includes('/logging/src/') ||
        line.includes('/logging/src/__tests__/'); // But keep test frames
    })
    .slice(0, maxFrames)
    .map(line => line.trim());

  return frames.length > 0 ? frames : undefined;
}
