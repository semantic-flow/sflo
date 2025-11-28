#!/usr/bin/env node
/**
 * Create Node Runner Script
 * 
 * Simple command-line script to create a new mesh node.
 * 
 * Usage:
 *   node scripts/create-node.js <nodeTargetPath> [--allow-nonempty] [--readme <file>]
 * 
 * Example:
 *   node scripts/create-node.js ./test-node
 *   node scripts/create-node.js ./test-node --allow-nonempty
 *   node scripts/create-node.js ./test-node --readme ./README.md
 * 
 * See: task.2025-11-28_refine-createnode
 */

import { createNode } from "../shared/core/dist/index.js";

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log(`
Create Node - Initialize a new Semantic Flow mesh node

Usage:
  node scripts/create-node.js <nodeTargetPath> [options]

Arguments:
  nodeTargetPath         Path to the node directory (required)

Options:
  --allow-nonempty      Allow initialization in non-empty directory
  --readme <path>       Path to README.md file to include
  --help, -h            Show this help message

Examples:
  node scripts/create-node.js ./my-node
  node scripts/create-node.js ./existing-dir --allow-nonempty
  node scripts/create-node.js ./my-node --readme ./README.md
`);
  process.exit(0);
}

const nodeTargetPath = args[0];
const allowNonEmpty = args.includes("--allow-nonempty");

// Parse --readme option
let readmePath: string | undefined;
const readmeIndex = args.indexOf("--readme");
if (readmeIndex !== -1 && args[readmeIndex + 1]) {
  readmePath = args[readmeIndex + 1];
}

// Run createNode
console.log(`Creating node at: ${nodeTargetPath}`);
console.log(`Options:`);
console.log(`  allowNonEmpty: ${allowNonEmpty}`);
if (readmePath) {
  console.log(`  readmePath:    ${readmePath}`);
}
console.log();

try {
  const result = await createNode(nodeTargetPath, {
    allowNonEmpty,
    readmePath,
  });

  console.log("✅ Node created successfully!");
  console.log();
  console.log("Details:");
  console.log(`  Node path:  ${result.nodePath}`);
  console.log(`  Node slug:  ${result.nodeSlug}`);
  console.log();

  console.log("Structure created:");
  console.log(`  _node-handle/  (node handle)`);
  console.log(`  _meta/_default/  (empty, no RDF until first weave)`);

  if (result.readmePath) {
    console.log(`  README.md  (node readme)`);
  }
  console.log();

  // Show _working flows if any were created
  const workingFlows = result.createdWorkingFlows;
  const hasWorkingFlows = Object.values(workingFlows).some(path => path);

  if (hasWorkingFlows) {
    console.log("Working shots created:");
    if (workingFlows.reference) {
      console.log(`  _ref/_working/  (reference data)`);
    }
    if (workingFlows.payload) {
      console.log(`  _payload/_working/  (payload data)`);
    }
    if (workingFlows.configOp) {
      console.log(`  _cfg-op/_working/  (operational config)`);
    }
    if (workingFlows.configInh) {
      console.log(`  _cfg-inh/_working/  (inheritable config)`);
    }
    console.log();
  }

  // Show index.html pages
  console.log("Resource pages (index.html) created:");
  console.log(`  ${result.indexPages.node}  (node root)`);
  console.log(`  ${result.indexPages.meta}  (_meta)`);
  for (const flowIndexPath of result.indexPages.flows) {
    console.log(`  ${flowIndexPath}  (flow directory)`);
  }
  for (const shotIndexPath of result.indexPages.workingShots) {
    console.log(`  ${shotIndexPath}  (_working shot)`);
  }
  console.log();

  console.log("Next steps:");
  console.log(`  1. Review working shots in the node directory`);
  console.log(`  2. Run a weave operation to create snapshots (v1, _default)`);
  console.log(`  3. Publish the node (weaves will generate full metadata)`);

  process.exit(0);
} catch (error) {
  console.error("❌ Failed to create node:");
  console.error();

  if (error instanceof Error) {
    console.error(`  ${error.message}`);

    if (process.env.DEBUG) {
      console.error();
      console.error("Stack trace:");
      console.error(error.stack);
    }
  } else {
    console.error(`  ${String(error)}`);
  }

  process.exit(1);
}
