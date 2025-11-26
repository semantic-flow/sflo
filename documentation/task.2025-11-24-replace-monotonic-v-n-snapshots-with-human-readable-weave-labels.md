---
id: 8akbl2qj0nz38yrvet4oq3k
title: 2025 11 24 Replace Monotonic V N Snapshots with Human Readable Weave Labels
desc: ''
updated: 1763997954928
created: 1762712674617
---


Here is a **rewritten, internally consistent, sharply-scoped task spec** that matches *everything you’ve now decided*, eliminates contradictions, and bakes in the clarified semantics for:

* snapshot naming,
* weave identifiers,
* `_default`,
* metadata flows,
* chain-of-history,
* compaction behavior,
* no merging of divergent meshes,
* dangling `previousSnapshot` allowed.

It does **not** introduce anything new; it consolidates your actual decisions.

---

# **TASK — Replace Monotonic `_vN` Snapshots With Human-Readable Weave Labels + Linear Snapshot Chain**

**ID:** `2025-11-XX-weave-label-redesign`
**Title:** Replace `_vN` folder versions with human-readable weave labels and linear snapshot metadata
**Created:** 2025-11-XX
**Updated:** 2025-11-XX

---

## **GOAL**

Replace `_vN` snapshot folder naming with a more human-readable weave label of the form:

```
YYYY-MM-DD_HHMM[_suffix]_vN
```

Examples:

* `2025-11-24_0142_v1`
* `2025-11-24_0142a_v2`
* `2025-11-24_0142za_v3`

While preserving:

* Immutable snapshots
* Consistent `_default` semantics
* A linear `previousSnapshot` chain for metadata flows
* Minimal reliance on labels for semantics (canonical identity remains the dataset IRI + metadata)

---

## **MOTIVATION**

1. `_vN` gives ordinality but no human context.
2. Full millisecond timestamps (`20251109181158123`) are too visually dense for humans.
3. Weaves are slow, human-mediated operations, so:

   * Minute-resolution labels are adequate, and
   * Same-minute multiple runs are rare but allowed.
4. Human-friendly labels improve UX without affecting machine identity, which is based on metadata.

---

## **SPECIFICATION**

### **1. Snapshot Label Format**

Each snapshot folder uses:

```
<weaveLabel>_v<sequenceNumber>
```

Where:

1. **weaveLabel:** a human-oriented identifier, generated once per weave run:

   ```
   YYYY-MM-DD_HHMM
   YYYY-MM-DD_HHMMa
   YYYY-MM-DD_HHMMb
   ...
   YYYY-MM-DD_HHMMz
   YYYY-MM-DD_HHMMza
   ...
   ```

   (infinite base-26 suffix using lowercase a–z)

2. **sequenceNumber:**
   A strictly monotonic integer *per flow*, stored inside snapshot metadata:

   ```
   sflo:sequenceNumber 17 .
   ```

Sequence number provides ordering; weave label provides readability.

---

### **2. Weave Label Allocation**

* **Only one process should weave a mesh/sub-mesh at a time.**

* Advisory soft lock:

  * At start of weave: create `.weave-lock` in the mesh root (atomic rename).
  * Lock file contains: PID, host, timestamp.
  * Stale locks may be broken with `--force`.

* Within a single weave run:

  * Core computes `weaveLabel` once and reuses it for all flows.

* Suffix selection logic:

  * Query existing snapshot labels for the same minute.
  * Select lexicographically max existing label.
  * Increment suffix.
  * If no existing, suffix = empty string.

This is **non-atomic** across clones; Git conflicts remain acceptable.

---

### **3. Snapshot Creation (per flow)**

Each flow snapshot directory:

```
/<node>/<flow>/
  YYYY-MM-DD_HHMM[_suffix]_vN/
  _default/
  _working/    # unchanged
```

A snapshot dataset includes at minimum:

```turtle
:ThisSnapshot a sflo:Snapshot ;
    sflo:weaveRunId "urn:uuid:…" ;
    sflo:weaveLabel "2025-11-24_0142a" ;
    sflo:sequenceNumber 7 ;
    prov:generatedAtTime "2025-11-24T01:42:55Z"^^xsd:dateTime ;
    sflo:previousSnapshot :PriorSnapshot .   # optional if no prior
```

Snapshots are **immutable**.

---

### **4. `_default` Semantics**

`_default/` for any flow is:

* A **byte-for-byte mirror** of the latest snapshot dataset.
* Contains **no additional metadata** not present in the snapshot itself.
* Updated on weave by **replacing** its contents atomically.

Therefore:

* `_default` = “current snapshot”
* Snapshot = “current dataset + history pointer”
* All historical links live **inside the snapshot**, not in `_default`.

This preserves your rule:

> `_default` should be identical to the latest version and not accumulate history content.”

---

### **5. Metadata Flows**

Metadata flows follow the same snapshot pattern:

* Snapshot includes:

  * All current metadata (provenance, validation, metrics, copyright),
  * `sflo:previousSnapshot`,
  * `sflo:weaveRunId`, `sflo:weaveLabel`, `prov:generatedAtTime`, etc.

* **History model:**
  A linear linked list via `sflo:previousSnapshot`.

* **Compaction:**
  If an old snapshot is deleted, leaving `sflo:previousSnapshot` dangling, this is acceptable and will not break weaves.

* No merge semantics between divergent histories; next weave simply materializes the correct latest metadata.

---

### **6. Canonical Identity**

Canonical identity of a snapshot is:

```
IRI of the snapshot dataset
+
the metadata inside it
```

NOT the folder label.

Folder names are for:

* Human readability,
* Local organization,
* Optional suffix disambiguation.

Sequence numbers (`_vN`) remain canonical for ordering; weave labels do not.

---

### **7. Required Deliverables**

1. **Core implementation**

   * Weave label generator
   * Suffix increment function
   * Previous-snapshot linking
   * Snapshot folder creation
   * `_default` synchronization
   * `.weave-lock` advisory lock support

2. **Ontology updates**

   * `sflo:weaveLabel`
   * `sflo:sequenceNumber`
   * `sflo:previousSnapshot`
   * Clarified comments for snapshot semantics

3. **CLI updates**

   * Display weaveLabel when weaving
   * Warn on stale `.weave-lock`
   * `--force` lock override

4. **Documentation**

   * Replace all `_vN` references
   * Add weave label specification
   * Update snapshot layout diagrams
   * Add rules for metadata flows and history

---

## **NOTES / RATIONALE**

* Sequence number handles ordinality cleanly.
* Weave labels provide mnemonic, clustered human context.
* `_default` remains simple and does not accidentally become a log.
* History is captured cleanly inside snapshot metadata (single predecessor).
* Compaction is graceful; dangling previous pointers are allowed.
* No merging of divergent histories reduces complexity without limiting real workflows.

---

If you want, I can also generate:

* A minimal SHACL profile for snapshots,
* A folder-layout diagram,
* Or the corresponding JSON-LD contexts for `sflo:weaveLabel`, etc.
