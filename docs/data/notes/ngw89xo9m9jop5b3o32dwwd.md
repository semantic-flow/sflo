
In a filesystem-based structure like a [[concept.mesh]], you can't really prevent changes. But some things in a mesh should be treated as immutable, like [[mesh-resource.node-component.flow-snapshot.version]] and [[concept.identifier.intramesh]].

**Pseudo-immutability** acknowledges that things might be changed, for various reasons:

- accidental changes
- "cleaning up" of data for legal reasons, e.g.: personally-identifiable information (PII) or "the right to be forgotten."
- fixing of typos or other errors
- re-organizing namespaces

Applications should deal gracefully, and optionally alert users to improperly mutated data. 


**Pseudo-immutability** also acknowledges that:

- for "draft data" especially, "the next version" is going to keep changing until a "weave" happens (i.e., a new version is minted). 
- sometimes you want the "latest" data for a given resource. Typically, "current" would be a pointer, redirect, or symlink. But given our goal of static hosting, we've decided just to have duplicate files for the "current" flow and the "most recent version" flow. 


## Mitigations

- metadata can track changes and supply reasons for mutation
- hashes can be used to detect mutations
