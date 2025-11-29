---
id: flows
title: flows
desc: ''
updated: 1764355124423
created: 1751688486456
---

[[Nodes|mesh-resource.node]] are primarily constituted by their semantic flows: evolvable datasets about their node's data, metadata, configuration, or referent. They exist through time, independent of any specific version or realization, and can evolve semi-independently.

There are five types of node flows.

- [[mesh-resource.node-component.flow.node-metadata]] (required)
- [[mesh-resource.node-component.flow.node-config.operational]] (optional)
- [[mesh-resource.node-component.flow.node-config.inheritable]] (optional)
- [[mesh-resource.node-component.flow.reference]] (optional)
- [[mesh-resource.node-component.flow.payload]] (for payload nodes)


## Relationship to snapshots

As DatasetSeries, node flows are realized through [[mesh-resource.node-component.flow-snapshot]] datasets, which are temporal slices of the flow. To borrow a phrase from the PROV model, we say that a snapshot is a specialization of the node flow.

### Relationship pattern:

Every node flow has at least two concrete snapshots: [[mesh-resource.node-component.flow-shot.default-shot]] and [[mesh-resource.node-component.flow-shot.working]].

The node flow is a [DatasetSeries](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset_Series) and may have multiple [[mesh-resource.node-component.flow-snapshot.version]]s.


### Ontology Example

- node flow: "My ontology definitions" (persistent concept)
- flow snapshots: v1, v2, current version, working draft of working version (specific realizations)


```file
/my-ontology/
└── _payload/                  ← node flow (ontology definitions)
    ├── _default/           ← flow snapshot
    ├── _working/           ← flow snapshot
    ├── 2025-11-24_0142_07_v1/           ← flow snapshot
    └── 2025-11-24_0142_08_v2/                ← flow snapshot
```

In this example:

Each _default/, _working/, and snapshot folder contains flow snapshot realizations

## Persistent Identity

node flows provide conceptual continuity by:

- Maintaining meaning across versions and changes
- Preserving references from external sources
- Enabling evolution while keeping identity stable
- Supporting versioning without losing conceptual coherence
