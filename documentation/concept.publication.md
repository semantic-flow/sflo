---
id: publication
title: publication
desc: ''
updated: 1756769521286
created: 1751240385918
---

- A mesh is "published" when it becomes accessible by using an absolute URL, (e.g., via a web browser). 


## Publication History Tracking

The inferred publication locations can be tracked to maintain a history of where a node has been published, which aids in citation consistency and discovery:

```turtle
# In _flow/ metadata
<_node-handle> mesh:publishedAt <https://myorganization.github.io/data-mesh/ns/djradon/> ;
          mesh:previousPublications ( 
            <https://djradon.github.io/mesh/ns/djradon/>
            <https://oldsite.com/research/ns/djradon/>
          ) ;
```

This allows external citations to find resources even after they've been moved, and provides a clear provenance trail.
