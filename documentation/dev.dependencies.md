---
id: 1ieo7152nf46x4wiip1vwx5
title: Dependencies
desc: ''
updated: 1764290517693
created: 1762221709385
---

# Key Project Dependencies

This document lists the core technologies and dependencies that define the Semantic Flow development environment and runtime.

## Core Technologies

- **Node.js:** Runtime environment (>=24)
- **TypeScript:** Primary language for type safety and maintainability.
- **pnpm:** Package manager, used for monorepo management (`pnpm@10.15.0`).
- **Git:** Version control system, fundamental to the mesh structure and versioning.

## RDF Ecosystem

The project relies heavily on the JavaScript RDF ecosystem:

- **rdfjs Data Model:** Standardized interfaces for RDF data structures.
- **Quadstore:** High-performance RDF quad store implementation.
- **Comunica:** Modular SPARQL query engine used for read/write endpoints.

## Runtime Dependencies (sflo-host)

These dependencies are critical for the `sflo-host` application:

- **Fastify:** High-performance web framework used for the host application.
- **Fastify-plugin:** Utility for creating Fastify plugins.

## Plugin Dependencies

- **Stoplight Elements:** will probably be used for API documentation/playground (via the `plugin-elements` package).

## CLI Dependencies

- oclif + enquirer


## Development Dependencies

These dependencies support the development, testing, and documentation workflow:

- **Dendron CLI (`@dendronhq/dendron-cli`):** Used for managing and publishing the documentation site (the source of the memory bank files).
- **Vitest:** Testing framework.
- **TypeScript ESLint:** Linting tools.
- **Nodemon / tsx:** Used for development server hot-reloading and execution.
- **Tsup:** Bundler for building packages.
