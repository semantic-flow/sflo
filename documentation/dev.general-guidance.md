---
id: xebek3dtv2zgs9ah0vbv57g
title: Developer General Guidance
desc: ''
updated: 1762357114351
created: 1751259888479
---

See [[concept.summary]] for a conceptual overview. See [[dev.memory-bank]] for CRITICAL information for AI agents.

## Workspace layout

### sflo monorepo

```
sflo/
  cli/                        # the sflo command-line application; consumes the sflo-api
  plugins/
    api-docs/                 # api documentation/playground (probably stoplight Elements)
    mesh-server/              # static mesh server(s)
    sflo-web/                 # your web UI, if you want it as a plugin
    sflo-api/                 # OpenAPI REST endpoint, used by CLI and sflo-web
    sparql-ro/                # SPARQL read-only endpoint 
    sparql-update/            # SPARQL write-capable endpoint
    sparql-editor/            # SIB Swiss editor at /play
  sflo-host/                  # the big service that loads plugins
  shared/
    core/                     # RDFine/LDKit, SHACL, types
    auth/                     # JWT + GitHub device flow
    config/                   # runtime/config loaders (RDF/JSON)
    sparql/                   # used by sparql-ro and sparql-update  (provided by Comunica)
    utils/                    # misc helpers
  tests/                      # cross-application tests
    e2e/                     # cross-app: start real service, hit via CLI/web
    contracts/               # Pact or OpenAPI contract tests
    perf/                    # k6/Artillery scenarios (optional)
    fixtures/                # shared data sets and seed scripts

```

### Other Workspace Components


