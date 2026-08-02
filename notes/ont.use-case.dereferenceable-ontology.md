---
id: 59rqh5ol6vzigj2uapkj4tu
title: Dereferenceable Ontology Publishing
desc: 'publishing ontology and SHACL artifacts with stable identifiers, byte-dereferenceable versions, and Semantic Flow histories'
updated: 1777704958854
created: 1777704611737
---

## Purpose

Dereferenceable ontology publishing is the use case where a project publishes ontology, SHACL, and related semantic-web artifacts at stable public IRIs. The public surface needs to satisfy ordinary RDF/OWL tooling, human readers, and project governance at the same time: current ontology IRIs should resolve, versionIRIs should retrieve the expected bytes, documentation pages should be inspectable, and release history should remain durable.

The core tension is that ontology projects have two layouts. The authoring layout belongs to the project and may change as maintainers reorganize source files, examples, generated outputs, tests, release automation, or build scripts. The public mesh layout should be more stable because it carries identifiers, resource pages, and historical snapshots that downstream users may cite.

## Typical Publishers

* a standards group or working group publishing a formal vocabulary
* an open-source project publishing an ontology plus validation shapes
* a domain community maintaining RDF terms, SHACL constraints, examples, and release documentation
* a company publishing an interchange ontology whose public IRIs need to survive normal repository refactors

## User Needs

* publish a stable ontology IRI such as `/ontology`
* publish a stable SHACL shapes-graph IRI such as `/shacl`
* keep current ontology and SHACL documents dereferenceable as RDF files
* publish versioned ontology and SHACL bytes at stable release URLs
* let `owl:versionIRI` point somewhere that RDF tooling can fetch the version document
* expose richer artifact/version structure without forcing every Semantic Flow detail into the ontology document itself
* support independent versioning of ontology, SHACL, generated documentation, examples, and other companion artifacts
* keep source files in natural authoring locations while publishing a stable Pages-compatible mesh

## Semantic Flow Shape

The ontology and the SHACL graph are `DigitalArtifact`s. In many cases they are also `PayloadArtifact`s and `RdfDocument`s. The ontology artifact may also be typed as `owl:Ontology`; the SHACL artifact may be typed as both `owl:Ontology` and `sh:ShapesGraph` when the shapes graph carries ontology-style metadata.

Each published artifact can have its own `ArtifactHistory`. Each release is a `HistoricalState`. Each concrete serialization for that state is an `ArtifactManifestation`, and the retrievable file bytes are `LocatedFile`s.

For an ontology artifact, the public shape is typically:

* `/ontology` identifies the current ontology artifact
* `/ontology/releases` identifies the ontology artifact history
* `/ontology/releases/v0.2.0` identifies the `HistoricalState` for ontology version `0.2.0`
* `/ontology/releases/v0.2.0/ttl` identifies the Turtle manifestation for that state
* `/ontology/releases/v0.2.0/ttl/example-ontology.ttl` identifies the located Turtle file bytes

The same pattern can be used independently for SHACL:

* `/shacl` identifies the current SHACL artifact
* `/shacl/releases` identifies the SHACL artifact history
* `/shacl/releases/v0.2.0` identifies the `HistoricalState` for SHACL version `0.2.0`
* `/shacl/releases/v0.2.0/ttl` identifies the Turtle manifestation for that state
* `/shacl/releases/v0.2.0/ttl/example-shacl.ttl` identifies the located Turtle file bytes

This artifact-local release path keeps versioning flexible. The ontology and SHACL can move together when that is useful, but the URL design does not require all artifacts in the repo to share one global release path.

## OWL Compatibility

Semantic Flow and OWL use "version" slightly differently. In Semantic Flow, the version identity is the `HistoricalState`. In OWL practice, `owl:versionIRI` is expected to identify something that can retrieve the ontology document bytes.

For tool compatibility, the ontology file should usually point `owl:versionIRI` at the versioned `LocatedFile`, not at the abstract `HistoricalState`.

For example:

```turtle
<https://example.org/project/ontology>
    a owl:Ontology, sflo:DigitalArtifact ;
    owl:versionIRI <https://example.org/project/ontology/releases/v0.2.0/ttl/example-ontology.ttl> ;
    dcat:hasVersion <https://example.org/project/ontology/releases/v0.2.0> .
```

That lets OWL tooling retrieve the versioned Turtle file while Semantic Flow-aware tooling can still follow `dcat:hasVersion` or the mesh inventory to the richer historical-state graph.

## What Belongs In The Ontology File

The ontology document should stay mostly normal OWL/RDF. It can carry stable publication metadata such as title, description, creators, license, modified date, ontology IRI, and `owl:versionIRI`.

The full Semantic Flow artifact graph does not need to be repeated inside the ontology file. The mesh inventory and support artifacts can carry the richer structure: artifact histories, latest states, manifestations, located files, generated resource pages, and operational links to working files.

This keeps the ontology usable by ordinary semantic-web tools while still giving Semantic Flow enough structure to publish durable resource pages and historical snapshots.

## Repository Shape

Ontology projects should usually use a sidecar mesh rather than a whole-repo mesh. Ontology repositories often contain source Turtle, generated files, examples, scripts, editorial notes, validation reports, issue templates, release automation, and other material that should not automatically become public mesh surface.

A sidecar layout keeps the public mesh boundary explicit. A common shape is:

* `ontology/` for authored ontology source
* `shacl/` for authored SHACL source
* `examples/` or `test/` for project examples and validation fixtures
* `docs/` as the Semantic Flow sidecar mesh and GitHub Pages root

The mesh can use `workingLocalRelativePath` to point from the sidecar mesh to adjacent repo-local source files. When versioning is enabled, woven release snapshots should still be materialized inside the mesh by default so published historical bytes remain under the public mesh root.

Whole-repo meshes are still useful for fixture repositories and deliberately mesh-native reference publications. They are usually the wrong default for active ontology projects because normal source-tree movement would churn public identifiers, and generated resource pages could accidentally expose more of the repo than intended. See [[wu.repository-options]] for the broader repository-topology distinction.

## Fixture Direction

A good fixture for this use case should be small but real: a tiny ontology, a tiny SHACL graph, and a docs-rooted sidecar mesh. It should exercise `owl:Ontology`, `sh:ShapesGraph`, `RdfDocument`, `workingLocalRelativePath`, `owl:versionIRI`, artifact-local release paths, and copy-on-weave historical snapshots without trying to model a large domain.

The fixture should prove the ontology-publishing mechanics, not the completeness of the domain ontology. A small SRD-inspired ontology or similar public-domain/open-license vocabulary is enough if it demonstrates the real publication pressure: stable ontology and SHACL IRIs, versioned bytes, generated pages, and source files that live adjacent to the mesh rather than inside it.
