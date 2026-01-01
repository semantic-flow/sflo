---
id: 205eyjs4r1er5qeie3413ed
title: Why Do Nonfile Resources End with Slashes
desc: ''
updated: 1766024502221
created: 1766024062765
---

Semantic Flow uses trailing slashes because **every non-file resource must have a non-file identifier**, and `/` is the simplest, most portable way to enforce that.

In RDF, `…/x` and `…/x/` are **different IRIs**; the slash is not cosmetic.

We use `/` to address the httprange-14 ambiguity: **non-file IRIs identify things that are not byte-stream files**, even if they can be represented by files.

File IRIs (artifacts) do **not** end in `/` and identify actual retrievable files (e.g., `.ttl`, `.jsonld`).

On GitHub Pages, requesting a directory without `/` often redirects to the slash form, **unless a same-named file exists**, in which case behavior changes.

Always using `/` for non-files prevents collisions between “resource” and “resource file” (`/bio/` vs `/bio`).

This also makes relative-IRI resolution predictable for transposable meshes.
