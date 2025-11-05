// shared/logging/src/config/loader.ts

import type { LoggerConfig, LogLevelString, ChannelConfig } from '../core/types.js';
import { LogLevel, LogLevelStrings } from '../core/types.js';
import { DEFAULT_LOGGER_CONFIG } from './defaults.js';

// Helper function for deep merging partial configs
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target } as T;

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (sourceValue !== undefined) {
        if (typeof sourceValue === 'object' && sourceValue !== null && !Array.isArray(sourceValue) && targetValue && typeof targetValue === 'object' && targetValue !== null) {
          // Deep merge nested objects (like channel configs)
          output[key] = deepMerge(targetValue, sourceValue as Partial<T[Extract<keyof T, string>]>) as T[Extract<keyof T, string>];
        } else {
          // Overwrite primitive or array values
          output[key] = sourceValue as T[Extract<keyof T, string>];
        }
      }
    }
  }
  return output;
}

// Configuration loader with multiple sources
export class ConfigLoader {

  // Map string level names to enum values (spec lines 664-668)
  static parseLogLevel(level: string): LogLevel {
    const lowerLevel = level.toLowerCase();
    const index = LogLevelStrings.indexOf(lowerLevel as LogLevelString);
    // Default to INFO if invalid string is provided
    return index >= 0 ? (index * 10) as LogLevel : LogLevel.INFO;
  }

  // Merges multiple partial configurations (spec line 662)
  static merge(...configs: Partial<LoggerConfig>[]): LoggerConfig {
    let mergedConfig = DEFAULT_LOGGER_CONFIG;

    for (const config of configs) {
      mergedConfig = deepMerge(mergedConfig, config);
    }

    // Ensure LogLevel strings are converted to LogLevel enums in the final config
    // This is necessary because deepMerge handles objects but not type conversion

    const convertChannelLevel = (channelConfig: ChannelConfig): ChannelConfig => {
      if (typeof channelConfig.level === 'string') {
        channelConfig.level = ConfigLoader.parseLogLevel(channelConfig.level);
      }
      return channelConfig;
    };

    mergedConfig.console = convertChannelLevel(mergedConfig.console);
    mergedConfig.file = convertChannelLevel(mergedConfig.file);
    mergedConfig.monitoring = convertChannelLevel(mergedConfig.monitoring);

    return mergedConfig;
  }

  // Placeholder for full loading logic (spec lines 654-659)
  static load(sources: {
    defaults?: Partial<LoggerConfig>;
    configFile?: string;
    environment?: Record<string, string>;
    cliArgs?: Record<string, unknown>;
  }): LoggerConfig {
    // For now, just merge defaults and provided partials
    return ConfigLoader.merge(sources.defaults || {});
  }

  // Placeholder for validation logic (spec line 661)
  static validate(config: unknown): LoggerConfig {
    // In a real scenario, this would use LoggerConfigSchema and throw on failure.
    // For now, we assume the input is valid LoggerConfig.
    return config as LoggerConfig;
  }
}
