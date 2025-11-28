---
id: architecture-plan-rdfsource-createnode
title: Architecture Plan - RdfSource & createNode
desc: Detailed architecture and implementation plan for RdfSource abstraction and createNode operation
created: 2025-11-28
---

# Architecture Plan: RdfSource Abstraction & createNode Operation

## Overview

This document provides the architectural design for implementing:
1. **RdfSource abstraction** - A coherent model for RDF loading/serialization
2. **createNode operation** - Core mesh node initialization using RdfSource

## 1. RdfSource Abstraction Design

### 1.1 Core Principles

- **Explicit base handling**: Always require a base IRI for parsing
- **Mesh-native output**: Serialize with relative IRIs, no `@base`
- **Format-agnostic**: Support JSON-LD (primary) and Turtle/TriG (future)
- **Testable & composable**: Small, focused functions that compose well

### 1.2 Type Definitions

Location: [`shared/core/src/rdf/types.ts`](../../shared/core/src/rdf/types.ts)

```typescript
/**
 * Source of RDF data - file path, URL, or in-memory content
 */
export type RdfSourceInput =
  | { type: "file"; path: string }
  | { type: "url"; url: string }
  | { type: "content"; content: string; format: RdfFormat };

/**
 * Supported RDF serialization formats
 */
export type RdfFormat = "jsonld" | "turtle" | "trig" | "ntriples" | "nquads";

/**
 * Options for parsing RDF
 */
export interface RdfParseOptions {
  /** Base IRI for resolving relative references (REQUIRED) */
  baseIri: string;
  /** Expected format (auto-detect if not specified) */
  format?: RdfFormat;
}

/**
 * Options for serializing RDF
 */
export interface RdfSerializeOptions {
  /** Output format */
  format: RdfFormat;
  /** Whether to include @base in output (default: false for mesh-native) */
  includeBase?: boolean;
  /** Whether to pretty-print (default: true) */
  prettyPrint?: boolean;
}

/**
 * Metadata about the RDF source
 */
export interface RdfSourceMetadata {
  /** Detected or provided base IRI */
  baseIri: string;
  /** Detected format */
  format: RdfFormat;
  /** Original source location (file path or URL) */
  sourceLocation?: string;
}

/**
 * Loaded RDF dataset with metadata
 */
export interface RdfDataset {
  /** The RDF quads (using @rdfjs/types) */
  quads: Quad[];
  /** Metadata about the source */
  metadata: RdfSourceMetadata;
}
```

### 1.3 Core Functions

Location: [`shared/core/src/rdf/source.ts`](../../shared/core/src/rdf/source.ts)

```typescript
/**
 * Parse RDF from a source into quads
 * 
 * @param source - RDF source input
 * @param options - Parse options (baseIri REQUIRED)
 * @returns Loaded dataset with quads and metadata
 * 
 * See: concept.implied-rdf-base, concept.identifier.intramesh.relative
 */
export async function parseRdf(
  source: RdfSourceInput,
  options: RdfParseOptions
): Promise<RdfDataset>;

/**
 * Serialize RDF quads to a string
 * 
 * Mesh-native mode (default):
 * - No @base in output
 * - Local IRIs become relative IRIs
 * 
 * @param dataset - RDF dataset to serialize
 * @param options - Serialization options
 * @returns Serialized RDF string
 * 
 * See: concept.identifier.intramesh.relative
 */
export async function serializeRdf(
  dataset: RdfDataset,
  options: RdfSerializeOptions
): Promise<string>;

/**
 * Compute file:/// base IRI from absolute file path
 * 
 * @param absolutePath - Absolute filesystem path
 * @returns file:/// URL suitable as RDF base
 */
export function filePathToBaseIri(absolutePath: string): string;

/**
 * Extract base IRI from RDF content (if present)
 * 
 * @param content - RDF content string
 * @param format - RDF format
 * @returns Detected base IRI or undefined
 */
export async function detectBaseIri(
  content: string,
  format: RdfFormat
): Promise<string | undefined>;
```

### 1.4 Helper Functions

Location: [`shared/core/src/rdf/helpers.ts`](../../shared/core/src/rdf/helpers.ts)

