---
id: 0n1lq6aq1gskj46bpcx9h4h
title: version distribution
desc: ''
updated: 1762839680694
created: 1751138751433
---

- each [[mesh-resource.component.flow-slice]] should have one or more [[mesh-resource.knop-component.version-distribution]] [[file]].
- a version's distributions should all contain the same data, just in different syntaxes 

## Distribution Filenaming Per Flow

-  [[mesh-resource.knop-component.flow.reference]], [[mesh-resource.knop-component.flow.metadata]], [[mesh-resource.knop-component.flow.operational-config]] and [[mesh-resource.knop-component.flow.inheritable-config]] have their distributions named with `_ref`, `_meta`, `_config` and `_inheritable-config` respectively
- [[mesh-resource.knop-component.flow.payload]] distributions use the knop slug as the base filename (no "_data" or "_payload" suffix):

