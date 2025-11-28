---
id: concept-summary
title: Concept Summary
desc: ''
updated: 1764349658943
created: 1755820864360
---

# Semantic Mesh — LLM-Oriented Concept Summary

This document is the canonical, compact context for LLMs. It summarizes all `documentation/concepts.*` notes and cross-links to authoritative pages.

0) Semantic Flow Twin Purposes
- Mint dereferenceable IRIs for referring to things on the Semantic Web
- Hold versionable semantic data that uses those IRIs

1) Definition
A semantic mesh is a dereferenceable, possibly-versioned corpus of semantic resources where every IRI resolves to meaningful content. 

A filesystem-based mesh maps directly from a Git repository’s folder hierarchy to a published static site so that:
- Every resource is addressable by a stable IRI.
- "[[Naming resources|facet.resource.naming]]" are dereferenceable via generated `index.html` resource pages.
- "[[Content resources|facet.resource.content]]" are directly dereferenceable: they should return a file
- RDF datasets live as distributions on versioned flow snapshots.
- The weave process maintains coherence and keeps the repo publish-ready.

See:
- [[concept.mesh]]: definition, requirements
- [[concept.semantic-flow-site]]: site posture
- [[concept.single-mesh-repo]]: repo-to-site mapping

2) Design Principles
- [[principle.dereferencability-for-humans]]: resource pages
- [[principle.single-referent]]: concept vs content is explicit
- [[principle.pseudo-immutability]]: treat snapshots/IDs as immutable
- [[principle.transposability]]: move meshes without breaking links via relative IDs
- [[principle.composability]]: extract/compose submeshes

3) Core Abstractions

3.1 Mesh Resources (Nodes and Components)
- Node (folder; container for nodes & components): [[mesh-resource.node]]
  - bare node: organizational IRI segment container: [[mesh-resource.node.bare]]
  - payload node: IRI refers to the node's referent (real-world entity or dataset concept); has a payload flow: [[mesh-resource.node.payload]]

- Node component (terminal resource supporting a node): [[mesh-resource.node-component]]
  - Flows (abstract datasets as DatasetSeries):
    - Meta flow (metadata/provenance): [[mesh-resource.node-component.flow.node-metadata]]
    - payload flow (payload data): [[mesh-resource.node-component.flow.payload]]
    - Node-config flows (settings; see §9): [[mesh-resource.node-component.flow.node-config]]
  - FlowShots (concrete Datasets): `_default/`, `_working/`, snapshot folders (e.g., `2025-11-24_0142_07_v1/`)
    - Overview: [[mesh-resource.node-component.flow-shot]]
    - `_default/`: [[mesh-resource.node-component.flow-shot.default-shot]]
    - `_working/`: [[mesh-resource.node-component.flow-shot.working-shot]]
    - Snapshot folders: [[mesh-resource.node-component.flow-shot.snapshot]]
    - Distributions: [[mesh-resource.node-component.snapshot-distribution]]
  - Handle (refer to the node “as a mesh resource”): [[mesh-resource.node-component.node-handle]]
    - Handle page (human-facing): [[mesh-resource.node-component.node-handle.page]]
  - Asset tree (static files for the node): [[mesh-resource.node-component.asset-tree]]
  - Documentation resources (README/CHANGELOG/resource pages/fragments):
    - README: [[mesh-resource.node-component.documentation-resource.readme]]
    - CHANGELOG: [[mesh-resource.node-component.documentation-resource.changelog]]
    - Resource page (index.html): [[mesh-resource.node-component.documentation-resource.resource-page]]
    - Resource fragment: [[mesh-resource.node-component.documentation-resource.resource-fragment]]
  - Aggregated distribution (optional roll-up of child node data): [[mesh-resource.node-component.aggregated-distribution]]

3.2 Facets (Folder, File, Dataset)
- Folder facet (namespace mapping; reserved folders): [[facet.filesystem.folder]]
- File facet (content retrieval): [[facet.filesystem.file]]
- Dataset facet (DatasetSeries vs Dataset): [[facet.resource.dataset]]

4) Addressing and Identity

4.1 Namespace and Relative Identifiers
- Folder names become namespace segments; the path is the node’s relative identifier (and IRI path when published).
- Relative identifiers are used within distributions for transposability; resolve relative to distribution location.
See:
- [[concept.namespace]]: overview
- [[concept.namespace.segment]]: segment definition
- [[concept.namespace.segment.system]]: reserved segments
- [[concept.identifier.intramesh.relative]]: relative IDs

4.2 IRI Semantics
- Concept IRIs (slash-terminated) identify nodes, flows (abstract), snapshots (conceptual), and handle.
- Content IRIs (with filenames) identify retrievable files: distributions, HTML pages, READMEs, assets.
- Follow document-vs-thing hygiene to avoid ambiguity.
See:
- [[concept.identifier]]: IRI types and mapping
- [[faq.reference-iri-choices]]: trade-offs
- [[concept.iri]]: terminology; prefer “IRIs” when referring to mesh-local IRIs

4.3 Handle Rationale
- A node’s IRI refers to its referent (namespace, real-world entity, or dataset concept).
- The handle component provides a IRI to refer to the node itself “as a mesh resource” (for config, provenance, lifecycle).
See:
- [[mesh-resource.node-component.node-handle]]
- [[mesh-resource.node-component.node-handle.page]]

5) Physical Structure and Reserved Folders

Reserved folder names (underscore-prefixed; canonical set):
- `_node-handle/`
- Flow containers (abstract datasets):
  - `_meta/`, `_payload/`
  - `_cfg-op/`, `_cfg-inh/` (see §9)
