---
id: yjja497yn507gmnvo4xgib2
title: 2026 05 03 Enumeration Type Instances
desc: ''
updated: 1777955567657
created: 1777870909784
---

## Goals

- Replace hierarchical PascalCase controlled-value IRIs such as `ReferenceRole/Canonical` and `ArtifactResolutionMode/Current` with flat camelCase individuals.
- Avoid slash-based enum values so Turtle, JSON-LD, SPARQL, and CLI/generated-code consumers do not need escaped prefixed names such as `sflo:ArtifactResolutionMode\/Current`.
- Keep class IRIs such as `ReferenceRole`, `ArtifactResolutionMode`, and `JobKind` stable unless a separate modeling problem requires changing the classes themselves.
- Use human-readable `rdfs:label` values for display legibility rather than encoding display text in the IRI.
- Coordinate the enum migration with the next fixture ladder rerunging pass, especially [[wd.task.2026.2026-05-04-split-extraction-from-page-selection]], so Alice Bio and Fantasy Rules are not rerung twice for closely related ontology vocabulary churn.

## Summary

The current ontologies model controlled values as hierarchical IRIs with PascalCase terminal segments, for example:

```ttl
<ReferenceRole/Canonical> a <ReferenceRole> .
<ArtifactResolutionMode/Current> a <ArtifactResolutionMode> .
<JobKind/MeshCreate> a <JobKind> .
```

That shape is readable as full IRIs, but it is awkward for prefixed Turtle and inconsistent with the current desire for ordinary term-like identifiers. The intended replacement is flat camelCase controlled-value individuals, preferably with the type name as a prefix:

```ttl
<referenceRoleCanonical> a <ReferenceRole> ;
  rdfs:label "Canonical" .

<artifactResolutionModeCurrent> a <ArtifactResolutionMode> ;
  rdfs:label "Current" .

<jobKindMeshCreate> a <JobKind> ;
  rdfs:label "mesh create" .
```

This keeps enum instances visually distinct from classes without requiring path hierarchy. It also lets generated RDF use the ontology's preferred namespace prefix `sflo:` cleanly, for example `sflo:referenceRoleCanonical`.

The migration affects ontology files, Weave constants/tests, fixture RDF, Accord manifests, and docs/spec examples that assert exact IRIs.

## Discussion

Two alternatives were considered:

- hierarchical camelCase values such as `ReferenceRole/canonical`
- flat values such as `referenceRoleCanonical`

Hierarchical camelCase keeps a type/value visual grouping, but it still requires escaping in prefixed Turtle and carries the same cross-library risk as the current pattern. Flat values avoid that problem and align with ordinary RDF vocabulary practice. The display label stays available through `rdfs:label`, so the IRI does not need to preserve `Canonical` or `Current` as a PascalCase segment.

Hyphenated forms such as `referenceRole-Canonical` are more legible at a glance, but they preserve PascalCase in the value portion and introduce a special delimiter convention that differs from the rest of the ontology. The preferred shape is lower camelCase throughout.

The change should not be treated as a compatibility migration. Semantic Flow is still pre-v1, and carrying aliases for every old enum IRI would make generated RDF and fixture tests harder to reason about. If temporary aliases are needed while branches are being repaired, they should stay local and short-lived.

Known affected controlled vocabularies include at least:

- `ReferenceRole`: `ReferenceRole/Canonical`, `ReferenceRole/Supplemental`, `ReferenceRole/Deprecated`
- `ArtifactResolutionMode`: `ArtifactResolutionMode/Pinned`, `ArtifactResolutionMode/Current`
- `ArtifactResolutionFallbackPolicy`: `ArtifactResolutionFallbackPolicy/ExactOnly`, `ArtifactResolutionFallbackPolicy/AcceptLatestInRequestedHistory`
- `JobKind`: `JobKind/MeshCreate`, `JobKind/KnopCreate`, `JobKind/KnopAddReference`, `JobKind/Integrate`, `JobKind/Version`, `JobKind/Validate`, `JobKind/Generate`, `JobKind/Weave`
- `JobStatus`: `JobStatus/Accepted`, `JobStatus/Running`, `JobStatus/Succeeded`, `JobStatus/Failed`, `JobStatus/Cancelled`
- `RoleType`: `RoleType/DataExtraction`, `RoleType/QualityAssurance`, `RoleType/FinalApproval`, `RoleType/Coordination`

