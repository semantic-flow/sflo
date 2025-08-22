---
id: hp9ckpez0pmuv270sn005gt
title: node folder
desc: 'a folder that maps to a mesh node and extends the namespace'
updated: 1755852523199
created: 1751160854174
---

## Definition

A node folder is any folder that maps to a mesh node. Each node folder extends the namespace with its name and has a concept URL.

- What a “namespace” is: see [[concept.namespace]]
- General node types and anatomy: see [[concept.mesh.resource.node]]

## Minimal requirements

- Every node folder must contain:
  - [[_node-handle/|concept.mesh.resource.folder._handle]]
  - [[_meta-flow/|concept.mesh.resource.folder._meta-flow]]

## Node-specific flows (by type)

- [[namespace node|concept.mesh.resource.node.namespace]]:
  - Optional flows as needed for documentation/reference; typically no data distributions directly in the folder
- [[reference node|concept.mesh.resource.node.reference]]:
  - Requires [[_ref-flow/|concept.mesh.resource.folder._ref-flow]]
- [[data node|concept.mesh.resource.node.data]]:
  - Requires [[_data-flow/|concept.mesh.resource.folder._data-flow]]

Distributions must live inside flow snapshot folders (e.g., `_current/`, `_vN/`). See [[concept.mesh.resource.element.flow]] and [[concept.mesh.resource.element.flow.snapshot]].

## Example

```file
/my-node/                     # node folder → https://ex.org/my-node/
├── _node-handle/             # required
├── _meta-flow/               # required
├── _ref-flow/                # required for reference nodes (optional otherwise)
└── _data-flow/               # required for data nodes
