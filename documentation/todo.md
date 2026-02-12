---
id: xqjr13fyons9goxv8rjrskj
title: Todo
desc: ''
updated: 1769881245153
created: 1755715425146
---

# General Project TODO List

This list captures general tasks, ideas, and items that have not yet been broken down into formal, actionable tasks (i.e., `tasks.YYYY-MM-DD-task-name.md`).

## High Priority
- modular dataset composition
- pav:hasCurrentVersion, other pav re-use
- specify root Nomen architecture
- remove NomenHandle as a class?
- in RDF, 


- See @/documentation/task.2025-11-28-templates-and-stylesheets.md - but we need to make a pluggable "defaults" architecture where during runtime and/or build time, you can point at an existing config distribution, 
- [ ] Implement the core Weave Process logic (versioning, promotion, link resolution).
- [ ] Define and implement the two-flow configuration inheritance model.
- It seems like, similar to how Flows can have a weaveLabel for "last woven", Flows could have a sequenceNumber for "last woven"


## Grooming / Future Tasks

- [ ] Create initial unit and integration tests for `sflo-host`.
- [ ] set up a store adapter, store implementations, query catalog, and web UI
- [ ] Define a "Documentation Grooming" Roo Mode to periodically refine documentation for pithiness and consistency.
- [ ] Implement the `sflo-web` plugin for a basic web UI.
- [ ] Logging Phase 2 (+ sentry mcp server?)

## Agent Maintenance Tasks

- [ ] Ensure all memory bank files are consistently updated as work progresses.
- [ ] Review and update [[dev.patterns]] as new architectural decisions are made.
- [ ] Review and update [[dev.dependencies]] when major dependencies are added or removed.


## createKnop with templates

read @/documentation/dev.memory-bank.md  for some general context.

Can you help me verify that @/documentation/task.2025-11-28-templates-and-stylesheets.md  is mostly obsolete and should ? Reference @/ontology/sflo-config/_payload-flow/_working/sflo-config-ontology.jsonld and the @/sflo-platform-defaults/_payload/_working/sflo-platform-defaults.jsonld 

- I've defined the platform defaults in /sflo-platform-defaults and their eventual RDF IRI will be https://semantic-flow.github.io/sflo-platform-defaults/ with a corresponding "current distribution" IRI of https://semantic-flow.github.io/sflo-platform-defaults/_payload/_current/sflo-platform-defaults.jsonld
-  regarding "No way to distinguish “path of defining knop” vs “path of consuming knop.”" -- there actually is now. The defining knop is where the inheritable config is defined. When calculating operational config, you'll know the filesystem structure and/or the "parentKnop" chain, so you could calculate the relative  location of assets. I think (relative) path strings are also IRIs, and there's no reason we can't handle relative and absolute IRIs? Still, I think we have to update TemplatePathShape to support relative (../../_assets) and fully-specified URLs, but maybe reject root-no-scheme URLs like (/_assets)
- I think TemplateMappings is now adequately specified. 
- Regarding D2... we don't need a special semantics of "asset location is relative to the defining knop folder"... we can just use the convention (which will be common) of referring to the distribution's slice's flow's parent-knop's _assets folder explicitly, e.g. ../../_assets
- we can defer the Offline bundling of `sflo-platform-defaults` for now.

