import { fromFileUrl, join } from "@std/path";
import { Parser, type Quad, type Term } from "n3";

const REPO_ROOT = fromFileUrl(new URL("../", import.meta.url));

const RDF = {
  type: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
} as const;

const OWL = {
  Ontology: "http://www.w3.org/2002/07/owl#Ontology",
  versionIRI: "http://www.w3.org/2002/07/owl#versionIRI",
  versionInfo: "http://www.w3.org/2002/07/owl#versionInfo",
} as const;

const DCTERMS = {
  hasVersion: "http://purl.org/dc/terms/hasVersion",
  isVersionOf: "http://purl.org/dc/terms/isVersionOf",
  issued: "http://purl.org/dc/terms/issued",
} as const;

const DCAT = {
  downloadURL: "http://www.w3.org/ns/dcat#downloadURL",
} as const;

const SCHEMA = {
  contentUrl: "https://schema.org/contentUrl",
} as const;

const VANN = {
  preferredNamespacePrefix:
    "http://purl.org/vocab/vann/preferredNamespacePrefix",
  preferredNamespaceUri: "http://purl.org/vocab/vann/preferredNamespaceUri",
} as const;

const XSD = {
  date: "http://www.w3.org/2001/XMLSchema#date",
} as const;

const SFLO = {
  HistoricalState:
    "https://semantic-flow.github.io/sflo/ontology/HistoricalState",
  hasManifestation:
    "https://semantic-flow.github.io/sflo/ontology/hasManifestation",
} as const;

const ACTIVE_RELEASE_FILES = [
  {
    file: "semantic-flow-core-ontology.ttl",
    ontologyIri: "https://semantic-flow.github.io/sflo/ontology",
    namespaceUri: "https://semantic-flow.github.io/sflo/ontology/",
    prefix: "sflo",
    pagesPublished: true,
  },
  {
    file: "semantic-flow-core-shacl.ttl",
    ontologyIri: "https://semantic-flow.github.io/sflo/ontology/shacl",
    namespaceUri: "https://semantic-flow.github.io/sflo/ontology/shacl/",
    prefix: "sflo-shacl",
    pagesPublished: true,
  },
  {
    file: "semantic-flow-config-ontology.ttl",
    ontologyIri: "https://semantic-flow.github.io/sflo/config",
    namespaceUri: "https://semantic-flow.github.io/sflo/config/",
    prefix: "sfcfg",
    pagesPublished: true,
  },
  {
    file: "semantic-flow-job-ontology.ttl",
    ontologyIri: "https://semantic-flow.github.io/ontology/job",
    namespaceUri: "https://semantic-flow.github.io/ontology/job/",
    prefix: "sfjob",
    pagesPublished: false,
  },
  {
    file: "semantic-flow-prov-ontology.ttl",
    ontologyIri: "https://semantic-flow.github.io/ontology/prov",
    namespaceUri: "https://semantic-flow.github.io/ontology/prov/",
    prefix: "sfprov",
    pagesPublished: false,
  },
] as const;

export interface ReleaseValidationOptions {
  expectedVersion?: string;
  requireTag?: boolean;
  root?: string;
  runGit?: GitRunner;
}

export interface ReleaseValidationResult {
  version?: string;
  errors: string[];
  warnings: string[];
}

type GitRunner = (
  args: readonly string[],
  root: string,
) => Promise<string> | string;

interface ParsedReleaseFile {
  contents: string;
  descriptor: typeof ACTIVE_RELEASE_FILES[number];
  quads: readonly Quad[];
}

