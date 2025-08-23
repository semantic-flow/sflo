---
id: 0n1lq6aq1gskj46bpcx9h4h
title: snapshot distribution
desc: ''
updated: 1755912680318
created: 1751138751433
---

- [[concept.mesh.resource.element.flow-snapshot]] should have one or more distributions.
- a snapshot's distributions should contain the same data, just in different syntaxes 

## Distribution Filenaming

- [[concept.mesh.resource.element.flow.metadata]]s have their distributions named with "_meta" 
- [[concept.mesh.resource.element.flow.config.operational]] and [[concept.mesh.resource.element.flow.config.inheritable]] have their distribution named with "_config" and "_inheritable-config"
- [[concept.mesh.resource.element.flow.data]] distributions use the node slug as the base filename (no "_data" suffix):

### Versioned Filenaming

- In `_current/`: `slug.ext` (e.g., `dave-bio.trig`, `dave-bio.jsonld`)
- In `_vN/`: `slug_vN.ext` (e.g., `dave-bio_v1.trig`)
  In `_next/`: `slug_next.ext` (e.g., `dave-bio_next.trig`)
