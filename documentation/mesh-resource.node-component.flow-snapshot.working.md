---
id: yci31i07s3bwpl9jd2hptod
title: working snapshot
desc: ''
updated: 1762663243697
created: 1751238695109
---

The **working snapshot** serves as a draft workspace for ongoing changes to a node's [[mesh-resource.node-component.flow]]s
After a version-bumping weave, a working snapshot starts identically to the current dataset but can be modified safely without affecting the stable current version. During weaving, _working content becomes the new current dataset and gets snapshotted as the latest version, while _working naturally remains ready for the next round of drafts.

This allows continuous development and version control commits without requiring immediate version bumps or disrupting users of the stable dataset.
