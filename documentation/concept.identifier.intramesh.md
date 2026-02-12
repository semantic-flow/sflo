---
id: 17l23vl7sqg997hr773dh23
title: intramesh identifier
desc: ''
updated: 1765633918067
created: 1750654763700
---

An **intramesh identifier** is a esentially a relative [[concept.iri]] (i.e., without the scheme, e.g., https:// or file://) except that they should correspond to an existing [[c.SemanticFlowResource]], i.e. [[principle.dereferencability-for-humans]]

There are two types of intramesh identifiers: [[concept.identifier.intramesh.relative]] and [[concept.identifier.intramesh.absolute]]. Absolute identifiers are not recommended because they break composability/transposability.

## Syntax

Like relative URLs:

  * Written without a scheme (e.g., no `https://` or `file://`).
  * May use path segments (`../`, `/foo/bar/`) 
  * May use fragment identifiers (`../#`, `/foo/bar/#inner-default-template`)

Unlike URLs:

  * **Must not** contain queries (`?`).


## Semantics

- Same as IRIs in RDF: they [[denote|concept.denotation]] things (aka [[concept.referent]]) which may be mesh resources or “things in the world”.
  - Fragments behave the same as in IRIs: they refine the primary denotation.

## Purpose

- locate [[c.SemanticFlowResource]]s (when used in a filesystem or web site context)
- denote a [[concept.referent]], either [[internal|facet.internal]] or [[external|facet.external]]

## Identifier Name Limitations for Users

- initial underscores prefix all [[facet.system]] identifiers and should be avoided in general for [[facet.user]] identifiers

## Distribution Relativity



### Examples

- Knop self-reference: `../../`
- sibling knop: `../../../my-dataset`  
- sibling components: `"../../_cfg-local/_current/config.trig"`, `"../../_cfg-inh/_current/config.trig"`, `"../../_payload/_current/data.jsonld"`  
- Components in other flows: Same pattern, just different flow names
