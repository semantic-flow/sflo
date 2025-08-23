---
id: 0y6p8e594peoult03gobm94
title: metadata flow
desc: ''
updated: 1755926597216
created: 1730660543063
---

A **metadata flow** contains system-related administrative and structural metadata for every [[concept.mesh.resource.node]], including the versioning data for each node's flows.

Physically, it exists as a [[concept.mesh.resource.folder._meta-flow]] in a [[concept.mesh.resource.folder.node]].

Mesh-specific metadata about a node's flows' [[concept.mesh.resource.element.flow-snapshot.version]]s mostly lives here too, eliminating the need to keep separate metadata in the element. Also may contain metadata about the assets folder.

## Use of _node-handle in metadata flows

When metadata flows (or any [[concept.mesh.resource-facet.system]] dataset) refer to mesh nodes, they'll usually be talking about "the-node-as-mesh-constituent", so they'll use the node's [[concept.mesh.resource.element.handle]] identifier

## Recommended vocabulary

