
## Question

Why don't [[payload nodes|mesh-resource.node.payload]] contain distribution files directly? Why do I need to go to `_current/` to find the actual data?

## Answer

payload nodes represent **abstract data concepts**, not concrete data instances. This separation provides several important benefits:

### Clear Semantic Distinction

- **payload node** (`/ns/monsters/`): "The concept of monster data"
- **Data compound** (`/ns/monsters/_payload-flow/`): "The abstract dataset associated with the monster data concept" 
- **Data compound layers**: the current, next and historical versions of the dataset

This allows you to reference the concept separately from the associated abstract or concrete dataset.

### Stable Identity

The payload node and data compound provide permanent, stable identifier for the concept and its payload dataset that persist even as the concrete data changes over time. You can always refer to "monster data as a concept" using `/ns/monsters/` regardless of how many versions exist.

### Temporal Organization

By separating the concept from concrete instances, payload nodes can cleanly organize different temporal states:
- `_current/` - current data
- `_next/` - draft changes  
- `_v1/`, `_v2/` - historical versions

### Consistent Architecture

This mirrors how [[reference nodes|concept.mesh.resource.node.reference]] work:
- **Reference nodes**: Abstract entity concept + `_ref/` node component with concrete data
- **payload nodes**: Abstract data concept + `_current/` component with concrete data

### Metadata Separation

The payload node's [[metapayload flow|mesh-resource.node-component.flow.node-metadata]] contains system metadata about the data concept and its components, while each [[mesh-resource.node-component.flow.payload]] can also contain (concept-specific) metadata.

TODO: example


## Analogy

Think of it like a library:
- **payload node** = "The concept of the Encyclopedia Britannica"
- **payload flow** = The Encyclopedia Britannica as an ongoing series of editions
- **[[mesh-resource.node-component.flow-snapshot]]** = Specific editions (1990 edition, 2020 edition, current edition)

You can refer to "Encyclopedia Britannica" as a general concept or as a series without specifying which edition, or you can reference a specific edition when you need concrete data.
