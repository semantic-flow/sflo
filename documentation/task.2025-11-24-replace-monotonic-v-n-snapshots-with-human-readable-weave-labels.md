---
id: 8akbl2qj0nz38yrvet4oq3k
title: Replace Monotonic V N Versions with Human Readable Weave Labels
desc: ''
updated: 1765763442611
created: 1762712674617
---


## **CURRENT STATE**

The ontology groundwork is complete:
- `sflo:weaveLabel` property exists for human-readable labels
- `sflo:sequenceNumber` property exists for monotonic ordering
- `sflo:previousVersion` property exists for version linking
- FlowSlice terminology (Version/DefaultSlice/WorkingSlice) is established in the ontology

This task focuses on **documentation consistency** and **ontology verification**.

---

## **GOAL**

Document the enhanced version folder naming that combines human-readable weave labels with sequence numbers:

```
YYYY-MM-DD_HHMM_SS_vN
```

Examples:
* `2025-11-24_0142_07_v1`
* `2025-11-24_0142_08_v2`
* `2025-11-24_0142_15_v3`

While preserving:
* Immutable versions (FlowSlices)
* Consistent `_default` semantics (DefaultSlice)
* A linear `previousVersion` chain for metadata flows
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

### **1. Flowslice (Version) Folder Format**

Each version folder uses:

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
   A strictly monotonic integer *per flow*, stored inside version metadata and reflected in folder name:
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

### **3. FlowSlice Structure (per flow)**

Each flow's directory structure:

```
/<knop>/<flow>/
  YYYY-MM-DD_HHMM_SS_vN/    # Version (immutable FlowSlice)
  _default/                 # DefaultSlice
  _working/                 # WorkingSlice
```

A Version dataset includes at minimum:

```turtle
:ThisVersion a sflo:Version ;
    sflo:weaveRunId "urn:uuid:…" ;
    sflo:weaveLabel "2025-11-24_0142_55" ;
    sflo:sequenceNumber 7 ;
    prov:generatedAtTime "2025-11-24T01:42:55Z"^^xsd:dateTime ;
    sflo:previousVersion :PriorVersion .   # optional if no prior
```

---

### **4. DefaultSlice Semantics**

`_default/` for any flow is:

* A **byte-for-byte mirror** of the latest version dataset
* Contains **no additional metadata** not present in the version itself
* Updated on weave by **replacing** its contents atomically

Therefore:
* DefaultSlice = "current version content"
* Version = "immutable dataset with history metadata"
* All historical links live **inside the version**, not in `_default`

---

### **5. Canonical Identity**

The canonical identity of a version IS its IRI, which includes the folder name:

```
https://example.org/my-knop/_payload/2025-11-24_0142_07_v1/
```

Since the folder name is part of the IRI path, it directly contributes to the identity. The weave label and sequence number in the folder name become permanent parts of the version's identity.

---


## **TERMINOLOGY & REPLACEMENTS**

### **Key Terms**

To maintain consistency across documentation, use these preferred terms:

**FlowSlice-related:**
- **FlowSlice** - The abstract concept of a flow realization (Version, DefaultSlice, or WorkingSlice)
- **Version** (or **Version FlowSlice**) - An immutable, versioned FlowSlice (formerly called "version" or "flow version")
- **DefaultSlice** - The current/latest FlowSlice content (the `_default/` folder)
- **WorkingSlice** - The mutable staging FlowSlice (the `_working/` folder)

**Folder-related:**
- **version folder** - Replace references to `_vN` folders with "version folder" or "Version FlowSlice folder"
- **flowslice folder** - Generic term for any FlowSlice folder (`_default/`, `_working/`, or version folders)

### **Replacement Guidelines**

When updating documentation, apply these substitutions:

| **Old Term**          | **New Term**                 | **Context**                             |
| --------------------- | ---------------------------- | --------------------------------------- |
| `_vN` (as a concept)  | version folder               | When referring to the folder itself     |
| `_vN/` (in paths)     | `YYYY-MM-DD_HHMM_SS_vN/`     | When showing folder paths               |
| "version"             | Version or Version FlowSlice | When referring to the concept           |
| "flow version"        | FlowSlice (usually)          | Generic references to flow realizations |
| "version" (ambiguous) | Specify: Version FlowSlice   | When the Version type is meant          |
| "_default slice"      | DefaultSlice                 | The current/latest realization          |
| "_working slice"      | WorkingSlice                 | The mutable staging realization         |

### **Common Ambiguities**

**"Flow versions" vs "Version FlowSlices":**
- **"Flow versions"** (legacy term) → Usually means **FlowSlices** (all types: Version, DefaultSlice, WorkingSlice)
- **"Version FlowSlice"** or **"Version"** → Specifically means the immutable, versioned type

