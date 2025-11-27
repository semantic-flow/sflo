---
id: 074yxm151l47n1aak58ggni
title: default snapshot
desc: ''
updated: 1762708072878
created: 1751237726111
---

[[Versioned|facet.flow.versioned]] mode: _default/ is a materialized copy of the latest _vN/.
[[Unversioned|facet.flow.unversioned]] mode: _default/ is the one-and-only dataset
[[facet.flow.deversioned]] mode: [[folder._default]] is the current version of the dataset

The default snapshot provides the most recently published version of a flow's content without relying on symlinks or redirects. It serves as the "general purpose" source that users and external systems can reference, remaining unchanged during active development via the [[mesh-resource.node-component.flow-shot.working-shot]].

If versioning is turned on and nobody has cleaned up old versions, the default snapshot matches the content of the latest versioned snapshot (e.g., `_v3/`) and remains identical to the [[mesh-resource.node-component.flow-shot.working-shot]] until new changes begin. During weaving, the [[mesh-resource.node-component.snapshot-distribution.working]] becomes the new [[mesh-resource.node-component.flow-shot.default-shot]]. If versioning is turned on, the _working content becomes the working version.

This provides a reference point for citations and external links that want the latest information, while allowing ongoing development work to proceed safely in the `_working` dataset without disrupting users of the published data.
