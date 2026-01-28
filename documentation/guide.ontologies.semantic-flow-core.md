---
id: 5xnb5j3t2sgokorr9rxqyky
title: Semantic Flow Core
desc: ''
updated: 1769482202326
created: 1768704613041
---
## Foundations

* **MeshResource** — Any resource governed by Semantic Flow conventions and intended to live *inside a mesh*.
* **Mesh** *(MeshResource)* — A servable filesystem region that contains MeshResources (and, optionally, other non-mesh resources).

  * Mesh root handle is `_mesh/`.
  * Mesh declares **`sflo:meshBase`** *(xsd:anyURI literal)* as the canonical BASE intended for in-mesh RDF files.
* **LocatedFile** — A file-like IRI intended to retrieve concrete bytes (typically with an extension). LocatedFiles may be in-mesh or external.
* **ResourcePage** *(LocatedFile; schema:WebPage)* — A derived UI/navigation file (e.g., `index.html`) that presents some referent to humans.

## Naming

* **Nomen** *(ArtifactHost)* — A naming-object resource (conventionally denoted with a reserved `_nomen/` path) that corresponds to a mesh token (`meshPath`) and holds metadata about what that token is “about” via reference data. A Nomen may also function as a namespace prefix for subordinate Nomens under its path.

  * **Important:** the *designator token* (e.g., `people/alice/`) is **not** the Nomen. The Nomen is conventionally at `people/alice/_nomen/`.
  * **`sflo:meshPath`** *(string)* — The mesh-relative token the Nomen is “for”. Convention: the empty string (`""`) denotes the root token.
  * **`sflo:hasChildNomen`** *(derived/operational)* — Convenience adjacency; not a source of truth (truth is meshPath + filesystem layout).
  * A Nomen may specify, via **ReferenceLink**, additional sources of reference data about its designatum (when known) or its intended interpretation (when not).
* **NomenComponent** *(MeshResource; documentation/SHACL convenience)* — Reserved components under a Nomen (e.g., nomen metadata flow, inventories).

## Reference links

* **ReferenceLink** — Relator describing a reference-data link from a Nomen to a specific reference source.

  * **`sflo:referenceTarget`** *(IRI, optional)* — A denoting identifier for a reference source (e.g., a dataset IRI, an external vocabulary term IRI, a mesh artifact IRI).
  * **`sflo:targetUriLiteral`** *(xsd:anyURI, optional)* — A retrievable location *without* asserting denotation.
  * **`sflo:referenceRole`** *(0..n)* — Role(s) describing how the link is used.
  * **`sflo:lastVerifiedAt`**, **`sflo:lastVerifiedBy`** *(optional)*.
  * **`sflo:referenceLinkForNomen`** — Backpointer to the Nomen the ReferenceLink is about.
* **ReferenceRole** — Controlled vocabulary for how a ReferenceLink should be used.

  * **ReferenceRoleCanonical** — Canonical.
  * **ReferenceRoleIntegrate** — Integrate into resource page.
  * **ReferenceRoleSupplemental** — Supplemental.
  * **ReferenceRoleDeprecated** — Deprecated.

## Containers

* **Knop** *(MeshResource)* — SF container anchored at a stable in-mesh location (e.g., `_knops/<uuid>/`); hosts payload + operational/supporting artifacts.


## Digital artifacts and revisions

* **DigitalArtifact** — Umbrella for artifacts SF manages as artifacts (not “things in the world” like Alice).
* **FlowArtifact** *(DigitalArtifact; MeshResource)* — Artifact with revision history.

  * Has **`sflo:hasSlice`** *(1..n)*.
  * Has **`sflo:currentSlice`** *(0..1)*; if present, it **must be a WorkingSlice** (enforced in SHACL).
* **Slice** *(MeshResource)* — A revision in a FlowArtifact’s history (a revision *itself*, not a thing with its own revision history).

  * **WorkingSlice** — Mutable current state.
  * **HistoricalSlice** — Immutable published snapshot.
* **SimpleArtifact** *(DigitalArtifact; MeshResource)* — Artifact without slice history (single-state artifact).

## Realizations

* **AbstractFile** — A file-based, specific (format/syntax/bundling/canonicalization) realization of some digitally-representable thing. AbstractFile is general and may be external or in-mesh.

* **AbstractArtifactFile** *(AbstractFile; MeshResource)* — An AbstractFile that participates in mesh-governed artifact realization.

* **LocatedArtifactFile** *(LocatedFile; MeshResource)* — A mesh-governed LocatedFile that locates an AbstractArtifactFile.

* Realization links:

  * **`sflo:hasAbstractFile`** — From **Slice** and **SimpleArtifact** to **AbstractFile** (how the content can be realized).
  * **`sflo:hasLocatedFile`** / **`sflo:locatesAbstractFile`** — AbstractFile ↔ LocatedFile (inverses).
  * **`sflo:hasLocatedArtifactFile`** / **`sflo:locatesAbstractArtifactFile`** — AbstractArtifactFile ↔ LocatedArtifactFile (inverses).

## RDF payload types

* **RdfDataset** — Marker/content-kind class for RDF dataset content (default graph + 0..n named graphs). Used as a payload kind and for inventories.

## Operational indices

* **MeshInventoryDataset** — Optional derived index for mesh-level explorability.
* **KnopInventoryDataset** — Optional derived index for knop-level explorability.
* **NomenInventoryDataset** — Optional derived index for nomen-level explorability.

*(Whether these are modeled as SimpleArtifacts, or merely as “RdfDataset-kind things”, is still a design choice—your SHACL currently treats “realizable via hasAbstractFile” as the core invariant for content-bearing objects.)*

## Reserved/system resources

* **Underscore folders** *(convention)* — `_mesh/...`, `_knops/...`, and per-resource reserved subtrees (including `_nomen/` for naming-objects).
* **Asset folders** *(convention)* — `_mesh/_assets/...` (mesh shared) and per-Knop assets under `<knop>/_assets/...`. Templates are Knops, so template assets live in their Knop `_assets/`.
