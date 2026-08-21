import { DataFactory, Parser, type Quad, Store, type Term } from "n3";
import {
  assertReceiptMatchesCase,
  currentGitCommit,
  emitReceiptBundle,
  loadShaclManifest,
  localName,
  maxSeverity,
  messageKeyFor,
  type NormalizedShaclResult,
  outputPath,
  receiptBundle,
  semanticCaseReceipt,
  type ShaclCaseReceipt,
} from "./shacl_conformance.ts";

const ROOT = new URL("../", import.meta.url).pathname.replace(/\/$/, "");
const SHAPES_PATH = `${ROOT}/semantic-flow-core-shacl.ttl`;
const ONTOLOGY_PATH = `${ROOT}/semantic-flow-core-ontology.ttl`;
const CASES_ROOT = `${ROOT}/tests/shacl/content-digest`;
const EXPECTED_JENA_VERSION = "6.2.0";
const SH = "http://www.w3.org/ns/shacl#";

function values(
  graph: Store,
  subject: Term,
  predicate: string,
): Term[] {
  return graph.getQuads(
    subject,
    DataFactory.namedNode(predicate),
    null,
    null,
  ).map((quad: Quad) => quad.object);
}

function one(
  graph: Store,
  subject: Term,
  predicate: string,
): Term | undefined {
  return values(graph, subject, predicate)[0];
}

async function jenaVersion(): Promise<string> {
  const output = await new Deno.Command("shacl", {
    args: ["--version"],
    stdout: "piped",
    stderr: "piped",
  }).output();
  const rendered = `${new TextDecoder().decode(output.stdout)}\n${
    new TextDecoder().decode(output.stderr)
  }`;
  const version = rendered.match(/Apache Jena SHACL version ([0-9.]+)/)?.[1];
  if (!output.success || version === undefined) {
    throw new Error(
      `Could not determine Apache Jena SHACL version: ${rendered}`,
    );
  }
  if (version !== EXPECTED_JENA_VERSION) {
    throw new Error(
      `Apache Jena SHACL ${EXPECTED_JENA_VERSION} is required; found ${version}`,
    );
  }
  return version;
}

async function validateWithJena(
  dataPath: string,
): Promise<{ rawConforms: boolean; graph: Store }> {
  const output = await new Deno.Command("shacl", {
    args: ["validate", "--shapes", SHAPES_PATH, "--data", dataPath],
    stdout: "piped",
    stderr: "piped",
  }).output();
  if (!output.success) {
    throw new Error(
      `Jena SHACL failed: ${new TextDecoder().decode(output.stderr)}`,
    );
  }
  const graph = new Store(
    new Parser({ format: "text/turtle" }).parse(
      new TextDecoder().decode(output.stdout),
    ),
  );
  const conforms = graph.getQuads(
    null,
    DataFactory.namedNode(`${SH}conforms`),
    null,
    null,
  )[0]?.object.value;
  if (conforms !== "true" && conforms !== "false") {
    throw new Error("Jena SHACL report omitted sh:conforms");
  }
  return { rawConforms: conforms === "true", graph };
}

function normalizeResults(
  graph: Store,
  focusNamespace: string,
  manifest: Awaited<ReturnType<typeof loadShaclManifest>>,
): NormalizedShaclResult[] {
  const resultNodes = graph.getQuads(
    null,
    DataFactory.namedNode(`${SH}result`),
    null,
    null,
  ).map((quad: Quad) => quad.object);
  return resultNodes.flatMap((result: Term) => {
    const focus = one(graph, result, `${SH}focusNode`)?.value;
    if (focus === undefined || !focus.startsWith(focusNamespace)) return [];
    const severity = one(graph, result, `${SH}resultSeverity`)?.value;
    const component = one(
      graph,
      result,
      `${SH}sourceConstraintComponent`,
    )?.value;
    if (severity === undefined || component === undefined) {
      throw new Error(
        `Jena result ${result.value} omitted severity or component`,
      );
    }
    const messages = values(graph, result, `${SH}resultMessage`).map((term) =>
      term.value
    );
    const path = one(graph, result, `${SH}resultPath`);
    return [{
      severity: localName(severity) as NormalizedShaclResult["severity"],
      focusNode: focus,
      resultPath: path?.termType === "NamedNode" ? path.value : null,
      constraintComponent: localName(component),
      messageKey: messageKeyFor(manifest, messages),
    }];
  });
}

async function main(): Promise<void> {
  const output = outputPath(Deno.args);
  const manifest = await loadShaclManifest(ROOT);
  const ontologyText = await Deno.readTextFile(ONTOLOGY_PATH);
  const version = await jenaVersion();
  const tempDir = await Deno.makeTempDir({ prefix: "sflo-jena-shacl-" });
  const receipts: ShaclCaseReceipt[] = [];
  try {
    for (const fixture of manifest.cases) {
      const caseText = await Deno.readTextFile(
        `${CASES_ROOT}/${fixture.dataFile}`,
      );
      const dataPath = `${tempDir}/${fixture.id}.ttl`;
      await Deno.writeTextFile(dataPath, `${ontologyText}\n${caseText}`);
      const { rawConforms, graph } = await validateWithJena(dataPath);
      const results = normalizeResults(
        graph,
        manifest.focusNamespace,
        manifest,
      );
      const receipt = semanticCaseReceipt({
        caseId: fixture.id,
        rawConforms,
        conforms: results.length === 0,
        maxSeverity: maxSeverity(results),
        results,
      });
      assertReceiptMatchesCase(receipt, fixture);
      receipts.push(receipt);
    }
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }

  await emitReceiptBundle(
    receiptBundle({
      engine: {
        name: "Apache Jena SHACL",
        version,
        adapter: "Jena shacl validate CLI over the ontology/case graph union",
      },
      sfloCommit: await currentGitCommit(ROOT),
      command: "deno task conformance:jena",
      cases: receipts,
    }),
    output,
  );
}

if (import.meta.main) await main();
