---
id: config-inheritance-resolution
title: inheritable config flow
desc: How InheritableNodeConfig inheritance works in Semantic Flow
updated: 1755916057245
created: 1754285606247
---

An **inheritable config flow** contains settings that a knop makes available to its descendants in the mesh hierarchy. It is the primary mechanism for providing default configurations to child knops.

## Inheritance Hierarchy

The inheritance chain follows this precedence (most specific wins):

1.  **Parent Node's** InheritableNodeConfig
2.  **Grandparent Node's** InheritableNodeConfig (and so on, up the tree)
3.  **Service-level** InheritableNodeConfig
4.  **Platform-level** InheritableNodeConfig (ultimate fallback)

The final `OperationalNodeConfig` for a given knop is resolved by merging the settings from this chain.

## Resolution Algorithm

When resolving a knop's operational configuration, the system walks up the hierarchy from the knop's parent, collecting `InheritableNodeConfig` at each level. These are merged, with settings from closer ancestors taking precedence.

### Property-Level Inheritance

Configuration inheritance works at the property level. A child's `InheritableNodeConfig` can override a single property while still inheriting others from its parent.

```jsonld
{
  "@id": "parent:inheritableConfig",
  "@type": "knop-conf:InheritableNodeConfig",
  "knop-conf:versioningEnabled": true,
  "knop-conf:distributionFormats": ["application/trig", "application/ld+json"]
}

{
  "@id": "child:inheritableConfig",
  "@type": "knop-conf:InheritableNodeConfig",
  "knop-conf:versioningEnabled": false
  // Inherits distributionFormats from parent
}
```

## Configuration Control Properties

### `knopConfigInheritanceEnabled` (Child's Perspective)

Controls whether a knop *receives* inherited configuration.
-   **Default**: `true`
-   **Effect**: When `false`, the knop ignores the inheritance chain and uses only its own operational config or system defaults.

### `inheritableConfigPropagationEnabled` (Parent's Perspective)

Controls whether a knop *provides* its inheritable configuration to its children.
-   **Default**: `true`
-   **Effect**: When `false`, this knop acts as a "firewall," blocking its own and any ancestor's inheritable configs from flowing down to its children.
