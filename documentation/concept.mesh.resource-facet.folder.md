---
id: p3mbdrze0qe8uvko4i16t1s
title: folder resource facet
desc: ''
updated: 1752026071386
created: 1750659145476
---

A mesh is structured with mesh folders, which correspond to RDF resources and their [[concept.relative-identifier]]
  
When a mesh gets published, the folders also correspond to [[concept.url]]. 

All folder-based resources should contain a [[concept.mesh.resource.element.documentation-resource.resource-page]]


## Types

### System Folders

#### Handle Folders

- [[concept.mesh.resource.folder._handle]] correspond to the [[concept.mesh.resource.element.handle]]

#### Abstract Dataset Folders

- **`_meta-component/`**
  - correspond to [[concept.mesh.resource.element.flow.metadata]]
  - present in mesh nodes and [[concept.mesh.resource.element.asset-tree]]

- **`_ref-component/`**

  - correspond to the [[concept.mesh.resource.node.reference]]
  - Contains the **referent data** for [[reference-node|concept.mesh.resource.node.reference]] and optionally [[concept.mesh.resource.node.data]] (i.e., triples that say things about the thing the node represents).

- **`_data-component/`**

  - correspond to the [[concept.mesh.resource.element.flow.data]]
  - contain the dataset associated with the [[concept.mesh.resource.node.data]]

#### Concrete Dataset Folders

- **`current/`**

- **`_v1/`, `_v2/`, …**

  - Version snapshot folders that represent [[concept.mesh.resource.element.flow.snapshot]]
  - each holds one or more distribution file (named `<node_ref_vN.ext`).
  - **Fully terminal**—neither user-nodes nor system-folders may live inside.

### User Mesh Folders

- **`_next`**
  - Where edits get made to [[concept.mesh.flow-facet.versioned]]


- **`_assets/`**
  - Holds static user assets (images, CSS, binaries).
  - **Always terminal** - never contains nodes
  - Except for its `_meta` folder, is ignored by the mesh scanner.

## Rejected options

- directories: longer to type and most people just say folders
- URLs/IRIs: a mesh is local-first, and we don't use the "file:// schema" so it
  doesn't make sense to call these things URLs
- folder names are used for identifiers, but identifiers are contextualized with
  their containing path. if you're not talking about the whole path, it's really
  just a folder.
