---
id: np4wrgk86b44hnlsjo964nz
title: reference flow
desc: ''
updated: 1755978821798
created: 1755977575920
---

## Definition

A **reference flow** is a dataset series within a mesh node that provides information about the **referent** of the node — i.e., the thing in the world that the node stands for.

**Purpose**

* To describe what the node *refers to*, i.e., its referent (person, place, concept, event, dataset, etc.).
* To supply labels and alternative identifiers for the referent.
* To refer to other descriptive data about the referent.

## Typical Contents

* `rdfs:label` (human-readable name of the referent).
* `rdf:type` (classifying what kind of thing the referent is).
* Optional identifiers (sameAs links, external URIs).

## Example Snapshot Distribution

```trig
# The referent of the node (the actual person)
<djradon>
    rdf:type foaf:Person ;
    rdfs:label "dj radon" ;
    foaf:mbox <mailto:djradon@example.org> ;
```
