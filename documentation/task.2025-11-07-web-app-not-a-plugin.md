---
id: v438f0fzw03t4cqcsis3asp
title: 2025 11 07 Web App Not a Plugin
desc: ''
updated: 1762619847205
created: 1762551743411
---

## Decisions

- Introduce a new top-level `/sflo-web` folder in the monorepo to host a server-rendered web application.
- Prefer a server-rendered approach (non-SPA) with progressive enhancement, likely using HTMX for partial updates and interactivity.
- Create an optional `sflo-web-shim` plugin under `plugins/sflo-web-shim` to mount the server-rendered app within `sflo-host` (or proxy to a separately running `sflo-web` service when desired).
- The shim registers a Fastify route prefix (e.g., `/web`) and serves SSR pages and static assets; it avoids client-side routing assumptions.
- Separation allows independent development/deployment while maintaining optional integration with `sflo-host`.
- Note: CLI package path has been updated by the user from `/cli` to `/sflo-cli`.
## Prompt

since the web client might be used standalone, I think we need to change the monorepo file layout, adding a top-level /sflo-web folder. The web app should be servable as a stand-alone, static SPA web page. Should we have a sflo-host plugin (e.g. "sflo-web-shim") that wraps the sflo-web SPA, so if you're running sflo-host you can optionally serve the web app too? We need to update the memory-bank and create a new product.plugins.sflo-web-shim if you agree. I think modern Vue might be the best architectural choice for the SPA.
## TODO

- [ ] Design sflo-web server-rendered architecture (Fastify view engine + HTMX partials)
- [ ] Implement sflo-web-shim plugin for sflo-host to mount SSR routes at `/web` and serve static assets
- [ ] Update product.plugins.sflo-web-shim documentation (purpose, options, route prefix)
- [ ] Update product.sflo-web to reflect server-rendered + HTMX approach (remove SPA/Vue references)
- [ ] Create implementation plan and scaffolding for sflo-web (templates, layouts, HTMX patterns) and shim plugin
- [ ] Sync memory bank with final decisions by referencing this task file

