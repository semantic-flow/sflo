---
id: vhywrpw2eemb0kfaxa5xhdk
title: Namespace
desc: 'hierarchical address space formed by folder paths'
updated: 1755850090000
created: 1730226356459
---

## Overview

A namespace is the hierarchical address space formed by folder names (segments). Every folder extends the namespace with its name, and the resulting path maps directly to the published URL.

- Concept vs content URL semantics: see [[concept.url]]
- How relative identifiers are resolved: see [[concept.relative-identifier]]

## Namespace Nodes vs Other Nodes

A [[namespace node|concept.mesh.resource.node.namespace]] is a mesh node whose URL refers to the namespace itself (an organizational container). Other node types:

- [[reference node|concept.mesh.resource.node.reference]]: URL refers to a real-world/conceptual entity; requires a [[reference flow|concept.mesh.resource.element.flow.reference]]
- [[data node|concept.mesh.resource.node.data]]: URL refers to the dataset-as-concept; requires a [[data flow|concept.mesh.resource.element.flow.data]]

For general node anatomy (handle and metadata requirements), see [[concept.mesh.resource.node]].

## Minimal Example

```file
/ns/                         # namespace node → https://ex.org/ns/
└── people/                  # namespace node → https://ex.org/ns/people/
    └── alice/              # reference node → https://ex.org/ns/people/alice/
```

- Folder names become namespace segments.
- Slash-terminated URLs identify concepts; file URLs identify content (see [[concept.url]]).

## Publishing Base

The site’s base URL is determined by the publishing platform (e.g., GitHub Pages). See [[concept.namespace.base]] for user/org vs project page mappings and guidance on avoiding hardcoded bases.
