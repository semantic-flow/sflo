---
id: hp9ckpez0pmuv270sn005gt
title: node folder
desc: a folder that maps to a mesh node and extends the namespace
updated: 1756063907842
created: 1751160854174
---

## Definition

A node folder is any folder that maps to a mesh node. Each node folder extends the namespace with its name and has a concept URL that refers to something. 

- What a “namespace” is: see [[concept.namespace]]
- General node types and anatomy: see [[resource.node]]

## Minimal requirements

- Every node folder must contain:
  - [[_node-handle/|folder._node-handle]]
  - [[_meta-flow/|folder._node-metadata-flow]]

## Node-specific flows (by type)

- [[bare node|resource.node.bare]]: no additional flows 
- [[data node|resource.node.reference.dataset]]: requires [[_data-flow/|folder._data-flow]]

Distributions must live inside flow snapshot folders (e.g., `_current/`, `_vN/`). See [[resource.node-component.flow]] and [[resource.node-component.flow-snapshot]].

## Example

```file
/my-node/                     # node folder → https://ex.org/my-node/
├── _node-handle/             # required
├── _meta-flow/               # required
└── _data-flow/               # required for data nodes
