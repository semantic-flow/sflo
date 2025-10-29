---
id: hp9ckpez0pmuv270sn005gt
title: node folder
desc: a folder that maps to a mesh node and extends the namespace
updated: 1760212749258
created: 1751160854174
---

## Definition

A node folder is any folder that maps to a [[mesh-resource.node]]. Each node folder extends the namespace with its name and has a concept IRI that may refer to something. 

- What a “namespace” is: see [[concept.namespace]]
- General node types and anatomy: see [[mesh-resource.node]]

## Minimal requirements

- Every node folder must contain:
  - [[_node-handle/|folder._node-handle]]
  - [[_node-metadata-flow/|folder._node-metadata-flow]]

## Node-specific flows (by type)

- [[bare node|mesh-resource.node.bare]]: no additional flows 
- [[dataset node|mesh-resource.node.dataset]]: requires [[_dataset-flow/|folder._dataset-flow]]

Distributions must live inside flow snapshot folders (e.g., `_current/`, `_vN/`). See [[resource.node-component.flow]] and [[resource.node-component.flow-snapshot]].

## Example

```file
/my-node/                     # node folder → https://ex.org/my-node/
├── _node-handle/             # required
├── _node-metadata-flow/               # required
└── _dataset-flow/               # required for dataset nodes
