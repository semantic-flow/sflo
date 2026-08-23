---
id: 00c05850-8387-43ce-bacc-fb2bf904a5a9
title: 'SFLO Ontology Release Notes v0.5.0'
desc: 'v0.5.0: bounded FoundingReferentData vocabulary and validation for identifier initialization'
created: 1787503800000
---

## Summary

`v0.5.0` adds the bounded `FoundingReferentData` artifact used to record a small RDF statement set accepted about a public referent when its Semantic Flow identifier is initialized. A Knop can discover that optional artifact through `hasFoundingReferentData`, while `KnopMetadata`, primary payloads, curated references, and source provenance keep their existing distinct roles.

This is an additive pre-1.0 minor release. It introduces public vocabulary and Warning-level SHACL behavior but removes no term and changes no v0.4.0 digest contract. Existing data without the new slot remains valid. Data that uses the new slot more than once or points its founding working-file slot at a non-RDF file receives the new portable warnings.

## Release Surfaces

The tagged source contains:

- `semantic-flow-core-ontology.ttl`
- `semantic-flow-core-shacl.ttl`
- `semantic-flow-config-ontology.ttl`
- `semantic-flow-job-ontology.ttl`
- `semantic-flow-prov-ontology.ttl`

The `/sflo/` GitHub Pages publication covers core, config, and core SHACL at these release payload URLs:

- `https://semantic-flow.github.io/sflo/ontology/releases/v0.5.0/ttl/semantic-flow-core-ontology.ttl`
- `https://semantic-flow.github.io/sflo/ontology/shacl/releases/v0.5.0/ttl/semantic-flow-core-shacl.ttl`
- `https://semantic-flow.github.io/sflo/config/releases/v0.5.0/ttl/semantic-flow-config-ontology.ttl`

The job and provenance ontologies remain source-only because their namespaces are outside the `/sflo/` project Pages base and their publication topology remains unsettled.

## Highlights

- **One bounded initialization artifact.** `FoundingReferentData` is a `DigitalArtifact` plus `RdfDocument` for a small Knop-owned record of facts accepted about the associated public referent at identifier initialization.
- **Explicit optional discovery.** `hasFoundingReferentData` links a Knop to at most one founding artifact. It specializes `dcterms:hasPart` and has the exact Knop/class domain and range.
- **Machinery/content boundary retained.** Founding assertions describe public referent `D`, not machinery object `D/_knop`; they do not enter `KnopMetadata`, become a primary `PayloadArtifact`, or create `ReferenceLink`/source-provenance records.
- **Ordinary artifact lifecycle.** The artifact can use the existing working/history/state/manifestation/located-file model. Mutable working bytes carry no standing digest; immutable manifestations and snapshot files use the v0.4.0 digest contract.
- **Portable advisory validation.** A Knop with more than one founding slot receives a Warning, and a founding working file that is not typed `RdfDocument` receives a Warning. One valid and two warning fixtures extend the shared cross-engine corpus from 11 to 14 cases.

## Semantic And Validation Behavior

- `FoundingReferentData` is deliberately not a `SemanticFlowResource`; no ResourcePage contract or generated page is implied by this release.
- The vocabulary does not standardize Stagecraft predicates or revive the retired generic `ReferentMetadata`/`hasReferentMetadata` design.
- The operation-local bounded document profile—single absolute public subject, no blank nodes/base/generalized RDF, size/triple limits, and forbidden SFLO/SFCFG content predicates—remains a portable operation contract rather than a union-graph SHACL constraint.
- `hasFoundingReferentData` is optional and Warning-constrained to one IRI typed `FoundingReferentData`.
- A present `hasWorkingLocatedFile` value on a founding artifact should be an IRI typed `RdfDocument`; the existing general DigitalArtifact working-file cardinality continues to apply.
- The release also repairs the pre-existing malformed `KnopMetadata` class declaration in the active core Turtle so every shipped ontology parser sees the intended class definition.

## Validation

The release candidate must pass:

- `deno task release:set-version -- --version 0.5.0 --issued 2026-08-23`
- `deno task ci` for formatting, lint, type checks, Deno guardrails, 14 PySHACL fixtures, public `shacl-engine` conformance, and release validation
- `deno task conformance:jena` with Apache Jena SHACL 6.2.0
- `deno task conformance:compare` over the PySHACL, public JavaScript, and Jena receipt bundles with identical normalized results across all 14 cases
- `riot --validate` over all five active Turtle files
- `deno task release:validate -- --version 0.5.0` and `--require-tag` after tagging
- `git diff --check`

## Known Limitations

- Pre-1.0 modeling remains unstable; later minor releases may extend or narrow the founding contract without compatibility aliases.
- SFLO defines artifact/discovery structure, not the Stagecraft-specific referent predicates carried inside a founding document.
- Document-local admission constraints and exact-byte validation remain runtime responsibilities rather than SHACL checks over an arbitrary combined dataset.
- Founding data has no standardized ResourcePage in this release.
- The job and provenance ontologies remain tagged source only and are not published under `/sflo/` Pages.
