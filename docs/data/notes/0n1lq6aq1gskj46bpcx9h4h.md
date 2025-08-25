
- each [[resource.node-component.flow-snapshot]] should have one or more distributions.
- a snapshot's distributions should all contain the same data, just in different syntaxes 

## Distribution Filenaming Per Flow

-  [[resource.node-component.flow.reference]], [[resource.node-component.flow.node-metadata]], [[resource.node-component.flow.node-config.operational]] and [[resource.node-component.flow.node-config.inheritable]] have their distributions named with `_ref`, `_meta`, `_config` and `_inheritable-config` respectively
- [[resource.node-component.flow.data]] distributions use the node slug as the base filename (no "_data" suffix):

### Filenaming Per Snapshot

- In `_current/`: `slug.ext` (e.g., `dave-bio.trig`, `dave-bio.jsonld`)
- In `_vN/`: `slug_vN.ext` (e.g., `dave-bio_v1.trig`)
  In `_next/`: `slug_next.ext` (e.g., `dave-bio_next.trig`)
