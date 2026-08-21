export type ShaclSeverity = "Info" | "Warning" | "Violation";

export interface NormalizedShaclResult {
  severity: ShaclSeverity;
  focusNode: string;
  resultPath: string | null;
  constraintComponent: string;
  messageKey: string;
}

export interface ShaclCase {
  id: string;
  dataFile: string;
  expectedConforms: boolean;
  expectedMaxSeverity: ShaclSeverity | null;
  expectedResults: NormalizedShaclResult[];
}

export interface ShaclManifest {
  schema: "sflo.shacl-content-digest-cases.v1";
  focusNamespace: string;
  messageKeys: { key: string; contains: string }[];
  cases: ShaclCase[];
}

export interface ShaclCaseReceipt {
  caseId: string;
  rawConforms: boolean;
  conforms: boolean;
  maxSeverity: ShaclSeverity | null;
  results: NormalizedShaclResult[];
}

export interface ShaclReceiptBundle {
  schema: "sflo.shacl-conformance-receipts.v1";
  engine: {
    name: string;
    version: string;
    adapter: string;
  };
  sfloCommit: string;
  command: string;
  graphProfile: {
    data: "ontology-union-case";
    shapes: "semantic-flow-core-shacl.ttl";
    inference: "none";
    warnings: "reported";
    network: "disabled";
  };
  cases: ShaclCaseReceipt[];
}

const SEVERITY_RANK: Record<ShaclSeverity, number> = {
  Info: 1,
  Warning: 2,
  Violation: 3,
};

export async function loadShaclManifest(
  root = Deno.cwd(),
): Promise<ShaclManifest> {
  const manifest = JSON.parse(
    await Deno.readTextFile(
      `${root}/tests/shacl/content-digest/cases.json`,
    ),
  ) as ShaclManifest;
  if (manifest.schema !== "sflo.shacl-content-digest-cases.v1") {
    throw new Error(`Unsupported SHACL case schema: ${manifest.schema}`);
  }
  return manifest;
}

export async function currentGitCommit(root = Deno.cwd()): Promise<string> {
  const command = new Deno.Command("git", {
    args: ["rev-parse", "HEAD"],
    cwd: root,
    stdout: "piped",
    stderr: "piped",
  });
  const output = await command.output();
  if (!output.success) {
    throw new Error(
      `Could not resolve SFLO commit: ${
        new TextDecoder().decode(output.stderr)
      }`,
    );
  }
  return new TextDecoder().decode(output.stdout).trim();
}

export function messageKeyFor(
  manifest: ShaclManifest,
  messages: readonly string[],
): string {
  const matches = manifest.messageKeys.filter(({ contains }) =>
    messages.some((message) => message.includes(contains))
  );
  if (matches.length !== 1) {
    throw new Error(
      `Expected one message-key match, found ${matches.length}: ${
        JSON.stringify(messages)
      }`,
    );
  }
  return matches[0]!.key;
}

export function localName(iri: string | undefined): string {
  if (iri === undefined || iri.length === 0) return "unknown";
  const index = Math.max(iri.lastIndexOf("#"), iri.lastIndexOf("/"));
  return iri.slice(index + 1);
}

export function sortAndDeduplicateResults(
  results: readonly NormalizedShaclResult[],
): NormalizedShaclResult[] {
  const byIdentity = new Map<string, NormalizedShaclResult>();
  for (const result of results) {
    byIdentity.set(JSON.stringify(result), result);
  }
  return [...byIdentity.values()].sort((left, right) =>
    JSON.stringify(left).localeCompare(JSON.stringify(right))
  );
}

export function maxSeverity(
  results: readonly NormalizedShaclResult[],
): ShaclSeverity | null {
  let maximum: ShaclSeverity | null = null;
  for (const { severity } of results) {
    if (
      maximum === null || SEVERITY_RANK[severity] > SEVERITY_RANK[maximum]
    ) {
      maximum = severity;
    }
  }
  return maximum;
}

export function assertReceiptMatchesCase(
  receipt: ShaclCaseReceipt,
  expected: ShaclCase,
): void {
  const expectedResults = sortAndDeduplicateResults(expected.expectedResults);
  if (receipt.caseId !== expected.id) {
    throw new Error(
      `Receipt case ${receipt.caseId} does not match ${expected.id}`,
    );
  }
  if (
    receipt.rawConforms !== expected.expectedConforms ||
    receipt.conforms !== expected.expectedConforms
  ) {
    throw new Error(
      `${expected.id}: expected conforms=${expected.expectedConforms}, raw=${receipt.rawConforms}, normalized=${receipt.conforms}`,
    );
  }
  if (receipt.maxSeverity !== expected.expectedMaxSeverity) {
    throw new Error(
      `${expected.id}: expected max severity ${expected.expectedMaxSeverity}, got ${receipt.maxSeverity}`,
    );
  }
  if (JSON.stringify(receipt.results) !== JSON.stringify(expectedResults)) {
    throw new Error(
      `${expected.id}: normalized results differ\nexpected=${
        JSON.stringify(expectedResults, null, 2)
      }\nactual=${JSON.stringify(receipt.results, null, 2)}`,
    );
  }
}

export function receiptBundle(
  options: Omit<ShaclReceiptBundle, "schema" | "graphProfile">,
): ShaclReceiptBundle {
  return {
    schema: "sflo.shacl-conformance-receipts.v1",
    graphProfile: {
      data: "ontology-union-case",
      shapes: "semantic-flow-core-shacl.ttl",
      inference: "none",
      warnings: "reported",
      network: "disabled",
    },
    ...options,
  };
}

export function outputPath(args: readonly string[]): string | undefined {
  const normalized = args[0] === "--" ? args.slice(1) : args;
  if (normalized.length === 0) return undefined;
  if (
    normalized.length === 2 && normalized[0] === "--output" &&
    normalized[1]!.length > 0
  ) {
    return normalized[1];
  }
  throw new Error("Usage: --output <receipt.json>");
}

export async function emitReceiptBundle(
  bundle: ShaclReceiptBundle,
  path: string | undefined,
): Promise<void> {
  const rendered = `${JSON.stringify(bundle, null, 2)}\n`;
  if (path === undefined) {
    console.log(
      `Executed ${bundle.cases.length} SHACL fixtures with ${bundle.engine.name} ${bundle.engine.version}.`,
    );
    return;
  }
  await Deno.writeTextFile(path, rendered);
  console.log(
    `Wrote ${bundle.cases.length} ${bundle.engine.name} receipts to ${path}.`,
  );
}

export function semanticCaseReceipt(
  receipt: ShaclCaseReceipt,
): ShaclCaseReceipt {
  return {
    ...receipt,
    results: sortAndDeduplicateResults(receipt.results),
  };
}
