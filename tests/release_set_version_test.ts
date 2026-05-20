import { assertEquals } from "@std/assert";
import { dirname, fromFileUrl, join } from "@std/path";
import {
  parseReleaseSetVersionArgs,
  setReleaseVersion,
} from "../scripts/release_set_version.ts";
import { validateRelease } from "../scripts/release_validate.ts";

const REPO_ROOT = fromFileUrl(new URL("../", import.meta.url));
const RELEASE_FIXTURE_FILES = [
  "semantic-flow-core-ontology.ttl",
  "semantic-flow-core-shacl.ttl",
  "semantic-flow-config-ontology.ttl",
  "semantic-flow-job-ontology.ttl",
  "semantic-flow-prov-ontology.ttl",
  "notes/ont.release-notes.v0.1.1.md",
] as const;

Deno.test("release set-version rewrites active Turtle metadata for validation", async () => {
  const root = await copyReleaseFixture();

  const result = await setReleaseVersion({
    issued: "2026-05-20",
    root,
    version: "0.1.1",
  });

  assertEquals(result.changedFiles, [
    "semantic-flow-core-ontology.ttl",
    "semantic-flow-core-shacl.ttl",
    "semantic-flow-config-ontology.ttl",
    "semantic-flow-job-ontology.ttl",
    "semantic-flow-prov-ontology.ttl",
  ]);

  const validation = await validateRelease({
    expectedVersion: "0.1.1",
    root,
  });
  assertEquals(validation.errors, []);
});

Deno.test("release set-version dry-run reports changes without writing files", async () => {
  const root = await copyReleaseFixture();

  const result = await setReleaseVersion({
    dryRun: true,
    issued: "2026-05-20",
    root,
    version: "0.1.1",
  });

  assertEquals(result.changedFiles.length, 5);

  const validation = await validateRelease({
    expectedVersion: "0.1.1",
    root,
  });
  assertEquals(
    validation.errors.some((error) =>
      error.includes('expected owl:versionInfo literal "0.1.1"')
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

async function copyReleaseFixture(): Promise<string> {
  const root = await Deno.makeTempDir({ prefix: "sflo-release-" });

  for (const relativePath of RELEASE_FIXTURE_FILES) {
    const source = join(REPO_ROOT, relativePath);
    const destination = join(root, relativePath);
    await Deno.mkdir(dirname(destination), { recursive: true });
    await Deno.copyFile(source, destination);
  }

  return root;
}
