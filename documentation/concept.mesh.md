---
id: h6ssv16gdyf56gg235dxv85
title: semantic mesh
desc: ''
updated: 1752025355019
created: 1750624002110
---

## Overview

A **semantic mesh** is a dereferenceable, possibly-versioned, [[concept.immutability]] collection of semantic data and other resources where every HTTP URL returns meaningful content. It serves as the foundational structure for organizing and publishing semantic web resources through [[semantic sites|concept.semantic-site]].

Key characteristics:
- **Addressable**: Every resource has a unique URL-based identifier
- **Dereferenceable**: All URLs return meaningful content when accessed
- **Versioned**: Changes are managed through the [[Weave Process|concept.weave-process]] process, and [[concept.mesh.resource.element.flow]] are versioned by default
- **Publish-ready**: Can be served directly via GitHub Pages or similar static hosting; or via a local web server like live-server

## Core Concepts

### Mesh Resources

There are two primary categories:

#### Mesh Nodes

[[Mesh nodes|concept.mesh.resource.node]] are the primary structural components, physically represented as [[mesh folders|concept.mesh.resource-facet.folder]]. They extend namespaces and serve as containers.

- **[[Namespace nodes|concept.mesh.resource.node.namespace]]**: Empty containers for organizing other mesh nodes
- **[[Reference nodes|concept.mesh.resource.node.reference]]**: Nodes that refer to external entities (people, concepts, relationships) and contain [[reference flows|concept.mesh.resource.element.flow.reference]]
- **[[Data nodes|concept.mesh.resource.node.data]]**: Nodes containing data distributions with optional versioning


#### Elements

[[Mesh elements|concept.mesh.resource.element]] help define, support, and systematize nodes:

## Folder-based

- **[[concept.mesh.resource.element.flow]]** and their [[concept.mesh.resource.element.flow.snapshot]]
  - **[[concept.mesh.resource.element.flow.metadata]]**: System-related administrative and structural metadata for mesh nodes
  - **[[Version datasets|concept.mesh.resource.element.flow.snapshot.version]]**: Versioned snapshots of datasets
- **[[next snapshots|concept.mesh.resource.element.flow.snapshot.next]]**: Draft workspaces for ongoing changes to versioned datasets
- **[[Node handles|concept.mesh.resource.element.handle]]**: Elements that provide referential indirection, allowing references to nodes as mesh resources rather than their referents
- **[[Asset trees|concept.mesh.resource.element.asset-tree]]**: Collections of arbitrary files and folders attached to the mesh

#### Files

Terminal [[mesh resources|concept.mesh.resource]] that cannot contain other resources:

- **[[Resource pages|concept.mesh.resource.element.documentation-resource.resource-page]]**: index.html files present in every mesh folder after weaving
- **[[Distribution files|concept.mesh.resource.element.flow.snapshot.distribution]]**: Data files in various RDF formats
- **README.md and CHANGELOG.md**: Documentation files providing context


## Physical Structure

### Folder Mapping
- Mesh nodes correspond physically to [[mesh folders|concept.mesh.resource-facet.folder]]
- Folder names become namespace segments and URL path components
- The local [[concept.relative-identifier]] for a node matches its containing folder name

### File Organization
- [[Datasets|concept.mesh.resource-facet.dataset]] are represented by folders containing at least one distribution file
- Distribution files must be named using the dataset's [[namespace segment|concept.namespace.segment]]
- Resource pages (index.html) should be present in every mesh folder after [[weaving|concept.weave-process]]

### Reserved Names
- All reserved folder names begin with an underscore (_)
- Examples: `_assets/`, `_meta-component/`, `_ref-component/`, `_current`, `_next`

## Logical Structure

### Namespace Extension
- Mesh folders always extend the namespace with a segment corresponding to the folder name
- This creates a hierarchical URL structure for addressing resources
- Each resource has a unique [[Relative Identifier|concept.relative-identifier]] based on its path and local name

### Containment Rules
- **Mesh nodes** are always containers of elements (i.e., at least [[concept.mesh.resource.element.flow.metadata]] and [[concept.mesh.resource.folder._handle]]) and potentially containers of other nodes 
  - **namespace nodes**: no additional containment requirements
  - **reference nodes**: must have [[concept.mesh.resource.element.flow.reference]]
  - **data nodes**: must have [[concept.mesh.resource.element.flow.data]] with at least one distributions; and optionally, [[concept.mesh.resource.node.reference]]
- **Assets tree elements**: Cannot contain nodes
- all elements can contain 

## Rules & Constraints

### System vs User Boundaries
- **System elements**: Generated and managed by the weave process, not intended for user modification
- **User elements**: Directly modifiable by users ([[concept.mesh.resource.element.flow.snapshot.current]], README.md, CHANGELOG.md)
- The weave process maintains system elements and generates missing required components

### Versioning Requirements
- flow versioning is managed through the [[Versioning|concept.versioning]] system
  - turning versioning on and off is controlled in the [[concept.mesh.resource.element.node-config-defaults]]
  - Version history is realized in [[concept.mesh.resource.element.flow.snapshot.version]] with numbered version snapshots
  - Version history metadata is kept in the node's [[concept.mesh.resource.element.flow.metadata]]

### Addressing Requirements
- Every mesh resource must be addressable via its URL path
- URLs must return meaningful content when dereferenced
  - [[concept.mesh.resource.element.documentation-resource.resource-page]] provide human-readable information for [[concept.mesh.resource-facet.folder]]-based resources
    - resource pages are always index.html files generated by "on weave" from the [[concept.mesh.resource.element.documentation-resource.changelog]] and [[concept.mesh.resource.element.documentation-resource.readme]] [[concept.mesh.resource.element.documentation-resource]], templates in [[concept.mesh.resource.element.asset-tree]] and any scoped template mappings specified in [[concept.mesh.resource.element.node-config-defaults]] files 
  - [[concept.mesh.resource-facet.file]]

## Integration Points

### Weave Process
The [[Weave Process|concept.weave-process]] process maintains mesh integrity by:
- Checking for required system resources and creating them if missing
- Generating resource pages for changed components
- Managing dataset versioning and metadata
- Ensuring all resources remain addressable and dereferenceable

### Publishing Workflow
- Meshes are designed to be served directly as static sites
- GitHub Pages integration allows immediate publishing after repository updates
- No static site generator required, though resource page generation occurs during weaving
- The repository structure directly maps to the published URL structure

### Dataset Integration
Meshes support multiple RDF formats and follow [[DCAT v3|related-topics.dcat.vocabulary]] standards for dataset organization. [[Datasets|concept.mesh.resource-facet.dataset]] within meshes include both standalone datasets and those embedded as mesh elements.