- **ontology/**: repo containing relevant ontologies:
  - `semantic-flow` - main ontology (sflo/ontology/semantic-flow/_data-flow/_next/semantic-flow-ontology.ttl) defines meshes and their nodes and components; 
  - `node-config` - Configuration properties that apply directly to mesh entities (nodes, flows, snapshots, etc.)
  - `meta-flow` - provenance and licensing vocabulary
  - `sflo-service` - Service layer configuration vocabulary for the flow-service application
  - Ontologies are kept in a separate repository, but for development purposes are nested into the monorepo under ontology/ directory for ease of access. 
-  **test-ns/**: repo containing a test namespace
  

## Developer Workflow

### Build/Watch

- The development workflow requires two terminals running concurrently:
 - **Terminal 1**: Run `pnpm dev:watch` to start the TypeScript compiler in watch mode. This will watch all packages and rebuild them on change.
 - **Terminal 2**: Run `pnpm dev` to start the `nodemon` server, which will automatically restart when the built files in the `dist` directories are updated.
- This setup ensures that changes in any package are automatically compiled and that the server restarts with the latest code.
- Keep inter-package imports as package specifiers; avoid deep source imports across packages.


### Hot Reload

The development setup includes automatic hot reload using nodemon:

- **Watches**: `sflo-host/src`, `plugins/*/src`, `shared/*/src`
- **Auto-restarts** when any watched file changes
- **Loads plugins from source** in development mode (not built `dist` files)
- **Preserves debugger connection** after restart

### Building the docs

```shell
npx dendron publish export --target github --yes
```

## RDF and Semantic Web

- prefer JSON-LD for all RDF instance data and ontologies, as Turtle doesn't support slash-terminated CURIEs, and we use a trailing slash to delineate between files and resource names.
- terminate non-file IRIs with a slash (solves the httprange-14 problem)
- avoid use of blank nodes
- prefer relative/local URIs for transposability/composability
- be mindful of RDF terminology and concepts
  - extends DCAT for dataset catalogs
  - extends PROV for provenance, with relator-based contexts
- RDF comments should be extremely concise and clear.

### Denormalization

- when speed matters and the query is complicated, use a derived, join-free representation of a portion of the data, optimized for lookup speed.

### Ontology patterns

- use **SHACL constraints** for JSON-LD validation when working with semantic data; 
- avoid rdfs:domain and rdfs:range; prefer schema:domainIncludes and schema:rangeIncludes  for maximum re-use flexibility
- specify preferred 3rd-party property vocabulary with sh:property, even if sh:minCount is 0

## Coding Standards

### Language & Runtime

- **TypeScript**: Use strict TypeScript configuration with "Pure ESM" modern ES2022+ features; NO CJS 
- Use NodeJS v24 and the latest best practices
- If using any is actually clearer than not using it, it's okay
- Use `satisfies` whenever you're writing a literal config object that should be checked against a TypeScript shape, but you want to retain the full type of the literal for use in your program.

### RDF Data Handling

- **Primary Format**: .jsonld files for RDF data storage and processing
- **Secondary Format**: Full JSON-LD support required
- **RDF Libraries**: Use RDF.js ecosystem libraries consistently across components
- **Namespace Management**: Follow IRI-based identifier patterns as defined in `sflo.concept.identifier.md`
- **Reserved Names**: Validate against underscore-prefixed reserved identifiers per `sflo.concept.identifier.md`
- The most effective validation strategy combines TypeScript structural validation with RDF semantic validation:


## Documentation-Driven Development

- unclear, missing, or overly-verbose documentation must be called out
- documentation should be wiki-style: focused on the topic at hand, don't repeat yourself, keep it as simple as possible 
- to encourage documentation-driven software engineering, code comments should refer to corresponding documentation by filename, and the documentation and code should be cross-checked for consistency whenever possible

### Documentation Architecture

Project documentation, specifications, and design choices are stored in `documentation/` using Dendron's hierarchical note system. Key documentation hierarchies include:

- **Concepts**: `concept.*` files talk about general Semantic Flow concepts
- **Mesh resource docs**: `mesh-resource.*` files define the semantic mesh architecture
- **Product specifications**: `product.*` files detail each component
- **Use cases**: `use-cases.*` for feature planning and testing

- docs are in markdown, with wiki-flavored links
  - link names can be specified with `[[link name|file]]`
- Dendron handles the frontmatter
  - don't rewrite IDs in the frontmatter
  - agents should ask a human to create new documentation files

### Code Comments

- **Reference docs from code**: reference corresponding documentation by filename (e.g., `// See sflo.concept.mesh.resource.node.md`)
- **Interface Definitions**: Link to concept documentation
- **Cross-Reference Validation**: Ensure consistency between code and documentation; if docs need updating, call it out

## File Organization & Naming

- **TypeScript Modules**: Use `.ts` extension, organize by feature/component
- **Test Files**:
  - unit test files go in application-name/src/tests/unit/ using `.test.ts` suffix
  - intra-package integration tests go in application-name/src/tests/integration/ using `.test.ts` suffix
  - inter-package e2e tests go in tests/e2e/
- **Mesh Resources**: Follow mesh resource naming conventions from [[Filenaming Per Snapshot|mesh-resource.node-component.snapshot-distribution#filenaming-per-snapshot]]
- **Constants**: Use UPPER_SNAKE_CASE for constants, especially for reserved names; centralize constants, e.g. shared/src/mesh-constants.ts
- **File size**: For ease of AI-based editing, prefer lots of small files over one huge file
- **Quoting**: For easier compatibility with JSON files, use double quotes everywhere

### Import Path Policy

- Inter-package imports (between workspace packages):
  - Use workspace package specifiers.
  - Examples:
    - `import { startHost } from "@semantic-flow/host"`
    - `import { loadConfig } from "@semantic-flow/config"`
  - Rationale:
    - Keeps package boundaries clear and publish-ready
    - pnpm resolves to local workspace packages during development, so you get your local builds—not the registry
    - Compatible with build/watch flows and CI

- Intra-package imports (within a single package):
  - Use the `@` alias mapped to that package’s `src/` root to avoid relative path chains.
  - Example (inside a package): `import { something } from "@/features/something"`
  - Configuration (per package tsconfig):
    - `"compilerOptions": { "baseIRI": "src", "paths": { "@/*": ["*"] } }`
  - Tooling notes:
    - For Node/tsx/Vitest, ensure your runner resolves TS path aliases (e.g., `tsconfig-paths/register` or vite-tsconfig-paths).


- Publishing:
  - Each package should export built entry points (e.g., `dist/`) via `exports`/`module`/`types`. The same import paths work identically in dev and prod.

## System Architecture

### Quadstore

- For testability and in case we ever want to use multiple stores simultaneously, store-accessing functions take a QuadstoreBundle
- quadstore API calls use "undefined" instead of "null" to represent the wildcard for subjects, predicates, objects, and graphs



### Configuration Architecture

- The project uses a sophisticated JSON-LD based configuration system with multiple layers
- **Service Configuration resolution order**: CLI arguments → Environment variables → Config file → Defaults
- The [`defaults.ts`](../semantic-flow/flow-service/src/config/defaults.ts) file is the source for "platform default" configuration

### Logging and Error System Architecture

- **Structured logging** with rich `LogContext` interface is the preferred approach
- **Three-channel logging architecture**:
  - Console logging (pretty format for development)
  - File logging (pretty format for human readability)
  - Sentry logging (structured JSON for error tracking)
- **Graceful degradation principle**: Logging failures should never crash the application


#### Error Handling

- **Custom Errors**: Create semantic mesh-specific error types
- **Logging**: Use structured logging for debugging weave operations
- **Async Error Propagation**: Properly handle async/await error chains

#### Enhanced Error Handling with LogContext

The platform uses **LogContext-enhanced error handling** from `shared/src/utils/logger/error-handlers.ts` for consistent error logging across all components. Both error handling functions now accept optional `LogContext` parameters for rich contextual information.

**Core Functions:**
- `handleCaughtError()` - For caught exceptions with comprehensive error type handling
- `handleError()` - For controlled error scenarios with structured messaging

#### LogContext Structure

#### handleCaughtError Examples


**Startup Error Handling:**


This pattern ensures **uniform error reporting** with rich contextual information, **easier debugging** through structured logging, and **consistent integration** with console, file, and network logging tiers.


### Testing

- **Unit Tests**: target ≥80% critical-path coverage and include both success and failure cases.
- **Integration Tests**: Test mesh operations end-to-end; tests are located in tests/integration/ dir
- **RDF Validation**: Test both .trig and JSON-LD parsing/serialization
- **Mock Data**: Create test mesh structures following documentation patterns
- after you think you've completed a task, check for any "problems", i.e., deno-lint

#### What to Place Where

- Package integration if it targets that package’s boundaries only.
  - Examples: service repo + DB, CLI command against a mock server, web page with MSW.

- Top-level e2e if it requires two or more apps running together or real infra.
  - Examples: CLI → API → DB, web → API auth, migration rollout checks.

### Performance

- **RDF Processing**: Stream large RDF files where possible
- **File I/O**: Use async file operations consistently
