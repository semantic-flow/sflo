/**
 * Create Knop Operation
 *
 * Scaffolds a new mesh knop with _working slices and resource pages.
 * Does NOT create slices - those are written by weaves.
 *
 * See: task.2025-11-28_refine-createknop
 */

import { resolve, join, basename } from "path";
import { mkdir, writeFile, readFile } from "fs/promises";
import { pathToFileURL } from "url";
import MarkdownIt from "markdown-it";
import { parseRdfSource } from "../rdf/parser.js";
import { serializeRdf } from "../rdf/serializer.js";
import {
  isKnopInitialized,
  isDirectoryNonEmpty,
  deriveKnopSlug,
} from "./scaffold.js";
import { FLOW_SLUGS, SPECIAL_DIRS, getFlowFilename } from "./flows.js";
import type { CreateKnopOptions, CreateKnopResult } from "./types.js";
import type { RdfSource } from "../rdf/types.js";

// Initialize markdown-it instance
const md = new MarkdownIt({
  html: true,        // Enable HTML tags in source
  linkify: true,     // Auto-convert URLs to links
  typographer: true  // Enable smart quotes and other typographic replacements
});

/**
 * Create a new mesh knop
 * 
 * Scaffolds directory structure and writes _working slices.
 * Does NOT write other slices (v1, _default) - those are created by weaves.
 * 
 * Creates:
 * - _knop-handle/ directory
 * - _meta/_default/ (empty, no RDF)
 * - _working slices for flows where RdfSource inputs provided
 * - README.md if content provided
 * - index.html resource pages
 * 
 * Safety:
 * - Fails if knop already initialized
 * - Fails/warns if directory non-empty (unless allowNonEmpty=true)
 * 
 * @param knopTargetPath - Path to knop directory (created if needed)
 * @param options - Creation options
 * @returns Result with paths to created resources
 */
export async function createKnop(
  knopTargetPath: string,
  options: CreateKnopOptions = {}
): Promise<CreateKnopResult> {
  const absPath = resolve(knopTargetPath);
  const knopSlug = deriveKnopSlug(absPath);

  // --- Safety checks ---

  if (await isKnopInitialized(absPath)) {
    throw new Error(
      `Knop already initialized at ${absPath}. ` +
      `Found ${SPECIAL_DIRS.KNOP_HANDLE} or ${FLOW_SLUGS.METADATA} directory.`
    );
  }

  if (!options.allowNonEmpty && await isDirectoryNonEmpty(absPath)) {
    throw new Error(
      `Directory ${absPath} is non-empty. ` +
      `Use --allow-nonempty option to override this safety check.`
    );
  }

  // --- Create base knop structure ---

  // Ensure knop directory exists
  await mkdir(absPath, { recursive: true });

  // Create _knop-handle (minimal stub)
  const handleDir = join(absPath, SPECIAL_DIRS.KNOP_HANDLE);
  await mkdir(handleDir, { recursive: true });

  // Create _meta/_default (empty - no RDF until first weave)
  const metaDefaultDir = join(absPath, FLOW_SLUGS.METADATA, SPECIAL_DIRS.DEFAULT);
  await mkdir(metaDefaultDir, { recursive: true });

  // --- Write _working slices for provided inputs ---

  const createdFlows: CreateKnopResult["createdFlows"] = {};

  // Reference flow
  if (options.referenceDataset) {
    const refPath = await writeWorkingSlice(
      absPath,
      FLOW_SLUGS.REFERENCE,
      knopSlug,
      options.referenceDataset
    );
    createdFlows.reference = refPath;
  }

  // Payload flow
  if (options.payloadDataset) {
    const payloadPath = await writeWorkingSlice(
      absPath,
      FLOW_SLUGS.PAYLOAD,
      knopSlug,
      options.payloadDataset
    );
    createdFlows.payload = payloadPath;
  }

  // Local config flow
  if (options.localConfig) {
    const cfgLocalPath = await writeWorkingSlice(
      absPath,
      FLOW_SLUGS.CONFIG_LOCAL,
      knopSlug,
      options.localConfig
    );
    createdFlows.configLocal = cfgLocalPath;
  }

  // Inheritable config flow
  if (options.inheritableConfig) {
    const cfgInhPath = await writeWorkingSlice(
      absPath,
      FLOW_SLUGS.CONFIG_INHERITABLE,
      knopSlug,
      options.inheritableConfig
    );
    createdFlows.configInh = cfgInhPath;
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
    knopSlug,
    createdFlows,
    readmePath
  );

  // --- Return result ---

  return {
    knopPath: absPath,
    knopSlug,
    createdFlows,
    readmePath,
    indexPages,
  };
}

