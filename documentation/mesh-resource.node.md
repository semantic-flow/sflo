---
id: mesh-node
title: mesh node
desc: ''
updated: 1756869582377
created: 1750999795528
---

## Overview

The primary constituents of a semantic mesh are **mesh nodes**. They are physically represented as [[mesh folders|facet.filesystem.folder]] and establish a [[namespace segments|concept.namespace.segment]].

Mesh nodes are holonic containers that can contain other mesh nodes [[node components|mesh-resource.node-component]], distinguishing them from components which are terminal within their own scope.

## Filesystem Structure

When stored on disk, all mesh nodes:
- are physically represented as folders in the filesystem
- extend the identifier namespace with their folder name
- contain any of their own mesh resources
- may contain other nodes

## Mandatory Components

Every mesh node has these components:

- **[[mesh-resource.node-component.flow.node-metadata]]** ([[folder._node-metadata-flow]]): Centralized metadata for the node
- **[[mesh-resource.node-component.node-handle]]** (`_node-handle/`): Universal marker folder that refers to the parent "as a mesh node", as opposed to "as the name, dataset, or other thing" to which it normally refers; a handle resource page should explain this distinction

## Node Types

- [[bare node|mesh-resource.node.bare]]
- [[dataset node|mesh-resource.node.dataset]]
**Components**: `_node-metadata-flow/` + `_node-handle/` + `_dataset-flow/`
- Contains data distributions and versioning capabilities
- Node IRI refers to the node’s referent (real-world entity or dataset concept) represented by the dataset flow
- Adds dataset storage to the namespace foundation
- Can be configured as [[dataset series|faq.do-data-nodes-support-datasetseries]]
- Evolved from bare nodes by adding the `_dataset-flow/` component
- Maintains single referent principle