```typescript
/**
 * Make IRIs relative to a base
 * 
 * Used for creating mesh-native files from external datasets
 * 
 * @param quads - RDF quads with absolute IRIs
 * @param baseIri - Base to make relative to
 * @returns Quads with relative IRIs where applicable
 * 
 * See: concept.debasing
 */
export function makeIrisRelative(
  quads: Quad[],
  baseIri: string
): Quad[];

/**
 * Detect RDF format from file extension or content
 * 
 * @param pathOrContent - File path or content string
 * @returns Detected format
 */
export function detectFormat(pathOrContent: string): RdfFormat;

/**
 * Validate that a base IRI is suitable for mesh use
 * 
 * @param baseIri - IRI to validate
 * @throws if invalid
 */
export function validateMeshBaseIri(baseIri: string): void;
```

### 1.5 Implementation Notes

- Use `@rdfjs/types` for Quad interface
- Use `jsonld` library for JSON-LD parsing/serialization
- Use `n3` library for Turtle/TriG parsing/serialization
- Use `@rdfjs/data-model` for creating quads
- Handle errors gracefully with custom error types
- All functions are pure and stateless

### 1.6 Testing Strategy

Location: [`shared/core/src/rdf/__tests__/`](../../shared/core/src/rdf/__tests__/)

Test files:
- `source.test.ts` - Core parsing/serialization
- `helpers.test.ts` - Helper functions
- `integration.test.ts` - End-to-end workflows

Test cases:
- Parse JSON-LD with explicit base
- Parse Turtle with base declaration
- Serialize mesh-native JSON-LD (no @base, relative IRIs)
- Round-trip: parse → serialize → parse
- Error handling: missing base, invalid format
- File path to base IRI conversion
- Base IRI detection

## 2. createNode Operation Design

### 2.1 Core Function Signature

Location: [`shared/core/src/operations/create-node.ts`](../../shared/core/src/operations/create-node.ts)

```typescript
/**
 * Options for creating a new mesh node
 */
export interface CreateNodeOptions {
  /** Path to payload dataset (optional) */
  payloadDatasetPath?: string;
  
  /** Path to reference dataset (optional) */
  referenceDatasetPath?: string;
  
  /** Path to operational config dataset (optional) */
  operationalConfigPath?: string;
  
  /** Path to inheritable config dataset (optional) */
  inheritableConfigPath?: string;
  
  /** Provenance information (optional) */
  provenanceInput?: ProvenanceBundleInput;
  
  /** Allow creating in non-empty directory (default: false) */
  allowNonEmpty?: boolean;
  
  /** Namespace root path for computing base IRIs */
  namespaceRoot?: string;
}

/**
 * Provenance information for node creation
 */
export interface ProvenanceBundleInput {
  /** Primary agent IRI (human or system) */
  primaryAgentIri?: string;
  
  /** Organization IRI (rights holder org) */
  organizationIri?: string;
  
  /** Additional contributor IRIs */
  contributorsIri?: string[];
  
  /** Rights holder IRI */
  rightsHolderIri?: string;
  
  /** License IRI (e.g., CC BY-SA URL) */
  licenseIri?: string;
}

/**
 * Result of node creation
 */
export interface CreateNodeResult {
  /** Absolute path to created node */
  nodePath: string;
  
  /** Node slug (derived from folder name) */
  nodeSlug: string;
  
  /** Base IRI for the node */
  nodeBaseIri: string;
  
  /** Created flow paths */
  flows: {
    meta: string;
    ref?: string;
    payload?: string;
    cfgOp?: string;
    cfgInh?: string;
  };
}

/**
 * Create a new mesh node
 * 
 * Steps:
 * 1. Validate path (not already a node, handle allowNonEmpty)
 * 2. Create node directory structure
 * 3. Create _node-handle/ stub
 * 4. Create _meta/ v1 and _default/ with minimal metadata
 * 5. Optionally import reference/payload/config datasets
 * 6. Return result summary
 * 
 * @param nodeTargetPath - Path where node should be created
 * @param options - Creation options
 * @returns Creation result
 * @throws {NodeAlreadyExistsError} if node already initialized
 * @throws {DirectoryNotEmptyError} if directory not empty and !allowNonEmpty
 * 
 * See: task.2025-11-27-createNode, concept.weave-process
 */
export async function createNode(
  nodeTargetPath: string,
  options?: CreateNodeOptions
): Promise<CreateNodeResult>;
```

