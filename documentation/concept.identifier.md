---
id: identifier
title: identifier
desc: ''
updated: 1764436784615
created: 1750368774797
---

Semantic Flow resources can be identified via two types of identifiers:

- [[concept.identifier.external]]
- [[concept.identifier.intramesh]]


## Guidance

- Prefer relative or site-root-absolute paths inside the mesh; do not hardcode full base IRIs so the mesh remains portable across hosting locations (see [[faq.reference-iri-choices]]).


## Identifier Senses

### Content Identifiers

[[facet.resource.content]] identifiers [[denote|concept.denotation]] **concrete information resources** (files on disk or over HTTP).

#### Examples

* **Distributions** → materialized datasets, e.g. `test.ttl`, `djradon.jsonld`, etc.
* **Resource pages** → e.g. `index.html`
* **Other documentation resources** → e.g. `README.md`, `CHANGELOG.md`

These are *retrievable representations* (materialized content), i.e. when dereferenced with a request to a [[concept.semantic-flow-site]], the content itself is returned.

### Naming Identifiers

[[facet.resource.naming]] identifier refer to **concepts, entities, or abstract things**


#### Examples

* **bare node identifiers** → Organizational/namespace containers
* **reference node identifiers** → denotate things other than concrete information resources
* **payload node identifiers** →  denote datasets in the abstract
* **flow identifiers** → denote dataset series
* **Concrete dataset identifiers** → Specific dataset versions ([[FlowShots|mesh-resource.node-component.flow-shot]]) 
* **Handle identifiers** → Mesh nodes themselves, see [[mesh-resource.node-component.node-handle]]

When dereferenced with a request to a [[concept.semantic-flow-site]], concept identifiers return content, but they still [[concept.denotation]] a concept.


## Identifier Pattern Semantics

| Identifier Type | Trailing Slash? | Refers to…                       | Example                                 |
| --------------- | --------------- | -------------------------------- | --------------------------------------- |
| Content IRI     | No              | A fetchable document or asset    | `https://example.org/ns/foo/index.html` |
| Naming IRI      | Yes (`/`)       | A real-world or abstract concept | `https://example.org/ns/foo/`           |

Even though you might be tempted to think of datasets as concrete things, the IRIs for payload nodes, flows, and snapshots all refer to concepts, i.e., **non-retrievable entities**. Only Distribution IRIs refer to downloadable data, i.e., dataset distributions.


