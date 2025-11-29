/**
 * Create Node Operation
 *
 * Scaffolds a new mesh node with _working shots and resource pages.
 * Does NOT create snapshots - those are written by weaves.
 *
 * See: task.2025-11-28_refine-createnode
 */

import { resolve, join, basename } from "path";
import { mkdir, writeFile, readFile } from "fs/promises";
import { pathToFileURL } from "url";
import MarkdownIt from "markdown-it";
import { parseRdfSource } from "../rdf/parser.js";
import { serializeRdf } from "../rdf/serializer.js";
import {
  isNodeInitialized,
  isDirectoryNonEmpty,
  deriveNodeSlug,
} from "./scaffold.js";
import { FLOW_SLUGS, SPECIAL_DIRS, getFlowFilename } from "./flows.js";
import type { CreateNodeOptions, CreateNodeResult } from "./types.js";
import type { RdfSource } from "../rdf/types.js";

// Initialize markdown-it instance
const md = new MarkdownIt({
  html: true,        // Enable HTML tags in source
  linkify: true,     // Auto-convert URLs to links
  typographer: true  // Enable smart quotes and other typographic replacements
});

/**
 * Create a new mesh node
 * 
 * Scaffolds directory structure and writes _working shots.
 * Does NOT write snapshots (v1, _default) - those are created by weaves.
 * 
 * Creates:
 * - _node-handle/ directory
 * - _meta/_default/ (empty, no RDF)
 * - _working shots for flows where RdfSource inputs provided
 * - README.md if content provided
 * - index.html resource pages
 * 
 * Safety:
 * - Fails if node already initialized
 * - Fails/warns if directory non-empty (unless allowNonEmpty=true)
 * 
 * @param nodeTargetPath - Path to node directory (created if needed)
 * @param options - Creation options
 * @returns Result with paths to created resources
 */
export async function createNode(
  nodeTargetPath: string,
  options: CreateNodeOptions = {}
): Promise<CreateNodeResult> {
  const absPath = resolve(nodeTargetPath);
  const nodeSlug = deriveNodeSlug(absPath);

  // --- Safety checks ---

  if (await isNodeInitialized(absPath)) {
    throw new Error(
      `Node already initialized at ${absPath}. ` +
      `Found _node-handle or _meta directory.`
    );
  }

  if (!options.allowNonEmpty && await isDirectoryNonEmpty(absPath)) {
    throw new Error(
      `Directory ${absPath} is non-empty. ` +
      `Use allowNonEmpty option to override this safety check.`
    );
  }

  // --- Create base node structure ---

  // Ensure node directory exists
  await mkdir(absPath, { recursive: true });

  // Create _node-handle (minimal stub)
  const handleDir = join(absPath, SPECIAL_DIRS.NODE_HANDLE);
  await mkdir(handleDir, { recursive: true });

  // Create _meta/_default (empty - no RDF until first weave)
  const metaDefaultDir = join(absPath, FLOW_SLUGS.METADATA, SPECIAL_DIRS.DEFAULT);
  await mkdir(metaDefaultDir, { recursive: true });

  // --- Write _working shots for provided inputs ---

  const createdWorkingFlows: CreateNodeResult["createdWorkingFlows"] = {};

  // Reference flow
  if (options.referenceDataset) {
    const refPath = await writeWorkingShot(
      absPath,
      FLOW_SLUGS.REFERENCE,
      nodeSlug,
      options.referenceDataset
    );
    createdWorkingFlows.reference = refPath;
  }

  // Payload flow
  if (options.payloadDataset) {
    const payloadPath = await writeWorkingShot(
      absPath,
      FLOW_SLUGS.PAYLOAD,
      nodeSlug,
      options.payloadDataset
    );
    createdWorkingFlows.payload = payloadPath;
  }

  // Operational config flow
  if (options.operationalConfig) {
    const cfgOpPath = await writeWorkingShot(
      absPath,
      FLOW_SLUGS.CONFIG_OPERATIONAL,
      nodeSlug,
      options.operationalConfig
    );
    createdWorkingFlows.configOp = cfgOpPath;
  }

  // Inheritable config flow
  if (options.inheritableConfig) {
    const cfgInhPath = await writeWorkingShot(
      absPath,
      FLOW_SLUGS.CONFIG_INHERITABLE,
      nodeSlug,
      options.inheritableConfig
    );
    createdWorkingFlows.configInh = cfgInhPath;
  }

  // --- Handle README ---

  let readmePath: string | undefined;

  if (options.readme) {
    // Inline README content
    readmePath = join(absPath, "README.md");
    await writeFile(readmePath, options.readme, "utf-8");
  } else if (options.readmePath) {
    // Copy README from file
    const readmeContent = await readFile(options.readmePath, "utf-8");
    readmePath = join(absPath, "README.md");
    await writeFile(readmePath, readmeContent, "utf-8");
  }

  // --- Generate index.html resource pages ---

  const indexPages = await generateResourcePages(
    absPath,
    nodeSlug,
    createdWorkingFlows,
    readmePath
  );

  // --- Return result ---

  return {
    nodePath: absPath,
    nodeSlug,
    createdWorkingFlows,
    readmePath,
    indexPages,
  };
}

