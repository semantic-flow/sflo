---
id: namespace-segment
title: namespace segment
desc: a single identifier that extends a mesh namespace
updated: 1756849384921
created: 1750960024104
---

## Definition

A namespace segment is a single "folder resource" identifier that extends the a mesh's namespace. The concatenation of parent identifiers yields the namespace for a node.

- Concept vs content IRI semantics: see [[concept.identifier]]
- How relative identifiers are resolved: see [[concept.identifier.intramesh]]

## Naming (recommended)

- Use camel-case (initial lowercase letter), e.g., `people`, `myProjects`
- Maybe avoid starting segment names names with an underscore (`_`); underscore-prefixed names are used for [[concept.namespace.segment.system]]

These are recommendations based on RDF conventions, not hard rules; sometimes projects have good reasons to diverge.

## Stability

Renaming a segment probably breaks the identifier (IRI) of all contained resources. If you must rename:

- Consider redirect/tombstoning strategies and publication history — see [[concept.publication]]
- Review impacts on inbound references; plan a weave and re-publish cycle
- see also [[feature.handling-renaming]]

## Example

```file
/ns/                         → https://ex.org/ns/
└── datasets/                → https://ex.org/ns/datasets/
    └── census/              → https://ex.org/ns/datasets/census/
```

- Each folder adds exactly one namespace segment
- Folders map directly to slash-terminated concept IRIs (see [[concept.identifier]])
