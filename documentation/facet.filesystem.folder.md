---
id: p3mbdrze0qe8uvko4i16t1s
title: folder resource facet
desc: ''
updated: 1764268373433
created: 1750659145476
---

A mesh when stored in a filesystem is physically structured with mesh folders, which correspond to RDF resources and their [[concept.identifier.intramesh]]
  
When a mesh gets published, the folders also correspond to [[concept.identifier]]. 

All folder-based resources should contain a [[mesh-resource.node-component.documentation-resource.resource-page]]


## Types

### System Folders

#### Node Handle Folders

- [[concept.mesh.resource.folder._node-handle]] correspond to the [[mesh-resource.node-component.node-handle]]

#### Flow (Abstract Dataset) Folders

- **`_node-metadata-flow/`**
  - correspond to [[mesh-resource.node-component.flow.node-metadata]]
  - present in all mesh nodes
  
- **`_dataset-flow/`**

  - correspond to the [[mesh-resource.node-component.flow.dataset]]
  - contain the dataset associated with the [[mesh-resource.node.payload]]

#### Snapshot (Concrete Dataset) System Folders

- **`_default/`**

- **Snapshot folders** (format: `YYYY-MM-DD_HHMM_SS_vN/`, e.g., `2025-11-24_0142_07_v1/`, `2025-11-24_0142_08_v2/`, …)

  - Version snapshot folders that represent [[mesh-resource.node-component.flow-shot.snapshot]]
  - each holds one or more distribution file
  - **Fully terminal**—neither user-nodes nor system-folders may live inside.

#### Snapshot User Folders

- **`_next/`**
  - Where edits get made to [[facet.flow.versioned]]


#### Other User Folders

- **`_assets/`**
  - Holds static user assets (images, CSS, binaries).
  - **Always terminal** - never contains nodes
  - Ignored by the mesh scanner; asset trees carry no flows; any metadata about assets should live in the parent node’s meta flow.
