---
id: 3lqeacm90xhf0b8jrrerfop
title: assets tree
desc: ''
updated: 1764867799389
created: 1750729092262
---

This knop component is "mesh-terminal" and should contain no [[sflow-resources|mesh-resource]]. 

It can be contained in any [[folder.knop]], i.e., only Nodes get assets trees.

Its metadata (if any) should be stored in the parent knop’s meta flow (`_meta/`). Asset trees are terminal and carry no flows, and are ignored by the mesh scanner.

It can contain an arbitrary set of files and folders, but two (optional) folders are special:
- _templates can contain html files to be used when generating [[mesh-resource.component.documentation-resource.resource-page]] for the containing [[mesh-resource.knop]] or its sub-resources.
