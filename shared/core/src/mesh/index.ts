/**
 * Mesh Operations
 * 
 * Core operations for managing Semantic Flow mesh nodes.
 * 
 * See: task.2025-11-27-createNode
 */

export type {
  CreateNodeOptions,
  CreateNodeResult,
} from "./types.js";

export type {
  FlowSlug,
  DistributionType,
} from "./flows.js";

export {
  FLOW_SLUGS,
  SPECIAL_DIRS,
  getFlowFilename,
  getDistributionDir,
} from "./flows.js";

export { createNode } from "./createNode.js";

export { generateNodeMetadata } from "./metadata.js";

export {
  isNodeInitialized,
  isDirectoryNonEmpty,
  deriveNodeSlug,
  createNodeStructure,
  createFlowStructure,
  writeFlowDistribution,
  copyDatasetToFlow,
} from "./scaffold.js";
