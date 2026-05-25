---
id: p9g0h6xqn3igqbawtjwr8rm
title: Semantic Flow identifier
desc: ''
updated: 1773890827253
created: 1773890727274
---

- aka: "Semantic Flow IRI"

## Definition

A `Semantic Flow identifier` is a public IRI formed in the context of a `SemanticMesh` from:

- the mesh's `meshBase`
- a `Knop`'s `designatorPath`

That public IRI denotes the referent.

## Why It Matters

A Semantic Flow identifier is the thing people cite, dereference, and use in RDF statements about the referent.

It is the public-facing identifier in the model, while its associated `Knop` provides supporting structure around it.

## Formation

In the current core model:

- a `Knop` carries a mesh-relative `designatorPath`
- a `SemanticMesh` carries a `meshBase`
- the Semantic Flow identifier is formed from `meshBase + designatorPath`

Example:

- `meshBase`: `https://example.org/`
- `Knop.designatorPath`: `alice/bio`
- Semantic Flow identifier: `https://example.org/alice/bio`

## Related Concepts

The Semantic Flow identifier is not the same thing as its paired support resources:

- `Knop`
  - the mesh-managed support object
  - conventionally exposed at `D/_knop`
  - carries `designatorPath`, payload, metadata, inventory, and other support structure

Each Semantic Flow identifier is associated one-to-one with one `Knop`.

The mesh may also contain many other IRIs for support resources such as mesh metadata, inventory, Knops, historical states, manifestations, located files, and resource pages.

Those are ordinary IRIs for mesh-managed resources in the serialization surface. They are not Semantic Flow identifiers unless they are the public IRI formed from `meshBase + Knop.designatorPath`.

## What It Is Not

- It is not just any IRI.
- It is not the same thing as a `Knop`.
- It is not just a raw string path; the modeled path value is `designatorPath`.
- It is not just a designator; the designator is the mesh-local path form, while the Semantic Flow identifier is the full IRI.

In prose, `designator` can be used as shorthand for the mesh-relative naming form, and the modeled value is `Knop.designatorPath`.

## Dereferencing

If you put a Semantic Flow identifier into a browser, it should resolve to a useful human-facing resource page.

In hierarchy-backed serializations, non-file referents may still be served from folder-backed `index.html` pages even when the canonical Semantic Flow identifier is slashless.

## See Also

- [[ont.summary.core]]
- [[ont.use-case.biographical-data-publishing]]
- [[sf.principles]]
