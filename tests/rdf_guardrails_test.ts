import { assert, assertFalse } from "@std/assert";
import {
  parseRepoTurtle,
  quadTerms,
  readRepoFile,
  SFCFG_NAMESPACE,
  SFLO_NAMESPACE,
  termKey,
} from "./helpers/rdf.ts";

const RDFS = {
  Class: "http://www.w3.org/2000/01/rdf-schema#Class",
  subClassOf: "http://www.w3.org/2000/01/rdf-schema#subClassOf",
} as const;

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
    "sfcfg:KnopConfig",
    "<KnopConfig>",
    `${SFCFG_NAMESPACE}KnopConfig`,
    "sfcfg:hasMeshConfig",
    "<hasMeshConfig>",
    `${SFCFG_NAMESPACE}hasMeshConfig`,
    "sfcfg:hasMeshInheritableConfig",
    "<hasMeshInheritableConfig>",
    `${SFCFG_NAMESPACE}hasMeshInheritableConfig`,
    "sfcfg:hasKnopConfig",
    "<hasKnopConfig>",
    `${SFCFG_NAMESPACE}hasKnopConfig`,
    "sfcfg:hasKnopLocalConfig",
    "<hasKnopLocalConfig>",
    `${SFCFG_NAMESPACE}hasKnopLocalConfig`,
    "sfcfg:hasKnopInheritableConfig",
    "<hasKnopInheritableConfig>",
    `${SFCFG_NAMESPACE}hasKnopInheritableConfig`,
    "sfcfg:hasMeshConfigSource",
    "<hasMeshConfigSource>",
    `${SFCFG_NAMESPACE}hasMeshConfigSource`,
    "sfcfg:hasMeshInheritableConfigSource",
    "<hasMeshInheritableConfigSource>",
    `${SFCFG_NAMESPACE}hasMeshInheritableConfigSource`,
    "sfcfg:hasKnopLocalConfigSource",
    "<hasKnopLocalConfigSource>",
    `${SFCFG_NAMESPACE}hasKnopLocalConfigSource`,
    "sfcfg:hasKnopInheritableConfigSource",
    "<hasKnopInheritableConfigSource>",
    `${SFCFG_NAMESPACE}hasKnopInheritableConfigSource`,
    "sfcfg:configLayerRole_meshInheritable",
    "<configLayerRole_meshInheritable>",
    `${SFCFG_NAMESPACE}configLayerRole_meshInheritable`,
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
    "hasDefaultHistoryTrackingPolicy",
    "hasHistoryTrackingDefault",
    "hasDefaultResourcePageGenerationPolicy",
    "hasResourcePageGenerationDefault",
    "hasDefaultResourcePagePresentationConfig",
    "panelDataRequirement_semanticFlowMetadataOptIn",
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

