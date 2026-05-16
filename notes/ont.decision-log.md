---
id: b6t6wu1wdwh7ssite71l3yr
title: Decision Log
desc: ''
updated: 1773896780320
created: 1773896763313
---

## Decisions

Superseded decisions are intentionally retained for traceability. When a decision is reversed or replaced, mark it explicitly rather than deleting it.

### 2026-05-16: Carry extraction provenance in Knop source registries

- Status: Active
- Decision: Keep `hasExtractionSource` as the Knop-level pointer to the primary `ExtractionSource`, but serialize the `ExtractionSource` record in the Knop's `_knop/_sources/sources.ttl` registry rather than as an inventory-rooted fragment. Use source-registry fragment IRIs such as `D/_knop/_sources#extraction-source`.
- References: [[wd.task.2026.2026-05-15_1113-mesh-branch-fantasy-rules]], [[wd.task.2026.2026-05-04-extraction-improvements]]
- Why:
  - extraction provenance is source provenance, and belongs with other source bindings rather than making KnopInventory carry bulky source records
  - source registries can carry both repository-backed payload source bindings and extraction-source bindings without making mesh config a provenance bucket
  - keeping the Knop-level `hasExtractionSource` pointer preserves the simple "what source grounds this extracted resource?" query shape
  - repository-backed source-binding SHACL should apply only to bindings with `hasTargetRepositorySource`; not every `hasSourceBinding` relator is repository materialization
- Notes:
  - KnopInventory still links the source registry with `hasKnopSourceRegistry` and links the primary extraction source with `hasExtractionSource`
  - `_knop/_sources/sources.ttl` owns the `ExtractionSource` block and links it from the registry with `hasSourceBinding`
  - legacy inventory-rooted extraction-source records may appear in old fixtures, but new generated fixtures should use `_sources`

### 2026-05-15: Keep repository source provenance in Knop source registries

- Status: Active
- Decision: Add `KnopSourceRegistry` as a Knop-owned support artifact for source bindings about artifacts carried by or resources grounded through that Knop. Link it with `hasKnopSourceRegistry`, and let each registry point to `ArtifactResolutionTarget` relators through `hasSourceBinding`. Repository-backed bindings reuse the existing `RepositorySourceLocator`, digest, and target locator vocabulary.
- References: [[wd.task.2026.2026-05-15_1113-mesh-branch-fantasy-rules]], [[wd.task.2026.2026-05-13_1655-support-gh-pages-branch-based-deployments]]
- Why:
  - source provenance for included artifacts belongs beside the target Knop rather than in `_mesh/_config/config.ttl`
  - mesh config should remain operational policy/configuration rather than growing into a provenance registry for every materialized artifact
  - a dedicated `_knop/_sources` artifact keeps inventory from carrying bulky repository binding details while still giving the registry a durable, dereferenceable home
  - reusing `ArtifactResolutionTarget` keeps repository source bindings aligned with extraction and page-source resolution instead of inventing a branch-deploy-only relator
- Notes:
  - conventional serialization is `D/_knop/_sources/sources.ttl`, linked from the Knop inventory with `hasKnopSourceRegistry`
  - source binding IRIs may be registry-rooted fragments such as `D/_knop/_sources#branch-source-ontology`
  - runtime policy for resolving repository locators remains outside core ontology

### 2026-04-12: Model runtime-resolution policy in the config ontology with mesh/local access layers

