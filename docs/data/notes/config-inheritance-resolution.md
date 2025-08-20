
# InheritableNodeConfig Inheritance Resolution

## Overview

The Semantic Flow platform supports sophisticated configuration inheritance through the `InheritableNodeConfig` class. This document describes how inheritance resolution works across the platform, service, and node hierarchy.

## Core Concepts

### Two Types of Configuration

1. **OperationalNodeConfig**: A node's actual operational settings that control its behavior
   - Does NOT participate in inheritance chain
   - Controls the node's own behavior (versioning, distribution formats, etc.)
   - Can have `nodeConfigInheritanceEnabled` to determine if it inherits from parents

2. **InheritableNodeConfig**: Configuration that can be passed down to child nodes
   - Participates in inheritance chain
   - Can be attached to Platform, Service, or Node
   - Provides defaults for child nodes

## Inheritance Hierarchy

The inheritance chain follows this precedence (most specific wins):

```
1. Node's own OperationalNodeConfig (if exists)
2. Parent Node's InheritableNodeConfig (if exists and inheritance enabled)
3. Grandparent Node's InheritableNodeConfig (walks up tree)
4. Service-level InheritableNodeConfig (if exists)
5. Platform-level InheritableNodeConfig (ultimate fallback)
```

## Resolution Algorithm

### For OperationalNodeConfig

When resolving a node's operational configuration:

```typescript
function resolveOperationalConfig(node: Node): OperationalNodeConfig {
  // Step 1: Check if node has its own OperationalNodeConfig
  if (node.hasOperationalNodeConfig) {
    return node.operationalNodeConfig;
  }
  
  // Step 2: Check if inheritance is enabled (default: true)
  if (!node.nodeConfigInheritanceEnabled) {
    return createDefaultOperationalConfig();
  }
  
  // Step 3: Walk up the tree collecting InheritableNodeConfigs
  const inheritanceChain = [];
  let current = node.parent;
  
  while (current) {
    if (current.hasInheritableNodeConfig) {
      inheritanceChain.push(current.inheritableNodeConfig);
    }
    current = current.parent;
  }
  
  // Step 4: Add service-level InheritableNodeConfig
  if (service.hasInheritableNodeConfig) {
    inheritanceChain.push(service.inheritableNodeConfig);
  }
  
  // Step 5: Add platform-level InheritableNodeConfig
  if (platform.hasInheritableNodeConfig) {
    inheritanceChain.push(platform.inheritableNodeConfig);
  }
  
  // Step 6: Merge configs (most specific wins)
  return mergeConfigs(inheritanceChain.reverse());
}
```

### For InheritableNodeConfig

When a node needs to determine what configuration to pass to its children:

```typescript
function resolveInheritableConfig(node: Node): InheritableNodeConfig {
  // Step 1: If node has its own InheritableNodeConfig, use it
  if (node.hasInheritableNodeConfig) {
    return node.inheritableNodeConfig;
  }
  
  // Step 2: Check if inheritance propagation is enabled
  if (!node.inheritableConfigPropagationEnabled) {
    return null; // No config to pass down
  }
  
  // Step 3: Walk up to find nearest InheritableNodeConfig
  let current = node.parent;
  
  while (current) {
    if (current.hasInheritableNodeConfig) {
      return current.inheritableNodeConfig;
    }
    current = current.parent;
  }
  
  // Step 4: Fall back to service-level
  if (service.hasInheritableNodeConfig) {
    return service.inheritableNodeConfig;
  }
  
  // Step 5: Fall back to platform-level
  return platform.inheritableNodeConfig;
}
```

## Property-Level Inheritance

Configuration inheritance works at the property level, not all-or-nothing:

```jsonld
{
  "@id": "parent:inheritableConfig",
  "@type": "conf:InheritableNodeConfig",
  "conf:versioningEnabled": true,
  "conf:distributionFormats": ["application/trig", "application/ld+json"],
  "conf:generateUnifiedDataset": true
}

{
  "@id": "child:inheritableConfig",
  "@type": "conf:InheritableNodeConfig",
  "conf:versioningEnabled": false
  // Inherits distributionFormats and generateUnifiedDataset from parent
}
```

## Configuration Control Properties

### nodeConfigInheritanceEnabled (Child's Perspective)

Controls whether a node inherits configuration from its parent hierarchy:
- **Domain**: `conf:OperationalNodeConfig`
- **Default**: `true`
- **Effect**: When `false`, the node uses only its own config or system defaults

### inheritableConfigPropagationEnabled (Parent's Perspective - Configuration Firewall)

Creates a **configuration firewall** that blocks ALL inheritance from flowing through this node to its children:

```jsonld
{
  "@id": "conf:inheritableConfigPropagationEnabled",
  "@type": "owl:DatatypeProperty",
  "rdfs:label": "inheritable config propagation enabled",
  "rdfs:comment": "Configuration firewall control. When false, blocks ALL InheritableNodeConfig from this node AND all ancestors (including Platform and Service configs) from reaching child nodes. Creates a hard configuration boundary.",
  "schema:domainIncludes": { "@id": "node:Handle" },
  "schema:rangeIncludes": { "@id": "xsd:boolean" }
}
```

**Default**: `true` - Inheritance flows normally through this node