/**
 * Write a _working shot for a flow
 * 
 * Parses RdfSource, debases to mesh-native JSON-LD, writes to _working directory.
 */
async function writeWorkingShot(
  nodePath: string,
  flowSlug: string,
  nodeSlug: string,
  source: RdfSource
): Promise<string> {
  // Create _working directory
  const workingDir = join(nodePath, flowSlug, SPECIAL_DIRS.WORKING);
  await mkdir(workingDir, { recursive: true });

  // Determine output filename
  const filename = getFlowFilename(nodeSlug, flowSlug);
  const outputPath = join(workingDir, filename);

  // Parse RdfSource (yields quads with absolute IRIs)
  const parsed = await parseRdfSource(source);

  // Compute target base for debasing (file:/// URL of output file)
  const targetBase = pathToFileURL(outputPath).href;

  // Serialize as mesh-native JSON-LD (no @base, relative IRIs)
  const jsonLd = await serializeRdf(parsed.quads, {
    targetBase,
    syntax: "jsonld",
    compact: false,
  });

  // Write to disk
  await writeFile(outputPath, jsonLd, "utf-8");

  return outputPath;
}

/**
 * Generate index.html resource pages
 * 
 * Creates HTML pages for:
 * - Node root
 * - _meta directory
 * - Each flow directory with _working shot
 * - Each _working shot directory
 */
async function generateResourcePages(
  nodePath: string,
  nodeSlug: string,
  createdWorkingFlows: CreateNodeResult["createdWorkingFlows"],
  readmePath?: string
): Promise<CreateNodeResult["indexPages"]> {
  const indexPages: CreateNodeResult["indexPages"] = {
    node: "",
    meta: "",
    flows: [],
    workingShots: [],
  };

  // Read README content if present
  let readmeHtml = "";
  if (readmePath) {
    try {
      const readmeContent = await readFile(readmePath, "utf-8");
      // Simple markdown-to-HTML (naive conversion for now)
      readmeHtml = markdownToHtml(readmeContent);
    } catch {
      // Ignore read errors
    }
  }

  // Node root index.html (represents the namespace)
  const nodeIndexPath = join(nodePath, "index.html");
  const nodeIndexContent = generateNodeIndexHtml(
    nodeSlug,
    readmeHtml
  );
  await writeFile(nodeIndexPath, nodeIndexContent, "utf-8");
  indexPages.node = nodeIndexPath;

  // _node-handle index.html (represents the mesh node itself)
  const handleIndexPath = join(nodePath, SPECIAL_DIRS.NODE_HANDLE, "index.html");
  const handleIndexContent = generateHandleIndexHtml(
    nodeSlug,
    createdWorkingFlows,
    !!readmePath
  );
  await writeFile(handleIndexPath, handleIndexContent, "utf-8");

  // _meta index.html
  const metaIndexPath = join(nodePath, FLOW_SLUGS.METADATA, "index.html");
  const metaIndexContent = generateFlowIndexHtml(FLOW_SLUGS.METADATA, nodeSlug, false);
  await writeFile(metaIndexPath, metaIndexContent, "utf-8");
  indexPages.meta = metaIndexPath;

  // _meta/_default index.html (special message for unweaved metadata)
  const metaDefaultIndexPath = join(nodePath, FLOW_SLUGS.METADATA, SPECIAL_DIRS.DEFAULT, "index.html");
  const metaDefaultIndexContent = generateMetaDefaultIndexHtml(nodeSlug);
  await writeFile(metaDefaultIndexPath, metaDefaultIndexContent, "utf-8");

  // Flow and _working shot index pages
  for (const [flowKey, workingPath] of Object.entries(createdWorkingFlows)) {
    if (!workingPath) continue;

    // Determine flow slug from key
    const flowSlug = flowKeyToSlug(flowKey);
    if (!flowSlug) continue;

    // Flow directory index.html
    const flowIndexPath = join(nodePath, flowSlug, "index.html");
    const flowIndexContent = generateFlowIndexHtml(flowSlug, nodeSlug, true);
    await writeFile(flowIndexPath, flowIndexContent, "utf-8");
    indexPages.flows.push(flowIndexPath);

    // _working shot directory index.html
    const workingDir = join(nodePath, flowSlug, SPECIAL_DIRS.WORKING);
    const workingShotIndexPath = join(workingDir, "index.html");
    const workingShotIndexContent = generateWorkingShotIndexHtml(flowSlug, nodeSlug);
    await writeFile(workingShotIndexPath, workingShotIndexContent, "utf-8");
    indexPages.workingShots.push(workingShotIndexPath);
  }

  return indexPages;
}

/**
 * Map flow key to flow slug
 */
function flowKeyToSlug(key: string): string | undefined {
  const map: Record<string, string> = {
    reference: FLOW_SLUGS.REFERENCE,
    payload: FLOW_SLUGS.PAYLOAD,
    configOp: FLOW_SLUGS.CONFIG_OPERATIONAL,
    configInh: FLOW_SLUGS.CONFIG_INHERITABLE,
  };
  return map[key];
}

