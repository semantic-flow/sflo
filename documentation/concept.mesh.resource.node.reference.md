---
id: bxqmsolrgfu4fm16m5acii7
title: reference node
desc: ''
updated: 1755978547490
created: 1755977777704
---

## Definition

A **reference node** is a dataset within a mesh node that provides information about the **referent** of the node — i.e., the thing in the world that the node stands for.

**Purpose**

* To declare what the node *refers to* (person, place, concept, dataset, etc.).
* To supply human/machine labels, identifiers, and minimal provenance about the referent.
* To differentiate between metadata about the **node itself** (`_node-metadata-flow`) and metadata about the **referent**.

**Contents (typical minimum)**

* `rdfs:label` (human-readable name of the referent).
* `rdf:type` (classifying what kind of thing the referent is).
* Optional provenance (creator, source, temporal scope).
* Optional identifiers (sameAs links, external URIs).

## Example Snapshot Distribution

```trig
# The referent of the node (the actual person)
<djradon>
    rdf:type foaf:Person ;
    rdfs:label "dj radon" ;
    foaf:mbox <mailto:djradon@example.org> ;
```
