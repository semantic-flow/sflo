---
id: why-are-there-components-at-the-top-of-a-repo
title: Why are there components at the top of a repo?
desc: ''
updated: 1764914216073
created: 1751351383000
---

## Question

Why are there [[mesh knop components|mesh-resource.component]] like `_meta/`, `_knop-handle/`, and `_assets/` at the top level of a repository? Shouldn't components only be inside knops?

## Answer

Components at the repository root exist because **the repository root itself is a [[mesh knop|mesh-resource.knop]]** - specifically, it's the [[root knop|concept.root-knop]] of the mesh.

### Repository Root = Mesh root knop

Every semantic mesh has a root knop, and in a repository-based mesh, the repository root **is** that root knop. It's a "nameless" knop locally (represented as "/") that can be any type of mesh knop:

- **bare knop**: If the repo organizes other knops
- **dataset knop**: If the repo represents a single dataset  
- **Reference knop**: If the repo represents an external entity

Since the repository root is a mesh knop, it follows the same rules as any other knop and must contain:

- **`_meta/`**: corresponds to the [[mesh-resource.component.flow.metadata]] with administrative metadata for the root knop
- **`_knop-handle/`**: corresponds to [[knop handle|resource.knop-component.knop-handle]] for referential indirection

The root knop may contain **other components**: Depending on the root knop type (e.g., `_ref/` for reference knops, `_payload/` for versioned datasets)

### Consistency Principle

This maintains architectural consistency: **every mesh knop has the same structure and capabilities**, whether it's nested deep in the hierarchy or at the repository root. The root knop isn't special - it's just the top-level knop in the mesh hierarchy.

### Mesh Self-Containment

This design also supports the principle that **any subtree is a complete mesh**. The repository root, being a proper mesh knop with all its components, ensures the entire repository is a self-contained, functional semantic mesh.
