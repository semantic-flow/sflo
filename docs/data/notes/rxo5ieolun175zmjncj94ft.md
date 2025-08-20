

## Publication History Tracking

The inferred publication locations can be used to maintain a history of where a mesh has been published, which aids in citation consistency and discovery:

```turtle
# In _flow/ metadata
<_handle> sf:publishedAt <https://myorganization.github.io/data-mesh/ns/djradon/> ;
          sf:previousPublications ( 
            <https://djradon.github.io/mesh/ns/djradon/>
            <https://oldsite.com/research/ns/djradon/>
          ) ;
          sf:gitRemote <https://github.com/myorganization/data-mesh.git> ;
          sf:movedFrom <https://github.com/djradon/mesh.git> .
```

This allows external citations to find resources even after they've been moved, and provides a clear provenance trail.