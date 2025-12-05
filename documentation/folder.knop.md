---
id: hp9ckpez0pmuv270sn005gt
title: knop folder
desc: a folder that maps to a mesh knop and extends the namespace
updated: 1764914216058
created: 1751160854174
---

## Definition

A knop folder is any folder that maps to a [[mesh-resource.knop]]. Each knop folder extends the namespace with its name and has a concept IRI that may refer to something. 

- What a “namespace” is: see [[concept.namespace]]
- General knop types and anatomy: see [[mesh-resource.knop]]

## Minimal requirements

Every knop folder must contain a [[_knop-handle/|folder._knop-handle]]

## Node-specific flows (by type)

- [[bare knop|mesh-resource.knop.bare]]: no additional flows 
- [[dataset knop|mesh-resource.knop.payload]]: requires [[_payload/|folder._payload]]

Distributions must live inside flow version folders (e.g., `_default/`, `_working/`, version folders like `2025-11-24_0142_07_v1/`). See [[resource.knop-component.flow]] and [[resource.knop-component.flow-version]].

## Example

```file
/my-knop/                     # knop folder → https://ex.org/my-knop/
├── _knop-handle/             # required
├── _meta/               # required
└── _payload/               # required for dataset knops
