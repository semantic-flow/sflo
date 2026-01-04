---
id: tnd9qwrp52hzzq9dtijquyn
title: Knop Local Name
desc: ''
updated: 1765662556880
created: 1765637893412
---

A **knop local name** is the final path segment in the mesh filesystem or URL layout. It is a *not-necessarily-unique*, *path-derived* label used for naming [[distribution|mesh-resource.component.distribution]] files — not an identifier in the semantic sense.

Knop local names do **not** determine the subject’s identity but, as a part of the path (and therefore the Knop's IRI), they contribute to it.

---

## **Definition**

* A **knop local name** is:

  * the last path component in the knop’s directory, e.g.
    `…/people/alice/` → knopLocalName = `"alice"`

* It exists for:

  * human readability and usability
  * predictable naming of distributions

* It is *not*:

  * unique across the mesh
  * represented explicitly in mesh RDF
  * necessarily present in intramesh identifiers

---

## **Relationship to Intramesh Identifiers**

Intramesh identifiers are:

* relative-IRI-like locators: `../../`, `characters/hero/_payload/_current/`, etc.
* used by the mesh to denote:

  * referents (“things in the world”),
  * flows, distributions, knop handles, and other knop components.

Crucially:

* **Intramesh identifiers do *not* need to (and often do not) contain the knop local name.**
  Example:

  * The knop’s own *subject intramesh IRI* is always `<../../>`
    — a structural locator, not the string `"alice"` or `"monster"`.
  * The knop's own *handle* is `<../../_knop-handle/>`


The two concepts serve different layers:

| Concept                             | Purpose                                 | May contain knopLocalName?   |
| ----------------------------------- | --------------------------------------- | ---------------------------- |
| **Knop local name**                 | Naming the folder representing the knop | yes                          |
| **Intramesh identifier**            | Denoting resources & referents in RDF   | not required; usually **no** |
| **Subject intramesh id (`../../`)** | Canonical IRI for the referent          | **never** contains it        |

---

## **Path = Identity (for knops)**

For knops as mesh constructs:

* The **path itself** is the identity.
* Changing the path creates a *new knop*, unless explicitly linked via redirects.

Thus:

* `…/people/alice/` and `…/members/alice/` are **distinct knops**, even if their contents are identical.
* The knopLocalName `"alice"` is part of the path, but does not itself guarantee identity.

Knop identity is **path-based**, not name-based.

---

## **Moves, Redirects, and Conceptual Continuity**

A filesystem rename is **not** a semantic rename.
Instead, the system provides a *knop move operation* via `sflo-cli` or API:

1. **Old location**:

   * Distributions remain.
   * `_current` slices acquire a redirect statement.
   * Resource pages show a “moved” banner.

2. **New location**:

   * Working folders and distributions are copied.
   * `_meta/_working` includes post-move metadata for weave.

The system can then express:

```ttl
<old/_knop-handle> sflo:isSameKnopAs <new/_knop-handle> .
```

—without reusing identifiers.

These are *distinct* knops with **conceptual continuity** provided by explicit relations.

---

## **Why Not Call It an “Identifier”?**

Because:

* It is not guaranteed to be unique across the mesh.
* It is not stable across moves.

Calling it an “identifier” would strongly imply semantics it does not have.

**“KnopLocalName” or simply “Knop Name” is accurate and honest.**

---

## **Usage Guidelines**

* Users choose meaningful names for knops (folders).
* Avoid leading underscores (`_`) —reserved for system facets.
* Changing a knop name changes its path
* If continuity is desired, use the official move operation to create redirect metadata.

---

## **Summary**

A **knop local name** is:

* the last path segment of a knop’s folder,
* a human-facing naming element,
* neither unique nor semantically authoritative,
* not necessarily a part of and [[concept.identifier.intramesh]],
* not an identity mechanism,
* but central to the filesystem structure and distribution naming conventions.




