---
id: ufnbtre0tn2pxq7dzjcgrz0
title: 2025-11-27-createNode
desc: ''
updated: 1764327645683
created: 1764276666359
---

## Prompt

Implement a core `createNode` operation that:

- Takes a filesystem path and options.
- Initializes that path as a **mesh node**.
- Creates the minimal **handle** and **metadata** folders .
- Optionally attaches initial payload/reference/config inputs.
- Enforces basic safety invariants (no double-init, non-empty dir warnings).
- executes the [[weave process|concept.weave-process]]

This should be a **pure Node.js library function** plus a minimal Node-based entry point for manual use. Do **not** integrate Oclif yet (future task; likely with `@inquirer/prompts` for interactivity).

---

## Decisions

1. **Name and scope**
   - Operation name: `createNode`.
   - Lives in core library (e.g. `@semantic-flow/core`), not tied to any specific CLI framework.
   - This task provides:
     - `createNode(nodeTargetPath, options)` implementation.
     - A thin, non-interactive Node entry point (e.g. `scripts/create-node.ts`) for manual testing.

2. **Metadata flow invariants**
   - Metadata is **only** written as part of weaves (including this one).
   - The **metadata flow is always versioned**:
     - A `v1` FlowShot is created for `_meta`.
     - A `_default` distribution is a copy of `v1` with `@base` implicitly equal to the file’s future URL (no in-file `@base`).
   - There is **no `_working` metadata** in this v1.

3. **Mesh-native RDF style**
   - For all SF-authored RDF files:
     - No `@base` in the file.
     - Local identifiers use **relative IRIs** (see `concept.identifier.intramesh.relative`).
     - Tooling must supply the base IRI when parsing/serializing (based on node path + namespace root).
   - This applies to metadata and any SF-authored reference/payload flows in this task.

4. **Reference vs payload**
   - **Exactly one ReferenceFlow per node** (or none).
   - PayloadFlow is optional; a node having a PayloadFlow makes it a **Payload Node**.
   - Enforceable difference (to be wired into SHACL later, not enforced in this task’s runtime logic):
     - If a node has a PayloadFlow, its ReferenceFlow **must** type the node as a `dcat:Dataset`:
       - In reference data: `<> a dcat:Dataset`.

5. **Safety and idempotence**
   - `createNode(nodeTargetPath, options)`:
     - MUST **error** if the path already “looks like a node” (presence of `_node-handle` or `_meta`).
     - MUST **warn** if the directory exists and is non-empty.
     - SHOULD be idempotent only in the trivial “fails-fast on already-initialized” sense; no attempt to merge with existing node structure in this task.

6. **Parent topology**
   - This task does **not** persist any parent/child relationships in metadata.
   - Optional runtime inspection of parent directories (e.g. to warn about creating “orphan” nodes) is out of scope for v1 and should **not** block this task.
   - Mesh composability/transposability is preserved by not writing parent references into RDF.

7. **Payload/reference/config handling (v1 scope)**
   - `createNode` **may** accept:
     - `payloadDatasetPath?: string`
     - `referenceDatasetPath?: string`
     - `operationalConfigPath?: string`
     - `inheritableConfigPath?: string`
     - `provenanceInput?: ProvenanceBundleInput` (see below)
   - In this task:
     - If `referenceDatasetPath` is provided:
       - Copy or normalize it into `_ref/_working/` (no unpack, no de-basing logic yet).
     - If `payloadDatasetPath` is provided:
       - Copy or normalize it into `_payload/_working/` (no de-basing, no unpack).
     - Config files:
       - If provided, copy/normalize into `_cfg-op/_working/` and/or `_cfg-inh/_working/`.
     - in all cases, the target filename in general will be "node slug" + "flow slug" + ".jsonld". 
       - the flow slugs are defined in ../ontology/semantic-flow/
       - the node slug can be defined in operationalConfig. If it's not, then just use the folder name as the slug.
     - 
   - **No de-basing or unpacking** in this task:
     - Imported payload/reference/config are treated as already “good enough” or mesh-native.
     - Debasing and unpacking are separate follow-up tasks.

8. **Provenance input (structure, not full PROV)**
   - `createNode` should accept a **structured provenance input**, *not* a full `ProvenanceContext`.
   - Example shape (TS, conceptual):

     ```ts
     type ProvenanceBundleInput = {
       primaryAgentIri?: string;     // human or system
       organizationIri?: string;     // rights holder org, optional
       contributorsIri?: string[];   // additional agents, optional
       rightsHolderIri?: string;     // explicit rights holder; if absent, may default from org/primary
       licenseIri?: string;          // e.g., CC BY-SA URL
     };
     ```

   - In this task:
     - You do **not** need to fully implement DelegationChain / ProvenanceContext, but:
       - `createNode` should **reserve space** in the v1 metadata shot for a future PROV model (e.g., stub nodes with IRIs based on your fragment scheme).
       - At minimum, write the node’s `rightsHolder` and `license` if provided.

