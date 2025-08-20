import Fastify from "fastify";
import { loadConfig } from "@semantic-flow/config";

// Import plugins you plan to allow by name
import elements from "@semantic-flow/plugin-elements";
import meshServer from "@semantic-flow/plugin-mesh-server";

const registry = new Map<string, any>([
  ["elements", elements],
  ["mesh-server", meshServer]
  // add: ["sparql", await import("@semantic-flow/plugin-sparql").then(m=>m.default)]
]);

export async function startHost(configPath?: string) {
  const app = Fastify({ "logger": true });
  const conf = await loadConfig(configPath);

  // An example OpenAPI stub so Elements has something to render
  app.get("/openapi.json", async () => ({
    "openapi": "3.0.3",
    "info": { "title": "SFLO API", "version": "0.0.0" },
    "paths": {}
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
