
# Semantic Flow (sflo) - Product Brief

## What is Semantic Flow?

Semantic Flow is a platform for creating, managing and publishing **semantic meshes** - dereferenceable, versioned collections of data resources where every IRI resolves to meaningful content.

## Twin Purposes

- **Mint dereferenceable IRIs** for referring to things on the Semantic Web
- **Hold versionable semantic data** that uses those IRIs and can be referenced by other semantic data

## Problems Solved

- **Free, Permanent, Self-Sovereign Data Storage** - Provides individuals with free, permanent, self-describing data storage via the git provider of their choice
- **IRI Stability** - Provides stable, dereferenceable IRIs for Semantic Web resources
- **Version Management** - Tracks semantic data evolution with immutable version history
- **Content Dereferenceability** - Every IRI resolves to meaningful HTML content
- **Transposability** - Meshes can be moved between domains/projects without breaking internal links
- **Composability** - Submeshes can be extracted and composed into larger structures

## Components & Applications

### sflo-host

The main host application that supports semantic mesh use and development. Built with:
- Fastify web framework
- Plugin architecture for extensibility
- TypeScript for type safety

#### Plugins

- [[product.plugins.api-docs]] - API documentation/playground (Stoplight Elements)
- [[product.plugins.mesh-server]] - Static mesh server(s)
- [[product.sflo-web]] - Web UI
- [[product.plugins.sflo-api]] - OpenAPI REST endpoint
- [[product.plugins.sparql-ro]] - SPARQL read-only endpoint
- [[product.plugins.sparql-update]] - SPARQL write-capable endpoint (provided by Comunica)
- [[product.plugins.sparql-editor]] - SIB Swiss editor at /play

### Shared Packages

- **@semantic-flow/config** - Configuration management

## How It Works

### Filesystem-Based Meshes

Meshes map directly from Git repository folder hierarchies to published static sites:

- Every folder is a **node** (container for resources and child nodes)
- Nodes contain **components** (flows, handles, assets, documentation)
- **Flows** are versioned DatasetSeries (metadata, semantic data, arbitrary datasets, or config)
- **Snapshots** are flow realizations (`_current/`, `_next/`, `_vN/`)
- **Distributions** are serialization files (TriG, JSON-LD, etc.)

### The Weave Process

The weave process maintains mesh coherence and publication readiness:

- Ensures required system components exist
- Creates new version snapshots from working data
- Promotes working data to current
- Updates metadata and provenance
- Regenerates resource pages
- Resolves internal links for transposability

## User Experience Goals

### For Developers

- **Git-native workflow** - Meshes are just Git repositories
- **Static site deployment** - Push to GitHub Pages or any static host
- **Type-safe development** - TypeScript throughout
- **Plugin extensibility** - Extend functionality through plugins

### For Semantic Web Users

- **Dereferenceable IRIs** - Every IRI resolves to content
- **Version history** - Immutable snapshots for precise citation
- **Human-friendly** - Resource pages provide context and navigation
- **Machine-readable** - RDF distributions for automated processing

### For AI Agents

- **Clear structure** - Predictable folder/file organization

## Related Documentation

- [[concept.summary]] - Comprehensive concept documentation
- [[concept.mesh]] - Mesh definition and requirements
- [[concept.weave-process]] - Weave process details
- [[principle.transposability]] - Transposability principle
- [[principle.composability]] - Composability principle
