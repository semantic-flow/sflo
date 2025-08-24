---
id: 074yxm151l47n1aak58ggni
title: current snapshot
desc: ''
updated: 1755971661627
created: 1751237726111
---

The current snapshot represents the latest published version of a dataset's content. It serves as the authoritative source that users and external systems reference, containing the most recent released data while remaining unchanged during active development.

If versioning is turned on and nobody has cleaned up old versions, the current snapshot matches the content of the latest versioned snapshot (e.g., `_v3/`) and remains identical to the [[resource.element.flow-snapshot.next]] until new changes begin. During weaving, the `_next` content becomes the new current snapshot. If versioning is turned on, the _next content becomes the next version.

This provides a reference point for citations and external links that want the latest information, while allowing ongoing development work to proceed safely in the `_next` dataset without disrupting users of the published data.