- Status: Active
- Decision: Keep the first-pass runtime-resolution vocabulary in the live config ontology rather than blocking on a separate host/operational companion ontology. Use `MeshConfig` for portable mesh-carried config and `LocalConfig` for user- or machine-local config; keep `OperationalConfig` for host/runtime policy rather than making mesh config a subclass of it. Model local-boundary allowances with positive `LocalPathAccessRule` resources carrying an explicit base plus `pathPrefix`, and model remote-boundary allowances with positive `RemoteAccessRule` resources carrying locator-kind plus scheme/origin constraints.
- References: [[wd.task.2026.2026-04-11_1723-operational-config-for-runtime-resolution]], [[wd.task.2026.2026-04-08_1545-resource-page-definition-and-sources]], [[wd.task.2026.2026-04-08_1735-page-definition-ontology-and-config]], [[ont.task.2026.2026-03-23-config-modernization]]
- Why:
  - CLI and daemon both need the same operational path/URL policy surface, so the first-pass model should not stay daemon-centric
  - the current config ontology already provides the generic `Config` substrate, so keeping operational policy there is a smaller and clearer first step than introducing a separate namespace immediately
  - mesh-carried config and machine-local config have different trust/portability expectations and should not be collapsed into one undifferentiated config source
  - the immediate runtime need is a deny-by-default allowlist model for `workingLocalRelativePath` and `targetLocalRelativePath`, not a larger filesystem-resource ontology
  - explicit rule objects with declared bases and path prefixes are easier to implement and reason about than regex or implicit serializer-dependent base semantics
- Notes:
  - the first-pass effective policy is the union of discovered applicable positive allow rules from mesh and local config; absence of a matching rule denies access
  - likely conventional files are `_mesh/_config/config.ttl` and `~/.sf-local-access.ttl`, but the exact discovery contract remains an application-level concern
  - mesh-carried config should not by itself imply arbitrary host access outside the active workspace boundary
  - richer directory-resource modeling or explicit deny/override vocabulary can be added later if real pressure appears
  - `RuntimeResolutionConfig` may still appear later as a narrower subtype if the operational vocabulary grows enough to justify it

### 2026-05-03: Sidecar MeshConfig Records Portable Workspace Relationship

- Status: Active
- Decision: Add `workspaceRootRelativeToMeshRoot` to `MeshConfig` so a sidecar mesh can carry the portable relationship from its mesh root to its containing workspace root, for example `"../"` for a mesh rooted at `docs/`.
- References: [[ont.task.2026.2026-03-23-config-modernization]], [[ont.use-case.dereferenceable-ontology]]
- Why:
  - a sidecar mesh often needs to travel with the knowledge that it lives inside a larger project tree
  - the portable relationship is the relative path from mesh root to workspace root, not the absolute host path of the checkout
  - explicit local-path access rules remain separate from this relationship; knowing the workspace boundary does not grant access by itself
- Notes:
  - `weave mesh create --workspace . --mesh-root docs ...` should create `docs/_mesh/_config/config.ttl` with a `MeshConfig` that records `workspaceRootRelativeToMeshRoot "../"`
  - whole-root meshes where workspace root and mesh root are the same do not need a config artifact solely to record `"."`
  - local runtimes can use the recorded relationship as a portable boundary hint while still enforcing their active workspace boundary and explicit allow rules

### 2026-04-11: Generalize page-source resolution around `ArtifactResolutionTarget`

- Status: Active
- Decision: Keep `ResourcePageDefinition` as the Knop-owned support artifact for customized identifier pages, but replace the earlier page-bundle helper model with a more general resolution model. Introduce `ArtifactResolutionTarget` as a generic policy-bearing relator for resolving bytes from either a `DigitalArtifact`, a direct mesh-local path string, a direct access URL, a direct `LocatedFile`, or another explicit packaged target. Keep `ResourcePageSource` as a page-specific subclass of `ArtifactResolutionTarget`, but have it use the generic target/history/state/mode/fallback properties directly rather than duplicating page-specific alias properties; use `targetLocalRelativePath` for unmanaged mesh-local file references; use `targetAccessUrl` for explicit remote/external target URLs when operational policy allows them; and use `KnopAssetBundle` only for the bounded `_knop/_assets` helper area. Leave template/chrome configuration for the separate config-ontology track.
- References: [[wd.task.2026.2026-04-08_1545-resource-page-definition-and-sources]], [[wd.task.2026.2026-04-08_1735-page-definition-ontology-and-config]], [[ont.task.2026.2026-03-23-config-modernization]]
- Why:
  - identifier-page customization needs an explicit control-plane artifact without pretending the identifier itself is a payload-bearing `DigitalArtifact`
  - page-source resolution is a broader application concern than resource-page rendering alone and should not be trapped in page-specific bundle vocabulary
  - a source should be allowed to resolve directly from a mesh-local path string, a direct access URL, or a direct `LocatedFile` when no artifact-level target is available, while still supporting artifact-targeted resolution with explicit history/state policy
  - `_knop/_page` should remain a normal support artifact surface centered on `page.ttl`, not a mini container model for every authored file involved in page generation
  - `_knop/_assets` still benefits from a bounded helper concept, but content/helper files should not all be forced into an asset or bundle abstraction

