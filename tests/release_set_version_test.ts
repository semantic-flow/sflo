import { assertEquals } from "@std/assert";
import { dirname, fromFileUrl, join } from "@std/path";
import {
  parseReleaseSetVersionArgs,
  setReleaseVersion,
} from "../scripts/release_set_version.ts";
import {
  ACTIVE_RELEASE_FILES,
  releaseIris,
} from "../scripts/release_metadata.ts";
import { validateRelease } from "../scripts/release_validate.ts";

const REPO_ROOT = fromFileUrl(new URL("../", import.meta.url));
const RELEASE_FIXTURE_FILES = [
  "semantic-flow-core-ontology.ttl",
  "semantic-flow-core-shacl.ttl",
  "semantic-flow-config-ontology.ttl",
  "semantic-flow-job-ontology.ttl",
  "semantic-flow-prov-ontology.ttl",
] as const;
const ISSUE_DATE = "2026-05-20";

Deno.test("release set-version rewrites active Turtle metadata for validation", async () => {
  const targetVersion = await nextReleaseVersion();
  const root = await copyReleaseFixture(targetVersion);

  const result = await setReleaseVersion({
    issued: ISSUE_DATE,
    root,
    version: targetVersion,
  });

  assertEquals(result.changedFiles, [
    "semantic-flow-core-ontology.ttl",
    "semantic-flow-core-shacl.ttl",
    "semantic-flow-config-ontology.ttl",
    "semantic-flow-job-ontology.ttl",
    "semantic-flow-prov-ontology.ttl",
  ]);

  const validation = await validateRelease({
    expectedVersion: targetVersion,
    root,
  });
  assertEquals(validation.errors, []);
});

Deno.test("release set-version dry-run reports changes without writing files", async () => {
  const targetVersion = await nextReleaseVersion();
  const root = await copyReleaseFixture(targetVersion);

  const result = await setReleaseVersion({
    dryRun: true,
    issued: ISSUE_DATE,
    root,
    version: targetVersion,
  });

  assertEquals(result.changedFiles.length, 5);

  const validation = await validateRelease({
    expectedVersion: targetVersion,
    root,
  });
  assertEquals(
    validation.errors.some((error) =>
      error.includes(`expected owl:versionInfo literal "${targetVersion}"`)
    ),
    true,
  );
});

Deno.test("release set-version argument parser supports task separators", () => {
  assertEquals(
    parseReleaseSetVersionArgs([
      "--",
      "--version",
      "0.1.1",
      "--issued",
      "2026-05-20",
      "--dry-run",
    ]),
    {
      dryRun: true,
      issued: "2026-05-20",
      root: undefined,
      version: "0.1.1",
    },
  );
});

async function copyReleaseFixture(targetVersion: string): Promise<string> {
  const root = await Deno.makeTempDir({ prefix: "sflo-release-" });

  for (const relativePath of RELEASE_FIXTURE_FILES) {
    const source = join(REPO_ROOT, relativePath);
    const destination = join(root, relativePath);
    await Deno.mkdir(dirname(destination), { recursive: true });
    await Deno.copyFile(source, destination);
  }

  const notePath = join(root, `notes/ont.release-notes.v${targetVersion}.md`);
  await Deno.mkdir(dirname(notePath), { recursive: true });
  await Deno.writeTextFile(notePath, releaseNoteFixture(targetVersion));

  return root;
}

async function nextReleaseVersion(): Promise<string> {
  const result = await validateRelease({ root: REPO_ROOT });
  assertEquals(result.errors, []);
  const version = result.version;
  if (!version) {
    throw new Error("current release version could not be determined");
  }

  const [major, minor, patch] = version.split(".").map(Number);
  return `${major}.${minor}.${patch + 1}`;
}

function releaseNoteFixture(version: string): string {
  const files = ACTIVE_RELEASE_FILES.map((descriptor) =>
    `- ${descriptor.file}`
  );
  const publishedPayloads = ACTIVE_RELEASE_FILES
    .filter((descriptor) => descriptor.pagesPublished)
    .map((descriptor) =>
      `- ${releaseIris(descriptor, version).releasePayloadIri}`
    );

  return [
    `# Semantic Flow ontology v${version}`,
    "",
    ...files,
    ...publishedPayloads,
    "",
  ].join("\n");
}
