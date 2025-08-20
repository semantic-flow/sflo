

Node configuration can be inherited from any parent nodes, and overrides are accomplished with an optional node `_config-component` that travels with the node and is distinct from the `_meta-component`.

Default configuration can be determined recursing up  [[concept.mesh.resource.element.node-config-defaults]], which can also be inherited from parent nodes. 

Inheritance of configuration and defaults can be turned off. 

In case of missing configuration and absence of user defaults, the system will use sensible defaults which can be specified in the [[concept.node-config]]

## Core Principles

### Node-Config as node flow
- **Optional**: 
- **Transposable**: Node config travels with nodes during import/graft operations
- **Composable**: Each node may have its own self-contained configuration, but i

### Defaults vs Config
- **Config**: Actual operational settings for a specific node
- **Defaults**: Fallback values when config is missing or incomplete
- **Defaults inheritance**: Only occurs when needed, walks up mesh hierarchy
- **Most specific wins**: Closer defaults override higher-level ones

## Component Structure

### Separate Components
- `_config-component`: Operational behavior settings
- `_meta-component`: Structural/system metadata
- **Rationale**: Different update cadences, concerns, and responsibilities

### File Structure
```
/node-path/
  _config-component/
    _current/
      config.jsonld
    _next/           # optional, for pending changes
      config.jsonld
```

## Config Resolution Logic

### When Config is Retrieved
1. **Has valid config**: Use node's `_config-component` directly
2. **No config exists**: Walk up tree for defaults, create new config
3. **Missing required fields**: Fill gaps from defaults hierarchy

### Defaults Resolution
- Walk up mesh hierarchy from node to root
- Collect defaults at each level that has `flow-config-defaults`
- Most specific (closest to node) takes precedence
- Create complete config from merged defaults

## Schema Management

### Schema Versioning
- Each config includes `schemaVersion` field
- Schema updates trigger config validation
- Backward compatibility maintained where possible

### Update Operations
- `flow update` command handles schema migrations
- Can target specific subtrees or entire mesh
- Triggers defaults walk for outdated/missing configs

## Import/Export Behavior

### Import Decisions
- **Interactive mode**: User chooses keep/replace/merge
- **Automated mode**: Policy-driven decisions
- **Per-node basis**: Each node's config handled independently
- **No merging required**: One config per node eliminates conflicts

### Transposability
- Config components travel with nodes during operations
- Option to reset config during import (use target mesh defaults)
- Maintains semantic consistency across mesh boundaries

## Implementation Considerations

### Config Manager Interface
```typescript
interface ConfigManager {
  loadNodeConfig(nodePath: string): NodeConfig | null
  resolveConfig(nodePath: string): NodeConfig
  createFromDefaults(nodePath: string): NodeConfig
  updateConfigSchema(nodePath: string, newSchema: string): void
  validateConfig(config: NodeConfig): ValidationResult
}
```

### Service vs Node Config
- **Service config**: API endpoints, auth, global policies
- **Node config**: Weave behavior, validation rules, local settings
- **Clear separation**: Different storage, lifecycle, and scope

## Key Benefits

### Predictability
- No complex inheritance chains
- Clear resolution rules
- System-guaranteed validity

### Flexibility
- Granular per-node control
- Interactive import decisions
- Targeted update operations

### Maintainability
- Separate concerns (config vs metadata)
- Schema evolution support
- Backward compatibility

## Operational Workflows

### New Node Creation
1. System generates default config from hierarchy
2. Creates `_config-component` with resolved settings
3. Config immediately available and valid

### Config Updates
1. Modify `_next` layer in `_config-component`
2. Validate against current schema
3. Weave operation promotes to `_current`

### Schema Migration
1. `flow update` identifies outdated configs
2. Walks defaults for missing/new required fields
3. Updates `schemaVersion` and validates
4. Preserves existing valid settings
