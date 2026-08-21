import type {
  ShaclCaseReceipt,
  ShaclReceiptBundle,
} from "./shacl_conformance.ts";

function comparable(cases: readonly ShaclCaseReceipt[]): string {
  return JSON.stringify(cases);
}

async function main(): Promise<void> {
  const paths = Deno.args[0] === "--" ? Deno.args.slice(1) : Deno.args;
  if (paths.length < 2) {
    throw new Error(
      "Usage: deno task conformance:compare -- <receipt.json> <receipt.json> [...]",
    );
  }
  const bundles = await Promise.all(
    paths.map(async (path) =>
      JSON.parse(await Deno.readTextFile(path)) as ShaclReceiptBundle
    ),
  );
  for (const bundle of bundles) {
    if (bundle.schema !== "sflo.shacl-conformance-receipts.v1") {
      throw new Error(`Unsupported receipt schema from ${bundle.engine.name}`);
    }
  }
  const commits = new Set(bundles.map(({ sfloCommit }) => sfloCommit));
  if (commits.size !== 1) {
    throw new Error(
      `Receipt SFLO commits differ: ${[...commits].join(", ")}`,
    );
  }
  const engineIdentities = bundles.map(({ engine }) => JSON.stringify(engine));
  if (new Set(engineIdentities).size !== engineIdentities.length) {
    throw new Error("Receipt bundles contain duplicate engine identities");
  }
  const graphProfiles = new Set(
    bundles.map(({ graphProfile }) => JSON.stringify(graphProfile)),
  );
  if (graphProfiles.size !== 1) {
    throw new Error("Receipt graph profiles differ");
  }
  const baseline = comparable(bundles[0]!.cases);
  for (const bundle of bundles.slice(1)) {
    if (comparable(bundle.cases) !== baseline) {
      throw new Error(
        `Normalized SHACL receipts disagree: ${
          bundles[0]!.engine.name
        } vs ${bundle.engine.name}`,
      );
    }
  }
  console.log(
    `Compared ${bundles.length} engines across ${
      bundles[0]!.cases.length
    } cases at ${bundles[0]!.sfloCommit}; all normalized receipts agree.`,
  );
}

if (import.meta.main) await main();
