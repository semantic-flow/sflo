---
id: 9j8lhoyb0xkhg926nafgkai
title: data flow
desc: ''
updated: 1755998126876
created: 1751560483669
---

Data flows provide versionable data storage functionality within the semantic mesh architecture. 

## Overview

A data flow (sometimes called a __payload__ flow) is a series of RDF graphs that carry the actual statements about a node’s referent. Whether the node represents a dataset, a person, a character, or any other entity, its data flow is where those facts live. Each data flow has snapshots (_current/, _next/, _vN/) that track its evolution over time. 

Data flows are distinct from metadata flows, which are managed by the platform and describe the mesh resource itself; and configuration flows, which govern behavior.


## Purpose

data flows serve as the primary content containers for mesh nodes, providing:

- **Content Storage**: Hold the actual data payload that defines the node's content
- **History**: Support multiple versions (snapshots) of the same conceptual dataset
- **Format Diversity**: Provide multiple format distributions (TTL, JSON-LD, etc.)
- **State Management**: Track current, draft, and versioned states of data

## Structure

Data flows organize content through [[flow snapshots|mesh-resource.node-component.flow-snapshot]]:

- `_current/` - Current stable version of the dataset
- `_next/` - Draft/work-in-progress version
- `_v1/`, `_v2/`, etc. - Versioned snapshots for historical access

Like all [[facet.filesystem.folder]], they should contain an `index.html` [[mesh-resource.node-component.documentation-resource.resource-page]] -- a human-readable description for the flow.

## Distribution Formats

Each [[flow snapshot|mesh-resource.node-component.flow-snapshot]] typically provides multiple format distributions:

- **Trig (.trig)**: Primary RDF serialization
- **JSON-LD (.jsonld)**: JSON-compatible linked data
- **RDF/XML (.xml or .trix)**: XML-based RDF serialization
- **N-Quads (.nq)**: Line-based RDF format

## Example

From the [[semantic mesh example|concept.semantic-mesh.example]]:

```
/test-ns/djradon-bio/_data-flow          # data flow
├── _current/                        # current snapshot
│   ├── djradon-bio.ttl             # turtle distribution
│   ├── djradon-bio.jsonld          # json-ld distribution
│   └── index.html                  # snapshot interface
├── _next/                          # draft snapshot
│   ├── djradon-bio.ttl             # draft turtle
│   ├── djradon-bio.jsonld          # draft json-ld
│   └── index.html                  # snapshot interface
└── index.html                      # resource page
```

## Integration

data flows integrate with other mesh components:

- **metadata flows**: Provide provenance and management data
- **Asset Trees**: Store associated files and media
- **Resource Pages**: Provide human-readable interfaces
