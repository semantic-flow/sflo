---
id: mesh-node
title: mesh node
desc: ''
updated: 1755992048961
created: 1750999795528
---

## Overview

The primary constituents of a semantic mesh are **mesh nodes**. They are physically represented as [[mesh folders|facet.filesystem.folder]] and establish a [[namespace segments|concept.namespace.segment]].

Mesh nodes are holonic containers that can contain other mesh nodes [[mesh elements|resource.element]], distinguishing them from elements which are terminal within their own scope.

## Physical Structure

When stored on disk, all mesh nodes:
- Are physically represented as folders in the filesystem
- Extend the identifier namespace with their folder name
- Can be further extended by containing other mesh resources

## Mandatory Elements

Every mesh node has these elements:

- **[[resource.element.flow.node-metadata]]** ([[folder._node-metadata-flow]]): Centralized metadata for the node
- **[[resource.element.node-handle]]** (`_node-handle/`): Universal marker folder that refers to the parent "as a mesh node", as opposed to "as the name, dataset, or other thing" to which it normally refers; a handle resource page should explain this distinction

## Optional Elements

- 

## Node Types

### 1. [[bare node|resource.node.bare]]
**Elements**: `_meta-flow/` + `_node-handle/`
- Functions as organizational containers
- Contains essential identity, metadata, and handle information
- Node IRI refers to the namespace itself
- Base level for all mesh nodes


### 2. [[Data Node|resource.node.data]]
**Elements**: `_meta-flow/` + `_node-handle/` + `_data-flow/`
- Contains data distributions and versioning capabilities
- Node URL refers to the node’s referent (real-world entity or dataset concept) represented by the data flow
- Adds dataset storage to the namespace foundation
- Can be configured as [[dataset series|resource.node.data.series]]
- Evolved from bare nodes by adding the `_data-flow/` element
- Maintains single referent principle
