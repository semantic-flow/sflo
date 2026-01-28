---
id: tasks-2026-01-18-review-ontologies-core
title: Review Ontologies Semantic Flow Core Guide
desc: ''
updated: 1769480296731
created: 1769480296732
---

# Prompt
Please provide feedback on [guide.ontologies.semantic-flow-core.md](documentation/guide.ontologies.semantic-flow-core.md) and help me:

- update it to be consistent with the latest ontology
- update all the docs in the /documentation folder (one at a time); we can ignore the "completed.*"; for any file renaming, let me do because this is a Dendron vault, and moves or hierarchy refactory (e.g. mesh-resource.component.* -> sf-resource.mesh.component) needs to be done manually.

# ChatGPT documentation suggestions

## Terminology and conceptual corrections to keep

* **Stop defining “namespace” as “nested knops.”** The durable hierarchy is **Nomen paths** (human-facing designators). Knops may exist “behind” Nomina, but “knops nest” is a category mistake that will keep reappearing if the docs don’t explicitly forbid it.
* **Namespace vs site:** you’re converging on “the published namespace is the publishing site base + path,” but you also want **the same mesh publishable in multiple places**. Documentation should treat “publishing context” as variable, and avoid implying there is one true base.
* **Intramesh identifiers → Nomen.** The “identifier fragment/token” idea is misleading; what matters is the **path as a whole** (contextualized in a filesystem/servable region).
* **Single referent principle pressure:** most confusion in the docs came from sliding between:

  * the IRI denoting a world-thing/artifact, vs
  * talking about the identifier *as an object of discourse*.
    The resolved doc direction is the **handle convention** (below).

## Handle conventions that should be documented explicitly

* **Nomen is not “the IRI itself.”** You settled on the handle trick:

  * `/<nomen>/` is the designator IRI that denotes *something else* (person, artifact, etc.)
  * `/<nomen>/_nomen/` denotes the **Nomen-as-Nomen** (the thing that can have metadata about naming, co-denotation, etc.)
* **Flow-compatible metadata layout:** your docs should highlight that the Nomen metadata location is intentionally flow-shaped so history can be enabled later without breaking structure. This supports “drop a file now, weave later.”

## Reference-data modeling changes that are still relevant

* **Reject “hasReferenceData/hasReferenceSource” on the Nomen itself.** The durable move is: model each reference relationship as a **relator**.
* **ReferenceLink relator pattern:** document the split between two ways to point:

  * `target` (IRI term) — expected to **denote a reference-data source**
  * `targetUriLiteral` (`xsd:anyURI`) — expected to **locate retrievable content** without asserting denotation
    This is directly aligned with your single-referent principle: you only treat external URLs as denoters if you can also talk about their nomen-handle (rare today).
* **Roles + expectations live on the relator, not the Nomen:**

  * role(s): Canonical / Integrate / Supplemental / Deprecated
  * `expectedTargetKind` as an enum-ish constraint for validation and operator ergonomics
  * `lastVerifiedAt`, `lastVerifiedBy` (you explicitly preferred these over ambiguous “referenceDate”)
* **Co-denotation:** the still-relevant recommendation is “two-tier”:

  * For SF-compatible co-denoters: link NomenHandles (true co-denotation)
  * For external IRIs where you can’t rely on handles: use the relator’s `targetUriLiteral` or mint a local Nomen as a bridge (your “mint a new Nomen, then relate internally” approach).

## Versioning / immutability documentation clarifications

* **WorkingSlice vs HistoricalSlice:** keep the doc story tight:

  * WorkingSlice may be mutable
  * HistoricalSlice is immutable snapshot
  * You are **not rewriting references at weave time** (this needs to be stated plainly because it is the source of repeated misunderstanding).
* **“Publish independently of weave”** remains a key behavioral invariant: you can push a repo without weaving; consumers may mostly use WorkingSlice locally.
* **Opslogs:** keep them as **plain LocatedFiles** (not flows) unless/until you decide they’re discourse-worthy.

## Artifact layers and naming decisions to keep consistent

* You moved away from a “DigitalArtifact umbrella” and back to **Flow as the primary abstraction** (“artifact over revisions”), with Slice/AbstractFile/LocatedFile as contained layers. Docs should avoid introducing a second umbrella term unless it earns its keep.
* **AbstractFile naming rule:** AbstractFile token defaults to the canonical file’s extension/name; mime-type is optional; “upload a file establishes payload” is the assumed common path.

## Asset handling decisions that should be documented

* **Assets are allowed**, and meshes can contain non-SF files. Don’t claim “every file in a mesh is an SF resource.”
* You converged on:

  * per-knop `_assets/` is fine
  * per-mesh `_assets/` is fine
  * templates are their own knops; template assets live under that template knop’s `_assets/`
  * “knopify assets” should be supported but not required (avoid knob/knop explosion).

## Navigation / discoverability improvements you’re keeping

* Introduce an explicit subtype for artifact-bearing LocatedFiles: `ArtifactLocatedFile`, plus an explicit edge `realizesAbstractFile`.
  This avoids fragile path heuristics (“go to parent folder and hope it’s the abstract layer”).
* Metadata flows have **standardized filenames** for discoverability; payload located filenames may vary via token changes, but old located files persist.

## Open edges your docs should flag (still unresolved)

* **Inventory as dataset vs flow:** you were leaning toward uniform “everything is a flow” for RDF artifacts, but also argued inventory is append-only and could be mutable. Docs should call this a convention choice and state which is normative.
* **Named graphs composition (`includesGraphs`)**: you repeatedly circled the same trap (pinning vs mutability, cross-mesh weave timing). If you drop it, say so; if you keep it, document that including a WorkingSlice is acceptable but warned.

If you want this as a checklist you can paste into your docs repo (e.g., “Documentation TODOs”), say where you’re tracking docs (Dendron vault path / repo) and I’ll format it to match your conventions.

# My response

The "true base" is no base. It might exist in a filesystem somewhere, and it's commonly laid out in a git repo. But the "operational base" floats to whatever the access context is. 

Intramesh identifiers aren't just Nomen, they also include the Knops and any MeshComponents, i.e., a mesh's SemanticFlowResources including the mesh itself, which is referenced via a mesh handle.

Regarding "/<nomen>/ is the designator IRI that denotes something else (person, artifact, etc.)" -- we need a good word for the "parent IRI" that a Nomen (as identified by a _nomen handle) attaches to.

# TODO
- [x] Read the guide for review
- [x] Provide findings and questions
- [x] Review updated core ontology
- [x] Update guide.ontologies.semantic-flow-core.md for ontology alignment
- [x] Update semantic-flow-ontology flow/component classes and denotes comment
- [x] Add NomenInventoryDataset and hasNomenMetadataFlow
- [x] Add sflo-shacl denotes subject constraint
- [x] Refresh sflo-platform-defaults folder tokens
- [x] Update sflo-shacl to current core classes
- [x] Update sflo-platform-defaults for new inventory types
- [x] Clarify Nomen structure in self-containment use case
- [x] Draft Dendron page map (shared in chat)

# Decisions
- None
