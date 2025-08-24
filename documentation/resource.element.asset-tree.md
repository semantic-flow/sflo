---
id: 3lqeacm90xhf0b8jrrerfop
title: assets tree
desc: ''
updated: 1755919595660
created: 1750729092262
---

This element is "mesh-terminal" and should contain no [[sflow-resources|resource]]. 

It can be contained in any [[folder.node]], i.e., only Nodes get assets trees.

Its metadata (if any) should be stored in the parent node’s meta flow (`_meta-flow/`). Asset trees are terminal and carry no flows, and are ignored by the mesh scanner.

It can contain an arbitrary set of files and folders, but two (optional) folders are special:
- _templates can contain html files to be used when generating [[resource.element.documentation-resource.resource-page]] for the containing [[resource.node]] or its sub-resources.
