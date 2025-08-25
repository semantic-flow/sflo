
A **metadata flow** contains system-related administrative and structural metadata for every [[resource.node]], including the versioning data for each node's flows.

In the filesystem, it exists as a [[folder._node-metadata-flow]] in a [[folder.node]].

Mesh-specific metadata about a node's flows' [[resource.node-component.flow-snapshot.version]]s mostly lives here too, eliminating the need to keep separate metadata in the node component. Also may contain metadata about the assets folder.

## Use of _node-handle in metadata flows

When metadata flows (or any [[facet.system]] dataset) refer to mesh nodes, they'll usually be talking about "the-node-as-mesh-constituent", so they'll use the node's [[resource.node-component.node-handle]] identifier

## Recommended vocabulary
