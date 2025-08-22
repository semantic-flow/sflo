---
id: xebek3dtv2zgs9ah0vbv57g
title: Semantic Flow General Guidance
desc: ''
updated: 1755850422031
created: 1751259888479
---

**Semantic Flow** is a framework for managing knowledge graphs and other Semantic Web resources in publish-ready [[semantic meshes|concept.mesh]]

## Developer Workflow

- Build/Watch:
  - The development workflow requires two terminals running concurrently:
    - **Terminal 1**: Run `pnpm dev:watch` to start the TypeScript compiler in watch mode. This will watch all packages and rebuild them on change.
    - **Terminal 2**: Run `pnpm dev` to start the `nodemon` server, which will automatically restart when the built files in the `dist` directories are updated.
  - This setup ensures that changes in any package are automatically compiled and that the server restarts with the latest code.
  - Keep inter-package imports as package specifiers; avoid deep source imports across packages.


## Workspace Components

- The sflow-platform repo/folder is organized as a monorepo, divided into a few different modules:
  - **sflo-host/**: host service with plugin architecture
  - **sflo-api/**: plugin providing Semantic Flow functionality via REST
  - **cli/**: Command-line application that consumes the sflo-api
  - **sflo-web/**: Web frontend, can connect to any sflo-api instance
  - **shared/**: cross-cutting code like type schemas (core), logging, and config
- **test-ns/** repo: Test mesh repo
- **ontology/**: repo containing relevant ontologies:
  - `mesh` - Core mesh architecture with base classes (Resource, Node, Element) and fundamental types
  - `node` - Node operations including Handle, Flow types, and operational relationships
  - `flow` - Temporal concepts including Snapshot types and versioning relationships
  - `config-flow` - Configuration properties that apply directly to mesh entities (nodes, flows, snapshots, etc.)
  - `meta-flow` - provenance and licensing vocabulary
  - `flow-service` - Service layer configuration vocabulary for the flow-service application

## Key Concepts

### Semantic Mesh

A dereferenceable, versioned collection of semantic data and supporting resources, where every HTTP URI returns meaningful content. See [[concept.mesh]]

#### Core Components

- **Mesh Resources**:
  - **Nodes**: Semantic Atoms
    - **Dataset Nodes**: Bundles of data with optional quasi-immutable, versioned history
    - **Namespace Nodes**: basically empty folders for URL-based hierarchical organization
    - **Reference Nodes**: Refer to "things that exist" like people, or songs, or ideas
  - **Elements**: things that help define and systematize the nodes
    - **Flows**: datasets for node metadata, reference data, and payload data
      - **Snapshots**: temporal slices of a flow, containing RDF dataset distributions
    - **Handles**: things that let you refer to a node as a node instead of as its referent
    - **Asset Trees**: elements that allow you to attach arbitrary collections of files and folders to a mesh; in a sense, these things are "outside" the mesh, and other than the top-level "_meta" folder, they don't contain any other mesh resources

### Semantic Flow Workflow:

- In General: Mesh resource addition & editing → Weaving
- a mesh is servable "as-is", so if the git provider is configure to serve it as a website, no additional publishing step is required (beyond commit)

### Semantic Site

- The repo IS the site:
  - can be served locally
  - no separate SSG (Static Site Generator) necessary
    - but static resource page generation should happen on every weave as necessary
  - after push, you should be able to see the changed mesh at the corresponding github pages URL

## RDF and Semantic Web

- avoid use of blank nodes
- prefer relative/local URIs for transposability/composability
- meshes support multiple RDF formats (.trig, .jsonld, etc.)
  - .trig might be better for user-facing content
  - .jsonld might be better for system content
- be mindful of RDF terminology and concepts
  - extends DCAT for dataset catalogs
  - extends PROV for provenance, with relator-based contexts
- When referring to IRIs or URIs that are part of a semantic mesh, prefer the term URLs instead of IRI or URI
  - if you see a reference to IRI or URI, it might need updating, or it might mean a distinction should be drawn
- RDF comments should be extremely concise and clear.

### Quadstore

- make sure you are familiar with [[tech-stack.quadstore.readme]], which documents the API
- For testability and in case we ever want to use multiple stores simultaneously, store-accessing functions take a QuadstoreBundle
- quadstore API calls use "undefined" instead of "null" to represent the wildcard for subjects, predicates, objects, and graphs

## Documentation

- Avoid numbering of code comments, headings and list items, as it makes re-ordering a pain
- All specifications and design docs are in `sflo-dendron-notes/`
- Check conversation logs in `sflo.conv.*` for context on design decisions if necessary, but beware of superceded and dangerously-outdated info

### Documentation First

- unclear or anemic documentation should be called out
- documentation should be wiki-style: focused on the topic at hand, don't repeat yourself, keep things simple and clear
- when assisting with writing documentation, it should be kept concise and specific to the topic at hand
- whenever documentation is updated, any corresponding LLM conversation context should be updated too
- to encourage documentation-driven software engineering, code comments should refer to corresponding documentation by filename, and the documentation and code should be cross-checked for consistency whenever possible

### Documentation Architecture

- `sflo-dendron-notes` repo has wiki-style notes about the mesh architecture
  -  Dendron handles the frontmatter... don't rewrite IDs or anything else in the frontmatter
- official project documentation should be generated in `documentation` directory in markdown

### Project notes

Project documentation, specifications, and design choices are stored in `documentation/` using Dendron's hierarchical note system. Key documentation hierarchies include:

- **Concepts**: `concept.*` files talk about general Semantic Flow concepts
- **Mesh docs**: `concept.mesh.*` files define the semantic mesh architecture
- **Product specifications**: `product.*` files detail each component
- **Use cases**: `use-cases.*` for feature planning and testing

### Component Development with Docs

- Each module (flow-cli, flow-service, flow-web) should follow the architecture defined in the documentation
- Refer to `sflo.product.*` files for component-specifc descriptions, requirements, etc

## Project Architecture

### Configuration Architecture

- The project uses a sophisticated JSON-LD based configuration system with multiple layers
- **Service Configuration resolution order**: CLI arguments → Environment variables → Config file → Defaults
- The [`defaults.ts`](semantic-flow/flow-service/src/config/defaults.ts) file is the source for "platform default" configuration

### Logging System Architecture

- **Structured logging** with rich `LogContext` interface is the preferred approach
- **Three-channel logging architecture**:
  - Console logging (pretty format for development)
  - File logging (pretty format for human readability)
  - Sentry logging (structured JSON for error tracking)
- **Graceful degradation principle**: Logging failures should never crash the application

### Logging System Patterns

- `let logger = getComponentLogger(import.meta);` at the start of every file

### Error Handling Patterns

- Use the [`handleCaughtError`](semantic-flow/flow-service/src/utils/logger.ts) utility for consistent error handling
- **Documentation**: See [error-handling-usage.md](semantic-flow/flow-service/documentation/error-handling-usage.md) for comprehensive usage examples
- The error handling system integrates with all logging tiers (console, file, Sentry)

### File Organization

- **Import paths** require careful attention when reorganizing files to avoid breaking dependencies

### Implementation Patterns

- **Proper TypeScript interfaces** for configuration validation and type safety
- **SHACL constraints** for JSON-LD validation when working with semantic data
- **Modular design**: Keep utilities focused and avoid circular dependencies between core modules

## Coding Standards

### Language & Runtime

- **TypeScript**: Use strict TypeScript configuration with modern ES2022+ features
- Use NodeJS v24 and the latest best practices

### RDF Data Handling

- **Primary Format**: .trig files for RDF data storage and processing
- **Secondary Format**: Full JSON-LD support required
- **RDF Libraries**: Use RDF.js ecosystem libraries consistently across components
- **Namespace Management**: Follow URL-based identifier patterns as defined in `sflo.concept.identifier.md`
- **Reserved Names**: Validate against underscore-prefixed reserved identifiers per `sflo.concept.identifier.md`
- The most effective validation strategy combines TypeScript structural validation with RDF semantic validation:

### Semantic Mesh Architecture

- **Resource Types**: Nodes are the foundation, Elements support Nodes, Flows are "abstract datasets", and "Snapshots" are their temporal slices as defined in `sflo.concept.mesh.md`
- **Folder Structure**: Validate mesh folder structures (dataset nodes, namespace nodes, etc.)
- **System Elements**: Distinguish between system-generated and user-modifiable elements
- **Weave Integration**: Code must support weave operations as defined in `sflo.concept.weave.md`

### Documentation-Driven Development

- **Code Comments**: reference corresponding documentation by filename (e.g., `// See sflo.concept.mesh.resource.node.md`)
- **Interface Definitions**: Link to concept documentation in TSDoc comments
- **Cross-Reference Validation**: Ensure consistency between code and documentation; if docs need updating, let me know
- **API Documentation**: Generate from TSDoc comments?

### Component Architecture

- **Shared code**: should go in flow-core/
- **Separation**: Maintain clear boundaries between flow-cli, flow-service, and flow-web
- **Error Handling**: Use consistent error patterns across all components
- **Async Patterns**: Use async/await for RDF operations and file I/O
- **Type Safety**: Leverage TypeScript's type system for mesh resource validation

### File Organization & Naming

- **TypeScript Modules**: Use `.ts` extension, organize by feature/component
- **Test Files**:
  - unit test files go in tests/unit/ using `.test.ts` suffix
  - integration tests go in tests/integration
- **Mesh Resources**: Follow mesh resource naming conventions from @/ontology/alpha/_node-data/_next/flow-ontology-alpha.trig
- **Constants**: Use UPPER_SNAKE_CASE for constants, especially for reserved names; centralize constants, e.g. semantic-flow/flow-core/src/mesh-constants.ts
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
    - `"compilerOptions": { "baseUrl": "src", "paths": { "@/*": ["*"] } }`
  - Tooling notes:
    - For Node/tsx/Vitest, ensure your runner resolves TS path aliases (e.g., `tsconfig-paths/register` or vite-tsconfig-paths).


- Publishing:
  - Each package should export built entry points (e.g., `dist/`) via `exports`/`main`/`types`. The same import paths work identically in dev and prod.

### Code Style

- If using any is actually clearer than not using it, it's okay, just add the // deno-lint-ignore comment
- Use `satisfies` whenever you're writing a literal config object that should be checked against a TypeScript shape, but you want to retain the full type of the literal for use in your program.

### Error Handling

- **Custom Errors**: Create semantic mesh-specific error types
- **Validation**: Validate mesh resource structures before processing
- **Logging**: Use structured logging for debugging weave operations
- **Async Error Propagation**: Properly handle async/await error chains

#### Enhanced Error Handling with LogContext

The platform uses **LogContext-enhanced error handling** from `flow-core/src/utils/logger/error-handlers.ts` for consistent error logging across all components. Both error handling functions now accept optional `LogContext` parameters for rich contextual information.

**Core Functions:**
- `handleCaughtError()` - For caught exceptions with comprehensive error type handling
- `handleError()` - For controlled error scenarios with structured messaging

#### LogContext Structure

#### handleCaughtError Examples


**Startup Error Handling:**


This pattern ensures **uniform error reporting** with rich contextual information, **easier debugging** through structured logging, and **consistent integration** with console, file, and Sentry logging tiers.


### Testing

- **Unit Tests**: place unit tests in `src/__tests__` folder; with `.test.ts` suffix; target ≥80% critical-path coverage and include both success and failure cases.
- **Integration Tests**: Test mesh operations end-to-end; tests are located in test/integration/ dir
- **RDF Validation**: Test both .trig and JSON-LD parsing/serialization
- **Mock Data**: Create test mesh structures following documentation patterns
- after you think you've completed a task, check for any "problems", i.e., deno-lint

### Performance

- **RDF Processing**: Stream large RDF files where possible
- **File I/O**: Use async file operations consistently
