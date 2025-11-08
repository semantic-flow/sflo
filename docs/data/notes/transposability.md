
## Overview

There are two types of mesh transposability:

- **[[Host transposability|principle.transposability.host]]** is the ability to move a [[concept.mesh]] to different serving locations without breaking its internal structure; i.e., A transposable mesh works correctly regardless of which [[concept.namespace.context]] contains it.
- **[[Intramesh transposability|principle.transposability.intramesh]]** is the ability to move a [[concept.mesh.sub]] to a different part of the mesh

Both types of transposability rely on the use of an [[concept.implied-rdf-base]] and the use of [[relative identifier|concept.identifier.intramesh.relative]]s for intramesh references.

## Key Principles

### 1. No Hardcoded BASE URIs

Semantic Flow never specifies BASE URIs in RDF distribution files. Instead, it relies on the RDF specification's defined behavior for situations where "no base URI is embedded and the representation is not encapsulated within some other entity": parsers use the document's retrieval IRI as the base URI. 

### 2. URI Reference Strategies

- use [[concept.identifier.intramesh]] identifiers for internal references, see [[faq.reference-iri-choices]]


## Transposition Scenarios

### Moving Complete Meshes

A complete mesh can be moved between repos, accounts, or hosting providers:

```bash
# Original location
https://djradon.github.io/mesh/

# New location after moving repo
https://myorganization.github.io/data-mesh/

# Or new hosting provider
https://mysite.com/semantic-data/
```

All internal relationships continue to work because they resolve relative to the new serving location.

### Moving Submeshes Within Hierarchy

While technically possible, moving parts of a mesh to different [[concept.namespace]]s is **discouraged** as it breaks the permanence principle of semantic identifiers. IRIs should remain stable over time.

Example of what to avoid:
```bash
# Discouraged: moving bio from one parent to another
ns/djradon/projects/bio/ → ns/djradon/bio/
```

This changes the permanent identifier for the bio resource and may break external references.

## Implementation Benefits

### No Build Step Required

Meshes work directly when served from any static file server:
- GitHub Pages
- Netlify  
- Apache/Nginx
- Local file system

### Standards Compliance

Transposability leverages standard RDF parsing behavior rather than custom mechanisms, ensuring compatibility with existing RDF tools and libraries.

## Best Practices

1. **Use relative URIs** for all intra-mesh references
2. **Avoid reorganizing internal structure**: because mesh structure determines namespaces, to maintain stable namespaces and preserve identifier permanence, nodes should not be moved around once published
3. **Test transposition** by serving from different locations
4. **Validate RDF** after moving to ensure parser compatibility

