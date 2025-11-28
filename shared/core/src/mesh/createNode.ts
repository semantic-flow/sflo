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

  // Node root index.html
  const nodeIndexPath = join(nodePath, "index.html");
  const nodeIndexContent = generateNodeIndexHtml(
    nodeSlug,
    createdWorkingFlows,
    readmeHtml
  );
  await writeFile(nodeIndexPath, nodeIndexContent, "utf-8");
  indexPages.node = nodeIndexPath;

  // _meta index.html
  const metaIndexPath = join(nodePath, FLOW_SLUGS.METADATA, "index.html");
  const metaIndexContent = generateFlowIndexHtml(FLOW_SLUGS.METADATA, nodeSlug, false);
  await writeFile(metaIndexPath, metaIndexContent, "utf-8");
  indexPages.meta = metaIndexPath;

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
 * Generate node root index.html
 */
function generateNodeIndexHtml(
  nodeSlug: string,
  createdWorkingFlows: CreateNodeResult["createdWorkingFlows"],
  readmeHtml: string
): string {
  const flowLinks = Object.entries(createdWorkingFlows)
    .filter(([, path]) => path)
    .map(([key]) => {
      const slug = flowKeyToSlug(key);
      return `<li><a href="${slug}/">${slug}/</a></li>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Node: ${nodeSlug}</title>
</head>
<body>
  <h1>Mesh Node: ${nodeSlug}</h1>
  
  <h2>Flows</h2>
  <ul>
    <li><a href="_meta/">_meta/</a> (metadata flow)</li>
${flowLinks}
  </ul>

  ${readmeHtml ? `<h2>About</h2>\n${readmeHtml}` : ""}
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
 * Naive markdown to HTML converter
 * 
 * Converts:
 * - # Heading → <h1>
 * - ## Heading → <h2>
 * - ### Heading → <h3>
 * - Paragraphs (blank line separated)
 */
function markdownToHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const html: string[] = [];
  let inParagraph = false;

  for (let line of lines) {
    line = line.trim();

    if (!line) {
      if (inParagraph) {
        html.push("</p>");
        inParagraph = false;
      }
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      if (inParagraph) {
        html.push("</p>");
        inParagraph = false;
      }
      html.push(`<h3>${line.slice(4)}</h3>`);
    } else if (line.startsWith("## ")) {
      if (inParagraph) {
        html.push("</p>");
        inParagraph = false;
      }
      html.push(`<h2>${line.slice(3)}</h2>`);
    } else if (line.startsWith("# ")) {
      if (inParagraph) {
        html.push("</p>");
        inParagraph = false;
      }
      html.push(`<h1>${line.slice(2)}</h1>`);
    } else {
      // Regular paragraph text
      if (!inParagraph) {
        html.push("<p>");
        inParagraph = true;
      } else {
        html.push("<br>");
      }
      html.push(line);
    }
  }

  if (inParagraph) {
    html.push("</p>");
  }

  return html.join("\n");
}
