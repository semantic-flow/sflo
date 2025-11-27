---
id: h6ssv16gdyf56gg235dxv85
title: semantic mesh
desc: ''
updated: 1762710407996
created: 1750624002110
---

## Overview

A **semantic mesh** is a [[pseudo-immutable|principle.pseudo-immutability]] collection of (possibly-versioned) linked-data resources. It organizes these resources in a  [[publishable|concept.publication]] way, such that a mesh can be used as a [[semantic site|concept.semantic-flow-site]] where every HTTP IRI returns meaningful content.

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
- **[[reference nodes|mesh-resource.node.reference]]**: Nodes that refer to entities (people, places, concepts, etc.)
- **[[payload nodes|mesh-resource.node.payload]]**: Nodes containing data distributions with optional versioning


#### Node components

[[Node components|mesh-resource.node-component]] help define, support, and systematize nodes.


#### Example Mesh

[[Mesh resources|mesh-resource]] have at least one [[concept.identifier]] and (usually) a [[concept.referent]].

| [[concept.identifier.intramesh]]                        | Semantic Flow resource type                                           | referent                     |
| ------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------- |
| `ns/`                                                   | [[mesh-resource.node.bare]]                                           | - nothing - (yet!)           |
| `ns/djradon/`                                           | [[mesh-resource.node.reference]]                                      | person                       |
| `ns/djradon/_node-handle/`                              | [[mesh-resource.node-component.node-handle]]                          | mesh node                    |
| `ns/djradon/index.html`                                 | [[mesh-resource.node-component.documentation-resource.resource-page]] | resource page (content)      |
| `ns/djradon/README.md`                                  | [[mesh-resource.node-component.documentation-resource.readme]]        | README file (content)        |
| `ns/djradon/CHANGELOG.md`                               | [[mesh-resource.node-component.documentation-resource.changelog]]     | README file (content)        |
| `ns/djradon/_reference-flow/`                           | [[mesh-resource.node-component.flow.reference]]                       | reference flow               |
| `ns/djradon/_reference-flow/_working/`                  | [[mesh-resource.node-component.flow-shot.working-shot]]                | reference flow snapshot      |
| `ns/djradon/_reference-flow/_working/djradon.jsonld`    | [[mesh-resource.node-component.snapshot-distribution.working]]        | reference flow snapshot      |
| `ns/djradon/_node-metadata-flow/`                       | [[mesh-resource.node-component.flow.node-metadata]]                   | node metadata dataset series |
| `ns/djradon/_node-metadata-flow/_default/`              | [[mesh-resource.node-component.flow-shot.default-shot]]                | node metadata dataset        |
| `ns/djradon/picks/`                                     | [[mesh-resource.node.payload]]                                        | abstract dataset             |
| `ns/djradon/picks/_payload-flow/`                       | [[mesh-resource.node-component.flow.payload]]                         | payload dataset series       |
| `ns/djradon/picks/_payload-flow/_v1/`                   | [[mesh-resource.node-component.flow-shot.snapshot]]                | concrete payload dataset     |
| `ns/djradon/picks/_payload-flow/_v1/picks.jsonld `      | [[mesh-resource.node-component.snapshot-distribution.version]]        | paylod dataset distribution  |
| `ns/djradon/picks/_payload-flow/_default/picks.jsonld ` | [[mesh-resource.node-component.snapshot-distribution.default]]        | paylod dataset distribution  |
| `ns/djradon/picks/_config-operational-flow/`            | [[mesh-resource.node-component.flow.node-config.operational]]         | operational config series    |
| `ns/djradon/picks/_config-operational-flow/_v1/`        | [[mesh-resource.node-component.flow-shot.snapshot]]                | operational config           |
| `ns/djradon/picks/_config-inheritable-flow/`            | [[mesh-resource.node-component.flow.node-config.inheritable]]         | inheritable config series    |
| `ns/djradon/picks/_config-inheritable-flow/_default/`   | [[mesh-resource.node-component.flow-shot.default-shot]]                | inheritable config           |
| `ns/assets/`                                            | [[mesh-resource.node-component.asset-tree]]                           | collection of assets         |
| `ns/assets/images/`                                     | asset folder                                                          | - not a sf resource -        |
| `ns/assets/images/logo.svg`                             | asset                                                                 | - not a sf resource -        |


Example:
- `ns/` = bare node for organizing content and minting IRIs; refers to itself as a namespace
- `ns/djradon/` = refers to Dave the person (payload node)
- `ns/djradon/index.html` = resource page about Dave (content)
- `ns/djradon/pics/` = refers to Dave's biographical dataset (payload node)
- `ns/djradon/pics/_payload-flow/` = abstract dataset (DatasetSeries) containing Dave's "music picks" data
- `ns/djradon/pics/_payload-flow/_default/` = current concrete dataset snapshot
- `ns/djradon/pics/_payload-flow/_v1/picks.jsonld` = RDF distribution from version 1
- `ns/djradon/_assets/images/headshot.jpg` = an image asset; "attached" to the mesh, but not a mesh resource





#### Naming Resources

- **[[mesh-resource.node-component.flow]]** and their [[mesh-resource.node-component.flow-shot]]
  - **[[mesh-resource.node-component.flow.node-metadata]]**: System-related administrative and structural metadata for mesh nodes
  - **[[Version datasets|mesh-resource.node-component.flow-shot.snapshot]]**: Versioned snapshots of datasets
- **[[working snapshots|mesh-resource.node-component.flow-shot.working-shot]]**: Draft workspaces for ongoing changes to versioned datasets
- **[[Node handles|mesh-resource.node-component.node-handle]]**: Components that provide referential indirection, allowing references to nodes as mesh resources rather than their referents
- **[[Asset trees|mesh-resource.node-component.asset-tree]]**: Collections of arbitrary files and folders attached to the mesh

#### File Resources

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
- Examples: `_assets/`, `_node-metadata-flow/`, `_default`, `_working`

## Logical Structure

### Namespace Extension

- Mesh folders always extend the namespace with a segment corresponding to the folder name
- This creates a hierarchical IRI structure for addressing resources
- Each resource has a unique [[Intramesh|concept.identifier.intramesh]] based on its path and local name

### Containment Rules

- **Mesh nodes** are always containers of components (i.e., at least [[mesh-resource.node-component.flow.node-metadata]] and [[mesh-resource.node-component.node-handle]]) and potentially containers of other nodes
  - **[[bare nodes|mesh-resource.node.bare]]**: no additional containment requirements
  - **[[reference nodes|mesh-resource.node.reference]]**: must have [[mesh-resource.node-component.flow.reference]]  where the referenced entity can be described
  - **[[payload nodes|mesh-resource.node.payload]]**: must have [[mesh-resource.node-component.flow.payload]] with at least one distribution
- **Asset tree components**: Cannot contain nodes
- all resource folders should contain a [[mesh-resource.node-component.documentation-resource.resource-page]] that makes there IRIs servable/dereferenca
- 

## Rules & Constraints

### System vs User Boundaries
- **System components**: Generated and managed by the weave process, not intended for user modification
- **User components**: Directly modifiable by users ([[mesh-resource.node-component.flow-shot.default-shot]], README.md, CHANGELOG.md)
- The weave process maintains system components and generates missing required flows

### Versioning Requirements
- flow versioning is managed through the [[Flow Version|concept.flow-version]] system
  - turning versioning on and off is controlled in the [[mesh-resource.node-component.node-config-defaults]]
  - Version history is realized in [[mesh-resource.node-component.flow-shot.snapshot]] with numbered version snapshots
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
