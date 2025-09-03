---
id: h6ssv16gdyf56gg235dxv85
title: semantic mesh
desc: ''
updated: 1756869568818
created: 1750624002110
---

## Overview

A **semantic mesh** is a [[concept.immutability]] collection of (possibly-versioned) linked-data resources. It organizes these resources in a  [[publishable|concept.publication]] way, such that a mesh can be used as a [[semantic sites|concept.semantic-flow-site]] where every HTTP IRI returns meaningful content.

### Key characteristics

- **Addressable**: Every [[mesh-resource]] has an [[concept.identifier]]; when a mesh is [[published|concept.publication]], every [[mesh-resource]] then gets a globally unique, human-readable IRI
- **Versioned**: Changes are managed through the [[Weave Process|concept.weave-process]] process, and [[mesh-resource.node-component.flow]] are versioned by default
- **Publish-ready**: Can be served directly via GitHub Pages or similar static hosting; or via a local web server like live-server

## Core Concepts

### Mesh Resources

The primary constituents of a mesh are [[mesh-resource.node]]s. Nodes contain their own [[mesh-resource.node-component]]s, and may also contain other nodes. 

#### Mesh Nodes

[[Mesh nodes|mesh-resource.node]] extend [[concept.namespace]]s and serve as containers.

- **[[bare nodes|mesh-resource.node.bare]]**: Empty containers for organizing other mesh nodes
- **[[dataset nodes|mesh-resource.node.dataset]]**: Nodes containing data distributions with optional versioning


#### Node components

[[Node components|mesh-resource.node-component]] help define, support, and systematize nodes.


#### Example Mesh

[[Mesh resources|mesh-resource]] have at least one [[concept.identifier]] and (usually) a [[concept.referent]].

| [[concept.identifier.intramesh]]                      | Semantic Flow resource type                                           | referent                     |
| ----------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------- |
| `ns/`                                                 | [[mesh-resource.node.bare]]                                           | - nothing - (yet!)           |
| `ns/djradon/`                                         | [[mesh-resource.node.reference]]                                      | a person                     |
| `ns/djradon/_node-handle/`                            | [[mesh-resource.node-component.node-handle]]                          | mesh node                    |
| `ns/djradon/_ref-flow/`                               | [[mesh-resource.node-component.flow.reference]]                       | reference flow               |
| `ns/djradon/_ref-flow/_current/`                      | [[mesh-resource.node-component.snapshot-distribution.current]]        | reference flow snapshot      |
| `ns/djradon/index.html`                               | [[mesh-resource.node-component.documentation-resource.resource-page]] | resource page (content)      |
| `ns/djradon/README.md`                                | [[mesh-resource.node-component.documentation-resource.readme]]        | README file (content)        |
| `ns/djradon/picks/`                                   | [[mesh-resource.node.dataset]]                                        | abstract dataset             |
| `ns/djradon/picks/_dataset-flow/`                     | [[mesh-resource.node-component.flow.dataset]]                         | payload dataset series       |
| `ns/djradon/picks/_dataset-flow/_next/`               | [[mesh-resource.node-component.flow-snapshot.next]]                   | concrete payload dataset     |
| `ns/djradon/picks/_dataset-flow/_v1/picks_v1.trig`    | [[mesh-resource.node-component.snapshot-distribution]]                | paylod dataset distribution  |
| `ns/djradon/picks/_node-metadata-flow/`               | abstract meta dataset (flow)                                          | node metadata dataset series |
| `ns/djradon/picks/_node-metadata-flow/_current/`      | concrete meta dataset (snapshot)                                      | node metadata dataset        |
| `ns/djradon/picks/_config-operational-flow/`          | abstract operational config (flow)                                    | operational config series    |
| `ns/djradon/picks/_config-operational-flow/_current/` | concrete operational config (snapshot)                                | operational config           |
| `ns/djradon/picks/_config-inheritable-flow/`          | abstract inheritable config (flow)                                    | inheritable config series    |
| `ns/djradon/picks/_config-inheritable-flow/_current/` | concrete inheritable config (snapshot)                                | inheritable config           |
| `ns/assets/`                                          | asset tree                                                            | collection of assets         |
| `ns/assets/images/`                                   | asset folder                                                          | - not a sf resource -        |
| `ns/assets/images/logo.svg`                           | asset                                                                 | - not a sf resource -        |


Example:
- `ns/` = bare node for organizing content and minting IRIs; refers to itself as a namespace
- `ns/djradon/` = refers to Dave the person (dataset node)
- `ns/djradon/index.html` = resource page about Dave (content)
- `ns/djradon/pics/` = refers to Dave's biographical dataset (dataset node)
- `ns/djradon/pics/_dataset-flow/` = abstract dataset (DatasetSeries) containing Dave's "music picks" data
- `ns/djradon/pics/_dataset-flow/_current/` = current concrete dataset snapshot
- `ns/djradon/pics/_dataset-flow/_v1/picks_v1.trig` = RDF distribution from version 1
- `ns/djradon/_assets/images/headshot.jpg` = an image asset; "attached" to the mesh, but not a mesh resource