### 2.2 Internal Functions

```typescript
/**
 * Validate that path is suitable for node creation
 */
async function validateNodePath(
  path: string,
  allowNonEmpty: boolean
): Promise<void>;

/**
 * Create directory structure for a node
 */
async function createNodeScaffolding(
  nodePath: string,
  nodeSlug: string
): Promise<void>;

/**
 * Generate minimal v1 metadata for a new node
 */
function generateNodeMetadata(
  nodeSlug: string,
  nodeBaseIri: string,
  provenance?: ProvenanceBundleInput
): RdfDataset;

/**
 * Import and normalize a dataset into a flow
 */
async function importDatasetToFlow(
  sourcePath: string,
  targetFlowPath: string,
  nodeSlug: string,
  flowSlug: string,
  nodeBaseIri: string
): Promise<void>;

/**
 * Derive node slug from folder name
 */
function deriveNodeSlug(nodePath: string): string;

/**
 * Compute node base IRI from path and namespace root
 */
function computeNodeBaseIri(
  nodePath: string,
  namespaceRoot?: string
): string;
```

### 2.3 Flow Slug Constants

Location: [`shared/core/src/constants/flows.ts`](../../shared/core/src/constants/flows.ts)

```typescript
/**
 * Flow slug constants (from semantic-flow ontology)
 * 
 * See: ontology/semantic-flow/_payload-flow/_working/semantic-flow-ontology.jsonld
 */
export const FLOW_SLUGS = {
  META: "_meta",
  REF: "_ref",
  PAYLOAD: "_payload",
  CFG_OP: "_cfg-op",
  CFG_INH: "_cfg-inh",
} as const;

/**
 * Snapshot folder names
 */
export const SNAPSHOT_FOLDERS = {
  WORKING: "_working",
  DEFAULT: "_default",
} as const;

/**
 * System folder names
 */
export const SYSTEM_FOLDERS = {
  HANDLE: "_node-handle",
} as const;
```

### 2.4 Filename Generation

```typescript
/**
 * Generate distribution filename for a flow
 * 
 * Payload: <nodeSlug>.jsonld
 * Others: <nodeSlug>_<flowSlug>.jsonld
 * 
 * @param nodeSlug - Node slug
 * @param flowSlug - Flow slug (undefined for payload)
 * @returns Filename
 */
function generateDistributionFilename(
  nodeSlug: string,
  flowSlug?: string
): string {
  if (!flowSlug || flowSlug === FLOW_SLUGS.PAYLOAD) {
    return `${nodeSlug}.jsonld`;
  }
  return `${nodeSlug}${flowSlug}.jsonld`;
}
```

### 2.5 Metadata Generation Strategy

The v1 metadata will include:

1. **Node Description**
   - Node IRI: `<>` (relative, resolves to node)
   - Type: Placeholder or inferred from flows
   - Label/description: Minimal stub

2. **Flow Metadata**
   - Meta flow IRI: `_meta/` (relative)
   - Flow type: `sflo:NodeMetadataFlow`
   - Weave label: Initial (e.g., "2025-11-28_1112_00")
   - Sequence number: 1

3. **Provenance (Minimal)**
   - NodeCreation activity stub
   - Agent reference (if provided)
   - Rights/license (if provided)
   - No full DelegationChain yet

4. **Relative IRIs**
   - All local references use relative IRIs
   - External vocabularies use absolute IRIs
   - No `@base` in serialized output

Example metadata structure:
```jsonld
{
  "@context": {
    "sflo": "https://semantic-flow.github.io/ontology/semantic-flow/",
    "dcat": "http://www.w3.org/ns/dcat#",
    "dcterms": "http://purl.org/dc/terms/",
    "prov": "http://www.w3.org/ns/prov#"
  },
  "@graph": [
    {
      "@id": "",
      "@type": "sflo:BareNode",
      "dcterms:title": "Node Title"
    },
    {
      "@id": "_meta/",
      "@type": "sflo:NodeMetadataFlow",
      "sflo:weaveLabel": "2025-11-28_1112_00",
      "sflo:versioningState": { "@id": "sflo:VersioningState/versioned/" }
    },
    {
      "@id": "_meta/_default/",
      "@type": "sflo:DefaultShot",
      "sflo:sequenceNumber": 1,
      "prov:wasGeneratedBy": {
        "@id": "_meta/_default/#creation-activity"
      }
    }
  ]
}
```

