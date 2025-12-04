---
id: osqi7xn4mw3j9v0kvsoc5uo
title: Why Dont payload Knops Contain Distributions Directly
desc: ''
updated: 1764867799212
created: 1751387201637
---

## Question

Why don't [[mesh-resource.knop.payload]] contain distribution files directly? Why do I need to go to `_default/` to find the actual data?

## Answer

payload knops represent **abstract data collections**, not concrete data instances. This separation provides several important benefits:

### Clear Semantic Distinction

see [[faq.what-is-the-referential-difference-between-a-payload-knop-iri-and-its-payload-flows-iri]]

### Stable Identity

The knop provides a permanent, stable identifier for the semantic data that persists even as the concrete data changes over time. You can always refer to "particular monster data" using `/ns/monsters/` regardless of whether or how many versions exist.

### Temporal Organization

By separating the concept from concrete instances, payload knops can cleanly organize different temporal states:
- `_default/` - current data
- `_working/` - draft changes
- Version folders (e.g., `2025-11-24_0142_07_v1/`, `2025-11-24_0142_08_v2/`) - historical versions
