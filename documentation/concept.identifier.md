---
id: identifier
title: identifier
desc: ''
updated: 1756829272521
created: 1750368774797
---

Semantic Flow resources can be identified via two types of identifiers:

- [[concept.identifier.external]]
- [[concept.identifier.intramesh]]


## Guidance

- Prefer relative or site-root-absolute paths inside the mesh; do not hardcode full base IRIs so the mesh remains portable across hosting locations (see [[faq.reference-iri-choices]]).


## Identifier Senses

### **Content Identifiers**

Identifiers that point to **concrete information resources** (files on disk or over HTTP):

* **Distribution IRIs** → materialized datasets, e.g. `test.ttl`, `dave_v1.jsonld`, etc.
* **Resource page IRIs** → e.g. `index.html`
* **Resource documentation IRIs** → e.g. `README.md`, `CHANGELOG.md`

These are *retrievable representations* (materialized content). 

### **Concept Identifiers**

Identifiers that refer to **concepts, entities, or abstract things**, including:

* **bare node identifiers** → Organizational containers
* **reference node identifiers** → denotational 
* **data node identifiers** → Concepts that are datasets
* **Abstract flow identifiers** → Dataset-as-persistent-concept
* **Concrete dataset identifiers** → Specific dataset snapshots
* **Handle identifiers** → Mesh node themselves


## Identifier Pattern Semantics

| Identifier Type    | Trailing Slash? | Refers to…                    | Example                                 |
| ------------------ | --------------- | ----------------------------- | --------------------------------------- |
| Content identifier | No              | A fetchable document or asset | `https://example.org/ns/foo/index.html` |
| Concept IRI        | Yes (`/`)       | A real-world or mesh concept  | `https://example.org/ns/foo/`           |

Even though you might be tempted to think of a datasets as concrete things, the IRIs for data nodes, abstract datasets, and concrete datasets all refer to concepts, i.e., **non-retrievable entities**. Only Distribution IRIs refer to downloadable data, i.e., dataset distributions.


## Namespace-relative basing

see [[concept.namespace-relative-basing]]
