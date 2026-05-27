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
  ArtifactResolutionObservation:
    `${SFLO_SHACL_NAMESPACE}ArtifactResolutionObservationShape`,
  ArtifactResolutionObservationLink:
    `${SFLO_SHACL_NAMESPACE}ArtifactResolutionObservationLinkShape`,
  ArtifactResolutionFallbackSpec:
    `${SFLO_SHACL_NAMESPACE}ArtifactResolutionFallbackSpecShape`,
  ConfigSource: `${SFLO_SHACL_NAMESPACE}ConfigSourceShape`,
  KnopSourceBinding: `${SFLO_SHACL_NAMESPACE}KnopSourceBindingShape`,
  LocalWorkingSourceBinding:
    `${SFLO_SHACL_NAMESPACE}LocalWorkingSourceBindingShape`,
  ReferenceLink: `${SFLO_SHACL_NAMESPACE}ReferenceLinkShape`,
  ReferenceSource: `${SFLO_SHACL_NAMESPACE}ReferenceSourceShape`,
  ArtifactResolutionModeUsage:
    `${SFLO_SHACL_NAMESPACE}ArtifactResolutionModeUsageShape`,
  PolicyDefinition: `${SFLO_SHACL_NAMESPACE}PolicyDefinitionShape`,
  PolicyBinding: `${SFLO_SHACL_NAMESPACE}PolicyBindingShape`,
  ArtifactRolePolicyTarget:
    `${SFLO_SHACL_NAMESPACE}ArtifactRolePolicyTargetShape`,
  ExactArtifactPolicyTarget:
    `${SFLO_SHACL_NAMESPACE}ExactArtifactPolicyTargetShape`,
  ResourcePagePresentationPolicy:
    `${SFLO_SHACL_NAMESPACE}ResourcePagePresentationPolicyShape`,
  ResourcePagePanelSelection:
    `${SFLO_SHACL_NAMESPACE}ResourcePagePanelSelectionShape`,
  ResourcePageDefinitionPresentationConfig:
    `${SFLO_SHACL_NAMESPACE}ResourcePageDefinitionPresentationConfigShape`,
} as const;

