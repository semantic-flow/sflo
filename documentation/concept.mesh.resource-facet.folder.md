---
id: p3mbdrze0qe8uvko4i16t1s
title: folder resource facet
desc: ''
updated: 1755918030620
created: 1750659145476
---

A mesh when stored in a filesystem is physically structured with mesh folders, which correspond to RDF resources and their [[concept.intramesh-identifier]]
  
When a mesh gets published, the folders also correspond to [[concept.url]]. 

All folder-based resources should contain a [[concept.mesh.resource.element.documentation-resource.resource-page]]


## Types

### System Folders

#### Node Handle Folders

- [[concept.mesh.resource.folder._node-handle]] correspond to the [[concept.mesh.resource.element.handle]]

#### Flow (Abstract Dataset) Folders

- **`_meta-flow/`**
  - correspond to [[concept.mesh.resource.element.flow.metadata]]
  - present in all mesh nodes
  
- **`_data-flow/`**

  - correspond to the [[concept.mesh.resource.element.flow.data]]
  - contain the dataset associated with the [[concept.mesh.resource.node.data]]

#### Snapshot (Concrete Dataset) System Folders

- **`_current/`**

- **`_v1/`, `_v2/`, …**

  - Version snapshot folders that represent [[concept.mesh.resource.element.flow-snapshot]]
  - each holds one or more distribution file (named `<node_ref_vN.ext`).
  - **Fully terminal**—neither user-nodes nor system-folders may live inside.

#### Snapshot User Folders

- **`_next/`**
  - Where edits get made to [[concept.mesh.flow-facet.versioned]]


#### Other User Folders

- **`_assets/`**
  - Holds static user assets (images, CSS, binaries).
  - **Always terminal** - never contains nodes
  - Ignored by the mesh scanner; asset trees carry no flows; any metadata about assets should live in the parent node’s meta flow.
