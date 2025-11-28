/**
 * Mesh Flow Constants
 * 
 * Defines flow directory slugs and filename patterns for Semantic Flow nodes.
 * 
 * Flow directory slugs (core flows, short names):
 * - _meta    → node metadata flow
 * - _ref     → reference flow
 * - _payload → payload/data flow
 * - _cfg-op  → operational config flow
 * - _cfg-inh → inheritable config flow
 * 
 * See: task.2025-11-28-rdfsource-debasing-parsing
 */

/**
 * Flow slugs (directory names)
 */
export const FLOW_SLUGS = {
  METADATA: "_meta",
  REFERENCE: "_ref",
  PAYLOAD: "_payload",
  CONFIG_OPERATIONAL: "_cfg-op",
  CONFIG_INHERITABLE: "_cfg-inh",
} as const;

/**
 * Special directory names
 */
export const SPECIAL_DIRS = {
  NODE_HANDLE: "_node-handle",
  DEFAULT: "_default",
  WORKING: "_working",
} as const;

/**
 * Get filename for a flow distribution
 * 
 * Rules:
 * - Payload: <nodeSlug>.jsonld (no flow slug in filename)
 * - Others: <nodeSlug>_<flowSlug>.jsonld (underscore separator)
 * 
 * @param nodeSlug - The node's slug
 * @param flowSlug - The flow's directory slug
 * @returns The filename for this flow
 */
export function getFlowFilename(nodeSlug: string, flowSlug: string): string {
  if (flowSlug === FLOW_SLUGS.PAYLOAD) {
    return `${nodeSlug}.jsonld`;
  }

  return `${nodeSlug}${flowSlug}.jsonld`;
}

/**
 * Flow type definitions for type safety
 */
export type FlowSlug =
  | typeof FLOW_SLUGS.METADATA
  | typeof FLOW_SLUGS.REFERENCE
  | typeof FLOW_SLUGS.PAYLOAD
  | typeof FLOW_SLUGS.CONFIG_OPERATIONAL
  | typeof FLOW_SLUGS.CONFIG_INHERITABLE;

/**
 * Distribution type (version, default, or working)
 */
export type DistributionType = "version" | "default" | "working";

/**
 * Get the directory name for a distribution
 * 
 * @param type - Distribution type
 * @param versionLabel - Version label (e.g., "v1", "init", "2024-11-28-feature")
 * @returns Directory name
 */
export function getDistributionDir(
  type: DistributionType,
  versionLabel?: string
): string {
  switch (type) {
    case "default":
      return SPECIAL_DIRS.DEFAULT;
    case "working":
      return SPECIAL_DIRS.WORKING;
    case "version":
      if (!versionLabel) {
        throw new Error("Version label required for version distributions");
      }
      return versionLabel;
  }
}
