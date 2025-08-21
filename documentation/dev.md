---
id: 19a9e7c270ebne02zeg3fje
title: Development
desc: ''
updated: 1755743943034
created: 1755743361031
---

### Hot Reload

The development setup includes automatic hot reload using nodemon:

- **Watches**: `sflo-host/src`, `plugins/*/src`, `shared/*/src`
- **Auto-restarts** when any watched file changes
- **Loads plugins from source** in development mode (not built `dist` files)
- **Preserves debugger connection** after restart
