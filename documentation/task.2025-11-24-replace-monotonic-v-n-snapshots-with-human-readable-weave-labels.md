---
id: 8akbl2qj0nz38yrvet4oq3k
title: Replace Monotonic V N Snapshots with Human Readable Weave Labels
desc: ''
updated: 1764267461648
created: 1762712674617
---


## **CURRENT STATE**

The ontology groundwork is complete:
- `sflo:weaveLabel` property exists for human-readable labels
- `sflo:sequenceNumber` property exists for monotonic ordering
- `sflo:previousSnapshot` property exists for snapshot linking
- FlowShot terminology (Snapshot/DefaultShot/WorkingShot) is established in the ontology

This task focuses on **documentation consistency** and **ontology verification**.

---

## **GOAL**

Document the enhanced snapshot folder naming that combines human-readable weave labels with sequence numbers:

```
YYYY-MM-DD_HHMM_SS_vN
```

Examples:
* `2025-11-24_0142_07_v1`
* `2025-11-24_0142_08_v2`
* `2025-11-24_0142_15_v3`

While preserving:
* Immutable snapshots (FlowShots)
* Consistent `_default` semantics (DefaultShot)
* A linear `previousSnapshot` chain for metadata flows
* The folder name as part of the canonical IRI identity

---

## **MOTIVATION**

1. `_vN` alone gives ordinality but no human context
2. Full millisecond timestamps (`20251109181158123`) are too visually dense for humans
3. Weaves are slow, human-mediated operations, so:
   * Second-resolution labels are adequate, and
   * Same-second multiple runs would be extremely rare
4. Human-friendly labels improve UX without affecting machine identity

---

## **SPECIFICATION**

### **1. Flowshot (Snapshot) Folder Format**

Each snapshot folder uses:

```
<weaveLabel>_v<sequenceNumber>
```

Where:

1. **weaveLabel:** a human-oriented identifier, generated once per weave run:
   ```
   YYYY-MM-DD_HHMM_SS
   ```
   (timestamp with second-level precision)

2. **sequenceNumber:**
   A strictly monotonic integer *per flow*, stored inside snapshot metadata and reflected in folder name:
   ```
   sflo:sequenceNumber 17 .
   ```

Sequence number provides ordering; weave label provides readability.

---

### **2. Weave Label Allocation**

* **Only one process should weave a mesh/sub-mesh at a time.**

* Advisory soft lock (see [[concept.weave-process.weave-lock]]):
  * At start of weave: create `.weave-lock` in the mesh root
  * Lock file contains: PID, host, timestamp
  * Stale locks may be broken with `--force`

* Within a single weave run:
  * Core computes `weaveLabel` once and reuses it for all flows
  * The timestamp is captured at weave start and includes seconds precision

---

### **3. FlowShot Structure (per flow)**

Each flow's directory structure:

```
/<node>/<flow>/
  YYYY-MM-DD_HHMM_SS_vN/    # Snapshot (immutable FlowShot)
  _default/                 # DefaultShot
  _working/                 # WorkingShot
```

A Snapshot dataset includes at minimum:

```turtle
:ThisSnapshot a sflo:Snapshot ;
    sflo:weaveRunId "urn:uuid:…" ;
    sflo:weaveLabel "2025-11-24_0142_55" ;
    sflo:sequenceNumber 7 ;
    prov:generatedAtTime "2025-11-24T01:42:55Z"^^xsd:dateTime ;
    sflo:previousSnapshot :PriorSnapshot .   # optional if no prior
```

---

### **4. DefaultShot Semantics**

`_default/` for any flow is:

* A **byte-for-byte mirror** of the latest snapshot dataset
* Contains **no additional metadata** not present in the snapshot itself
* Updated on weave by **replacing** its contents atomically

Therefore:
* DefaultShot = "current snapshot content"
* Snapshot = "immutable dataset with history metadata"
* All historical links live **inside the snapshot**, not in `_default`

---

### **5. Canonical Identity**

The canonical identity of a snapshot IS its IRI, which includes the folder name:

```
https://example.org/my-node/_payload-flow/2025-11-24_0142_07_v1/
```

Since the folder name is part of the IRI path, it directly contributes to the identity. The weave label and sequence number in the folder name become permanent parts of the snapshot's identity.

---


## **TERMINOLOGY & REPLACEMENTS**

### **Key Terms**

To maintain consistency across documentation, use these preferred terms:

**FlowShot-related:**
- **FlowShot** - The abstract concept of a flow realization (Snapshot, DefaultShot, or WorkingShot)
- **Snapshot** (or **Snapshot FlowShot**) - An immutable, versioned FlowShot (formerly called "version snapshot" or "flow snapshot")
- **DefaultShot** - The current/latest FlowShot content (the `_default/` folder)
- **WorkingShot** - The mutable staging FlowShot (the `_working/` folder)

**Folder-related:**
- **snapshot folder** - Replace references to `_vN` folders with "snapshot folder" or "Snapshot FlowShot folder"
- **flowshot folder** - Generic term for any FlowShot folder (`_default/`, `_working/`, or snapshot folders)

### **Replacement Guidelines**

When updating documentation, apply these substitutions:

