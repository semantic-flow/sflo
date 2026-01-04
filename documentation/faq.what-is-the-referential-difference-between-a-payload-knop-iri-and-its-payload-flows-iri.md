---
id: mz73fb9tuhefiycyddi2xw3
title: >-
  What Is the referential difference between a payload knop's IRI and its
  payload flow's IRI
desc: The knop is the what; the flow is the how.
updated: 1764867799222
created: 1762625489419
---

A **payload knop IRI** (e.g. `ns/djradon/bio/`) identifies the **abstract dataset itself** — it's a dereferenceable identifier for an RDF dataset
A **payload flow IRI** (e.g. `ns/djradon/bio/_payload`) identifies the **semantic flow that captures the evolution of that dataset** — metadata about *how* the payload is produced, validated, versioned, or transformed.

| Aspect                        | Payload Node (`ns/djradon/bio/`)                                             | Payload Flow (`ns/djradon/bio/_payload`)                           |
| ----------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Referential role**          | Refers to the dataset *as content*                                           | Refers to the dataset’s *production process*                       |
| **Ontological category**      | `sflo:PayloadNode` (or equivalent)                                           | `sflo:PayloadFlow` (a subclass of `sflo:Flow`)                     |
| **Nature**                    | Public, stable identifier for consumers                                      | Internal, operational metadata for publishers                      |
| **Dereferencing expectation** | Returns the default dataset or its default distribution (`index.trig`, etc.) | Returns RDF describing the flow’s inputs, transformations, outputs |
| **Persistence**               | Semi-permanent, versioned through dataset series (`_series/_main/v1/...`)    | May change across builds, describing how payload evolves           |
| **Relations**                 | `sflo:hasPayloadFlow <_payload>`                                             | `sflo:producesPayload <bio/>` (inverse)                            |

In short:

* **`/bio/`** = “the data about Bio.”
* **`/bio/_payload`** = “the process that emits `/bio/`.”

The knop is the *what*; the flow is the *how*.


## Analogy

Think of it like a library:
- **payload knop** = "The concept of the Encyclopedia Britannica"
- **payload flow** = The Encyclopedia Britannica as an ongoing series of editions
- **[[mesh-resource.component.slice]]** = Specific editions (1990 edition, 2020 edition, current edition)
- **

You can refer to "Encyclopedia Britannica" as a general concept or as a series without specifying which edition, or you can reference a specific edition when you need concrete data.
