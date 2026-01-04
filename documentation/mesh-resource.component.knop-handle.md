---
id: wie8wazi0eoq81zke09czxk
title: knop handle
desc: ''
updated: 1764910114606
created: 1756064147279
---

# **Node Handle (mesh-resource.component.knop-handle)**

## **Summary**

A **Node Handle** is the [[concept.identifier]] for a Semantic mesh knop.
It is the stable, minimal RDF resource that uniquely denotes **the knop itself** (the referent), independent of any flow, distribution, or on-disk file used to implement the knop.

The Node Handle is represented on disk by the `_knop-handle/` folder and exposed at the IRI:

```
…/my-knop/_knop-handle/
```

A special fragment identifier provides an unambiguous term for the *component* representing the Node Handle itself:

```
…/my-knop/_knop-handle/#as-component
```

This allows clean separation between:

* the **knop** (the referent),
* the **knop handle** (the identifier-component), and
* the **resource page** (`index.html`) used to render documentation for humans.

---

## **Purpose**

The Node Handle exists to provide:

1. **A single stable identifier** for the knop
   (the “single-referent principle”: every knop corresponds to *exactly one* real-world referent).

2. **A concrete, dereferenceable address**
   for Semantic Mesh operations, SPARQL queries, provenance links, and application-level references.

3. **A filesystem anchor**
   that survives Git checkouts (because every knop must contain an `index.html`).

---

## **IRI Semantics**

### **1. `_knop-handle/`**

**IRI meaning:** *the Semantic mesh knop itself*.

Even though the IRI ends in a folder-like slash, it semantically denotes the **referent**, not a file or directory.

### **2. `_knop-handle/#as-component`**

**IRI meaning:** *the Node Handle component*, the identifier object in the model.

Used internally wherever a knop’s “handle as RDF resource” is required.

### **3. `_knop-handle/index.html`**

**IRI meaning:** *the human-facing Resource Page* for the knop’s handle.

Not used by RDF processors. Safe for browser dereferencing.

---

## **Why the Fragment Scheme?**

Because:

* The Node Handle must be a **first-class RDF resource**,
* but must **not** collide with the knop’s own IRI,
* and filesystem folders cannot directly represent “components,”
* and we need a dereferenceable HTML resource **and** a conceptual identifier in RDF,
* and flows are optional, so `_knop-handle/` is the only mandatory marker of a knop.

The fragment identifier preserves this separation cleanly:

* The folder IRI = the **knop**
* The fragment = the **handle**
* The HTML file = the **documentation of the handle**

No ambiguity, no double meaning, and compatible with RDF, browsers, and GitHub Pages.

---

## **Single-Referent Principle**

In the Semantic Mesh:

* A **knop** corresponds to **exactly one referent**.
* All flows (*ref*, *payload*, _cfg-*,_opslog, etc.) describe aspects or views of *that same referent*.
* The **Node Handle** is the referent’s stable identifier that all flows attach to.

By giving each knop exactly one `_knop-handle/` location and one `#as-component` identifier, the mesh enforces that:

> All data, metadata, provenance, and documentation converge on a single canonical referent.

---

## **On-Disk Structure**

```
my-knop/
  _knop-handle/
    index.html        ← mandatory; ensures Git materializes the knop
```

No other flow folders are required.
The presence of `_knop-handle/index.html` is the **definition** of a knop on disk.

---

## **Minimal Responsibilities**

The Node Handle:

* identifies the knop
* serves as the attachment point for configuration and flows
* acts as the dereferenceable public interface of the knop
* is the IRI used for:

  * provenance (KnopCreation, Weave activities)
  * reference data (`_ref`)
  * payload datasets
  * opslog entries (future)

It contains **no operational logic** and **no flow data** by itself.

