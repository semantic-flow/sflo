---
id: 9c27yly4ed3ju7msf8luhge
title: mesh element
desc: ''
updated: 1755844240973
created: 1750706813437
---

## Overview

**Mesh elements** are terminal mesh resources that support and define the mesh structure. Unlike [[mesh nodes|concept.mesh.resource.node]] which can contain other mesh resources, elements cannot be extended beyond their own internal structure.

Elements can be physically represented as folders or files, and all files and folders within an element folder are considered to be part of that element.

## Element Categories

Elements are categorized by their facets, including:
  - typical creation and maintenance patterns (user vs system)
  - verioning status
  - folder vs. file
  - node role (name, reference, and data [[concept.mesh.resource.element.flow]])

### User Elements

User elements are primarily created and maintained by users or their software agents and services, and represent domain knowledge:

**Folder-based user elements:**
- **[[Asset trees|concept.mesh.resource.element.asset-tree]]**: Collections of arbitrary files attached to the mesh (in `_assets/` folders)
- **[[Next datasets|concept.mesh.resource.element.flow.snapshot.next]]**: Draft workspaces for ongoing changes to [[concept.mesh.resource.element.flow]] (in `_next/` folders)

**File-based user elements:**
- **README.md files**: User documentation providing context
- **CHANGELOG.md files**: Version history documentation

### System Elements

System elements are usually created or altered by the [[Weave Process|concept.weave-process]] process rather than direct user modification:

**Folder-based system elements:**
- **[[metadata flows|concept.mesh.resource.element.flow.metadata]]**: Administrative and structural metadata for mesh nodes (in `_meta-flow/` folders)
- **[[version snapshot|concept.mesh.resource.element.flow.snapshot.version]]**: Versioned snapshots of datasets (in `_vN/` folders)
- **[[Node handles|concept.mesh.resource.element.handle]]**: Elements providing referential indirection for nodes as mesh resources (in `_node-handle/` folders)
- [[concept.mesh.resource.element.flow.unified]]

**File-based system elements:**
- **[[Resource pages|concept.mesh.resource.element.documentation-resource.resource-page]]**: Generated index.html files for human-readable access
- **[[Distribution files|concept.mesh.resource.element.flow.snapshot.distribution]]**: Data files in various RDF formats

## Physical vs Logical Structure

**Physical Representation:**
- Folder-based elements are represented as folders with underscore prefixes (like `_meta-flow/`, `_ref-flow/`, `_assets/`)
- File-based elements are individual files within mesh nodes or other elements
- Element folders contain all files and folders that belong to that element

**Logical Function:**
- Elements extend the namespace but are terminal (cannot contain other mesh nodes or elements)
- Elements provide specialized functionality: metadata, versioning, referential data, or file attachments
- Elements maintain the semantic structure and operational capabilities of the mesh

## Integration with Nodes

Elements work in conjunction with mesh nodes to create the complete mesh structure:
- Every mesh node contains at least two elements: metadata flows and node handles
- Reference nodes contain reference flows 
- data nodes may also contain reference flows, but their defining component is the [[concept.mesh.resource.element.flow.data]]
- Any node may contain asset trees (user elements) for file attachments
