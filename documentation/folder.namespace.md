---
id: ragu0uc06vmiqvmn41r070e
title: namespace folder
desc: a mesh node folder whose IRI refers to the namespace itself
updated: 1756767742319
created: 1751242782345
---

## Definition

A namespace folder is a mesh node folder whose IRI refers to the namespace itself (an organizational container).

- What a “namespace” is: see [[concept.namespace]]
- IRI semantics (concept vs content): see [[concept.identifier]]

## Minimal requirements

- Must contain:
  - [[`_node-handle/`|folder._node-handle]]
  - [[`_meta-flow/`|folder._node-metadata-flow]]
- May contain:
  - Other node folders and components
  - Optional system/user resources like [[`_assets/`|folder._assets]]
  - Optional flows (e.g., reference), if meaningful for the bare node’s role
- Must not:
  - Store dataset distributions directly outside flow snapshot folders (see [[mesh-resource.node-component.flow]])

## Example

```file
/ns/                          # namespace folder → https://ex.org/ns/
├── _node-handle/             # handle (required)
├── _meta-flow/               # metadata flow (required)
└── people/                   # child namespace folder → https://ex.org/ns/people/
```

For general node anatomy and types, see [[mesh-resource.node]] and [[mesh-resource.node.bare]].
