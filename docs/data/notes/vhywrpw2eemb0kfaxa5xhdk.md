
## Overview

A namespace is the hierarchical address space formed by folder names (segments). Every folder extends the namespace with its name, and the resulting path maps directly to the published URL.

- Concept vs content URL semantics: see [[concept.identifier]]
- How intramesh identifiers are resolved: see [[concept.identifier.intramesh]]

## Node Types

A [[bare node|resource.node.bare]] is a mesh node whose URL refers to the namespace itself (an organizational container). The other node type is:

- [[data node|resource.node.reference.dataset]]: URL refers to the node’s referent (real-world entity or dataset concept) and has a single [[data flow|resource.node-component.flow.data]].

For general node anatomy (handle and metadata requirements), see [[resource.node]].

## Minimal Example

```file
/ns/                         # bare node → https://ex.org/ns/
└── people/                  # bare node → https://ex.org/ns/people/
    └── alice/              # data node → https://ex.org/ns/people/alice/
```

- Folder names become namespace segments.
- Slash-terminated URLs identify concepts; file URLs identify content (see [[concept.identifier]]).

## Publishing Base

The site’s base URL is determined by the publishing platform (e.g., GitHub Pages or self-hosting with [[product.sflo-host]]). See [[concept.namespace.base]] for user/org vs project page mappings and guidance on avoiding hardcoded bases.
