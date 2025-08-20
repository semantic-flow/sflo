---
id: sg6tqgoz8cwwmpt0a0r8783
title: Contributors
desc: ''
updated: 1755719295930
created: 1755715168834
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
