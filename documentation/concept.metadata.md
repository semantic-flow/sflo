---
id: vqah4oe61zin07t2ztfx4v4
title: Metadata
desc: ''
updated: 1764432668261
created: 1753141346178
---

Metadata in Semantic Flow falls into **three distinct categories**, each with a specific purpose and a well-defined location.
Understanding these boundaries is essential for composability, transposability, and clean tooling behavior.

---

## **1. Referent Metadata (`_ref` flow)**

Data about the the subject named by the Node's IRI.

**What it describes:**
The *thing the node represents* — its referent.

**Examples:**

* classifications (e.g. schema:Person)
* names, descriptions, related websites
* for [[mesh-resource.node.payload]]:
  * Licensing and provenance 
  * Validation of the **content**
  * QA/editorial assertions

**Who writes it:** Humans, tools, domain systems
**Typical subject:** the Node

**Mnemonic:**
*“If it describes the subject matter, it lives in `_ref`.”*

---

## **2. Node Metadata (`_meta` flow, narrowed scope)**

**What it describes:**
The **node itself**, refered to via the [[mesh-resource.node-component.node-handle]], independent of its payload or referent.
Nodes are [[transposable|principle.transposability]] across meshes, so each must carry its own administrative metadata.

**Examples:**

* **Per-node licensing and copyright**
  * Repository-level LICENSE files do not travel with nodes
  * Nodes bring their own licensing terms

* **Checksums** of key distributions

* **Consistency summaries**
  * Last validation status
  * Last weave (by [[concept.weave-identifier]])
  
* **Metrics**

  * Triple count for `_ref/_current`
  * Size of `_assets`

* **Backlink summaries**

  * External IRIs referencing this node
  * Timestamp & weaveSlug of last backlink scan


**Who writes it:** Weave pipeline, maintenance tools
**Typical subject:** [[_node-handle|mesh-resource.node-component.node-handle]]

**Mnemonic:**
*“If it summarizes the *state of the node*, it lives in `_meta`.”*

---

## **3. Operational Metadata (`_opslog` flow)**

**What it describes:**
Node-level **activities over time** — an operational activity log.

**Examples:**

* `meta:NodeCreation`
* `meta:NodeWeave`, `meta:PayloadWeave`
* Validation run events
* Metric collection events
* Backlink scans
* Any `meta:MeshActivity` instance

**Format:** Turtle recommended for append-friendliness(`opslog.ttl`)
**Append-only:** Yes in `_working`
**Versioned snapshots:** Yes (per weave, e.g. `2025-11-29_0647_59_v1/`)
**Who writes it:** Weave pipeline, maintenance tools, possibly humans via CLI
**Typical subject:** Node components

**Mnemonic:**
*“If it is an activity, it lives in `_opslog`.”*


---

# **Why This Separation Matters**

### **Composability and Transposability**

A node must be self-describing.
Metadata that depends on repository context breaks transposability.
Thus `_meta` carries node-specific administrative facts.

### **Operational Trace vs. Summary State**

* `_opslog` = detailed **history** of events
* `_meta` = Node's **current state**; reflects history
* `_ref` = metadata **about the referent**, not the node

### **Clear Lines for Tooling**

* Tools that work with referent metadata touch `_ref`
* Tools that evaluate node health touch `_meta`
* Tools that analyze system operations read `_opslog`

Keeping these lines clean helps avoid the “junk drawer” problem that plagued earlier designs.

---

# **Quick Summary Table**

| Category                 | Flow      | Purpose                                                             | Format  | Versioned | Updated By           |
| ------------------------ | --------- | ------------------------------------------------------------------- | ------- | --------- | -------------------- |
| **Referent metadata**    | `_ref`    | Metadata about the subject (payload provenance, referent licensing) | JSON-LD | Yes       | Humans, domain tools |
| **Node metadata**        | `_meta`   | Licensing, summaries, metrics, backlinks                            | JSON-LD | Yes       | Weave/maintenance    |
| **Operational metadata** | `_opslog` | Activities and events                                               | TTL     | Kinda*    | Weave/maintenance    |

* _opslog snapshots are conceptually more like distinct datasets than versions of an evolving dataset

