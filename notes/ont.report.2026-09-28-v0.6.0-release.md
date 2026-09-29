---
id: bd95b0ea-f6a9-43ab-bee7-4542177dbcaa
title: v0.6.0 Release Receipt
desc: 'Published SFLO v0.6.0 source tag, resolutionSpec contract, three-engine SHACL agreement, GitHub Pages, and live byte-identity receipts'
created: 1790641695959
---

## Result

SFLO `v0.6.0` was published on 2026-09-28. The release adds `sflo:resolutionSpec` and `sflo-shacl:LocatedFileResolutionSpecShape`, requires persisted `RepositorySourceFloatingLocator` values to be named IRIs, and publishes the corresponding source tag, validation corpus, immutable Pages payloads, and generated vocabulary pages.

## Source And Tag

- Source commit and peeled annotated tag: `f18e1c07623d8cfb57a0c898b26aba65fc9553df`.
- Annotated tag object: `fbc8239a4dfc72f57a512b3edf47caecffb816fd`.
- Main CI: `https://github.com/semantic-flow/sflo/actions/runs/36502184700`, success at the source commit.
- Release metadata validation: `deno task release:validate -- --version 0.6.0 --require-tag`, pass.
- All five `https://raw.githubusercontent.com/semantic-flow/sflo/refs/tags/v0.6.0/semantic-flow-*.ttl` surfaces fetched successfully, matched local tag bytes, and parsed under Riot.

Immutable raw-tag SHA-256 receipts:

- config: `82b454586fa745d6e9b9dc715d9e6dfb966423d2341c0bb893a4c1bd46760cc7`
- core: `92eac15a3303fb89d282e88cc45e5268efd5582058848234670f1728cb1daa01`
- core SHACL: `310249d099f6d3bbfb3a13e8e377996215658ea9f143d6118acf37339c39b760`
- job: `a60d622a3729f6e40f5d27d4627763b90379b5747df62865f06569eea7fd746f`
- provenance: `47e1ec194b913635a3111b54cea59913c69afb6da0b8bb780a061c8d473562e7`

The tagged source inventory, contract behavior, and known limitations are in [[ont.release-notes.v0.6.0]]. Job and provenance remain tagged source vocabulary; they are not `/sflo/` Pages payloads.

## Cross-Engine SHACL

The final tag commit rerun compared PySHACL 0.40.0, public `shacl-engine` 1.1.2, and Apache Jena SHACL 6.2.0. All three matched the 19-case manifest exactly under the graph profile defined in [[ont.dev.release-runbook]].

Final receipt bundle digests at source commit `f18e1c07623d8cfb57a0c898b26aba65fc9553df`:

- PySHACL: `sha256:ddf7aaeec1c7782d7a7832066a855e059547f8e14631c4fdf45834e44bc9404c`.
- Public `shacl-engine`: `sha256:d4d602df2e6ef44ee41af7eb4875b9509debdffae44671332b88ceff3116da20`.
- Apache Jena SHACL: `sha256:cb3cb93534b5e3648263781f05cf934783be11dc2056c6b735a532b1f70333c2`.

The initial receipt comparison exposed result-order differences only: the engines agreed on the result graphs but serialized their result arrays in different orders. The release commit makes receipt canonicalization order-insensitive, adds a regression test for reordered results, and preserves all substantive comparison fields.

The private Stagecraft adapter was not requested as an explicit SFLO gate. No private-consumer receipt is claimed; the release uses the public three-engine matrix required by the runbook.

## Pages Publication

- Pages source branch commit: `c7c45bbb2d4f3e9fb722e779eb8541a4262a1755`.
- Pages deployment: `https://github.com/semantic-flow/sflo/actions/runs/36503094700`, success.
- Generated at fixed page timestamp `2026-09-28T17:21:00-07:00`; same-timestamp repeat generation created 0 and updated 0 pages.
- Publication census: 376 ResourcePages, 1,517 Turtle files, 3,430 publication files.
- `weave validate mesh`: 2 selected designator paths, 0 findings.
- `weave validate publication`: 0 findings.
- Every publication Turtle file parsed under Riot.
- No host-local `/home/` or `/tmp/` path appears in published Turtle.
- No anonymous persisted `RepositorySourceFloatingLocator` remains in the publication mesh. The seven affected current registry documents now use stable named locator IRIs.
- All v0.3.0, v0.4.0, and v0.5.0 release payload Turtle files remained byte-identical to the prior Pages commit.

Live immutable payloads returned 200, matched the tagged source byte-for-byte, and parsed under Riot:

- `https://semantic-flow.github.io/sflo/ontology/releases/v0.6.0/ttl/semantic-flow-core-ontology.ttl`
- `https://semantic-flow.github.io/sflo/config/releases/v0.6.0/ttl/semantic-flow-config-ontology.ttl`
- `https://semantic-flow.github.io/sflo/ontology/shacl/releases/v0.6.0/ttl/semantic-flow-core-shacl.ttl`

Current artifact ResourcePages returned 200 and link the v0.6.0 release payload:

- `https://semantic-flow.github.io/sflo/ontology/`
- `https://semantic-flow.github.io/sflo/config/`
- `https://semantic-flow.github.io/sflo/ontology/shacl/`

New ResourcePages returned 200, reference the v0.6.0 source state, and emit the expected slashless canonical link:

- `https://semantic-flow.github.io/sflo/ontology/resolutionSpec/`
- `https://semantic-flow.github.io/sflo/ontology/shacl/LocatedFileResolutionSpecShape/`

## Deferred Work

- The local `main` branches in the sidecar and Alice fixture repositories remain intentionally untouched. They point to obsolete May fixture-ladder histories while canonical remotes contain regenerated and merged August ladders; reconciliation should preserve an archive ref before repointing either local branch.
- Job and provenance ontology Pages topology remains unsettled.
