---
id: 6fcb5f8d-283c-483b-bfc6-f4d45f47e196
title: v0.5.0 Release Receipt
desc: 'Published SFLO v0.5.0 source tag, three-engine SHACL agreement, GitHub Pages, and live byte-identity receipts'
created: 1787503800000
---

## Result

SFLO `v0.5.0` was published on 2026-08-23. The source tag, immutable raw files, generated `/sflo/` Pages mesh, current artifact ResourcePages, versioned payloads, and the three new founding vocabulary/shape pages passed their release gates.

## Source And Tag

- Source commit and peeled annotated tag: `cf10917ee759901f40226e65a3c24b6824459b25`.
- Annotated tag object: `b783461ac93c627deced5abaff356ca28eb6d1e3`.
- Main CI: `https://github.com/semantic-flow/sflo/actions/runs/32654106737`, success at the source commit.
- Pre-release contract CI: `https://github.com/semantic-flow/sflo/actions/runs/32653914874`, success at `cf7e79a5`.
- Release metadata validation: `deno task release:validate -- --version 0.5.0 --require-tag`, pass.
- All five `https://raw.githubusercontent.com/semantic-flow/sflo/refs/tags/v0.5.0/semantic-flow-*.ttl` surfaces fetched successfully, matched local tag bytes, and parsed under Riot.

Immutable raw-tag SHA-256 receipts:

- config: `1062836d98594b1998c5313c9333ea4bf3b8ae1bdb8f7a972172c95bc7031314`
- core: `20a8c282038152f6c71bdcc4b7777686df2e544fe587379b074f941df7147871`
- core SHACL: `d5e2f2939b554391c8ec69e00f388138e754753b11216a3f6199ceb8e5e8634b`
- job: `416e614fb21cab8fec95923a1ce972dab6f3d9b0984b0a3775fcff1fa6641165`
- provenance: `cf5ae6d2b05e13de83e8b030f92604dd3e2ecf1cbcb118cd99d44d603f91531a`

The tagged source inventory and changed behavior are in [[ont.release-notes.v0.5.0]]. Job and provenance remain tagged source vocabulary; they are not `/sflo/` Pages payloads.

## Cross-Engine SHACL

The final tag commit rerun compared PySHACL 0.40.0, public `shacl-engine` 1.1.2, and Apache Jena SHACL 6.2.0. All three matched the 14-case manifest exactly under the graph profile defined in [[ont.dev.release-runbook]].

Final receipt bundle digests at source commit `cf10917ee759901f40226e65a3c24b6824459b25`:

- PySHACL: `sha256:e10d3ea64358f3a194cdbf675d9b4940dc129cea00cd39c55c955aabc7d716e0`.
- Public `shacl-engine`: `sha256:e39d386623fe7e272e1948a0f731bf8b64b55ea8b56f98df5fa861f9e3b60a06`.
- Apache Jena SHACL: `sha256:57444496e1fccf36d2934486592c60f588aa1ae5cd97853eb91eca3efbae5793`.

The private Stagecraft adapter was not an explicit SFLO gate for this additive warning slice: the current Stagecraft checkout has not yet wired FoundingReferentData. No private-consumer receipt is claimed. The same shapes and cases remain executable through the public RDF/JS path that the adapter wraps.

## Pages Publication

- Pages source branch commit: `cc416147f61c6ead9cd9110cf4a34fb9b75e40f8`.
- Pages deployment: `https://github.com/semantic-flow/sflo/actions/runs/32654532757`, success.
- Generated at fixed page timestamp `2026-08-23T10:18:42-07:00`; a clean Weave `398c6f8` same-timestamp verification created 0 and updated 0 pages.
- Publication census: 374 Knops, 1,506 Turtle files, 3,402 publication files.
- Change from the v0.4.0 Pages tip: 1,922 files changed, including three new founding identifiers and refreshed exact-source references/pages for terms whose governing artifact advanced to v0.5.0.
- `weave validate mesh`: 3 selected/pending checks, 0 findings.
- `weave validate publication`: 0 findings.
- Every publication Turtle file parsed under Riot.
- No host-local `/home/` or `/tmp/` path appears in published Turtle.
- The three portable floating repository source registries carry none of the standing, expected, or observed digest properties.
- The three v0.4.0 release payloads remained byte-identical to the prior Pages commit.

Live immutable payloads returned 200, matched the tagged source byte-for-byte, and parsed under Riot:

- `https://semantic-flow.github.io/sflo/ontology/releases/v0.5.0/ttl/semantic-flow-core-ontology.ttl`
- `https://semantic-flow.github.io/sflo/config/releases/v0.5.0/ttl/semantic-flow-config-ontology.ttl`
- `https://semantic-flow.github.io/sflo/ontology/shacl/releases/v0.5.0/ttl/semantic-flow-core-shacl.ttl`

Current artifact ResourcePages returned 200 and link the v0.5.0 release payload and immutable raw tag URL:

- `https://semantic-flow.github.io/sflo/ontology/`
- `https://semantic-flow.github.io/sflo/config/`
- `https://semantic-flow.github.io/sflo/ontology/shacl/`

New ResourcePages returned 200 and emit the expected slashless canonical link:

- `https://semantic-flow.github.io/sflo/ontology/FoundingReferentData/`
- `https://semantic-flow.github.io/sflo/ontology/hasFoundingReferentData/`
- `https://semantic-flow.github.io/sflo/ontology/shacl/FoundingReferentDataShape/`

## Deferred Work

- Stagecraft has not yet adopted the new runtime/API surface; the coordinated Weave v0.9.0 release proves direct CLI/API and packed-library behavior without claiming unavailable downstream wiring.
- FoundingReferentData ResourcePage semantics remain undefined; the pages above dereference the vocabulary class/property/shape, not individual founding artifacts.
- Job and provenance ontology Pages topology remains unsettled.
