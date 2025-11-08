---
id: tn4fb1v558dd7sh1r5ubh7n
title: Do payload nodes support DatasetSeries?
desc: ''
updated: 1762633844291
created: 1751003183255
---

A [[mesh-resource.node.payload]] can only support a single-file distribution, but DatasetSeries can be represented in a single file with multiple [[concept.named-graphs]]. Those named graphs should be named with [[concept.fragment-identifiers]] to preserve [[principle.dereferencability-for-humans]]. 

Note that not all RDF serialization formats support named graphs.
