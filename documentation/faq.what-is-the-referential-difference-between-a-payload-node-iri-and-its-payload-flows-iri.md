---
id: mz73fb9tuhefiycyddi2xw3
title: >-
  What Is the referential difference between a payload node's IRI and its payload flow's IRI
desc: 'The node is the what; the flow is the how.'
updated: 1762707545570
created: 1762625489419
---

A **payload node IRI** (e.g. `ns/djradon/bio/`) identifies the **abstract dataset itself** — it's a dereferenceable identifier for an RDF dataset
A **payload flow IRI** (e.g. `ns/djradon/bio/_payload-flow`) identifies the **semantic flow that captures the evolution of that dataset** — metadata about *how* the payload is produced, validated, versioned, or transformed.

| Aspect                        | Payload Node (`ns/djradon/bio/`)                                             | Payload Flow (`ns/djradon/bio/_payload-flow`)                      |
| ----------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Referential role**          | Refers to the dataset *as content*                                           | Refers to the dataset’s *production process*                       |
| **Ontological category**      | `sflo:PayloadNode` (or equivalent)                                           | `sflo:PayloadFlow` (a subclass of `sflo:Flow`)                     |
| **Nature**                    | Public, stable identifier for consumers                                      | Internal, operational metadata for publishers                      |
| **Dereferencing expectation** | Returns the default dataset or its default distribution (`index.trig`, etc.) | Returns RDF describing the flow’s inputs, transformations, outputs |
| **Persistence**               | Semi-permanent, versioned through dataset series (`_series/_main/v1/...`)    | May change across builds, describing how payload evolves           |
| **Relations**                 | `sflo:hasPayloadFlow <_payload-flow>`                                        | `sflo:producesPayload <bio/>` (inverse)                            |

In short:

* **`/bio/`** = “the data about Bio.”
* **`/bio/_payload-flow`** = “the process that emits `/bio/`.”

The node is the *what*; the flow is the *how*.
