---
id: wie8wazi0eoq81zke09czxk
title: node handle
desc: ''
updated: 1764436409704
created: 1756064147279
---

# **Node Handle (mesh-resource.node-component.node-handle)**

## **Summary**

A **Node Handle** is the [[concept.identifier]] for a Semantic Mesh node.
It is the stable, minimal RDF resource that uniquely denotes **the node itself** (the referent), independent of any flow, distribution, or on-disk file used to implement the node.

The Node Handle is represented on disk by the `_node-handle/` folder and exposed at the IRI:

```
…/my-node/_node-handle/
```

A special fragment identifier provides an unambiguous term for the *component* representing the Node Handle itself:

```
…/my-node/_node-handle/#as-component
```

This allows clean separation between:

* the **node** (the referent),
* the **node handle** (the identifier-component), and
* the **resource page** (`index.html`) used to render documentation for humans.

---

## **Purpose**

The Node Handle exists to provide:

1. **A single stable identifier** for the node
   (the “single-referent principle”: every node corresponds to *exactly one* real-world referent).

2. **A concrete, dereferenceable address**
   for Semantic Mesh operations, SPARQL queries, provenance links, and application-level references.

3. **A filesystem anchor**
   that survives Git checkouts (because every node must contain an `index.html`).

---

## **IRI Semantics**

### **1. `_node-handle/`**

**IRI meaning:** *the Semantic Mesh node itself*.

Even though the IRI ends in a folder-like slash, it semantically denotes the **referent**, not a file or directory.

### **2. `_node-handle/#as-component`**

**IRI meaning:** *the Node Handle component*, the identifier object in the model.

Used internally wherever a node’s “handle as RDF resource” is required.

### **3. `_node-handle/index.html`**

**IRI meaning:** *the human-facing Resource Page* for the node’s handle.

Not used by RDF processors. Safe for browser dereferencing.

---

## **Why the Fragment Scheme?**

Because:

* The Node Handle must be a **first-class RDF resource**,
* but must **not** collide with the node’s own IRI,
* and filesystem folders cannot directly represent “components,”
* and we need a dereferenceable HTML resource **and** a conceptual identifier in RDF,
* and flows are optional, so `_node-handle/` is the only mandatory marker of a node.

The fragment identifier preserves this separation cleanly:

* The folder IRI = the **node**
* The fragment = the **handle**
* The HTML file = the **documentation of the handle**

No ambiguity, no double meaning, and compatible with RDF, browsers, and GitHub Pages.

---

## **Single-Referent Principle**

In the Semantic Mesh:

* A **node** corresponds to **exactly one referent**.
* All flows (*ref*, *payload*, _cfg-*,_opslog, etc.) describe aspects or views of *that same referent*.
* The **Node Handle** is the referent’s stable identifier that all flows attach to.

By giving each node exactly one `_node-handle/` location and one `#as-component` identifier, the mesh enforces that:

> All data, metadata, provenance, and documentation converge on a single canonical referent.

---

## **On-Disk Structure**

```
my-node/
  _node-handle/
    index.html        ← mandatory; ensures Git materializes the node
```

No other flow folders are required.
The presence of `_node-handle/index.html` is the **definition** of a node on disk.

---

## **Minimal Responsibilities**

The Node Handle:

* identifies the node
* serves as the attachment point for configuration and flows
* acts as the dereferenceable public interface of the node
* is the IRI used for:

  * provenance (NodeCreation, Weave activities)
  * reference data (`_ref`)
  * payload datasets
  * opslog entries (future)

It contains **no operational logic** and **no flow data** by itself.

