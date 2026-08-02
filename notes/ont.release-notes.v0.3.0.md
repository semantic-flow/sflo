---
id: 4hjoxgrhaam8fsk6v13w63e
title: 'SFLO Ontology Release Notes v0.3.0'
desc: ''
updated: 1785645025559
created: 1785645025559
---

## Summary

`v0.3.0` is a breaking pre-1.0 vocabulary release. It aligns Semantic Flow versioning vocabulary with DCAT, renames artifact-resolution targets to specs, narrows portable config policy vocabulary, adds mesh workspace path rules and exact artifact policy targets, and moves `owl:versionInfo` off version-independent ontology identifiers onto their release resources.

It is a minor bump rather than a patch because consumers reading the previous predicates will break. The work accumulated on the `next/v0.2.1` line, but the content outgrew a patch version: renames and predicate migrations are not patch-shaped, and release identity is immutable once published.

## Release Surfaces

The tagged source contains:

- `semantic-flow-core-ontology.ttl`
- `semantic-flow-core-shacl.ttl`
- `semantic-flow-config-ontology.ttl`
- `semantic-flow-job-ontology.ttl`
- `semantic-flow-prov-ontology.ttl`

The `/sflo/` GitHub Pages publication covers core, config, and core SHACL, at these release payload URLs:

- `https://semantic-flow.github.io/sflo/ontology/releases/v0.3.0/ttl/semantic-flow-core-ontology.ttl`
- `https://semantic-flow.github.io/sflo/ontology/shacl/releases/v0.3.0/ttl/semantic-flow-core-shacl.ttl`
- `https://semantic-flow.github.io/sflo/config/releases/v0.3.0/ttl/semantic-flow-config-ontology.ttl`

The job and provenance ontologies remain source-only: they use `https://semantic-flow.github.io/ontology/job/` and `.../ontology/prov/` namespaces rather than the `/sflo/` project Pages base, and their publication topology is still unsettled.

## Highlights

- **DCAT versioning alignment.** `dcterms:hasVersion` / `dcterms:isVersionOf` become `dcat:hasVersion` / `dcat:isVersionOf` on ontology and release resources, and `sflo:hasHistoricalState` is now an `rdfs:subPropertyOf dcat:hasVersion` — so a Semantic Flow artifact history reads as a DCAT version lineage.
- **Artifact resolution: targets renamed to specs.** The artifact-resolution vocabulary now speaks of resolution *specs*, and the direct predicates `sflo:targetArtifact` and `sflo:targetHistoricalState` replace the older `sflo:hasTargetArtifact` and `sflo:hasRequestedTargetState`.
- **Version-independent identifiers no longer claim a version.** `owl:versionInfo` was removed from each ontology's version-independent IRI and retained on its release (HistoricalState) resource, which is where a single version belongs. `dcat:hasVersion` links the two.
- **ArtifactHistory as a diachronic facet.** `ArtifactHistory` is now also a `DigitalArtifactFacet`, and `defaultArtifactHistory` distinguishes the normative default write target from `currentArtifactHistory`'s current-lineage pointer.
- **Config policy vocabulary narrowed** to portable policy concepts, with config source-attachment authority clarified.
- **New vocabulary** for mesh workspace path rules and exact artifact policy targets.
- **SHACL guardrails expanded** substantially alongside the ontology changes.

## Breaking Changes

- Consumers reading `sflo:hasTargetArtifact` or `sflo:hasRequestedTargetState` must migrate to `sflo:targetArtifact` and `sflo:targetHistoricalState`.
- Consumers reading `dcterms:hasVersion` / `dcterms:isVersionOf` on ontology or release resources must read the `dcat:` equivalents.
- Consumers reading `owl:versionInfo` from a version-independent ontology IRI must follow `dcat:hasVersion` to the release resource and read it there.
- Renamed artifact-resolution and narrowed config policy terms retire their previous spellings; no compatibility shims are provided, per the pre-1.0 no-shims posture.

## Validation

Commands actually run for this release:

- `deno task release:set-version -- --version 0.3.0 --issued 2026-08-01`
- `deno task release:validate -- --version 0.3.0` (and `--require-tag` after tagging)
- `deno task ci` (fmt check, lint, type check, RDF and SHACL guardrail tests, release validation)
- `riot --validate` over all five active Turtle files
- `git diff --check`

The release validator was corrected as part of this release: it required `owl:versionInfo` on the version-independent ontology IRI, which this release deliberately removes. It now derives each file's declared version from `dcat:hasVersion` and continues to require `owl:versionInfo` on the release resource itself.

## Known Limitations

- Pre-1.0 modeling remains unstable; vocabulary may still be renamed or narrowed between minor versions without shims.
- The job and provenance ontologies are source-only and are not dereferenceable under `/sflo/`.
- The GitHub Pages mesh for this release is regenerated separately from the source tag; a Turtle file existing in the tag does not imply a published resource page. See the Weave-side regeneration task for the publication of this release.