Deno.test("old ReferenceLink and artifact-resolution vocabulary stay retired", async () => {
  const retiredFragments = [
    "sflo:referenceTarget",
    "<referenceTarget>",
    `${SFLO_NAMESPACE}referenceTarget`,
    "sflo:referenceTargetState",
    "<referenceTargetState>",
    `${SFLO_NAMESPACE}referenceTargetState`,
    "sflo:referenceUriLiteral",
    "<referenceUriLiteral>",
    `${SFLO_NAMESPACE}referenceUriLiteral`,
    "sflo:hasObservedSourceState",
    "<hasObservedSourceState>",
    `${SFLO_NAMESPACE}hasObservedSourceState`,
    "sflo:hasObservedSourceManifestation",
    "<hasObservedSourceManifestation>",
    `${SFLO_NAMESPACE}hasObservedSourceManifestation`,
    "sflo:hasObservedSourceLocatedFile",
    "<hasObservedSourceLocatedFile>",
    `${SFLO_NAMESPACE}hasObservedSourceLocatedFile`,
    "sflo:observedSourceLocalRelativePath",
    "<observedSourceLocalRelativePath>",
    `${SFLO_NAMESPACE}observedSourceLocalRelativePath`,
    "sflo:observedSourceDigest",
    "<observedSourceDigest>",
    `${SFLO_NAMESPACE}observedSourceDigest`,
    "sflo:ArtifactResolutionTarget",
    "<ArtifactResolutionTarget>",
    `${SFLO_NAMESPACE}ArtifactResolutionTarget`,
    "sflo:hasTargetArtifact",
    "<hasTargetArtifact>",
    `${SFLO_NAMESPACE}hasTargetArtifact`,
    "sflo:hasTargetLocatedFile",
    "<hasTargetLocatedFile>",
    `${SFLO_NAMESPACE}hasTargetLocatedFile`,
    "sflo:hasTargetDistribution",
    "<hasTargetDistribution>",
    `${SFLO_NAMESPACE}hasTargetDistribution`,
    "sflo:hasRequestedTargetHistory",
    "<hasRequestedTargetHistory>",
    `${SFLO_NAMESPACE}hasRequestedTargetHistory`,
    "sflo:hasRequestedTargetState",
    "<hasRequestedTargetState>",
    `${SFLO_NAMESPACE}hasRequestedTargetState`,
    "sflo:hasTargetRepositorySource",
    "<hasTargetRepositorySource>",
    `${SFLO_NAMESPACE}hasTargetRepositorySource`,
    "sflo:ArtifactResolutionFallbackPolicy",
    "<ArtifactResolutionFallbackPolicy>",
    `${SFLO_NAMESPACE}ArtifactResolutionFallbackPolicy`,
    "sflo:hasArtifactResolutionFallbackPolicy",
    "<hasArtifactResolutionFallbackPolicy>",
    `${SFLO_NAMESPACE}hasArtifactResolutionFallbackPolicy`,
    "sflo:hasObservedTargetState",
    "<hasObservedTargetState>",
    `${SFLO_NAMESPACE}hasObservedTargetState`,
    "sflo:hasObservedTargetManifestation",
    "<hasObservedTargetManifestation>",
    `${SFLO_NAMESPACE}hasObservedTargetManifestation`,
    "sflo:hasObservedTargetLocatedFile",
    "<hasObservedTargetLocatedFile>",
    `${SFLO_NAMESPACE}hasObservedTargetLocatedFile`,
    "sflo:observedTargetLocalRelativePath",
    "<observedTargetLocalRelativePath>",
    `${SFLO_NAMESPACE}observedTargetLocalRelativePath`,
  ] as const;

  for (
    const relativePath of [
      "semantic-flow-core-ontology.ttl",
      "semantic-flow-core-shacl.ttl",
    ] as const
  ) {
    const contents = await readRepoFile(relativePath);
    for (const retiredFragment of retiredFragments) {
      assertFalse(
        contents.includes(retiredFragment),
        `${relativePath} still contains retired vocabulary ${retiredFragment}`,
      );
    }
  }
});

Deno.test("core ontology declares shared artifact-resolution source and observation classes", async () => {
  const quads = await parseRepoTurtle("semantic-flow-core-ontology.ttl");

  const artifactResolutionSpec = `${SFLO_NAMESPACE}ArtifactResolutionSpec`;

  for (
    const sourceClass of [
      "ExtractionSource",
      "ReferenceSource",
      "ResourcePageSource",
      "ImportSource",
      "IntegrationSource",
    ]
  ) {
    assert(
      quads.some((quad) =>
        quad.subject.value === `${SFLO_NAMESPACE}${sourceClass}` &&
        quad.predicate.value === RDFS.subClassOf &&
        quad.object.value === artifactResolutionSpec
      ),
      `${sourceClass} should subclass ArtifactResolutionSpec`,
    );
  }

  assert(
    quads.some((quad) =>
      quad.subject.value ===
        `${SFLO_NAMESPACE}ArtifactResolutionObservation` &&
      quad.predicate.value ===
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" &&
      quad.object.value === RDFS.Class
    ),
    "ArtifactResolutionObservation should be declared as an rdfs:Class",
  );
});
