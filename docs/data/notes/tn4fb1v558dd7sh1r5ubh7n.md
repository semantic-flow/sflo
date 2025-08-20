


A **mesh dataset-series node** is not generally distinguished from **[[concept.mesh.resource.node.data]]s** in terms of file structure, but their metadata should identify them as [[related-topics.dcat.dataset-series]] and identify the datasets in their series.

The contained datasets don't need to physically live inside the series' folder, but that can be an intuitive design pattern.

[[concept.mesh.flow-facet.versioned]] are not mesh dataset-series themselves, but they contain [[concept.mesh.flow-facet.v-series]] which are. (And [[concept.mesh.resource.element.flow.snapshot.version]] that are not.) 