---
id: 63tfb27btzbph10tpvckz7b
title: sflo-api plugin
desc: ''
updated: 1764327645693
created: 1755903460930
---


Use noun URLs that mirror the mesh's filesystem. Bytes go to `_working`. Versioning and "current flips" happen on weave. All flows except [[mesh-resource.node-component.flow.node-metadata]] support arbitrary PATCH. System-only fields in `_node_metadata_flow` are rejected on write.

## Conventions

* Base: `/api/{mesh}/{nodePath}/…` where `{resourcePath}` is greedy and slash-separated.
* Reserved flow directories under a node:

  * `_node_metadata_flow/` (required)
  * `_cfg-op/`
  * `_cfg-inh/`
  * `_ref/`
  * `_payload/`  ← payload dataset for payload nodes
* Snapshot layout under any flow:

  * `_snapshots/{vN}/_dist/{files…}`
  * `_default/` → pointer to a snapshot (folder or file)
  * `_working/`   → working content before weave
* Headers:

  * `Idempotency-Key` on PUT/POST of bytes or creators
  * `ETag` on reads; `If-Match` on pointer changes
  * Optional `Content-Digest: sha-256=:…:` on bytes
* Media types:

  * JSON-LD bytes: `application/ld+json`
  * TriG bytes: `application/trig`
  * Merge patch: `application/merge-patch+json` (RFC 7396) over **framed JSON-LD**
* Validation:

  * PUT/PATCH: **syntactic only** (parse). SHACL runs during weave.
* Errors: `application/problem+json` or `…+json+ld` with `type`, `detail`, `instance`.

## Events (SSE)

`GET /api/{mesh}/events`

* `fs.change { paths:[], iris:[] }`
* `job.progress { job, pct, msg }`
* `job.done { job, artifacts:[…], changed:{ paths, iris } }`

## Mesh registry

* `POST /api/meshes`

  * Body: `{ "name": "test-ns", "path": "./test-ns" }`
  * `201 Created` + `Location: /api/test-ns/`
* `GET /api/meshes` → list

## Resources

### Nodes

#### `GET /api/{mesh}/{nodePath}/`

Probably Returns:

- A list of its components (including flows) — This is important to understand what building blocks or sub-resources the node contains.
- A list and count of its child nodes — Useful for navigation and understanding the node hierarchy.
- Its node type (probably computed) — Helps clients understand the nature or classification of the node.
- HATEOAS links to related resources like flows, snapshots, jobs, resource pages and other documentation resources, asset trees — Enables discoverability and navigation.


Maybe returns:
- backlinks (references to this node from other places in the mesh)
- some metadata, especially non-semantic metadata like filesystem creation/modification timestamps, filesystem permissions
- status flags like whether _working has diverged

* **Dataset upload (bytes to `_working`)**

  * `PUT /api/{mesh}/{nodePath}/_payload/_working/{nodeName}.jsonld`

    * Body: JSON-LD (or TriG variant if you standardize a filename)
    * Effects:

      * Bare → becomes payload node
      * Reference → becomes Reference+Dataset
      * Dataset → replaces `_working`
    * `201 Created` (new content) or `200/204` (duplicate); `Content-Location` echoes the `_working` URL
* **List current distributions**

  * `GET /api/{mesh}/{nodePath}/_payload/_default/` → array of files
* **Fetch a current distribution**

  * `GET /api/{mesh}/{nodePath}/_payload/_default/{filename}` → bytes
* **List snapshots**

  * `GET /api/{mesh}/{nodePath}/_payload/_snapshots/`
* **Snapshot metadata**

  * `GET /api/{mesh}/{nodePath}/_payload/_snapshots/{vN}` → JSON-LD summary
* **Snapshot distributions**

  * `GET /api/{mesh}/{nodePath}/_payload/_snapshots/{vN}/_dist/`
  * `GET /api/{mesh}/{nodePath}/_payload/_snapshots/{vN}/_dist/{filename}`

## Flows (common to all five kinds)

* **Flow summary**

  * `GET /api/{mesh}/{nodePath}/_{flowKind}/`
    `flowKind ∈ { metapayload-flow, op_config_flow, inheritable_config_flow, reference_flow, payload-flow }`
* **Create snapshot from `_working` (server constructs version)**

  * `POST /api/{mesh}/{nodePath}/_{flowKind}/_snapshots/`

    * Body: `{ "source": "next", "note": "…" }` (optional)
    * Fast: `201 Location: …/_snapshots/{vN}`; Long: `202 Location: /api/{mesh}/jobs/{id}`

