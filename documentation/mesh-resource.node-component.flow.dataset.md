---
id: dataset-flow
title: dataset flow
desc: ''
updated: 1756869950164
created: 1751560483669
---

**Dataset flows** provide versionable data storage functionality within the semantic mesh architecture. 

## Overview

A dataset flow (sometimes called a __payload__ flow) is a series of RDF datasets. Like all flows, each dataset flow has snapshots (_current/, _next/, _vN/) that track its evolution over time. 

Dataset flows are distinct from [[mesh-resource.node-component.flow.node-metadata]]s, which are usually managed by the platform and describe the mesh node itself and its components.


## Purpose

Dataset flows serve as the primary content containers for [[mesh-resource.node.dataset]], providing:

- **Content Storage**: Hold the actual dataset payload that defines the node's content
- **History**: Support multiple versions (snapshots) of the same conceptual dataset
- **Format Diversity**: Provide multiple format distributions (TTL, JSON-LD, etc.)
- **State Management**: Track current, draft, and versioned states of data

## Structure

dataset flows organize content through [[flow snapshots|mesh-resource.node-component.flow-snapshot]]:

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
/test-ns/djradon-bio/_dataset-flow          # dataset flow
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

dataset flows integrate with other mesh components:

- **metadataset flows**: Provide provenance and management data
- **Asset Trees**: Store associated files and media
- **Resource Pages**: Provide human-readable interfaces
