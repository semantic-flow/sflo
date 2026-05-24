import { assert, assertEquals } from "@std/assert";
import type { Quad, Term } from "n3";
import {
  hasTriple,
  objectsFor,
  parseRepoTurtle,
  parseTurtle,
  RDF,
  SFCFG_NAMESPACE,
  SFLO_NAMESPACE,
  SFLO_SHACL_NAMESPACE,
  SH,
} from "./helpers/rdf.ts";

const CORE_SHACL_FILE = "semantic-flow-core-shacl.ttl";

const SHAPES = {
  KnopSourceBinding: `${SFLO_SHACL_NAMESPACE}KnopSourceBindingShape`,
  LocalWorkingSourceBinding:
    `${SFLO_SHACL_NAMESPACE}LocalWorkingSourceBindingShape`,
  ArtifactResolutionModeUsage:
    `${SFLO_SHACL_NAMESPACE}ArtifactResolutionModeUsageShape`,
  ResourcePagePresentationConfig:
    `${SFLO_SHACL_NAMESPACE}ResourcePagePresentationConfigShape`,
  ResourcePagePanelSelection:
    `${SFLO_SHACL_NAMESPACE}ResourcePagePanelSelectionShape`,
} as const;

const TERMS = {
  ArtifactResolutionTarget: `${SFLO_NAMESPACE}ArtifactResolutionTarget`,
  LocalPathAccessRule: `${SFCFG_NAMESPACE}LocalPathAccessRule`,
  PublicationProfile: `${SFCFG_NAMESPACE}PublicationProfile`,
  RemoteAccessRule: `${SFCFG_NAMESPACE}RemoteAccessRule`,
  ResourcePagePresentationConfig:
    `${SFCFG_NAMESPACE}ResourcePagePresentationConfig`,
  ResourcePagePanelSelection: `${SFCFG_NAMESPACE}ResourcePagePanelSelection`,
  artifactResolutionModeLatestState:
    `${SFLO_NAMESPACE}artifactResolutionMode_latestState`,
  artifactResolutionModeWorking:
    `${SFLO_NAMESPACE}artifactResolutionMode_working`,
  hasInnerResourcePageTemplate:
    `${SFCFG_NAMESPACE}hasInnerResourcePageTemplate`,
  hasPanelDataRequirement: `${SFCFG_NAMESPACE}hasPanelDataRequirement`,
  hasPanelInclusionPolicy: `${SFCFG_NAMESPACE}hasPanelInclusionPolicy`,
  hasResourcePagePanel: `${SFCFG_NAMESPACE}hasResourcePagePanel`,
  hasResourcePagePanelSelection:
    `${SFCFG_NAMESPACE}hasResourcePagePanelSelection`,
  hasResourcePageStylesheet: `${SFCFG_NAMESPACE}hasResourcePageStylesheet`,
  hasOuterResourcePageTemplate:
    `${SFCFG_NAMESPACE}hasOuterResourcePageTemplate`,
  hasArtifactResolutionMode: `${SFLO_NAMESPACE}hasArtifactResolutionMode`,
  hasRequestedTargetState: `${SFLO_NAMESPACE}hasRequestedTargetState`,
  hasTargetRepositorySource: `${SFLO_NAMESPACE}hasTargetRepositorySource`,
  panelOrder: `${SFCFG_NAMESPACE}panelOrder`,
  targetLocalRelativePath: `${SFLO_NAMESPACE}targetLocalRelativePath`,
} as const;

Deno.test("core SHACL declares key source-binding and resolution-mode shapes", async () => {
  const quads = await parseRepoTurtle(CORE_SHACL_FILE);

  assertNodeShape(quads, SHAPES.KnopSourceBinding);
  assertNodeShape(quads, SHAPES.LocalWorkingSourceBinding);
  assertNodeShape(quads, SHAPES.ArtifactResolutionModeUsage);
  assertNodeShape(quads, SHAPES.ResourcePagePresentationConfig);
  assertNodeShape(quads, SHAPES.ResourcePagePanelSelection);

  assert(
    hasTriple(
      quads,
      SHAPES.KnopSourceBinding,
      SH.targetSubjectsOf,
      TERMS.hasTargetRepositorySource,
    ),
    "repository-backed source binding shape should target sflo:hasTargetRepositorySource subjects",
  );
  assert(
    hasTriple(
      quads,
      SHAPES.LocalWorkingSourceBinding,
      SH.targetSubjectsOf,
      TERMS.targetLocalRelativePath,
    ),
    "local working source binding shape should target sflo:targetLocalRelativePath subjects",
  );
  assert(
    hasTriple(
      quads,
      SHAPES.ArtifactResolutionModeUsage,
      SH.targetSubjectsOf,
      TERMS.hasArtifactResolutionMode,
    ),
    "ArtifactResolutionMode usage shape should target sflo:hasArtifactResolutionMode subjects",
  );
});

