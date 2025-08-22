---
id: 074yxm151l47n1aak58ggni
title: current snapshot
desc: ''
updated: 1755852033136
created: 1751237726111
---

The current snapshot represents the latest published version of a dataset's content. It serves as the authoritative source that users and external systems reference, containing the most recent released data while remaining unchanged during active development.

The current snapshot always matches the content of the latest versioned layer (e.g., `_v3/`) and remains identical to the [[concept.mesh.resource.element.flow.snapshot.next]] until new changes begin. During weaving, the `_next` content becomes the new current snapshot and gets snapshotted as the next version, ensuring the current snapshot stays synchronized with the latest stable release.

This provides a reference point for citations and external links that want the latest information, while allowing ongoing development work to proceed safely in the `_next` dataset without disrupting users of the published data.
