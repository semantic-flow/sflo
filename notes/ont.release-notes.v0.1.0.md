---
id: qi6bix9q1w0j3cu1i81p9pi
title: 'SFLO Ontology Release Notes v0.1.0'
desc: ''
updated: 1779078411456
created: 1779073035030
---

## Summary

`v0.1.0` is the first tagged Semantic Flow ontology release in the `semantic-flow/sflo` repository. It captures the current Turtle-first ontology surface for Semantic Flow identifiers, meshes, Knops, digital artifacts, publication histories, configuration policy, job vocabulary, provenance vocabulary, and core SHACL validation shapes.

## Release Surfaces

The tagged source contains:

- `semantic-flow-core-ontology.ttl`
- `semantic-flow-core-shacl.ttl`
- `semantic-flow-config-ontology.ttl`
- `semantic-flow-job-ontology.ttl`
- `semantic-flow-prov-ontology.ttl`

The v0.1.0 Pages publication currently exposes the core ontology, core SHACL, and config ontology under the `/sflo/` project Pages mesh. The job and provenance ontology source files are tagged, but their declared namespaces are outside the `/sflo/` project Pages base, so treat them as source-tagged vocabulary until a publication topology for those IRIs is settled.

## Highlights

- Core ontology defines the current Semantic Flow model for `SemanticMesh`, `Knop`, mesh-relative `designatorPath`, and public Semantic Flow identifiers.
- Digital artifact modeling is centered on `DigitalArtifact -> ArtifactHistory -> HistoricalState -> ArtifactManifestation -> LocatedFile`, with sparse shortcuts for working files, direct located files, current-byte access URLs, and content digests.
- Resource support vocabulary covers payload artifacts, metadata, inventories, reference catalogs, source registries, resource page definitions, resource page regions/sources, and local asset bundles.
- Reference vocabulary distinguishes `ReferenceCatalog`, `ReferenceLink`, reference roles, broad resource targets, and version-pinned `referenceTargetState`.
- Source provenance vocabulary in core covers `ArtifactResolutionTarget`, `RepositorySourceLocator`, `ExtractionSource`, target/source locators, observed source state, observed source manifestation, observed source file, and expected/observed digests.
- Config ontology defines portable and operational config classes, authored config attachment, config source references, policy-valued history/page/naming behavior, config resolution records, local/remote access rules, and resource-page presentation configuration.
- Job ontology defines durable Semantic Flow API jobs, job kinds, statuses, targets, progress, results, errors, events, and resource-change event vocabulary.
- Provenance ontology defines narrow optional structures for provenance contexts, delegation chains, delegation steps, collaborative agent roles, and role types.
- Core SHACL shapes validate reference links, reference catalog ownership, Knop source registries, repository source locators, historical-state revision links, manifestation/file consistency, digest usage, Knop slots, designator paths, and artifact-history invariants.

## Changed Or Stabilized Behavior

- The active core namespace is `https://semantic-flow.github.io/sflo/ontology/`.
- The active config namespace is `https://semantic-flow.github.io/sflo/config/`.
- Release metadata uses plural `releases/` paths.
- `Knop` is the naming/support object for a Semantic Flow identifier; the older separate naming-handle layer is not part of the active model.
- `ArtifactHistory` is the explicit lineage handle for published artifact states; older `ArtifactFlow`, `ArtifactContainer`, `WorkingState`, `CurrentState`, and `ArtifactState` layers are not part of the active model.
- The supported active ontology source is Turtle. Older JSON-LD files in `old/` are historical, not the normative v0.1.0 surface.

## Published Pages Payloads

The local publication worktree for v0.1.0 contains these release payload paths:

- `https://semantic-flow.github.io/sflo/ontology/releases/v0.1.0/ttl/semantic-flow-core-ontology.ttl`
- `https://semantic-flow.github.io/sflo/ontology/shacl/releases/v0.1.0/ttl/semantic-flow-core-shacl.ttl`
- `https://semantic-flow.github.io/sflo/config/releases/v0.1.0/ttl/semantic-flow-config-ontology.ttl`

It also contains current payload files at the Pages root for core, core SHACL, and config.

## Validation Status

The tagged source was inspected for aligned `0.1.0` release metadata and release-path consistency. The documentation pass used Apache Jena `riot` as the available Turtle syntax validator.

The release runbook now records the intended validation commands:

```sh
riot --validate semantic-flow-core-ontology.ttl semantic-flow-core-shacl.ttl semantic-flow-config-ontology.ttl semantic-flow-job-ontology.ttl semantic-flow-prov-ontology.ttl
git diff --check
```

## Known Limitations

- These are pre-1.0 ontologies. Terms and modeling choices may still change without compatibility shims.
- The Pages publication boundary is uneven in v0.1.0: core, config, and core SHACL are project-page-published under `/sflo/`; job and provenance are tagged in source but need an explicit public IRI publication plan.
- The ontology files include release metadata, but the repository does not yet have a dedicated ontology CI workflow.
