
## Overview

data flows (_data-component/) are [[node flows|concept.mesh.resource.element.flow]] that effectively associate a versioned dataset with a mesh node. They contain the actual content payload of data nodes and provide the primary data storage functionality within the semantic flow mesh architecture.

## Purpose

data flows serve as the primary content containers for mesh nodes, providing:

- **Content Storage**: Hold the actual data payload that defines the node's content
- **Version Management**: Support multiple versions of the same conceptual dataset
- **Format Diversity**: Enable multiple data format distributions (TTL, JSON-LD, etc.)
- **State Management**: Track current, draft, and versioned states of data

## Structure

data flows organize content through [[flow snapshots|concept.mesh.resource.element.flow.snapshot]]:

- `_current/` - Current stable version of the dataset
- `_next/` - Draft/work-in-progress version
- `_v1/`, `_v2/`, etc. - Versioned snapshots for historical access

Like all [[concept.mesh.resource-facet.folder]], they should contain an `index.html` [[concept.mesh.resource.element.documentation-resource.resource-page]] -- a human-readable description for the component


## Relationship to Data Nodes

data flows create the fundamental association between nodes and their content:


## Content Types

data flows contain one or more 

## Versioning Strategy

data flows implement sophisticated version management:

- **Linear Versioning**: Sequential versions (v1, v2, v3...)
- **Branch Management**: Current stable vs. next draft
- **Snapshot Preservation**: Historical versions remain accessible
- **Aggregated Access**: Top-level files provide consolidated views

## Distribution Formats

Each flow snapshot typically provides multiple format distributions:

- **Trig (.trig)**: Primary RDF serialization
- **JSON-LD (.jsonld)**: JSON-compatible linked data
- **RDF/XML (.xml or .trix)**: XML-based RDF serialization
- **N-Quads (.nq)**: Line-based RDF format

## Example

From the [[semantic mesh example|concept.semantic-mesh.example]]:

```
/test-ns/djradon-bio/_data/          # data flow
├── _current/                        # current snapshot
│   ├── djradon-bio.ttl             # turtle distribution
│   ├── djradon-bio.jsonld          # json-ld distribution
│   └── index.html                  # layer interface
├── _next/                          # draft layer
│   ├── djradon-bio.ttl             # draft turtle
│   ├── djradon-bio.jsonld          # draft json-ld
│   └── index.html                  # layer interface
└── index.html                      # component interface
```

## Integration

data flows integrate with other mesh elements:

- **metadata flows**: Provide provenance and management data
- **reference flows**: Enable indirection and linking
- **Asset Trees**: Store associated files and media
- **Resource Pages**: Provide human-readable interfaces

data flows are the core content mechanism that enables the semantic flow mesh to function as a distributed, versioned knowledge management system.
