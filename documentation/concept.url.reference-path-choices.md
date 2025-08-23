---
id: s1yduc399adt3ihvnwievrd
title: Reference Path Choices
desc: ''
updated: 1751750033096
created: 1751240276585
---


RDF supports different approaches for resource referencing, each with tradeoffs:

## Relative URLs

- maximum composability
```turtle
# In ns/djradon/_ref/djradon_ref.trig
<> a foaf:Person ;                    # The document itself
   foaf:knows <../alice/> ;           # Another node in the mesh
   rdfs:seeAlso <bio/bio.html> .   # A resource page
```

## Absolute paths

- clearer context
  - `../../../` makes eyes swim
- good intra-mesh transposability
  
```turtle
# In ns/djradon/_ref/djradon_ref.trig
<> a foaf:Person ;
   foaf:knows </ns/alice/> ;          # Clear namespace context
   rdfs:seeAlso </ns/djradon/bio/bio.html> .
```

**Fully qualified URIs** 

- explicit but limits [[principle.transposability]] and [[principle.composability]]

```turtle
# In ns/djradon/_ref/djradon_ref.trig
<> a foaf:Person ;
   foaf:knows <https://example.com/mesh/ns/alice/> ;
   rdfs:seeAlso <https://example.com/mesh/ns/djradon/bio/bio.html> .
```

**Choosing between approaches:**
- Use **relative URIs** for maximum composability when embedding or importing meshes and submeshes
- Use **absolute paths** for clearer namespace context and better support for moving submeshes within the same mesh hierarchy
- Use **fully qualified URLs** only for cross-mesh references
- Relative and absolute paths both preserve relationships when moving complete meshes between domains