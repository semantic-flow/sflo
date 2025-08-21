import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";

export interface ElementsOpts { path?: string; specUrl?: string; }

export default fp(async (app: FastifyInstance, opts: ElementsOpts) => {
  const path = opts.path ?? "/docs";
  const specUrl = opts.specUrl ?? "/openapi.json";

  app.get(path, async (_req, reply) => {
    reply.type("text/html").send(`<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
  <style>
    html, body { height: 100%; margin: 0; }
    #app { height: 100%; }
    elements-api { display: block; height: 100%; }
  </style>
  <title>sflo-api docs</title>
</head>
<body>
  <div id="app">
    <elements-api
      apiDescriptionUrl="${specUrl}"
      router="hash"
      layout="sidebar">
    </elements-api>
  </div>
  <!-- IMPORTANT: not type="module" -->
  <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
</body>
</html>`);
  });
});
