---
id: q4jqx5qr6hbp6fo3pfvh042
title: Immutability
desc: ''
updated: 1751857606892
created: 1723213911939
---

Immutable data provides fundamental guarantees that enable reliable, distributed, and concurrent systems. But immutability clashes with document-oriented data the updates slowly and in chunks.

- [[resource.node-component.flow-snapshot.version]] (e.g. in [[folder._vN]]) should be treated as immutable. If you need to refer to the current dataset "as is", you should refer to its corresponding dataset version.
- sometimes, e.g., for compliance reasons, you have to hard delete a resource (as opposed to just tombstoning it, a soft delete), or even modifying it. 
  - [[hashes|sflo.feature.changing-historical-datasets]] can be used to detect mutations

## References

https://s11.no/2013/prov/resources-that-change-state/