---
id: rregmt56znauz71qgypet6a
title: node flow
desc: ''
updated: 1752025335642
created: 1751688486456
---

There are three types of node flows - they are the most important parts of a node:

    - [[sflo.concept.mesh.resource.element.node-component.metadata]] (mandatory)
    - [[sflo.concept.mesh.resource.element.node-component.reference]] (optional)
    - [[sflo.concept.mesh.resource.element.node-component.data]] (only for [[sflo.concept.mesh.resource.node.data]])

**node flows** are dcat:DatasetSeries representing abstract datasets about their node's metadata, referent, and payload data that exist through time, independent of any specific version or realization.

## Relationship to node flows

As DatasetSeries, node flows are realized through [[concept.mesh.resource.element.flow.snapshot]], which are temporal concrete versions of the abstract concept. To borrow a phrase from the PROV model, we say that a layer is a specialization of the node flow.

### Relationship pattern:

Every node flow has at least two concrete layers: [[concept.mesh.resource.element.flow.snapshot.current]] and [[concept.mesh.resource.element.flow.snapshot.next]].

The node flow is a [[related-topics.dcat.dataset-series]] and may have multiple flow snapshots, i.e., [[concept.mesh.resource.element.flow.snapshot.version]]s.

- node flow: "My ontology definitions" (persistent concept)
- flow snapshots: v1.0, v1.1, current version, working draft of next version (specific realizations)

### Ontology Example

```file
/my-ontology/
├── _ref-component/                    ← node flow (reference data about ontology)
│   ├── _current/           ← flow snapshot
│   ├── _v1/                ← flow snapshot  
│   └── _v2/                ← flow snapshot
└── _data-component/                  ← node flow (ontology definitions)
    ├── _current/           ← flow snapshot
    └── _v1/                ← flow snapshot
```

In this example:

_ref/ represents the node flow of reference information about the ontology
_data/ represents the node flow of the ontology's definitional content
Each _current/, _v1/, etc. contains flow snapshot realizations

## Persistent Identity

node flows provide conceptual continuity by:

- Maintaining meaning across versions and changes
- Preserving references from external sources
- Enabling evolution while keeping identity stable
- Supporting versioning without losing conceptual coherence
