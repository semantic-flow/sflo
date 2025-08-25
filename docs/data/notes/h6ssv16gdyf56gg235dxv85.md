
## Overview

A **semantic mesh** is a dereferenceable, possibly-versioned, [[concept.immutability]] collection of semantic data and other resources where every HTTP URL returns meaningful content. It serves as the foundational structure for organizing and publishing semantic web resources through [[semantic sites|concept.semantic-site]].

Key characteristics:
- **Addressable**: Every [[resource]] has a unique [[concept.identifier.intramesh]]; when a mesh is [[published|concept.publication]], every  [[resource]] then gets a globally unique URL
- **Dereferenceable**: All URLs return meaningful content when accessed
- **Versioned**: Changes are managed through the [[Weave Process|concept.weave-process]] process, and [[resource.node-component.flow]] are versioned by default
- **Publish-ready**: Can be served directly via GitHub Pages or similar static hosting; or via a local web server like live-server

## Core Concepts

### Mesh Resources

There are two types of mesh resources: [[resource.node]]s and [[resource.node-component]]s.

#### Mesh Nodes

[[Mesh nodes|resource.node]] are the primary structural components of a mesh, physically represented as [[mesh folders|facet.filesystem.folder]]. They extend namespaces and serve as containers.

- **[[bare nodes|resource.node.bare]]**: Empty containers for organizing other mesh nodes
- **[[data nodes|resource.node.reference.dataset]]**: Nodes containing data distributions with optional versioning


#### Node components

[[Node components|resource.node-component]] help define, support, and systematize nodes:

## Folder-based

- **[[resource.node-component.flow]]** and their [[resource.node-component.flow-snapshot]]
  - **[[resource.node-component.flow.node-metadata]]**: System-related administrative and structural metadata for mesh nodes
  - **[[Version datasets|resource.node-component.flow-snapshot.version]]**: Versioned snapshots of datasets
- **[[next snapshots|resource.node-component.flow-snapshot.next]]**: Draft workspaces for ongoing changes to versioned datasets
- **[[Node handles|resource.node-component.node-handle]]**: Components that provide referential indirection, allowing references to nodes as mesh resources rather than their referents
- **[[Asset trees|resource.node-component.asset-tree]]**: Collections of arbitrary files and folders attached to the mesh

#### Files

Terminal [[mesh resources|resource]] that cannot contain other resources:

- **[[Resource pages|resource.node-component.documentation-resource.resource-page]]**: index.html files present in every mesh folder after weaving
- **[[Distribution files|resource.node-component.snapshot-distribution]]**: Data files in various RDF formats
- **README.md and CHANGELOG.md**: Documentation files providing context


## Physical Structure

### Folder Mapping
- Mesh nodes correspond physically to [[mesh folders|facet.filesystem.folder]]
- Folder names become namespace segments and URL path components
- The local [[concept.identifier.intramesh]] for a node matches its containing folder name

### File Organization
- [[Datasets|facet.resource.dataset]] are represented by folders containing at least one distribution file
- Distribution files must be named using the dataset's [[namespace segment|concept.namespace.segment]]
- Resource pages (index.html) should be present in every mesh folder after [[weaving|concept.weave-process]]

### Reserved Names
- All reserved folder names begin with an underscore (_)
- Examples: `_assets/`, `_meta-flow/`, `_current`, `_next`

## Logical Structure

### Namespace Extension
- Mesh folders always extend the namespace with a segment corresponding to the folder name
- This creates a hierarchical URL structure for addressing resources
- Each resource has a unique [[Intramesh|concept.identifier.intramesh]] based on its path and local name

### Containment Rules
- **Mesh nodes** are always containers of components (i.e., at least [[resource.node-component.flow.node-metadata]] and [[concept.mesh.resource.folder._node-handle]]) and potentially containers of other nodes 
  - **bare nodes**: no additional containment requirements
  - **data nodes**: must have [[resource.node-component.flow.data]] with at least one distribution
- **Asset tree components**: Cannot contain nodes
- all components can contain 

## Rules & Constraints

### System vs User Boundaries
- **System components**: Generated and managed by the weave process, not intended for user modification
- **User components**: Directly modifiable by users ([[resource.node-component.flow-snapshot.current]], README.md, CHANGELOG.md)
- The weave process maintains system components and generates missing required flows

### Versioning Requirements
- flow versioning is managed through the [[Versioning|concept.versioning]] system
  - turning versioning on and off is controlled in the [[resource.node-component.node-config-defaults]]
  - Version history is realized in [[resource.node-component.flow-snapshot.version]] with numbered version snapshots
  - Version history metadata is kept in the node's [[resource.node-component.flow.node-metadata]]

### Addressing Requirements
- Every mesh resource must be addressable via its URL path
- URLs must return meaningful content when dereferenced
  - [[resource.node-component.documentation-resource.resource-page]] provide human-readable information for [[facet.filesystem.folder]]-based resources
    - resource pages are always index.html files generated by "on weave" from the [[resource.node-component.documentation-resource.changelog]] and [[resource.node-component.documentation-resource.readme]] [[resource.node-component.documentation-resource]], templates in [[resource.node-component.asset-tree]] and any scoped template mappings specified in [[resource.node-component.node-config-defaults]] files 
  - [[facet.filesystem.file]]

## Integration Points

### Weave Process
The [[Weave Process|concept.weave-process]] process maintains mesh integrity by:
- Checking for required system resources and creating them if missing
- Generating resource pages for changed resources
- Managing dataset versioning and metadata
- Ensuring all resources remain addressable and dereferenceable

### Publishing Workflow
- Meshes are designed to be served directly as static sites
- GitHub Pages integration allows immediate publishing after repository updates
- No static site generator required, though resource page generation occurs during weaving
- The repository structure directly maps to the published URL structure

### Dataset Integration
Meshes support multiple RDF formats and follow [[DCAT v3|related-topics.dcat.vocabulary]] standards for dataset organization. [[Datasets|facet.resource.dataset]] within meshes include both standalone datasets and those embedded as node components.
