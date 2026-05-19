---
id: 551jgelsrwdpe00fr8xdu7z
title: 2026 03 24 Release Runbook
desc: ''
updated: 1779081485062
created: 1779073532998
---

## Goals

- Define an SFLO ontology release runbook that humans can actually follow.
- Record v0.1.0 release notes for the first tagged ontology release.
- Specify two GitHub Actions workflows: one to re-generate ResourcePages from the current mesh, and one to run SFLO release validation.
- Keep weave validation distinct from SFLO release validation.
- Avoid re-weaving or versioning ontology payloads as a side effect of ResourcePage regeneration.
- Keep the task open until prepare/publication symmetry is far enough along for automated publication to be boring.
- Give the job and prov ontologies consistent namespaces and metadata.

## Summary

The first durable output is [[ont.dev.release-runbook]], plus [[ont.release-notes.v0.1.0]] for the current release. Those notes are useful now, but the CI shape should be updated before we build the GitHub Actions workflows.

There should be two actions:

- Re-generate Resource Pages: optionally run `weave validate`, then regenerate ResourcePages from the current mesh state. This action does not run payload weaving, does not version payloads, and does not decide whether ontology source files have changed.
- Release: run SFLO release validation over source Turtle, release notes, version metadata, and publication expectations. This action does not generate pages by default, but can expose a checkbox/input to generate after release validation passes.

Because the first action re-renders existing mesh state instead of appending payload states, it is not blocked on append-onlyish inventory work. The bigger sequencing concern is still prepare/publication symmetry: before we wire publication commits into Actions, Weave should stop treating branch-published meshes as a special `prepare gh-pages` command shape. See [[wa.task.2026.2026-05-18_0627-remove-prepare]] and [[wa.task.2026.2026-05-17_2206-prepare-symmetry]].

## Discussion

### What Is In Place

- [[ont.dev.release-runbook]] documents source release checks, Turtle validation, version metadata checks, tagging, Pages publication, and post-publish checks.
- [[ont.release-notes.v0.1.0]] documents the first tagged ontology release and the current Pages publication boundary.
- The Weave CLI docs now distinguish in-place sidecar meshes from detached publication roots in [[wu.cli-reference]].
- Weave has separate commands for validation, generation, and versioning, even though the branch-published publication path still needs cleanup.

### Action: Re-generate Resource Pages

The ResourcePage action should operate on the current mesh and published/publication worktree as they already exist. It is for cases such as improved page templates, styling, renderer fixes, identifier-page metadata, or repaired generated output.

The action should have at least one checkbox/input:

- run weave validation before generating, default `true`.

The operation should be conceptually:

- optionally run `weave validate`;
- run ResourcePage generation for the configured mesh/publication root;
- report whether generated files changed;
- optionally commit or open a PR only after the publication symmetry task has settled the safe command path.

This action should not call top-level `weave`, should not call `weave version`, and should not infer "expected semantic change" from source-file dirtiness. If working ontology files do not match the latest woven payload states, that may be reported by a future informational check, but it should not block ordinary page regeneration by default.

### Action: Release

The release action is about SFLO source/release correctness, not page rendering by default. It should run SFLO release validation first, then optionally generate pages after validation passes if the caller checks an input such as `generate_after_validation`.

SFLO release validation should include source and release-policy checks such as:

- Turtle syntax/shape validation for active ontology source files.
- Consistent release metadata, including `owl:versionInfo`, `dcterms:hasVersion`, release `dcterms:issued`, `owl:versionIRI`, `schema:contentUrl`, and `dcat:downloadURL` where applicable.
- Release notes presence and consistency with the version being released.
- Expected source payloads are present and use the intended public IRIs.
- Job/prov ontology namespace and metadata decisions are respected once those are settled.
- Optional post-deploy fetch/validation of published Pages Turtle when a publish step exists.

The release action should not generate pages by default. That keeps release validation usable as a fast, policy-focused check and avoids surprising publication diffs during tag or release-candidate workflows.

### Validation Split

There are two different validations here:

- Weave validation checks the mesh and generated/current Semantic Flow surfaces: RDF graph integrity, local-path leakage, stale generated output where applicable, source binding consistency, and publication-root invariants.
- SFLO release validation checks the ontology release itself: Turtle validity, version metadata, release notes, namespace policy, expected source payloads, and tag/version consistency.

### What Is Not Settled

The release runbook still has to describe current commands rather than the ideal release command. For v0.1.0, branch-published payload setup still leans on `prepare gh-pages`; that is acceptable for a manual runbook but too asymmetric for durable CI design.

An unconditional top-level `weave` is not safe as a release-action habit. Regenerating ResourcePages should be generation, not payload weaving. Creating a new payload state should be an explicit versioning operation, eventually controlled by the payload-focused `weave set history`, `weave set next-state`, and `weave version` surface described in [[wa.task.2026.2026-05-18_0627-remove-prepare]].