Deno.test("ResourcePage presentation SHACL declares required config and panel selection constraints", async () => {
  const quads = await parseRepoTurtle(CORE_SHACL_FILE);

  assert(
    hasTriple(
      quads,
      SHAPES.ResourcePagePresentationConfig,
      SH.targetClass,
      TERMS.ResourcePagePresentationConfig,
    ),
    "ResourcePagePresentationConfig shape should target ResourcePagePresentationConfig",
  );
  assertRequiredProperty(
    quads,
    SHAPES.ResourcePagePresentationConfig,
    TERMS.hasOuterResourcePageTemplate,
  );
  assertRequiredProperty(
    quads,
    SHAPES.ResourcePagePresentationConfig,
    TERMS.hasInnerResourcePageTemplate,
  );
  assertRequiredProperty(
    quads,
    SHAPES.ResourcePagePresentationConfig,
    TERMS.hasResourcePageStylesheet,
  );
  assertRequiredProperty(
    quads,
    SHAPES.ResourcePagePresentationConfig,
    TERMS.hasResourcePagePanelSelection,
  );

  assert(
    hasTriple(
      quads,
      SHAPES.ResourcePagePanelSelection,
      SH.targetClass,
      TERMS.ResourcePagePanelSelection,
    ),
    "ResourcePagePanelSelection shape should target ResourcePagePanelSelection",
  );
  assertRequiredProperty(
    quads,
    SHAPES.ResourcePagePanelSelection,
    TERMS.hasResourcePagePanel,
  );
  assertRequiredProperty(
    quads,
    SHAPES.ResourcePagePanelSelection,
    TERMS.panelOrder,
  );
  assertRequiredProperty(
    quads,
    SHAPES.ResourcePagePanelSelection,
    TERMS.hasPanelInclusionPolicy,
  );
  assertRequiredProperty(
    quads,
    SHAPES.ResourcePagePanelSelection,
    TERMS.hasPanelDataRequirement,
  );
});

Deno.test("config ontology carries publication, local access, and resource-page config vocabulary", async () => {
  const quads = await parseRepoTurtle("semantic-flow-config-ontology.ttl");

  for (
    const term of [
      TERMS.LocalPathAccessRule,
      TERMS.PublicationProfile,
      TERMS.RemoteAccessRule,
      TERMS.ResourcePagePresentationConfig,
    ]
  ) {
    assert(
      hasTriple(
        quads,
        term,
        RDF.type,
        "http://www.w3.org/2000/01/rdf-schema#Class",
      ),
      `${term} should be declared as an rdfs:Class`,
    );
  }
});

Deno.test("selected ArtifactResolutionMode SHACL checks accept working-source examples", async () => {
  const shapeQuads = await parseRepoTurtle(CORE_SHACL_FILE);
  const dataQuads = parseTurtle(`
    @prefix sflo: <${SFLO_NAMESPACE}> .

    <source-binding> a sflo:ArtifactResolutionTarget ;
      sflo:hasArtifactResolutionMode sflo:artifactResolutionMode_working ;
      sflo:targetLocalRelativePath "source.ttl" .
  `);

  assertEquals(
    validateArtifactResolutionModeUsage(dataQuads, shapeQuads),
    [],
  );
});