/**
 * Generate node root index.html (namespace page)
 */
function generateNodeIndexHtml(
  nodeSlug: string,
  readmeHtml: string
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${nodeSlug} namespace</title>
</head>
<body>
  <h1>${nodeSlug} namespace</h1>
  
  ${readmeHtml ? `${readmeHtml}\n\n` : ""}
  <p><a href="_node-handle/">Node Handle →</a></p>
</body>
</html>`;
}

/**
 * Generate _node-handle index.html (node page with component list in tree format)
 */
function generateHandleIndexHtml(
  nodeSlug: string,
  createdWorkingFlows: CreateNodeResult["createdWorkingFlows"],
  hasReadme: boolean
): string {
  // Build tree structure
  const treeLines: string[] = [`_node-handle`];

  // Add README if present
  if (hasReadme) {
    treeLines.push(`<a href="../README.md">README.md</a>`);
  }

  // Add _meta with _default
  treeLines.push(`<a href="../_meta/">_meta/</a>`);
  treeLines.push(`  <a href="../_meta/_default/">_default/</a>`);

  // Add data flows
  for (const [key, path] of Object.entries(createdWorkingFlows)) {
    if (!path) continue;
    const slug = flowKeyToSlug(key);
    if (slug) {
      treeLines.push(`<a href="../${slug}/">${slug}/</a>`);
    }
  }

  const treeHtml = treeLines.join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mesh Node: ${nodeSlug}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
    h1 { color: #2563eb; }
    h2 { color: #4b5563; margin-top: 2rem; }
    pre { background: #f9fafb; padding: 1rem; border-radius: 0.5rem; line-height: 1.6; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Mesh Node: ${nodeSlug}</h1>
  
  <h2>Components</h2>
  <pre>${treeHtml}</pre>
  
  <p><a href="../">← Back to namespace</a></p>
</body>
</html>`;
}

/**
 * Generate flow directory index.html
 */
function generateFlowIndexHtml(
  flowSlug: string,
  nodeSlug: string,
  hasWorking: boolean
): string {
  const workingLink = hasWorking
    ? `<li><a href="_working/">_working/</a> (working shot)</li>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flow: ${flowSlug}</title>
</head>
<body>
  <h1>Flow: ${flowSlug}</h1>
  <p>Node: <a href="../">${nodeSlug}</a></p>
  
  <h2>Shots</h2>
  <ul>
    ${workingLink}
  </ul>
</body>
</html>`;
}

/**
 * Generate _working shot directory index.html
 */
function generateWorkingShotIndexHtml(flowSlug: string, nodeSlug: string): string {
  const filename = getFlowFilename(nodeSlug, flowSlug);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Working Shot: ${flowSlug}</title>
</head>
<body>
  <h1>Working Shot</h1>
  <p>Flow: <a href="../">${flowSlug}</a></p>
  <p>Node: <a href="../../">${nodeSlug}</a></p>
  
  <h2>Distribution</h2>
  <ul>
    <li><a href="${filename}">${filename}</a></li>
  </ul>
</body>
</html>`;
}

/**
 * Generate generic directory index.html
 */
function generateGenericDirIndexHtml(title: string, nodeSlug: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <h1>${title}</h1>
  <p>Node: <a href="../">${nodeSlug}</a></p>
</body>
</html>`;
}

/**
 * Generate shot directory index.html (for _default, _working, etc.)
 */
function generateShotDirIndexHtml(
  shotName: string,
  flowSlug: string,
  nodeSlug: string,
  hasDistributions: boolean
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shot: ${shotName}</title>
</head>
<body>
  <h1>Shot: ${shotName}</h1>
  <p>Flow: <a href="../">${flowSlug}</a></p>
  <p>Node: <a href="../../">${nodeSlug}</a></p>
  
  ${hasDistributions ? `<h2>Distributions</h2>
  <p>No distributions yet (created by weaves)</p>` : `<p>Empty directory (snapshots created by weaves)</p>`}
</body>
</html>`;
}

/**
 * Generate _meta/_default index.html (special page for unweaved metadata)
 */
function generateMetaDefaultIndexHtml(nodeSlug: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Metadata DefaultShot</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
    h1 { color: #2563eb; }
    p { line-height: 1.6; color: #4b5563; }
    .info { background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Metadata DefaultShot</h1>
  <p>Node: <a href="../../">${nodeSlug}</a></p>
  
  <div class="info">
    <p><strong>Note:</strong> This metadata DefaultShot hasn't been created yet. Try weaving.</p>
  </div>
  
  <p><a href="../">← Back to _meta flow</a></p>
</body>
</html>`;
}

/**
 * Convert markdown to HTML using markdown-it
 *
 * Supports full markdown syntax including:
 * - Headings (# ## ### etc.)
 * - Paragraphs
 * - Lists (ordered and unordered)
 * - Links and images
 * - Code blocks and inline code
 * - Blockquotes
 * - Tables
 * - And more
 */
function markdownToHtml(markdown: string): string {
  return md.render(markdown);
}
