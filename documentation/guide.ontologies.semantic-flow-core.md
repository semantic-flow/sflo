---
id: 5xnb5j3t2sgokorr9rxqyky
title: Semantic Flow Core
desc: ''
updated: 1768796900743
created: 1768704613041
---

## Foundations

* **SemanticFlowResource** — Any resource participating in SF conventions.
* **Mesh** — A servable filesystem region that contains SemanticFlowResources and, optionally, other supporting resources.
  * Mesh root handle is `/_mesh/`.
* **AbstractResource** *(SemanticFlowResource)* — Slash IRI (`/`); dereferencing yields a resource page.
* **LocatedFile** *(SemanticFlowResource; TargetKind)* — File IRI (typically with an extension) intended to retrieve concrete bytes.
* **ResourcePage** *(LocatedFile; schema:WebPage)* — A derived UI/navigation file (e.g., `index.html`) that presents an AbstractResource (or other referent) to humans.
* **ArtifactLocatedFile** *(LocatedFile; TargetKind)* — A LocatedFile that is a concrete realization of an AbstractFile.
* **AssetFile** *(LocatedFile)* — A non-artifact support file used by resource pages (images/css/js), conventionally under `_assets/`.

## Naming

* **Nomen** *(AbstractResource; TargetKind)* — A human-facing Designator IRI (Designator) (e.g., `/people/alice/`) intended to denote a discourse-worthy thing, including other Nomina as aliases.
* **NomenComponent** *(MeshComponent)* — Reserved components under a Nomen (e.g., NomenHandle, Nomen flows, inventories).
* **NomenHandle** *(AbstractResource; NomenComponent)* — The naming-object handle for a Nomen (e.g., `/people/alice/_nomen/`); is the subject of denotation and reference-link metadata (via NomenMetadataFlow, which may remain WorkingSlice-only until history is woven).

## Reference links

* **ReferenceLink** — Relator describing a reference-data link from a NomenHandle to a specific reference source; uses `target` (denoting IRI) or `targetUriLiteral` (retrievable location), plus `expectedTargetKind`, `lastVerifiedAt`, `lastVerifiedBy`.
* **ReferenceRole** — Controlled vocabulary for how a ReferenceLink should be used.
* **ReferenceRoleCanonical** — Canonical.
* **ReferenceRoleIntegrate** — Integrate into resource page.
* **ReferenceRoleSupplemental** — Supplemental.
* **ReferenceRoleDeprecated** — Deprecated.
* **TargetKind** — Metaclass used to constrain expected target kinds for ReferenceLinks (e.g., Nomen, Flow, Slice, AbstractFile, ArtifactLocatedFile, LocatedFile).

## Containers

* **Knop** *(AbstractResource)* — SF container anchored at a stable in-mesh location; hosts payload and supporting flows.
* **KnopComponent** *(AbstractResource; MeshComponent)* — Reserved components under a Knop (payload/supporting flows and their parts).

## Artifacts and versioning

* **Flow** *(AbstractResource; TargetKind)* — Artifact over revisions; organizes Slices and provides a stable artifact identity; has `sflo:artifactKind`.
* **KnopFlow** *(Flow; KnopComponent)* — A Flow that is a component of a Knop.
* **NomenFlow** *(Flow; NomenComponent)* — A Flow that is a component of a NomenHandle.
* **MeshFlow** *(Flow; MeshComponent)* — A Flow that is a component of the mesh (mesh-level).
* **Slice** *(AbstractResource; MeshComponent; TargetKind)* — A particular revision of the artifact represented by a Flow. 

  * **WorkingSlice** — Mutable current state.
  * **HistoricalSlice** — Immutable published snapshot.
* **AbstractFile** *(AbstractResource; MeshComponent; TargetKind)* — A representation specification of a Slice (format/syntax/canonicalization/bundling).
* **DatasetSeries** *(AbstractResource; dcat:DatasetSeries)* — A series/partitioning of related dataset artifacts.

## RDF payload types

* **RdfDataset** — RDF dataset content: default graph + 0..n named graphs; default graph may be empty. Used as a Flow artifact kind and for non-flow inventories.
* **RdfGraph** — RDF graph content: exactly one graph (default graph only; may be empty).
* **NamedGraph** — A graph identified by a graph-name IRI (interpretation depends on whether you denote a Flow, a HistoricalSlice, or a WorkingSlice).

## Supporting flows

* **SupportingFlow** *(Flow)* — A non-payload flow used for metadata/inventory/auxiliary artifacts.
* **PayloadFlow** *(KnopFlow)* — The primary digital-artifact flow hosted by a Knop.
* **KnopMetadataFlow** *(SupportingFlow; KnopFlow)* — Small, discoverable: structure/pointers/summary inventory for the Knop.
* **MeshMetadataFlow** *(SupportingFlow; MeshFlow)* — Optional mesh-level operational metadata/config.
* **NomenMetadataFlow** *(SupportingFlow; NomenFlow)* — Metadata about a NomenHandle; may remain WorkingSlice-only until history is recorded.

## Operational indices and logs

* **MeshInventoryDataset** *(RdfDataset; MeshComponent)* — Optional derived index for explorability at the mesh level (non-flow; may be large/sharded).
* **KnopInventoryDataset** *(RdfDataset; KnopComponent)* — Optional derived index for explorability at the knop level (non-flow; may be large/sharded).
* **NomenInventoryDataset** *(RdfDataset; NomenComponent)* — Optional derived index for explorability at the nomen handle level (non-flow; may be large/sharded).
* **OperationalLogFile** *(LocatedFile)* — A plain tool log file (not discourse-worthy by default).

## Reserved/system resources

* **MeshComponent** *(AbstractResource)* — Reserved underscore-path/system resources (e.g., `_mesh/`, `_knops/`, `_assets/`, inventories, configs).
* **Asset folders** *(convention)* — `/_mesh/_assets/…` (mesh shared) and `<knop>/_assets/…` (per Knop). Templates are Knops, so template assets live in their Knop `_assets/`.
