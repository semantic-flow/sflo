---
id: hd2p5bn9ynaum1acfrlwkyo
title: Release Runbook
desc: ''
updated: 1779072991662
created: 1779072991662
---

## Purpose

This runbook is for source and publication releases of the Semantic Flow ontology repo. It covers the source tag on `main`, the branch-published GitHub Pages mesh, and the checks needed before publishing a release.

For ontology modeling guidance, read [[ont.dev.guidance]], [[ont.summary.core]], and [[ont.purpose]] before making release-shaping changes.

## Release Surfaces

- Source repo: `git@github.com:semantic-flow/sflo.git`
- Source branch: `main`
- Publication branch: `gh-pages`
- Local source checkout convention: `sflo`
- Local publication worktree convention: `sflo-gh-pages`
- Project Pages base: `https://semantic-flow.github.io/sflo/`
- Current v0.1.0 source tag: `v0.1.0`

The source tag and Pages publication are separate release surfaces. Do not assume a term is publicly dereferenceable merely because a Turtle file exists in the source tag. The Pages branch must contain the generated resource page or release payload at the intended URL.

## Version Policy

Use SemVer-shaped ontology versions such as `0.1.0`, and tag them as `v0.1.0`.

Before cutting a release, every actively released Turtle file should agree on:

- `owl:versionInfo`
- `dcat:hasVersion`
- the release resource's `owl:versionInfo`
- `dcterms:issued`
- `owl:versionIRI`
- `schema:contentUrl`
- `dcat:downloadURL`

Use plural `releases/` paths for release history resources and release payload URLs.

## Preflight

Start from clean source and publication worktrees:

```sh
git status --short
git -C ../sflo-gh-pages status --short
```

Review pending changes and make sure unrelated edits are either intentionally part of the release or left out:

```sh
git diff --stat
git diff
```

After choosing the release version and issue date, update deterministic source metadata:

```sh
deno task release:set-version -- --version 0.1.0 --issued 2026-05-17
```

This command only updates release metadata in the active Turtle files. It does not create release notes, create tags, commit, push, generate Pages output, or infer release intent from source changes.

Check version metadata:

```sh
rg 'versionInfo|hasVersion|versionIRI|contentUrl|downloadURL|releases/v0\.1\.0' semantic-flow-*.ttl
deno task release:validate -- --version 0.1.0
```

Run the sflo-owned Deno guardrails for active ontology and SHACL files:

```sh
python3 -m pip install --requirement requirements-shacl.txt
deno task ci
```

The Python dependency executes the shipped SHACL-SPARQL constraints against positive and negative fixtures. Deno tests continue to own RDF graph guardrails and targeted structural checks; both layers are required because a present-but-broken `sh:select` query is not useful validation.

Validate Turtle syntax:

```sh
riot --validate semantic-flow-core-ontology.ttl semantic-flow-core-shacl.ttl semantic-flow-config-ontology.ttl semantic-flow-job-ontology.ttl semantic-flow-prov-ontology.ttl
```

Check for whitespace damage:

```sh
git diff --check
```

## Source Release

Commit the source release on `main` with a semantic summary line and useful release details:

```sh
git add README.md notes semantic-flow-*.ttl LICENSE NOTICE
git commit -m "docs(ontology): prepare v0.1.0 release" -m "- align ontology version metadata and release URLs
- document release scope and validation status
- add release runbook"
```

Create an annotated tag:

```sh
git tag -a v0.1.0 -m "Semantic Flow ontology v0.1.0"
```

Push source and tag:

```sh
git push origin main
git push origin v0.1.0
```

After pushing, confirm the tag resolves to the intended commit:

```sh
git rev-parse v0.1.0
git ls-remote --tags origin v0.1.0
deno task release:validate -- --version 0.1.0 --require-tag
```

## Pages Publication

Use the Weave CLI from an installed release or a local Weave checkout. Keep runtime logs out of the publication worktree unless you are deliberately inspecting them:

```sh
export WEAVE_LOG_DIR=/tmp/weave-logs
```

`weave prepare gh-pages` has been removed. A Pages publication run is composed from ordinary mesh operations: create or open the publication mesh, validate it, generate ResourcePages from the current mesh state, and then review/commit the publication worktree when that is the intended release output.

For a new local publication worktree, bootstrap the mesh support surface explicitly:

