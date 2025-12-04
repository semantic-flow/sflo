/**
 * Knop Scaffolding Utilities
 * 
 * Creates the filesystem structure for a mesh knop.
 * 
 * See: task.2025-11-27-createKnop
 */

import { promises as fs } from "fs";
import { join, resolve, basename } from "path";
import { FLOW_SLUGS, SPECIAL_DIRS, getFlowFilename, getDistributionDir } from "./flows.js";

/**
 * Check if a directory looks like an already-initialized knop
 * 
 * @param knopPath - Path to check
 * @returns true if directory appears to be a knop
 */
export async function isKnopInitialized(knopPath: string): Promise<boolean> {
  try {
    const entries = await fs.readdir(knopPath);
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
 * Derive knop slug from directory path
 * 
 * @param knopPath - Path to knop directory
 * @returns Knop slug (directory name)
 */
export function deriveKnopSlug(knopPath: string): string {
  const absPath = resolve(knopPath);
  return basename(absPath);
}

/**
 * Create knop directory structure
 * 
 * Creates:
 * - _knop-handle/ (stub)
 * - _meta/v1/
 * - _meta/_default/
 * 
 * @param knopPath - Path to knop directory
 */
export async function createKnopStructure(knopPath: string): Promise<void> {
  const absPath = resolve(knopPath);

  // Ensure knop directory exists
  await fs.mkdir(absPath, { recursive: true });

  // Create _knop-handle (stub)
  const handlePath = join(absPath, SPECIAL_DIRS.NODE_HANDLE);
  await fs.mkdir(handlePath, { recursive: true });

  // Create placeholder file in _knop-handle
  await fs.writeFile(
    join(handlePath, ".gitkeep"),
    "# Placeholder for knop handle\n"
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
 * @param knopPath - Path to knop directory
 * @param flowSlug - Flow directory slug
 */
export async function createFlowStructure(
  knopPath: string,
  flowSlug: string
): Promise<void> {
  const absPath = resolve(knopPath);
  const flowPath = join(absPath, flowSlug);

  // Create v1 and _default directories
  await fs.mkdir(join(flowPath, "v1"), { recursive: true });
  await fs.mkdir(join(flowPath, SPECIAL_DIRS.DEFAULT), { recursive: true });
}

/**
 * Write content to a flow distribution
 * 
 * @param knopPath - Path to knop directory
 * @param flowSlug - Flow directory slug
 * @param distributionType - Distribution type (version/default)
 * @param content - Content to write
 * @param knopSlug - Knop slug for filename
 * @param versionLabel - Version label (default: "v1")
 */
export async function writeFlowDistribution(
  knopPath: string,
  flowSlug: string,
  distributionType: "version" | "default",
  content: string,
  knopSlug: string,
  versionLabel: string = "v1"
): Promise<string> {
  const absPath = resolve(knopPath);
  const distributionDir = getDistributionDir(distributionType, versionLabel);
  const filename = getFlowFilename(knopSlug, flowSlug);
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
 * @param knopPath - Path to knop directory
 * @param flowSlug - Flow directory slug
 * @param knopSlug - Knop slug for filename
 * @returns Object with paths to v1 and default files
 */
export async function copyDatasetToFlow(
  sourcePath: string,
  knopPath: string,
  flowSlug: string,
  knopSlug: string
): Promise<{ v1: string; default: string }> {
  // Read source file
  const content = await fs.readFile(sourcePath, "utf-8");

  // Ensure flow structure exists
  await createFlowStructure(knopPath, flowSlug);

  // Write to v1
  const v1Path = await writeFlowDistribution(
    knopPath,
    flowSlug,
    "version",
    content,
    knopSlug,
    "v1"
  );

  // Write to _default (same content)
  const defaultPath = await writeFlowDistribution(
    knopPath,
    flowSlug,
    "default",
    content,
    knopSlug
  );

  return { v1: v1Path, default: defaultPath };
}
