---
id: 0y6p8e594peoult03gobm94
title: KnopMetadataFlow
desc: ''
updated: 1767507863384
created: 1730660543063
---

A **knop metadata flow** contains system-related administrative and structural metadata for every [[mesh-resource.knop]].

In the filesystem, it exists as a [[folder._meta]] in a [[folder._knop]].

Metadata about a knop's [[mesh-resource.component.slice.version]]s mostly lives here, eliminating the need to keep separate metadata in the knop component. Also may contain metadata about the assets folder.

## Use of _knop IRI in metadata flows

When metadata flows (or any [[facet.system]] dataset) refer to mesh knops, they'll usually be talking about "the-knop-as-mesh-constituent", so they'll use the knop's [[mesh-resource.component.knop-handle]] identifier

## Contents

## A. KnopMetadataFlow (canonical, minimal, must exist)

### 1) Knop identity and referent linkage

* `@type sflo:Knop`
* a canonical linkage between the Knop and the referent, using `sflo:supportsReferent` (Knop → referent IRI)
* authorship / ownership / provenance / dcterms stuff for the Knop itself  


### 2) Component registry (what components exist and where)

For each contained KnopComponent, at minimum:

* component IRI
* component class (`ReferenceFlow`, `PayloadFlow`, `BacklinksFlow`, `OpslogDatasetSeries`, `PointersKnopDataset`, etc.)


### 3) “Current pointers” for time-evolving structures

* Flow → current Version (or current dataset snapshot)
* DatasetSeries -> latest dataset (for opslog)
* LocatedFile/ for current/latest 


### 4) Weave-time facts for the Knop itself

At minimum:

* last weave timestamp for PayloadFlow and ReferenceFlow
  * (other flows can keep this internally)
* weave label or weave identifier

Recommended:

* weave tool identifier and version
* weave-specific authorship data
* hash / ETag of key artifacts (for cache correctness and invalidation)

These facts describe *the act of weaving*, not semantic validity.

### 5) Local and Inheritable Config

## Under Consideration

### Reference integrity status (derived)

Optional cached indicators such as:

* required components present / missing
* broken IRI references detected
* expected distributions missing
* SHACL or other validation summaries (pass/fail, counts)

### Effective config fingerprint

Because config is inheritable and frequently changing:

* store only a hash/fingerprint of the effective config used for the last weave


