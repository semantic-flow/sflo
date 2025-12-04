---
id: xqjr13fyons9goxv8rjrskj
title: Todo
desc: ''
updated: 1764854583731
created: 1755715425146
---

# General Project TODO List

This list captures general tasks, ideas, and items that have not yet been broken down into formal, actionable tasks (i.e., `tasks.YYYY-MM-DD-task-name.md`).

## High Priority

- rename "operational config" IF warranted: maybe "specific config", "self config", "override config"
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


