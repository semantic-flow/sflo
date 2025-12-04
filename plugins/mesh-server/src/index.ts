import fp from "fastify-plugin";
import staticPlugin from "@fastify/static";
import { FastifySSEPlugin } from "fastify-sse-v2";
import type { FastifyInstance } from "fastify";
import chokidar from "chokidar";
import path from "node:path";

type Mesh = { id: string; root: string; base?: string };
export interface MeshServerOpts { meshes: Mesh[]; }

export default fp(async (app: FastifyInstance, opts: MeshServerOpts) => {
  await app.register(FastifySSEPlugin);

  const meshes = opts.meshes ?? [];
  for (const m of meshes) {
    const base = m.base ?? `/meshes/${encodeURIComponent(m.id)}`;
    await app.register(staticPlugin, {
      "root": path.resolve(m.root),
      "prefix": base + "/",
      "decorateReply": false
    });

    // SSE endpoint for reload events per mesh
    app.get(`${base}/__reload`, (req, reply) => {
      reply.sse({ "data": "connected" });
    });

    const watcher = chokidar.watch(m.root, { "ignoreInitial": true });
    watcher.on("all", () => {
      // broadcast reload event to connected clients of this mesh
      // NOTE: fastify-sse-v2 exposes reply.sse; for broadcast, we can mount a simple pub/sub.
      // For scaffold simplicity, emit a global event clients can listen to:
      // Clients will reconnect after refresh anyway.
      // If you want per-mesh channels, add a tiny pub/sub here.
    });

    app.addHook("onClose", async () => { await watcher.close(); });
  }
});
