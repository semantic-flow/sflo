---
id: q4m8x1v6r9k2t5p7n3h0bca
title: Response to Stagecraft Semantic Flow Requirements
desc: 'SFLO response and confirmation request for the Stagecraft requirements note delivered 2026-08-20'
created: 1787329410000
---

## Purpose

This note responds to [[sc.disc.2026-08-20_1941-what-stagecraft-needs-from-semantic-flow]], "What Stagecraft needs from Semantic Flow." It records the SFLO side's current rulings and asks Stagecraft to confirm that the resulting contracts meet the actual consumer need.

The changes described here are in working trees and task/spec notes. They are not a published SFLO release yet.

## 1. Content Digest Contract

We agree that the content-digest contract should land. The implementation target is [[ont.task.2026.2026-08-14_1949-content-digest-contract]], with portable behavior in [[sf.spec.2026-08-21-content-digest]].

### Representation and Supported Method

The next contract keeps algorithm-qualified string literals and supports exactly:

`sha256:<64 lowercase hexadecimal digits>`

The same grammar applies at SHACL violation severity to:

- `hasContentDigest`
- `expectsContentDigest`
- `observedContentDigest`

SFLO adds the open controlled vocabulary `ContentDigestMethod`, the release member `contentDigestMethod_sha256`, and functional token property `contentDigestMethodToken` with value `"sha256"`.

Digest methods and digest literals are not modeled as `DigitalArtifact` resources.

### Bearer Ruling

We accept Stagecraft's falsifiability argument for `LocatedFile`, but not the proposed automatic widening over the entire artifact/facet lattice.

`hasContentDigest` has domain `ContentDigestBearer`. SFLO directly classifies two bearer types:

- `ArtifactManifestation`, where the assertion claims the manifestation's exact represented byte sequence
- `LocatedFile`, where the assertion is an independently checkable standing claim about bytes retrieved through that file identity or location

We do not make `DigitalArtifact`, `ArtifactHistory`, `HistoricalState`, `DigitalArtifactFacet` as a whole, or repository locator classes subclasses of `ContentDigestBearer`. Those types do not identify one byte stream merely through their existing class membership.

The bearer class remains an open extension boundary. A downstream resource that genuinely denotes its own determinate or retrievable bytes may be explicitly typed with a narrower `ContentDigestBearer` subclass. Using `hasContentDigest` itself entails `ContentDigestBearer` through the property's RDFS domain, but consumers should assert the narrower known bearer type when one exists.

This means Stagecraft's existing canonical `LocatedFile` digest claims remain valid and do not need to move merely because the domain changes. A content-addressed resource currently typed only `DigitalArtifact` should not rely on that type to justify the digest; if the resource denotes exact bytes, Stagecraft should model its byte-bearing role explicitly. Existing digest values and IRIs do not need to change.

### Manifestation and Replica Invariant

An `ArtifactManifestation` denotes one exact byte sequence. Formatting, line-ending, compression, packaging, canonicalization, or serialization changes that alter bytes create a different manifestation.

Multiple `LocatedFile` resources may provide one manifestation only when they are byte-identical replicas. An authored source file and its published mirror may therefore be two located files for one manifestation when they return the same bytes.

When a manifestation and one of its located files both declare a digest for the same method, the values must agree. A mismatch is a SHACL violation.

The behavior spec includes the requested before/after-compatible worked example for one authored file and one published mirror. Because `LocatedFile` remains a bearer, Stagecraft is not required to move its current claims upward to the manifestation; adding the matching manifestation claim is optional unless a Stagecraft profile requires it.

### Repository Locators, Expectations, and Observations

A `RepositorySourceLocator` records repository coordinates, not the bytes resolved from those coordinates. Exact and floating repository locator nodes do not carry `hasContentDigest`.

- a caller- or policy-supplied pre-resolution requirement uses `expectsContentDigest` on `ArtifactResolutionSpec`
- a digest computed during resolution uses `observedContentDigest` on `ArtifactResolutionObservation`
- a computed observation is not promoted into an expectation after the fact
- expected/observed disagreement for the same linked resolution is failed verification

