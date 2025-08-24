---
id: rregmt56znauz71qgypet6a
title: node flow
desc: ''
updated: 1755907148471
created: 1751688486456
---

Nodes are constituted by their node flows, which are evolvable datasets about their node's metadata, configuration, and data about the node’s referent. They exist through time, independent of any specific version or realization, and can evolve semi-independently.

There are four types of node flows.

    - [[concept.mesh.resource.element.flow.metadata]] (mandatory)
    - [[concept.mesh.resource.element.flow.config.operational]] (optional)
    - [[concept.mesh.resource.element.flow.config.inheritable]] (optional)
    - [[concept.mesh.resource.element.flow.data]] (for data nodes)


## Relationship to snapshots

As DatasetSeries, node flows are realized through [[resource.element.flow-snapshot]], which are temporal slices of the flow. To borrow a phrase from the PROV model, we say that a snapshot is a specialization of the node flow.

### Relationship pattern:

Every node flow has at least two concrete snapshots: [[resource.element.flow-snapshot.current]] and [[resource.element.flow-snapshot.next]].

The node flow is a [DatasetSeries](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset_Series) and may have multiple [[resource.element.flow-snapshot.version]]s.


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