const TERMS = {
  ArtifactResolutionSpec: `${SFLO_NAMESPACE}ArtifactResolutionSpec`,
  ConfigSource: `${SFCFG_NAMESPACE}ConfigSource`,
  PolicyDefinition: `${SFCFG_NAMESPACE}PolicyDefinition`,
  PolicyBinding: `${SFCFG_NAMESPACE}PolicyBinding`,
  PolicyTarget: `${SFCFG_NAMESPACE}PolicyTarget`,
  ArtifactRolePolicyTarget: `${SFCFG_NAMESPACE}ArtifactRolePolicyTarget`,
  ExactArtifactPolicyTarget: `${SFCFG_NAMESPACE}ExactArtifactPolicyTarget`,
  PublicationProfile: `${SFCFG_NAMESPACE}PublicationProfile`,
  ResourcePageDefinition: `${SFLO_NAMESPACE}ResourcePageDefinition`,
  ResourcePagePresentationPolicy:
    `${SFCFG_NAMESPACE}ResourcePagePresentationPolicy`,
  ResourcePagePanelSelection: `${SFCFG_NAMESPACE}ResourcePagePanelSelection`,
  artifactResolutionModeLatestState:
    `${SFLO_NAMESPACE}artifactResolutionMode_latestState`,
  artifactResolutionModeWorking:
    `${SFLO_NAMESPACE}artifactResolutionMode_working`,
  hasInnerResourcePageTemplate:
    `${SFCFG_NAMESPACE}hasInnerResourcePageTemplate`,
  bindsPolicy: `${SFCFG_NAMESPACE}bindsPolicy`,
  appliesToPolicyTarget: `${SFCFG_NAMESPACE}appliesToPolicyTarget`,
  policyPriority: `${SFCFG_NAMESPACE}policyPriority`,
  hasArtifactRole: `${SFCFG_NAMESPACE}hasArtifactRole`,
  targetsArtifact: `${SFCFG_NAMESPACE}targetsArtifact`,
  hasGeneratedResourcePagePanelSelection:
    `${SFCFG_NAMESPACE}hasGeneratedResourcePagePanelSelection`,
  hasPanelDataRequirement: `${SFCFG_NAMESPACE}hasPanelDataRequirement`,
  hasPanelInclusionPolicy: `${SFCFG_NAMESPACE}hasPanelInclusionPolicy`,
  hasReferenceSource: `${SFLO_NAMESPACE}hasReferenceSource`,
  hasResolutionObservation: `${SFLO_NAMESPACE}hasResolutionObservation`,
  hasFallbackArtifactResolutionSpec:
    `${SFLO_NAMESPACE}hasFallbackArtifactResolutionSpec`,
  hasResourcePagePresentationPolicy:
    `${SFCFG_NAMESPACE}hasResourcePagePresentationPolicy`,
  hasResourcePagePanel: `${SFCFG_NAMESPACE}hasResourcePagePanel`,
  hasResourcePagePanelSelection:
    `${SFCFG_NAMESPACE}hasResourcePagePanelSelection`,
  hasResourcePageStylesheet: `${SFCFG_NAMESPACE}hasResourcePageStylesheet`,
  hasOuterResourcePageTemplate:
    `${SFCFG_NAMESPACE}hasOuterResourcePageTemplate`,
  hasArtifactResolutionMode: `${SFLO_NAMESPACE}hasArtifactResolutionMode`,
  targetHistoricalState: `${SFLO_NAMESPACE}targetHistoricalState`,
  targetArtifact: `${SFLO_NAMESPACE}targetArtifact`,
  targetRepositorySource: `${SFLO_NAMESPACE}targetRepositorySource`,
  observedContentDigest: `${SFLO_NAMESPACE}observedContentDigest`,
  observedArtifactResolutionSpec:
    `${SFLO_NAMESPACE}observedArtifactResolutionSpec`,
  observedAt: `${SFLO_NAMESPACE}observedAt`,
  ReferenceSource: `${SFLO_NAMESPACE}ReferenceSource`,
  ArtifactResolutionObservation:
    `${SFLO_NAMESPACE}ArtifactResolutionObservation`,
  panelOrder: `${SFCFG_NAMESPACE}panelOrder`,
  targetLocalRelativePath: `${SFLO_NAMESPACE}targetLocalRelativePath`,
} as const;

