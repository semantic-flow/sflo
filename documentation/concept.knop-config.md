---
id: pqjdlyd8g80x3yr9o3p82mj
title: knop config
desc: ''
updated: 1764867799194
created: 1752325154211
---

## per-knop config specification

knop configuration determines:

- flow versioning (on/off; perhaps customweaveLable)
- resource page and resource fragment generation
- distribution syntaxes
- template usage and stylesheets

knop configuration is at least partially determined by "local config specification", which happens in the two config flows:  [[mesh-resource.component.flow.operational-config]] and [[mesh-resource.component.flow.inheritable-config]] (which can be inherited to contained knops).

If local config specification is missing, (i.e., config spec inheritance is turned off or unspecified and opertaional config is missing), knop configuration will be determined from application-level config specification. In case there is none, the service will use sensible defaults at the platform level.


### Calculating knop config

Knop configuration is managed through two distinct flows that provide settings for a knop's behavior.

1.  **[[Operational Config Flow|mesh-resource.component.flow.operational-config]]**: This flow contains the final, resolved configuration that dictates how a specific knop operates.

2.  **[[Inheritable Config Flow|mesh-resource.component.flow.inheritable-config]]**: This flow contains settings that a knop makes available to its descendants in the mesh hierarchy.

While there are two separate flows, there is a single inheritance mechanism that resolves the final operational configuration for a knop. This mechanism draws from the `inheritable` configs of parent knops, as well as service and platform-level defaults.

## per-service settings for knop defaults

- [[product.service.config]] can establish any mesh-wide settings that diverge from the system defaults

## platform knop-config defaults

Semantic Flow uses sensible defaults, specified in the so that neither knop-level nor service-level "non-default" settings are necessary

- by default:
  - versioning is turned on for all flows
  - distribution syntaxes are .trig and jsonld
  - resource pages are generated using a standard template and CSS file that get copied into a [[concept.single-mesh-repo]]'s root [[mesh-resource.component.asset-tree]] upon initialization
  - [[mesh-resource.component.aggregated-distribution]] are not generated
  - [[concept.mesh.resource.element.flow.unified]]
