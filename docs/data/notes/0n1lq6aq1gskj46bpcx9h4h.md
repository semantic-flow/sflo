
- each [[mesh-resource.node-component.flow-shot]] should have one or more [[mesh-resource.node-component.snapshot-distribution]] [[file]].
- a snapshot's distributions should all contain the same data, just in different syntaxes 

## Distribution Filenaming Per Flow

-  [[mesh-resource.node-component.flow.reference]], [[mesh-resource.node-component.flow.node-metadata]], [[mesh-resource.node-component.flow.node-config.operational]] and [[mesh-resource.node-component.flow.node-config.inheritable]] have their distributions named with `_ref`, `_meta`, `_config` and `_inheritable-config` respectively
- [[mesh-resource.node-component.flow.payload]] distributions use the node slug as the base filename (no "_data" or "_payload" suffix):

