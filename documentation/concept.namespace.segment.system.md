---
id: h3xucygpf2i6f3u3gkegvlk
title: system segments
desc: underscore-prefixed reserved folder names
updated: 1756869552826
created: 1750962692214
---

System segments are underscore-prefixed folder names reserved by the platform. Prefer not to use `_`-prefixed names for user-defined segments.

This page is the canonical list; see the linked docs for behavior and details.

## Flows (abstract/series)

- [[_node-metadata-flow/|folder._node-metadata-flow]]
- [[_dataset-flow/|folder._dataset-flow]]
- [[_config-operational-flow/|folder._config-operational-flow]]
- [[_config-inheritable-flow/|folder._config-inheritable-flow]]

## Snapshots (concrete)

- [[_current/|folder._default]]
- [[_next/|folder._working]]
- [[_vN/|folder._vN]]

## Other reserved

- [[_node-handle/|folder._node-handle]]
- [[_assets/|folder._assets]]

For IRI semantics: see [[concept.identifier]]. For namespace background: see [[concept.namespace]] and [[concept.namespace.segment]].
