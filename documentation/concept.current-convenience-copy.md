---
id: 7zofkeyk3g2ardok3vzica6
title: Current Convenience Copy
desc: ''
updated: 1765861497727
created: 1765861018468
---

### Current Convenience Copy

**Current Convenience Copy** is a non-versioned, "materialized alias" published alongside a payload knop that provides a predictable, dumb-client-friendly access point to the knop’s *current* payload artifact.

It exists to support clients that cannot perform RDF queries, follow dataset catalogs, or resolve versioned distributions, such as HTML `<img>` tags, CSS `url()` references, or simple file fetchers.

It deliberately trades immutability for accessibility.

---

#### Characteristics

* **Non-versioned**
  The file is overwritten when a new version of the payload is woven.

* **Identical to the latest distribution**
  It is identical to the knop’s latest payload distribution except for the filename.

* **Not a Flow or Slice**
  Because it is not versioned, a Current Convenience Copy is not treated as a Slice or distribution.

* **Stable role, not stable bytes**
  The path is stable; the contents are expected to change over time.

* **Media-type-constrained**
  The file extension and media type are fixed by convention once established.

---

#### Typical Location

A Current Convenience Copy is published directly under the knop.

Examples:

* `…/bio/_current.jsonld`
* `…/headshot/_current.png`

---

#### Relationship to Versioned Artifacts

The versioned distributions remain authoritative and immutable.
The Current Convenience Copy is a *materialized alias* of whichever distribution is currently designated as “current” in the knop’s metadata.

Consumers that require provenance, reproducibility, or historical accuracy must resolve the versioned distribution via RDF metadata instead of using the convenience copy.

---

#### Movement and Identity

A Current Convenience Copy is scoped to the knop’s path.

If a knop is moved, the behavior of its Current Convenience Copy depends on the project’s alias policy:

* **Identity-strict:** the old copy is deleted or replaced with a tombstone
* **Alias-preserving:** the old copy continues to be updated as a durable alias

The copy itself does not define identity and must not be cited as a permanent identifier.

---

#### Non-Goals

A Current Convenience Copy is **not** intended to:

* Provide historical access
* Act as a canonical identifier
* Support multiple media types at the same path

---

#### Summary

The Current Convenience Copy is an explicit, controlled escape hatch from strict immutability.
It enables practical web usage while preserving a clean separation between **stable access paths** and **versioned semantic artifacts**.
