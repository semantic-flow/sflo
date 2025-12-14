---
id: why-are-there-components-at-the-top-of-a-repo
title: Why are there components at the top of a repo?
desc: ''
updated: 1765633422054
created: 1751351383000
---

## Question

Why are there [[mesh knop components|mesh-resource.component]] like `_meta/`, `_knop-handle/`, and `_assets/` at the top level of a repository? Shouldn't components only be inside knops?

## Answer

Components at the repository root exist because in [[concept.single-mesh-repo]] **the repository root itself is a [[mesh knop|mesh-resource.knop]]** - specifically, it's the [[root knop|concept.root-knop]] of the mesh.

### Intramesh identifier = Repo name

On disk, the root knop will usually share the name of the the repository, and this is the intramesh identifier 

### Consistency Principle

This maintains architectural consistency: **every mesh knop has the same structure and capabilities**, whether it's nested deep in the hierarchy or at the repository root. The root knop isn't special - it's just the top-level knop in the mesh hierarchy.

### Mesh Self-Containment

This design also supports the principle that **any subtree is a complete mesh**. The repository root, being a proper mesh knop with all its components, ensures the entire repository is a self-contained, functional semantic mesh.
