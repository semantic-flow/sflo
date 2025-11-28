---
id: rall4fbxm369okmy5383sf8
title: Weave Process
desc: ''
updated: 1764327582990
created: 1751128698638
---


# Weave Process

*(concept.weave-process)*

## Purpose

The **weave process** transforms evolving Flow data (the **[[WorkingShot|mesh-resource.node-component.flow-shot.working-shot]]**) into:

* a new immutable **[[Snapshot|mesh-resource.node-component.flow-shot.snapshot]]** (if versioning is enabled),
* an updated **[[DefaultShot|mesh-resource.node-component.flow-shot.default-shot]]** (always),
* updated metadata ([[meta-flow|mesh-resource.node-component.flow.node-metadata]]) and [[mesh-resource.node-component.documentation-resource.changelog]]
* regenerated resource pages
* and a stable, cross-node consistent “cut” of the mesh state(s).

Weave provides the **atomic publication boundary** of a mesh: everything within the weave scope becomes internally consistent, visible to other tools, and ready for downstream consumption.

---

# Conceptual Model

A **Flow** is a `dcat:DatasetSeries`.
A Flow always contains three permanent subdirectories:

* **`_working/`** – mutable; edited by humans & apps
* **`_default/`** – mutable; holds latest published FlowShot
* **Snapshot folders** – immutable; each a `FlowShot` with `weaveLabel` + `sequenceNumber`

Weave operates on **FlowShots**:

* `sflo:WorkingShot`
* `sflo:DefaultShot`
* `sflo:Snapshot` (immutable)

A weave run **never deletes** snapshots; it only produces a new one (if enabled) and refreshes `_default/`.

---

# Weave Outcomes

Every weave produces:

1. **A consistent cut of all `_working/` FlowShots in scope**
   → optionally and by default stored as a new immutable Snapshot

2. **A refreshed `_default/` FlowShot**
   → always updated to match the weave result

3. **Updated meta-flow**
   → includes:

   * new `weaveLabel`
   * new `sequenceNumber`
   * `previousSnapshot`
   * provenance info
     (Only includes *latest* provenance; older provenance lives in older snapshots.)

4. **Regenerated Resource Pages**
   → stable HTML index pages for nodes and flows

5. **(Optional) Tombstone Updates**
   → for submesh relocation or branch rehoming

---

# Two-Phase Weave

Weave is structured as:

## **Phase 1 — Snapshot Cut (Atomic Input Capture)**

Goal: capture a consistent, static copy of all FlowShots being woven.

Steps:

1. Acquire weave locks for all nodes/flows in scope

   * Subtree locking permitted
   * Cross-mesh locking permitted
   * Locks prevent *other weaves* and *sflo-host writes*

2. For each `_working/` FlowShot:

   * Stat + hash before read
   * Copy contents into a staging directory
   * Stat + hash again
   * If changed during read → **Phase 1 abort (dirty during weave)**

3. If all FlowShots are stable:

   * Create the new `weaveLabel`
   * Increment `sequenceNumber`
   * Create new Snapshot folders (if versioning enabled)
   * Create new DefaultShot folders (always)

At the end of Phase 1:

* You have a complete staging area containing the cut.
* Nothing has been published yet.
* No writes into the published mesh have occurred.

### If Phase 1 fails:

* No mesh state changes.
* Error appears in meta-flow logs on next successful weave.

---

## **Phase 2 — Materialization (Atomic Output Publish)**

Goal: publish the staged FlowShots as the official new state.

Steps:

1. Atomic rename (per directory) from staging into:

   * `…/<weaveLabel_vN>/` (Snapshot)
   * `…/_default/` (DefaultShot)

2. Update meta-flow:

   * `sflo:weaveLabel`
   * `sflo:sequenceNumber`
   * `sflo:previousSnapshot`
   * provenance fields
     (Only latest provenance is stored; snapshots retain historical provenance.)

3. Generate documentation Resource Pages

4. Release weave locks

### If Phase 2 fails:

* Snapshots are still valid (they were already atomically written)
* Resource pages may be regenerated in a later weave
* Meta-flow will reflect incomplete status until next weave

---

# Locking Model

### Weave locks are **at the node (or submesh) level**, not per-file.

This prevents:

* simultaneous weaves in the same submesh
* sflo-host writes colliding with weave

Editors may still modify `_working`, which is why Phase 1 uses stat/hash detection.

### Cross-mesh weaves **are allowed**

sflo-host must acquire locks across all referenced meshes before Phase 1 begins.

### Lock propagation

Requesting a lock for a node implicitly requires locking all ancestors up to the mesh root.
This prevents parallel weaves on overlapping submeshes.

---

# Stability Guarantees

Weave guarantees:

* **Atomic publication**: readers see the new state only after Phase 2 completes.
* **Consistency within the weave scope**: all flows included in the weave are aligned to the same cut.
* **Monotonic `sequenceNumber` per Flow**: ordinality remains clean even with multiple meshes.
* **Weave labels sorted lexicographically within each minute** (if using suffix model).

Weave explicitly does *not* guarantee:

* prevention of human text editors saving during the cut
  (→ but it will detect and abort)

---

# Scope Levels

### **Flow Weave**

* Affects one flow + its meta-flow

### **Node Weave**

* Weaves all flows under one node
* Meta-flow updates accordingly

### **Node Tree Weave**

* Recursively weaves node and descendants
* Ideal for large cohesive units (directories)

### **Cross-Mesh Weave**

* Allowed
* Good for Stagecraft’s multi-character simulations where updates must hit player-character mesh + GM-owned simulation mesh simultaneously

Locking spans both meshes, forming a single weave consistency domain.

---

# DefaultShot Behavior

* `_default/` is a **real FlowShot**
* It is **not** a pointer; it contains real Folder/Files
* It always mirrors the latest Snapshot (or staged result if versioning is off)
* Its IRI is stable, so tools may dereference it without knowing weave labels

### Unversioned flows

* Still produce a DefaultShot
* You can treat `_default/` as the active published dataset

---

# WorkingShot Behavior

* Always present
* Always mutable
* Not modeled as an RDF class (optional)
* Synchronized to `_default/` after each weave
* Errors or partial edits allowed between weaves

---

# Features Preserved From Older Model

### Interactive Mode

* Step-through validation
* AI-assisted metadata review

### Tombstoning

* Node relocation support

### Resource Page Generation

* Uses in-memory config cascade and templates
* Node-specific templates override mesh-level templates

### Transposition Detection

* Ensures mesh transposability
* Fixes any IRI base issues or structural inconsistencies

---

# Best Practices

### “Weave Often”

Produces clean snapshots and stable metadata.

### “Weave Before Push”

Ensures `_default/` is in sync with mesh state before publishing.

### “Keep `_working` Small”

Because direct edits are allowed, large files increase dirty-during-weave likelihood.

---

# Quirks

* Respect pre-existing hand-written `index.html` under `_assets/`
  (unless explicitly allowed to regenerate)
* Generated pages may include an invisible marker to allow safe regeneration

---

# File & Directory Expectations

```
/repo-root/
├── _assets/
│   ├── _templates/
│   │   ├── default.html
│   │   ├── ontology.html
│   │   └── person.html
│   └── _css/
│       ├── default.css
│       ├── ontology.css
│       └── person.css
└── my-ontology/
    ├── _cfg-op/
    ├── _assets/
    │   ├── _templates/
    │   └── _css/
    └── _payload/
```

---

If you'd like, I can also generate:

* A **parallel document** called `concept.weave-process.locking`
* A **process flow diagram**
* A **SHACL model** for FlowShots
* A **step-by-step pseudo-code spec** of the weave engine
