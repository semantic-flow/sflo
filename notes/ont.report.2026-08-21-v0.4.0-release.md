---
id: w8n3x6v1k4r9p2t5m7h0bca
title: v0.4.0 Release Receipt
desc: 'Published SFLO v0.4.0 source tag, CI, cross-engine SHACL, GitHub Pages, and live byte-identity receipts'
created: 1787367600000
---

## Result

SFLO `v0.4.0` was published on 2026-08-21. The source tag, immutable raw files, generated `/sflo/` Pages mesh, current artifact ResourcePages, versioned payloads, and new term pages passed their release gates.

## Source And Tag

- Source commit and peeled annotated tag: `e9c03c2b4e903f9bc6a19018128f362da5a4f044`.
- Annotated tag object: `afdac4dacc25e3078073a6781f0bd76c15ec4aa4`.
- Pull request: `https://github.com/semantic-flow/sflo/pull/2`, merged by direct reviewed fast-forward to the same source commit.
- Main CI: `https://github.com/semantic-flow/sflo/actions/runs/32525497607`, success at the source commit.
- Release metadata validation: `deno task release:validate -- --version 0.4.0 --require-tag`, pass.
- All five `https://raw.githubusercontent.com/semantic-flow/sflo/refs/tags/v0.4.0/semantic-flow-*.ttl` surfaces fetched successfully, matched the local tag bytes, and parsed under Riot.

The tagged source inventory and changed behavior are in [[ont.release-notes.v0.4.0]]. Job and provenance remain tagged source vocabulary; they are not `/sflo/` Pages payloads.

## Cross-Engine SHACL

The final tag commit rerun compared PySHACL 0.40.0, public `shacl-engine` 1.1.2, the Stagecraft `shacl-engine` 1.1.2/Oxigraph 0.5.9 adapter at Stagecraft `b83fcf6e22e81a4c74ba371ef22706003cb1baa7`, and Apache Jena SHACL 6.2.0. All four matched the eleven-case manifest exactly under the graph profile recorded in [[ont.report.2026-08-21-v0.4.0-shacl-conformance]].

Final receipt bundle digests at source commit `e9c03c2b4e903f9bc6a19018128f362da5a4f044`:

- PySHACL: `sha256:39783ca0e17300d5b7426efeb57567f6ff0e99e50e1338b600df307277da7cb4`.
- Public `shacl-engine`: `sha256:1d3a47742f9f9ef0b85031b8df5be9badf4db58d7dbb8edeb3ec2d42065d265f`.
- Stagecraft adapter: `sha256:4d3f79dae680c35f636ea3d47fe437c27e2d175bada3c310302e630a2126e050`.
- Apache Jena SHACL: `sha256:b14c0e8f78a61b880e2415b72d09299d1b9fde78122732c1b3c8dabbe06ffdaa`.

## Pages Publication

- Pages source branch commit: `72d1837937a506621e56360e723842b68e1b8156`.
- Pages deployment: `https://github.com/semantic-flow/sflo/actions/runs/32525587690`, success.
- Generated with Weave commit `55b4f002c76f17805c7f7dd43fdaf146e37f9c30` at fixed page timestamp `2026-08-21T13:41:42-07:00`.
- Publication census: 371 Knops, 1,491 Turtle files, 3,360 publication files.
- Change from the prior Pages tip: 2,268 files changed, including 9 new digest/SHACL identifiers and reference-catalog ResourcePages for existing extracted terms.
- `weave validate mesh`: 9 pending-designator checks, 0 findings after weaving.
- `weave validate publication`: 0 findings.
- A second `weave generate` at the fixed timestamp created 0 and updated 0 pages.
- Every publication Turtle file parsed under Riot.
- No host-local `/home/` or `/tmp/` path appears in published Turtle.
- The three portable floating repository source registries carry none of the standing, expected, or observed digest properties.
- The three v0.3.0 release payloads remained byte-identical to the prior Pages commit.

Live immutable payloads returned 200, matched the tagged source byte-for-byte, and parsed under Riot:

- `https://semantic-flow.github.io/sflo/ontology/releases/v0.4.0/ttl/semantic-flow-core-ontology.ttl`
- `https://semantic-flow.github.io/sflo/config/releases/v0.4.0/ttl/semantic-flow-config-ontology.ttl`
- `https://semantic-flow.github.io/sflo/ontology/shacl/releases/v0.4.0/ttl/semantic-flow-core-shacl.ttl`

Current artifact ResourcePages returned 200 and linked the v0.4.0 release payload and immutable raw tag URL:

- `https://semantic-flow.github.io/sflo/ontology/`
- `https://semantic-flow.github.io/sflo/config/`
- `https://semantic-flow.github.io/sflo/ontology/shacl/`

Representative new ResourcePages returned 200 and emitted the expected slashless canonical link:

- `https://semantic-flow.github.io/sflo/ontology/ContentDigestBearer/`
- `https://semantic-flow.github.io/sflo/ontology/contentDigestMethod_sha256/`
- `https://semantic-flow.github.io/sflo/ontology/extractedFrom/`
- `https://semantic-flow.github.io/sflo/ontology/shacl/ContentDigestBearerTypingShape/`

Mutable project-root raw aliases are not part of the established mesh and return 404. Current artifact pages point to the latest governed release payload instead. [[ont.dev.release-runbook]] now verifies that actual topology rather than claiming a mutable `/sflo/semantic-flow-core-ontology.ttl` alias exists.

## Release-Gate Repairs

Dogfooding the live v0.3.0 mesh found two Weave defects before Pages publication. Weave commit `8e29b3e` moves a late carried `sfcfg:` declaration before an inserted next-state hint so `set next-state` remains valid Turtle. Weave commit `55b4f00` preserves every repeated source-registry subject block, preventing versioning from dropping the registry's `DigitalArtifact`, `RdfDocument`, and working-file facts. Both fixes have fail-on-old regression tests and passed Weave's full 841-test CI gate.

## Deferred Work

- The current artifact raw aliases mentioned by an older runbook command remain intentionally absent; adding governed mutable copies would be a separate publication-topology decision.
- Job and provenance ontology Pages topology remains unsettled.
- Weave `v0.8.0` publication and the Stagecraft press-flow release-candidate smoke are tracked by the active release task; they are not SFLO source or Pages blockers after this receipt.
