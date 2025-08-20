---
id: yci31i07s3bwpl9jd2hptod
title: next snapshot
desc: ''
updated: 1753066865744
created: 1751238695109
---

The **next snapshot** serves as a draft workspace for ongoing changes to a node's  ([[concept.mesh.resource.element.flow]])

After a version-bumping weave, a next snapshot starts identically to the current dataset but can be modified safely without affecting the stable current version. During weaving, _next content becomes the new current dataset and gets snapshotted as the latest version, while _next naturally remains ready for the next round of drafts.

This allows continuous development and version control commits without requiring immediate version bumps or disrupting users of the stable dataset.


## Containment Rules

- must-be-contained-in: [[concept.mesh.resource.element.flow.reference]], [[concept.mesh.resource.element.flow.data]], or both
