import { assert, assertFalse } from "@std/assert";
import {
  parseRepoTurtle,
  quadTerms,
  readRepoFile,
  SFCFG_NAMESPACE,
  SFLO_NAMESPACE,
  termKey,
} from "./helpers/rdf.ts";

const ACTIVE_RDF_FILES = [
  "semantic-flow-core-ontology.ttl",
  "semantic-flow-core-shacl.ttl",
  "semantic-flow-config-ontology.ttl",
  "semantic-flow-job-ontology.ttl",
  "semantic-flow-prov-ontology.ttl",
] as const;

Deno.test("active ontology and SHACL RDF parses as Turtle", async () => {
  for (const relativePath of ACTIVE_RDF_FILES) {
    const quads = await parseRepoTurtle(relativePath);
    assert(quads.length > 0, `${relativePath} should contain RDF triples`);
  }
});

Deno.test("active ontology and SHACL RDF avoids duplicate triples", async () => {
  for (const relativePath of ACTIVE_RDF_FILES) {
    const quads = await parseRepoTurtle(relativePath);
    const seen = new Set<string>();

    for (const quad of quads) {
      const key = quadTerms(quad).map(termKey).join(" ");
      assertFalse(
        seen.has(key),
        `${relativePath} repeats RDF triple ${key}`,
      );
      seen.add(key);
    }
  }
});

Deno.test("config ontology uses canonical sflo and sfcfg namespaces", async () => {
  const configOntology = await readRepoFile(
    "semantic-flow-config-ontology.ttl",
  );

  assert(
    configOntology.includes(`@prefix sflo: <${SFLO_NAMESPACE}> .`),
    "config ontology should import core terms through the canonical sflo namespace",
  );
  assertFalse(
    configOntology.includes("https://semantic-flow.github.io/ontology/core/"),
    "config ontology should not use the old core namespace alias",
  );
  assert(
    configOntology.includes(
      "@base <https://semantic-flow.github.io/sflo/config/> .",
    ),
    "config ontology @base should use the trailing slash required by sfcfg terms",
  );
  assert(
    configOntology.includes(
      "<https://semantic-flow.github.io/sflo/config> a owl:Ontology",
    ),
    "config ontology should use the slashless config resource as the ontology IRI",
  );
  assertFalse(
    configOntology.includes("https://semantic-flow.github.io/ontology/config"),
    "config ontology should not use the old standalone config namespace",
  );
});

Deno.test("active sfcfg terms use flat namespace-local IRIs", async () => {
  for (const relativePath of ACTIVE_RDF_FILES) {
    const quads = await parseRepoTurtle(relativePath);
    for (const term of quads.flatMap(quadTerms)) {
      if (term.termType !== "NamedNode") {
        continue;
      }
      if (!term.value.startsWith(SFCFG_NAMESPACE)) {
        continue;
      }

      const localName = term.value.slice(SFCFG_NAMESPACE.length);
      if (localName.startsWith("releases/")) {
        continue;
      }

      assertFalse(
        localName.includes("/"),
        `${relativePath} uses slash-shaped sfcfg term ${term.value}`,
      );
    }
  }
});

Deno.test("old config names and boolean policy switches stay retired", async () => {
  const retiredFragments = [
    "sfcfg:LocalConfig",
    "<LocalConfig>",
    `${SFCFG_NAMESPACE}LocalConfig`,
    "artifactResolutionMode_current",
    "artifactResolutionMode_pinned",
    "meshRootPathBase",
    "userHomePathBase",
    "absolutePathBase",
    "workingLocalRelativePathLocatorKind",
    "targetLocalRelativePathLocatorKind",
    "workingAccessUrlLocatorKind",
    "targetAccessUrlLocatorKind",
    "generateResourcePages",
    "createHistoricalStatesOnWeave",
  ] as const;

  for (const relativePath of ACTIVE_RDF_FILES) {
    const contents = await readRepoFile(relativePath);
    for (const retiredFragment of retiredFragments) {
      assertFalse(
        contents.includes(retiredFragment),
        `${relativePath} still contains retired config fragment ${retiredFragment}`,
      );
    }
  }
});
