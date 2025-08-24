---
id: faq002
title: Why are there elements at the top of a repo?
desc: ''
updated: 1755990485015
created: 1751351383000
---

## Question

Why are there [[mesh elements|resource.element]] like `_meta/`, `_node-handle/`, and `_assets/` at the top level of a repository? Shouldn't elements only be inside nodes?

## Answer

Elements at the repository root exist because **the repository root itself is a [[mesh node|resource.node]]** - specifically, it's the [[root node|concept.root-node]] of the mesh.

### Repository Root = Mesh Root Node

Every semantic mesh has a root node, and in a repository-based mesh, the repository root **is** that root node. It's a "nameless" node locally (represented as "/") that can be any type of mesh node:

- **bare node**: If the repo organizes other nodes
- **data node**: If the repo represents a single dataset  
- **Reference node**: If the repo represents an external entity

Since the repository root is a mesh node, it follows the same rules as any other node and must contain:

- **`_meta/`**: corresponds to the [[resource.element.flow.node-metadata]] with administrative metadata for the root node
- **`_node-handle/`**: corresponds to [[node handle|resource.element.node-handle]] for referential indirection

The root node may contain **other elements**: Depending on the root node type (e.g., `_ref/` for reference nodes, `_data/` for versioned datasets)

### Consistency Principle

This maintains architectural consistency: **every mesh node has the same structure and capabilities**, whether it's nested deep in the hierarchy or at the repository root. The root node isn't special - it's just the top-level node in the mesh hierarchy.

### Mesh Self-Containment

This design also supports the principle that **any subtree is a complete mesh**. The repository root, being a proper mesh node with all its elements, ensures the entire repository is a self-contained, functional semantic mesh.
