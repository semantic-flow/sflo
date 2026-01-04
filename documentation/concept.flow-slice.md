---
id: m24m2p2s7iom3rwzvp28kvy
title: Flow Slice
desc: ''
updated: 1765757688917
created: 1730373700120
---

[[mesh-resource.component.flow]]s are composed of one or more sequential [[mesh-resource.component.slice]]s, which effectively means everything important can be versioned.

Each version has an ordinal sequence number (kept in metadata as `sflo:sequenceNumber`, and also part of the version folder name as `_vN`). Version folders follow the format `YYYY-MM-DD_HHMM_SS_vN` (e.g., `2025-11-24_0142_07_v1`).

Versioning is controlled in the [[concept.knop-config]].
