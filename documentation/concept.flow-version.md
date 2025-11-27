---
id: m24m2p2s7iom3rwzvp28kvy
title: Flow Version
desc: ''
updated: 1764268233303
created: 1730373700120
---

Only [[mesh-resource.node-component.flow]] may be versioned. But that effectively means everything important can be versioned.

Each version has an ordinal sequence number (kept in metadata as `sflo:sequenceNumber`, and also part of the snapshot folder name as `_vN`). Snapshot folders follow the format `YYYY-MM-DD_HHMM_SS_vN` (e.g., `2025-11-24_0142_07_v1`).

Versioning is controlled in the [[concept.node-config]].
