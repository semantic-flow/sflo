---
id: e6enrj5ztz3hz84ojujef0k
title: Aggregated Distribution
desc: ''
updated: 1762707513739
created: 1751631229565
---

__note: maybe we will do them, maybe we won't__
 - t.2025.11.08.09 probably not. Better to go the other way: from a payload dataset, create all its named nodes and link back to the original; keeps things flow-y
- probably won't do unified distributions except via API. 

A node's **aggregated distribution** is a compilation of all the child flows of itself and its contained nodes (their `_payload-flow/_default/` snapshots), situated directly under the parent node with an intuitive filename like "nodename.ext".

Essentially, it's a "(sub-)mesh in a single file." 

Perhaps its only available via API. 

## Purpose

Aggregated distributions support [[principle.composability]] and [[principle.transposability]] by:
- Combining contained nodes' data into a single resource
- Supporting modular ontology and knowledge base construction

## Issues

config options
- zipping/compression?
- user data only, or include metadata/config

## Generation Process

During [[concept.weave-process]], aggregated distributions are created by:
1. **Scanning contained payload nodes** recursively within the mesh structure
2. **Collecting `_payload-flow/_default/` distributions** from each flow
3. **Merging content** with proper URI resolution and prefix handling
4. **Excluding `_config` and `_meta` datasets** (data content only)
5. **Generating multiple distributions** (.ttl, .rdf, .jsonld) as configured

## Examples

### Composable Ontology
```
/my-ontology/
├── my-ontology.ttl              ← Aggregated distribution
├── my-ontology.rdf              ← Aggregated distribution  
├── my-ontology.jsonld           ← Aggregated distribution
├── Person/                  ← payload node (class definition)
├── hasName/                 ← payload node (property definition)
└── Organization/            ← payload node (class definition)
```

### Knowledge Base
```
/biotech-kb/
├── biotech-kb.ttl               ← Aggregated distribution
├── biotech-kb.jsonld            ← Aggregated distribution
├── companies/
│   ├── genentech/               ← Company payload node
│   └── moderna/                 ← Company payload node
└── products/
    ├── drug-x/                  ← Product payload node
    └── vaccine-y/               ← Product payload node
```

## Technical Considerations

**Merging logic handles:**
- **Relative path resolution** - Converting relative URIs to absolute
- **Prefix consolidation** - Deduplicating namespace declarations
- **Graph merging** - Combining RDF graphs from multiple sources; de-duplicating
- **Base URI handling** - Ensuring consistent URI resolution

## Use Cases

- **Ontologies** - Classes and properties from contained nodes
- **Vocabularies** - Terms and definitions from specialized nodes  
- **Catalogs** - Dataset metadata from multiple sources
- **Knowledge bases** - Facts distributed across domain-specific nodes
- **Configuration data** - Settings aggregated from component services

## Related Concepts

- **[[mesh-resource.node-component.flow.payload]]** - Source datasets for aggregation
- **[[concept.weave-process]]** - Process that generates aggregated distributions
- **[[mesh-resource.node-component.flow-shot]]** - Contains the actual distributions being aggregated
