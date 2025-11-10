---
id: payload-node
title: paylod node
desc: ''
updated: 1762708072874
created: 1750999795528
---

**Payload nodes** are nodes with datasets conained in them via [[mesh-resource.node-component.flow.payload]]. They [[denote|concept.denotation]] their contained payload dataset, and must have a [[mesh-resource.node-component.flow.reference]] to describe that dataset.

## Overview

**payload nodes** (or “payload nodes” for short) are [[mesh-resource.node.reference]]s that represent and contain an evolvable "payload" dataset in the form of a [[mesh-resource.node-component.flow.payload]]. 

The payload dataset is kept in the payload node's [[mesh-resource.node-component.flow.payload]].

Like all [[mesh-resource.node-component.flow]]s, because it is evolvable it gets typed as a [DatasetSeries](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset_Series). Its snapshots are [[datasets|https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset]].

Unlike [[flow snapshots|mesh-resource.node-component.flow-snapshot]] which contain concrete data distributions, payload nodes serve as conceptual containers that organize and provide identity for datasets without containing the data directly. I.e., payload nodes only contain concrete datasets by virtue of containing a [[mesh-resource.node-component.flow.payload]] (also abstract) and its snapshots, which have concrete distributions.

## Abstract vs Concrete Datasets

### payload node (highly abstract)

A payload node represents a dataset as a concept, e.g.:

- `/ns/djradon/bio/` = a biographical dataset about the person djradon
- `/ns/census/` =  the results of a census 
- `/ns/weather-stations/` = a weather stations dataset

The payload node provides **stable identity**: The dataset persists conceptually even as concrete data changes.
  
### payload flow (abstract)

[[mesh-resource.node-component.flow.payload]] is the single user payload flow for a node, realized by snapshots:

- `/ns/monsters/_payload-flow/_default/` = the default dataset snapshot
- `/ns/weather-stations/_payload-flow/_v3/` = version 3 dataset snapshot

Snapshots contain **distribution files**: the actual data in various formats (e.g., .trig, .jsonld)

### payload flow Snapshot (slightly concrete)

Flow snapshots are still not actual data, but they denote a specific version of an evolving dataset

### payload flow Snapshot Distributions (concrete)

These are "concrete information resources", i.e. files.


## Required Components

Every payload node must contain:

- **[[mesh-resource.node-component.flow.node-metadata]]** (`_node-metadata-flow/`): Administrative metadata about the data concept
- **[[mesh-resource.node-component.flow.payload]]** (`_payload-flow/`): dataset data
- **[[Node handle|mesh-resource.node-component.node-handle]]** (`_node-handle/`): Referential indirection for the node

## Optional Components

- [[mesh-resource.node-component.flow.reference]]: metadata about the dataset
- [[Asset trees|mesh-resource.node-component.asset-tree]] (`_assets/`): Attached file collections
- [[mesh-resource.node-component.documentation-resource.changelog]] and [[mesh-resource.node-component.documentation-resource.readme]]
- [[mesh-resource.node-component.node-config-defaults]]

## Key Characteristics

### Not a Dataset

**Important**: A payload node is **not itself a (concrete) dataset**. It represents the abstract concept of a dataset that may evolve over time:
- payload nodes are never versioned (only their component flows are)
- payload nodes serve as stable conceptual anchors

### Extensible Container

Like all mesh nodes, payload nodes can contain other mesh nodes and components, making them extensible namespace containers.

## Examples

### Unversioned payload node
```
ns/monsters/
├── _node-metadata-flow/                 # metadata about the "monsters" payload node
├── _node-handle/               # handle for the payload node
└── _payload-flow/                 # single payload flow
    └── _default/               # default dataset snapshot
        ├── monsters.jsonld     # concrete distribution of the default snapshot
        └── monsters.trig
```