/**
 * Write a _working slice for a flow
 *
 * Parses RdfSource, debases to mesh-native JSON-LD, writes to _working directory.
 */
async function writeWorkingSlice(
  knopPath: string,
  flowSlug: string,
  knopSlug: string,
  source: RdfSource
): Promise<string> {
  // Create _working directory
  const workingDir = join(knopPath, flowSlug, SPECIAL_DIRS.WORKING);
  await mkdir(workingDir, { recursive: true });

  // Determine output filename
  const filename = getFlowFilename(knopSlug, flowSlug);
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
 * - Knop root
 * - _meta directory
 * - Each flow directory with _working slice
 * - Each _working slice directory
 */
async function generateResourcePages(
  knopPath: string,
  knopSlug: string,
  createdFlows: CreateKnopResult["createdFlows"],
  readmePath?: string
): Promise<CreateKnopResult["indexPages"]> {
  const indexPages: CreateKnopResult["indexPages"] = {
    knop: "",
    meta: "",
    flows: [],
    workingSlices: [],
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

  // Knop root index.html (represents the namespace)
  const knopIndexPath = join(knopPath, "index.html");
  const knopIndexContent = generateKnopIndexHtml(
    knopSlug,
    readmeHtml
  );
  await writeFile(knopIndexPath, knopIndexContent, "utf-8");
  indexPages.knop = knopIndexPath;

  // _knop-handle index.html (represents the mesh knop itself)
  const handleIndexPath = join(knopPath, SPECIAL_DIRS.KNOP_HANDLE, "index.html");
  const handleIndexContent = generateHandleIndexHtml(
    knopSlug,
    createdFlows,
    !!readmePath
  );
  await writeFile(handleIndexPath, handleIndexContent, "utf-8");

  // _meta index.html
  const metaIndexPath = join(knopPath, FLOW_SLUGS.METADATA, "index.html");
  const metaIndexContent = generateFlowIndexHtml(FLOW_SLUGS.METADATA, knopSlug, false);
  await writeFile(metaIndexPath, metaIndexContent, "utf-8");
  indexPages.meta = metaIndexPath;

  // _meta/_default index.html (special message for unweaved metadata)
  const metaDefaultIndexPath = join(knopPath, FLOW_SLUGS.METADATA, SPECIAL_DIRS.DEFAULT, "index.html");
  const metaDefaultIndexContent = generateMetaDefaultIndexHtml(knopSlug);
  await writeFile(metaDefaultIndexPath, metaDefaultIndexContent, "utf-8");

  // Flow and _working slice index pages
  for (const [flowKey, workingPath] of Object.entries(createdFlows)) {
    if (!workingPath) continue;

    // Determine flow slug from key
    const flowSlug = flowKeyToSlug(flowKey);
    if (!flowSlug) continue;

    // Flow directory index.html
    const flowIndexPath = join(knopPath, flowSlug, "index.html");
    const flowIndexContent = generateFlowIndexHtml(flowSlug, knopSlug, true);
    await writeFile(flowIndexPath, flowIndexContent, "utf-8");
    indexPages.flows.push(flowIndexPath);

    // _working slice directory index.html
    const workingDir = join(knopPath, flowSlug, SPECIAL_DIRS.WORKING);
    const workingSliceIndexPath = join(workingDir, "index.html");
    const workingSliceIndexContent = generateWorkingSliceIndexHtml(flowSlug, knopSlug);
    await writeFile(workingSliceIndexPath, workingSliceIndexContent, "utf-8");
    indexPages.workingSlices.push(workingSliceIndexPath);
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
    configLocal: FLOW_SLUGS.CONFIG_LOCAL,
    configInh: FLOW_SLUGS.CONFIG_INHERITABLE,
  };
  return map[key];
}

/**
 * Generate knop root index.html (namespace page)
 */
function generateKnopIndexHtml(
  knopSlug: string,
  readmeHtml: string
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${knopSlug} namespace</title>
</head>
<body>
  <h1>${knopSlug} namespace</h1>
  
  ${readmeHtml ? `${readmeHtml}\n\n` : ""}
  <p><a href="_knop-handle/">Knop Handle →</a></p>
</body>
</html>`;
}

/**
 * Generate _knop-handle index.html (knop page with component list in tree format)
 */
function generateHandleIndexHtml(
  knopSlug: string,
  createdFlows: CreateKnopResult["createdFlows"],
  hasReadme: boolean
): string {
  // Build tree structure
  const treeLines: string[] = [`_knop-handle`];

  // Add README if present
  if (hasReadme) {
    treeLines.push(`<a href="../README.md">README.md</a>`);
  }

  // Add _meta with _default
  treeLines.push(`<a href="../_meta/">_meta/</a>`);
  treeLines.push(`  <a href="../_meta/_default/">_default/</a>`);

  // Add data flows
  for (const [key, path] of Object.entries(createdFlows)) {
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
  <title>mesh knop: ${knopSlug}</title>
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
  <h1>mesh knop: ${knopSlug}</h1>
  
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
  knopSlug: string,
  hasWorking: boolean
): string {
  const workingLink = hasWorking
    ? `<li><a href="_working/">_working/</a> (working slice)</li>`
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
  <p>Knop: <a href="../">${knopSlug}</a></p>
  
  <h2>Slices</h2>
  <ul>
    ${workingLink}
  </ul>
</body>
</html>`;
}

/**
 * Generate _working slice directory index.html
 */
function generateWorkingSliceIndexHtml(flowSlug: string, knopSlug: string): string {
  const filename = getFlowFilename(knopSlug, flowSlug);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Working Slice: ${flowSlug}</title>
</head>
<body>
  <h1>Working Slice</h1>
  <p>Flow: <a href="../">${flowSlug}</a></p>
  <p>Knop: <a href="../../">${knopSlug}</a></p>
  
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
function generateGenericDirIndexHtml(title: string, knopSlug: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <h1>${title}</h1>
  <p>Knop: <a href="../">${knopSlug}</a></p>
</body>
</html>`;
}

/**
 * Generate slice directory index.html (for _default, _working, etc.)
 */
function generateSliceDirIndexHtml(
  sliceName: string,
  flowSlug: string,
  knopSlug: string,
  hasDistributions: boolean
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Slice: ${sliceName}</title>
</head>
<body>
  <h1>Slice: ${sliceName}</h1>
  <p>Flow: <a href="../">${flowSlug}</a></p>
  <p>Knop: <a href="../../">${knopSlug}</a></p>
  
  ${hasDistributions ? `<h2>Distributions</h2>
  <p>No distributions yet (created by weaves)</p>` : `<p>Empty directory (slices created by weaves)</p>`}
</body>
</html>`;
}

/**
 * Generate _meta/_default index.html (special page for unweaved metadata)
 */
function generateMetaDefaultIndexHtml(knopSlug: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Metadata DefaultSlice</title>
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
  <h1>Metadata DefaultSlice</h1>
  <p>Knop: <a href="../../">${knopSlug}</a></p>
  
  <div class="info">
    <p><strong>Note:</strong> This metadata DefaultSlice hasn't been created yet. Try weaving.</p>
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
