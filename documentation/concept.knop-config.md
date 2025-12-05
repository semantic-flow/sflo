---
id: pqjdlyd8g80x3yr9o3p82mj
title: knop config
desc: ''
updated: 1764954966497
created: 1752325154211
---

## Purpose

knop configuration determines:

- flow versioning (on/off; perhaps customweaveLable)
- resource page and resource fragment generation
- distribution syntaxes
- template usage and stylesheets

### Calculating operational knop config

Knop configuration ("OperationalKnopConfig") is at least partially determined by the two config flows:  [[mesh-resource.component.flow.local-config]] and [[mesh-resource.component.flow.inheritable-config]] (which can be inherited to contained knops).

For "weave-mandatory" config settings aren't specified by flow-derived config, (i.e., inheritable config is turned off or unspecified and local config is unspecified), mandatory knop configuration should be determined from application-level config specification first, and then the application should  use sensible defaults at the platform level.

While there are two separate flows, there is a single inheritance mechanism that resolves the final local configuration for a knop. This mechanism draws from the `inheritable` configs of parent knops, as well as service and platform-level defaults.

## per-application settings for knop defaults

- applications can establish any mesh-wide settings that diverge from the system defaults; if applications access multiple meshes, they may choose to have mesh-specific application defaults and a general set as well.

## platform knop-config defaults

Semantic Flow uses sensible defaults, specified in the so that neither knop-level nor service-level "non-default" settings are necessary

- by default:
  - versioning is turned on for all flows
  - distribution syntaxes are .trig and jsonld
  - resource pages are generated using a standard template and CSS file that get copied into a [[concept.single-mesh-repo]]'s root [[mesh-resource.component.asset-tree]] upon initialization
  - [[mesh-resource.component.aggregated-distribution]] are not generated
  - [[concept.mesh.resource.element.flow.unified]]