### 2.6 Directory Structure Created

```
<nodeTargetPath>/
├── _node-handle/
│   └── README.md          # Stub explaining the handle concept
├── _meta/
│   ├── v1/
│   │   └── <slug>_meta.jsonld
│   └── _default/
│       └── <slug>_meta.jsonld
[optional flows if datasets provided:]
├── _ref/
│   ├── v1/
│   │   └── <slug>_ref.jsonld
│   └── _default/
│       └── <slug>_ref.jsonld
├── _payload/
│   ├── v1/
│   │   └── <slug>.jsonld
│   └── _default/
│       └── <slug>.jsonld
├── _cfg-op/
│   ├── v1/
│   │   └── <slug>_cfg-op.jsonld
│   └── _default/
│       └── <slug>_cfg-op.jsonld
└── _cfg-inh/
    ├── v1/
    │   └── <slug>_cfg-inh.jsonld
    └── _default/
        └── <slug>_cfg-inh.jsonld
```

### 2.7 Error Handling

Custom error types in [`shared/core/src/errors/node-errors.ts`](../../shared/core/src/errors/node-errors.ts):

```typescript
export class NodeAlreadyExistsError extends Error {
  constructor(path: string) {
    super(`Node already exists at: ${path}`);
    this.name = "NodeAlreadyExistsError";
  }
}

export class DirectoryNotEmptyError extends Error {
  constructor(path: string) {
    super(`Directory not empty: ${path}. Use allowNonEmpty option to override.`);
    this.name = "DirectoryNotEmptyError";
  }
}

export class InvalidNodePathError extends Error {
  constructor(path: string, reason: string) {
    super(`Invalid node path: ${path}. Reason: ${reason}`);
    this.name = "InvalidNodePathError";
  }
}
```

## 3. Simple Node Runner

Location: [`scripts/create-node.ts`](../../scripts/create-node.ts)

```typescript
#!/usr/bin/env tsx
/**
 * Simple CLI runner for createNode operation
 * 
 * Usage:
 *   npx tsx scripts/create-node.ts <nodePath> [--allow-non-empty]
 */

import { createNode } from "@semantic-flow/core";
import { parseArgs } from "node:util";

async function main() {
  const { values, positionals } = parseArgs({
    options: {
      "allow-non-empty": { type: "boolean", default: false },
    },
    allowPositionals: true,
  });

  if (positionals.length === 0) {
    console.error("Usage: create-node <nodePath> [--allow-non-empty]");
    process.exit(1);
  }

  const nodePath = positionals[0];

  try {
    console.log(`Creating node at: ${nodePath}`);
    
    const result = await createNode(nodePath, {
      allowNonEmpty: values["allow-non-empty"] as boolean,
    });

    console.log("\n✅ Node created successfully!");
    console.log(`  Path: ${result.nodePath}`);
    console.log(`  Slug: ${result.nodeSlug}`);
    console.log(`  Base IRI: ${result.nodeBaseIri}`);
    console.log(`\nFlows created:`);
    console.log(`  Metadata: ${result.flows.meta}`);
    if (result.flows.ref) console.log(`  Reference: ${result.flows.ref}`);
    if (result.flows.payload) console.log(`  Payload: ${result.flows.payload}`);
    if (result.flows.cfgOp) console.log(`  Config (Op): ${result.flows.cfgOp}`);
    if (result.flows.cfgInh) console.log(`  Config (Inh): ${result.flows.cfgInh}`);
    
  } catch (error) {
    console.error("\n❌ Error creating node:");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
```

## 4. Testing Strategy

### 4.1 RdfSource Tests

- Unit tests for each function
- Format detection tests
- Base IRI computation tests
- Round-trip parse/serialize tests
- Error handling tests

### 4.2 createNode Tests

