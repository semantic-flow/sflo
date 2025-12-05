---
id: 0n1lq6aq1gskj46bpcx9h4h
title: version distribution
desc: ''
updated: 1764914216096
created: 1751138751433
---

- each [[mesh-resource.component.slice]] should have one or more [[mesh-resource.component.version-distribution]] [[facet.resource.file]].
- a version's distributions should all contain the same data, just in different syntaxes 

## Distribution Filenaming Per Flow

-  [[mesh-resource.component.flow.reference]], [[mesh-resource.component.flow.metadata]], [[mesh-resource.component.flow.operational-config]] and [[mesh-resource.component.flow.inheritable-config]] have their distributions named with `_ref`, `_meta`, `_config` and `_inheritable-config` respectively
- [[mesh-resource.component.flow.payload]] distributions use the knop slug as the base filename (no "_payload" or "_payload" suffix):

