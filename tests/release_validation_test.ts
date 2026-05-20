import { assert, assertEquals } from "@std/assert";
import { fromFileUrl } from "@std/path";
import {
  parseReleaseValidateArgs,
  validateRelease,
} from "../scripts/release_validate.ts";

const REPO_ROOT = fromFileUrl(new URL("../", import.meta.url));

Deno.test("release validation accepts the current source release metadata", async () => {
  const result = await validateRelease({ root: REPO_ROOT });

  assertEquals(result.version, "0.1.0");
  assertEquals(result.errors, []);
});

Deno.test("release validation can pin the expected release version", async () => {
  const result = await validateRelease({
    expectedVersion: "9.9.9",
    root: REPO_ROOT,
  });

  assert(
    result.errors.some((error) =>
      error.includes("release metadata declares 0.1.0")
    ),
  );
  assert(
    result.errors.some((error) =>
      error.includes(
        'semantic-flow-core-ontology.ttl: expected owl:versionInfo literal "9.9.9"',
      )
    ),
  );
  assert(
    result.errors.some((error) =>
      error.includes(
        "semantic-flow-core-ontology.ttl: expected dcterms:hasVersion to be <https://semantic-flow.github.io/sflo/ontology/releases/v9.9.9>",
      )
    ),
  );
  assert(
    result.errors.some((error) =>
      error.includes(
        "semantic-flow-config-ontology.ttl: expected exactly one schema:contentUrl on https://semantic-flow.github.io/sflo/config/releases/v9.9.9",
      )
    ),
  );
});

Deno.test("release validation can require the release tag to point at HEAD", async () => {
  const result = await validateRelease({
    root: REPO_ROOT,
    requireTag: true,
    runGit: (args) => {
      if (args.join(" ") === "rev-parse HEAD") {
        return "abc123";
      }
      if (args.join(" ") === "rev-list -n 1 v0.1.0") {
        return "def456";
      }
      throw new Error(`unexpected git args: ${args.join(" ")}`);
    },
  });

  assertEquals(result.errors, [
    "required release tag v0.1.0 does not point at HEAD",
  ]);
});

Deno.test("release validation argument parser supports version and tag flags", () => {
  assertEquals(
    parseReleaseValidateArgs(["--", "--version", "0.1.1", "--require-tag"]),
    {
      expectedVersion: "0.1.1",
      requireTag: true,
    },
  );
  assertEquals(parseReleaseValidateArgs(["--version=0.1.1"]), {
    expectedVersion: "0.1.1",
    requireTag: false,
  });
});
