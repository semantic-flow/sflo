---
id: flows
title: flows
desc: ''
updated: 1764867799464
created: 1751688486456
---

[[Nodes|mesh-resource.knop]] are primarily constituted by their semantic flows: evolvable datasets about their knop's data, metadata, configuration, or referent. They exist through time, independent of any specific version or realization, and can evolve semi-independently.

There are five types of knop flows.

- [[mesh-resource.component.flow.metadata]] (required)
- [[mesh-resource.component.flow.operational-config]] (optional)
- [[mesh-resource.component.flow.inheritable-config]] (optional)
- [[mesh-resource.component.flow.reference]] (optional)
- [[mesh-resource.component.flow.payload]] (for payload knops)


## Relationship to versions

As DatasetSeries, knop flows are realized through [[mesh-resource.knop-component.flow-version]] datasets, which are temporal slices of the flow. To borrow a phrase from the PROV model, we say that a version is a specialization of the knop flow.

### Relationship pattern:

Every knop flow has at least two concrete versions: [[mesh-resource.component.slice.default-slice]] and [[mesh-resource.knop-component.flow-slice.working]].

The knop flow is a [DatasetSeries](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset_Series) and may have multiple [[mesh-resource.knop-component.flow-version.version]]s.


### Ontology Example

- knop flow: "My ontology definitions" (persistent concept)
- flow versions: v1, v2, current version, working draft of working version (specific realizations)


```file
/my-ontology/
└── _payload/                  ← knop flow (ontology definitions)
    ├── _default/           ← flow version
    ├── _working/           ← flow version
    ├── 2025-11-24_0142_07_v1/           ← flow version
    └── 2025-11-24_0142_08_v2/                ← flow version
```

In this example:

Each _default/, _working/, and version folder contains flow version realizations

## Persistent Identity

knop flows provide conceptual continuity by:

- Maintaining meaning across versions and changes
- Preserving references from external sources
- Enabling evolution while keeping identity stable
- Supporting versioning without losing conceptual coherence
