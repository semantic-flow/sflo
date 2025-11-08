---
id: dataset-node
title: dataset node
desc: ''
updated: 1762624520798
created: 1750999795528
---

**Dataset nodes** are nodes with datasets conained in them via [[mesh-resource.node-component.flow.dataset]]. They [[denote|concept.denotation]] their contained payload dataset, and must have a [[mesh-resource.node-component.flow.reference]] to describe that dataset.

## Overview

**Dataset nodes** (or “dataset nodes” for short) are [[mesh-resource.node.reference]]s that represent and contain an evolvable "payload" dataset in the form of a [[mesh-resource.node-component.flow.dataset]]. 

The payload dataset is kept in the dataset node's [[mesh-resource.node-component.flow.dataset]].

Like all [[mesh-resource.node-component.flow]]s, because it is evolvable it gets typed as a [DatasetSeries](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset_Series). Its snapshots are [[datasets|https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset]].

Unlike [[flow snapshots|mesh-resource.node-component.flow-snapshot]] which contain concrete data distributions, dataset nodes serve as conceptual containers that organize and provide identity for datasets without containing the data directly. I.e., dataset nodes only contain concrete datasets by virtue of containing a [[mesh-resource.node-component.flow.dataset]] (also abstract) and its snapshots, which have concrete distributions.

## Abstract vs Concrete Datasets

### Dataset Node (highly abstract)

A dataset node represents a dataset as a concept, e.g.:

- `/ns/djradon/bio/` = a biographical dataset about the person djradon
- `/ns/census/` =  the results of a census 
- `/ns/weather-stations/` = a weather stations dataset

The dataset node provides **stable identity**: The dataset persists conceptually even as concrete data changes.
  
### Dataset Flow (abstract)

[[mesh-resource.node-component.flow.dataset]] is the single user dataset flow for a node, realized by snapshots:

- `/ns/monsters/_dataset-flow/_current/` = the current dataset snapshot
- `/ns/weather-stations/_dataset-flow/_v3/` = version 3 dataset snapshot

Snapshots contain **distribution files**: the actual data in various formats (e.g., .trig, .jsonld)

### Dataset Flow Snapshot (slightly concrete)

Flow snapshots are still not actual data, but they denote a specific version of an evolving dataset

### Dataset Flow Snapshot Distributions (concrete)

These are "concrete information resources", i.e. files.


## Required Components

Every dataset node must contain:

- **[[mesh-resource.node-component.flow.node-metadata]]** (`_node-metadata-flow/`): Administrative metadata about the data concept
- **[[mesh-resource.node-component.flow.dataset]]** (`_dataset-flow/`): dataset data
- **[[Node handle|mesh-resource.node-component.node-handle]]** (`_node-handle/`): Referential indirection for the node

## Optional Components

- [[mesh-resource.node-component.flow.reference]]: metadata about the dataset
- [[Asset trees|mesh-resource.node-component.asset-tree]] (`_assets/`): Attached file collections
- [[mesh-resource.node-component.documentation-resource.changelog]] and [[mesh-resource.node-component.documentation-resource.readme]]
- [[mesh-resource.node-component.node-config-defaults]]

## Key Characteristics

### Not a Dataset

**Important**: A dataset node is **not itself a (concrete) dataset**. It represents the abstract concept of a dataset that may evolve over time:
- dataset nodes are never versioned (only their component flows are)
- dataset nodes serve as stable conceptual anchors

### Extensible Container

Like all mesh nodes, dataset nodes can contain other mesh nodes and components, making them extensible namespace containers.

## Examples

### Unversioned dataset node
```
ns/monsters/
├── _node-metadata-flow/                 # metadata about the "monsters" dataset node
├── _node-handle/               # handle for the dataset node
└── _dataset-flow/                 # single dataset flow
    └── _current/               # current dataset snapshot
        ├── monsters.jsonld     # concrete distribution of the current snapshot
        └── monsters.trig
```
