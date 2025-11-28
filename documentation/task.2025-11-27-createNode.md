---
id: ufnbtre0tn2pxq7dzjcgrz0
title: 2025-11-27-createNode
desc: ''
updated: 1764291005757
created: 1764276666359
---

## Prompt

Implement a core `createNode` operation that:

- Takes a filesystem path and options.
- Initializes that path as a **mesh node**.
- Creates the minimal **handle** and **metadata** flows (including a v1 metadata shot).
- Optionally attaches initial payload/reference/config inputs.
- Enforces basic safety invariants (no double-init, non-empty dir warnings).

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
     - A `v1` FlowShot is created for `_node-metadata-flow`.
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
     - MUST **error** if the path already “looks like a node” (presence of `_node-handle` or `_node-metadata-flow`).
     - MUST **warn/error** if the directory exists and is non-empty, unless `options.allowNonEmpty` (or similar) is set.
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
       - Copy or normalize it into `_reference-flow/v1/…` (no unpack, no de-basing logic yet).
     - If `payloadDatasetPath` is provided:
       - Copy or normalize it into `_payload-flow/v1/…` (no de-basing, no unpack).
     - Config files:
       - If provided, copy/normalize into `_config-operational-flow/v1/…` and/or `_config-inheritable-flow/v1/…`.
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
