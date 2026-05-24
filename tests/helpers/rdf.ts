import { fromFileUrl, join } from "@std/path";
import { Parser, type Quad, type Term } from "n3";

export const REPO_ROOT = fromFileUrl(new URL("../../", import.meta.url));

export const RDF = {
  type: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
} as const;

export const SH = {
  NodeShape: "http://www.w3.org/ns/shacl#NodeShape",
  Info: "http://www.w3.org/ns/shacl#Info",
  Warning: "http://www.w3.org/ns/shacl#Warning",
  Violation: "http://www.w3.org/ns/shacl#Violation",
  datatype: "http://www.w3.org/ns/shacl#datatype",
  maxCount: "http://www.w3.org/ns/shacl#maxCount",
  message: "http://www.w3.org/ns/shacl#message",
  minCount: "http://www.w3.org/ns/shacl#minCount",
  path: "http://www.w3.org/ns/shacl#path",
  property: "http://www.w3.org/ns/shacl#property",
  severity: "http://www.w3.org/ns/shacl#severity",
  sparql: "http://www.w3.org/ns/shacl#sparql",
  targetClass: "http://www.w3.org/ns/shacl#targetClass",
  targetSubjectsOf: "http://www.w3.org/ns/shacl#targetSubjectsOf",
} as const;

export const SFLO_NAMESPACE = "https://semantic-flow.github.io/sflo/ontology/";
export const SFCFG_NAMESPACE = "https://semantic-flow.github.io/sflo/config/";
export const SFLO_SHACL_NAMESPACE =
  "https://semantic-flow.github.io/sflo/ontology/shacl/";

export async function parseRepoTurtle(
  relativePath: string,
): Promise<readonly Quad[]> {
  const absolutePath = join(REPO_ROOT, relativePath);
  const turtle = await Deno.readTextFile(absolutePath);

  try {
    return new Parser({ baseIRI: `file://${absolutePath}` }).parse(turtle);
  } catch (error) {
    throw new Error(`Could not parse ${relativePath}: ${String(error)}`);
  }
}

export function parseTurtle(
  turtle: string,
  baseIRI = "https://example.test/",
): readonly Quad[] {
  try {
    return new Parser({ baseIRI }).parse(turtle);
  } catch (error) {
    throw new Error(`Could not parse Turtle fixture: ${String(error)}`);
  }
}

export async function readRepoFile(relativePath: string): Promise<string> {
  return await Deno.readTextFile(join(REPO_ROOT, relativePath));
}

export function quadTerms(quad: Quad): readonly Term[] {
  return [quad.subject, quad.predicate, quad.object, quad.graph];
}

export function termKey(term: Term): string {
  if (term.termType === "Literal") {
    return [
      "Literal",
      JSON.stringify(term.value),
      term.datatype.value,
      term.language,
    ].join("|");
  }

  return `${term.termType}|${term.value}`;
}

export function hasTriple(
  quads: readonly Quad[],
  subject: string,
  predicate: string,
  object: string,
): boolean {
  return quads.some((quad) =>
    quad.subject.value === subject &&
    quad.predicate.value === predicate &&
    quad.object.value === object
  );
}

export function objectsFor(
  quads: readonly Quad[],
  subject: string,
  predicate: string,
): readonly Term[] {
  return quads.filter((quad) =>
    quad.subject.value === subject && quad.predicate.value === predicate
  ).map((quad) => quad.object);
}

export function subjectsFor(
  quads: readonly Quad[],
  predicate: string,
  object: string,
): readonly Term[] {
  return quads.filter((quad) =>
    quad.predicate.value === predicate && quad.object.value === object
  ).map((quad) => quad.subject);
}
