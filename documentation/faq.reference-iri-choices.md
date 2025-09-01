---
id: s1yduc399adt3ihvnwievrd
title: Reference Iri Choices
desc: ''
updated: 1756307597446
created: 1751240276585
---

RDF supports different, confusingly-named approaches to resource referencing, each with tradeoffs.


## TLDR: **Choosing between approaches:**

- Use **relative-path relative IRIs** for maximum composability when embedding or importing meshes and submeshes
- Use **absolute-path relative IRIs** for clearer namespace context and better support for moving submeshes within the same mesh hierarchy
- Use **absolute IRIs** only for cross-mesh references
- Relative and absolute paths both preserve relationships when moving complete meshes between domains



## Absolute IRI References

Any IRI that has a scheme (e.g., http:) is an **Absolute IRI** 

### Example

This example uses two absolute IRIs, one using the "ex:" prefix for the example.com authority:

```ttl
@prefix ex: <https://example.com/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

# In ns/djradon/_ref-flow/_current/djradon_ref.trig
<https://djradon.github.io/ns/djradon/> a foaf:Person ;
   rdfs:seeAlso ex:djradon/index.html .
```

### Pros

- explicit
  
### Cons
  
-  limits [[principle.transposability]] and [[principle.composability]]
  - e.g., if you moved mesh hosting away from `https://example.com`, the `foaf:Person` and `rdfs:seeAlso` assertions would still refer to the original references
- not ideal if you're:
  - making updates
  - working offline


## Relative IRIs

Any IRI that lacks a scheme (e.g., http:) is resolved against a base IRI following RFC 3986. Such relative IRI references come in three distinct forms:

- Network-path reference — begins with //.
  - Example: //other.org/x → inherits the base’s scheme, e.g. http://other.org/x.

- Absolute-path reference — begins with / but not //.
   - Example: /foo/bar → keeps the base’s scheme and authority, resets the path, e.g. http://example.org/foo/bar.

- Relative-path reference — does not begin with / or //.
   - Example: foo/bar or ../foo → inherits the base’s scheme, authority, and path context, e.g. http://example.org/base/foo/bar.

If no base is specified, an inferred base of the requested scheme and authority is used. **This behaviour is essential to Semantic Flow [[Best Practices|guide.best-practices]].**


### Relative-Path Relative IRIs

- maximum composability

```turtle
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

# In ns/djradon/_ref/djradon_ref.trig
<../../djradon/> a foaf:Person ;          # The document itself
   foaf:knows <../../alice/> ;           # A sibling node in the mesh
   rdfs:seeAlso <../bio/bio.html> .      # A resource page contained in a "bio" node under ../../djradon/
```

#### Pros



#### Cons



### Absolute-Path Relative IRIs

- clearer context
  - `../../../` makes eyes swim
- good intra-mesh transposability
  
```turtle
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

# In ns/djradon/_ref/djradon_ref.trig
</ns/djradon/> a foaf:Person ;
   foaf:knows </ns/alice/> ;          # Clear namespace context
   rdfs:seeAlso </ns/djradon/bio/bio.html> .
```


#### Pros



#### Cons

