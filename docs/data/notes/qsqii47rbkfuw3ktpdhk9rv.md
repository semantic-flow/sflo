
## TODO

- [x] Explore project structure and understand requirements
- [x] Design RdfSource abstraction architecture
- [x] Design createNode operation architecture
- [ ] Document parsing semantics for SFLO spec
- [ ] Implement RdfSource types and core abstractions
- [ ] Implement RdfSource parsing/serialization helpers
- [ ] Implement createNode core function
- [ ] Implement filesystem scaffolding utilities
- [ ] Implement metadata generation with provenance stubs
- [ ] Create tests for RdfSource
- [ ] Create tests for createNode
- [ ] Create simple Node.js runner script
- [ ] Update task files with progress

## Prompt

Implement and document a coherent **RDF loading and serialization model** for Semantic Flow, then **integrate it into `createNode`**.

This task has four tightly related parts:

1. Define a **code-level `RdfSource` abstraction** and helpers.
2. Write/update the **“Parsing Semantics”** sections of the SFLO spec (check [[concept.identifier.intramesh.relative]], [[concept.iri]], [[concept.implied-rdf-base]])
3. Formalize the **debasing/rebasing algorithm** (in [[concept.debasing]]) for adopting external datasets into mesh-native form.
4. Integrate all of the above into the  **`createNode`** task ([[task.2025-11-27-createNode]]), replacing any ad-hoc path/string handling.

The goal is to make RDF ingestion/emission:

- explicit,
- testable,
- compatible with RDF/JS and JSON-LD tooling,
- and aligned with the “relative, base-free JSON-LD on disk” rule.

---

## Context & Decisions (must be respected)

### 1. Mesh-native JSON-LD style (file format)

Mesh-authored RDF files (the ones Semantic Flow writes into the node tree) MUST follow:

- **No `@base`** in JSON-LD.
- **Local identifiers are relative IRIs**:
  - e.g. `"@id": "foo"`, `"@id": "payload/v1"`.
- **External identifiers are absolute IRIs**:
  - vocabularies, external links, etc.

These files must be “publishable anywhere” as-is:
- When loaded from `file:///…`, the base is file path.
- When served from HTTP (e.g. GitHub Pages), the base is the HTTP URL.

No additional rewrite step is required at publish time.

### 2. Internal base semantics (parsing)

Internally, RDF/JSON-LD tooling always works with **absolute IRIs**.

For **any mesh-native file read from disk**:

- Compute **document IRI** as a `file:///` URL from the absolute path.
- Always parse with **`baseIRI = file:///…`**:
  - JSON-LD: `jsonld.expand(..., { base: documentIri })` or equivalent.
  - Turtle/TriG: N3/rdf-parse with `baseIRI: documentIri`.

There is **no “base-less” in memory**; “base-free” is only a file-level serialization convention.

For external datasets (URL / file):

- If they have an explicit base or document IRI (HTTP/file), use that as base.
- If they have relative IRIs but no usable base, treat as an error or require explicit base (no silent guessing).

### 3. Flow + filename conventions relevant to this task

We are going with **Option 1**:

- **Flow directory slugs** (core flows, short names):
  - `_meta`    → node metadata flow (old `_node-metadata-flow`)
  - `_ref`     → reference flow
  - `_payload` → payload/data flow
  - `_cfg-op`  → operational config flow
  - `_cfg-inh` → inheritable config flow

- **Node slug**:
  - Derived from the node folder name.
  - Used to construct filenames.

- **Distribution filenames**:

  - Payload: `<nodeSlug>.jsonld` (no `_payload` in filename).
  - Others: `<nodeSlug>-<flowShort>.jsonld`, e.g.:
    - metadata: `<nodeSlug>_meta.jsonld`
    - reference: `<nodeSlug>_ref.jsonld`
    - cfg-op: `<nodeSlug>_cfg-op.jsonld`
    - cfg-inh: `<nodeSlug>_cfg-inh.jsonld`

Example for node at `/ontology/semantic-flow-ontology/`:

```text
/ontology/semantic-flow-ontology/
  _payload/_default/semantic-flow-ontology.jsonld
  _meta/_default/semantic-flow-ontology_meta.jsonld
  _ref/_default/semantic-flow-ontology_ref.jsonld
