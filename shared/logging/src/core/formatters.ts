// shared/logging/src/core/formatters.ts

import type { LogEntry, LogContext } from './types.js';
import { LogLevel } from './types.js';

// --- Constants for safe serialization ---
const MAX_CTX = 20_000;
const MAX_MSG = 2_000;
// const MAX_STACK = 50; // Not used directly in safeStringify

/**
 * Safely serializes a value to JSON, handling circular references, truncation,
 * and potential serialization errors.
 * @param value The value to serialize (e.g., LogEntry context).
 * @param maxLength Maximum length for the resulting string.
 * @returns A safe JSON string representation.
 */
export function safeStringify(value: any, maxLength: number = MAX_CTX): string {
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

/**
 * Strips ANSI escape codes from a string.
 * @param text The input string.
 * @returns The string without ANSI codes.
 */
export function stripAnsi(text: string): string {
  // Regex to match ANSI escape codes
  return text.replace(/\x1b\[[0-9;]*m/g, '');
}

// PII redaction hook types (defined in spec lines 1159-1161)
type RedactFn = (key: string, value: any) => any;
type RedactConfig = string[] | RedactFn;

/**
 * Applies redaction rules to a LogEntry.
 * @param entry The log entry.
 * @param redact Redaction configuration (array of fields or custom function).
 * @returns A new LogEntry with redacted fields.
 */
export function applyRedaction(entry: LogEntry, redact?: RedactConfig): LogEntry {
  if (!redact) return entry;

  // Use safeStringify's logic for deep cloning and redaction
  const replacer = (key: string, value: any) => {
    if (Array.isArray(redact)) {
      // Field-based redaction
      const redactFields = new Set(redact);
      return redactFields.has(key) ? '[REDACTED]' : value;
    } else if (typeof redact === 'function') {
      // Custom redaction function
      return redact(key, value);
    }
    return value;
  };

  // Perform deep clone and redaction using JSON.parse(JSON.stringify)
  // Note: This loses non-JSON-serializable properties (like functions/symbols) but is safe for LogEntry structure.
  try {
    return JSON.parse(safeStringify(entry, Infinity), replacer);
  } catch (e) {
    // Fallback if redaction logic fails unexpectedly
    console.error("Redaction failed:", e);
    return entry;
  }
}

/**
 * Formats a LogEntry into a single JSON Lines string, ensuring no ANSI codes.
 * @param entry The log entry.
 * @param redact Optional redaction configuration.
 * @returns A JSON Lines string (JSON object followed by \n).
 */
export function formatJsonLine(entry: LogEntry, redact?: RedactConfig): string {
  const redacted = applyRedaction(entry, redact);
  const serialized = safeStringify(redacted, Infinity); // Use Infinity for full serialization before stripping
  return stripAnsi(serialized) + '\n';
}

/**
 * Formats a critical log entry (ERROR/FATAL) for synchronous stderr output.
 * This format is minimal and guaranteed to be fast.
 * @param entry The log entry.
 * @returns A minimal JSON Lines string.
 */
export function formatCritical(entry: LogEntry): string {
  // Based on spec lines 1114-1119
  const line = safeStringify({
    t: entry.timestamp,
    lvl: entry.level,
    msg: entry.message,
    rid: entry.context?.requestId
  }, 500) + '\n'; // Truncate critical path output to 500 chars for safety

  return stripAnsi(line);
}

// Placeholder for TTY/Pipe formatting (will be implemented later if needed, but ConsoleChannel needs the signatures)
export function formatForTTY(entry: LogEntry): string {
  // Placeholder for pretty formatting
  return formatJsonLine(entry);
}

export function formatForPipe(entry: LogEntry): string {
  // Placeholder for compact/json formatting
  return formatJsonLine(entry);
}
