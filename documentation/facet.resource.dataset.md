---
id: 6ki4upsdymjb9vy82oec2cf
title: dataset facet
desc: ''
updated: 1764910114626
created: 1750655553990
---

In the RDF universe, a dataset is a collection of one or more RDF graphs.

In a [[concept.mesh]], there are two kinds of datasets:

- [[mesh-resource.component.flow]]s are dcat:DatasetSeries (which are also dcat:Dataset) and represent an "abstract dataset": they don't have concrete distributions of their own. 
  - Flow data is only materialized in [[mesh-resource.component.slice]] distributions.
  - Metadata about the various flows is consolidated in the knop's [[mesh-resource.component.flow.metadata]] in the form of distributions.
  - [[mesh-resource.knop.payload]]s contain a "payload flow" and their [[concept.identifier.intramesh]]s refer to that payload dataset in the abstract. The dataset is still contained in a particular kind of [[mesh-resource.component.flow]], i.e., a [[mesh-resource.component.flow.dataset]]. But the flow's identifier refers to a particular flow, whereas the knop identifier will become the canonical IRI of the dataset (on [[concept.publication]]).
    - in the case of [[mesh-resource.component.flow.dataset]], they can store their Dataset metadata in the dataset itself, or in their [[mesh-resource.component.flow.reference]], or both.
  
- [[mesh-resource.component.slice]]s are dcat:Dataset and represent a specific version of their abstract datasets; they have one or more [[version distributions|mesh-resource.component.distribution]]. 

