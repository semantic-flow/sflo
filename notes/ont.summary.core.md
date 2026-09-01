---
id: 0vwvn9y166clpweuy52ob10
title: Core Ontology Summary
desc: ''
updated: 1773890897593
created: 1773756686863
---

## Purpose

This note is a compact mental model for the current `semantic-flow-core-ontology.ttl`.

Use it to stay aligned with the live core vocabulary and to avoid reintroducing older model layers that have already been removed.

## Core Mental Model

- A `SemanticMesh` is a namespace region together with its supporting resources, typically overlaid onto a file tree or filesystem region.
- A public Semantic Flow identifier IRI like `D` denotes the referent.
- A `Knop` is the mesh-managed support object and naming anchor for a Semantic Flow identifier.
  - `D/_knop` denotes the mesh-managed `Knop` associated with that identifier.
- A `Knop` carries a mesh-relative `designatorPath` from which the public identifier IRI is formed in mesh context.
- Not every file in a host hierarchy is part of the mesh. Only explicitly integrated mesh resources are.

## Designator Paths And IRIs

Current terminology in these notes:

- `IRI` means any IRI.
- `designatorPath` is the mesh-relative path-like naming value carried by a `Knop`.
- A `Semantic Flow identifier` is a special kind of IRI: an IRI formed in mesh context from a mesh base plus a `Knop`'s `designatorPath`.
- In prose, `designator` is just shorthand for a `Knop`'s `designatorPath`, not a separate ontology class or first-class core node.

Examples:

- Knop designatorPath: `alice/bio`
- Semantic Flow identifier/IRI: `https://example.org/alice/bio`
- corresponding Knop IRI: `https://example.org/alice/bio/_knop`

Use `designatorPath` when you mean the modeled mesh-relative naming value on a `Knop`.
Use `designator` only as informal prose shorthand for that value.
Use `Semantic Flow identifier` when you mean the full IRI formed from a mesh base plus a `Knop`'s `designatorPath`.

For detailed `ReferenceCatalog` / `ReferenceLink` serialization and dereferenceability rules, see [[ont.reference-links]].

### Canonical URLs On Static Hosts

- Prefer slashless canonical Semantic Flow identifiers for non-file referents.
- In hierarchy-backed serializations, those identifiers may still be served from folders with `index.html` resource pages.
- On static hosts such as GitHub Pages, a request for the slashless form may be redirected to a trailing-slash page URL. Treat that trailing-slash URL as a delivery artifact, not as the canonical identifier.
- Resource pages should emit a canonical link for the slashless identifier and may use `history.replaceState(...)` after load so users copying from the browser location bar get the canonical slashless form rather than the redirected trailing-slash form.

## Artifact Facet Model

`DigitalArtifact` is the governing artifact-level class in the current model.

`ArtifactHistory` is the explicit diachronic facet and lineage resource used when a mesh materializes one or more history streams for a `DigitalArtifact`.

`DigitalArtifactFacet` is the facet-side superclass for histories, states, manifestations, and retrievable files.

The main explicit history chain is:

`DigitalArtifact -> ArtifactHistory -> HistoricalState -> ArtifactManifestation -> LocatedFile`

Interpretation:

- `DigitalArtifact`: the governing over-time artifact-level resource
- `ArtifactHistory`: an explicit diachronic facet and lineage resource for a digital artifact's published states
- `HistoricalState`: an immutable version representing the content of the artifact at a particular point within one `ArtifactHistory`
- `ArtifactManifestation`: one exact byte sequence representing a concrete variant of the artifact or state
- `LocatedFile`: a retrievable file identity or location whose bytes can be checked independently

An `ArtifactManifestation` may be provided by multiple `LocatedFile` resources only when they are byte-identical replicas. If formatting, line endings, compression, packaging, canonicalization, or serialization changes alter the bytes, the result is a different manifestation even when it carries the same conceptual content or media type.

Sparse cases are explicitly supported:

