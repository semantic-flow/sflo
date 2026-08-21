---
id: z6p1m8v4k2r9x5t3n7h0bca
title: 'SFLO Ontology Release Notes v0.4.0'
desc: 'v0.4.0: exact SHA-256 digest bearer, expectation, and observation semantics; extraction provenance; and executable cross-engine SHACL conformance'
created: 1787367600000
---

## Summary

`v0.4.0` is a breaking pre-1.0 semantic and validation release. It defines an exact interoperable SHA-256 content-digest contract, separates standing byte claims from pre-resolution expectations and event observations, narrows direct digest bearers to exact manifestations and located files, adds artifact-level extraction provenance, and makes the shipped digest SHACL executable across four independent validator paths.

This is a minor release because existing data that relied on generic digest syntax, repository-locator digest placement, or a broad `rdfs:Resource` domain can now violate SHACL or infer a different class. No transition aliases or compatibility profile are provided.

## Release Surfaces

The tagged source contains:

- `semantic-flow-core-ontology.ttl`
- `semantic-flow-core-shacl.ttl`
- `semantic-flow-config-ontology.ttl`
- `semantic-flow-job-ontology.ttl`
- `semantic-flow-prov-ontology.ttl`

The `/sflo/` GitHub Pages publication covers core, config, and core SHACL at these release payload URLs:

- `https://semantic-flow.github.io/sflo/ontology/releases/v0.4.0/ttl/semantic-flow-core-ontology.ttl`
- `https://semantic-flow.github.io/sflo/ontology/shacl/releases/v0.4.0/ttl/semantic-flow-core-shacl.ttl`
- `https://semantic-flow.github.io/sflo/config/releases/v0.4.0/ttl/semantic-flow-config-ontology.ttl`

The job and provenance ontologies remain source-only because their namespaces are outside the `/sflo/` project Pages base and their publication topology is still unsettled.

## Highlights

- **One exact digest wire form.** `hasContentDigest`, `expectsContentDigest`, and `observedContentDigest` support exactly `sha256:<64 lowercase hexadecimal digits>` as `xsd:string` in this release.
- **Release-extensible method vocabulary.** `ContentDigestMethod`, `contentDigestMethod_sha256`, and functional `contentDigestMethodToken "sha256"` publish the method supported by the release without turning methods or digest values into artifacts.
- **Explicit digest bearers.** `ContentDigestBearer` is now the domain of `hasContentDigest`. `ArtifactManifestation` and `LocatedFile` are direct bearer subclasses; downstream vocabularies may define narrower bearer subclasses for other resources with one determinate or retrievable byte stream.
- **Exact manifestation identity.** One `ArtifactManifestation` denotes one exact byte sequence. Byte-changing formatting, line-ending, compression, packaging, canonicalization, or serialization changes create another manifestation. Multiple located files can provide one manifestation only as byte-identical replicas.
- **Extraction provenance.** New object property `extractedFrom` specializes `prov:wasDerivedFrom` for content produced by extraction from a governing artifact or known historical state. Citation, translation, revision, and new-edition relations are explicitly outside this predicate.
- **Cross-engine executable SHACL.** One SFLO-owned eleven-case corpus runs through PySHACL 0.40.0, public `shacl-engine` 1.1.2 over N3/RDF/JS, Stagecraft's exact `shacl-engine`/Oxigraph adapter, and Apache Jena SHACL 6.2.0. [[ont.report.2026-08-21-v0.4.0-shacl-conformance]] records the agreeing semantic receipts.

## Breaking Or Changed Semantic And Validation Behavior

