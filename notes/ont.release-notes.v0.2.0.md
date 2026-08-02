---
id: d7pl15zys1da0kvfyfpni7k
title: 'SFLO Ontology Release Notes v0.2.0'
desc: ''
updated: 1779178697607
created: 1779178697607
---

## Summary

`v0.2.0` is the next planned Semantic Flow ontology release after the initial `v0.1.0` tag. It folds the unpublished `v0.1.1` branch work into a minor-version bump because the branch now contains breaking vocabulary and SHACL changes. The release focuses on publication and source-resolution vocabulary needed by Weave's branch-published and sidecar mesh workflows: explicit publication profiles, repository-backed source bindings, floating repository working sources, clearer artifact resolution modes, reference-source records, observation evidence records, and ResourcePage presentation configuration.

## Release Surfaces

The tagged source contains:

- `semantic-flow-core-ontology.ttl`
- `semantic-flow-core-shacl.ttl`
- `semantic-flow-config-ontology.ttl`
- `semantic-flow-job-ontology.ttl`
- `semantic-flow-prov-ontology.ttl`

The Pages publication exposes the core ontology, core SHACL, and config ontology under the `/sflo/` project Pages mesh:

- `https://semantic-flow.github.io/sflo/ontology/releases/v0.2.0/ttl/semantic-flow-core-ontology.ttl`
- `https://semantic-flow.github.io/sflo/ontology/shacl/releases/v0.2.0/ttl/semantic-flow-core-shacl.ttl`
- `https://semantic-flow.github.io/sflo/config/releases/v0.2.0/ttl/semantic-flow-config-ontology.ttl`

The job and provenance ontology source files remain tagged source vocabulary unless or until their non-`/sflo/` publication topology is settled.

## Breaking Changes

- The unpublished `v0.1.1` release plan is superseded by `v0.2.0`; no `v0.1.1` tag should be cut from this branch.
- `ReferenceLink` no longer uses `referenceTarget`, `referenceTargetState`, or `referenceUriLiteral`. A `ReferenceLink` now points to exactly one `ReferenceSource` with `hasReferenceSource`, and that `ReferenceSource` uses the shared `ArtifactResolutionSpec` vocabulary to identify RDF reference-data bytes.
- `ArtifactResolutionTarget` is renamed to `ArtifactResolutionSpec`, and the shared target-coordinate predicates now use direct names such as `targetArtifact`, `targetHistoricalState`, `targetArtifactHistory`, `targetLocatedFile`, `targetManifestation`, and `targetRepositorySource`.
- Extraction-scoped observed-source properties and the short-lived mirrored observed-target properties are removed from the live model. Observed resolution coordinates now live on an `observedArtifactResolutionSpec` linked from an `ArtifactResolutionObservation`; digest, timestamp, and observer evidence remain on the observation record.
- The old `artifactResolutionMode_pinned` and `artifactResolutionMode_current` values remain retired. Active resolution mode vocabulary is now `artifactResolutionMode_working` and `artifactResolutionMode_latestState`, with exact requested state, located-file, manifestation, commit, or digest coordinates treated as exact by default.
- ResourcePage presentation configuration now has explicit config and SHACL structure for templates, stylesheets, generated panel selection, panel ordering, inclusion policy, targeting, and data requirements. Older ad hoc assumptions about generated panels are not the modeled contract for this release.
- Repository source modeling now distinguishes exact or ref-backed `RepositorySourceLocator` records from mutable working-source `RepositorySourceFloatingLocator` records. Floating locators deliberately omit branch/ref, commit, digest, and local checkout path evidence.
- Config attachment vocabulary now uses generic local and Knop-inheritable properties. `KnopConfig`, `hasMeshConfig`, `hasMeshInheritableConfig`, `hasKnopConfig`, `hasKnopLocalConfig`, `hasKnopInheritableConfig`, their source variants, and `configLayerRole_meshInheritable` are removed from the live pre-1.0 vocabulary. `hasEffectiveConfig` is no longer a subproperty of authored local `hasConfig`.

## Highlights

