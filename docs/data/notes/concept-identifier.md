



## Identifier references in Semantic Flow

| Semantic Flow resource type            | referent                       | [[concept.identifier.intramesh]]                    |
| -------------------------------------- | ------------------------------ | --------------------------------------------------- |
| bare node                              | -nothing, (yet)                | `ns/`                                               |
| data node                              | abstract dataset               | `ns/djradon-bio/`                                   |
| abstract dataset (flow)                | dataset series                 | `ns/djradon-bio/_data-flow/`                        |
| concrete node dataset (snapshot)       | concrete data dataset          | `ns/djradon-bio/_data-flow/_next/`                  |
| distribution                           | content / dataset distribution | `ns/djradon-bio/_data-flow/_v1/dave-bio_v1.trig`    |
| abstract meta dataset (flow)           | node metadata dataset series   | `ns/djradon-bio/_meta-flow/`                        |
| concrete meta dataset (snapshot)       | node metadata dataset          | `ns/djradon-bio/_meta-flow/_current/`               |
| abstract operational config (flow)     | operational config series      | `ns/djradon-bio/_config-operational-flow/`          |
| concrete operational config (snapshot) | operational config             | `ns/djradon-bio/_config-operational-flow/_current/` |
| abstract inheritable config (flow)     | inheritable config series      | `ns/djradon-bio/_config-inheritable-flow/`          |
| concrete inheritable config (snapshot) | inheritable config             | `ns/djradon-bio/_config-inheritable-flow/_current/` |
| handle                                 | mesh node                      | `ns/djradon/_node-handle/`                          |
| resource documentation                 | resource page (content)        | `ns/djradon/index.html`                             |
| resource documentation                 | README file (content)          | `ns/djradon/README.md`                              |
| asset tree                             | collection of assets           | `ns/assets/`                                        |
| asset folder                           | sub-collection of assets       | `ns/assets/images/`                                 |
| asset                                  | content / image                | `ns/assets/images/logo.svg`                         |


Example:
- `ns/` = bare node for organizing content and minting IRIs; refers to itself as a namespace
- `ns/dave/` = refers to Dave the person (data node)
- `ns/dave/index.html` = resource page about Dave (content)
- `ns/dave-bio/` = refers to Dave's biographical dataset (data node)
- `ns/dave-bio/_data-flow/` = abstract dataset (DatasetSeries) containing Dave's bio data
- `ns/dave-bio/_data-flow/_current/` = current concrete dataset snapshot
- `ns/dave-bio/_data-flow/_v1/dave-bio_v1.trig` = RDF distribution from version 1
- `ns/dave/_assets/images/dave-headshot.jpg` = an image asset; "attached" to the mesh, but not a mesh resource

### Terminology note: “data dataset”

- “Abstract data dataset” = the DatasetSeries at `_data-flow/`.
- “Concrete data dataset” = a snapshot under `_data-flow/` (e.g., `_current/`, `_vN/`).
- Only distributions (`*.trig`, `*.jsonld`, etc.) are retrievable content files.


## URL Senses

### **Content URLs**

URLs that point to **concrete information resources** (files on disk or over HTTP):

* **Distribution URLs** → materialized datasets, e.g. `test.ttl`, `dave_v1.jsonld`, etc.
* **Resource page URLs** → e.g. `index.html`
* **Resource documentation URLs** → e.g. `README.md`, `CHANGELOG.md`
* **Asset URLs** → e.g. `.png`, `.css`, `.js`

These are *retrievable representations* (materialized content).

---

### **Concept URLs**

URLs that refer to **concepts, entities, or abstract things**, including:

* **bare node URLs** → Organizational containers
* **data node URLs** → Concepts with associated datasets
* **Abstract dataset URLs** → Dataset-as-persistent-concept
* **Concrete dataset URLs** → Specific dataset snapshots
* **Handle URLs** → Mesh node identities


### URL Pattern Semantics

| URL Type    | Trailing Slash? | Refers to…                    | Example                                 |
| ----------- | --------------- | ----------------------------- | --------------------------------------- |
| Content URL | No              | A fetchable document or asset | `https://example.org/ns/foo/index.html` |
| Concept URL | Yes (`/`)       | A real-world or mesh concept  | `https://example.org/ns/foo/`           |

Even though you might be tempted to think of a datasets as concrete things, the URLs for data nodes, abstract datasets, and concrete datasets all refer to concepts, i.e., **non-retrievable entities**. Only Distribution URLs refer to downloadable data, i.e., dataset distributions.

### Why referent matters

Understanding what a URL refers to is crucial for proper semantic web implementation. In the past, people have tried to use content URLs to represent the things they refer to. A classic example is using `http://example.org/person.html` to identify a person, when it actually identifies an HTML document about the person. This conflation creates semantic ambiguity and breaks linked data principles.

Semantic Flow enforces clear referent distinctions through URL patterns: slash-terminated URLs always refer to concepts or entities, while extension-terminated URLs always refer to retrievable content. This prevents the classic "document vs thing" confusion that has plagued semantic web implementations.

## Namespace-relative basing

see [[concept.namespace-relative-basing]]