- a `DigitalArtifact` may have a `hasWorkingLocatedFile` without materializing an explicit history or working state
- a `DigitalArtifact` may have a `workingLocalRelativePath` when runtime operations need a local current-byte path that is not itself a mesh-addressable `LocatedFile`
- a `DigitalArtifact` may have a `workingAccessUrl` when its current working bytes are externally accessible without first being copied into a mesh-local working file
- a `DigitalArtifact` may link directly to an `ArtifactManifestation` when no explicit `ArtifactHistory` / `HistoricalState` structure is materialized
- a `LocatedFile` may stand alone when its governing `DigitalArtifact` is unnamed or not described; predicates that accept an exact facet may refer to it directly without making the file IRI a `DigitalArtifact` identity
- a `SemanticMesh` or `Knop` may point directly to its current inventory file via `hasWorkingMeshInventoryFile` or `hasWorkingKnopInventoryFile` without restating inventory-artifact structure in metadata documents

Use the explicit structural relations `hasArtifactHistory`, `hasHistoricalState`, `hasManifestation`, `locatedFileForManifestation`, `locatedFileForState`, `locatedFileForArtifact`, and `hasWorkingLocatedFile` for artifact/facet structure and sparse shortcuts. `hasHistoricalState` specializes `dcat:hasVersion` for states in a named artifact history, and `previousHistoricalState` specializes `dcat:previousVersion` for the immediately preceding state in that lineage. Use `workingLocalRelativePath` as the local runtime current-byte locator when present, `workingAccessUrl` as the remote/external current-byte locator when present and operationally allowed, and treat `hasWorkingMeshInventoryFile` and `hasWorkingKnopInventoryFile` only as owner-level shortcuts to current inventory files.

## Content Digests

`ContentDigestBearer` is the domain of `hasContentDigest`. SFLO directly classifies two bearer types:

- `ArtifactManifestation`, where the digest claims the exact represented byte sequence
- `LocatedFile`, where the digest is an independently checkable standing claim about retrieved bytes

When a manifestation and one of its located files both assert a digest for the same method, the values must agree. A repository locator is not a digest bearer: put an authored pre-resolution requirement on the relevant `ArtifactResolutionSpec` with `expectsContentDigest`, and put a digest computed during resolution on `ArtifactResolutionObservation` with `observedContentDigest`.

The working contract for the next release supports `sha256:<64 lowercase hexadecimal digits>`. `ContentDigestMethod` is an open controlled vocabulary, with `contentDigestMethod_sha256` and token `sha256` as the supported member. `DigitalArtifact`, `ArtifactHistory`, and `HistoricalState` do not become digest bearers merely through their existing class membership because those layers may span multiple byte representations.

## Mesh Structure

- `SemanticMesh` has `Knop`s and mesh-level support resources.
- `Knop` has exactly one `designatorPath`.
- `Knop` has support resources and may have one primary payload resource.
- `Knop` may have one bounded `FoundingReferentData` artifact containing assertions accepted about its associated public referent during identifier initialization.
- `Knop` may also have a `ResourcePageDefinition` plus an optional `KnopAssetBundle` for customized identifier-page composition and local support assets.
- The current slot vocabulary uses explicit properties such as `hasKnop`, `hasPayloadArtifact`, `hasFoundingReferentData`, `hasReferenceCatalog`, `hasKnopSourceRegistry`, `hasExtractionSource`, `hasKnopMetadata`, and `hasKnopInventory` rather than a generic `containsSemanticFlowResource`.

Current path conventions:

- `_mesh` denotes the mesh surface
- `D/_knop` denotes the Knop associated with identifier `D`
- explicit history resources live under `D/_historyNNN`
- explicit historical states live under `D/_historyNNN/_sNNNN`

## Artifact-Level Mesh Types

These are artifact-level classes used for primary and support artifacts in the mesh surface, not members of the facet lattice:

- `PayloadArtifact`
- `FoundingReferentData`
- `ReferenceCatalog`
- `KnopSourceRegistry`
- `KnopMetadata`
- `KnopInventory`
- `MeshMetadata`
- `MeshInventory`
- `ResourcePageDefinition`