Deno.test("core SHACL declares key source-binding and resolution-mode shapes", async () => {
  const quads = await parseRepoTurtle(CORE_SHACL_FILE);

  assertNodeShape(quads, SHAPES.ReferenceLink);
  assertNodeShape(quads, SHAPES.ReferenceSource);
  assertNodeShape(quads, SHAPES.ArtifactResolutionObservation);
  assertNodeShape(quads, SHAPES.ArtifactResolutionObservationLink);
  assertNodeShape(quads, SHAPES.ArtifactResolutionFallbackSpec);
  assertNodeShape(quads, SHAPES.ConfigSource);
  assertNodeShape(quads, SHAPES.KnopSourceBinding);
  assertNodeShape(quads, SHAPES.LocalWorkingSourceBinding);
  assertNodeShape(quads, SHAPES.ArtifactResolutionModeUsage);
  assertNodeShape(quads, SHAPES.PolicyDefinition);
  assertNodeShape(quads, SHAPES.PolicyBinding);
  assertNodeShape(quads, SHAPES.ArtifactRolePolicyTarget);
  assertNodeShape(quads, SHAPES.ExactArtifactPolicyTarget);
  assertNodeShape(quads, SHAPES.ResourcePagePresentationPolicy);
  assertNodeShape(quads, SHAPES.ResourcePagePanelSelection);
  assertNodeShape(quads, SHAPES.ResourcePageDefinitionPresentationConfig);

  assert(
    hasTriple(
      quads,
      SHAPES.KnopSourceBinding,
      SH.targetSubjectsOf,
      TERMS.targetRepositorySource,
    ),
    "repository-backed source binding shape should target sflo:targetRepositorySource subjects",
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

Deno.test("ReferenceLink SHACL requires exactly one ReferenceSource", async () => {
  const quads = await parseRepoTurtle(CORE_SHACL_FILE);

  assert(
    hasTriple(
      quads,
      SHAPES.ReferenceLink,
      SH.targetClass,
      `${SFLO_NAMESPACE}ReferenceLink`,
    ),
    "ReferenceLink shape should target ReferenceLink",
  );
  assertRequiredProperty(
    quads,
    SHAPES.ReferenceLink,
    TERMS.hasReferenceSource,
  );
  assertPropertyMaxCount(
    quads,
    SHAPES.ReferenceLink,
    TERMS.hasReferenceSource,
    1,
  );
  assertOptionalProperty(
    quads,
    SHAPES.ReferenceSource,
    TERMS.targetArtifact,
  );
  assertPropertyMaxCount(
    quads,
    SHAPES.ReferenceSource,
    TERMS.targetArtifact,
    1,
  );
});

Deno.test("ArtifactResolutionObservation SHACL declares observation evidence constraints", async () => {
  const quads = await parseRepoTurtle(CORE_SHACL_FILE);

  assert(
    hasTriple(
      quads,
      SHAPES.ArtifactResolutionObservation,
      SH.targetClass,
      TERMS.ArtifactResolutionObservation,
    ),
    "ArtifactResolutionObservation shape should target ArtifactResolutionObservation",
  );
  assertRequiredProperty(
    quads,
    SHAPES.ArtifactResolutionObservation,
    TERMS.observedArtifactResolutionSpec,
  );
  assertPropertyMaxCount(
    quads,
    SHAPES.ArtifactResolutionObservation,
    TERMS.observedArtifactResolutionSpec,
    1,
  );
  assertOptionalProperty(
    quads,
    SHAPES.ArtifactResolutionObservation,
    TERMS.observedContentDigest,
  );
  assertOptionalProperty(
    quads,
    SHAPES.ArtifactResolutionObservation,
    TERMS.observedAt,
  );
  assertPropertyMaxCount(
    quads,
    SHAPES.ArtifactResolutionObservation,
    TERMS.observedAt,
    1,
  );
  assert(
    hasTriple(
      quads,
      SHAPES.ArtifactResolutionObservationLink,
      SH.targetSubjectsOf,
      TERMS.hasResolutionObservation,
    ),
    "ArtifactResolutionObservationLink shape should target hasResolutionObservation subjects",
  );
});

Deno.test("ArtifactResolutionSpec SHACL declares recursive fallback constraint", async () => {
  const quads = await parseRepoTurtle(CORE_SHACL_FILE);

  assert(
    hasTriple(
      quads,
      SHAPES.ArtifactResolutionFallbackSpec,
      SH.targetSubjectsOf,
      TERMS.hasFallbackArtifactResolutionSpec,
    ),
    "ArtifactResolutionFallbackSpec shape should target hasFallbackArtifactResolutionSpec subjects",
  );
  assertOptionalProperty(
    quads,
    SHAPES.ArtifactResolutionFallbackSpec,
    TERMS.hasFallbackArtifactResolutionSpec,
  );
  assertPropertyMaxCount(
    quads,
    SHAPES.ArtifactResolutionFallbackSpec,
    TERMS.hasFallbackArtifactResolutionSpec,
    1,
  );
});

Deno.test("ResourcePage presentation SHACL declares required config and panel selection constraints", async () => {
  const quads = await parseRepoTurtle(CORE_SHACL_FILE);

  assert(
    hasTriple(
      quads,
      SHAPES.ResourcePagePresentationPolicy,
      SH.targetClass,
      TERMS.ResourcePagePresentationPolicy,
    ),
    "ResourcePagePresentationPolicy shape should target ResourcePagePresentationPolicy",
  );
  assertRequiredProperty(
    quads,
    SHAPES.ResourcePagePresentationPolicy,
    TERMS.hasOuterResourcePageTemplate,
  );
  assertPropertyMaxCount(
    quads,
    SHAPES.ResourcePagePresentationPolicy,
    TERMS.hasOuterResourcePageTemplate,
    1,
  );
  assertRequiredProperty(
    quads,
    SHAPES.ResourcePagePresentationPolicy,
    TERMS.hasInnerResourcePageTemplate,
  );
  assertPropertyMaxCount(
    quads,
    SHAPES.ResourcePagePresentationPolicy,
    TERMS.hasInnerResourcePageTemplate,
    1,
  );
  assertRequiredProperty(
    quads,
    SHAPES.ResourcePagePresentationPolicy,
    TERMS.hasResourcePageStylesheet,
  );
  assertOptionalProperty(
    quads,
    SHAPES.ResourcePagePresentationPolicy,
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
  assertPropertyMaxCount(
    quads,
    SHAPES.ResourcePagePanelSelection,
    TERMS.hasResourcePagePanel,
    1,
  );
  assertRequiredProperty(
    quads,
    SHAPES.ResourcePagePanelSelection,
    TERMS.panelOrder,
  );
  assertPropertyMaxCount(
    quads,
    SHAPES.ResourcePagePanelSelection,
    TERMS.panelOrder,
    1,
  );
  assertRequiredProperty(
    quads,
    SHAPES.ResourcePagePanelSelection,
    TERMS.hasPanelInclusionPolicy,
  );
  assertPropertyMaxCount(
    quads,
    SHAPES.ResourcePagePanelSelection,
    TERMS.hasPanelInclusionPolicy,
    1,
  );
  assertRequiredProperty(
    quads,
    SHAPES.ResourcePagePanelSelection,
    TERMS.hasPanelDataRequirement,
  );
});

Deno.test("Policy binding SHACL declares explicit definition and target constraints", async () => {
  const quads = await parseRepoTurtle(CORE_SHACL_FILE);

  assert(
    hasTriple(
      quads,
      SHAPES.PolicyDefinition,
      SH.targetClass,
      TERMS.PolicyDefinition,
    ),
    "PolicyDefinition shape should target PolicyDefinition",
  );
  assert(
    hasTriple(
      quads,
      SHAPES.PolicyBinding,
      SH.targetClass,
      TERMS.PolicyBinding,
    ),
    "PolicyBinding shape should target PolicyBinding",
  );
  assertRequiredProperty(
    quads,
    SHAPES.PolicyBinding,
    TERMS.bindsPolicy,
  );
  assertPropertyMaxCount(
    quads,
    SHAPES.PolicyBinding,
    TERMS.bindsPolicy,
    1,
  );
  assertRequiredProperty(
    quads,
    SHAPES.PolicyBinding,
    TERMS.appliesToPolicyTarget,
  );
  assertPropertyMaxCount(
    quads,
    SHAPES.PolicyBinding,
    TERMS.appliesToPolicyTarget,
    1,
  );
  assertOptionalProperty(
    quads,
    SHAPES.PolicyBinding,
    TERMS.policyPriority,
  );
  assertPropertyMaxCount(
    quads,
    SHAPES.PolicyBinding,
    TERMS.policyPriority,
    1,
  );
  assert(
    hasTriple(
      quads,
      SHAPES.ArtifactRolePolicyTarget,
      SH.targetClass,
      TERMS.ArtifactRolePolicyTarget,
    ),
    "ArtifactRolePolicyTarget shape should target ArtifactRolePolicyTarget",
  );
  assertRequiredProperty(
    quads,
    SHAPES.ArtifactRolePolicyTarget,
    TERMS.hasArtifactRole,
  );
  assertPropertyMaxCount(
    quads,
    SHAPES.ArtifactRolePolicyTarget,
    TERMS.hasArtifactRole,
    1,
  );
  assert(
    hasTriple(
      quads,
      SHAPES.ExactArtifactPolicyTarget,
      SH.targetClass,
      TERMS.ExactArtifactPolicyTarget,
    ),
    "ExactArtifactPolicyTarget shape should target ExactArtifactPolicyTarget",
  );
  assertRequiredProperty(
    quads,
    SHAPES.ExactArtifactPolicyTarget,
    TERMS.targetsArtifact,
  );
  assertPropertyMaxCount(
    quads,
    SHAPES.ExactArtifactPolicyTarget,
    TERMS.targetsArtifact,
    1,
  );
});

Deno.test("ResourcePageDefinition SHACL declares generated panel selection composition", async () => {
  const quads = await parseRepoTurtle(CORE_SHACL_FILE);

  assert(
    hasTriple(
      quads,
      SHAPES.ResourcePageDefinitionPresentationConfig,
      SH.targetClass,
      TERMS.ResourcePageDefinition,
    ),
    "ResourcePageDefinition presentation shape should target ResourcePageDefinition",
  );
  assertOptionalProperty(
    quads,
    SHAPES.ResourcePageDefinitionPresentationConfig,
    TERMS.hasGeneratedResourcePagePanelSelection,
  );
});

Deno.test("config ontology carries publication, source, and resource-page config vocabulary", async () => {
  const quads = await parseRepoTurtle("semantic-flow-config-ontology.ttl");

  for (
    const term of [
      TERMS.ConfigSource,
      TERMS.PolicyDefinition,
      TERMS.PolicyBinding,
      TERMS.PolicyTarget,
      TERMS.ArtifactRolePolicyTarget,
      TERMS.ExactArtifactPolicyTarget,
      TERMS.PublicationProfile,
      TERMS.ResourcePagePresentationPolicy,
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

    <source-binding> a sflo:ArtifactResolutionSpec ;
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

    <working-plus-exact> a sflo:ArtifactResolutionSpec ;
      sflo:hasArtifactResolutionMode sflo:artifactResolutionMode_working ;
      sflo:targetHistoricalState <state-1> .

    <latest-plus-exact> a sflo:ArtifactResolutionSpec ;
      sflo:hasArtifactResolutionMode sflo:artifactResolutionMode_latestState ;
      sflo:targetHistoricalState <state-1> .

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
  const propertyShape = findPropertyShape(quads, shape, path);
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

function assertOptionalProperty(
  quads: readonly Quad[],
  shape: string,
  path: string,
): void {
  assert(
    findPropertyShape(quads, shape, path),
    `${shape} should declare a property shape for ${path}`,
  );
}

function assertPropertyMaxCount(
  quads: readonly Quad[],
  shape: string,
  path: string,
  maxCount: number,
): void {
  const propertyShape = findPropertyShape(quads, shape, path);
  assert(
    propertyShape,
    `${shape} should declare a property shape for ${path}`,
  );
  assert(
    hasTriple(quads, propertyShape.value, SH.maxCount, String(maxCount)),
    `${shape} ${path} property shape should allow at most ${maxCount} value`,
  );
}

function findPropertyShape(
  quads: readonly Quad[],
  shape: string,
  path: string,
): Term | undefined {
  return objectsFor(quads, shape, SH.property).find((candidate) =>
    objectsFor(quads, candidate.value, SH.path).some((term) =>
      term.value === path
    )
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
    if (targetHistoricalState(dataQuads, subject)) {
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
    if (targetHistoricalState(dataQuads, subject)) {
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

function targetHistoricalState(
  quads: readonly Quad[],
  subject: Term,
): boolean {
  return quads.some((quad) =>
    quad.subject.equals(subject) &&
    quad.predicate.value === TERMS.targetHistoricalState
  );
}

interface ValidationFinding {
  focusNode: string;
  severity: string;
}
