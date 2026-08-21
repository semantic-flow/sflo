import { DataFactory, Parser, Store } from "n3";
import { Validator } from "shacl-engine";
import * as shaclSparql from "shacl-engine/sparql";
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
const SHACL_ENGINE_VERSION = "1.1.2";

interface EngineResult {
  constraintComponent?: { value?: string };
  focusNode?: { term?: { value?: string }; terms?: { value?: string }[] };
  message?: { value?: string }[];
  path?: { predicates?: { value?: string }[] }[] | null;
  results?: EngineResult[];
  severity?: { value?: string };
}

function parseTurtle(contents: string): Store {
  return new Store(new Parser({ format: "text/turtle" }).parse(contents));
}

function resultPath(result: EngineResult): string | null {
  const predicates = (result.path ?? []).flatMap((segment) =>
    (segment.predicates ?? []).flatMap((term) =>
      term.value === undefined ? [] : [term.value]
    )
  );
  return predicates.length === 1 ? predicates[0]! : null;
}

function focusNode(result: EngineResult): string {
  const value = result.focusNode?.term?.value ??
    result.focusNode?.terms?.[0]?.value;
  if (value === undefined) throw new Error("SHACL result omitted a focus node");
  return value;
}

function flatten(results: readonly EngineResult[]): EngineResult[] {
  return results.flatMap((
    result,
  ) => [result, ...flatten(result.results ?? [])]);
}

async function main(): Promise<void> {
  const output = outputPath(Deno.args);
  const manifest = await loadShaclManifest(ROOT);
  const shapesText = await Deno.readTextFile(SHAPES_PATH);
  const ontologyText = await Deno.readTextFile(ONTOLOGY_PATH);
  const shapes = parseTurtle(shapesText);
  const validator = new Validator(shapes, {
    factory: DataFactory,
    targetResolvers: shaclSparql.targetResolvers,
    validations: shaclSparql.validations,
  });

  const receipts: ShaclCaseReceipt[] = [];
  for (const fixture of manifest.cases) {
    const caseText = await Deno.readTextFile(
      `${CASES_ROOT}/${fixture.dataFile}`,
    );
    const data = parseTurtle(`${ontologyText}\n${caseText}`);
    const report = await validator.validate({ dataset: data });
    const normalized: NormalizedShaclResult[] = flatten(
      report.results as EngineResult[],
    ).flatMap((result) => {
      const focus = focusNode(result);
      if (!focus.startsWith(manifest.focusNamespace)) return [];
      const messages = (result.message ?? []).flatMap((message) =>
        message.value === undefined ? [] : [message.value]
      );
      return [{
        severity: localName(
          result.severity?.value,
        ) as NormalizedShaclResult["severity"],
        focusNode: focus,
        resultPath: resultPath(result),
        constraintComponent: localName(result.constraintComponent?.value),
        messageKey: messageKeyFor(manifest, messages),
      }];
    });
    const receipt = semanticCaseReceipt({
      caseId: fixture.id,
      rawConforms: report.conforms,
      conforms: normalized.length === 0,
      maxSeverity: maxSeverity(normalized),
      results: normalized,
    });
    assertReceiptMatchesCase(receipt, fixture);
    receipts.push(receipt);
  }

  await emitReceiptBundle(
    receiptBundle({
      engine: {
        name: "shacl-engine",
        version: SHACL_ENGINE_VERSION,
        adapter: "SFLO minimal N3 RDF/JS dataset with shacl-engine/sparql.js",
      },
      sfloCommit: await currentGitCommit(ROOT),
      command: "deno task conformance:js",
      cases: receipts,
    }),
    output,
  );
}

if (import.meta.main) await main();