### 2026-05-04: Model Extraction Source Binding As An Inventory Relator

- Status: Superseded by 2026-05-16
- Decision: Add `ExtractionSource` as an `ArtifactResolutionTarget` subclass for the RDF document bytes from which a Knop-managed resource was extracted or first grounded, and add `hasExtractionSource` from `Knop` to `ExtractionSource`. Use inventory-rooted fragment IRIs such as `D/_knop/_inventory#extraction-source` for the carried local extraction slices.
- References: [[wd.task.2026.2026-05-03-term-extraction]], [[wd.task.2026.2026-05-02-fantasy-rules-sidecar]], [[sf.spec.2026-04-05-extract-behavior]]
- Why:
  - Extraction source binding is not a `ReferenceLink`; it is operational provenance for the extracted identifier surface and should sit with the Knop inventory that already carries current support artifact state.
  - Reusing the generic artifact-resolution properties keeps pinned and current source resolution explicit while leaving broader enumeration value normalization for a separate ontology task.
  - Hash-fragment inventory IRIs are acceptable here as long as generated inventory resource pages preserve a named section for dereferenceability.
  - per-source requested state and fallback policy affect runtime resolution semantics and therefore belong in core rather than being left to ad hoc conventions
  - template/chrome policy is related, but should remain separate from page-content composition
- Notes:
  - prefer `ResourcePageRegion` over `Slot` in core
  - `accept` belongs to fallback policy, not to the pinned-vs-current source mode axis
  - `ResourcePageSource` remains useful as a page-specific relator even though the generic pattern is now captured by `ArtifactResolutionTarget`
  - `hasTargetArtifact` is optional when `targetLocalRelativePath`, `targetAccessUrl`, or a direct `hasTargetLocatedFile` is sufficient to identify the bytes that should be resolved
  - `workingLocalRelativePath` is the operational local current-byte locator for a `DigitalArtifact`; `workingAccessUrl` is the operational remote/external current-byte locator; `hasWorkingLocatedFile` remains the semantic `LocatedFile` facet hook
  - when `workingLocalRelativePath`, `workingAccessUrl`, and `hasWorkingLocatedFile` are all present for the same current working surface, they should agree and mismatch should fail closed in operational profiles that rely on them
  - allowed-directory rules for `targetLocalRelativePath` and `workingLocalRelativePath` belong to host/runtime operational config rather than to core ontology
  - network-use policy for `workingAccessUrl` also belongs to host/runtime operational config rather than to core ontology
  - network-use policy for `targetAccessUrl` also belongs to host/runtime operational config rather than to core ontology

### 2026-04-09: Model customizable identifier pages with bounded page-definition helpers

- Status: Superseded on 2026-04-11 by the `ArtifactResolutionTarget` decision
- Decision: Add `ResourcePageDefinition` to the live core model as a Knop-owned support artifact for customizable identifier pages. Model the local `_knop/_page` boundary with `ResourcePageBundle`, model member files with `ResourcePageBundleFile`, model `_knop/_page/_assets` with `ResourcePageAssetBundle`, and model authored content composition with `ResourcePageRegion` plus `ResourcePageSource`. Keep per-source requested state, source mode, and fallback policy in core, but leave template/chrome configuration for the separate config-ontology track.
- References: [[wd.task.2026.2026-04-08_1545-resource-page-definition-and-sources]], [[wd.task.2026.2026-04-08_1735-page-definition-ontology-and-config]], [[ont.task.2026.2026-03-23-config-modernization]]
- Why:
  - identifier-page customization needs an explicit control-plane artifact without pretending the identifier itself is a payload-bearing `DigitalArtifact`
  - the `_knop/_page` boundary and its member files need explicit semantics without forcing every local helper file into `KnopInventory`
  - per-source requested state and fallback policy affect resource-page resolution semantics and therefore belong in core rather than being left to ad hoc runtime conventions
  - template/chrome policy is related, but should remain separate from page-content composition
