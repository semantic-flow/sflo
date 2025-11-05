// shared/logging/src/channels/console.ts

import type { LogChannel, LogEntry, ChannelConfig } from '../core/types.js';
import { LogLevel } from '../core/types.js';
import { formatCritical, formatForTTY, formatForPipe } from '../core/formatters.js';

// Define the ConsoleChannel class
export class ConsoleChannel implements LogChannel {
  public readonly minLevel: LogLevel;
  private config: ChannelConfig['console'];

  constructor(config: ChannelConfig) {
    this.minLevel = config.level;
    this.config = config.console;
  }

  write(entry: LogEntry): void {
    // Guard against entries below minimum level
    if (entry.level < this.minLevel) return;

    // Always synchronous for console - push async work to buffer
    if (entry.level >= LogLevel.ERROR) {
      this.writeSynchronous(entry, process.stderr);
    } else {
      this.writeStandard(entry, process.stdout);
    }
  }

  flush(): Promise<void> {
    // Console doesn't buffer internally, so flush is a no-op
    return Promise.resolve();
  }

  close(): Promise<void> {
    return Promise.resolve();
  }

  // Synchronous critical path for errors (writes to stderr)
  private writeSynchronous(entry: LogEntry, stream: NodeJS.WriteStream): void {
    const line = formatCritical(entry);
    try {
      stream.write(line);
    } catch {
      // Best effort - never throw from logging
    }
  }

  // Standard output for non-critical levels (writes to stdout)
  private writeStandard(entry: LogEntry, stream: NodeJS.WriteStream): void {
    const line = stream.isTTY
      ? formatForTTY(entry)
      : formatForPipe(entry);

    try {
      stream.write(line);
    } catch {
      // Best effort - never throw from logging
    }
  }
}
