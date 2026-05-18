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
- Specify the eventual GitHub Actions release check/publish workflow without pretending the current Weave publication commands are already symmetric enough.
- add a github action for "regenerate mesh"
- Keep the task open until the inventory idempotence and prepare/publication symmetry work is far enough along for automated release publication to be boring.
- give the job and prov ontologies consitent namespaces and metadata

## Summary

The first durable output is [[ont.dev.release-runbook]], plus [[ont.release-notes.v0.1.0]] for the current release. Those notes are useful now, but the fully automated release action should wait.

The desired action is still: validate the ontology source, confirm release metadata, check the publication plan, and publish or update the `gh-pages` mesh only when necessary. The blocker is not the ontology prose; it is the publication contract. Weave currently has `prepare gh-pages` for detached publication roots and primitive `mesh create` / `integrate` / `weave` commands for in-place sidecar meshes. That split is understandable, but it makes release automation too command-shape-aware. See [[wa.task.2026.2026-05-17_2206-prepare-symmetry]].

The second blocker is inventory churn. A release action needs repeatable no-op behavior when source bytes, source metadata, target release state, and config have not changed. That depends on append-onlyish inventory semantics: append settled facts, no-op matching facts, and fail closed on conflicting facts rather than rewriting inventory blocks. See [[wa.task.2026.2026-05-17-append-onlyish-inventory]].
namesp
## Discussion

### What Is In Place

- [[ont.dev.release-runbook]] documents source release checks, Turtle validation, version metadata checks, tagging, Pages publication, and post-publish checks.
- [[ont.release-notes.v0.1.0]] documents the first tagged ontology release and the current Pages publication boundary.
- The Weave CLI docs now distinguish in-place sidecar meshes from detached publication roots in [[wu.cli-reference]].
- `prepare gh-pages --dry-run` now reports when no publication file changes would be made.

### What Is Not Settled

The release runbook still has to describe current commands rather than the ideal release command. For v0.1.0, each source payload needs its own `prepare gh-pages` invocation. That is acceptable for a manual runbook but awkward for CI. A future manifest/batch prepare command should let a release action name all published payloads once.

An unconditional top-level `weave` after `prepare gh-pages` is not safe as a release-action habit. `prepare gh-pages` already runs the needed weave work for the payload it materializes. A later top-level `weave` is still appropriate after operations that create un-woven candidates, such as term extraction, but it can currently rewrite generated HTML pages even when no new histories are created.

The GitHub Action should therefore be staged:

- source validation and metadata checks can be automated first
- publication dry-run checks can be added once the publication command shape is stable enough
- automatic publication commits should wait for inventory idempotence and prepare symmetry

## Open Issues

- Should SFLO publish job/prov ontology IRIs under the existing `/sflo/` project Pages mesh, a separate project, or a top-level `https://semantic-flow.github.io/ontology/...` publication surface?
- What should the batch prepare manifest look like for multi-payload ontology releases?
- Should the release action run only dry-run publication checks by default, with a manually approved publish job, or should it push `gh-pages` on tag creation?
- Should generated ResourcePage timestamps be removed, pinned, or otherwise controlled so no-op release actions do not rewrite HTML?
- Should the release action validate only source Turtle, or also fetch and validate published Pages Turtle after deployment?

## Decisions

- Keep this task open; do not rename it to a completed note yet.
- Treat [[ont.dev.release-runbook]] as the current manual release guide, not the final CI contract.
- Do not add an unconditional top-level `weave` step to release automation until top-level `weave --dry-run` or ResourcePage no-op stability exists.
- Use plural `releases` for release ArtifactHistory paths.
- Treat job/prov as source-tagged for v0.1.0 until their public IRI publication topology is settled.

## Contract Changes

- Manual release validation should include `riot --validate` over all active Turtle files.
- Release metadata should align `owl:versionInfo`, `dcterms:hasVersion`, release `dcterms:issued`, `owl:versionIRI`, `schema:contentUrl`, and `dcat:downloadURL`.
- Publication automation must be able to distinguish no-op, append/update, and conflict cases before writing or committing.
- Repeated publication of the same release target should not rewrite inventory.

## Testing

- For current documentation-only work, run `riot --validate` over active Turtle files and `git diff --check`.
- Before closing this task, add or confirm Weave-side tests for `prepare gh-pages --dry-run` no-op reporting.
- Before closing this task, add or confirm Weave-side tests for repeated `prepare gh-pages` over unchanged source metadata.
- Before closing this task, add or confirm Weave-side tests for release-target publication that appends new release facts but does not rewrite old inventory.
- Before closing this task, add or confirm release-action coverage for post-publish fetch and Turtle validation of Pages release payloads.

## Non-Goals

- Do not solve all GitHub Pages publication topology questions in the runbook note itself.
- Do not move or rename this task note until the human explicitly asks.
- Do not add compatibility shims for pre-v1 generated mesh shapes just to make release automation easier.
- Do not make the SFLO release action push publication changes until the no-op/conflict contract is trustworthy.

## Implementation Plan

- [x] Add the durable manual release runbook in [[ont.dev.release-runbook]].
- [x] Add v0.1.0 release notes in [[ont.release-notes.v0.1.0]].
- [x] Document the current Pages publication boundary for v0.1.0.
- [x] Clarify in Weave CLI docs that `prepare gh-pages` is detached-publication-root orchestration and currently one source payload per invocation.
- [ ] Decide the public topology for job/prov ontology IRIs.
- [ ] Finish or unblock [[wa.task.2026.2026-05-17_2206-prepare-symmetry]] enough to define a batch/manifest release prepare command.
- [ ] Finish or unblock [[wa.task.2026.2026-05-17-append-onlyish-inventory]] enough that repeated publication is no-op for unchanged release inputs.
- [ ] Add a GitHub Actions workflow that validates source Turtle and release metadata.
- [ ] Extend the action with publication dry-run checks.
- [ ] Add a manually approved publication path that commits/pushes `gh-pages` only when the dry-run is non-empty and expected.
- [ ] Update [[ont.dev.release-runbook]] after the action exists so the manual and automated paths agree.
