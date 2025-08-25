
In the RDF universe, a dataset is a collection of one or more RDF graphs.

In a [[concept.mesh]], there are three (okay, maybe 2.5) kinds of datasets:

- [[resource.node-component.flow]]s are dcat:DatasetSeries (which are also dcat:Dataset) and represent an "abstract dataset": they don't have distributions of their own. The node's [[resource.node-component.flow.node-metadata]] contains metadata about the node and its flows, not the flows' data; flow data is only materialized in [[resource.node-component.flow-snapshot]] distributions.
  
- [[resource.node-component.flow-snapshot]]s are dcat:Dataset and represent a "concrete dataset": they have one or more [[snapshot distributions|resource.node-component.snapshot-distribution]]. 

- [[resource.node.reference.dataset]] contain a payload dataset and their [[concept.identifier.intramesh]] refer to that payload dataset in the abstract. The dataset is still contained in a particular kind of [[resource.node-component.flow]], i.e., a [[resource.node-component.flow.data]]. But the flow's identifier refers to a particular flow, whereas the node identifier will become the canonical IRI of the dataset (on [[concept.publication]]).
  - in the case of [[resource.node-component.flow.data]], they can store their Dataset metadata in the dataset itself, or in their [[resource.node-component.flow.reference]], or both.
