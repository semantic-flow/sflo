---
id: 8hmkiyjtsey7z8y5oi5xdxx
title: data node
desc: ''
updated: 1755907072239
created: 1750999795528
---

## Overview

**Data nodes** are [[mesh nodes|resource.node]] that represent a data concept, have an abstract "payload" dataset in the form of an [[resource.element.flow.data]] (an [[resource.element.flow]]). The node data flow is in turn instantiated by conceptual [[resource.element.flow-snapshot]]s that represent the data's evolution and current state.

Unlike [[dataset elements|resource.element.flow-snapshot]] which contain concrete data distributions, data nodes serve as conceptual containers that organize and provide identity for data without containing the data directly. I.e., Data nodes only contain concrete datasets by virtue of containing [[resource.element.flow.data]] (also abstract) and its snapshots, which have concrete distributions.

Data nodes are physically represented as [[mesh folders|facet.filesystem.folder]] and correspond to [[namespace segments|concept.namespace.segment]].

## Abstract vs Concrete Data

### Abstract Data Concept (Data Node)
A data node represents the **idea** or **concept** represented by a dataset:
- `/ns/djradon/bio/` = a biographical dataset about the person djradon
- `/ns/census/` =  the results of a census
- `/ns/weather-stations/` = "the concept of weather station data"
This idea or concept is the referent of the data node's URL. 

The data node provides:
- **Stable identity**: The concept persists even as concrete data changes
- **Organizational structure**

### Data flow (DatasetSeries)

[[resource.element.flow.data]] is the single user data flow for a node, realized by snapshots:

- `/ns/monsters/_data-flow/_current/` = the current dataset snapshot
- `/ns/weather-stations/_data-flow/_v3/` = version 3 dataset snapshot

Snapshots contain **distribution files**: the actual data in various formats (e.g., .trig, .jsonld)

## Required Structure

Every data node must contain:

- **[[resource.element.flow.node-metadata]]** (`_meta-flow/`): Administrative metadata about the data concept
- **[[resource.element.flow.data]]** (`_data-flow/`): dataset data
- **[[Node handle|resource.element.node-handle]]** (`_node-handle/`): Referential indirection for the node

## Optional Structure

- **[[Asset trees|resource.element.asset-tree]]** (`_assets/`): Attached file collections
- [[resource.element.documentation-resource.changelog]] and [[resource.element.documentation-resource.readme]]
- [[resource.element.node-config-defaults]]

## Key Characteristics

### Not a Dataset

**Important**: A data node does not refer to a specifc RDF graph; it is **not itself a (concrete) dataset**. It represents the abstract concept of a dataset that may evolve over time:
- Data nodes are never versioned (only their elements are)
- Data nodes serve as stable conceptual anchors



### Extensible Container
Like all mesh nodes, data nodes can contain other mesh nodes and elements, making them extensible namespace containers.

## Examples

### Unversioned Data Node
```
ns/monsters/
├── _meta-flow/                 # metadata about the "monsters" data node
├── _node-handle/               # handle for the data node
└── _data-flow/                 # single data flow
    └── _current/               # current dataset snapshot
        ├── monsters.jsonld     # concrete distribution of the current snapshot
        └── monsters.trig
```
