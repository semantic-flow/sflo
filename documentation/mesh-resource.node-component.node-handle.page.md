---
id: handle-resource-page
title: handle resource page
desc: ''
updated: 1764435799924
created: 1751164675876
---

- provides an accessible description of its containing [[mesh-resource.node]], which is identified with a [[mesh-resource.node-component.node-handle]]. 
- perhaps javascript can be used to differentiate the in-use URL:
  - if it ends with "_node-handle/" : 
    - "For Semantic Web purposes, this IRI should be considered to connote the Semantic Mesh node itself, not the node's handle."
  - if it ends with "_node-handle/#as-component" :
    - "For Semantic Web purposes, this IRI should be considered to connote the parent node's NodeHandle"
  - if it ends with "index.html" :
    - "For Semantic Web purposes, this IRI should be considered to connote a NodeHandle's Resource Page"
- essentially, a [[mesh-resource.node-component.documentation-resource.resource-page]]