The GitHub Actions work should therefore be staged:

- source validation and metadata checks can be automated first;
- ResourcePage regeneration can be automated once the exact command path is stable;
- automatic publication commits should wait for prepare/publication symmetry;
- append-onlyish inventory is not a blocker for the ResourcePage regeneration action because that action should not append payload states.

## Open Issues

- Should SFLO publish job/prov ontology IRIs under the existing `/sflo/` project Pages mesh, a separate project, or a top-level `https://semantic-flow.github.io/ontology/...` publication surface?
- What exact workflow inputs should the ResourcePage action expose beyond `run_weave_validate`?
- What exact workflow inputs should the release action expose beyond `generate_after_validation`?
- Should either action commit directly to `gh-pages`, open a PR, or only upload an artifact until the publication symmetry work is done?
- Should the release action validate only source Turtle, or also fetch and validate published Pages Turtle after deployment?
- Should source-vs-latest-woven drift be reported as an informational release check, a warning, or left out for now?

## Decisions

- Keep this task open; do not rename it to a completed note yet.
- Treat [[ont.dev.release-runbook]] as the current manual release guide, not the final CI contract.
- Model CI as two actions: Re-generate Resource Pages, and Release.
- The ResourcePage action regenerates pages from current mesh state and does not re-weave or version payloads.
- The ResourcePage action should offer a `weave validate` checkbox/input, defaulting to enabled unless the final workflow has a better reason to skip it.
- The release action runs SFLO release validation and does not generate pages by default.
- The release action may offer a checkbox/input to generate pages after release validation passes.
- Keep weave validation and SFLO release validation separate in docs, workflow names, and failure messages.
- Do not add an unconditional top-level `weave` step to release automation.
- Use plural `releases` for release ArtifactHistory paths.
- Treat job/prov as source-tagged for v0.1.0 until their public IRI publication topology is settled.
- Do not treat append-onlyish inventory as a blocker for ResourcePage regeneration; do treat prepare/publication symmetry as a blocker before automated publication commits.

## Contract Changes

- Manual release validation should include `riot --validate` over all active Turtle files.
- Release metadata should align `owl:versionInfo`, `dcterms:hasVersion`, release `dcterms:issued`, `owl:versionIRI`, `schema:contentUrl`, and `dcat:downloadURL`.
- The ResourcePage regeneration workflow must call generation, not payload weaving/versioning.
- The release workflow must call SFLO release validation, not page generation, unless the caller explicitly enables post-validation generation.
- Publication automation should report no-op, update, and conflict cases before committing generated output.
- Repeated ResourcePage generation over unchanged renderer/config/current mesh state should be a no-op or identical-output operation.

## Testing

- For current documentation-only work, run `git diff --check`.
- Before closing this task, add release-validation coverage for active Turtle files and release metadata.
- Before closing this task, add ResourcePage-action coverage that proves the action runs validation/generation without appending payload states.
- Before closing this task, add coverage for the `run_weave_validate` input.
- Before closing this task, add coverage for the release action's `generate_after_validation` input.
- Before closing this task, add or confirm release-action coverage for post-publish fetch and Turtle validation of Pages release payloads.

## Non-Goals

- Do not solve all GitHub Pages publication topology questions in the runbook note itself.
- Do not move or rename this task note until the human explicitly asks.
- Do not add compatibility shims for pre-v1 generated mesh shapes just to make release automation easier.
- Do not make the SFLO release action push publication changes until the prepare/publication contract is trustworthy.
- Do not make ResourcePage regeneration imply payload versioning.

## Implementation Plan

- [x] Add the durable manual release runbook in [[ont.dev.release-runbook]].
- [x] Add v0.1.0 release notes in [[ont.release-notes.v0.1.0]].
- [x] Document the current Pages publication boundary for v0.1.0.
- [x] Clarify in Weave CLI docs that `prepare gh-pages` is detached-publication-root orchestration and currently one source payload per invocation.
- [ ] Decide the public topology for job/prov ontology IRIs.
- [ ] Finish or unblock [[wa.task.2026.2026-05-18_0627-remove-prepare]] and [[wa.task.2026.2026-05-17_2206-prepare-symmetry]] enough that branch-published meshes use the same conceptual operations as sidecar meshes.
- [ ] Update [[ont.dev.release-runbook]] to reflect the two-action model.
- [ ] Add an SFLO release-validation script or command covering source Turtle, release metadata, release notes, namespace policy, and tag/version consistency.
- [ ] Add a GitHub Actions workflow for "Re-generate Resource Pages" with a `run_weave_validate` input.
- [ ] Add a GitHub Actions workflow for "Release" with a `generate_after_validation` input.
- [ ] Add a publication dry-run/reporting step once the publication command path is stable.
- [ ] Add a manually approved publication path that commits/pushes or opens a PR only when the dry-run is non-empty and expected.
- [ ] Update [[ont.dev.release-runbook]] after the action exists so the manual and automated paths agree.