| **Old Term**           | **New Term**                  | **Context**                             |
| ---------------------- | ----------------------------- | --------------------------------------- |
| `_vN` (as a concept)   | snapshot folder               | When referring to the folder itself     |
| `_vN/` (in paths)      | `YYYY-MM-DD_HHMM_SS_vN/`      | When showing folder paths               |
| "version snapshot"     | Snapshot or Snapshot FlowShot | When referring to the concept           |
| "flow snapshot"        | FlowShot (usually)            | Generic references to flow realizations |
| "snapshot" (ambiguous) | Specify: Snapshot FlowShot    | When the Snapshot type is meant         |
| "_default snapshot"    | DefaultShot                   | The current/latest realization          |
| "_working snapshot"    | WorkingShot                   | The mutable staging realization         |

### **Common Ambiguities**

**"Flow snapshots" vs "Snapshot FlowShots":**
- **"Flow snapshots"** (legacy term) → Usually means **FlowShots** (all types: Snapshot, DefaultShot, WorkingShot)
- **"Snapshot FlowShot"** or **"Snapshot"** → Specifically means the immutable, versioned type

**When documenting:**
- Use "FlowShot" for the general concept
- Use "Snapshot" or "Snapshot FlowShot" when specifically referring to versioned, immutable realizations
- Use "DefaultShot" and "WorkingShot" for their specific folder types

---

## **DELIVERABLES**

### **1. Ontology Verification**

Verify these properties exist and are correctly defined:
- ✅ `sflo:weaveLabel` (exists in semantic-flow ontology)
- ✅ `sflo:sequenceNumber` (exists in semantic-flow ontology)
- ✅ `sflo:previousSnapshot` (exists in semantic-flow ontology)
- ✅ FlowShot/Snapshot/DefaultShot/WorkingShot classes (exist in semantic-flow ontology)

### **2. Documentation Updates Required**

Update all references from simple `_vN` to the new format in:

**Core Concept Documentation:**
* [`concept.weave-label.md`](documentation/concept.weave-label.md) - Update format from YYYYMMDD.HHMMSS to YYYY-MM-DD_HHMM_SS
* [`concept.flow-version.md`](documentation/concept.flow-version.md) - Clarify relationship with flowshot naming
* [`folder.flowshot.md`](documentation/folder.flowshot.md) - Update to show concatenation format

**High Priority Updates (Multiple `_vN` references):**
* [`concept.summary.md`](documentation/concept.summary.md) - 8 occurrences
* [`guide.product-brief.md`](documentation/guide.product-brief.md) - Snapshot descriptions
* [`concept.weave-process.md`](documentation/concept.weave-process.md) - Weave process descriptions

**FlowShot Terminology Alignment:**
* [`mesh-resource.node-component.flow-snapshot.version.md`](documentation/mesh-resource.node-component.flow-snapshot.version.md)
* [`mesh-resource.node-component.flow-snapshot.default.md`](documentation/mesh-resource.node-component.flow-snapshot.default.md)
* [`mesh-resource.node-component.flow-snapshot.working.md`](documentation/mesh-resource.node-component.flow-snapshot.working.md)

**Other Documentation:**
* [`facet.flow.versioned.md`](documentation/facet.flow.versioned.md)
* [`mesh-resource.node-component.md`](documentation/mesh-resource.node-component.md)
* [`concept.metadata.provenance.md`](documentation/concept.metadata.provenance.md)
* [`mesh-resource.node-component.flow.payload.md`](documentation/mesh-resource.node-component.flow.payload.md)
* [`mesh-resource.node-component.node-config-defaults.md`](documentation/mesh-resource.node-component.node-config-defaults.md)

**Check for existence and update if present:**
* `concept.namespace.segment.system.md`
* `folder.node.md`
* `facet.filesystem.folder.md`

---

## **TODO**

- [ ] Update `concept.weave-label.md` format description
- [ ] Update all `_vN` references in `concept.summary.md`
- [ ] Update flowshot terminology in all snapshot documentation
- [ ] Verify all ontology properties are consistent
- [ ] Update `guide.product-brief.md` snapshot descriptions
- [x] Review and update `concept.weave-process.md` - **COMPLETED** (terminology and format fixed)
- [ ] Ensure all documentation cross-references are consistent

---

## **DECISIONS**

* **2025-11-27**: Confirmed terminology - using `sflo:Snapshot` (not SnapshotShot) and `sflo:previousSnapshot` throughout
* **2025-11-27**: Changed format to `YYYY-MM-DD_HHMM_SS_vN` using seconds (with underscore separator) instead of suffix approach
* **2025-11-26**: Confirmed folder format keeping the `_vN` suffix for sequence numbers
* **2025-11-26**: Aligned with FlowShot terminology (Snapshot/DefaultShot/WorkingShot)
* **2025-11-26**: Clarified that folder name IS part of the canonical IRI identity
* **2025-11-26**: Focused on documentation and ontology verification only (no implementation)

---

## **NOTES**

* The sequence number (_vN) remains in folder names for clear ordinality
* Weave labels provide human-readable temporal context
* The folder name becomes part of the permanent IRI identity
* No implementation work is needed at this stage
* Documentation consistency is the primary goal
* The [`concept.weave-process.md`](documentation/concept.weave-process.md) has been reviewed and updated for consistency

