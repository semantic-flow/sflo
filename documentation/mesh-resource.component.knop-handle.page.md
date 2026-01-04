---
id: handle-resource-page
title: handle resource page
desc: ''
updated: 1765136021066
created: 1751164675876
---

- provides an accessible description of its containing [[mesh-resource.knop]], which is identified with a [[mesh-resource.component.knop-handle]]. 
- perhaps javascript can be used to differentiate the in-use URL:
  - if it ends with "_knop-handle/" : 
    - "For Semantic Web purposes, this IRI should be considered to connote the Semantic mesh knop itself, not the knop's handle."
  - if it ends with "_knop-handle/#as-component" :
    - "For Semantic Web purposes, this IRI should be considered to connote the parent knop's [[folder._knop-handle]]"
  - if it ends with "index.html" :
    - "For Semantic Web purposes, this IRI should be considered to connote a [[folder._knop-handle]]'s Resource Page"
- essentially, a [[mesh-resource.component.documentation-resource.resource-page]]
