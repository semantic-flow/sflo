---
id: development
title: Development
desc: ''
updated: 1756161639629
created: 1755743361031
---

## Building the docs

```shell
npx dendron publish export --target github --yes
```

## Monorepo layout

```
sflo/
  cli/                        # the sflo CLI (binary)
  plugins/
    elements/
    mesh-server/              # static mesh server(s)
    sflo-web/                 # your web UI, if you want it as a plugin
    sflo-api/
    sparql/
    sparql-update/
    sparql-editor/            # SIB Swiss editor at /play
  sflo-host/                  # the big service that loads plugins
  shared/
    core/                     # RDFine/LDKit, SHACL, types
    auth/                     # JWT + GitHub device flow
    config/                   # runtime/config loaders (RDF/JSON)
    utils/                    # misc helpers
```


## Hot Reload

The development setup includes automatic hot reload using nodemon:

- **Watches**: `sflo-host/src`, `plugins/*/src`, `shared/*/src`
- **Auto-restarts** when any watched file changes
- **Loads plugins from source** in development mode (not built `dist` files)
- **Preserves debugger connection** after restart
