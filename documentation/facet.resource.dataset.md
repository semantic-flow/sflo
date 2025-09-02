---
id: 6ki4upsdymjb9vy82oec2cf
title: dataset facet
desc: ''
updated: 1756754641721
created: 1750655553990
---

In the RDF universe, a dataset is a collection of one or more RDF graphs.

In a [[concept.mesh]], there are three (okay, maybe 2.5) kinds of datasets:

- [[mesh-resource.node-component.flow]]s are dcat:DatasetSeries (which are also dcat:Dataset) and represent an "abstract dataset": they don't have specific distributions of their own. 
  - Flow data is only materialized in [[mesh-resource.node-component.flow-snapshot]] distributions.
  - Metadata about the various flows is consolidated in the node's [[mesh-resource.node-component.flow.node-metadata]] in the form of distributions.
  
- [[mesh-resource.node-component.flow-snapshot]]s are dcat:Dataset and represent a "concrete dataset": they have one or more [[snapshot distributions|mesh-resource.node-component.snapshot-distribution]]. 

- [[mesh-resource.node.dataset]] contain a payload dataset and their [[concept.identifier.intramesh]] refer to that payload dataset in the abstract. The dataset is still contained in a particular kind of [[mesh-resource.node-component.flow]], i.e., a [[mesh-resource.node-component.flow.data]]. But the flow's identifier refers to a particular flow, whereas the node identifier will become the canonical IRI of the dataset (on [[concept.publication]]).
  - in the case of [[mesh-resource.node-component.flow.data]], they can store their Dataset metadata in the dataset itself, or in their [[mesh-resource.node-component.flow.reference]], or both.
