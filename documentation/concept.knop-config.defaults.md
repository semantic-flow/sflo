---
id: 9el7ivz22xvt8exiz7tj23f
title: knop config Defaults
desc: >-
  inheritable default settings used when a knop lacks explicit operational
  config
updated: 1764867799191
created: 1751646537672
---

## Overview

knop config defaults are settings that provide baseline behavior for knops. They are supplied by service config and platform config.

- Inheritance mechanism: see [[mesh-resource.component.flow.inheritable-config]]
- Operational config: see [[mesh-resource.component.flow.operational-config]]

## Common default settings (examples)

- Flow versioning: on/off (whether abstract flows create versions on weave)
- Distribution syntaxes: preferred serializations (e.g., TriG, JSON‑LD)
- Resource pages and fragments: enable page/fragment generation; template and stylesheet selection
- Aggregated distributions: on/off for generating top-level rollups

These defaults apply when a knop does not specify the setting in its [[mesh-resource.component.flow.operational-config]]; “most specific wins” from parent → service → platform (see [[mesh-resource.component.flow.inheritable-config]] for precedence).

## Minimal guidance

- Keep defaults lightweight; override at the knop only when needed
- Prefer repository‑level templates/css in `_assets/` for consistency (see [[mesh-resource.component.asset-tree]])
- Review defaults when moving/embedding meshes to ensure expected publication behavior