Weave's repository-backed integrate behavior is being aligned accordingly: it records every computed digest as observation evidence, records an expectation only when the caller supplied one, and stops emitting locator-level `hasContentDigest`.

### Attestation Join

We do not currently propose a new direct observation-to-bearer property. The existing concrete observed spec already supplies the join:

```sparql
PREFIX sflo: <https://semantic-flow.github.io/sflo/ontology/>

SELECT ?bearer ?claimedDigest ?observedDigest WHERE {
  ?observation
    sflo:observedContentDigest ?observedDigest ;
    sflo:observedArtifactResolutionSpec/
      (sflo:targetLocatedFile|sflo:targetManifestation) ?bearer .
  ?bearer sflo:hasContentDigest ?claimedDigest .
}
```

Adding a direct property would duplicate the target already carried by `observedArtifactResolutionSpec` and would introduce a new consistency obligation. We would add it later if actual query, indexing, or interoperability pressure shows that the property path is insufficient.

## 2. DigitalArtifact and Standalone LocatedFile Identity

We accept the clarification that a Semantic Flow `DigitalArtifact` IRI returns its `ResourcePage`, not the artifact bytes.

We also accept the underlying sparse/external-file use case, but express it as facet acceptance rather than artifact/file identity collapse. The ontology wording becomes:

> A LocatedFile may stand alone when its governing DigitalArtifact is unnamed or not described in the available graph. Properties whose contracts accept an exact artifact facet may refer directly to that LocatedFile; this does not make the LocatedFile IRI the identity of a DigitalArtifact.

A predicate that genuinely requires a governing `DigitalArtifact` must refer to a `DigitalArtifact` resource, which may be unnamed. A predicate intended to accept either a governing artifact or an exact facet should state that broader contract explicitly rather than depending on RDFS range inference to turn the file IRI into a `DigitalArtifact`.

This preserves the no-full-package use case without making a file URL into a public artifact identifier that should return a ResourcePage.

## 3. Media Type and Byte Size

We agree with the direction: use DCAT rather than minting SFLO media-family terms.

`ArtifactManifestation` is already a `dcat:Distribution`, so a separate task should publish a Semantic Flow SHACL application profile for:

- `dcat:mediaType`, using an IANA media-type resource
- `dcat:byteSize`, using `xsd:nonNegativeInteger` in the SFLO profile when present

The remaining design work is limited but real: name the profile/conformance levels and decide when each property is optional, recommended, or required. No `sflo:Image` or equivalent class hierarchy is proposed.

## 4. Release Notice

The digest contract is targeted for SFLO `v0.4.0`, the next minor release after `v0.3.0`. We cannot yet give an honest calendar estimate. We will name the domain, grammar, and placement changes in release notes before publication so downstream estates can schedule their own validation or explicit-typing changes.

## 5. Representation Choice

We accept the documentation request. [[ont.summary.core]] should state explicitly that a `SemanticMesh` is a semantic namespace/resource region and that filesystem-backed layout is one representation choice, not a core requirement. In-memory and database-backed implementations owe the same identifier, resource, and operation semantics without owing literal `_mesh` directories until they serialize into that profile.

## Confirmation Requested From Stagecraft

Please confirm or challenge these four points:

1. Is the narrow two-bearer contract — `ArtifactManifestation` and `LocatedFile` through `ContentDigestBearer` — sufficient without automatically classifying every `DigitalArtifact` and facet as a bearer?
2. Is the existing `observedArtifactResolutionSpec` property-path join sufficient for the first attestation slice, given the worked query above?
3. Does the separate DCAT application-profile direction satisfy the image/media need, with conformance-level cardinalities to be ruled in that task?
4. Is targeting SFLO `v0.4.0` with release-note notice, but no calendar promise yet, enough for Stagecraft's migration planning?

Stagecraft's explicit non-asks remain out of scope: namespace allocation/squatting policy, media-family classes, a library-versus-CLI ruling, SPDX replacement, and Knop-per-high-volume-identifier guidance.