9. **RDF format expectations**
   - Code should be written so that metadata and reference/payload flows can be emitted as **JSON-LD** datasets (primary), with internal APIs abstract enough to allow future TriG distributions.
   - Do not hard-wire a specific RDF library beyond what’s needed to:
     - create simple graphs,
     - serialize JSON-LD with relative IRIs.

10. **CLI framework**
    - This task **does not** integrate Oclif or any CLI framework.
    - A minimal Node entry point (e.g. `node scripts/create-node.js <nodeTargetPath>`) is enough.
    - Future CLI work:
      - Will likely use `@inquirer/prompts` (modern Inquirer) for interactivity instead of Enquirer.
      - Should wrap this `createNode` core function, not replace it.

---

## Requirements

### Functional

- Implement:

  ```ts
  async function createNode(
    nodeTargetPath: string,
    options?: {
      payloadDatasetPath?: string;
      referenceDatasetPath?: string;
      operationalConfigPath?: string;
      inheritableConfigPath?: string;
      provenanceInput?: ProvenanceBundleInput;
      allowNonEmpty?: boolean;
    }
  ): Promise<void>;
````

* Behavior:

  1. **Path handling**

     * If `nodeTargetPath` does not exist: create directory.
     * If it exists and:

       * contains `_node-handle` or `_meta` → throw an error (“Node already initialized”).
       * is non-empty and `allowNonEmpty` is not set → throw an error or require explicit override.

  2. **Node scaffolding**

     * Create `_node-handle/` folder (stub content; minimal files per existing ontology conventions).

     * Create `_meta/` with structure:

       ```
       _meta/
         v1/
           <metadata>.jsonld
         _default/
           <metadata>.jsonld   # content identical to v1, but treated as “current”
       ```

     * Metadata content for v1 must include at least:

       * A minimal node description stub (node IRI, type placeholder).
       * Rights/licensing if present in `provenanceInput` (at dataset or node level).
       * A placeholder or minimal structure for the NodeCreation Activity and provenance model (no need to fully flesh out DelegationChain yet, but leave room).

  3. **Optional flows**

     * If `referenceDatasetPath` provided:

       * Create `_ref/v1/…` and copy/normalize the file there.
       * (No validation that `<> a dcat:Dataset` is present yet; that’s SHACL-level, not runtime.)
     * If `payloadDatasetPath` provided:

       * Create `_payload/v1/…` and copy/normalize the file.
     * If config paths provided:

       * Create `_cfg-op/v1/…` and/or `_cfg-inh/v1/…` and copy/normalize.

  4. **No advanced behaviors**

     * No de-basing (no IRI rewriting).
     * No unpacking payload into child nodes.
     * No config inheritance from parent nodes.

* Implement a simple Node-based runner:

  ```bash
  node scripts/create-node.js <nodeTargetPath> [--allow-nonempty]
  ```

  that:

  * resolves `nodeTargetPath`,
  * calls `createNode(nodeTargetPath, { allowNonEmpty: true/false })`,
  * logs structured success/failure.

### Non-Functional

* Clear, structured errors for:

  * already-initialized node,
  * non-empty directory without `allowNonEmpty`,
  * filesystem failures.
* Logging should integrate with your existing logging abstraction if available; otherwise, stub logging with a thin wrapper that can be replaced later.
* Keep the core function testable without side effects beyond filesystem writes:

  * All external interactions (e.g., resolving base IRIs, future namespace info) should be parameterizable or stubbed for now.

---

## Deliverables

1. **Core implementation**

   * `createNode` function in the core Node library.
   * Supporting types (`ProvenanceBundleInput`, options interface).

2. **Filesystem layout tests**

   * Tests that:

     * Starting from an empty directory, `createNode` produces the expected folder/file structure.
     * Running `createNode` again fails with “already initialized.”
     * Non-empty directory handling behaves correctly.

3. **Minimal metadata content tests**

   * Sanity checks that:

     * `_meta/v1/*.jsonld` and `_default/*.jsonld` both exist.
     * `rightsHolder` and `license` triples are present when `provenanceInput` provides them.
     * Local IRIs in metadata are relative (no `@base` in the file).

4. **Simple Node runner**

   * `scripts/create-node.(ts|js)` or equivalent, wired to `createNode` with basic CLI arg parsing.

---

## Out of Scope / Follow-ups

* Oclif-based CLI wrapping `createNode` (with `@inquirer/prompts`).
* De-basing (namespace adoption) of imported datasets.
* Payload unpacking into child nodes.
* Config inheritance (from parent nodes).
* Full PROV/DelegationChain/ProvenanceContext modeling in metadata (beyond minimal stubs).
* RDF store integration or SHACL validation wiring (e.g., the `PayloadNode ⇒ dcat:Dataset` rule).
