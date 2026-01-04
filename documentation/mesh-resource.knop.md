---
id: mesh-knop
title: mesh knop
desc: ''
updated: 1764910114624
created: 1750999795528
---

## Overview

The primary constituents of a semantic mesh are **mesh knops**. A knop's IRI refers to the its referent, i.e. the real-world or imaginary "thing" which the IRI names.

Nodes are represented "on disk" as [[mesh folders|facet.filesystem.folder]].

mesh knops establish conceptual [[namespace segments|concept.namespace.segment]] and can be holonic containers of other mesh knops. They may also contain [[knop components|mesh-resource.component]], which are supporting files and conceptual structures.

## Node Types

- [[bare knop|mesh-resource.knop.bare]] : containers
- [[mesh-resource.knop.reference]] : refering containers
- [[payload knop|mesh-resource.knop.payload]] : dataset containers that refer to their datasets 

## Filesystem Structure

When stored on disk, all mesh knops:
- are physically represented as folders in the filesystem
- extend the identifier namespace with their folder name
- contain any of their own mesh resources
- may contain other knops

## Mandatory Components

Every mesh knop has these components:

- **[[mesh-resource.component.flow.knop-metadata]]** ([[folder._meta]]): Centralized metadata for the knop
- **[[mesh-resource.component.knop-handle]]** (`_knop-handle/`): Universal marker folder that refers to the parent "as a mesh knop", as opposed to "as the name, dataset, or other thing" to which it normally refers; a handle resource page should explain this distinction

