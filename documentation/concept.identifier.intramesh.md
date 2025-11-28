---
id: 17l23vl7sqg997hr773dh23
title: intramesh identifier
desc: ''
updated: 1764327645699
created: 1750654763700
---

An **intramesh identifier** is a esentially a relative [[concept.iri]] (i.e., without the scheme, e.g., https:// or file://) except that they should correspond to an existing [[mesh-resource]], i.e. [[principle.dereferencability-for-humans]]

There are two types of intramesh identifiers: [[concept.identifier.intramesh.relative]] and [[concept.identifier.intramesh.absolute]]

## Syntax

Like IRIs:

  * Written without a scheme (e.g., no `https://` or `file://`).
  * May use path segments (`../`, `/foo/bar`) 
  * May use fragment identifiers (`#`)

Unlike IRIs:

  * **Must not** contain queries (`?`).
  * 

## Semantics

- Same as IRIs in RDF: they [[denote|concept.denotation]] things (aka [[concept.referent]]) which may be mesh resources or “things in the world”.
  - Fragments behave the same as in IRIs: they refine the primary denotation.

## Purpose

- locate [[mesh-resource]]s (when used in a filesystem or web site context)
- denote a [[concept.referent]], either [[internal|facet.internal]] or [[external|facet.external]]

## Identifier Name Limitations for Users

- initial underscores prefix all [[facet.system]] identifiers and should be avoided in general for [[facet.user]] identifiers

## Distribution Relativity



### Examples

Node self-reference: `"../../../my-dataset"`  
Other flows: `"../../_cfg-op/_current/config.trig"`, `"../../_cfg-inh/_current/config.trig"`, `"../../_dataset-flow/_current/data.jsonld"`  
Components in other flows: Same pattern, just different flow names
