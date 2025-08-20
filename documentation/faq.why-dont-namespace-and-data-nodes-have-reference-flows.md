---
id: faq001
title: Why don't namespace nodes have reference flows?
desc: ''
updated: 1752026355577
created: 1751351297000
---

## Question

Why don't [[namespace nodes|concept.mesh.resource.node.namespace]] and [[concept.mesh.resource.node.data]] have [[reference flows|concept.mesh.resource.element.flow.reference]] like [[reference nodes|concept.mesh.resource.node.reference]] do?

## Answer

URLs that correspond to namespace nodes and data nodes don't have a referent other than themselves. This helps avoid ambiguity when interpreting their URLs. (see the [[sflo.principle.single-referent]]). 

e.g.:
- `ns/` : doesn't refer to anything, it's just a namespace
- `ns/people` : does this refer to people in general, i.e. conceptually? or to a dataset? if it's got a data flow, it refers to a dataset. If it's got a reference flow, it refers to something other than a dataset.

Since reference nodes can do everything namespace nodes can do (i.e., contain other nodes), there's no drawback to making namespace nodes into reference nodes.