- Notes:
  - the later 2026-04-11 decision keeps `ResourcePageDefinition`, `ResourcePageRegion`, and `ResourcePageSource`, but removes the bundle-specific helper vocabulary in favor of generic artifact-resolution terms plus `KnopAssetBundle`

### 2026-04-02: Replace `ReferentMetadata` with `ReferenceCatalog`

- Status: Active
- Decision: Remove `ReferentMetadata` and `hasReferentMetadata` from the live core model. Add a narrow `ReferenceCatalog` support artifact with `hasReferenceCatalog`, keep it restricted to `ReferenceLink` relators, and enforce valid owners through SHACL rather than a shared ontology superclass. Allow at most one `ReferenceCatalog` per `Knop` or `SemanticMesh` in this pass.
- References: [[ont.completed.2026.2026-04-01-ReferenceCatalog]], [[wd.task.2026.2026-03-25-mesh-alice-bio]], [[sf.task.2026.2026-03-29-conformance-for-mesh-alice-bio]]
- Why:
  - `ReferentMetadata` overlapped too heavily with the payload-artifact path and kept reopening the question of whether substantive RDF belonged in support artifacts or payload artifacts
  - `ReferenceLink` relators still need a dedicated managed home, but that home should stay narrow and mechanical rather than turning into a generic referent-RDF bucket
  - `Knop` and `SemanticMesh` may both own reference catalogs, but reviving a vague common superclass would add abstraction without earning its keep
- Notes:
  - use `D/_knop/_references/references.ttl` for Knop-owned catalogs and `_mesh/_references/references.ttl` for mesh-owned catalogs
  - stable `ReferenceLink` identities may be catalog-rooted fragment IRIs such as `<D/_knop/_references#reference001>`
  - `referenceLinkFor` must point to the actual subject resource, not to a `Knop`
  - this decision does not broaden `ReferenceCatalog` to cover `owl:sameAs` or other descriptive/assertive referent RDF

### 2026-03-26: Introduce explicit `ArtifactHistory` and remove `ArtifactContainer`

- Status: Active
- Decision: Reintroduce a narrow explicit `ArtifactHistory` resource as the lineage handle for published artifact history, while keeping `ArtifactFlow` out of the active core. A `DigitalArtifact` relates to one or more histories through `hasArtifactHistory`, may identify the active one through functional `currentArtifactHistory`, and may track `nextHistoryOrdinal`. An `ArtifactHistory` owns `hasHistoricalState` and `latestHistoricalState`, may carry `historyOrdinal` and `nextStateOrdinal`; each `HistoricalState` may carry `stateOrdinal`; and `ArtifactHistory` is typed only as a `SemanticFlowResource`. Remove `ArtifactContainer` from the active core.
- References: [[ont.completed.2026.2026-03-26-ArtifactHistory]], [[sf.conv.2026.2026-03-25_1413-title-mesh-alice-bio-codex]]
- Why:
  - a history landing page should correspond to an explicit resource rather than an exceptional page with no paired resource
  - once multiple histories exist, the current/default lineage must be identified explicitly rather than inferred indirectly from lineage-local latest states
  - history allocation metadata belongs on the artifact/history pair, not in current-surface inventory
  - `ArtifactContainer` was too vague and unused to justify keeping it in the active core
- Notes:
  - the default generated naming direction is `_historyNNN` for histories and `_sNNNN` for states
  - history-level metadata remains in `KnopMetadata` for now; do not introduce a dedicated history metadata artifact in this pass
  - this refines the older simplified artifact model by inserting `ArtifactHistory` between `DigitalArtifact` and `HistoricalState`

### 2026-03-25: Distinguish mesh metadata and mesh inventory document roles

