
**flow snapshots** are components that are datasets and represent the evolutionary steps of the [[mesh-resource.node-component.flow]].  

flow snapshots have corresponding [[distributions|mesh-resource.node-component.snapshot-distribution]] and are the connective tissue between nodes and their RDF-based representation.

## Relationship to node flows

flow snapshots are the successive realizations of [[mesh-resource.node-component.flow]].

### Relationship pattern:

node flows have at least two snapshots:

- default shot (`_default/`)
- working shot (`_working/`)
- versioned snapshots (historical versions)

### Ontology dataset node Example

```file
/my-ontology/               ← dataset node: Conceptual, data-oriented "thing"
├── _meta/                   ← meta flow (metadata)
│   ├── _default/           ← flow snapshot (default metadata)
│   ├── _working/           ← flow snapshot (working draft)
│   ├── 2025-11-24_0142_07_v1/              ← flow snapshot (version 1 metadata)
│   └── 2025-11-24_0142_08_v2/              ← flow snapshot (version 2 metadata)
└── _dataset-flow/                  ← dataset node flow (ontology definition--by-dataset)
    ├── _default/           ← flow snapshot (default definition)
    ├── _working/           ← flow snapshot (working draft)
    └── 2025-11-24_0142_07_v1/              ← flow snapshot (version 1 definition)
```

In this example:
- `_default/`, `2025-11-24_0142_07_v1/`, `2025-11-24_0142_08_v2/`, `_working/` are all flow snapshots
- Each contains actual data files and distributions
- They represent specific temporal states of their parent node flows

## Temporal Nature

flow snapshots capture datasets at specific moments:

- **Default shots** (`_default/`) - The latest committed version
- **Working shots** (`_working/`) - Draft content for future release
- **Snapshots** (e.g., `2025-11-24_0142_07_v1/`, `2025-11-24_0142_08_v2/`) - Immutable historical versions

## Content Structure

flow snapshots contain:
- **Data files** - The actual dataset content (`.ttl`, `.rdf`, `.jsonld`)
- **Distributions** - Multiple format representations of the same data
- **Metadata** - Information about the specific version/snapshot

### Example Structure
```file
_default/
├── my-ontology.ttl         ← Distribution
├── my-ontology.rdf         ← Distribution
└── my-ontology.jsonld      ← Distribution
```

## Immutability

**[[mesh-resource.node-component.flow-snapshot.version]]** (historical flow snapshots, i.e., snapshot folders like `2025-11-24_0142_07_v1/`, `2025-11-24_0142_08_v2/`) should be treated as immutable once created. This provides reliable references for external systems and ensures accurate provenance and history.

**[[mesh-resource.node-component.flow-shot.default-shot]]** (the latest "woven" flow snapshots, `_default/`) should not be modified directly by users, but will be updated "on weave" if the [[mesh-resource.node-component.flow-shot.working]] has evolved.

**[[mesh-resource.node-component.flow-shot.working]]** (working flow snapshots, `_working/`) are mutable:
- Can be edited and updated during development
- Represent evolving state of the node flow

## Creation and Lifecycle

flow snapshots are created through:
- **Initial authoring** - Creating `_default/` content
- **Versioning** - Snapshotting `_default/` to snapshot folders (e.g., `2025-11-24_0142_07_v1/`, `2025-11-24_0142_08_v2/`) during [[concept.weave]]
- **Draft preparation** - Working in `_working/` for future releases

## Related Concepts

- **[[mesh-resource.node-component.flow]]** - Parent conceptual entities
- **[[concept.flow-version]]** - Process of creating versioned flow snapshots
- **[[concept.weave-process]]** - Operation that manages flow snapshot lifecycle
