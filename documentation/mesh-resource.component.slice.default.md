---
id: 074yxm151l47n1aak58ggni
title: default slice
desc: ''
updated: 1765763442617
created: 1751237726111
---


[[Versioned|facet.flow.versioned]] mode: _default/ is a copy of the most recent [[mesh-resource.component.slice.version]].
[[Unversioned|facet.flow.unversioned]] mode: _default/ is the one-and-only non-working dataset
[[facet.flow.deversioned]] mode: [[folder._default]] is the current version of the dataset

The default slice provides the most recently published version of a flow's content without relying on symlinks or redirects. It serves as the "general purpose" source that users and external systems can reference, remaining unchanged during active development via the [[folder._working]].

If versioning is turned on and nobody has cleaned up old versions, the default slice matches the content of the latest versioned version (e.g., `2025-11-24_0142_07_v3/`) and remains identical to the [[folder._working]] until new changes begin. During weaving, the [[mesh-resource.component.version-distribution.working]] becomes the new [[mesh-resource.component.slice.default]]. If versioning is turned on, the _working content becomes the working slice.

This provides a reference point for citations and external links that want the latest information, while allowing ongoing development work to proceed safely in the `_working` dataset without disrupting users of the published data.
