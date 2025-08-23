---
id: kr1y9tt3qljsbfy8lxm3u1g
title: meshnode config flows
desc: ''
updated: 1755893848586
created: 1752325627733
---

Node configuration is managed through two distinct flows that provide settings for a node's behavior.

1.  **[[Operational Config Flow|concept.mesh.resource.element.flow.config.operational]]**: This flow contains the final, resolved configuration that dictates how a specific node operates.

2.  **[[Inheritable Config Flow|concept.mesh.resource.element.flow.config.inheritable]]**: This flow contains settings that a node makes available to its descendants in the mesh hierarchy.

While there are two separate flows, there is a single inheritance mechanism that resolves the final operational configuration for a node. This mechanism draws from the `inheritable` configs of parent nodes, as well as service and platform-level defaults.
