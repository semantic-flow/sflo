---
id: 0y6p8e594peoult03gobm94
title: metadata flow
desc: ''
updated: 1764910139546
created: 1730660543063
---

A **metadata flow** contains system-related administrative and structural metadata for every [[mesh-resource.knop]], including the versioning data for each knop's flows.

In the filesystem, it exists as a [[folder._meta]] in a [[folder.knop]].

Metadata about a knop's flows' [[mesh-resource.component.slice.version]]s mostly lives here too, eliminating the need to keep separate metadata in the knop component. Also may contain metadata about the assets folder.

## Use of _knop-handle in metadata flows

When metadata flows (or any [[facet.system]] dataset) refer to mesh knops, they'll usually be talking about "the-knop-as-mesh-constituent", so they'll use the knop's [[mesh-resource.component.knop-handle]] identifier

## Recommended vocabulary
