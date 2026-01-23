---
id: n5qdtqg3a941372y6cc40ix
title: Semantic Flow Core Self Containment
desc: 'Extract in-namespace terms from Semantic Flow core sources, attach canonical provenance links, and generate self-documenting ResourcePages for every Nomen'
updated: 1768799175162
created: 1768780529266
---

## Purpose

This use case defines the minimum Semantic Flow Core functionality needed to:

1. **Extract all in-namespace terms** from one or more RDF sources (ontology, shapes, profiles, examples).
2. **Mint/maintain a Nomen surface** for every discovered term (designator IRI + NomenHandle + metadata).
3. **Attach canonical, machine-readable provenance** back to the source artifacts used for extraction.
4. **Generate self-documenting ResourcePages** for all terms.

This is not an end-state by itself: it is the **foundation of a general-purpose ontology browser**. The “browser” goal changes the design constraints: the extraction pipeline must be configurable, multi-source, and able to present competing/overlapping sources without pretending there is a single truth.

## Scope expansion: from self-containment to general-purpose ontology browser

Core self-containment is the **bootstrap**:

* You can publish a namespace where every term has a page.
* Pages can be generated solely from RDF + conventions.
* The site is navigable without external tools.

General-purpose ontology browser adds:

* **Multi-ontology browsing** (multiple namespaces, multiple meshes, mixed hosting).
* **Import closure support** (configurable: none, shallow, full closure; plus filters).
* **Cross-ontology linking** (mappings, alignments, closeMatch/sameAs/related).
* **Faceted search and type filters** (Class/Property/Shape/Individual/etc.).
* **Graph views** (subclass trees, property graphs, SHACL property shapes).
* **Source comparison** (show where each statement came from; expose conflicts).
* **Query surface** (SPARQL explorer / “show me triples about X” presets).

The self-containment pipeline should therefore be implemented as a **browser-grade indexing and presentation pipeline**, not a one-off ontology publishing trick.

## Inputs

### Source artifacts

One or more RDF sources that define or describe terms, such as:

* Ontology payload Flow (and its Slices/AbstractFiles)
* SHACL shapes Flow
* Example datasets (optional)
* External upstream sources (optional)

Each source is referenced via a **ReferenceLink** from the relevant NomenHandle(s).

### Extraction configuration

A configurable profile describing:

* term discovery rules (namespace boundaries; reserved-path exclusions)
* which rdf:types count as “terms”
* whether imports are followed (and how far)
* bounding rules for page content (prevent blow-ups)

## Outputs

### Nomen surface for each discovered term

For each discovered term IRI **T** in the target namespace:

* Ensure `T/` exists as the **designator IRI** (Nomen).
* Ensure `T/_nomen/` exists as the **NomenHandle** (the naming object).
* Ensure `T/_nomen/_meta/_working/...` exists as the **NomenMetadataFlow working slice** distributions (at least one format).

### Nomen structure (designator vs handle)

For each term IRI **T**:

* The designator IRI `T/` denotes the referent (person, artifact, etc.). It is a human-facing entrypoint but is not the identifier-object.
* The Nomen is identified by its handle `T/_nomen/` (identifier-object) and is the subject for naming metadata and ReferenceLinks.
* Nomen components live under the designator path in the filesystem, e.g. `T/_nomen/_meta/` and `T/_nomen/_inventory/`, but the handle IRI denotes the Nomen itself.

### Canonical provenance

For each discovered term, attach one or more **ReferenceLinks** to the authoritative sources used for extraction.

Minimum expectation:

* at least one ReferenceLink with role **Canonical**
* optionally additional ReferenceLinks with role **Integrate** (page body) or **Supplemental**

### ResourcePages

Generate `T/index.html` (or equivalent) that:

* presents label/comment/definition highlights
* shows the canonical sources (ReferenceLinks) and verification metadata
* displays extracted RDF (bounded and explainable)
* provides navigation (subClassOf, domain/range, subPropertyOf, shape structure)
* provides backlinks (bounded; cached or computed)

## Extraction pipeline

### 1) Term discovery

Discover candidate terms using any combination of:

* **Namespace scan**: subjects within the namespace base
* **Type scan**: `rdf:type` in {owl:Class, owl:ObjectProperty, owl:DatatypeProperty, sh:NodeShape, …}
* **Hybrid union** with explicit exclusions

Hard exclusions (must be enforced for stability):

* reserved underscore-path system resources (e.g., `/_mesh/`, `/_knops/`, `/_assets/`, `/_nomen/`, etc.)
* file IRIs (extensions) unless explicitly configured

### 2) Scaffolding and identity persistence

* Create missing Nomen/NomenHandle/metadata scaffolding.
* Do not delete Nomina automatically when a source stops mentioning them.
* Mark deprecated instead (role Deprecated, or a dedicated deprecation signal).

### 3) ReferenceLink creation

For each term, emit ReferenceLinks that identify:

* the source artifact(s) used
* the intended role (Canonical / Integrate / Supplemental / Deprecated)
* expectedTargetKind
* verification metadata (lastVerifiedAt/by)

### 4) Page model assembly

Assemble the page’s “term model” from:

* NomenMetadataFlow (curation + governance + links)
* integrated sources (ReferenceLinks with role Integrate)

Default bounded extraction:

* include triples where `T` is subject
* include selected inbound statements (bounded)
* include bounded structural closure (subclass tree N steps, etc.)

### 5) Indexing (browser feature)

To support general browsing, maintain an index layer (implementation detail; can be sharded):

* term index by type
* label index
* backlinks index
* source index (which source asserted which triple)

This can be represented as mesh-level inventories or specialized indices.

## “Not perfect truth” clarification

Semantic Flow should not silently decide what is *true* about a term. Instead it should:

* **Record what sources were used** (ReferenceLinks).
* **Record what extraction/query rules were applied** (profile + bounding rules).
* **Make conflict visible** rather than resolving it silently.

Examples of “magically inferred” behavior to avoid:

* choosing a single rdfs:label when multiple disagree, without recording the alternatives
* inferring canonical definitions from usage frequency
* treating imported statements as authoritative without a declared policy
* auto-collapsing co-denoters or mappings into equivalence without an explicit assertion

The browser may provide heuristics (ranking, defaults), but it must preserve and expose provenance.

## Acceptance criteria

1. One command (or weave step) yields ResourcePages for all in-namespace terms.
2. Each page shows at least one canonical ReferenceLink.
3. Incremental rebuild touches only affected pages/indices.
4. The extraction profile is explicit and reproducible.
5. Conflicting sources can coexist without silent overwrite.

## Open decisions

* How import closure is configured and presented (none/shallow/full; per-source overrides).
* How large indices are stored (flow vs non-flow dataset; sharding strategy).
* Default bounding rules per term type (Class/Property/Shape).
* Backlinks computation strategy (cached, incremental, on-demand).