Important consequence:

- each of these classes classifies a `DigitalArtifact`
- a support artifact can still have its own historical states, manifestations, and located files because those hang off the `DigitalArtifact`, not off a separate artifact-lattice branch and not off a separate `Knop`
- `ReferenceCatalog` is intentionally narrow: use it for managed `ReferenceLink` relators, not for broader descriptive RDF about the referent

Substantive RDF about a referent should normally live in a payload artifact or dataset rather than in a support artifact. `FoundingReferentData` is the bounded exception: one small, create-time, single-referent RDF artifact may carry facts accepted when an identifier is initialized. It is not generic referent metadata, a primary payload, or an ongoing descriptive dataset, and it is not a `SemanticFlowResource` until a page contract is defined for it.

## Historical And Working Model

- `ArtifactHistory` is the explicit lineage resource when a mesh materializes history.
- `HistoricalState` is the explicit state class within an `ArtifactHistory`.
- `stateOrdinal` lives on `HistoricalState` for default generated state naming like `_s0001`.
- `defaultArtifactHistory` is the `DigitalArtifact`-level pointer to the explicit history that operations should extend when no history is explicitly selected.
- `currentArtifactHistory` remains available as a compatibility/current-lineage pointer; use `defaultArtifactHistory` for the normative default write target.
- `latestHistoricalState` is a convenience pointer from `ArtifactHistory`.
- `nextHistoryOrdinal` lives on `DigitalArtifact` for default generated history allocation.
- `nextStateOrdinal` lives on `ArtifactHistory` for default generated state allocation.
- `hasWorkingLocatedFile` is the sparse working-surface hook when the current bytes are also modeled as a `LocatedFile`.
- `workingLocalRelativePath` is the operational local-path hook for current working bytes and may be present even when no mesh-addressable `LocatedFile` is asserted.
- `workingAccessUrl` is the operational remote/external current-byte hook when a runtime is allowed to fetch the current bytes without first importing them.
- `hasWorkingMeshInventoryFile` and `hasWorkingKnopInventoryFile` are owner-level shortcuts to current inventory files.
- `locatedFileForArtifact` is a direct `DigitalArtifact -> LocatedFile` shortcut for sparse file identity.
- `locatedFileForManifestation` is the `ArtifactManifestation -> LocatedFile` link for concrete manifestation bytes.
- `locatedFileForState` is an optional shortcut that should agree with `hasManifestation / locatedFileForManifestation`.

## Other Important Vocabulary

