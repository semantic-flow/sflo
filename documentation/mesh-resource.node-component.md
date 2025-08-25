---
id: 9c27yly4ed3ju7msf8luhge
title: node component
desc: ''
updated: 1756063907812
created: 1750706813437
---

## Overview

**Node components** are mesh resources that support and define the mesh structure. Unlike [[mesh nodes|mesh-resource.node]] which can contain other mesh nodes, components cannot be extended beyond their own internal structure.

Components can be physically represented as folders or files, and all files and folders within a component folder are considered to be part of that component.

## Component Categories

Components are categorized by their facets, including:
  - typical creation and maintenance patterns (user vs system)
  - versioning status
  - folder vs. file
  - node role (meta and data [[mesh-resource.node-component.flow]])

### User Components

User components are primarily created and maintained by users or their software agents and services, and represent domain knowledge:

**Folder-based user components:**
- **[[Asset trees|mesh-resource.node-component.asset-tree]]**: Collections of arbitrary files attached to the mesh (in `_assets/` folders)
- **[[Next datasets|mesh-resource.node-component.flow-snapshot.next]]**: Draft workspaces for ongoing changes to [[mesh-resource.node-component.flow]] (in `_next/` folders)

**File-based user components:**
- **README.md files**: User documentation providing context
- **CHANGELOG.md files**: Version history documentation

### System Components

System components are usually created or altered by the [[Weave Process|concept.weave-process]] process rather than direct user modification:

**Folder-based system components:**
- **[[metadata flows|mesh-resource.node-component.flow.node-metadata]]**: Administrative and structural metadata for mesh nodes (in `_meta-flow/` folders)
- **[[version snapshot|mesh-resource.node-component.flow-snapshot.version]]**: Versioned snapshots of datasets (in `_vN/` folders)
- **[[Node handles|mesh-resource.node-component.node-handle]]**: Components providing referential indirection for nodes as mesh resources (in `_node-handle/` folders)

**File-based system components:**
- **[[Resource pages|mesh-resource.node-component.documentation-resource.resource-page]]**: Generated index.html files for human-readable access
- **[[Distribution files|mesh-resource.node-component.snapshot-distribution]]**: Data files in various RDF formats

## Physical vs Logical Structure

**Physical Representation:**
- Folder-based components are represented as folders with underscore prefixes (like `_meta-flow/`, `_assets/`)
- File-based components are individual files within mesh nodes or other components
- Component folders contain all files and folders that belong to that component

**Logical Function:**
- Components extend the namespace but are terminal (cannot contain other mesh nodes or components)
- Components provide specialized functionality: metadata, versioning, referential data, or file attachments
- Components maintain the semantic structure and operational capabilities of the mesh

## Integration with Nodes

Components work in conjunction with mesh nodes to create the complete mesh structure:
- Every mesh node contains at least two components: metadata flows and node handles
- data nodes contain a single [[mesh-resource.node-component.flow.data]] 
- Any node may contain asset trees (user components) for file attachments