export async function validateRelease(
  options: ReleaseValidationOptions = {},
): Promise<ReleaseValidationResult> {
  const root = options.root ?? REPO_ROOT;
  const errors: string[] = [];
  const warnings: string[] = [];
  const parsedFiles: ParsedReleaseFile[] = [];

  for (const descriptor of ACTIVE_RELEASE_FILES) {
    try {
      parsedFiles.push({
        contents: await Deno.readTextFile(join(root, descriptor.file)),
        descriptor,
        quads: await parseRepoTurtle(root, descriptor.file),
      });
    } catch (error) {
      errors.push(
        `${descriptor.file}: could not parse Turtle: ${String(error)}`,
      );
    }
  }

  const versions = new Set<string>();

  for (const parsedFile of parsedFiles) {
    const version = validateReleaseFile(parsedFile, errors);
    if (version) {
      versions.add(version);
    }
  }

  let version = versions.size === 1 ? [...versions][0] : undefined;
  if (versions.size > 1) {
    errors.push(
      `active ontology files disagree on owl:versionInfo: ${
        [...versions].sort().join(", ")
      }`,
    );
  }

  if (options.expectedVersion) {
    if (!isSemver(options.expectedVersion)) {
      errors.push(
        `--version must be SemVer-shaped, got ${options.expectedVersion}`,
      );
    }
    if (version && version !== options.expectedVersion) {
      errors.push(
        `release metadata declares ${version}, but --version requested ${options.expectedVersion}`,
      );
    }
    version = options.expectedVersion;
  }

  if (version) {
    await validateReleaseNotes(root, version, parsedFiles, errors);
    await validateTagPolicy(root, version, options, errors);
  }

  return { version, errors, warnings };
}

export function parseReleaseValidateArgs(args: readonly string[]): {
  expectedVersion?: string;
  requireTag: boolean;
} {
  let expectedVersion: string | undefined;
  let requireTag = false;

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];

    if (arg === "--require-tag") {
      requireTag = true;
      continue;
    }

    if (arg === "--version") {
      const value = args[++index];
      if (!value) {
        throw new Error("--version requires a value");
      }
      expectedVersion = value;
      continue;
    }

    if (arg.startsWith("--version=")) {
      expectedVersion = arg.slice("--version=".length);
      continue;
    }

    throw new Error(`Unsupported argument: ${arg}`);
  }

  return { expectedVersion, requireTag };
}

async function validateReleaseNotes(
  root: string,
  version: string,
  parsedFiles: readonly ParsedReleaseFile[],
  errors: string[],
): Promise<void> {
  const notePath = `notes/ont.release-notes.v${version}.md`;
  let contents: string;

  try {
    contents = await Deno.readTextFile(join(root, notePath));
  } catch {
    errors.push(`${notePath}: release notes are required for v${version}`);
    return;
  }

  if (!contents.includes(`v${version}`)) {
    errors.push(`${notePath}: should mention v${version}`);
  }

  for (const { descriptor } of parsedFiles) {
    if (!contents.includes(descriptor.file)) {
      errors.push(`${notePath}: should list ${descriptor.file}`);
    }
  }

  for (const { descriptor } of parsedFiles) {
    if (!descriptor.pagesPublished) {
      continue;
    }

    const contentUrl =
      `${descriptor.ontologyIri}/releases/v${version}/ttl/${descriptor.file}`;
    if (!contents.includes(contentUrl)) {
      errors.push(`${notePath}: should list published payload ${contentUrl}`);
    }
  }
}

async function validateTagPolicy(
  root: string,
  version: string,
  options: ReleaseValidationOptions,
  errors: string[],
): Promise<void> {
  if (!options.requireTag) {
    return;
  }

  const tag = `v${version}`;
  const runGit = options.runGit ?? runGitCommand;

  let head: string;
  let tagCommit: string;

  try {
    head = await runGit(["rev-parse", "HEAD"], root);
  } catch (error) {
    errors.push(`could not resolve HEAD for tag validation: ${String(error)}`);
    return;
  }

  try {
    tagCommit = await runGit(["rev-list", "-n", "1", tag], root);
  } catch {
    errors.push(`required release tag ${tag} does not exist`);
    return;
  }

  if (head.trim() !== tagCommit.trim()) {
    errors.push(`required release tag ${tag} does not point at HEAD`);
  }
}