**Key Distinction**: The `inheritableConfigPropagationEnabled` property is completely independent of whether the node has its own InheritableNodeConfig:
- A node can have `inheritableConfigPropagationEnabled: false` WITH an InheritableNodeConfig (the config exists but won't be passed down)
- A node can have `inheritableConfigPropagationEnabled: false` WITHOUT an InheritableNodeConfig (blocks all inheritance from above)
- When set to `false`, it creates a complete configuration barrier, blocking ALL inheritance (regardless of source) from reaching child nodes

**Effect on child nodes**: They must either:
1. Define their own complete OperationalNodeConfig
2. Use bare platform defaults, ignoring any parent NodeConfig and any NodeConfig defaults set in the ServiceConfig

## Use Cases

### Platform-Wide Defaults

```jsonld
{
  "@id": "platform:config",
  "@type": "fsvc:PlatformServiceConfig",
  "conf:hasInheritableNodeConfig": {
    "@type": "conf:InheritableNodeConfig",
    "conf:versioningEnabled": true,
    "conf:distributionFormats": ["application/trig", "application/ld+json"]
  }
}
```

### Service-Specific Overrides

```jsonld
{
  "@id": "service:config",
  "@type": "fsvc:ServiceConfig",
  "conf:hasInheritableNodeConfig": {
    "@type": "conf:InheritableNodeConfig",
    "conf:versioningEnabled": false  // Override platform default
  }
}
```

### Node with Different Operational and Inheritable Configs

```jsonld
{
  "@id": "node:handle",
  "@type": "node:Handle",
  "conf:hasOperationalNodeConfig": {
    "@type": "conf:OperationalNodeConfig",
    "conf:versioningEnabled": false,  // This node doesn't version
    "conf:distributionFormats": ["application/trig"]
  },
  "conf:hasInheritableNodeConfig": {
    "@type": "conf:InheritableNodeConfig",
    "conf:versioningEnabled": true,  // But children should version
    "conf:distributionFormats": ["application/trig", "application/ld+json", "text/turtle"]
  }
}
```

### Configuration Firewall - Stopping ALL Inheritance

When you need to create a hard configuration boundary that blocks ALL inheritance (not just the node's own config):

```jsonld
{
  "@id": "boundary:node",
  "@type": "node:Handle",
  "conf:inheritableConfigPropagationEnabled": false
  // Creates a configuration firewall - children get NO inheritance from:
  // - This node's InheritableNodeConfig
  // - Any parent node's InheritableNodeConfig
  // - Service-level InheritableNodeConfig
  // - Platform-level InheritableNodeConfig
}
```

**Use Cases for Configuration Firewalls:**

1. **Test/Development Isolation**:
```jsonld
{
  "@id": "test:boundary",
  "@type": "node:Handle",
  "conf:inheritableConfigPropagationEnabled": false,
  "rdfs:comment": "Test subtree isolated from production configs"
}
```

2. **Multi-tenant Boundaries**:
```jsonld
{
  "@id": "tenant:acme:root",
  "@type": "node:Handle",
  "conf:inheritableConfigPropagationEnabled": false,
  "conf:hasInheritableNodeConfig": {
    "@type": "conf:InheritableNodeConfig",
    "conf:versioningEnabled": true,
    "dcterms:rightsHolder": { "@id": "https://acme.example.org" }
    // This InheritableNodeConfig exists but won't propagate to children
    // because inheritableConfigPropagationEnabled is false
  }
}
```

Note: In this case, the node HAS an InheritableNodeConfig but blocks it from propagating. This might seem contradictory, but could be useful if the config is used for other purposes (documentation, templates, etc.) or if propagation is conditionally enabled later.

3. **Legacy System Integration**:
```jsonld
{
  "@id": "legacy:integration:point",
  "@type": "node:Handle",
  "conf:inheritableConfigPropagationEnabled": false,
  "rdfs:comment": "Legacy systems below this point use their own config scheme"
}
```

## Implementation Notes

### Config Resolution Service

The config resolution service should:
1. Cache resolved configurations for performance
2. Invalidate cache when parent configs change
3. Support partial config objects (only override specific properties)
4. Validate merged configs against SHACL shapes

### Default Behavior

- If no configuration exists at any level, system provides sensible defaults
- `nodeConfigInheritanceEnabled` defaults to `true`
- `inheritableConfigPropagationEnabled` defaults to `true`
- Empty InheritableNodeConfig means "use all defaults"

### Migration Path

For existing systems:
1. Convert existing NodeConfig to OperationalNodeConfig
2. Create InheritableNodeConfig from service defaults
3. Set `nodeConfigInheritanceEnabled` based on current behavior
4. Gradually adopt property-level inheritance

## Benefits

1. **Flexibility**: Nodes can have different operational settings than what they pass to children
2. **Granularity**: Property-level inheritance allows fine-grained control
3. **Clarity**: Clear separation between operational and inheritable configuration
4. **Scalability**: Platform/Service/Node hierarchy supports large deployments
5. **Control**: Can stop inheritance at any level when needed

## Complexity Management

While the system supports sophisticated inheritance, common use cases remain simple:

### Simple Case 1: Use All Defaults
```jsonld
{
  "@id": "simple:node",
  "@type": "node:Handle"
  // Gets all config from inheritance chain
}
```

### Simple Case 2: Override One Setting
```jsonld
{
  "@id": "simple:node",
  "@type": "node:Handle",
  "conf:hasOperationalNodeConfig": {
    "@type": "conf:OperationalNodeConfig",
    "conf:versioningEnabled": false
    // Everything else inherited
  }
}
```

### Simple Case 3: Service-Wide Settings
```jsonld
{
  "@id": "service:config",
  "@type": "fsvc:ServiceConfig",
  "conf:hasInheritableNodeConfig": {
    "@type": "conf:InheritableNodeConfig",
    "conf:versioningEnabled": true,
    "conf:distributionFormats": ["application/trig"]
    // All nodes in service get these defaults
  }
}
```

## See Also

- [[concept.mesh.resource.element.flow.config]]
- [[concept.node-config]]
- [[concept.mesh.resource.element.node-config-defaults]]
