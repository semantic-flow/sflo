---
id: 7qo569nzfk3l8yo1ah6erb2
title: Namespace Segment
desc: 'a single folder name that extends the namespace path'
updated: 1755851172247
created: 1750960024104
---

## Definition

A namespace segment is a single folder name that extends the namespace (URL) path. The concatenation of folder names yields the full namespace path for a node.

- Concept vs content URL semantics: see [[concept.url]]
- How relative identifiers are resolved: see [[concept.relative-identifier]]

## Naming (recommended)

- Use kebab-case (lowercase letters, digits, hyphens), e.g., `people`, `my-projects`
- Avoid spaces and uppercase to reduce churn in URLs
- Maybe avoid starting segment names names with an underscore (`_`); underscore-prefixed names are used for [[concept.namespace.segment.system]]

These are recommendations, not hard rules; sometimes projects have good reasons to diverge.

## Stability

Renaming a segment probably breaks the identifier (URL) of all contained resources. If you must rename:

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
- Folders map directly to slash-terminated concept URLs (see [[concept.url]])
