---
id: 8hmkiyjtsey7z8y5oi5xdxx
title: dataset reference nodes
desc: ''
updated: 1756065117595
created: 1750999795528
---

## Overview

**Dataset reference nodes** (or “data nodes” for short) are [[resource.node.reference]]s that represent and contain an evolvable "payload" dataset in the form of a [[resource.node-component.flow.data]]. 

Because it is evolvable, it gets typed as a [DatasetSeries](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset_Series)it [[concept.identifier.intramesh]]

Its actual data is kept in a [[resource.node-component.flow]]

Its versions are [[datasets|https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset]].

Unlike [[flow snapshots|resource.node-component.flow-snapshot]] which contain concrete data distributions, data nodes serve as conceptual containers that organize and provide identity for data without containing the data directly. I.e., data nodes only contain concrete datasets by virtue of containing [[resource.node-component.flow.data]] (also abstract) and its snapshots, which have concrete distributions.

data nodes are physically represented as [[mesh folders|facet.filesystem.folder]] and correspond to [[namespace segments|concept.namespace.segment]].

## Abstract vs Concrete Data

### Abstract Data Concept (data node)
A data node represents the **idea** or **concept** represented by a dataset:
- `/ns/djradon/bio/` = a biographical dataset about the person djradon
- `/ns/census/` =  the results of a census
- `/ns/weather-stations/` = "the concept of weather station data"
This idea or concept is the referent of the data node's URL. 

The data node provides:
- **Stable identity**: The concept persists even as concrete data changes
- **Organizational structure**

### Data flow (DatasetSeries)

[[resource.node-component.flow.data]] is the single user data flow for a node, realized by snapshots:

- `/ns/monsters/_data-flow/_current/` = the current dataset snapshot
- `/ns/weather-stations/_data-flow/_v3/` = version 3 dataset snapshot

Snapshots contain **distribution files**: the actual data in various formats (e.g., .trig, .jsonld)

## Required Structure

Every data node must contain:

- **[[resource.node-component.flow.node-metadata]]** (`_meta-flow/`): Administrative metadata about the data concept
- **[[resource.node-component.flow.data]]** (`_data-flow/`): dataset data
- **[[Node handle|resource.node-component.node-handle]]** (`_node-handle/`): Referential indirection for the node

## Optional Structure

- **[[Asset trees|resource.node-component.asset-tree]]** (`_assets/`): Attached file collections
- [[resource.node-component.documentation-resource.changelog]] and [[resource.node-component.documentation-resource.readme]]
- [[resource.node-component.node-config-defaults]]

## Key Characteristics

### Not a Dataset

**Important**: A data node does not refer to a specifc RDF graph; it is **not itself a (concrete) dataset**. It represents the abstract concept of a dataset that may evolve over time:
- data nodes are never versioned (only their components are)
- data nodes serve as stable conceptual anchors



### Extensible Container
Like all mesh nodes, data nodes can contain other mesh nodes and components, making them extensible namespace containers.

## Examples

### Unversioned data node
```
ns/monsters/
├── _meta-flow/                 # metadata about the "monsters" data node
├── _node-handle/               # handle for the data node
└── _data-flow/                 # single data flow
    └── _current/               # current dataset snapshot
        ├── monsters.jsonld     # concrete distribution of the current snapshot
        └── monsters.trig
```