- `RdfDocument` is an orthogonal content-kind classification that may be applied selectively to a `DigitalArtifact` or to a specific `DigitalArtifactFacet`.
- `ArtifactHistory` is an explicit diachronic facet and lineage resource.
- `DigitalArtifactFacet` is the common superclass for `ArtifactHistory`, `HistoricalState`, `ArtifactManifestation`, and `LocatedFile`.
- `ResourcePage` is a `LocatedFile` subclass for the human-facing HTML resource pages that should accompany every `SemanticFlowResource`
- `ResourcePageDefinition` is a separate artifact-level control resource for customized identifier-page composition; it is not the same thing as the generated HTML `ResourcePage`
- `KnopAssetBundle` is a bounded helper structure for local `_knop/_assets` modeling and does not by itself imply governed artifacts or recursive inventory capture
- `KnopSourceRegistry` is a Knop-owned support artifact for source bindings, conventionally materialized under `_knop/_sources`; it records materialization sources and extraction provenance rather than operational mesh configuration or descriptive payload facts
- `FoundingReferentData` is the optional Knop-owned initialization record at `D/_knop/_founding`; its working RDF file is conventionally `D/_knop/_founding/data.ttl`, and its assertions are about public referent `D`, not support object `D/_knop`
- `ArtifactResolutionSpec` is the generic policy-bearing relator for application concerns that need to resolve bytes from an artifact, a direct mesh-local path string, a direct access URL, a specific `LocatedFile`, or another explicit packaged target together with optional history/state/mode/fallback inputs; it carries requested coordinates and expectations, not observed evidence directly
- `ArtifactResolutionObservation` is the relator for observed resolution evidence; concrete observed coordinates live on its `observedArtifactResolutionSpec`, while content digest, timestamp, and observer stay on the observation itself
- `ExtractionSource` specializes `ArtifactResolutionSpec` for the source RDF document bytes from which a Knop-managed resource was extracted or first grounded; Knops link to it with `hasExtractionSource`, usually as a source-registry fragment such as `D/_knop/_sources#extraction-source`
- `ReferenceSource` specializes `ArtifactResolutionSpec` for RDF reference data used by a `ReferenceLink`; it normally lives in the `ReferenceCatalog` beside the owning link
- `ImportSource` specializes `ArtifactResolutionSpec` for source bytes actively acquired and copied into a governed local working surface by import
- `IntegrationSource` specializes `ArtifactResolutionSpec` for existing source bytes registered where they already live by integrate
- `ResourcePageRegion` and `ResourcePageSource` describe page-content composition in core; `ResourcePageSource` specializes `ArtifactResolutionSpec` and uses the generic target/history/state/mode/fallback properties directly while template/chrome policy remains a separate config concern
- `ReferenceLink` is a curated RDF reference-data relator about the resource named by `referenceLinkFor`; it points to exactly one `ReferenceSource` with `hasReferenceSource`, and that source uses generic target coordinates such as `targetArtifact` and `targetHistoricalState`
- `designatorPath` is the mesh-relative path-like naming value carried by a `Knop`; it is not a generic path property for every `SemanticFlowResource`.
- a `Semantic Flow identifier` is the public IRI formed from `meshBase + Knop.designatorPath`; support resources in the mesh may still have ordinary IRIs without thereby being Semantic Flow identifiers.
- `preferredPayloadFileSlug` is the mutable filename preference.

Source registries are the current home for two related but distinct records:

- integration bindings, where an `IntegrationSource` records existing source bytes where they already live, such as repository URL, ref, resolved commit, repository-relative path, local relative path, or byte digest expectations
- import bindings, where an `ImportSource` records source bytes actively acquired and copied into a governed working surface
- extraction provenance, where an `ExtractionSource` records the source artifact coordinates used to ground an extracted Knop and links to `ArtifactResolutionObservation` records for observed state, manifestation, located file, local path, digest, timestamp, or observer evidence when intentionally recorded

These records are not curated references. Use `ReferenceCatalog` / `ReferenceLink` / `ReferenceSource` when the mesh wants to say that one resource intentionally references RDF data about it. Use `_knop/_sources` when the mesh needs to explain where carried bytes or extracted-term evidence came from. Inventory-rooted extraction-source detail blocks are historical only; current serialization keeps the details in `_knop/_sources/sources.ttl` and lets the Knop inventory point to that registry and to the primary extraction source.

Persisted `RepositorySourceFloatingLocator` resources are named rather than blank. Stable locator identity lets writers recognize repeated source registration as a semantic no-op and fail closed when the same locator identity is assigned conflicting repository coordinates. Concrete runtimes define their deterministic locator IRI convention; Weave uses the owning payload's `_knop/_sources#payload-source-repository-locator` fragment.

## Things To Not Reintroduce

These are not part of the current core surface:

- a separate naming-handle layer distinct from `Knop`
- `ArtifactFlow`
- `ArtifactContainer`
- `WorkingState`
- `CurrentState`
- `ArtifactState`
- `AbstractArtifact`
- `AbstractFile`
- `FileExpression`
- `payloadSlug`

Also do not assume:

- every `Knop` has a payload
- every integrated artifact has a fully materialized artifact complex
- every mesh is backed by a literal filesystem tree

## Example

For a use-case-oriented sketch that exercises the current model, see [[ont.use-case.biographical-data-publishing]].
