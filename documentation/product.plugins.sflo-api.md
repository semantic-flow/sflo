---
id: 63tfb27btzbph10tpvckz7b
title: sflo-api plugin
desc: ''
updated: 1764954329547
created: 1755903460930
---


Use noun URLs that mirror the mesh's filesystem. Bytes go to `_working`. Versioning and "current flips" happen on weave. All flows except [[mesh-resource.component.flow.metadata]] support arbitrary PATCH. System-only fields in `_knop_metadata_flow` are rejected on write.

## Conventions

* Base: `/api/{mesh}/{knopPath}/…` where `{resourcePath}` is greedy and slash-separated.
* Reserved flow directories under a knop:

  * `_knop_metadata_flow/` (required)
  * `_cfg-local/`
  * `_cfg-inh/`
  * `_ref/`
  * `_payload/`  ← payload dataset for payload knops
* Version layout under any flow:

  * `_versions/{vN}/_dist/{files…}`
  * `_default/` → pointer to a version (folder or file)
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

#### `GET /api/{mesh}/{knopPath}/`

Probably Returns:

- A list of its components (including flows) — This is important to understand what building blocks or sub-resources the knop contains.
- A list and count of its child knops — Useful for navigation and understanding the knop hierarchy.
- Its knop type (probably computed) — Helps clients understand the nature or classification of the knop.
- HATEOAS links to related resources like flows, versions, jobs, resource pages and other documentation resources, asset trees — Enables discoverability and navigation.


Maybe returns:
- backlinks (references to this knop from other places in the mesh)
- some metadata, especially non-semantic metadata like filesystem creation/modification timestamps, filesystem permissions
- status flags like whether _working has diverged

* **Dataset upload (bytes to `_working`)**

  * `PUT /api/{mesh}/{knopPath}/_payload/_working/{knopName}.jsonld`

    * Body: JSON-LD (or TriG variant if you standardize a filename)
    * Effects:

      * Bare → becomes payload knop
      * Reference → becomes Reference+Dataset
      * Dataset → replaces `_working`
    * `201 Created` (new content) or `200/204` (duplicate); `Content-Location` echoes the `_working` URL
* **List current distributions**

  * `GET /api/{mesh}/{knopPath}/_payload/_default/` → array of files
* **Fetch a current distribution**

  * `GET /api/{mesh}/{knopPath}/_payload/_default/{filename}` → bytes
* **List versions**

  * `GET /api/{mesh}/{knopPath}/_payload/_versions/`
* **Version metadata**

  * `GET /api/{mesh}/{knopPath}/_payload/_versions/{vN}` → JSON-LD summary
* **Version distributions**

  * `GET /api/{mesh}/{knopPath}/_payload/_versions/{vN}/_dist/`
  * `GET /api/{mesh}/{knopPath}/_payload/_versions/{vN}/_dist/{filename}`

## Flows (common to all five kinds)

* **Flow summary**

  * `GET /api/{mesh}/{knopPath}/_{flowKind}/`
    `flowKind ∈ { metadata-flow, op_config_flow, inheritable_config_flow, reference_flow, payload-flow }`
* **Create version from `_working` (server constructs version)**

  * `POST /api/{mesh}/{knopPath}/_{flowKind}/_versions/`

    * Body: `{ "source": "next", "note": "…" }` (optional)
    * Fast: `201 Location: …/_versions/{vN}`; Long: `202 Location: /api/{mesh}/jobs/{id}`

### PATCH (config flows)

Goal: “make a couple changes without re-uploading a full file.” We merge **current** with patch → write result to `_working`.