The Fantasy Rules ontology also carries domain-specific enum-like individuals such as alignment values. Those are not the primary target of this task unless they follow the same class-enumeration anti-pattern inside Semantic Flow ontology files. Domain vocabulary may legitimately use slash-path term IRIs when the domain wants dereferenceable term pages.

## Open Issues

- Confirm whether any controlled values outside the currently known list should be migrated in the same pass.
- Decide whether old enum IRIs should be removed outright or left as deprecated individuals in ontology files. Current preference is removal/no alias for pre-v1 clarity.
- Decide whether SHACL should explicitly enforce the new enum value IRIs anywhere, or whether ordinary RDF/manifest tests are enough for the migration.
- Coordinate exact fixture branch repair order with the Weave split-extraction/page-selection task so re-runging happens once.

## Decisions

- Use flat camelCase individuals for controlled enum values.
- Prefix the individual local name with the enum class name in lower camelCase, for example `referenceRoleCanonical` and `artifactResolutionModeCurrent`.
- Keep enum classes themselves as PascalCase class IRIs.
- Prefer `rdfs:label` for display strings such as "Canonical", "Current", and "mesh create".
- Do not use slash hierarchy for enum values.
- Do not use hyphenated enum values such as `referenceRole-Canonical` for the first pass.
- Do not add broad backward-compatibility shims unless a short local repair step absolutely requires them.

## Contract Changes

- Semantic Flow enum instance IRIs move from hierarchical PascalCase paths to flat camelCase names.
- RDF examples, generated support artifacts, Accord manifests, SHACL tests, and Weave constants must use the new enum IRIs.
- JSON-LD contexts and API examples that mention enum values must be updated to the new term IRIs.
- Existing fixture branches that assert old enum IRIs are no longer canonical once rerunging is complete.

## Testing

- Validate changed ontology Turtle files with RDF syntax validation.
- Run ontology SHACL validation if available for the affected files.
- Update Weave unit/integration/e2e tests that assert enum IRIs.
- Search the workspace for old enum IRI fragments such as `ReferenceRole/`, `ArtifactResolutionMode/`, `JobKind/`, `JobStatus/`, and `RoleType/` after the migration.
- Rerun the fixture conformance tests after Alice Bio and Fantasy Rules branches are repaired.
- Validate updated Accord manifests after branch repair.

## Non-Goals

- Renaming enum classes such as `ReferenceRole` or `ArtifactResolutionMode`.
- Designing a general SKOS concept scheme for every controlled vocabulary.
- Changing domain ontology term IRIs that intentionally use slash paths for dereferenceable public terms.
- Preserving old enum IRIs as long-term aliases.
- Solving page-selection or ReferenceLink behavior directly; this task only settles the controlled-value naming convention those features should use.

## Implementation Plan

- [ ] Inventory all enum-like controlled values in Semantic Flow ontology files and classify which are in scope.
- [ ] Update core ontology enum individuals to flat camelCase names.
- [ ] Update job ontology enum individuals to flat camelCase names.
- [ ] Update provenance ontology enum individuals to flat camelCase names.
- [ ] Update SHACL, JSON-LD examples, and ontology notes that refer to old enum IRIs.
- [ ] Update Weave constants and rendered Turtle templates for `ReferenceRole`, `ArtifactResolutionMode`, and any other enum values it emits or parses.
- [ ] Update Weave tests and fixtures that assert old enum IRIs.
- [ ] Rerung Alice Bio from the first affected ReferenceLink branch when coordinated with the page-selection split.
- [ ] Rerung Fantasy Rules from the first affected term-extraction branch when coordinated with the page-selection split.
- [ ] Record exact reproduction commands for every rerunged transition manifest or conformance README entry while repairing the ladders.
- [ ] Run focused ontology validation, Weave lint/check/tests, and conformance validation for the repaired ladders.