#### Folder-based

- **[[mesh-resource.node-component.flow]]** and their [[mesh-resource.node-component.flow-snapshot]]
  - **[[mesh-resource.node-component.flow.node-metadata]]**: System-related administrative and structural metadata for mesh nodes
  - **[[Version datasets|mesh-resource.node-component.flow-snapshot.version]]**: Versioned snapshots of datasets
- **[[next snapshots|mesh-resource.node-component.flow-snapshot.next]]**: Draft workspaces for ongoing changes to versioned datasets
- **[[Node handles|resource.node-component.node-handle]]**: Components that provide referential indirection, allowing references to nodes as mesh resources rather than their referents
- **[[Asset trees|mesh-resource.node-component.asset-tree]]**: Collections of arbitrary files and folders attached to the mesh

#### Files

Terminal [[mesh resources|mesh-resource]] that cannot contain other resources:

- **[[Resource pages|mesh-resource.node-component.documentation-resource.resource-page]]**: index.html files present in every mesh folder after weaving
- **[[Distribution files|mesh-resource.node-component.snapshot-distribution]]**: Data files in various RDF formats
- **README.md and CHANGELOG.md**: Documentation files providing context


## Filesystem Structure

Meshes may be constituted as a set of filesystem [[folder]]s and [[file]]s.

### Folder Mapping

- Mesh nodes correspond physically to [[mesh folders|facet.filesystem.folder]]
- Folder names become namespace segments and IRI path components
- The local [[concept.identifier.intramesh]] for a node matches its containing folder name

### File Organization

- [[Datasets|facet.resource.dataset]] are represented by folders containing at least one distribution file
- Distribution files must be named using the dataset's [[namespace segment|concept.namespace.segment]]
- Resource pages (index.html) should be present in every mesh folder after [[weaving|concept.weave-process]]

### Reserved Names
- All system identifiers begin with an underscore (_)
- Examples: `_assets/`, `_node-metadata-flow/`, `_current`, `_next`

## Logical Structure

### Namespace Extension

- Mesh folders always extend the namespace with a segment corresponding to the folder name
- This creates a hierarchical IRI structure for addressing resources
- Each resource has a unique [[Intramesh|concept.identifier.intramesh]] based on its path and local name

### Containment Rules

- **Mesh nodes** are always containers of components (i.e., at least [[mesh-resource.node-component.flow.node-metadata]] and [[mesh-resource.node-component.node-handle]]) and potentially containers of other nodes 
  - **[[bare nodes|mesh-resource.node.bare]]**: no additional containment requirements
  - 
  - **[[dataset nodes|mesh-resource.node.dataset]]**: must have [[mesh-resource.node-component.flow.dataset]] with at least one distribution
- **Asset tree components**: Cannot contain nodes
- all components can contain 

## Rules & Constraints

### System vs User Boundaries
- **System components**: Generated and managed by the weave process, not intended for user modification
- **User components**: Directly modifiable by users ([[mesh-resource.node-component.flow-snapshot.current]], README.md, CHANGELOG.md)
- The weave process maintains system components and generates missing required flows

### Versioning Requirements
- flow versioning is managed through the [[Versioning|concept.versioning]] system
  - turning versioning on and off is controlled in the [[mesh-resource.node-component.node-config-defaults]]
  - Version history is realized in [[mesh-resource.node-component.flow-snapshot.version]] with numbered version snapshots
  - Version history metadata is kept in the node's [[mesh-resource.node-component.flow.node-metadata]]

### Addressing Requirements
- Every mesh resource must be addressable via its IRI path
- IRIs must return meaningful content when dereferenced
  - [[mesh-resource.node-component.documentation-resource.resource-page]] provide human-readable information for [[facet.filesystem.folder]]-based resources
    - resource pages are always index.html files generated by "on weave" from the [[mesh-resource.node-component.documentation-resource.changelog]] and [[mesh-resource.node-component.documentation-resource.readme]] [[mesh-resource.node-component.documentation-resource]], templates in [[mesh-resource.node-component.asset-tree]] and any scoped template mappings specified in [[mesh-resource.node-component.node-config-defaults]] files 
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
- The repository structure directly maps to the published IRI structure

### Dataset Integration
Meshes support multiple RDF formats and follow [[DCAT v3|related-topics.dcat.vocabulary]] standards for dataset organization. [[Datasets|facet.resource.dataset]] within meshes include both standalone datasets and those embedded as node components.
