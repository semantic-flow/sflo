---
id: node-handle
title: node handle
desc: how to refer to a node as a node
updated: 1755992476930
created: 1751126532834
---

A **node handle** is a simple element that supports [[resource.node]]s with a very special semantic function: instead of refering to itself, a handle's identifier refers to its containing node "as a mesh resource." It acts as a "management interface" for the node.

## Example

If `/temperature-data/` URL refers to an abstract dataset, `/temperature-data/_node-handle` refers to the temperature-data node itself: as something that can have a node configuration and metadata about who created the node (as opposed to who created the dataset).

## Justification

Element identifiers don't have an obvious referent other than themselves. e.g., ns/djradon/bio-dataset/_data refers only to a specific [[resource.element.flow]]. 

So when they're mentioned in [[resource.element.flow.node-metadata]] or [[resource.element.flow.node-config]], it's clear enough that their identifiers refer to them "as mesh resources."

But because the URL of a [[resource.node]] refers to a namespace; an abstract dataset; or a thing or concept --  based on the [[principle.single-referent]] principle, you should not use the node's URL to refer to it "as a mesh resource."

## Issues

### No URL to refer to the handle itself

Luckily there's not much reason to have to refer to the handle-as-mesh-element because they are always co-created with the node, live forever, never change, don't have data of their own. But you can use the "fragment identifier" trick if there's ever a need to refer to the handle. e.g. /temperature-data/_node-handle/#


## Containment Rules

- must-be-contained-in: [[resource.node]]
- cannot-be-contained-in: 
  - [[resource.element]]
