---
id: pqjdlyd8g80x3yr9o3p82mj
title: node config
desc: ''
updated: 1755820242711
created: 1752325154211
---

## per-node config specification

Node configuration determines:

- flow versioning
- resource page and resource fragment generation
- distribution syntaxes
- template usage and stylesheets
- attribution defaults

Node configuration is held in memory by the [[flow service|sflo.product.service]], and is calculated when the service starts.

Node configuration is at least partially determined by "config specification", which happens in [[concept.mesh.resource.element.flow.config]] and can be inherited to contained nodes.

If config specification is missing, (i.e., config spec inheritance is turned off or unspecified), node configuration will be determined from service-level config specification, i.e. [[sflo.product.service.config]]. In case there is none, the service will use sensible defaults at the root level which will be inherited down the mesh.

### Initial Config Specification

- When a node is initially created, if config-defaults-inheritance is turned on for its parent node, it will have its [[concept.mesh.resource.element.flow.config]] populated based on any parent [[concept.mesh.resource.element.node-config-defaults]] files present in the hierarchy. If there are none, its [[concept.mesh.resource.element.flow.snapshot.current]] will not be created.

### Calculating Node Config

When the [[sflo.product.service]] starts, it calculates non-default config settings for every node.

- determines the "default" settings for this service instance from [[sflo.product.service.config]]
- if the node has a [[concept.mesh.resource.element.flow.config]] , the service will use any settings there that differ from its defaults
- if config-inheritance is turned on for a node, the service will scan back up the hierarchy to compose any missing "non-default" settings
-  the result is an in-memory "shadow mesh" known as the [[sflo.product.service.components.node-config-map]] containing any non-default settings for the mesh

If calculated config matches the service defaults, they are ignored.

## per-service settings for node defaults

- [[sflo.product.service.config]] can establish any mesh-wide settings that diverge from the system defaults

## platform node-config defaults

Semantic Flow uses sensible defaults, so that neither node-level nor service-level "non-default" settings are necessary

- by default:
  - versioning is turned on for all components
  - distribution syntaxes are .trig and jsonld
  - resource pages are generated using a standard template and CSS file that get copied into a [[concept.mesh-repo]]'s root [[concept.mesh.resource.element.asset-tree]] upon initialization
  - [[concept.mesh.resource.element.aggregated-distribution]] are not generated
  - [[concept.mesh.resource.element.flow.unified]]
