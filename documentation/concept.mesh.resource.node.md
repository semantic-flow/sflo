---
id: 8hmkiyjtsey7z8y5oi5xdxm
title: MeshNode
desc: ''
updated: 1755906055670
created: 1750999795528
---

## Overview

The primary constituents of a semantic mesh are **mesh nodes**. They are physically represented as [[mesh folders|concept.mesh.resource-facet.folder]] and provide one type of [[namespace segments|concept.namespace.segment]].

Mesh nodes are extensible namespace containers that can contain other mesh nodes and [[mesh elements|concept.mesh.resource.element]], distinguishing them from elements which are terminal within their own scope.

## Physical Structure

When stored on disk, all mesh nodes:
- Are physically represented as folders in the filesystem
- Have folder names that become namespace segments
- Extend the URL namespace with their folder name
- Can be further extended by containing other mesh resources

## Mandatory Elements

Every mesh node has these elements:

- **[[concept.mesh.resource.element.flow.metadata]]** (`_meta-flow/`): Centralized metadata for the node
- **[[concept.mesh.resource.element.handle]]** (`_node-handle/`): Universal marker folder that refers to the parent "as a mesh node", as opposed to "as the name, dataset, or other thing" to which it normally refers; a handle resource page should explain this distinction

## Node Types

### 1. [[Namespace Node|concept.mesh.resource.node.namespace]]
**Elements**: `_meta-flow/` + `_node-handle/`
- Functions as organizational containers
- Contains essential identity, metadata, and handle information
- Node IRI refers to the namespace itself
- Base level for all mesh nodes


### 2. [[Data Node|concept.mesh.resource.node.data]]
**Elements**: `_meta-flow/` + `_node-handle/` + `_data-flow/`
- Contains data distributions and versioning capabilities
- Node URL refers to the node’s referent (real-world entity or dataset concept) represented by the data flow
- Adds dataset storage to the namespace foundation
- Can be configured as [[dataset series|concept.mesh.resource.node.data.series]]
- Evolved from namespace nodes by adding the `_data-flow/` element
- Maintains single referent principle
