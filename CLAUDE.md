# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Semantic Flow (sflo) is a platform for creating, managing, and publishing **semantic meshes** — dereferenceable, versioned collections of semantic resources. It mints dereferenceable IRIs for the Semantic Web and holds versionable semantic data. Meshes are Git repositories whose folder hierarchy maps directly to published IRI paths on a static site.

For the full conceptual model, read `documentation/concept.summary.md`. For current project status and focus, see `documentation/guide.status.md` and `documentation/now.md`.

## Build & Development Commands

**Package manager:** pnpm 10.15.0 | **Node:** >=24 | **Module system:** Pure ESM (no CJS)

### Development (requires two terminals)
```bash
pnpm dev:watch    # Terminal 1: TypeScript compiler watch mode (all packages)
pnpm dev          # Terminal 2: nodemon server (auto-restarts on dist changes)
```

### Build, Test, Lint
```bash
pnpm build              # Build all packages (tsup)
pnpm test               # Run all tests (vitest)
pnpm test -- path/to/file.test.ts  # Run a single test file
pnpm test:watch         # Tests with auto-rerun
pnpm test:coverage      # Coverage report (v8)
pnpm lint               # Check TypeScript files
pnpm lint:fix           # Auto-fix lint issues
```

### Documentation site
```bash
nvm exec 24 npx dendron publish export --target github --yes
```

## Monorepo Architecture

```
sflo/
  cli/               # @semantic-flow/cli (oclif CLI)
  sflo-host/         # @semantic-flow/host (Fastify web framework, main entry point)
  plugins/
    elements/        # API docs (Stoplight Elements)
    mesh-server/     # Static mesh server
    sflo-api/        # OpenAPI REST endpoint
    sflo-web/        # Web UI
    sparql/          # SPARQL endpoint
    sparql-editor/   # Web-based SPARQL editor
    sparql-update/   # Write-capable SPARQL
  shared/
    core/            # RDF types, SHACL, LDKit
    config/          # Configuration management
    logging/         # Structured logging & error handling
    auth/            # JWT + GitHub device flow
    utils/           # Misc helpers
  ontology/          # Ontologies (separate repo, nested for dev)
  documentation/     # Dendron-based memory bank (wiki-style docs)
  tests/             # Cross-application e2e tests, fixtures
```

Workspaces are defined in `pnpm-workspace.yaml`. Inter-package imports use workspace package specifiers (e.g., `import { loadConfig } from "@semantic-flow/config"`). Intra-package imports use `@/*` alias mapped to `src/`.

## Code Conventions

- **Double quotes** everywhere (enforced by ESLint)
- **`quote-props: "always"`** — all object property names must be quoted
- **Strict TypeScript** with `verbatimModuleSyntax` — use type-only imports for types
- **`satisfies`** for literal config objects that should be type-checked but retain their literal type
- Unused vars prefixed with `_` are allowed; all others are errors
- Prefer small files over monolithic ones
- Constants: `UPPER_SNAKE_CASE`, centralized
- Code comments should reference corresponding documentation by filename (e.g., `// See concept.mesh.md`)

## RDF & Semantic Web Patterns

- **JSON-LD** is the primary format for all RDF data (Turtle doesn't support slash-terminated CURIEs)
- Non-file IRIs terminate with `/` (solves httprange-14)
- Use relative/local URIs for transposability
- Avoid `rdfs:domain`/`rdfs:range`; prefer `schema:domainIncludes`/`schema:rangeIncludes`
- Use SHACL constraints for JSON-LD validation
- Extends DCAT for dataset catalogs, PROV for provenance

## Key Concepts (Mesh Structure)

- **Knop**: A folder-based resource node; can be bare (organizational) or payload (has data)
- **Flows**: Abstract datasets (DatasetSeries) — meta, payload, config flows
- **FlowSlices**: Concrete datasets — `_default/` (latest stable), `_working/` (mutable), version folders (`YYYY-MM-DD_HHMM_SS_vN/`)
- **Weave process**: Lifecycle operation that versions, promotes, and regenerates resources
- Reserved folder names are underscore-prefixed: `_knop-handle/`, `_meta/`, `_payload/`, `_cfg-local/`, `_cfg-inh/`, `_default/`, `_working/`, `_assets/`

## Documentation System

Documentation lives in `documentation/` using Dendron's hierarchical note system with wiki-style links (`[[filename]]` or `[[display text|filename]]`).

**Key files to read before any task:**
- `documentation/concept.summary.md` — Canonical conceptual overview
- `documentation/guide.product-brief.md` — Vision and user experience goals
- `documentation/dev.general-guidance.md` — Developer workflow and standards
- `documentation/dev.memory-bank.md` — Memory bank protocol for AI agents

**Don't rewrite Dendron frontmatter IDs.** Ask the user before creating new documentation files.

## Testing

- Vitest with node environment, globals enabled
- Unit tests: `<package>/src/tests/unit/*.test.ts`
- Integration tests: `<package>/src/tests/integration/*.test.ts`
- E2E tests: `tests/e2e/`
- Both TypeScript structural and RDF semantic validation expected

## Data Access Patterns

- **Quadstore primitives**: 1-2 patterns, fixed IRIs, early exit
- **SPARQL via Comunica**: 3+ patterns, joins, OPTIONAL/UNION, aggregation
- Store-accessing functions take a `QuadstoreBundle` for testability
- Quadstore uses `undefined` (not `null`) as wildcard for subjects/predicates/objects/graphs
