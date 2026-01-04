---
id: 73pf6u3gkhdk3hix14jl07i
title: Debasing
desc: ''
updated: 1764867799215
created: 1764287108669
---

## Overview

**De-basing** is the process of converting an imported RDF dataset into **mesh-native form** so that all local IRIs resolve relative to a knop’s future serving location.  
It is part of **namespace adoption**: bringing external content under a Semantic Flow knop’s identifier space.

Mesh-native files follow the rules described in  
[[concept.identifier.intramesh.relative]].

## Goals

- Remove any explicit `@base` / `BASE` declarations.  
- Rewrite local IRIs so that they become **relative IRIs**.  
- Ensure that the file is valid when parsed with the knop’s **effective base IRI** (usually a "file:///").  
- Preserve external IRIs unchanged.  
- Record the transformation in .

## When De-basing Occurs

De-basing is applied whenever an imported dataset is intended to become **content** of a knop—either as:
- a **PayloadFlow** dataset, or  
- a **ReferenceFlow** dataset.

Datasets placed in the **assets tree** are *not* de-based.

## Algorithm (Conceptual)

Given:
- `oldBase`: the detected namespace prefix of the imported dataset.
- `knopBase`: the knop’s future HTTP URL (the mesh-native base).

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
  - target knop base (`knopBase`),
  - the de-basing Activity.

## Example

Imported:

```turtle
@base <https://legacy.example.org/ns/foo/> .
<Bar> a ex:Thing .
