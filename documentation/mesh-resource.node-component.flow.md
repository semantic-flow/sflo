---
id: node-flow
title: node flow
desc: ''
updated: 1756063907825
created: 1751688486456
---

[[Nodes|mesh-resource.node]] are primarily constituted by their node flows, which are evolvable datasets about their node's metadata, configuration, referent, or payload datasets. They exist through time, independent of any specific version or realization, and can evolve semi-independently from other flows

There are five types of node flows.

- [[mesh-resource.node-component.flow.node-metadata]] (required)
- [[mesh-resource.node-component.flow.node-config.operational]] (optional)
- [[mesh-resource.node-component.flow.node-config.inheritable]] (optional)
- [[mesh-resource.node-component.flow.reference]] (optional)
- [[mesh-resource.node-component.flow.data]] (for data nodes)


## Relationship to snapshots

As DatasetSeries, node flows are realized through [[mesh-resource.node-component.flow-snapshot]] datasets, which are temporal slices of the flow. To borrow a phrase from the PROV model, we say that a snapshot is a specialization of the node flow.

### Relationship pattern:

Every node flow has at least two concrete snapshots: [[mesh-resource.node-component.flow-snapshot.current]] and [[mesh-resource.node-component.flow-snapshot.next]].

The node flow is a [DatasetSeries](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset_Series) and may have multiple [[mesh-resource.node-component.flow-snapshot.version]]s.


### Ontology Example

- node flow: "My ontology definitions" (persistent concept)
- flow snapshots: v1, v2, current version, working draft of next version (specific realizations)


```file
/my-ontology/
└── _data-flow/                  ← node flow (ontology definitions)
    ├── _current/           ← flow snapshot (in this case, probably )
    ├── _next/           ← flow snapshot
    ├── _v1/           ← flow snapshot
    └── _v2/                ← flow snapshot
```

In this example:

Each _current/, _v1/, etc. contains flow snapshot realizations

## Persistent Identity

node flows provide conceptual continuity by:

- Maintaining meaning across versions and changes
- Preserving references from external sources
- Enabling evolution while keeping identity stable
- Supporting versioning without losing conceptual coherence
