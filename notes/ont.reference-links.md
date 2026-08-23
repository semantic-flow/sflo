---
id: 6054e8641r44dyitwgx0ite
title: Reference Links
desc: ''
updated: 1775175668572
created: 1775175668572
---

## Purpose

This note captures the current serialization and generation rules for `ReferenceCatalog` and `ReferenceLink`.

Use it as the detailed companion to [[ont.summary.core]]. The summary note should stay compact; the path, fragment-IRI, and dereferenceability rules belong here.

## Core Model

- `ReferenceCatalog` is a narrow support artifact for managed `ReferenceLink` relators.
- A `ReferenceCatalog` is owned by a `Knop` or `SemanticMesh`, but its contents are about the referent or mesh subject rather than about the support object as such.
- `referenceLinkFor` points to the actual subject resource, not to a `Knop`.
- `hasReferenceSource` points to the `ReferenceSource` that identifies the RDF reference data used by the link.
- `ReferenceSource` is an `ArtifactResolutionSpec` subclass. It uses generic target-resolution vocabulary such as `targetArtifact`, `targetHistoricalState`, `targetAccessUrl`, and repository locator properties.
- A first-slice `ReferenceSource` that uses `targetArtifact` should target an `RdfDocument`. Non-RDF content such as Markdown page prose does not belong in `ReferenceLink`.

`verifiedAt` and `verifiedBy` remain latest-verification convenience fields on `ReferenceLink`. They do not yet imply a separate verification object model.

If source verification is intentionally recorded, the `ReferenceSource` should link to an `ArtifactResolutionObservation` with `hasResolutionObservation`. Ordinary page generation or source reads should not append observation records merely because bytes were resolved.

Example:

```turtle
<alice/_knop/_references#reference001> a sflo:ReferenceLink ;
  sflo:referenceLinkFor <alice> ;
  sflo:hasReferenceRole sflo:referenceRole_canonical ;
  sflo:hasReferenceSource <alice/_knop/_references#reference001-source> .

<alice/_knop/_references#reference001-source> a sflo:ReferenceSource ;
  sflo:targetArtifact <alice/bio> ;
  sflo:targetHistoricalState <alice/bio/_history001/_s0002> .
```

## Serialization Direction

For a Knop-owned catalog, the support artifact lives under the Knop:

- `D/_knop/_references`
- `D/_knop/_references/references.ttl`
- `D/_knop/_references/index.html`
- `D/_knop/_references/_historyNNN/_sNNNN/...`

For a mesh-owned catalog, the parallel direction is:

- `_mesh/_references`
- `_mesh/_references/references.ttl`

This keeps `ReferenceCatalog` aligned with other support artifacts such as `_meta` and `_inventory`.

## ReferenceLink Identity

`ReferenceLink` identities should be stable fragment IRIs rooted at the catalog resource itself.

For example:

- `<alice/_knop/_references#reference001>`
- `<alice/_knop/_references#reference001-source>` for the companion `ReferenceSource`

Use the same mesh-root `@base` everywhere in the mesh or sub-mesh, and write the full mesh-root-relative fragment IRI explicitly. Do not use bare `<#reference001>` in historical snapshots, because that would re-root the identity to the snapshot document instead of preserving the stable catalog-fragment IRI.

Historical `references.ttl` snapshots must reassert the same `ReferenceLink` IRIs as the current catalog when the same links are present.

## Dereferenceability

There is one current `ReferenceCatalog` page per catalog resource:

- `D/_knop/_references/index.html`

That current page is the dereference target for all fragment IDs rooted at the catalog resource.

Because fragment dereference always resolves against the current resource page, the current page must preserve anchors for:

- current links from the working `references.ttl`
- retired links that are no longer present in the working catalog but still exist in catalog history

In practice this means the page generator should consult both:

- the current working `references.ttl`
- historical `ReferenceCatalog` snapshots

If a link is no longer current, the current page may render it as retired or withdrawn, but it should still keep a stable anchor so historical fragment IRIs remain meaningfully dereferenceable.

If historical link-name collisions are detected while scanning current plus prior catalog states, generation should surface that clearly rather than silently collapsing them.

## Generation Rules

- The current catalog page should list current links.
- The current catalog page should also retain anchors for retired links recovered from history.
- Historical catalog pages may render only the state-local view.
- This pass does not require one standalone ResourcePage per `ReferenceLink`.

## Scope Boundaries

- `ReferenceCatalog` is for `ReferenceLink` relators only.
- `ReferenceLink` is for curated RDF reference data; do not use it for page prose, Markdown imports, image assets, or generic source provenance.
- `ReferenceSource` helper nodes may live in the same catalog because they are immediate source bindings for the links.
- Broader descriptive RDF about the referent should normally live in a payload artifact or dataset.
- A bounded create-time exception may live in the Knop's optional `FoundingReferentData` artifact. That artifact carries a small, single-referent initialization record and is discovered with `hasFoundingReferentData`; it is not a `ReferenceCatalog`, does not create a `ReferenceLink`, and does not identify separately resolved source bytes.
- This note does not broaden `ReferenceCatalog` to cover `owl:sameAs` or arbitrary referent description.
