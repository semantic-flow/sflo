---
id: a99e1b79-6db7-429a-aead-edddab2e85bb
title: 'SFLO Ontology Release Notes v0.6.0'
desc: 'v0.6.0: LocatedFile resolution specifications and stable named repository locators'
created: 1790640492000
---

## Summary

`v0.6.0` adds `resolutionSpec`, which lets a `LocatedFile` designate an `ArtifactResolutionSpec` for locating its bytes when the file record and the bytes it names live in different repositories or storage surfaces. The designated spec must target that same file and can carry the existing artifact, repository, path, fallback, mode, and digest-expectation coordinates.

The release also requires persisted `RepositorySourceFloatingLocator` resources to have stable IRI identity. This lets a writer distinguish repeated registration of the same repository coordinates from an attempt to assign conflicting coordinates to the same locator.

This is a focused pre-1.0 minor release. It adds public vocabulary and tightens SHACL behavior for data that uses floating repository locators or the new file-resolution edge. Existing data that does not use those surfaces is unaffected.

## Release Surfaces

The tagged source contains:

- `semantic-flow-core-ontology.ttl`
- `semantic-flow-core-shacl.ttl`
- `semantic-flow-config-ontology.ttl`
- `semantic-flow-job-ontology.ttl`
- `semantic-flow-prov-ontology.ttl`

The `/sflo/` GitHub Pages publication covers core, config, and core SHACL at these release payload URLs:

- `https://semantic-flow.github.io/sflo/ontology/releases/v0.6.0/ttl/semantic-flow-core-ontology.ttl`
- `https://semantic-flow.github.io/sflo/ontology/shacl/releases/v0.6.0/ttl/semantic-flow-core-shacl.ttl`
- `https://semantic-flow.github.io/sflo/config/releases/v0.6.0/ttl/semantic-flow-config-ontology.ttl`

The job and provenance ontologies remain source-only because their namespaces are outside the `/sflo/` project Pages base and their publication topology remains unsettled.

## Highlights

- **Located files can designate their resolution instructions.** `resolutionSpec` relates a `LocatedFile` to at most one `ArtifactResolutionSpec`, allowing a cataloged file identity to name bytes whose retrieval coordinates live elsewhere.
- **The relation is self-consistent.** A designated spec must declare exactly one `targetLocatedFile`, and it must be the same `LocatedFile` that carries `resolutionSpec`.
- **Existing resolution coordinates are reused.** Repository-backed specs continue to use `targetArtifact`, `targetRepositorySource`, and `targetLocalRelativePath`; optional expectations such as `expectsContentDigest` describe verification of the resolved bytes rather than becoming observations.
- **Access authority stays out of the edge.** `resolutionSpec` identifies instructions; it does not itself authorize access to a repository or storage system.
- **Persisted floating locators are named.** `FloatingRepositorySourceBindingShape` now requires an IRI-valued `hasRepositorySourceFloatingLocator`, replacing the earlier blank-node-or-IRI allowance.
- **Portable validation grows from 14 to 19 cases.** The shared corpus adds valid and invalid named-locator cases plus an exact-pin warning case, a mismatched-target violation, and a duplicate-resolution-spec violation.

## Semantic And Validation Behavior

- `resolutionSpec` has domain `LocatedFile` and range `ArtifactResolutionSpec`.
- A file with no `resolutionSpec` remains unconstrained by `LocatedFileResolutionSpecShape`.
- A file with more than one designated spec receives a Violation.
- A designated spec that omits the originating file from `targetLocatedFile`, or targets a different file, receives a Violation.
- A repository-backed designated spec remains subject to the existing source-binding contract. It must carry one `targetArtifact` and one `targetLocalRelativePath` beside its `targetRepositorySource`.
- The current vocabulary has no `ArtifactResolutionMode` for an exact commit-and-digest pin. A spec expressing that combination therefore receives the existing missing-mode Warning; this release does not invent a misleading mode token.
- `RepositorySourceFloatingLocator` remains the locator for mutable working bytes selected through runtime policy, but persisted instances must now be named IRIs rather than blank nodes.

## Validation

The release candidate must pass:

- `deno task release:set-version -- --version 0.6.0 --issued 2026-09-28`
- `deno task ci` for formatting, lint, type checks, Deno guardrails, 19 PySHACL fixtures, public `shacl-engine` conformance, and release validation
- `deno task conformance:jena` with Apache Jena SHACL 6.2.0
- `deno task conformance:compare` over the PySHACL, public JavaScript, and Jena receipt bundles with identical normalized results across all 19 cases
- `riot --validate` over all five active Turtle files
- `deno task release:validate -- --version 0.6.0` and `--require-tag` after tagging
- `git diff --check`

## Known Limitations

- Pre-1.0 modeling remains unstable; later minor releases may extend or narrow artifact-resolution behavior without compatibility aliases.
- The vocabulary describes resolution coordinates and expectations, not credentials, authorization, or runtime repository-to-checkout policy.
- No standardized resolution mode currently names an exact repository commit plus expected content digest, so that combination retains the general mode warning.
- The job and provenance ontologies remain tagged source only and are not published under `/sflo/` Pages.