**When documenting:**
- Use "FlowSlice" for the general concept
- Use "Version" or "Version FlowSlice" when specifically referring to versioned, immutable realizations
- Use "DefaultSlice" and "WorkingSlice" for their specific folder types

---

## **DELIVERABLES**

### **1. Ontology Verification**

Verify these properties exist and are correctly defined:
- ✅ `sflo:weaveLabel` (exists in semantic-flow ontology)
- ✅ `sflo:sequenceNumber` (exists in semantic-flow ontology)
- ✅ `sflo:previousVersion` (exists in semantic-flow ontology)
- ✅ FlowSlice/Version/DefaultSlice/WorkingSlice classes (exist in semantic-flow ontology)

### **2. Documentation Updates Required**

Update all references from simple `_vN` to the new format in:

**Core Concept Documentation:**
* [`concept.weave-label.md`](documentation/concept.weave-label.md) - Update format from YYYYMMDD.HHMMSS to YYYY-MM-DD_HHMM_SS
* [`concept.flow-version.md`](documentation/concept.flow-version.md) - Clarify relationship with flowslice naming
* [`folder.flowslice.md`](documentation/folder.flowslice.md) - Update to show concatenation format

**High Priority Updates (Multiple `_vN` references):**
* [`concept.summary.md`](documentation/concept.summary.md) - 8 occurrences
* [`guide.product-brief.md`](documentation/guide.product-brief.md) - Version descriptions
* [`concept.weave-process.md`](documentation/concept.weave-process.md) - Weave process descriptions

**FlowSlice Terminology Alignment:**
* [`mesh-resource.component.slice.md`](documentation/mesh-resource.component.slice.md)
* [`mesh-resource.component.slice.default.md`](documentation/mesh-resource.component.slice.default.md)
* [`folder._working.md`](documentation/folder._working.md)

**Other Documentation:**
* [`facet.flow.versioned.md`](documentation/facet.flow.versioned.md)
* [`mesh-resource.component.md`](documentation/mesh-resource.component.md)
* [`concept.metadata.provenance.md`](documentation/concept.metadata.provenance.md)
* [`mesh-resource.component.flow.payload.md`](documentation/mesh-resource.component.flow.payload.md)
* [`mesh-resource.component.knop-config-defaults.md`](documentation/mesh-resource.component.knop-config-defaults.md)

**Check for existence and update if present:**
* `concept.namespace.segment.system.md`
* `folder.knop.md`
* `facet.filesystem.folder.md`

---

## **TODO**

### **Completed Documentation Updates (2025-11-27)**

- [x] Update `concept.weave-label.md` format description - **COMPLETED** (changed to YYYY-MM-DD_HHMM_SS)
- [x] Update all `_vN` references in `concept.summary.md` - **COMPLETED** (8+ occurrences updated)
- [x] Update `guide.product-brief.md` version descriptions - **COMPLETED** (FlowSlices reference updated)
- [x] Update `concept.flow-version.md` - **COMPLETED** (added format details with sequence numbers)
- [x] Update `folder.version.md` - **COMPLETED** (format specification with examples)
- [x] Update `concept.metadata.provenance.md` - **COMPLETED** (RDF turtle examples updated)
- [x] Update `concept.git.md` - **COMPLETED** (5 sections updated with new format)
- [x] Update `facet.filesystem.folder.md` - **COMPLETED** (version folder section rewritten)
- [x] Update `mesh-resource.component.flow.payload.md` - **COMPLETED** (version references updated)
- [x] Update `mesh-resource.component.slice.default.md` - **COMPLETED** (example updated)
- [x] Update `mesh-resource.component.flow.md` - **COMPLETED** (code example updated)
- [x] Update `concept.mesh.md` - **COMPLETED** (table examples updated)
- [x] Update `folder.knop.md` - **COMPLETED** (distribution folder reference updated)
- [x] Update `mesh-resource.knop.payload.md` - **COMPLETED** (version 3 example updated)
- [x] Review and update `concept.weave-process.md` - **COMPLETED** (terminology and format fixed)

### **Remaining Tasks**

- [ ] Verify all ontology properties are consistent in semantic-flow-ontology.jsonld
- [ ] Ensure all documentation cross-references are consistent
- [ ] Perform final search for any remaining `_vN` patterns in documentation

---

## **DECISIONS**

* **2025-11-27**: Confirmed terminology - using `sflo:Version` (not VersionSlice) and `sflo:previousVersion` throughout
* **2025-11-27**: Changed format to `YYYY-MM-DD_HHMM_SS_vN` using seconds (with underscore separator) instead of suffix approach
* **2025-11-26**: Confirmed folder format keeping the `_vN` suffix for sequence numbers
* **2025-11-26**: Aligned with FlowSlice terminology (Version/DefaultSlice/WorkingSlice)
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