- Core artifact resolution vocabulary distinguishes mutable working-byte resolution from latest settled-state resolution.
- Exact requested target coordinates, such as a requested `HistoricalState`, `LocatedFile`, manifestation/distribution, commit, or digest, imply exact identity by default.
- A requested `ArtifactHistory` without a requested state means "latest state in that history" by default.
- `ReferenceSource`, `ImportSource`, and `IntegrationSource` join `ExtractionSource` and `ResourcePageSource` as shared `ArtifactResolutionSpec` subclasses.
- `ArtifactResolutionObservation` records observed byte evidence only when an operation intentionally records resolution evidence; concrete observed coordinates are represented by its nested `observedArtifactResolutionSpec`.
- Config vocabulary adds `PublicationProfile`, `publicationProfile_none`, `publicationProfile_githubPages`, and `hasPublicationProfile` so a mesh can persist its resolved static-publication host profile.
- Config vocabulary clarifies that reusable `ConfigArtifact` and `ConfigSource` records do not create a separate precedence layer; generic attachment properties plus the attachment subject determine the scope and layer where referenced config participates.
- GitHub Pages profile semantics are intentionally narrow: the profile covers host controls such as `.nojekyll`; Weave and the ontology do not treat `CNAME` as managed publication state.
- `hasNextHistorySegmentHint` and `hasNextStateSegmentHint` are now scoped to the relevant digital-artifact/history progression objects instead of generic config resources.
- Repository-backed source binding shapes now allow mutable working/ref-following bindings while warning when deterministic replay evidence such as commit or digest is absent.
- Local working source bindings have a dedicated SHACL shape and warning guidance for explicit working-mode declaration.
- SHACL validation now uses warnings and informational findings where missing mode or redundant mode/state combinations should guide authors without making ordinary working-source flows invalid.

## Changed Or Stabilized Behavior

- Import and integrate are conceptually distinct. Import copies a working file into the mesh/publication tree. Integrate links to source bytes where they already live and records source binding/provenance. Branch-based and sidecar ontology publication should use integrate.
- Release metadata should continue to use plural `releases/` paths.
- Source publication should be replayable from tagged source bytes. For a release, repository source evidence should name the release tag and the commit it resolves to.
- Version intent is not itself versioning. A current/default `ArtifactHistory` or next-state hint can guide the next `weave version`, but the historical state exists only after the version operation creates it.

## Version Metadata

The actively released Turtle files align their release metadata on `0.2.0` and plural `releases/v0.2.0` paths:

- `owl:versionInfo`
- `dcterms:hasVersion`
- release resource `owl:versionInfo`
- `dcterms:issued`
- `owl:versionIRI`
- `schema:contentUrl`
- `dcat:downloadURL`

The release process handles the `owl:versionIRI` chicken-and-egg explicitly. `owl:versionIRI` points to immutable raw bytes for the final tag, while the tag itself is created only after the source metadata commit exists. The safe sequence is:

1. Explicitly choose the release version, such as `0.2.0`.
2. Mechanically update source metadata to deterministic `v0.2.0` tag URLs and `releases/v0.2.0` publication URLs.
3. Validate the Turtle and commit the source release.
4. Create and push the `v0.2.0` tag at that exact commit.
5. Regenerate the Pages publication from a detached source worktree checked out at the tag commit.
6. Verify that the raw tag URLs and Pages release URLs fetch the expected bytes.

Automation should help with steps 2, 3, 5, and 6, but it should not silently invent the release version or tag. Release notes and final release intent stay human-authored.

## Validation Status

The source release validation follows [[ont.dev.release-runbook]]:

```sh
rg 'versionInfo|hasVersion|versionIRI|contentUrl|downloadURL|releases/v0\.2\.0' semantic-flow-*.ttl
deno task release:validate -- --version 0.2.0
deno task ci
riot --validate semantic-flow-core-ontology.ttl semantic-flow-core-shacl.ttl semantic-flow-config-ontology.ttl semantic-flow-job-ontology.ttl semantic-flow-prov-ontology.ttl
git diff --check
```

After Pages publication, validate the generated mesh/publication with Weave and fetch the published release payloads.

## Known Limitations

- These are pre-1.0 ontologies. Terms and modeling choices may still change without compatibility shims.
- The Pages publication currently focuses on core, config, and core SHACL under `/sflo/`; job and provenance publication remains unsettled.
- Automated GitHub Actions for SFLO release/publication are not yet the release authority. The runbook still owns the manual review points.
