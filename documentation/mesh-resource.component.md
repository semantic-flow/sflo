---
id: 9c27yly4ed3ju7msf8luhge
title: knop components
desc: ''
updated: 1764867799232
created: 1750706813437
---

## Overview

**Node components** are mesh resources that support and define a knop. Unlike [[mesh knops|mesh-resource.knop]] which can contain other mesh knops, components cannot be extended beyond their own internal structure.

Components can be physically represented as folders or files, and all files and folders within a component folder are considered to be part of that component.

## Component Categories

Components are categorized by their facets, including:
  - typical creation and maintenance patterns (user vs system)
  - versioning status
  - folder vs. file
  - knop role (meta and data [[mesh-resource.component.flow]])

### User Components

User components are primarily created and maintained by users or their software agents and services, and represent domain knowledge:

**Folder-based user components:**
- **[[Asset trees|mesh-resource.component.asset-tree]]**: Collections of arbitrary files attached to the mesh (in `_assets/` folders)
- **[[mesh-resource.component.slice.working-slice]]**: Draft workspaces for ongoing changes to [[mesh-resource.component.flow]] (in `_working/` folders)

**File-based user components:**
- **README.md files**: User documentation providing context
- **CHANGELOG.md files**: Version history documentation

### System Components

System components are usually created or altered by the [[Weave Process|concept.weave-process]] process rather than direct user modification:

**Folder-based system components:**
- **[[metadataset flows|mesh-resource.component.flow.metadata]]**: Administrative and structural metadata for mesh knops (in `_meta/` folders)
- **[[version|mesh-resource.component.slice.version]]**: Versioned versions of datasets (in `_vN/` folders) are created on weave
- **[[mesh-resource.component.slice.default-slice]]**: updated on weave
- **[[Node handles|mesh-resource.component.knop-handle]]**: Components providing referential indirection for knops as mesh resources (in `_knop-handle/` folders)

**File-based system components:**
- **[[Resource pages|mesh-resource.component.documentation-resource.resource-page]]**: Generated index.html files for human-readable access
- **[[Distribution files|mesh-resource.component.distribution]]**: Data files in various RDF formats

## Physical vs Logical Structure

**Physical Representation:**
- Folder-based components are represented as folders with underscore prefixes (like `_meta/`, `_assets/`)
- File-based components are individual files within mesh knops or other components
- Component folders contain all files and folders that belong to that component

**Logical Function:**
- Components extend the namespace but are terminal (cannot contain other mesh knops or components)
- Components provide specialized functionality: metadata, versioning, referential data, or file attachments
- Components maintain the semantic structure and operational capabilities of the mesh

## Integration with Nodes

Components work in conjunction with mesh knops to create the complete mesh structure:
- Every mesh knop contains at least two components: [[mesh-resource.component.flow.metadata]] and [[mesh-resource.component.knop-handle]]
- [[mesh-resource.knop.payload]] contain a single [[mesh-resource.component.flow.payload]] 
- Any knop may contain asset trees (user files) for bundling or [[concept.weave-process.resource-page-generation]]