* `PATCH /api/{mesh}/{knopPath}/_{flowKind}/_working/`

  * Allowed `flowKind`: `op_config_flow`, `inheritable_config_flow` (and optionally others with JSON-LD content)
  * `Content-Type: application/merge-patch+json`
  * Semantics:

    1. Server reads `_default` distribution (JSON-LD framed DTO)
    2. Applies RFC 7396 merge patch
    3. Writes the merged document to `_working/` as JSON-LD
  * Response:

    * `201 Created` with `Content-Location: …/_{flowKind}/_working/`
    * Emits `fs.change`
  * **System-only fields** (especially in `_knop_metadata_flow`): writes to these keys are **rejected** with `403` (or `422`), response lists offending JSON Pointers

#### Optional PUT for entire JSON-LD next

* `PUT /api/{mesh}/{knopPath}/_{flowKind}/_working/{filename}`

  * Replace `_working` fully with a new JSON-LD file

## Pointer management (promote current)

* `PUT /api/{mesh}/{knopPath}/_{flowKind}/_default/`

  * Body: `{ "version": "vN" }`
  * Headers: `If-Match: "<etag-of-current-pointer>"`
  * `200/204` and `fs.change`

## Jobs (noun URLs; body declares type)

* `POST /api/{mesh}/jobs`

  * Example weave:

    ```json
    {
      "@type": "sflo:WeaveJob",
      "targets": [ "/{knopPath}/" ],
      "flows": ["payload-flow","metadata-flow","reference_flow"],
      "promote": true
    }
    ```
  * `202 Accepted` + `Location: /api/{mesh}/jobs/{id}`
* `GET /api/{mesh}/jobs/{id}` → status (HTML or JSON-LD)
* SSE emits progress and completion; on success weave:

  * Validates (SHACL if enabled)
  * Creates `…/_versions/{vN}` from `_working` for addressed flows
  * Optionally flips `…/_default/` when `promote:true`
  * Emits `fs.change` with `paths` and `iris`

## HATEOAS (every JSON-LD/HTML response)

Minimum links on a knop:

```json
"links": [
  { "rel":"self", "href":"/api/{mesh}/{knopPath}/" },
  { "rel":"flow", "kind":"payload-flow", "href":"/api/{mesh}/{knopPath}/_payload/" },
  { "rel":"dataset.uploadNext", "href":"/api/{mesh}/{knopPath}/_payload/_working/{knopName}.jsonld", "method":"PUT" },
  { "rel":"flow.patchNext", "kind":"op_config_flow", "href":"/api/{mesh}/{knopPath}/_cfg-local/_working/", "method":"PATCH", "type":"application/merge-patch+json" },
  { "rel":"flow.createVersion", "kind":"payload-flow", "href":"/api/{mesh}/{knopPath}/_payload/_versions/", "method":"POST" },
  { "rel":"job.start", "href":"/api/{mesh}/jobs", "method":"POST", "expects":"sflo:WeaveJob" }
]
```

## Permissions

* System-only properties (esp. `_knop_metadata_flow`) are enforced server-side:

  * Attempted write → `403` with list of blocked JSON Pointers
  * Server may augment or overwrite these during weave
* Per-mesh RBAC: viewer/editor/admin; enforced on all writes

## Notes and constraints

* No multi-file uploads: `_working` is a single JSON-LD (or TriG) file for payload-flow. 
* PATCH is supported for flows whose `_default` is JSON-LD. Not supported for TriG distributions.
* All URLs are nouns. No `?op=`. Jobs model compute.
* API ↔ site symmetry: replacing `/api` with the site host yields the same resource for GETs that return files.

## Open flags to decide (defaults in parentheses)

* Allow PATCH for `reference_flow` and `metadata-flow`? (default: **disallow** for `_knop_metadata_flow`, **allow** for `reference_flow` JSON-LD)
* Enforce `Idempotency-Key` as **required** or **optional** on PUT/PATCH? (recommended: **required**)
* Return `application/problem+json` or `…+json+ld` for errors? (recommended: **…+json+ld**)

This spec matches your rules: nouns only, `_working` for bytes, weave does validation + versioning + promotion, and PATCH merges “current → next” for the two config flows (and optionally others) while blocking system-only fields.
