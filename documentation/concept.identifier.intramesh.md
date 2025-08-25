---
id: 17l23vl7sqg997hr773dh23
title: intramesh identifier
desc: ''
updated: 1756161664431
created: 1750654763700
---

## Purpose

- locate [[mesh-resource]]s (when used in a filesystem or web site context)
- denote [[concept.referent]]

Intramesh identifiers are like base-relative URIs (i.e., without the scheme, e.g., https:// or file://) except may not include fragments (#) or query separators (?). They correspond to the filesystem location of their corresponding resources. Intramesh identifiers are recorded within distributions and, where configuration is needed, under the node’s operational config flow. Paths are always resolved relative to the distribution file that declares them.

If it starts with a `../` it refers to the parent, `../../` refers to the grandparent, etc.

## Identifier Semantics

Identifiers have the same semantics as [[concept.identifier]]

## Identifier Name Limitations

- initial underscores prefix all reserved dataset identifiers and should be avoided in general
![[sflo#^pnoqpr3ff4za]] 

## Examples

Directory structure: node/flow/snapshot/distribution.trig

Operational config example: `my-dataset/_config-operational-flow/_current/config.trig`  
Inheritable config example: `my-dataset/_config-inheritable-flow/_current/config.trig`  
Meta-flow example: `my-dataset/_meta-flow/_current/meta.trig`

Intramesh identifiers from meta-flow distributions:

Node self-reference: `"../../../my-dataset"`  
Other flows: `"../../_config-operational-flow/_current/config.trig"`, `"../../_config-inheritable-flow/_current/config.trig"`, `"../../_data-flow/_current/data.jsonld"`  
Components in other flows: Same pattern, just different flow names
