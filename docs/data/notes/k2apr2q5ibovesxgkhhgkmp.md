

```md

## Prompt

We already have an architecture draft in `architecture-plan-rdfsource-createnode.md`. Use it as a **structural reference**, but treat the rules below as **authoritative** where there is any conflict.

The goal of this task is to:

1. Refine `createNode` so that it:
   - scaffolds a mesh node’s directory structure,
   - writes **_working** shots (where inputs are provided),
   - does **not** write any snapshots (v1, _default) for any flow.
2. Ensure `_meta` exists but contains **no RDF**; metadata snapshots are created only by later **weave** operations.
3. Create default `index.html` resource pages for:
   - the node itself,
   - each flow directory that is created,
   - and (optionally) each shot directory, using a platform default template.
4. Make provenance defaults come exclusively from `_cfg-op` (operational config), not from a separate provenance bundle.
5. Preserve the existing RdfSource / parsing semantics direction (file:/// base, mesh-native JSON-LD).

This sets us up so that:

- `createNode` establishes a *reviewable, un-woven node* with optional `_working` data and HTML resource pages.
- The first actual weave can be a **regular weave**—no special “initialization weave” concept is needed.

---

## Authoritative behavior for createNode

### 1. Required vs optional flows

For a newly created node:

- `_meta/` is **mandatory** (always created).
- All other flow directories are **optional**:
  - `_ref/`
  - `_payload/`
  - `_cfg-op/`
  - `_cfg-inh/`

`createNode`:

- MUST always create `_meta/` with an empty `_meta/_default/` directory (no RDF content).
- MUST NOT create `_meta/_working` at all.
- MAY create other flow directories only when needed (inputs provided, or design choice to always scaffold them).

### 2. Snapshots vs working shots

Global rule to enforce:

- **“Weaves write snapshots.”**
- `createNode` is **not** a weave; it performs no snapshots.

Concretely:

- `createNode` MUST NOT write:
  - any `v1` directories,
  - any `_default` distributions for any flow,
  - any provenance activities in `_meta`.

Instead:

- For any flow where input is provided (reference/payload/config), `createNode`:
  - MUST create a `_working/` shot directory for that flow,
  - MUST write a **mesh-native JSON-LD distribution** there,
  - MUST use the filename conventions below.

### 3. Flow dirs, snaps, filenames (Option 1 + exact flow slugs)

Flow directory slugs (fixed):

- `_meta`
- `_ref`
- `_payload`
- `_cfg-op`
- `_cfg-inh`

Node slug:

- Derived from the node folder name.

File naming:

- Payload:
  - `_payload/_working/<nodeSlug>.jsonld`
  - (later, weaves will write `_payload/vN/<nodeSlug>.jsonld` and `_payload/_default/<nodeSlug>.jsonld`)
- Other flows:
  - `_ref/_working/<nodeSlug>_ref.jsonld`
  - `_cfg-op/_working/<nodeSlug>_cfg-op.jsonld`
  - `_cfg-inh/_working/<nodeSlug>_cfg-inh.jsonld`
- `_meta`:
  - For **this task**, `createNode` **does not** write any JSON-LD inside `_meta` at all.
  - `_meta/_default/` is created as an empty directory; snapshots will be created by weaves later.

No `_meta/_working` directory.

### 4. RdfSource and parsing semantics (must keep)

Continue to implement/extend the previously agreed model:

- `RdfSource` discriminated union:
  - `kind: 'file' | 'url' | 'inline'` with `syntax` hint.
- Parsing behavior:
  - For `kind: 'file'`:
    - `documentIri = file:///absolute/path/to/file`
    - parse with `baseIri = documentIri`.
  - For `kind: 'url'`:
    - `documentIri = url`.
  - For `kind: 'inline'`:
    - use a synthetic `file:///virtual/...` base (document in comments).
- Mesh-native JSON-LD serialization:
  - no `@base` in context,
  - local IRIs relative to the chosen target base,
  - external IRIs absolute.

`createNode` must use `RdfSource` + debasing logic to populate `_working` distributions when inputs are provided.

### 5. Provenance defaults: only via operational config

Remove or ignore `ProvenanceBundleInput` in `createNode`:

