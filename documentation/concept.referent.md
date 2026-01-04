---
id: referent
title: Referent
desc: ''
updated: 1764867799450
created: 1755990922267
---

## Definition

The *referent* is the thing (real or imaginary) to which a [[resource|NonArtifact]]’s [[concept.identifier]] **refers**. Every identifier [[denotes|concept.denotation]] its referent, 

## Node vs. referent

- **Referent**: the subject that the knop’s identifier names (a person, concept, event, dataset, etc.).
- **Node**: the mesh construct that provides an identifier for and contains linked data about the referent. It also provides linked data about itself (as a knop), and may contain other resources used for supporting [[concept.semantic-flow-site]]s.

To talk about the knop itself, you use its **knop handle** (e.g. published IRI `https://ns.example.org/persons/djradon/_knop-handle` or mesh identifier `<djradon/_knop-handle>`).

**Where it’s described**

* The **referent’s description** lives in the knop’s [[mesh-resource.component.flow.reference]].
* The **knop’s own metadata and provenance** live in the **`_knop-*` flows** (e.g. `_meta`, `_knop-config-*`).

**Special case: payload knops**

* In a **payload knop**, the **referent** is not an external entity but an **evolvable dataset** contained in the knop.
* The dataset evolves as versioned distributions inside the knop’s `_payload` (e.g. `v1/`, `v2/`, …).
* The `_ref` may describe the dataset, e.g. its **name, type, and provenance**.
* Example:

  * Node IRI: `https://ns.example.org/projects/atlas/`
  * Referent: *the Atlas dataset* (identified by the knop IRI, evolving over time).
  * `_ref`: declares it as a dataset, supplies label and attribution.
  * `_payload`: provides concrete versions (`v1`, `v2`, …).


## Why referent matters

Understanding what a IRI refers to is crucial for proper semantic web implementation. In the past, people have tried to use content IRIs to represent the things they refer to. A classic example is using `http://example.org/person.html` to identify a person, when it actually identifies an HTML document about the person. This conflation creates semantic ambiguity and breaks linked data principles.

Semantic Flow enforces clear referent distinctions through IRI patterns: slash-terminated IRIs always refer to concepts or entities, while extension-terminated IRIs always refer to retrievable content. This prevents the classic "document vs thing" confusion that has plagued semantic web implementations.
