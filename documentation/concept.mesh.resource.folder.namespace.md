---
id: ragu0uc06vmiqvmn41r070e
title: namespace folder
desc: 'a mesh node folder whose URL refers to the namespace itself'
updated: 1755852279131
created: 1751242782345
---

## Definition

A namespace folder is a mesh node folder whose URL refers to the namespace itself (an organizational container).

- What a “namespace” is: see [[concept.namespace]]
- URL semantics (concept vs content): see [[concept.url]]

## Minimal requirements

- Must contain:
  - [[`_node-handle/`|concept.mesh.resource.folder._handle]]
  - [[`_meta-flow/`|concept.mesh.resource.folder._meta-flow]]
- May contain:
  - Other node folders and elements
  - Optional system/user resources like [[`_assets/`|concept.mesh.resource.folder._assets]]
  - Optional flows (e.g., reference), if meaningful for the namespace node’s role
- Must not:
  - Store dataset distributions directly outside flow snapshot folders (see [[concept.mesh.resource.element.flow]])

## Example

```file
/ns/                          # namespace folder → https://ex.org/ns/
├── _node-handle/             # handle (required)
├── _meta-flow/               # metadata flow (required)
└── people/                   # child namespace folder → https://ex.org/ns/people/
```

For general node anatomy and types, see [[concept.mesh.resource.node]] and [[concept.mesh.resource.node.namespace]].