function validateReleaseFile(
  parsedFile: ParsedReleaseFile,
  errors: string[],
): string | undefined {
  const { contents, descriptor, quads } = parsedFile;
  const { file, namespaceUri, ontologyIri, prefix } = descriptor;
  const subject = ontologyIri;

  requireObjectPresent(quads, file, subject, RDF.type, OWL.Ontology, errors);

  const versionInfo = requireSingleObject(
    quads,
    file,
    subject,
    OWL.versionInfo,
    errors,
    { expectedLiteral: true },
  );
  const version = versionInfo?.value;

  if (!version || !isSemver(version)) {
    errors.push(`${file}: ontology owl:versionInfo must be SemVer-shaped`);
    return version;
  }

  const releaseIri = `${ontologyIri}/releases/v${version}`;
  const manifestationIri = `${releaseIri}/ttl`;
  const releasePayloadIri = `${manifestationIri}/${file}`;
  const versionIri =
    `https://raw.githubusercontent.com/semantic-flow/sflo/refs/tags/v${version}/${file}`;

  requireSingleObject(quads, file, subject, DCTERMS.hasVersion, errors, {
    expectedNamedNode: releaseIri,
  });
  requireSingleObject(quads, file, subject, OWL.versionIRI, errors, {
    expectedNamedNode: versionIri,
  });
  requireSingleObject(
    quads,
    file,
    subject,
    VANN.preferredNamespacePrefix,
    errors,
    { expectedLiteralValue: prefix },
  );
  requireSingleObject(
    quads,
    file,
    subject,
    VANN.preferredNamespaceUri,
    errors,
    { expectedLiteralValue: namespaceUri },
  );

  requireObjectPresent(quads, file, releaseIri, RDF.type, OWL.Ontology, errors);
  requireObjectPresent(
    quads,
    file,
    releaseIri,
    RDF.type,
    SFLO.HistoricalState,
    errors,
  );
  requireSingleObject(quads, file, releaseIri, DCTERMS.isVersionOf, errors, {
    expectedNamedNode: ontologyIri,
  });
  requireSingleObject(quads, file, releaseIri, OWL.versionInfo, errors, {
    expectedLiteralValue: version,
  });
  requireSingleObject(quads, file, releaseIri, SCHEMA.contentUrl, errors, {
    expectedNamedNode: releasePayloadIri,
  });
  requireSingleObject(quads, file, releaseIri, SFLO.hasManifestation, errors, {
    expectedNamedNode: manifestationIri,
  });
  requireSingleObject(quads, file, manifestationIri, DCAT.downloadURL, errors, {
    expectedNamedNode: releasePayloadIri,
  });

  const issued = requireSingleObject(
    quads,
    file,
    releaseIri,
    DCTERMS.issued,
    errors,
    { expectedLiteral: true },
  );
  if (issued?.termType === "Literal") {
    if (
      issued.datatype.value !== XSD.date ||
      !/^\d{4}-\d{2}-\d{2}$/.test(issued.value)
    ) {
      errors.push(`${file}: release dcterms:issued must be an xsd:date`);
    }
  }

  if (!contents.includes(`@base <${namespaceUri}> .`)) {
    errors.push(`${file}: @base should be ${namespaceUri}`);
  }

  for (const term of quads.flatMap(quadTerms)) {
    if (term.termType === "NamedNode" && term.value.includes("/release/")) {
      errors.push(
        `${file}: release paths must use plural /releases/: ${term.value}`,
      );
    }
  }

  return version;
}