### PATCH (config flows)

Goal: “make a couple changes without re-uploading a full file.” We merge **current** with patch → write result to `_working`.

* `PATCH /api/{mesh}/{nodePath}/_{flowKind}/_working/`

  * Allowed `flowKind`: `op_config_flow`, `inheritable_config_flow` (and optionally others with JSON-LD content)
  * `Content-Type: application/merge-patch+json`
  * Semantics:

    1. Server reads `_default` distribution (JSON-LD framed DTO)
    2. Applies RFC 7396 merge patch
    3. Writes the merged document to `_working/` as JSON-LD
  * Response:

    * `201 Created` with `Content-Location: …/_{flowKind}/_working/`
    * Emits `fs.change`
  * **System-only fields** (especially in `_node_metadata_flow`): writes to these keys are **rejected** with `403` (or `422`), response lists offending JSON Pointers

#### Optional PUT for entire JSON-LD next

* `PUT /api/{mesh}/{nodePath}/_{flowKind}/_working/{filename}`

  * Replace `_working` fully with a new JSON-LD file

## Pointer management (promote current)

* `PUT /api/{mesh}/{nodePath}/_{flowKind}/_default/`

  * Body: `{ "snapshot": "vN" }`
  * Headers: `If-Match: "<etag-of-current-pointer>"`
  * `200/204` and `fs.change`

## Jobs (noun URLs; body declares type)

* `POST /api/{mesh}/jobs`

  * Example weave:

    ```json
    {
      "@type": "sflo:WeaveJob",
      "targets": [ "/{nodePath}/" ],
      "flows": ["payload-flow","metapayload-flow","reference_flow"],
      "promote": true
    }
    ```
  * `202 Accepted` + `Location: /api/{mesh}/jobs/{id}`
* `GET /api/{mesh}/jobs/{id}` → status (HTML or JSON-LD)
* SSE emits progress and completion; on success weave:

  * Validates (SHACL if enabled)
  * Creates `…/_snapshots/{vN}` from `_working` for addressed flows
  * Optionally flips `…/_default/` when `promote:true`
  * Emits `fs.change` with `paths` and `iris`

## HATEOAS (every JSON-LD/HTML response)

Minimum links on a node:

```json
"links": [
  { "rel":"self", "href":"/api/{mesh}/{nodePath}/" },
  { "rel":"flow", "kind":"payload-flow", "href":"/api/{mesh}/{nodePath}/_payload/" },
  { "rel":"dataset.uploadNext", "href":"/api/{mesh}/{nodePath}/_payload/_working/{nodeName}.jsonld", "method":"PUT" },
  { "rel":"flow.patchNext", "kind":"op_config_flow", "href":"/api/{mesh}/{nodePath}/_cfg-op/_working/", "method":"PATCH", "type":"application/merge-patch+json" },
  { "rel":"flow.createSnapshot", "kind":"payload-flow", "href":"/api/{mesh}/{nodePath}/_payload/_snapshots/", "method":"POST" },
  { "rel":"job.start", "href":"/api/{mesh}/jobs", "method":"POST", "expects":"sflo:WeaveJob" }
]
```

## Permissions

* System-only properties (esp. `_node_metadata_flow`) are enforced server-side:

  * Attempted write → `403` with list of blocked JSON Pointers
  * Server may augment or overwrite these during weave
* Per-mesh RBAC: viewer/editor/admin; enforced on all writes

## Notes and constraints

* No multi-file uploads: `_working` is a single JSON-LD (or TriG) file for payload-flow. 
* PATCH is supported for flows whose `_default` is JSON-LD. Not supported for TriG distributions.
* All URLs are nouns. No `?op=`. Jobs model compute.
* API ↔ site symmetry: replacing `/api` with the site host yields the same resource for GETs that return files.

## Open flags to decide (defaults in parentheses)

* Allow PATCH for `reference_flow` and `metapayload-flow`? (default: **disallow** for `_node_metadata_flow`, **allow** for `reference_flow` JSON-LD)
* Enforce `Idempotency-Key` as **required** or **optional** on PUT/PATCH? (recommended: **required**)
* Return `application/problem+json` or `…+json+ld` for errors? (recommended: **…+json+ld**)

This spec matches your rules: nouns only, `_working` for bytes, weave does validation + versioning + promotion, and PATCH merges “current → next” for the two config flows (and optionally others) while blocking system-only fields.
