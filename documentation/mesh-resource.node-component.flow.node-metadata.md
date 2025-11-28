---
id: 0y6p8e594peoult03gobm94
title: metadata flow
desc: ''
updated: 1764349658928
created: 1730660543063
---

A **metadata flow** contains system-related administrative and structural metadata for every [[mesh-resource.node]], including the versioning data for each node's flows.

In the filesystem, it exists as a [[folder._meta]] in a [[folder.node]].

Mesh-specific metadata about a node's flows' [[mesh-resource.node-component.flow-shot.snapshot]]s mostly lives here too, eliminating the need to keep separate metadata in the node component. Also may contain metadata about the assets folder.

## Use of _node-handle in metadata flows

When metadata flows (or any [[facet.system]] dataset) refer to mesh nodes, they'll usually be talking about "the-node-as-mesh-constituent", so they'll use the node's [[mesh-resource.node-component.node-handle]] identifier

## Recommended vocabulary
