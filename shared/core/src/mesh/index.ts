/**
 * Mesh Operations
 * 
 * Core operations for managing Semantic Flow mesh knops.
 * 
 * See: task.2025-11-27-createKnop
 */

export type {
  CreateKnopOptions,
  CreateKnopResult,
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

export { createKnop } from "./createKnop.js";

export { generateKnopMetadata } from "./metadata.js";

export {
  isKnopInitialized,
  isDirectoryNonEmpty,
  deriveKnopSlug,
  createKnopStructure,
  createFlowStructure,
  writeFlowDistribution,
  copyDatasetToFlow,
} from "./scaffold.js";
