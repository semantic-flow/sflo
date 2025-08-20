---
id: 6ki4upsdymjb9vy82oec2cf
title: dataset
desc: ''
updated: 1751992631831
created: 1750655553990
---

In the RDF universe, a dataset is a collection of one or more RDF graphs.

In a [[concept.mesh]], there are two kinds of datasets:
  - [[concept.mesh.resource.element.flow]] are dcat:DatasetSeries (which are also dcat:Dataset) and represent an "abstract dataset": they don't have distributions of their own, and their data is stored in their parent node's [[concept.mesh.resource.element.flow.metadata]]'s [[concept.mesh.resource.element.flow.snapshot.distribution]]
    - in the case of [[concept.mesh.resource.element.flow.data]], they store their own DatasetSeries metadata
  - [[concept.mesh.resource.element.flow.snapshot]] are dcat:Dataset and represent a "concrete dataset": they have one or more [[related-topics.dataset.distribution]]. All of a layer's distribution files should contain the same data (they just vary in syntax)


