---
id: ngw89xo9m9jop5b3o32dwwd
title: pseudo-immutability
desc: ''
updated: 1755850422047
created: 1751817577224
---

In a filesystem-based structure like a [[concept.mesh]], you can't really prevent changes. But some things in a mesh should be treated as immutable, like [[concept.mesh.resource.element.flow-snapshot.version]] and [[concept.relative-identifier]].

**Pseudo-immutability** acknowledges that things might be changed, for various reasons:

- accidental changes
- "cleaning up" of data for legal reasons, e.g.: personally-identifiable information (PII) or "the right to be forgotten."
- fixing of typos or other errors
- re-organizing namespaces

If you're updating a dataset, the principle of pseudo-immutability is preserved in that the old data can still exist and be discoverable from the metadata 


**Psuedo-immutability** also acknowledges that for non-atomic data especially, "the next version" is going to keep changing until a checkout or "weave". And that sometime you want the "latest" data for a given resource, and without sophisticated database management (e.g., )


## Mitigations

- metadata can track changes and supply reasons
- tooling can be used to make changes in ways that don't break the API
