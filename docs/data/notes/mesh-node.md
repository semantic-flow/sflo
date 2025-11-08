
## Overview

The primary constituents of a semantic mesh are **mesh nodes**. A node's IRI refers to the its referent, i.e. the real-world or imaginary "thing" which the IRI names.

Nodes are represented "on disk" as [[mesh folders|facet.filesystem.folder]].

Mesh nodes establish conceptual [[namespace segments|concept.namespace.segment]] and can be holonic containers of other mesh nodes. They may also contain [[node components|mesh-resource.node-component]], which are supporting files and conceptual structures.

## Node Types

- [[bare node|mesh-resource.node.bare]] : containers
- [[mesh-resource.node.reference]] : refering containers
- [[payload node|mesh-resource.node.payload]] : dataset containers that refer to their datasets 

## Filesystem Structure

When stored on disk, all mesh nodes:
- are physically represented as folders in the filesystem
- extend the identifier namespace with their folder name
- contain any of their own mesh resources
- may contain other nodes

## Mandatory Components

Every mesh node has these components:

- **[[mesh-resource.node-component.flow.node-metadata]]** ([[folder._node-metadata-flow]]): Centralized metadata for the node
- **[[mesh-resource.node-component.node-handle]]** (`_node-handle/`): Universal marker folder that refers to the parent "as a mesh node", as opposed to "as the name, dataset, or other thing" to which it normally refers; a handle resource page should explain this distinction

