---
id: 4v2b7t8nbzkmtyvnayye3vj
title: Provenance
desc: ''
updated: 1762708072882
created: 1753117923066
---

## Core Principles

**Version-only provenance** - Provenance reference in [[mesh-resource.node-component.flow-shot.default-shot]] should reference its corresponding stable version; 

**Meta-flow storage** - Semantic Flow-specific provenance lives in meta-flows, referencing version snapshots in other flows. Domain-specific provenance can live in datasets themselves.

**default snapshot duplication** - `_default` meta snapshots contain identical copies of the latest version's provenance with base URI pointing to the version snapshot for stable fragment resolution.

## Fragment Identifier Naming Scheme

To ensure that every RDF node used in a `[[mesh-resource.node-component.flow.node-metadata]] distribution` has a unique and dereferenceable URI, the following naming scheme for [[fragment identifiers|concept.fragment-identifiers]] MUST be used. This allows the metadata snapshot's [[mesh-resource.node-component.documentation-resource.resource-page]] to correctly provide anchors for all provenance entities.

The structure is as follows:

`<{flow-slug}-{version}-{entity-type}[-{unique-part}]>`

-   **`{flow-slug}`**: The slug of the flow this provenance describes (e.g., `[[folder._config-inheritable-flow]]`, `data-flow`). This provides the primary namespace for the identifier.
-   **`{version}`**: The version of the target flow's snapshot (e.g., `v47`). This scopes the provenance to a specific point in time.
-   **`{entity-type}`**: The class of the entity, using a consistent UpperCamelCase (e.g., `Activity`, `Context`, `DelegationChain`, `DelegationStep`).
-   **`{unique-part}`**: (Optional) A unique suffix, such as a step number or a timestamp, used when multiple entities of the same type exist for the same flow and version.

### Provenance Fragment Identifier Examples

For a `config-flow` at version `v47`, the identifiers would be:

-   **Activity**: `<#config-flow-v47-Activity>`
-   **Provenance Context**: `<#config-flow-v47-Context>`
-   **Delegation Chain**: `<#config-flow-v47-DelegationChain>`
-   **Delegation Steps**:
    -   `<#config-flow-v47-DelegationStep-1>`
    -   `<#config-flow-v47-DelegationStep-2>`


## Architecture

### Version Snapshot Provenance

```turtle
# In my-dataset/_node-metadata-flow/_v47/my-dataset_meta.trig
@base <../_v47/> .

# Weave activity with PROV standard properties
:#configUpdateActivity a meta:ConfigWeave ;
    prov:startedAtTime "2025-07-20T14:30:00Z" ;
    prov:endedAtTime "2025-07-20T14:30:15Z" ;
    prov:used <../../_config-flow/_v46/config.jsonld> ;
    prov:generated <../../_config-flow/_v47/config.jsonld> ;
    prov:wasAssociatedWith <https://semantic-flow.org/agents/flow-service-bot> .

# Rights and licensing at snapshot level
<../../_config-flow/_v47> dcterms:rightsHolder <https://orcid.org/0000-0002-1825-0097> ;
                          dcterms:license <https://creativecommons.org/licenses/by-sa/4.0/> ;
                          prov:has_provenance :configProvenance .

# Delegation chain (step 1 = top authority, gets copyright by default)
:configProvenance a meta:ProvenanceContext ;
    meta:forActivity :configUpdateActivity ;
    meta:forSnapshot <../../_config-flow/_v47> ;
    prov:wasAttributedTo <https://acme-corp.com/org> ; # Primary attribution
    meta:delegationChain :delegationChain_001 .

:delegationChain_001 meta:hasStep :step1, :step2, :step3 .

:step1 a meta:DelegationStep ;
       meta:stepOrder 1 ;
       prov:agent <https://acme-corp.com/org> . # Prime mover, no actedOnBehalfOf

:step2 a meta:DelegationStep ;
       meta:stepOrder 2 ;
       prov:agent <https://orcid.org/0000-0002-1825-0097> ;
       prov:actedOnBehalfOf <https://acme-corp.com/org> .

:step3 a meta:DelegationStep ;
       meta:stepOrder 3 ;
       prov:agent <https://semantic-flow.org/agents/flow-service-bot> ;
       prov:actedOnBehalfOf <https://orcid.org/0000-0002-1825-0097> .
```

### default snapshot Copy

```turtle
# In my-dataset/_node-metadata-flow/_default/my-dataset_meta.trig
@base <../_v47/> .

# Identical content to version snapshot - all URIs resolve to stable version
# (same provenance content as above)
```

### Unversioned Flow Accumulation

For flows without versioning, activities accumulate in `_working` with unique timestamps:

```turtle
# In my-dataset/_node-metadata-flow/_working/my-dataset_meta.trig
:dataActivity_2025-07-20_14-30 a meta:DataWeave ;
    prov:startedAtTime "2025-07-20T14:30:00Z" ;
    prov:generated <../../_payload-flow/_default/data.trig> .

:dataActivity_2025-07-20_16-45 a meta:DataWeave ;
    prov:startedAtTime "2025-07-20T16:45:00Z" ;
    prov:used <../../_payload-flow/_default/data.trig> ;
    prov:generated <../../_payload-flow/_default/data.trig> .
```

## Key Components

### Activity Types (subclass `prov:Activity`)
- `meta:ConfigWeave`, `meta:ReferenceWeave`, `meta:DataWeave`, `meta:MetaWeave`
- `meta:NodeWeave` (entire node), `meta:NodeTreeWeave` (recursive)

### Provenance Entities (subclass `meta:ProvenanceEntity`)
- `meta:ProvenanceContext` - Relator for complex authorship scenarios
- `meta:DelegationChain` / `meta:DelegationStep` - Authorization chains
- `meta:AgentRoleCollection` / `meta:AgentRole` - Collaborative role assignments

### Standard Properties Used
- `prov:agent`, `prov:actedOnBehalfOf`, `prov:wasAttributedTo` (instead of custom properties)
- `dcterms:rightsHolder`, `dcterms:license` (rights at snapshot level)
- `prov:has_provenance` (link snapshots to provenance contexts)

## Delegation Chain Pattern

**Step ordering**: Lower numbers = higher authority
- Step 1: Prime mover (organization) - gets copyright by default, no `prov:actedOnBehalfOf`
- Step 2+: Each agent acts on behalf of the previous step's agent
- Tools/software agents typically at the end of the chain

## Configuration

**Copyright assignment**: Configurable in node-config-defaults, defaults to first agent in delegation chain (step 1).

**External vocabulary tracking**: Use SHACL to declare recommended external properties like `prov:wasInfluencedBy`, `dcterms:license`.

## Implementation Notes

- **Fragment URIs**: Use `<#step1>` etc. within version snapshots for stable addressability
- **Base URI**: All snapshots use `@base <../_vN/>` pattern for consistent resolution
- **Rights inheritance**: Capture previous version rights holders in provenance contexts when content is derived
- **Static site friendly**: Documentation approach for external references since no server-side redirects available