- FlowShots inside a flow:
  - `_default/`, `_working/`, snapshot folders with format `YYYY-MM-DD_HHMM_SS_vN/` (e.g., `2025-11-24_0142_07_v1/`, `2025-11-24_0142_08_v2/`, …)
- Assets:
  - `_assets/` (static files)

Folder-note pages for these reserved names live under `folder.*.md` (where defined):
- `_meta/`: [[folder._meta]]
- `_payload/`: [[folder._data-flow]]
- `_cfg-op/`: [[folder._cfg-op]]
- `_cfg-inh/`: [[folder._cfg-inh]]
- `_default/`: [[folder._default]]
- `_working/`: [[folder._working]]
- Snapshot folders (`YYYY-MM-DD_HHMM_SS_vN/`): [[folder.flowshot]]
- `_assets/`: [[folder._assets]]
- Node folder pages:
  - Node: [[folder.node]]

6) Data and Versioning Model
- Only flows are versioned (flows are DatasetSeries). Nodes are not versioned.
- FlowShots (flow realizations):
  - `_default/`: latest stable realization; after weave it equals the content of the latest snapshot.
  - `_working/`: mutable working area.
  - Snapshot folders (format `YYYY-MM-DD_HHMM_SS_vN/`): immutable history for precise citation and provenance.
- Working distribution: `_working/` typically contains a single editable source; weave can fan-out serializations.
- Sibling distribution: patterns and constraints for multi-file realizations.
See:
- [[concept.flow-version]]
- [[mesh-resource.node-component.snapshot-distribution.working]]
- [[concept.sibling-distribution]]

7) Lifecycle and Weave Process
Weave maintains structural coherence and publication readiness:
- Ensures required system components exist.
- If versioning is enabled, creates a new snapshot folder (format `YYYY-MM-DD_HHMM_SS_vN/`) from `_working/`.
- Promotes `_working/` contents to `_default/`.
- Updates meta/provenance; regenerates resource pages.
- Resolves internal links to maintain transposability.
- Integrates with the scanner where applicable.
See:
- [[concept.weave-process]]
- [[concept.weave-process.resource-page-generation]]
- [[concept.scanner]]
- [[concept.metadata.provenance]]

8) Publishing and Sites
- Repos are static-site-ready; pushing to GitHub Pages or any static host publishes the mesh (folder paths → IRI paths).
- Transposition (domain/project move) is safe with relative IDs.
See:
- [[concept.single-mesh-repo]]
- [[concept.semantic-flow-site]]
- [[concept.publication]]

1) Configuration and Inheritance (Two Config Flows)
- Operational Config Flow: final, resolved settings for a node (consumer). Overrides apply here.
- Inheritable Config Flow: settings a node offers to descendants (provider). Property-level merge; order: parent → … → service → platform; propagation can be firewalled.
- Resolution: a single inheritance mechanism resolves operational config from inheritable configs plus service/platform defaults. Explicit operational entries override inherited ones.
See:
- [[mesh-resource.node-component.flow.node-config]]: overview
- [[mesh-resource.node-component.flow.node-config.operational]]
- [[mesh-resource.node-component.flow.node-config.inheritable]]
- [[mesh-resource.node-component.node-config-defaults]]: defaults as inheritable values

1)  Aggregated Views
- Aggregated distribution: optional roll-up of child payload nodes’ default datasets at a parent node for convenience.
See:
- [[mesh-resource.node-component.aggregated-distribution]]

1)  Minimal File Tree Example

```
/repo-root/
├── _assets/                         # optional site-wide assets
├── my-node/                         # a mesh node (folder)
│   ├── _node-handle/                # handle component (resource.node-component.node-handle)
│   ├── _meta/                  # metadata flow (system)
│   │   ├── _default/
│   │   └── 2025-11-24_0142_07_v1/
│   ├── _payload/                  # payload flow (for payload nodes)
│   │   ├── _default/
│   │   ├── _working/
│   │   └── 2025-11-24_0142_07_v1/
│   ├── _cfg-inh/    # provider config (optional)
│   ├── _cfg-op/    # resolved config (optional; may be system-written)
│   ├── index.html                   # resource page
│   ├── README.md
│   └── CHANGELOG.md
└── docs/ or public host mapping     # publication target
```

12) Visual Overview

```mermaid
graph TD
  A[Mesh Node] --> B[Handle]
  A --> C[Meta flow]
  A --> E[payload flow]
  A --> G[Asset tree]
  A --> H[Resource pages]

  C --> C1[_default]
  C --> C2[Snapshots]
  E --> E1[_default]
  E --> E2[_working]
  E --> E3[Snapshots]
```

13) Glossary
- [[concept.mesh]]: the set of addressable resources in a repository, published as a site
- [[mesh-resource.node]]: an extensible  resource containing other nodes and its own components
- [[mesh-resource.node-component]]: terminal resource that supports node behavior/structure
- [[mesh-resource.node-component.flow]]: DatasetSeries representing an abstract dataset (meta/data/config)
- [[mesh-resource.node-component.flow-shot]]: concrete Dataset realization of a flow (Snapshot, DefaultShot, WorkingShot)
- [[mesh-resource.node-component.snapshot-distribution]]: a concrete serialization file (TriG, JSON-LD, etc.)
- [[mesh-resource.node-component.node-handle]]: indirection to refer to the node "as a mesh resource"
- [[mesh-resource.node-component.documentation-resource.resource-page]]: dereferenceable `index.html` for folders
- [[concept.weave-process]]: lifecycle operation to version/promote/regenerate/repair
