---
id: 6ki4upsdymjb9vy82oec2cf
title: dataset
desc: ''
updated: 1755918195727
created: 1750655553990
---

In the RDF universe, a dataset is a collection of one or more RDF graphs.

In a [[concept.mesh]], there are two kinds of datasets:
  - [[concept.mesh.resource.element.flow]] are dcat:DatasetSeries (which are also dcat:Dataset) and represent an "abstract dataset": they don't have distributions of their own. The node's [[concept.mesh.resource.element.flow.metadata]] contains metadata about the node and its flows, not the flows' data; flow data is only materialized in [[concept.mesh.resource.element.flow-snapshot]] distributions.
    - in the case of [[concept.mesh.resource.element.flow.data]], they store their own DatasetSeries metadata
  - [[concept.mesh.resource.element.flow-snapshot]] are dcat:Dataset and represent a "concrete dataset": they have one or more [[related-topics.dataset.distribution]]. All of a snapshot's distribution files should contain the same data (they just vary in syntax)
