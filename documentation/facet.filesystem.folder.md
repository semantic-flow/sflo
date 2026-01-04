---
id: p3mbdrze0qe8uvko4i16t1s
title: folder resource facet
desc: ''
updated: 1764914216061
created: 1750659145476
---

A mesh when stored in a filesystem is physically structured with mesh folders, which correspond to RDF resources and their [[concept.identifier.intramesh]]
  
When a mesh gets published, the folders also correspond to [[concept.identifier]]. 

All folder-based resources should contain a [[mesh-resource.component.documentation-resource.resource-page]]


## Types

### System Folders

#### Node Handle Folders

- [[concept.mesh.resource.folder._knop-handle]] correspond to the [[mesh-resource.component.knop-handle]]

#### Flow (Abstract Dataset) Folders

- **`_meta/`**
  - correspond to [[mesh-resource.component.flow.metadata]]
  - present in all mesh knops
  
- **`_payload/`**

  - correspond to the [[mesh-resource.component.flow.dataset]]
  - contain the dataset associated with the [[mesh-resource.knop.payload]]

#### Version (Concrete Dataset) System Folders

- **`_default/`**

- **Version folders** (format: `YYYY-MM-DD_HHMM_SS_vN/`, e.g., `2025-11-24_0142_07_v1/`, `2025-11-24_0142_08_v2/`, …)

  - version folders that represent [[mesh-resource.component.slice.version]]
  - each holds one or more distribution file
  - **Fully terminal**—neither user-knops nor system-folders may live inside.

#### Version User Folders

- **`_next/`**
  - Where edits get made to [[facet.flow.versioned]]


#### Other User Folders

- **`_assets/`**
  - Holds static user assets (images, CSS, binaries).
  - **Always terminal** - never contains knops
  - Ignored by the mesh scanner; asset trees carry no flows; any metadata about assets should live in the parent knop’s meta flow.
