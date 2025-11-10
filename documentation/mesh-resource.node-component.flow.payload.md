---
id: payload-flow
title: payload flow
desc: ''
updated: 1762708072880
created: 1751560483669
---

**payload flows** provide versionable data storage functionality within the semantic mesh architecture. 

## Overview

A payload flow (formerly called a __dataset__ flow) is a series of RDF datasets. Like all flows, each payload flow has snapshots (_default/, _working/, _vN/) that track its evolution over time. 

payload flows are distinct from [[mesh-resource.node-component.flow.node-metadata]]s, which are usually managed by the platform and describe the mesh node itself and its components.

## Purpose

payload flows serve as the primary content containers for [[mesh-resource.node.payload]], providing:

- **Content Storage**: Hold the actual dataset payload that defines the node's content
- **History**: Support multiple versions (snapshots) of the same conceptual dataset
- **Format Diversity**: Provide multiple format distributions (TTL, JSON-LD, etc.)
- **State Management**: Track current, draft, and versioned states of data

## Structure

payload flows organize content through [[flow snapshots|mesh-resource.node-component.flow-snapshot]]:

- `_default/` - Current stable version of the dataset
- `_working/` - Draft/work-in-progress version
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
/test-ns/djradon-bio/_payload-flow          # payload flow
├── _default/                        # default snapshot
│   ├── djradon-bio.ttl             # turtle distribution
│   ├── djradon-bio.jsonld          # json-ld distribution
│   └── index.html                  # snapshot interface
├── _working/                          # draft snapshot
│   ├── djradon-bio.ttl             # draft turtle
│   ├── djradon-bio.jsonld          # draft json-ld
│   └── index.html                  # snapshot interface
└── index.html                      # resource page
```

## Integration

payload flows integrate with other mesh components:

- **metapayload flows**: Provide provenance and management data
- **Asset Trees**: Store associated files and media
- **Resource Pages**: Provide human-readable interfaces
