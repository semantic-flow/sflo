---
id: 01yamanrc8jt6p29m0vlkwf
title: Mesh Redundancy
desc: ''
updated: 1768943322195
created: 1768942368320
---

We want to keep a mesh at github, and a mesh at gitlab. We'll also keep a mesh locally for offline work. All the resources are identical, and RDF files might use any one of them. In this case, I think we want to keep "sameAs" statements in every metadata set. Hopefully that ensures graph identity across hosts. If sameAs isn't strong enough, we need to invent a new property that means something stronger.
