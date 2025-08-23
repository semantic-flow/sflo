---
id: 074yxm151l47n1aak58ggni
title: current snapshot
desc: ''
updated: 1755919792899
created: 1751237726111
---

The current snapshot represents the latest published version of a dataset's content. It serves as the authoritative source that users and external systems reference, containing the most recent released data while remaining unchanged during active development.

After a weave, `_current/` equals the content of the latest versioned snapshot (e.g., `_v3/`). `_current/` is stable and should not be edited directly. `_next/` is the mutable working area; immediately after a weave it may be identical to `_current/`, but it is expected to diverge as edits are made. During weaving, the `_next/` content is promoted to `_current/`, and if versioning is enabled a new `_vN/` snapshot is created from that content.

This provides a reference point for citations and external links that want the latest information, while allowing ongoing development work to proceed safely in the `_next` dataset without disrupting users of the published data.
