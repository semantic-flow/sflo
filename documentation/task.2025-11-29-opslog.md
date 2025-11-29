---
id: g8h08le4lmeoxhf3zeqsecf
title: 2025 11 29 Opslog
desc: ''
updated: 1764434852178
created: 1764434223489
---

# **Prompt for Roo: Integrate `_opslog` and `_meta` Flows Into the Semantic Flow Model**

We need to update the Semantic Flow documentation and the `createNode` code to reflect a finalized separation of responsibilities among `_opslog`, `_meta`, and `_ref`. This prompt defines exactly what must be implemented.

All flows are now optional, so the only marker for a node is its "_node-handle/" folder. We need a sflo-config-ontology predicate for turning on/off the opslog. If it was on for a weave, and then gets turned off, I think _default and _working should get deleted on the next weave. 

---

# **1. New Flow: `_opslog` (Operational Log Flow)**

## **Purpose**

Record **node-level operational events**, including:

* `meta:NodeCreation`
* `meta:NodeWeave`, `meta:PayloadWeave`, etc.
* Validation run activities
* Metric collection activities
* Backlink scan activities
* Any other `meta:MeshActivity` instances

## **Format**

* **Always Turtle (`opslog.ttl`)**
* Append-only semantics for `_working`
* Snapshot-on-weave semantics consistent with other flows

## **Directory Layout Per Node**

Flows live **next to** the `_node-handle` folder:

```
ns/
  my-node/
  _payload/
  _ref/
  _cfg-op/
  _cfg-inh/
  _meta/
    _working/
      my-node_meta.jsonld
    _current/
      my-node_meta.jsonld
    2025-11-29_0647_59_v1/
      my-node_meta.jsonld
  _opslog/
    _working/
      my-node_opslog.ttl
    _current/
      my-node_opslog.ttl
    2025-11-29_0647_59_v1/
      my-node_opslog.ttl
    2025-11-29_0704_01_v2/
      my-node_opslog.ttl
```

## **Behavior**

1. `_working/opslog.ttl` accumulates TTL blocks before/during a weave.
2. At weave completion:

   * Finalize the NodeWeave activity inside `_working/opslog.ttl`
     (e.g., add `prov:endedAtTime`, `meta:status "success"` or `"failure"`).
   * Copy `_working/opslog.ttl` → `_opslog/<slug_vN>/opslog.ttl`
   * Copy `_working/opslog.ttl` → `_opslog/_current/opslog.ttl`
   * Rewrite `_working/opslog.ttl` to an empty file containing just prefixes.
3. Do **not** attempt to log the act of snapshotting itself.

## **Implementation Tasks**

* Add a TTL-based append utility:

  ```ts
  appendToopslog(nodePath: string, ttlBlock: string): Promise<void>
  ```
* Update weave logic to snapshot `_opslog` after other flows.
* Update `createNode` to initialize `_opslog` with:

  * `_working/opslog.ttl` containing prefixes only
  * `_current/opslog.ttl` empty
  * A `meta:NodeCreation` entry appended at creation time

---

# **2. Narrower Meta Flow: `_meta` (Node Metadata Summary Flow)**

## **Purpose**

`_meta` describes the **node itself**, not the referent.
This is **NOT** operational logs, and **NOT** referent metadata.
It is a **small, semantic summary** that changes infrequently, written as JSON-LD.

### `_meta` MAY include:

* **Per-node copyright & licensing**
  * Because nodes are transposable among meshes
  * Repo-level licenses do NOT follow nodes
  * Payload datasets may or may not have embedded licensing

* **Consistency summary**
  * Checksums for relevant distributions (payload, ref, etc.)
  * Whether last validation passed or failed

* **Metrics summary**
  * Byte size of `_assets`
  * Triple count in latest `_ref/`
  * Any other quantitative state worth caching

* **Backlink summary**
  * External IRIs referencing this node, discovered through scans
  * Timestamp + weaveSlug of last backlink collection

These are **derived** facts and serve as the node’s “status record.”

### `_meta` MUST NOT include:

* Referent provenance (that goes in `_ref`)
* Operational activities (those go in `_opslog`)

## **Format**

* recommended: JSON-LD
* SHACL-validated to ensure it stays small and structured
* One WorkingShot + one snapshot per weave, same as other flows

## **Example Predicates to Use**

Roo should update the ontology/docs to include or reuse predicates for:

* `meta:nodeLicense` (IRI to license or SPDX expression)
* `meta:nodeCopyright`
* `meta:assetTreeSizeBytes`
* `meta:refTripleCount`
* `meta:lastValidationStatus` (“pass” | “fail” | “unknown”)
* `meta:checksumForPayloadCurrent`
* `meta:checksumForRefCurrent`
* `meta:lastBacklinkScanWeaveSlug`
* `meta:backlinkCount`
* `meta:backlink` (list of linking IRIs)

## **Snapshot Behavior**

At weave time:

1. Recompute metrics and summaries.
2. Rewrite `_meta/_working/meta.jsonld` fully (no appending).
3. Copy to snapshot folder `<slug_vN>/meta.jsonld`.
4. Copy to `_meta/_current/meta.jsonld`.

This is lightweight and idempotent.

## **Implementation Tasks**

* Modify `createNode` to initialize `_meta/_working/meta.jsonld` with:

  * Basic licensing stub
  * `meta:NodeDescriptor` subject
* Add utilities to compute:

  * Triple count (for `_ref/_current`)
  * Asset tree size
  * Checksums (SHA-256)
  * Backlink scans (placeholder function for now)
* Ensure weave orchestrator rewrites `_meta` after flows + opslog snapshot.

---

# **3. `_ref` Flow Remains Unchanged**

**Purpose**: metadata about the **referent**, not the node.

* Payload licensing may go here *only if it belongs to the dataset’s content*.
* Node-level licensing lives in `_meta`, not `_ref`.

---

# **4. Documentation Updates Roo Must Make**

### Update conceptual docs to reflect:

* Clear separation between `_ref`, `_meta`, and `_opslog`
* Node vs referent vs operational metadata
* Why per-node licensing is essential (transposable meshes)
* Why `_opslog` uses TTL
* Why `_meta` is JSON-LD summary

### Update architecture diagrams:

* Add `_meta` and `_opslog` as standard flows
* Show lifecycle: working → snapshot → current

### Update flow summaries:

* `_opslog` = append-only event log (TTL)
* `_meta` = summary node metadata (JSON-LD)
* `_ref` = referent metadata (JSON-LD)
* `_payload` = data

### Add examples for:

* `_opslog/_working/opslog.ttl`
* `_meta/_working/meta.jsonld`
* A full weave cycle showing all updated flows

---

# **5. Code Updates Roo Must Implement**

1. Update `createNode` to create both `_meta` and `_opslog` structures.
2. Initialize `_meta/_working/meta.jsonld` with:

   * node descriptor
   * licensing stub
   * empty checksum/metrics fields
3. Initialize `_opslog` with a NodeCreation TTL entry.
4. Add utilities:

   * `appendToopslog()`
   * `finalizeopslogSnapshot()`
   * `computeNodeMetrics()`
   * `computeChecksums()`
   * `performBacklinkScan()` (stub for now)
5. Update weave pipeline ordering:

   1. weave normal flows
   2. update `_meta/_working`
   3. snapshot `_meta`
   4. snapshot `_opslog` last

---

If Roo needs clarification, it should ask directly, but otherwise should proceed to update both documentation and code scaffolding with this model.
