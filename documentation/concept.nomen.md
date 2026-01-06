---
id: nomen
title: Nomen
desc: ''
updated: 1767719665350
created: 1765864579816
---

In the Semantic Flow, a **Nomen** (NOH-muhn) is an identifier that is bound to a [[mesh-resource.knop]]. It functions as a name for something worth talking about on the Semantic Web, e.g. a person, place, activity, concept, fictional entity, or digital artifact.

If the Knop has a [[mesh-resource.component.flow.reference]], the statements in that flow describe the referent of its Nomen.

If the Knop has a [[mesh-resource.component.flow.payload]], the Nomen denotes the digital artifact that the Knop hosts via its payload flow.

### Purpose

The purpose of a Nomen is to establish a stable Semantic Web identifier for something in the realm of discourse. 

A Nomen is not a description, a claim of correctness, or a guarantee of identity. It is simply a name: a focal point around which meaning may accrete and evolve over time.

### Binding

A Nomen has the form of an [[concept.iri]] and the defining part of the IRI corresponds structurally to a filesystem folder.

A Nomen is bound to a Knop by structural convention. Canonically, the Knop resides in a `_knop/` folder directly under the Nomen's folder.

The identity of a Nomen is determined jointly by:

* its folder name within a filesystem or namespace, and
* the context in which that filesystem or namespace is resolved (e.g., a local filesystem, a repository, or a web base).

As a result, a Nomen may be expressed using relative or absolute IRIs, depending on retrieval context, while remaining the same identifier in intent.