function requireSingleObject(
  quads: readonly Quad[],
  file: string,
  subject: string,
  predicate: string,
  errors: string[],
  expectation: ObjectExpectation = {},
): Term | undefined {
  const objects = quads
    .filter((quad) =>
      quad.subject.value === subject && quad.predicate.value === predicate
    )
    .map((quad) => quad.object);

  if (objects.length !== 1) {
    errors.push(
      `${file}: expected exactly one ${compactIri(predicate)} on ${
        compactIri(subject)
      }, found ${objects.length}`,
    );
    return objects[0];
  }

  const [object] = objects;
  if (expectation.expectedNamedNode) {
    if (
      object.termType !== "NamedNode" ||
      object.value !== expectation.expectedNamedNode
    ) {
      errors.push(
        `${file}: expected ${
          compactIri(predicate)
        } to be <${expectation.expectedNamedNode}>, got ${formatTerm(object)}`,
      );
    }
  }

  if (expectation.expectedLiteral && object.termType !== "Literal") {
    errors.push(
      `${file}: expected ${compactIri(predicate)} to be a literal, got ${
        formatTerm(object)
      }`,
    );
  }

  if (expectation.expectedLiteralValue !== undefined) {
    if (
      object.termType !== "Literal" ||
      object.value !== expectation.expectedLiteralValue
    ) {
      errors.push(
        `${file}: expected ${compactIri(predicate)} literal ${
          JSON.stringify(expectation.expectedLiteralValue)
        }, got ${formatTerm(object)}`,
      );
    }
  }

  return object;
}

function requireObjectPresent(
  quads: readonly Quad[],
  file: string,
  subject: string,
  predicate: string,
  object: string,
  errors: string[],
): void {
  const found = quads.some((quad) =>
    quad.subject.value === subject &&
    quad.predicate.value === predicate &&
    quad.object.value === object
  );

  if (!found) {
    errors.push(
      `${file}: expected ${compactIri(subject)} ${
        compactIri(predicate)
      } <${object}>`,
    );
  }
}

async function parseRepoTurtle(
  root: string,
  relativePath: string,
): Promise<Quad[]> {
  const absolutePath = join(root, relativePath);
  const turtle = await Deno.readTextFile(absolutePath);
  return new Parser({ baseIRI: `file://${absolutePath}` }).parse(turtle);
}

async function runGitCommand(
  args: readonly string[],
  root: string,
): Promise<string> {
  const command = new Deno.Command("git", {
    args: [...args],
    cwd: root,
    stderr: "piped",
    stdout: "piped",
  });
  const output = await command.output();
  if (!output.success) {
    throw new Error(new TextDecoder().decode(output.stderr).trim());
  }
  return new TextDecoder().decode(output.stdout).trim();
}

function quadTerms(quad: Quad): readonly Term[] {
  return [quad.subject, quad.predicate, quad.object, quad.graph];
}

function isSemver(value: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(value);
}

function compactIri(value: string): string {
  return value
    .replace("http://www.w3.org/1999/02/22-rdf-syntax-ns#", "rdf:")
    .replace("http://www.w3.org/2002/07/owl#", "owl:")
    .replace("http://purl.org/dc/terms/", "dcterms:")
    .replace("http://www.w3.org/ns/dcat#", "dcat:")
    .replace("https://schema.org/", "schema:")
    .replace("http://purl.org/vocab/vann/", "vann:")
    .replace("https://semantic-flow.github.io/sflo/ontology/", "sflo:");
}

function formatTerm(term: Term): string {
  if (term.termType === "NamedNode") {
    return `<${term.value}>`;
  }
  if (term.termType === "Literal") {
    return JSON.stringify(term.value);
  }
  return `${term.termType}(${term.value})`;
}

interface ObjectExpectation {
  expectedLiteral?: boolean;
  expectedLiteralValue?: string;
  expectedNamedNode?: string;
}

if (import.meta.main) {
  try {
    const args = parseReleaseValidateArgs(Deno.args);
    const result = await validateRelease(args);
    if (result.errors.length > 0) {
      console.error("SFLO release validation failed:");
      for (const error of result.errors) {
        console.error(`- ${error}`);
      }
      Deno.exit(1);
    }

    const version = result.version ? `v${result.version}` : "unknown version";
    console.log(`SFLO release validation passed for ${version}.`);
  } catch (error) {
    console.error(`SFLO release validation could not run: ${String(error)}`);
    Deno.exit(1);
  }
}
