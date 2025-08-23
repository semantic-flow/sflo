---
id: 9el7ivz22xvt8exiz7tj23f
title: Node Config Defaults
desc: 'inheritable default settings used when a node lacks explicit operational config'
updated: 1755898431394
created: 1751646537672
---

## Overview

Node config defaults are inheritable settings that provide baseline behavior for nodes. They are supplied by ancestors (and service/platform) and are resolved by a mechanism similar to that of service config config.

- Inheritance mechanism: see [[concept.mesh.resource.element.flow.config.inheritable]]
- Operational (final) config: see [[concept.mesh.resource.element.flow.config.operational]]
- Folder overview for config flows: see [[concept.mesh.resource.element.flow.config]]

## Common default settings (examples)

- Flow versioning: on/off (whether abstract flows create `_vN/` snapshots on weave)
- Distribution syntaxes: preferred serializations (e.g., TriG, JSON‑LD)
- Resource pages and fragments: enable page/fragment generation; template and stylesheet selection
- Aggregated distributions: on/off for generating top-level rollups
- Rights & provenance defaults: copyright/licensing/attribution/delegation policies (applied at snapshot time)

These defaults apply when a node does not specify the setting in its [[concept.mesh.resource.element.flow.config.operational]]; “most specific wins” from parent → service → platform (see [[concept.mesh.resource.element.flow.config.inheritable]] for precedence).

## Minimal guidance

- Keep defaults lightweight; override at the node only when needed
- Prefer repository‑level templates/css in `_assets/` for consistency (see [[concept.mesh.resource.element.asset-tree]])
- Review defaults when moving/embedding meshes to ensure expected publication behavior
