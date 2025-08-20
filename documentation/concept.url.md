---
id: eo43ueh0viren1xkjcjregc
title: Semantic Flow URLs
desc: ''
updated: 1751747106164
created: 1750368774797
---

## Types of URLs in Semantic Flow

| sflow URL type             | referent                               | example                                           | versionable |
| -------------------------- | -------------------------------------- | ------------------------------------------------- | ----------- |
| namespace node             | -none-                                 | `https://ex.org/ns/`                              | ❌           |
| reference node             | concept                                | `https://ex.org/ns/dave/`                         | ❌           |
| abstract reference dataset | reference dataset                      | `https://ex.org/ns/dave/_ref/`                    | ✅           |
| concrete reference dataset | reference dataset                      | `https://ex.org/ns/dave/_ref/_current`            | ❌           |
| data node                  | concept w/ associated abstract dataset | `https://ex.org/ns/dave-bio/`                     | ❌           |
| abstract data dataset      | abstract dataset                       | `https://ex.org/ns/dave-bio/_data/`               | ✅           |
| concrete data dataset      | concrete dataset                       | `https://ex.org/ns/dave-bio/_data/_next/`         | ❌           |
| distribution               | content                                | `https://ex.org/ns/dave-bio/_v1/dave-bio_v1.trig` | ❌           |
| abstract meta dataset      | node metadata dataset                  | `https://ex.org/ns/dave-bio/_meta/`               | ✅           |
| concrete meta dataset      | node metadata dataset                  | `https://ex.org/ns/dave-bio/_meta/_current`       | ❌           |
| handle                     | mesh node                              | `https://ex.org/ns/dave/_handle/`                 | ❌           |
| resource documentation     | resource page (content)                | `https://ex.org/ns/dave/index.html`               | ❌           |
| resource documentation     | README file (content)                  | `https://ex.org/ns/dave/README.md`                | ❌           |
| asset tree                 | collection of assets                   | `https://ex.org/ns/assets/`                       | ❌           |
| asset folder               | sub-collection of assets               | `https://ex.org/ns/assets/images/`                | ❌           |
| asset                      | content                                | `https://ex.org/ns/assets/images/logo.svg`        | ❌           |


Example:
- `ns/` = namespace node for organizing content
- `ns/dave/` = refers to Dave the person (reference node)
- `ns/dave/index.html` = is the resource page about Dave
- `ns/dave-bio/` = refers to Dave's biographical dataset (data node)
- `ns/dave-bio/_data/` = abstract dataset containing Dave's bio data
- `ns/dave-bio/_data/_current/` = current concrete dataset snapshot
- `ns/dave-bio/_data/_v1/dave-bio_v1.trig` = is the RDF distribution from version 1
- `ns/dave/_assets/images/dave-headshot.jpg` = is an image asset; considered to be "attached" to the mesh, but not a mesh resource


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

* **Namespace node URLs** → Organizational containers
* **Reference node URLs** → Concepts: people, places, ideas, fictional characters, etc.
* **Data node URLs** → Concepts with associated datasets
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