- Status: Active
- Decision: In hierarchy-backed serializations, `_mesh/_meta/meta.ttl` carries only mesh-level facts such as `meshBase` and may point directly to the current mesh inventory file via `hasWorkingMeshInventoryFile`, while `_mesh/_inventory/inventory.ttl` is the canonical self-contained current-surface map. Support-artifact identity/typing, `hasMeshInventory`, and artifact-history facts belong canonically in inventory rather than being repeated in metadata.
- References: [[wd.task.2026.2026-03-25-mesh-alice-bio]], [[sf.conv.2026.2026-03-25_1413-title-mesh-alice-bio-codex]]
- Why:
  - mesh metadata and mesh inventory serve different document roles and should not be treated as interchangeable
  - inventory benefits from being self-contained because it is the document most directly concerned with the currently present managed surface
  - metadata should stay lighter and less repetitive while still pointing readers and tools toward the current inventory file
  - dedicated owner-level inventory-file shortcuts are justified because only `SemanticMesh` and `Knop` own inventories, and their inventories summarize different scopes
  - this asymmetry is intended as a reusable serialization convention, not just a one-off detail of the Alice Bio fixture

### 2026-03-21: Adopt a Knop-only naming model

- Decision: Remove `Nomen`, `hasNomen`, `_nomen`, and `designates` from the active core. Each `Knop` carries exactly one `designatorPath`, and a Semantic Flow identifier is the public IRI formed from `meshBase + Knop.designatorPath`.
- Why:
  - this avoids keeping a separate naming-handle layer when the active model only needs one resource-side handle
  - it makes `Knop` the single active naming anchor, support object, and operational handle
  - it keeps rebasing/composability by preserving `designatorPath` as a mesh-relative value rather than a globally unique identifier
- Notes:
  - this supersedes the 2026-03-18 thin-`Nomen` decision
  - explicit referent linkage via `designates` is dropped from the active core for now
  - in hierarchy-backed serializations, `D/_knop` remains the active support-resource convention and no `_nomen` handle is part of the active model

### 2026-03-18: Use `SemanticMesh` as the core mesh concept

- Decision: The core mesh class is `SemanticMesh`, understood as a namespace region together with its supporting resources, conventionally exposed via `_mesh` in hierarchy-backed serializations.
- Why:
  - `Mesh` by itself is too generic in ontology-facing docs.
  - the mesh is the Semantic Flow surface, not the entire surrounding workspace or filesystem tree
  - this wording still allows generated or otherwise non-filesystem-backed meshes

### 2026-03-18: Reintroduce a thin `Nomen` and keep `Knop` as the paired support object

- Status: Superseded on 2026-03-21 by the Knop-only naming model
- Decision: Use a thin `Nomen` as the mesh-relative naming resource, keep `designatorPath` and optional `designates` on `Nomen`, and link each `Knop` to exactly one `Nomen` with `hasNomen`.
- Why:
  - this keeps naming semantics separate from support/container semantics without reviving the older heavier `Nomen` model
  - it preserves composability: changing `meshBase` can mint different public IRIs while reusing the same `Nomen` plus `Knop` structure
  - it keeps `Knop` focused on payload/support hosting and mesh management
- Notes:
  - in hierarchy-backed serializations, `D/_nomen` denotes the `Nomen` and `D/_knop` denotes the `Knop`
  - `designator` is prose shorthand only; the modeled value is `Nomen.designatorPath`

### 2026-03-18: Define Semantic Flow identifiers as slashless canonical IRIs

- Status: Superseded on 2026-03-21 by the Knop-only naming model
- Decision: A Semantic Flow identifier is the public IRI formed from `meshBase + Nomen.designatorPath`, and canonical examples should use slashless non-file identifiers.
- Why:
  - slashless canonical identifiers are easier to use consistently in Turtle, SPARQL, and examples
  - the identifier should stay distinct from the delivery URL of a static-host resource page
- Notes:
  - the formation detail was superseded on 2026-03-21; the active model now uses `meshBase + Knop.designatorPath`
  - hierarchy-backed pages may still be served from folders with `index.html`
  - on static hosts such as GitHub Pages, a trailing-slash URL caused by folder serving is treated as a delivery artifact, not as the canonical identifier
  - generated resource pages should emit canonical links and may use `history.replaceState(...)` to restore the slashless canonical URL in the browser

