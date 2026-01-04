---
id: beitdeou8xgrn47ti9b5gt8
title: Pointers Dataset
desc: ''
updated: 1766073432821
created: 1765764454154
---

The **pointers dataset** holds critical metadata for a Knop and is present in every KnopNode, and contains EITHER:

- the currently active KnopNode IRI (if this one is dormant), i.e. activePeerKnopNode

OR

- currentMetaDownloadJSONLD / currentMetaDownloadTTL  (specified with [[concept.identifier.intramesh.relative]])
- [optional] "other Knop" locations (peerKnopNode)

## Invariants

- It is managed exclusively by sflo tooling
- It should have two distribution, local downloadURLs are:
  -  `.../<knop-name>/_knop/_pointers/ttl/index.ttl`
  -  `.../<knop-name>/_knop/_pointers/jsonld/index.jsonld`


## Equivalence

```ttl
<../_knop/>  sflo:hasKnopMetadataFlow/ <../_meta-flow/> .
<../_meta-flow/> sflo:hasCurrentSlice <../_meta-flow/2025-12-17T22:32:42Z_v1/> .
<../_meta-flow/2025-12-17T22:32:42Z_v1/> sflo:hasDistribution/ <../_meta-flow/2025-12-17T22:32:42Z_v1/jsonld/> .
<../_meta-flow/2025-12-17T22:32:42Z_v1/jsonld/> dcat:downloadURL <../_meta-flow/2025-12-17T22:32:42Z_v1/jsonld/bio_meta.jsonld>

```
