---
id: namespace
title: Namespace
desc: hierarchical address space formed by folder paths
updated: 1756828146866
created: 1730226356459
---

## Overview

A namespace is the hierarchical address space formed by nesting nodes. Every node extends the namespace with its identifier, which correspond to filesystem folders when the mesh is stored in the filesystem. The resulting path maps directly to the published IRI when appended to the [[concept.namespace.context]]

- Concept vs content IRI semantics: see [[concept.identifier]]
- How intramesh identifiers are resolved: see [[concept.identifier.intramesh]]


## Minimal Example

```file
/ns/                         # bare node → https://ex.org/ns/
└── people/                  # bare node → https://ex.org/ns/people/
    └── alice/               # reference node → https://ex.org/ns/people/alice/
```

- Folder names correspond to [[concept.identifier.intramesh]]s and become namespace segments when [[published|concept.publication]].
- Slash-terminated IRIs identify concepts; file IRIs identify content (see [[concept.identifier]]).

## Publishing Base

The site’s base IRI is determined by the publishing platform (e.g., GitHub Pages or self-hosting with [[product.sflo-host]]). See [[concept.namespace.base]] for user/org vs project page mappings and guidance on avoiding hardcoded bases.
