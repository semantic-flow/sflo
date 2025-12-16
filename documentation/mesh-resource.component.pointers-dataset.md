---
id: beitdeou8xgrn47ti9b5gt8
title: Pointers Dataset
desc: ''
updated: 1765862460836
created: 1765764454154
---

The **pointers dataset** holds critical metadata for a knop instance:

- [optional] the IRIs of the latest slice for each of its flows
  - this is optional, because if this knop has been [[expanded|concept.knop-expansion]], 
- the IRIs of those slices' distributions
- a pointer to the inventory and opslog datasets, if present
- [optional] "current Knop", if not this one (i.e., if a knop has an multiple locations)
- [optional] "other Knop" locations, via the [[mesh-resource.component.knop-handle]] (again, if a knop has multiple locations)
- [optional] "equivalent IRIs" (using owl:sameAs) corresponding to those other locations' identifiers.

## Invariants

- It is managed exclusively by sflo tooling
- Its canonical distribution location is `.../knop/_sfops/pointers/index.jsonld`
