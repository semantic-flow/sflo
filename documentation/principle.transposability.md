---
id: fv43m7jgc5rrqv20pe9enb4
title: Transposability
desc: ''
updated: 1755972667237
created: 1750489919875
---

//TODO: re-verify this ai-generated content

## Overview

Transposability is the ability to:
- move a mesh to a different serving locations without breaking its internal structure. 
- 

A transposable mesh works correctly regardless of which namespace contains it.

## Key Principles

### 1. No Hardcoded BASE URIs

Semantic Flow never hardcodes BASE URIs in RDF distribution files. Instead, it relies on the RDF specification's default behavior where parsers use the document's retrieval URL as the base URI.

**Why this works:**
- When a mesh is served from `github.io/mesh/`, relative URIs resolve relative to that location
- When the same mesh is served from `mysite.com/data/`, relative URIs resolve relative to that location
- The mesh's internal structure remains consistent in both cases

### 2. URI Reference Strategies

- see [[concept.url.reference-path-choices]]

### 3. Publication History Tracking

- see [[concept.publication]]

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

While technically possible, moving parts of a mesh to different parent namespaces should be **discouraged** as it breaks the permanence principle of semantic identifiers. URIs should remain stable over time.

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
2. **Move complete meshes** rather than reorganizing internal structure
3. **Maintain stable namespaces** to preserve identifier permanence
4. **Test transposition** by serving from different locations
5. **Validate RDF** after moving to ensure parser compatibility

Transposability ensures that Semantic Flow meshes remain portable and can be deployed flexibly across different hosting environments while maintaining their semantic integrity.
