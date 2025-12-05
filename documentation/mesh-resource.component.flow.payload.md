---
id: payload-flow
title: payload flow
desc: ''
updated: 1764909854357
created: 1751560483669
---

**payload flows** provide versionable data storage functionality within the semantic mesh architecture. 

## Overview

A payload flow (formerly called a __dataset__ flow) is a series of RDF datasets. Like all flows, each payload flow has versions (_default/, _working/, version folders like `2025-11-24_0142_07_v1/`) that track its evolution over time.

payload flows are distinct from [[mesh-resource.component.flow.metadata]]s, which are usually managed by the platform and describe the mesh knop itself and its components.

## Purpose

payload flows serve as the primary content containers for [[mesh-resource.knop.payload]], providing:

- **Content Storage**: Hold the actual dataset payload that defines the knop's content
- **History**: Support multiple versions (versions) of the same conceptual dataset
- **Format Diversity**: Provide multiple format distributions (TTL, JSON-LD, etc.)
- **State Management**: Track current, draft, and versioned states of data

## Structure

payload flows organize content through [[flow versions|mesh-resource.component.slice]]:

- `_default/` - Current stable version of the dataset
- `_working/` - Draft/work-in-progress version
- Version folders (e.g., `2025-11-24_0142_07_v1/`, `2025-11-24_0142_08_v2/`) - Versioned versions for historical access

Like all [[facet.filesystem.folder]], they should contain an `index.html` [[mesh-resource.component.documentation-resource.resource-page]] -- a human-readable description for the flow.

## Distribution Formats

Each [[flow version|mesh-resource.component.slice]] typically provides multiple format distributions:

- **Trig (.trig)**: Primary RDF serialization
- **JSON-LD (.jsonld)**: JSON-compatible linked data
- **RDF/XML (.xml or .trix)**: XML-based RDF serialization
- **N-Quads (.nq)**: Line-based RDF format

## Example

From the [[semantic mesh example|concept.semantic-mesh.example]]:

```
/test-ns/djradon-bio/_payload          # payload flow
├── _default/                        # default slice
│   ├── djradon-bio.ttl             # turtle distribution
│   ├── djradon-bio.jsonld          # json-ld distribution
│   └── index.html                  # version interface
├── _working/                          # draft version
│   ├── djradon-bio.ttl             # draft turtle
│   ├── djradon-bio.jsonld          # draft json-ld
│   └── index.html                  # version interface
└── index.html                      # resource page
```

## Integration

payload flows integrate with other mesh components:

- **metadata flows**: Provide provenance and management data
- **Asset Trees**: Store associated files and media
- **Resource Pages**: Provide human-readable interfaces