Deno.test("selected ArtifactResolutionMode SHACL checks distinguish warning and info severities", async () => {
  const shapeQuads = await parseRepoTurtle(CORE_SHACL_FILE);
  const dataQuads = parseTurtle(`
    @prefix sflo: <${SFLO_NAMESPACE}> .

    <working-plus-exact> a sflo:ArtifactResolutionTarget ;
      sflo:hasArtifactResolutionMode sflo:artifactResolutionMode_working ;
      sflo:hasRequestedTargetState <state-1> .

    <latest-plus-exact> a sflo:ArtifactResolutionTarget ;
      sflo:hasArtifactResolutionMode sflo:artifactResolutionMode_latestState ;
      sflo:hasRequestedTargetState <state-1> .

    <state-1> a sflo:HistoricalState .
  `);

  assertEquals(validateArtifactResolutionModeUsage(dataQuads, shapeQuads), [
    {
      focusNode: "https://example.test/working-plus-exact",
      severity: SH.Warning,
    },
    {
      focusNode: "https://example.test/latest-plus-exact",
      severity: SH.Info,
    },
  ]);
});

function assertNodeShape(quads: readonly Quad[], subject: string): void {
  assert(
    hasTriple(quads, subject, RDF.type, SH.NodeShape),
    `${subject} should be declared as a sh:NodeShape`,
  );
}

function assertRequiredProperty(
  quads: readonly Quad[],
  shape: string,
  path: string,
): void {
  const propertyShapes = objectsFor(quads, shape, SH.property);
  const propertyShape = propertyShapes.find((candidate) =>
    objectsFor(quads, candidate.value, SH.path).some((term) =>
      term.value === path
    )
  );
  assert(
    propertyShape,
    `${shape} should declare a property shape for ${path}`,
  );
  assert(
    objectsFor(quads, propertyShape.value, SH.minCount).some((term) =>
      term.value === "1"
    ),
    `${shape} ${path} property shape should require at least one value`,
  );
}

function validateArtifactResolutionModeUsage(
  dataQuads: readonly Quad[],
  shapeQuads: readonly Quad[],
): readonly ValidationFinding[] {
  const warningSeverity = constraintSeverity(
    shapeQuads,
    "sflo:artifactResolutionMode_working SHOULD NOT be combined",
  );
  const infoSeverity = constraintSeverity(
    shapeQuads,
    "sflo:artifactResolutionMode_latestState SHOULD NOT be combined",
  );
  const findings: ValidationFinding[] = [];

  for (
    const subject of subjectsWithMode(
      dataQuads,
      TERMS.artifactResolutionModeWorking,
    )
  ) {
    if (hasRequestedTargetState(dataQuads, subject)) {
      findings.push({
        focusNode: subject.value,
        severity: warningSeverity,
      });
    }
  }

  for (
    const subject of subjectsWithMode(
      dataQuads,
      TERMS.artifactResolutionModeLatestState,
    )
  ) {
    if (hasRequestedTargetState(dataQuads, subject)) {
      findings.push({
        focusNode: subject.value,
        severity: infoSeverity,
      });
    }
  }

  return findings;
}

function constraintSeverity(
  shapeQuads: readonly Quad[],
  messageSnippet: string,
): string {
  for (
    const constraint of objectsFor(
      shapeQuads,
      SHAPES.ArtifactResolutionModeUsage,
      SH.sparql,
    )
  ) {
    const message = objectsFor(
      shapeQuads,
      constraint.value,
      SH.message,
    ).find((term) => term.value.includes(messageSnippet));

    if (!message) {
      continue;
    }

    const [severity] = objectsFor(shapeQuads, constraint.value, SH.severity);
    assert(
      severity,
      `SHACL constraint ${messageSnippet} should declare severity`,
    );
    return severity.value;
  }

  throw new Error(
    `Could not find SHACL constraint containing ${messageSnippet}`,
  );
}

function subjectsWithMode(
  quads: readonly Quad[],
  mode: string,
): readonly Term[] {
  return quads.filter((quad) =>
    quad.predicate.value === TERMS.hasArtifactResolutionMode &&
    quad.object.value === mode
  ).map((quad) => quad.subject);
}

function hasRequestedTargetState(
  quads: readonly Quad[],
  subject: Term,
): boolean {
  return quads.some((quad) =>
    quad.subject.equals(subject) &&
    quad.predicate.value === TERMS.hasRequestedTargetState
  );
}

interface ValidationFinding {
  focusNode: string;
  severity: string;
}
