#!/usr/bin/env knop
/**
 * Create Knop Runner Script
 * 
 * Simple command-line script to create a new mesh knop.
 * 
 * Usage:
 *   knop scripts/create-knop.js <knopTargetPath> [--allow-nonempty] [--readme <file>]
 * 
 * Example:
 *   knop scripts/create-knop.js ./test-knop
 *   knop scripts/create-knop.js ./test-knop --allow-nonempty
 *   knop scripts/create-knop.js ./test-knop --readme ./README.md
 * 
 * See: task.2025-11-28_refine-createknop
 */

import { createKnop } from "../shared/core/dist/index.js";

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log(`
Create Knop - Initialize a new Semantic Flow mesh knop

Usage:
  knop scripts/create-knop.js <knopTargetPath> [options]

Arguments:
  knopTargetPath         Path to the knop directory (required)

Options:
  --allow-nonempty      Allow initialization in non-empty directory
  --readme <path>       Path to README.md file to include
  --help, -h            Show this help message

Examples:
  knop scripts/create-knop.js ./my-knop
  knop scripts/create-knop.js ./existing-dir --allow-nonempty
  knop scripts/create-knop.js ./my-knop --readme ./README.md
`);
  process.exit(0);
}

const knopTargetPath = args[0];
const allowNonEmpty = args.includes("--allow-nonempty");

// Parse --readme option
let readmePath: string | undefined;
const readmeIndex = args.indexOf("--readme");
if (readmeIndex !== -1 && args[readmeIndex + 1]) {
  readmePath = args[readmeIndex + 1];
}

// Run createKnop
console.log(`Creating knop at: ${knopTargetPath}`);
console.log(`Options:`);
console.log(`  allowNonEmpty: ${allowNonEmpty}`);
if (readmePath) {
  console.log(`  readmePath:    ${readmePath}`);
}
console.log();

try {
  const result = await createKnop(knopTargetPath, {
    allowNonEmpty,
    readmePath,
  });

  console.log("✅ Knop created successfully!");
  console.log();
  console.log("Details:");
  console.log(`  Knop path:  ${result.knopPath}`);
  console.log(`  Knop slug:  ${result.knopSlug}`);
  console.log();

  console.log("Structure created:");
  console.log(`  _knop-handle/  (knop handle)`);
  console.log(`  _meta/_default/  (empty, no RDF until first weave)`);

  if (result.readmePath) {
    console.log(`  README.md  (knop readme)`);
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
  console.log(`  ${result.indexPages.knop}  (knop root)`);
  console.log(`  ${result.indexPages.meta}  (_meta)`);
  for (const flowIndexPath of result.indexPages.flows) {
    console.log(`  ${flowIndexPath}  (flow directory)`);
  }
  for (const shotIndexPath of result.indexPages.workingShots) {
    console.log(`  ${shotIndexPath}  (_working shot)`);
  }
  console.log();

  console.log("Next steps:");
  console.log(`  1. Review working shots in the knop directory`);
  console.log(`  2. Run a weave operation to create slices (v1, _default)`);
  console.log(`  3. Publish the knop (weaves will generate full metadata)`);

  process.exit(0);
} catch (error) {
  console.error("❌ Failed to create knop:");
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