- `createNode` options should look like:

  ```ts
  export interface CreateNodeOptions {
    payloadDataset?: RdfSource;
    referenceDataset?: RdfSource;
    operationalConfig?: RdfSource;
    inheritableConfig?: RdfSource;

    allowNonEmpty?: boolean;

    // Optional: node README content or path (see below)
    readme?: string;      // inline markdown
    readmePath?: string;  // file path for markdown
  }
````

* If `operationalConfig` is provided:

  * Parse it as RDF via `RdfSource` and write `_cfg-op/_working/<nodeSlug>_cfg-op.jsonld` in mesh-native form.
  * This config MAY contain “provenance defaults” (rightsHolder, license, default agents, etc.), but **no actual weave events**.
* Actual weave events and PROV activities will be created later by a generic weave operation consuming `_cfg-op`, `_working` datasets, etc.

### 6. README and starter kits

For this task, support at least:

* Optional README content for the node itself:

  * `readme` (inline markdown) or `readmePath` (file).
* Do **not** treat README as RDF; it’s normal content to be integrated into the node’s resource page (index.html).
* You do *not* need to implement zipped starter kits now; just keep the architecture flexible enough that `createNode` could later accept a “starter node bundle” and unpack it before applying additional config.

---

## Resource pages (index.html) behavior

We want dereferenceability even before the first weave.

### 7. index.html generation

`createNode` should generate basic `index.html` files using a “platform default” template for:

* The node root folder:

  * `<nodePath>/index.html`
* Each created flow directory:

  * `<nodePath>/_meta/index.html`
  * `<nodePath>/_payload/index.html` (if created)
  * `<nodePath>/_ref/index.html` (if created)
  * etc.
* Optionally, each shot directory created at this stage:

  * `<nodePath>/_payload/_working/index.html`
  * `<nodePath>/_cfg-op/_working/index.html`
  * etc.

Template requirements (minimal for now):

* Node `index.html`:

  * Mentions the node slug.
  * Links to any existing flow directories as “NamingResources” / “FileResources” (no need for full ontology terms, just human-readable for now).
  * Optionally renders README content if provided (simple markdown → HTML is enough; can be naive).

* Flow `index.html`:

  * Identifies the flow by slug (`_payload`, `_ref`, `_cfg-op`, etc.).
  * Links to any `_working` distributions present (plain file links).

These templates can be simple functions or static HTML skeletons with minimal logic; the goal is just to ensure:

* every directory is dereferenceable over HTTP,
* there’s enough structure that future weaves can build richer resource pages without breaking anything.

---

## What needs to be changed vs the original architecture plan

When you implement this task, please:

1. **Remove** snapshot generation from `createNode`:

   * No `_meta/v1`, no `_meta/_default` distributions.
   * No `v1` snapshots for `_payload`, `_ref`, `_cfg-*`.
2. **Ensure `_meta` is mandatory**, but only the directory and `_default/` subdir exist; no RDF.
3. **Add `_working` shots** for flows where inputs are provided, using the naming rules above.
4. **Drop `ProvenanceBundleInput`** from `createNode`; provenance defaults belong in `_cfg-op/_working`.
5. **Add support for optional Node README** (inline or from file) at `createNode` time, store it as nodename/README.md
6. **Generate default `index.html`** in node root (using README.md if present, and linking to created flow and FlowShot dirs).

You can either refactor the existing `createNode` implementation/plan or restart it with these rules; given the amount of change, a **surgical refactor** is probably reasonable:

* Keep file locations, error types, and basic directory scaffolding logic.
* Remove snapshot-writing logic and provenance bundles.
* Insert `_working` shot writing + `index.html` generation.

---

## Success criteria

This task is complete when:

1. `createNode`:

   * Creates `_meta/_default/` as an empty directory.
   * Creates other flow dirs only as needed.
   * Writes `_working` distributions (mesh-native JSON-LD) for any flows where `RdfSource` inputs are provided.
   * Does not write any snapshots (`v1`, `_default` distributions) or metadata RDF.
2. Optional `operationalConfig` is written to `_cfg-op/_working/<nodeSlug>_cfg-op.jsonld` and not used to generate any PROV events yet.
3. Optional README is accepted and integrated into the node’s `index.html` page.
4. `index.html` exists in:

   * node root,
   * `_meta/`,
   * each non-empty flow dir,
   * and each `_working` shot dir created by `createNode`.
5. All affected tests are updated or added to reflect:

   * `_meta` is mandatory but RDF-free after `createNode`,
   * no snapshots exist after `createNode`,
   * `_working` distributions appear correctly when inputs are provided,
   * `index.html` gets created in the expected locations.

```
