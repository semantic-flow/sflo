/**
 * Node Scaffolding Utilities
 * 
 * Creates the filesystem structure for a mesh node.
 * 
 * See: task.2025-11-27-createNode
 */

import { promises as fs } from "fs";
import { join, resolve, basename } from "path";
import { FLOW_SLUGS, SPECIAL_DIRS, getFlowFilename, getDistributionDir } from "./flows.js";

/**
 * Check if a directory looks like an already-initialized node
 * 
 * @param nodePath - Path to check
 * @returns true if directory appears to be a node
 */
export async function isNodeInitialized(nodePath: string): Promise<boolean> {
  try {
    const entries = await fs.readdir(nodePath);
    return entries.includes(SPECIAL_DIRS.NODE_HANDLE) || entries.includes(FLOW_SLUGS.METADATA);
  } catch (error) {
    // Directory doesn't exist or can't be read
    return false;
  }
}

/**
 * Check if directory exists and is non-empty
 * 
 * @param dirPath - Path to check
 * @returns true if directory exists and is non-empty
 */
export async function isDirectoryNonEmpty(dirPath: string): Promise<boolean> {
  try {
    const entries = await fs.readdir(dirPath);
    return entries.length > 0;
  } catch (error) {
    // Directory doesn't exist
    return false;
  }
}

/**
 * Derive node slug from directory path
 * 
 * @param nodePath - Path to node directory
 * @returns Node slug (directory name)
 */
export function deriveNodeSlug(nodePath: string): string {
  const absPath = resolve(nodePath);
  return basename(absPath);
}

/**
 * Create node directory structure
 * 
 * Creates:
 * - _node-handle/ (stub)
 * - _meta/v1/
 * - _meta/_default/
 * 
 * @param nodePath - Path to node directory
 */
export async function createNodeStructure(nodePath: string): Promise<void> {
  const absPath = resolve(nodePath);

  // Ensure node directory exists
  await fs.mkdir(absPath, { recursive: true });

  // Create _node-handle (stub)
  const handlePath = join(absPath, SPECIAL_DIRS.NODE_HANDLE);
  await fs.mkdir(handlePath, { recursive: true });

  // Create placeholder file in _node-handle
  await fs.writeFile(
    join(handlePath, ".gitkeep"),
    "# Placeholder for node handle\n"
  );

  // Create _meta/v1 and _meta/_default
  const metaPath = join(absPath, FLOW_SLUGS.METADATA);
  await fs.mkdir(join(metaPath, "v1"), { recursive: true });
  await fs.mkdir(join(metaPath, SPECIAL_DIRS.DEFAULT), { recursive: true });
}

/**
 * Create flow structure
 * 
 * Creates versioned and default distribution directories for a flow.
 * 
 * @param nodePath - Path to node directory
 * @param flowSlug - Flow directory slug
 */
export async function createFlowStructure(
  nodePath: string,
  flowSlug: string
): Promise<void> {
  const absPath = resolve(nodePath);
  const flowPath = join(absPath, flowSlug);

  // Create v1 and _default directories
  await fs.mkdir(join(flowPath, "v1"), { recursive: true });
  await fs.mkdir(join(flowPath, SPECIAL_DIRS.DEFAULT), { recursive: true });
}

/**
 * Write content to a flow distribution
 * 
 * @param nodePath - Path to node directory
 * @param flowSlug - Flow directory slug
 * @param distributionType - Distribution type (version/default)
 * @param content - Content to write
 * @param nodeSlug - Node slug for filename
 * @param versionLabel - Version label (default: "v1")
 */
export async function writeFlowDistribution(
  nodePath: string,
  flowSlug: string,
  distributionType: "version" | "default",
  content: string,
  nodeSlug: string,
  versionLabel: string = "v1"
): Promise<string> {
  const absPath = resolve(nodePath);
  const distributionDir = getDistributionDir(distributionType, versionLabel);
  const filename = getFlowFilename(nodeSlug, flowSlug);
  const filePath = join(absPath, flowSlug, distributionDir, filename);

  // Ensure directory exists
  await fs.mkdir(join(absPath, flowSlug, distributionDir), { recursive: true });

  // Write file
  await fs.writeFile(filePath, content, "utf-8");

  return filePath;
}

/**
 * Copy a dataset file to a flow
 * 
 * Reads the source file, parses it, and writes it to both v1 and _default.
 * 
 * @param sourcePath - Path to source dataset file
 * @param nodePath - Path to node directory
 * @param flowSlug - Flow directory slug
 * @param nodeSlug - Node slug for filename
 * @returns Object with paths to v1 and default files
 */
export async function copyDatasetToFlow(
  sourcePath: string,
  nodePath: string,
  flowSlug: string,
  nodeSlug: string
): Promise<{ v1: string; default: string }> {
  // Read source file
  const content = await fs.readFile(sourcePath, "utf-8");

  // Ensure flow structure exists
  await createFlowStructure(nodePath, flowSlug);

  // Write to v1
  const v1Path = await writeFlowDistribution(
    nodePath,
    flowSlug,
    "version",
    content,
    nodeSlug,
    "v1"
  );

  // Write to _default (same content)
  const defaultPath = await writeFlowDistribution(
    nodePath,
    flowSlug,
    "default",
    content,
    nodeSlug
  );

  return { v1: v1Path, default: defaultPath };
}