```sh
weave mesh create \
  --workspace ../sflo-gh-pages \
  --mesh-base 'https://semantic-flow.github.io/sflo/' \
  --publication-profile github-pages
```

The GitHub Pages publication profile currently only handles the host preset needed for Pages, such as `.nojekyll`. Weave does not create or manage `CNAME`; custom-domain files remain human-owned.

For an existing publication mesh, validate and regenerate pages from the current mesh state:

```sh
weave validate mesh --mesh-root ../sflo-gh-pages
weave validate publication --mesh-root ../sflo-gh-pages
weave generate --mesh-root ../sflo-gh-pages
```

This regeneration path must not be confused with payload versioning. It re-renders ResourcePages and other generated publication surfaces from already governed state. It does not copy source Turtle files, fetch source repositories, or append ontology payload states.

For v0.1.0, the Pages publication surface included:

- `ontology/releases/v0.1.0/ttl/semantic-flow-core-ontology.ttl`
- `ontology/shacl/releases/v0.1.0/ttl/semantic-flow-core-shacl.ttl`
- `config/releases/v0.1.0/ttl/semantic-flow-config-ontology.ttl`

The source tag also contains `semantic-flow-job-ontology.ttl` and `semantic-flow-prov-ontology.ttl`, but those files use `https://semantic-flow.github.io/ontology/job/` and `https://semantic-flow.github.io/ontology/prov/` namespaces rather than the `/sflo/` project Pages base. Do not list those as project-page-published artifacts until their publication topology is explicitly settled.

Publishing a new versioned ontology payload into a detached `gh-pages` worktree still depends on the generic `integrate` source-binding work in Weave. The replacement path should bind source checkout bytes as repository-backed working, latest-state, or exact sources without copying them into the publication mesh, then run explicit payload versioning and generation. Until that source-binding surface exists, do not rebuild CI around a local copy/import workaround or a removed `prepare` wrapper.

After generation or manual publication edits, inspect the publication branch and commit/push only when the status shows intentional changes:

```sh
git -C ../sflo-gh-pages status --short
git -C ../sflo-gh-pages log --oneline --decorate --max-count=3
git -C ../sflo-gh-pages add .
git -C ../sflo-gh-pages commit -m 'Publish Semantic Flow ontology v0.1.0'
git -C ../sflo-gh-pages push origin gh-pages
```

## Post-Publish Checks

Verify current and release payloads:

```sh
curl -fsSL https://semantic-flow.github.io/sflo/semantic-flow-core-ontology.ttl >/tmp/sflo-core.ttl
curl -fsSL https://semantic-flow.github.io/sflo/ontology/releases/v0.1.0/ttl/semantic-flow-core-ontology.ttl >/tmp/sflo-core-v0.1.0.ttl
curl -fsSL https://semantic-flow.github.io/sflo/config/releases/v0.1.0/ttl/semantic-flow-config-ontology.ttl >/tmp/sflo-config-v0.1.0.ttl
curl -fsSL https://semantic-flow.github.io/sflo/ontology/shacl/releases/v0.1.0/ttl/semantic-flow-core-shacl.ttl >/tmp/sflo-shacl-v0.1.0.ttl
riot --validate /tmp/sflo-core.ttl /tmp/sflo-core-v0.1.0.ttl /tmp/sflo-config-v0.1.0.ttl /tmp/sflo-shacl-v0.1.0.ttl
```

Spot-check human-facing pages:

```sh
curl -fsSL https://semantic-flow.github.io/sflo/ontology/ArtifactHistory/ >/tmp/sflo-artifact-history.html
curl -fsSL https://semantic-flow.github.io/sflo/config/Config/ >/tmp/sflo-config-page.html
```

## Release Note Checklist

- [ ] Summary states what the release is for.
- [ ] Release surfaces distinguish source tag, Pages publication, and any source-only vocabulary.
- [ ] Highlights name the major vocabulary areas.
- [ ] Breaking or changed behavior calls out removed or unsupported older surfaces.
- [ ] Validation names the commands actually run.
- [ ] Known limitations are direct about publication gaps and unstable pre-1.0 modeling.

## Commit Message Template

```text
docs(ontology): document v0.1.0 release

- add v0.1.0 release notes
- add the ontology release runbook covering source tags and Pages publication
- record the current Pages publication boundary for job/prov vocabulary
```
