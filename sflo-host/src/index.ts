import Fastify from "fastify";
import { loadConfig } from "@semantic-flow/config";
import { initLogger, getLogger, getComponentLogger } from "@semantic-flow/logging";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Component-scoped logger for this module
const logger = getComponentLogger(import.meta.url);

// Dynamic plugin loading - use source files in development
async function loadPlugins() {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    // Load from source files for hot reload
    const elementsPath = join(__dirname, '../../plugins/elements/src/index.ts');
    const meshServerPath = join(__dirname, '../../plugins/mesh-server/src/index.ts');

    const [elements, meshServer] = await Promise.all([
      import(elementsPath).then(m => m.default),
      import(meshServerPath).then(m => m.default)
    ]);

    return new Map<string, any>([
      ["elements", elements],
      ["mesh-server", meshServer]
    ]);
  } else {
    // Load from built packages in production
    const [elements, meshServer] = await Promise.all([
      import("@semantic-flow/plugin-elements").then(m => m.default),
      import("@semantic-flow/plugin-mesh-server").then(m => m.default)
    ]);

    return new Map<string, any>([
      ["elements", elements],
      ["mesh-server", meshServer]
    ]);
  }
}

export async function startHost(configPath?: string) {
  // Initialize logging system first
  await initLogger({
    serviceName: 'sflo-host',
    serviceVersion: '0.0.0',
    environment: (process.env.NODE_ENV as any) || 'development',
    console: {
      enabled: true,
      level: process.env.NODE_ENV === 'production' ? 20 : 10, // INFO in prod, DEBUG in dev
      format: process.env.NODE_ENV === 'production' ? 'json' : 'pretty',
    }
  });

  logger.info('Starting SFLO Host');

  // Create Fastify instance without built-in logger (we'll use our own)
  const app = Fastify({ logger: false });

  const conf = await loadConfig(configPath);
  logger.debug('Configuration loaded', { metadata: { configPath } });

  // Load plugins dynamically based on environment
  const registry = await loadPlugins();
  logger.debug('Plugins loaded', { metadata: { pluginCount: registry.size } });

  // An example OpenAPI stub so Elements has something to render
  // in sflo-host/src/index.ts
  app.get("/openapi.json", async () => ({
    openapi: "3.0.3",
    info: { title: "SFLO API", version: "0.1.0" },
    paths: {
      "/health": {
        get: {
          summary: "Health check",
          responses: {
            "200": {
              description: "OK",
              content: { "text/plain": { schema: { type: "string" }, example: "ok" } }
            }
          }
        }
      }
    }
  }));

  for (const p of conf.plugins) {
    if (p.enabled === false) continue;
    const plugin = registry.get(p.name);
    if (!plugin) {
      logger.warn('Plugin not found', { metadata: { plugin: p.name } });
      continue;
    }
    logger.info('Registering plugin', { metadata: { plugin: p.name } });
    await app.register(plugin, p.options ?? {});
  }

  await app.listen({ "host": "127.0.0.1", "port": conf.port });
  logger.info('SFLO Host listening', { metadata: { host: '127.0.0.1', port: conf.port } });

  return app;
}

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await getLogger().flush();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await getLogger().flush();
  process.exit(130);
});

if (import.meta.url === `file://${process.argv[1]}`) {
  startHost().catch((err) => {
    logger.fatal('Failed to start SFLO Host', err instanceof Error ? err : undefined, {
      metadata: { errorValue: err instanceof Error ? undefined : err }
    });
    process.exit(1);
  });
}
