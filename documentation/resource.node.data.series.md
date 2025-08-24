---
id: tn4fb1v558dd7sh1r5ubh7n
title: mesh data-series node
desc: ''
updated: 1751387375924
created: 1751003183255
---



A **mesh dataset-series node** is not generally distinguished from **[[resource.node.data]]s** in terms of file structure, but their metadata should identify them as [[related-topics.dcat.dataset-series]] and identify the datasets in their series.

The contained datasets don't need to physically live inside the series' folder, but that can be an intuitive design pattern.

[[facet.flow.versioned]] are not mesh dataset-series themselves, but they contain [[facet.flow.v-series]] which are. (And [[resource.element.flow-snapshot.version]] that are not.) 