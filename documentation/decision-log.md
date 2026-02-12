---
id: qa6hqxy4tknnmutvq13onaq
title: Decision Log
desc: ''
updated: 1769966346737
created: 1762217473475
---

# Project Decision Log

This document records important project-level decisions, organized by date.

## YYYY-MM-DD

### Decision: [Brief title of the decision]

**Context:** [Why the decision was necessary.]

**Outcome:** [The chosen path and rationale.]

**Impact:** [How this decision affects the project.]

---

## 2025-11-04

### Decision: Implementation of Agent Memory Bank System

**Context:** To improve AI agent performance and maintain context across tasks, a structured, git-based memory bank system was required.

**Outcome:** The memory bank system was implemented using a set of dedicated Markdown files in the `documentation/` directory, categorized into "Every Task Context" and "Frequently Referenced" files.

**Impact:**
- Agents are now required to read core context files at the start of every task.
- Task-specific context is maintained in dedicated `tasks.YYYY-MM-DD-task-name.md` files.
- Documentation structure is standardized to avoid repetition and improve navigability (e.g., [[guide.project-brief]] acts as a directory, not a content duplicator).

### Decision: RDF Serialization Format

**Context:** Choosing a primary RDF serialization format for instance data and ontologies.

**Outcome:** JSON-LD was chosen over Turtle/TriG due to its native support for slash-terminated CURIEs, which aligns with the project's IRI naming conventions for distinguishing between files and resource names.

**Impact:** All RDF instance data and ontologies should primarily use JSON-LD.

## 2026-02-01 

### Ontology structure

* Keep a single **Semantic Flow Ontology** (no import-based “module ontologies”).
* Keep `SemanticFlowResource` (not yet renamed), but its comment must reflect **mesh constituency**, not “inside/outside a mesh.”

### Artifact stack and mutability

* Artifact stack is: `DigitalArtifact` → (`AbstractArtifact` → `ArtifactFlow` → States) → (`AbstractFile` → `LocatedFile`).
* `ArtifactFlow` relates **exactly one** `WorkingState` and **exactly one** `CurrentState`, plus **zero or more** `HistoricalState`.
* **Only WorkingState is mutable**; authoring changes occur only in the WorkingState’s authoring bytes (your “WorkingLocatedFile” constraint).
* `latestHistoricalState` is a **derived/operational pointer** and must not be treated as immutable content.

### Operational overlays and “anti-immutable”

* Overlays are **ON by default** via a companion **AntiMetadataArtifact** per `AbstractArtifact`.
* Anti-metadata exists to hold volatile/derived/system-maintained facts (e.g., `latestHistoricalState`, verification timestamps, operational caches).
* Stop-rule: Anti-metadata artifacts **do not** recursively require their own anti-artifacts (prevent infinite regress).

### ReferenceLinks and curation

* ReferenceLinks are **curated** and can grow large; keep them **out of slim structural metadata**.
* Reference links should be stored as one or more **ReferenceLinkSet** artifacts (RDF documents) associated with a container (Nomen/Knop/Mesh), rather than embedded into metadata artifacts.
* A Mesh’s ReferenceLinkSets are for the mesh itself (not “authoritative registry for everything under it”).
* A Nomen’s ReferenceLinkSets can carry the semantic “bridge” when the designatum is not directly denoted by a DigitalArtifact.

### Weave markers

* Do **not** inject NOOP weave markers into Knop metadata when nothing versioned.
* If weave-run bookkeeping is needed, keep it in **operational/overlay data**; the definitive “versioning happened” signal is minting a `HistoricalState`.

### Management space and multiple meshes

* Service can host multiple meshes; use **named graphs** to hold simultaneous mesh states/management info.
* Graph naming default: **graph name = mesh IRI**.
* Treat “mounting the same mesh more than once” as a **service policy** you generally forbid (even if test-mode might allow it later).

### Path token semantics

* “Path segment” definition stands.
* Anything that can encode an IRI with an optional trailing slash is a **relative path token**, not a segment datatype.
* `designatorPath` should explicitly allow optional trailing slash (directory-designator fidelity independent of filesystem).
