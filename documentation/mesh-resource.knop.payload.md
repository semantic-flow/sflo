---
id: payload-knop
title: paylod knop
desc: ''
updated: 1764867799268
created: 1750999795528
---

**Payload knops** are knops with datasets conained in them via [[mesh-resource.component.flow.payload]]. They [[denote|concept.denotation]] their contained payload dataset, and must have a [[mesh-resource.component.flow.reference]] to describe that dataset.

## Overview

**payload knops** are [[mesh-resource.knop.reference]]s that represent and contain an evolvable "payload" dataset in the form of a [[mesh-resource.component.flow.payload]]. 

The payload dataset is kept in the payload knop's [[mesh-resource.component.flow.payload]].

Like all [[mesh-resource.component.flow]]s, because it is evolvable it gets typed as a [DatasetSeries](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset_Series). Its versions are [[datasets|https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset]].

Unlike [[flow versions|mesh-resource.component.slice]] which contain concrete data distributions, payload knops serve as conceptual containers that organize and provide identity for datasets without containing the data directly. I.e., payload knops only contain concrete datasets by virtue of containing a [[mesh-resource.component.flow.payload]] (also abstract) and its versions, which have concrete distributions.

If a knop has a PayloadFlow (i.e., it’s a “payload knop”), then in its ReferenceFlow the knop’s IRI MUST have rdf:type dcat:Dataset.

## Abstract vs Concrete Datasets

### payload knop (highly abstract)

A payload knop represents a dataset as a concept, e.g.:

- `/ns/djradon/bio/` = a biographical dataset about the person djradon
- `/ns/census/` =  the results of a census 
- `/ns/weather-stations/` = a weather stations dataset

The payload knop provides **stable identity**: The dataset persists conceptually even as concrete data changes.
  
### payload flow (abstract)

[[mesh-resource.component.flow.payload]] is the single user payload flow for a knop, realized by versions:

- `/ns/monsters/_payload/_default/` = the default dataset version
- `/ns/weather-stations/_payload/2025-11-24_0142_07_v3/` = version 3 dataset version

Versions contain **distribution files**: the actual data in various formats (e.g., .trig, .jsonld)

### payload flow Version (slightly concrete)

Flow versions are still not actual data, but they denote a specific version of an evolving dataset

### payload flow Version Distributions (concrete)

These are "concrete information resources", i.e. files.


## Required Components

Every payload knop must contain:

- **[[mesh-resource.component.flow.metadata]]** (`_meta/`): Administrative metadata about the data concept
- **[[mesh-resource.component.flow.payload]]** (`_payload/`): dataset data
- **[[Node handle|mesh-resource.component.knop-handle]]** (`_knop-handle/`): Referential indirection for the knop

## Optional Components

- [[mesh-resource.component.flow.reference]]: metadata about the dataset
- [[Asset trees|mesh-resource.component.asset-tree]] (`_assets/`): Attached file collections
- [[mesh-resource.component.documentation-resource.changelog]] and [[mesh-resource.component.documentation-resource.readme]]
- [[concept.knop-config.defaults]]

## Key Characteristics

### Not a Dataset

**Important**: A payload knop is **not itself a (concrete) dataset**. It represents the abstract concept of a dataset that may evolve over time:
- payload knops are never versioned (only their component flows are)
- payload knops serve as stable conceptual anchors

### Extensible Container

Like all mesh knops, payload knops can contain other mesh knops and components, making them extensible namespace containers.

## Examples

### Unversioned payload knop
```
ns/monsters/
├── _meta/                 # metadata about the "monsters" payload knop
├── _knop-handle/               # handle for the payload knop
└── _payload/                 # single payload flow
    └── _default/               # default dataset version
        ├── monsters.jsonld     # concrete distribution of the default version
        └── monsters.trig
```
