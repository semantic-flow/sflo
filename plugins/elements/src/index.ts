import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";

export interface ElementsOpts { path?: string; specUrl?: string; }

export default fp(async (app: FastifyInstance, opts: ElementsOpts) => {
  const path = opts.path ?? "/docs";
  const specUrl = opts.specUrl ?? "/openapi.json";

  app.get(path, async (_req, reply) => {
    reply.type("text/html").send(`<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<script type="module" src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
<title>API Docs</title></head><body>
<elements-api apiDescriptionUrl="${specUrl}" router="hash"></elements-api>
</body></html>`);
  });
});
