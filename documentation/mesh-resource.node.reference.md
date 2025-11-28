---
id: bxqmsolrgfu4fm16m5acii7
title: reference node
desc: ''
updated: 1764327509431
created: 1755977777704
---

## Definition

A **reference node** is a [[mesh-resource.node]] that represents the (non-dataset) **referent** of the node — i.e., the thing in the world that the node stands for.

## Purpose

* To describe what the node *refers to* (person, place, concept, dataset, etc.).
* To supply human/machine labels, identifiers, and minimal provenance about the referent.
* To differentiate between metadata about the **node itself** (`_meta`) and metadata about the **referent**.

## Typical Contents

### Core Description

What is the node’s referent? This is what the HTML resource page uses to say:

“This is an Organization / Ontology / Rate Plan / Dataset / Whatever.”

* `rdfs:label` (human-readable name of the referent).
* `rdf:type` (classifying what kind of thing the referent is).
* maybe  skos:prefLabel, dcterms:description, owl:sameAs, etc.

### Dataset-level description (if the thing is a dataset)

* Optional provenance (creator, source, temporal scope).
* Optional identifiers (sameAs links, external URIs).
* dcat:Dataset, dcat:distribution, dcterms:issued, dcterms:modified, dcterms:license, etc.

This describes the dataset-as-thing.

### Context / External Perspectives

Links to registries, catalogs, external provenance, ie. alternate descriptions imported from elsewhere.


## Example Snapshot Distribution

```trig
# The referent of the node (the actual person)
<djradon>
    rdf:type foaf:Person ;
    rdfs:label "dj radon" ;
    foaf:mbox <mailto:djradon@example.org> ;
```
