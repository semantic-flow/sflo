---
id: t9bdv5vj10qx2ihjhmo56an
title: Artifact Resolution
desc: ''
updated: 1769479932486
created: 1768790804038
---

## Purpose

**Artifact resolution** is the Semantic Flow process that takes a **target identifier** (e.g., from a `ReferenceLink`) and returns a **concrete, retrievable URL** (a `LocatedFile` IRI) for the underlying bytes.

It exists because Semantic Flow routinely talks about artifacts at multiple abstraction levels:

* a **Flow** (artifact lineage)
* a **Slice** (one version)
* an **AbstractFile** (one representation of a slice)
* an **ArtifactLocatedFile** (one concrete location)

Artifact resolution is how UIs, extractors, and validators reliably “get the right bytes” without hardcoding where they live.

## What it must not do

Artifact resolution must not silently invent semantics:

* It must not claim a target denotes a data source unless that is explicitly represented.
* It must not hide which choices it made (slice choice, representation choice, location choice).

Any non-trivial choice must be explainable (and ideally recordable) as resolution metadata.

## Inputs

### Target

Artifact resolution accepts a **target** that is one of:

* **`ArtifactLocatedFile`**: already concrete; return it.
* **`LocatedFile`**: already concrete; return it (but it may not be SF-artifact-located).
* **`AbstractFile`**: choose a suitable `ArtifactLocatedFile` under it.
* **`Slice`**: choose a suitable `AbstractFile` then `ArtifactLocatedFile`.
* **`Flow`**: choose a suitable `Slice` (often Working) then `AbstractFile` then `ArtifactLocatedFile`.

### Preferred Formats (Optional)

tbd

## Outputs

The primary output is a single URL/IRI:

* a `LocatedFile` IRI suitable for retrieval

Optionally return a structured explanation (“resolution trace”):

* chosen Slice (if starting from Flow)
* chosen AbstractFile (representation/mimetype)
* chosen ArtifactLocatedFile (location)
* warnings (e.g., resolved via WorkingSlice, no canonical representation, mismatch with `expectedTargetKind`)

## Resolution policy knobs

Artifact resolution should be deterministic under a declared policy. A minimal policy includes:

1. **Slice preference** (when given a Flow)

   * default: prefer **WorkingSlice**
   * optional: prefer latest woven HistoricalSlice (if explicitly requested by consumer)

2. **Representation preference** (when multiple AbstractFiles exist)

   * prefer a canonical AbstractFile if one is marked
   * else prefer by MIME priority list (e.g., `text/turtle` before `application/ld+json`, etc.)
   * else prefer by extension priority list

3. **Location preference** (when multiple ArtifactLocatedFiles exist)

   * prefer canonical location if one is marked
   * else prefer in-mesh location
   * else prefer https over http, etc.

These policies belong in config, not hidden in code.

## Canonical behavior by target kind

### A. Target is an ArtifactLocatedFile

Return the target.

### B. Target is a LocatedFile

Return the target.

Note: this may be a resource page or a non-artifact support file. Resolution does not “upgrade” it.

### C. Target is an AbstractFile

Choose an `ArtifactLocatedFile`:

* if the AbstractFile has a canonical located file: use it
* else pick via location preference

### D. Target is a Slice

Choose an AbstractFile:

* if the Slice has a canonical AbstractFile: use it
* else pick via representation preference

Then resolve to an ArtifactLocatedFile.

### E. Target is a Flow

Choose a Slice:

* default: WorkingSlice
* if the consumer requests “pinned”: prefer latest woven HistoricalSlice

Then resolve Slice → AbstractFile → ArtifactLocatedFile.

## Examples

### Example 1 — ReferenceLink targets a Flow

A ReferenceLink points to an ontology artifact over time:

* `ReferenceLink.target = <…/sflo/_knop/_payload/>` (a Flow)

Artifact resolution produces a concrete URL such as:

* choose WorkingSlice: `<…/sflo/_knop/_payload/_working/>`
* choose representation: `<…/sflo/_knop/_payload/_working/ttl/>` (AbstractFile)
* choose located file: `<…/sflo/_knop/_payload/_working/ttl/sflo.ttl>` (ArtifactLocatedFile)

Result: a retrievable TTL URL.

### Example 2 — ReferenceLink targets a pinned Slice

* `ReferenceLink.target = <…/sflo/_knop/_payload/v12/>` (a HistoricalSlice)

Resolution does not need to pick a slice, only a representation and location.

Result: a stable URL for v12.

### Example 3 — ReferenceLink targets an AbstractFile

* `ReferenceLink.target = <…/sflo/_knop/_payload/v12/ttl/>`

Resolution selects the canonical ArtifactLocatedFile under that representation.

Result: directly retrieves the TTL distribution for v12.

### Example 4 — ReferenceLink targets an ArtifactLocatedFile

* `ReferenceLink.target = <…/sflo/_knop/_payload/v12/ttl/sflo.ttl>`

Resolution is identity: the target is already retrievable.

### Example 5 — ReferenceLink uses targetUriLiteral

* `ReferenceLink.targetUriLiteral = "https://example.org/ontology.ttl"^^xsd:anyURI`

Resolution returns the URL as-is (it locates content). Semantic Flow does not assume what it denotes.

## Constraints and failure modes

* **Missing canonical representation**: if multiple AbstractFiles exist and none is canonical, policy must define MIME/extension ordering.
* **WorkingSlice used**: warn if resolution ends at a WorkingSlice when the caller requested pinned.
* **Mismatch with expectedTargetKind**: if `ReferenceLink.expectedTargetKind` is present, warn when the resolved chain contradicts it.
* **Non-SF targets**: when a target is outside SF conventions, only `targetUriLiteral` is reliably retrievable.

## Relationship to ReferenceLinks

ReferenceLinks become far more useful when they can point at any abstraction level:

* target Flow when you mean “this artifact over time”
* target Slice when you mean “that exact version”
* target AbstractFile when you mean “that version, that representation”
* target ArtifactLocatedFile when you mean “that exact URL”

Artifact resolution is the uniform mechanism that turns any of those into “the right URL for the data.”

## Open decisions

* Whether artifact resolution should accept **Knop** as an input (and if so, whether that implies “payload flow working slice”).
* Whether resolution traces should be materialized as RDF (for caching, auditability, and UI explainability).
* How representation priority is configured (global defaults vs per-mesh vs per-flow).