### 2026-03-18: Use the simplified artifact model centered on `DigitalArtifact`

- Status: Partially superseded on 2026-03-26 by the explicit `ArtifactHistory` model
- Decision: `DigitalArtifact` is the governing artifact-level resource; `HistoricalState`, `ArtifactManifestation`, and `LocatedFile` are facet-side classes; `AbstractArtifact`, `ArtifactFlow`, `ArtifactState`, `WorkingState`, and `CurrentState` are not part of the current core.
- Why:
  - this keeps the core model smaller and easier to resolve in application code
  - it supports sparse cases without requiring every integrated artifact to materialize the full structure
  - it avoids treating artifact facets as ordinary artifact kinds
- Notes:
  - the main explicit structure was originally `DigitalArtifact -> HistoricalState -> ArtifactManifestation -> LocatedFile`
  - the 2026-03-26 ArtifactHistory decision refines that to `DigitalArtifact -> ArtifactHistory -> HistoricalState -> ArtifactManifestation -> LocatedFile`
  - sparse cases may also use `DigitalArtifact -> hasManifestation -> ArtifactManifestation`
  - working bytes are modeled with `hasWorkingLocatedFile`

### 2026-03-18: Prefer explicit structural relations over a generic facet lattice

- Decision: Use explicit structural relations such as `hasHistoricalState`, `hasManifestation`, `hasLocatedFile`, `hasWorkingLocatedFile`, and optional `locatedFileForState`; do not keep `narrowerFacet` / `broaderFacet` in the active core.
- Why:
  - the generic facet lattice was becoming more confusing than helpful
  - the important model structure is specific and directional
  - explicit links are easier to validate, document, and resolve operationally

### 2026-03-18: Treat payload, metadata, and inventory as artifact-level role classes

- Decision: `PayloadArtifact`, `KnopMetadata`, `KnopInventory`, `MeshMetadata`, and `MeshInventory` classify `DigitalArtifact`s directly rather than living in a separate artifact species hierarchy or in the facet lattice.
- Why:
  - this cleanly separates mesh role from artifact structure
  - support artifacts can still have their own states, manifestations, and located files because those hang off the governing `DigitalArtifact`
  - it fits sparse and partially materialized cases better than forcing everything through a dedicated support-artifact complex
- Notes:
  - `preferredPayloadFileSlug` applies to `PayloadArtifact`
  - `hasMeshMetadata`, `hasKnopMetadata`, `hasMeshInventory`, and `hasKnopInventory` canonically point to artifact-level resources

### 2026-03-18: Keep `RdfDocument` as an orthogonal content-kind classification

- Decision: `RdfDocument` is not restricted to only artifact-level resources or only facet-side resources; it may classify either a `DigitalArtifact` or a specific `DigitalArtifactFacet`.
- Why:
  - an artifact may have an RDF version without every facet needing to be RDF
  - a specific manifestation or located file may be RDF even when the governing artifact is more general
  - this avoids reopening the broader unresolved question of what should count as a `DigitalArtifact`

### 2026-03-18: Loose meshes only include explicitly integrated resources

- Decision: A host hierarchy or workspace may contain many files, but only explicitly integrated Semantic Flow resources are part of the mesh.
- Why:
  - this preserves filesystem sparseness
  - it avoids accidentally treating ambient files, caches, build outputs, or unrelated working material as mesh content
  - it allows meshes to be generated or partially overlaid rather than tied one-to-one to a literal directory tree

### 2026-03-18: Nested `_mesh` boundaries are sub-meshes by default

- Decision: If a `_mesh` occurs within another `_mesh` region, treat it as a sub-mesh boundary by default. The parent mesh inventory identifies the sub-mesh itself, not all of the sub-mesh's internal Semantic Flow resources.
- Why:
  - this gives composability a clean default
  - it allows a sub-mesh to remain a reusable unit under a different `meshBase`
  - flattening, rebasing, or re-export of child resources should be explicit rather than implied by nesting