- **Domain inference changed.** `hasContentDigest` no longer has domain `rdfs:Resource`; its domain is `ContentDigestBearer`. Using the property entails bearer status. Consumers should still assert the narrower known bearer type when one exists.
- **Direct bearer scope is narrow.** `ArtifactManifestation` and `LocatedFile` are direct bearer types. `DigitalArtifact`, `ArtifactHistory`, `HistoricalState`, and repository locator classes do not become bearers merely through their existing class membership.
- **DigitalArtifact and standalone file identity is clarified.** A `LocatedFile` may stand alone when no governing `DigitalArtifact` is named or described, and exact-facet predicates may refer to it directly. This does not make the file IRI the identity of a `DigitalArtifact`; predicates requiring the governing artifact must still target one.
- **Manifestation and file claims must agree.** When an `ArtifactManifestation` and a linked `LocatedFile` both assert a digest for the same method, different values are a SHACL Violation. A mismatch means the file does not truthfully provide that manifestation's exact bytes.
- **Same-method uniqueness is enforced.** One subject may not assert multiple distinct `hasContentDigest` values for the same method, and one observation may not assert multiple distinct `observedContentDigest` values for the same method. Future simultaneous different-method values remain possible when a later release adds methods.
- **Digest grammar is fail-closed.** The former generic `algorithm:value` Warning is replaced by the exact lowercase SHA-256 pattern at Violation severity for standing, expected, and observed digest properties. Uppercase hex, wrong lengths, non-hex characters, missing prefixes, and unsupported algorithms now violate.
- **Repository locators carry no digest property.** `RepositorySourceLocator` and `RepositorySourceFloatingLocator` must not carry `hasContentDigest`, `expectsContentDigest`, or `observedContentDigest`. A pre-existing requirement belongs on the `ArtifactResolutionSpec`; computed evidence belongs on an `ArtifactResolutionObservation`.
- **Expected and observed lifecycle is explicit.** `expectsContentDigest` is supplied before resolution by a caller, authored policy, or durable binding. `observedContentDigest` is computed from bytes during an event. A computed observation must not be promoted into a retroactive expectation.
- **Expected/observed mismatch remains a runtime operation boundary.** Runtimes must fail before successful use or persistence when a current expectation and the observed bytes disagree. SHACL deliberately does not compare a mutable current expectation against every appendable historical observation, because a later expectation update must not invalidate honest earlier evidence.
- **Observed constraints target property subjects.** Digest grammar, required observation spec, timestamp, and same-method checks now fire for every subject of `observedContentDigest`, even when the subject lacks an explicit `ArtifactResolutionObservation` type and no RDFS inference is enabled.
- **Subject-typing advisories are portable Warnings.** A standing digest subject should be explicitly typed `ContentDigestBearer` or a subclass, and an expected digest subject should be an `ArtifactResolutionSpec` or subclass. Dedicated warning node shapes carry the severity consistently across engines without weakening lexical or placement violations.
- **Manifestation-targeted local resolution is recognized as exact.** A local resolution spec with `targetManifestation` no longer receives the generic missing-mode/evidence warning.
- **Release metadata is self-conforming.** Release payload metadata now explicitly types the Turtle manifestation and its located file, so the ontology-plus-fixture execution profile validates without unrelated release-state warnings.

Existing canonical digest claims on `LocatedFile` remain valid. Moving or copying those claims to `ArtifactManifestation` is optional unless a downstream profile requires manifestation-level identity; if both levels assert the method, they must match.

## Validation

Commands required and run for this release candidate:

- `deno task release:set-version -- --version 0.4.0 --issued 2026-08-21`
- `deno task ci` for formatting, lint, type checks, 30 Deno guardrails, 11 PySHACL fixtures, public `shacl-engine` conformance, and release validation
- GitHub CI pinned to Deno 2.9.2; Deno 2.7.14 cannot resolve the public SHACL-SPARQL adapter's transitive `cross-fetch/polyfill` entry
- `deno task conformance:jena` with Apache Jena SHACL 6.2.0
- the Stagecraft `createPopulationValidator` receipt at Stagecraft commit `b83fcf6e22e81a4c74ba371ef22706003cb1baa7`, using `shacl-engine` 1.1.2 and Oxigraph 0.5.9
- `deno task conformance:compare` over all four receipt bundles; all eleven normalized semantic receipts agreed
- `riot --validate` over all five active Turtle files and the canonical fixture corpus; Riot was syntax preflight only
- `deno task release:validate -- --version 0.4.0` and `--require-tag` after tagging
- `git diff --check`

## Known Limitations

- Pre-1.0 modeling remains unstable; later minor releases may add methods or narrow vocabulary without compatibility aliases.
- SHA-256 is the only supported digest method. RDF graph canonicalization, directory/tree digests, archive digests, signatures, and structured checksum nodes are out of scope.
- SHACL checks assertion placement and consistency but does not retrieve bytes or recompute hashes. Runtime operations remain responsible for exact-byte hashing and fail-closed expectation verification.
- Failed-attempt provenance is not modeled in this release.
- The job and provenance ontologies remain tagged source only and are not published under `/sflo/` Pages.
