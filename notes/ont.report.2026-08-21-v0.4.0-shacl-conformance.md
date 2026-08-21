---
id: q7m2x9v4k1r8p5t3n6h0bca
title: v0.4.0 Cross-Engine SHACL Conformance
desc: 'Release-candidate semantic receipts for the SFLO content-digest corpus under PySHACL, public shacl-engine, the private Stagecraft adapter, and Apache Jena SHACL'
created: 1787367600000
---

## Scope

This report records the completed release-candidate gate from [[ont.task.2026.2026-08-21_1048-cross-engine-shacl-conformance]] for the SFLO v0.4.0 content-digest contract. All engines executed the same eleven cases from `tests/shacl/content-digest/cases.json`, the checked-out `semantic-flow-core-ontology.ttl`, and the checked-out `semantic-flow-core-shacl.ttl` at SFLO commit `7d4933a939ae33492dfc0e5e54503f31b8ccd2a9`.

## Execution Profile

- Data graph: union of the checked-out core ontology and one canonical case.
- Shapes graph: checked-out `semantic-flow-core-shacl.ttl`, unchanged between engines.
- Inference: none.
- SHACL-SPARQL: enabled.
- Warnings: retained as results and compared explicitly.
- Network/imports: disabled; every graph came from the checked-out SFLO source tree.
- Comparison: normalized case conformance, maximum severity, focus node, result path, constraint component, and stable message key. Report byte serialization, result order, and blank-node identifiers were ignored.

## Engines And Commands

| Engine | Version and adapter | Command |
| --- | --- | --- |
| PySHACL | 0.40.0 over RDFlib, SFLO graph-union adapter | `/tmp/sflo-v0.4.0-shacl-venv/bin/python scripts/validate_shacl.py --output /tmp/sflo-v0.4.0-pyshacl.json` |
| Public JavaScript | `shacl-engine` 1.1.2 with `shacl-engine/sparql.js` over a minimal N3 RDF/JS dataset | `deno task conformance:js -- --output /tmp/sflo-v0.4.0-shacl-engine.json` |
| Stagecraft private adapter | `shacl-engine` 1.1.2 and Oxigraph 0.5.9 through Stagecraft `createPopulationValidator`; Stagecraft commit `b83fcf6e22e81a4c74ba371ef22706003cb1baa7` | `node /tmp/sflo-stagecraft-shacl-adapter.mjs /home/djradon/hub/semantic-flow/weave/dependencies/github.com/semantic-flow/sflo /tmp/sflo-v0.4.0-stagecraft-shacl.json` |
| Apache Jena SHACL | 6.2.0, pinned and version-refusing | `deno task conformance:jena -- --output /tmp/sflo-v0.4.0-jena.json` |
| Comparator | SFLO normalized semantic comparator | `deno task conformance:compare -- /tmp/sflo-v0.4.0-pyshacl.json /tmp/sflo-v0.4.0-shacl-engine.json /tmp/sflo-v0.4.0-stagecraft-shacl.json /tmp/sflo-v0.4.0-jena.json` |

The comparator returned: `Compared 4 engines across 11 cases at 7d4933a939ae33492dfc0e5e54503f31b8ccd2a9; all normalized receipts agree.`

## Fixture Matrix

| Case | Expected and observed outcome | Maximum severity | Stable result keys |
| --- | --- | --- | --- |
| `valid-manifestation-target-resolution` | conforms | none | none |
| `valid-manifestation-file` | conforms | none | none |
| `valid-downstream-bearer` | conforms | none | none |
| `valid-historical-observation-after-expectation-change` | conforms | none | none |
| `invalid-untyped-observed-grammar` | rejects | Violation | `observed-digest-grammar` |
| `invalid-standing-same-method` | rejects | Violation | `standing-same-method` |
| `invalid-manifestation-file-mismatch` | rejects | Violation | `manifestation-file-digest-mismatch` |
| `invalid-observed-same-method` | rejects | Violation | `observed-same-method` |
| `invalid-repository-standing-digest` | rejects | Violation | `repository-standing-digest`, `explicit-bearer-type` Warning |
| `invalid-repository-expected-observed` | rejects | Violation | `repository-expected-digest`, `repository-observed-digest`, `expected-digest-spec-type` Warning |
| `warning-untyped-bearer` | rejects under the release warning policy | Warning | `explicit-bearer-type` |

Every engine matched the manifest exactly after normalization. There were no unexplained differences in conformance, severity, focus node, result path, constraint component, or message key.

## Adjudicated Portability Findings

Three real source issues were corrected before the final agreeing run:

- `shacl-engine` 1.1.2 compiles only one `sh:sparql` constraint reliably per node shape. The digest grammar/uniqueness and explicit-bearer advisory now live on separate source node shapes with the same target. No engine-specific shape rewrite is used.
- Warning severity had been attached to nested `sh:sparql` constraint nodes, where PySHACL applied the default Violation severity. The explicit-bearer and expected-digest subject-typing advisories now carry `sh:severity sh:Warning` on dedicated node shapes; violation-level lexical and placement constraints remain violations.
- The core ontology release state pointed at an untyped manifestation with no located-file link, so ontology-plus-case validation produced an unrelated warning. Release manifestation and located-file metadata are now explicit and self-conforming.

The public JavaScript runner uses Deno 2.9.2 and its physical npm compatibility directory because `shacl-engine/sparql.js` does not resolve under cache-only mode. The previous Deno 2.7.14 CI pin also fails to resolve the plugin's transitive `cross-fetch/polyfill` entry even in physical mode, so ordinary SFLO CI now pins 2.9.2. The realized local dependency tree was 75 MiB. This is test/release tooling only; neither SFLO nor Weave adopted Oxigraph as runtime code.

## Receipt Digests

- PySHACL: `sha256:24fa2758dbfbaf6511a01fc500c108c24d61e4fb147418850c5bf3c339c09cc6`
- Public `shacl-engine`: `sha256:6184adae3ff0672721cbf293ea492fdbdbc17ba0e3fe90326242a211e4de7f7c`
- Stagecraft adapter: `sha256:7daa95c9f2eb4722097014053c439890406c22ab837fd21e24025aa49192a6de`
- Apache Jena SHACL: `sha256:060f9f1020aef61e88edc86668382027013b538800e14fba0e7698e995b07dd1`

These digests bind the exact local JSON receipt files produced by the commands above. The durable semantic evidence is the engine/version/commit/profile/matrix and adjudication recorded in this note.

## Gate Result

PASS. Cross-engine conformance does not block SFLO v0.4.0 preparation. The gate must be rerun after any later change to the canonical fixture manifest, core ontology graph support used by the corpus, or core SHACL shapes.
