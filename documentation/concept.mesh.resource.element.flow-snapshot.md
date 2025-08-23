---
id: 8t3swuswoi81yuzo2bnecy9
title: flow snapshot
desc: ''
updated: 1755910812698
created: 1751689346769
---

**flow snapshots** are mesh elements that are datasets and represent the evolutionary steps of [[concept.mesh.resource.element.flow]], whether [[concept.mesh.resource.element.flow.metadata]] or [[concept.mesh.resource.element.flow.data]]. 

flow snapshots have corresponding [[distributions|concept.mesh.resource.element.snapshot-distribution]] and are the connective tissue between nodes and their RDF-based representation.

## Relationship to node flows

flow snapshots are the successive realizations of [[concept.mesh.resource.element.flow]].

### Relationship pattern:

node flows have at least two snapshots:

- current version (`_current/`)
- working draft (`_next`)
- versioned snapshots

### Ontology Data Node Example

```file
/my-ontology/               ← Data Node: Conceptual, data-oriented "thing"
├── _meta-flow/                   ← meta flow (metadata)
│   ├── _current/           ← flow snapshot (current metadata)
│   ├── _next/              ← flow snapshot (working draft)
│   ├── _v1/                ← flow snapshot (version 1 metadata)
│   └── _v2/                ← flow snapshot (version 2 metadata)
└── _data-flow/                  ← Data node flow (ontology definition--by-dataset)
    ├── _current/           ← flow snapshot (current definition)
    ├── _next/              ← flow snapshot (working draft)
    └── _v1/                ← flow snapshot (version 1 definition)
```

In this example:
- `_current/`, `_v1/`, `_v2/`, `_next/` are all flow snapshots
- Each contains actual data files and distributions
- They represent specific temporal states of their parent node flows

## Temporal Nature

flow snapshots capture datasets at specific moments:

- **Current versions** (`_current/`) - The latest version.
- **Next versions** (`_next/`) - Draft content for future release
- **Historical versions** (`_v1/`, `_v2/`) - Immutable snapshots from the past

## Content Structure

flow snapshots contain:
- **Data files** - The actual dataset content (`.ttl`, `.rdf`, `.jsonld`)
- **Distributions** - Multiple format representations of the same data
- **Metadata** - Information about the specific version/snapshot

### Example Structure
```file
_current/
├── my-ontology.ttl         ← Distribution
├── my-ontology.rdf         ← Distribution  
└── my-ontology.jsonld      ← Distribution
```

## Immutability

**[[concept.mesh.resource.element.flow-snapshot.version]]** (historical flow snapshots, i.e., versioned folders like `_v1/`, `_v2/`) should be treated as immutable once created. This provides reliable references for external systems and ensures accurate provenance and history.

**[[concept.mesh.resource.element.flow-snapshot.current]]** (the latest "woven" flow snapshots, `_current`) should not be modified directly by users, but will be updated "on weave" if the [[concept.mesh.resource.element.flow-snapshot.next]] has evolved. 

**[[concept.mesh.resource.element.flow-snapshot.next]]** (working flow snapshots, `_next/`) are mutable:
- Can be edited and updated during development
- Represent evolving state of the node flow

## Creation and Lifecycle

flow snapshots are created through:
- **Initial authoring** - Creating `_current/` content
- **Versioning** - Snapshotting `_current/` to `_v1/`, `_v2/` during [[concept.weave]]
- **Draft preparation** - Working in `_next/` for future releases

## Related Concepts

- **[[concept.mesh.resource.element.flow]]** - Parent conceptual entities
- **[[concept.versioning]]** - Process of creating versioned flow snapshots
- **[[concept.weave-process]]** - Operation that manages flow snapshot lifecycle
