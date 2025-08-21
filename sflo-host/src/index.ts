import Fastify from "fastify";
import { loadConfig } from "@semantic-flow/config";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  const app = Fastify({ "logger": true });
  const conf = await loadConfig(configPath);

  // Load plugins dynamically based on environment
  const registry = await loadPlugins();

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
      app.log.warn({ "plugin": p.name }, "plugin not found");
      continue;
    }
    app.log.info({ "plugin": p.name }, "registering plugin");
    await app.register(plugin, p.options ?? {});
  }

  await app.listen({ "host": "127.0.0.1", "port": conf.port });
  return app;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startHost().catch((err) => { console.error(err); process.exit(1); });
}
