---
id: 3lqeacm90xhf0b8jrrerfop
title: assets tree
desc: ''
updated: 1764327509445
created: 1750729092262
---

This node component is "mesh-terminal" and should contain no [[sflow-resources|mesh-resource]]. 

It can be contained in any [[folder.node]], i.e., only Nodes get assets trees.

Its metadata (if any) should be stored in the parent node’s meta flow (`_meta/`). Asset trees are terminal and carry no flows, and are ignored by the mesh scanner.

It can contain an arbitrary set of files and folders, but two (optional) folders are special:
- _templates can contain html files to be used when generating [[mesh-resource.node-component.documentation-resource.resource-page]] for the containing [[mesh-resource.node]] or its sub-resources.