Location: [`shared/core/src/operations/__tests__/create-node.test.ts`](../../shared/core/src/operations/__tests__/create-node.test.ts)

Test cases:
1. Create node in empty directory
2. Fail on already-initialized node
3. Fail on non-empty directory without flag
4. Succeed on non-empty with allowNonEmpty
5. Create node with payload dataset
6. Create node with reference dataset
7. Create node with all optional datasets
8. Validate metadata content
9. Validate filename conventions
10. Validate directory structure

### 4.3 Integration Tests

End-to-end scenarios:
1. Create node → read metadata → validate structure
2. Create node → import dataset → verify relative IRIs
3. Multiple nodes in hierarchy

## 5. Documentation Updates

### 5.1 Parsing Semantics Spec

Update the following documentation files:

1. **[`concept.identifier.intramesh.relative.md`](../../documentation/concept.identifier.intramesh.relative.md)**
   - Add section on parsing with base IRI
   - Add examples of relative IRI resolution

2. **[`concept.iri.md`](../../documentation/concept.iri.md)**
   - Add section on base IRI computation
   - Add file:/// URL examples

3. **[`concept.implied-rdf-base.md`](../../documentation/concept.implied-rdf-base.md)**
   - Add detailed parsing rules
   - Add serialization rules
   - Add examples

4. **[`concept.debasing.md`](../../documentation/concept.debasing.md)**
   - Formalize the algorithm
   - Add step-by-step examples
   - Reference RdfSource functions

5. **New file: [`concept.rdf-source.md`](../../documentation/concept.rdf-source.md)**
   - Document the RdfSource abstraction
   - API reference
   - Usage examples

## 6. Dependencies to Add

Update [`shared/core/package.json`](../../shared/core/package.json):

```json
{
  "dependencies": {
    "@rdfjs/types": "^1.1.0",
    "@rdfjs/data-model": "^2.0.0",
    "jsonld": "^8.3.2",
    "n3": "^1.17.2"
  },
  "devDependencies": {
    "@types/jsonld": "^1.5.13",
    "@types/n3": "^1.16.4"
  }
}
```

## 7. Implementation Order

1. **Phase 1: RdfSource Foundation** (1-2 days)
   - Install dependencies
   - Create type definitions
   - Implement core parsing/serialization
   - Implement helper functions
   - Write unit tests

2. **Phase 2: createNode Core** (2-3 days)
   - Implement path validation
   - Implement scaffolding functions
   - Implement metadata generation
   - Implement optional dataset import
   - Write unit tests

3. **Phase 3: Integration** (1 day)
   - Create runner script
   - Write integration tests
   - Manual testing

4. **Phase 4: Documentation** (1 day)
   - Update concept docs
   - Add API documentation
   - Update task files

**Total estimated time: 5-7 days**

## 8. Future Enhancements (Out of Scope)

These are explicitly **not** part of this task:

- Full debasing algorithm with IRI rewriting
- Payload unpacking into child nodes
- Config inheritance from parent nodes
- Full PROV/DelegationChain modeling
- SHACL validation
- RDF store integration
- CLI framework (Oclif) integration
- Interactive mode with prompts

## 9. Success Criteria

The implementation is complete when:

1. ✅ RdfSource can parse JSON-LD and Turtle with explicit base
2. ✅ RdfSource can serialize mesh-native JSON-LD (no @base, relative IRIs)
3. ✅ createNode creates correct directory structure
4. ✅ createNode generates valid v1 metadata
5. ✅ createNode can import optional datasets
6. ✅ All tests pass (unit + integration)
7. ✅ Documentation is updated
8. ✅ Simple runner script works
9. ✅ Code follows project conventions
10. ✅ Task files are updated with progress

## References

- [task.2025-11-28-rdfsource-debasing-parsing](./task.2025-11-28-rdfsource-debasing-parsing.md)
- [task.2025-11-27-createNode](./task.2025-11-27-createNode.md)
- [concept.identifier.intramesh.relative](./concept.identifier.intramesh.relative.md)
- [concept.implied-rdf-base](./concept.implied-rdf-base.md)
- [concept.debasing](./concept.debasing.md)
- [concept.weave-process](./concept.weave-process.md)
- [dev.general-guidance](./dev.general-guidance.md)
