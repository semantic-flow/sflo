
## Definition

A node folder is any folder that maps to a [[mesh-resource.node]]. Each node folder extends the namespace with its name and has a concept IRI that may refer to something. 

- What a “namespace” is: see [[concept.namespace]]
- General node types and anatomy: see [[mesh-resource.node]]

## Minimal requirements

- Every node folder must contain:
  - [[_node-handle/|folder._node-handle]]
  - [[_meta/|folder._meta]]

## Node-specific flows (by type)

- [[bare node|mesh-resource.node.bare]]: no additional flows 
- [[dataset node|mesh-resource.node.payload]]: requires [[_dataset-flow/|folder._dataset-flow]]

Distributions must live inside flow snapshot folders (e.g., `_default/`, `_working/`, snapshot folders like `2025-11-24_0142_07_v1/`). See [[resource.node-component.flow]] and [[resource.node-component.flow-snapshot]].

## Example

```file
/my-node/                     # node folder → https://ex.org/my-node/
├── _node-handle/             # required
├── _meta/               # required
└── _dataset-flow/               # required for dataset nodes
