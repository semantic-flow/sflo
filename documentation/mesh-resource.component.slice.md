---
id: 8t3swuswoi81yuzo2bnecy9
title: FlowSlice
desc: ''
updated: 1764914216055
created: 1751689346769
---

**flow versions** are components that are datasets and represent the evolutionary steps of the [[mesh-resource.component.flow]].  

flow versions have corresponding [[distributions|mesh-resource.component.distribution]] and are the connective tissue between knops and their RDF-based representation.

## Relationship to knop flows

flow versions are the successive realizations of [[mesh-resource.component.flow]].

### Relationship pattern:

knop flows have at least two versions:

- default slice (`_default/`)
- working slice (`_working/`)
- versioned versions (historical versions)

### Ontology dataset knop Example

```file
/my-ontology/               ← dataset knop: Conceptual, data-oriented "thing"
├── _meta/                   ← meta flow (metadata)
│   ├── _default/           ← flow version (default metadata)
│   ├── _working/           ← flow version (working draft)
│   ├── 2025-11-24_0142_07_v1/              ← flow version (version 1 metadata)
│   └── 2025-11-24_0142_08_v2/              ← flow version (version 2 metadata)
└── _payload/                  ← dataset knop flow (ontology definition--by-dataset)
    ├── _default/           ← flow version (default definition)
    ├── _working/           ← flow version (working draft)
    └── 2025-11-24_0142_07_v1/              ← flow version (version 1 definition)
```

In this example:
- `_default/`, `2025-11-24_0142_07_v1/`, `2025-11-24_0142_08_v2/`, `_working/` are all flow versions
- Each contains actual data files and distributions
- They represent specific temporal states of their parent knop flows

## Temporal Nature

flow versions capture datasets at specific moments:

- **Default slices** (`_default/`) - The latest committed version
- **Working slices** (`_working/`) - Draft content for future release
- **Versions** (e.g., `2025-11-24_0142_07_v1/`, `2025-11-24_0142_08_v2/`) - Immutable historical versions

## Content Structure

flow versions contain:
- **Data files** - The actual dataset content (`.ttl`, `.rdf`, `.jsonld`)
- **Distributions** - Multiple format representations of the same data
- **Metadata** - Information about the specific version/version

### Example Structure
```file
_default/
├── my-ontology.ttl         ← Distribution
├── my-ontology.rdf         ← Distribution
└── my-ontology.jsonld      ← Distribution
```

## Immutability

**[[mesh-resource.component.flow-version.version]]** (historical flow versions, i.e., version folders like `2025-11-24_0142_07_v1/`, `2025-11-24_0142_08_v2/`) should be treated as immutable once created. This provides reliable references for external systems and ensures accurate provenance and history.

**[[mesh-resource.component.slice.default]]** (the latest "woven" flow versions, `_default/`) should not be modified directly by users, but will be updated "on weave" if the [[mesh-resource.component.slice.working]] has evolved.

**[[mesh-resource.component.slice.working]]** (working flow versions, `_working/`) are mutable:
- Can be edited and updated during development
- Represent evolving state of the knop flow

## Creation and Lifecycle

flow versions are created through:
- **Initial authoring** - Creating `_default/` content
- **Versioning** - Versionting `_default/` to version folders (e.g., `2025-11-24_0142_07_v1/`, `2025-11-24_0142_08_v2/`) during [[concept.weave]]
- **Draft preparation** - Working in `_working/` for future releases

## Related Concepts

- **[[mesh-resource.component.flow]]** - Parent conceptual entities
- **[[concept.flow-slice]]** - Process of creating versioned flow versions
- **[[concept.weave-process]]** - Operation that manages flow version lifecycle
