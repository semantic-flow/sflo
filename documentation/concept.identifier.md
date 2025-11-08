---
id: identifier
title: identifier
desc: ''
updated: 1762632220491
created: 1750368774797
---

Semantic Flow resources can be identified via two types of identifiers:

- [[concept.identifier.external]]
- [[concept.identifier.intramesh]]


## Guidance

- Prefer relative or site-root-absolute paths inside the mesh; do not hardcode full base IRIs so the mesh remains portable across hosting locations (see [[faq.reference-iri-choices]]).


## Identifier Senses

### Content Identifiers

Identifiers that [[denote|concept.denotation]] **concrete information resources** (files on disk or over HTTP):

* **Distributions** → materialized datasets, e.g. `test.ttl`, `dave_v1.jsonld`, etc.
* **Resource pages** → e.g. `index.html`
* **Other documentation resources** → e.g. `README.md`, `CHANGELOG.md`

These are *retrievable representations* (materialized content), i.e. when dereferenced with a request to a [[concept.semantic-flow-site]], the content itself is returned.

### Concept Identifiers

Identifiers that refer to **concepts, entities, or abstract things**, including:

* **bare node identifiers** → Organizational containers
* **reference node identifiers** → denotational 
* **payload node identifiers** → Concepts that are datasets
* **Abstract flow identifiers** → Dataset-as-persistent-concept
* **Concrete dataset identifiers** → Specific dataset snapshots
* **Handle identifiers** → Mesh node themselves

When dereferenced with a request to a [[concept.semantic-flow-site]], concept identifiers return content, but they still [[concept.denotation]] a concept.


## Identifier Pattern Semantics

| Identifier Type    | Trailing Slash? | Refers to…                    | Example                                 |
| ------------------ | --------------- | ----------------------------- | --------------------------------------- |
| Content identifier | No              | A fetchable document or asset | `https://example.org/ns/foo/index.html` |
| Concept IRI        | Yes (`/`)       | A real-world or mesh concept  | `https://example.org/ns/foo/`           |

Even though you might be tempted to think of datasets as concrete things, the IRIs for payload nodes, flows, and snapshots all refer to concepts, i.e., **non-retrievable entities**. Only Distribution IRIs refer to downloadable data, i.e., dataset distributions.


