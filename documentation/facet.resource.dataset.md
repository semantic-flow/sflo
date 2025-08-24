---
id: 6ki4upsdymjb9vy82oec2cf
title: dataset facet
desc: ''
updated: 1755974271833
created: 1750655553990
---

In the RDF universe, a dataset is a collection of one or more RDF graphs.

In a [[concept.mesh]], there are three kinds of datasets:
  - [[resource.element.flow]]s are dcat:DatasetSeries (which are also dcat:Dataset) and represent an "abstract dataset": they don't have distributions of their own. The node's [[resource.element.flow.node-metadata]] contains metadata about the node and its flows, not the flows' data; flow data is only materialized in [[resource.element.flow-snapshot]] distributions.
    - in the case of [[resource.element.flow.data]], they store their own DatasetSeries metadata
  - [[resource.element.flow-snapshot]]s are dcat:Dataset and represent a "concrete dataset": they have one or more [[snapshot distributions|resource.element.snapshot-distribution]]. 
    - All of a snapshot's distribution files should contain the same data (they just vary in syntax).
