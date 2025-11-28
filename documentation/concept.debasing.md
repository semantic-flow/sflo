---
id: 73pf6u3gkhdk3hix14jl07i
title: Debasing
desc: ''
updated: 1764287709774
created: 1764287108669
---

## Overview

**De-basing** is the process of converting an imported RDF dataset into **mesh-native form** so that all local IRIs resolve relative to a node’s future serving location.  
It is part of **namespace adoption**: bringing external content under a Semantic Flow node’s identifier space.

Mesh-native files follow the rules described in  
[[concept.identifier.intramesh.relative]].

## Goals

- Remove any explicit `@base` / `BASE` declarations.  
- Rewrite local IRIs so that they become **relative IRIs**.  
- Ensure that the file is valid when parsed with the node’s **effective base IRI** (its final public URL).  
- Preserve external IRIs unchanged.  
- Record the transformation in provenance.

## When De-basing Occurs

De-basing is applied whenever an imported dataset is intended to become **content** of a node—either as:
- a **PayloadFlow** dataset, or  
- a **ReferenceFlow** dataset.

Datasets placed in the **assets tree** are *not* de-based.

## Algorithm (Conceptual)

Given:
- `oldBase`: the detected namespace prefix of the imported dataset.
- `nodeBase`: the node’s future HTTP URL (the mesh-native base).

For each IRI `I` in the dataset:
1. If `I` begins with `oldBase`:
   - Replace `I` with a **relative IRI**:  
     `I_rel = I.removePrefix(oldBase)`  
2. Else:
   - Leave `I` unchanged (external reference).

Finally:
- Remove explicit `@base` from serialization.
- Ensure **all local IRIs are relative IRIs**.
- Store provenance documenting:
  - original base (`oldBase`),
  - target node base (`nodeBase`),
  - the de-basing Activity.

## Example

Imported:

```turtle
@base <https://legacy.example.org/ns/foo/> .
<Bar> a ex:Thing .
