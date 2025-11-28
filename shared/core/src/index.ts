/**
 * Semantic Flow Core Library
 * 
 * Core functionality for Semantic Flow mesh operations.
 */

// RDF operations
export type {
  RdfSyntax,
  JsonLdValue,
  RdfSource,
  ParsedRdf,
  SerializeOptions,
} from "./rdf/index.js";

export {
  parseRdfSource,
  serializeRdf,
} from "./rdf/index.js";

// Mesh operations
export type {
  CreateNodeOptions,
  CreateNodeResult,
  FlowSlug,
  DistributionType,
} from "./mesh/index.js";

export {
  FLOW_SLUGS,
  SPECIAL_DIRS,
  getFlowFilename,
  getDistributionDir,
  createNode,
  generateNodeMetadata,
  isNodeInitialized,
  isDirectoryNonEmpty,
  deriveNodeSlug,
  createNodeStructure,
  createFlowStructure,
  writeFlowDistribution,
  copyDatasetToFlow,
} from "./mesh/index.js";
