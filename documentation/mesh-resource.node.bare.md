---
id: bare-node
title: bare node
desc: ''
updated: 1760212640468
created: 1751000577920
---

**Bare nodes** are [[mesh-resource.node]]s that contain other mesh nodes. Their [[concept.identifier]]

## Function

- namespace extenders and perhaps organizational containers

**Mandatory Components**: `_node-metadata-flow/` + `_node-handle/`
**Optional Components**: [[mesh-resource.node-component.flow.node-config]], [[mesh-resource.node-component.documentation-resource]]


They are physically represented by [[folder.node]].

## Purpose

- scaffolding, grouping, deferred semantics
- a secondary, optional function is as "semantic contextualizers", but bare nodes don't have any definitive [[concept.referent]] of their own. 
