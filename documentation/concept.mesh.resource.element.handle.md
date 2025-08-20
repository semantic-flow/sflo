---
id: o2926clbf63vi9kln79kapg
title: handle
desc: ''
updated: 1753063187498
created: 1751126532834
---

A **handle** is a simple element that supports [[concept.mesh.resource.node]]s. It has a very special semantic use: instead of refering to itself, it refers to its containing node "as a mesh resource." So it becomes a "management interface" for the node.

## Example

If `/temperature-data/` URL refers to an abstract dataset, `/temperature-data/_handle` refers to the temperature-data node itself: something that can have a node config and provenance metadata about who created the node (as opposed to who created the dataset).

## Justification

Element identifiers don't have an obvious referent other than themselves. e.g., ns/djradon/bio-dataset/_data refers only to a specific [[concept.mesh.resource.element.flow]]. 

So when they're mentioned in [[concept.mesh.resource.element.flow.metadata]] or [[concept.mesh.resource.element.flow.config]], it's clear enough that their identifiers refer to them "as mesh resources."

But because the URL of a [[concept.mesh.resource.node]] refers to a namespace; an abstract dataset; or a thing or concept --  based on the [[sflo.principle.single-referent]] principle, you should not use the node's URL to refer to it "as a mesh resource."

## Issues

### No URL to refer to the handle itself

Luckily there's not much reason to have to refer to the handle-as-mesh-element because they are always co-created with the node, live forever, never change, don't have data of their own. But you can use the "fragment identifier" trick if there's ever a need to refer to the handle. e.g. /temperature-data/_handle/#


## Containment Rules

- must-be-contained-in: [[concept.mesh.resource.node]]
- cannot-be-contained-in: 
  - [[concept.mesh.resource.element]]
