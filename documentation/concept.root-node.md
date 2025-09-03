---
id: llzh1jdoieldfpff4v3ealw
title: root node
desc: ''
updated: 1756849836412
created: 1750996953035
---

The node at the top of a mesh hierarchy may be referred to as the root node. 

Every other [[mesh-resource]] in a mesh "lives under" the root node.

For pure [[concept.mesh-repo]]s, the repository's name is used as root node's identifier. 

For [[concept.mesh.embedded]], the root node's folder name is its identifier.

A root node is not treated or represented any differently than any other [[mesh-resource.node]], and it is not differentiated in metadata. So any node may become a root node simply by copying it somewhere that's not already a mesh.
