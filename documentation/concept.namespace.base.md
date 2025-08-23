---
id: f2dk7cwbol4o1jsnd0cun1g
title: namespace base
desc: publishing platform URL prefix for a site
updated: 1755850940233
created: 1750486049862
---

## Overview

The namespace base is the URL prefix under which a [[concept.semantic-site]] publishes all mesh identifiers. It is outside the mesh’s folder tree and is determined by the hosting platform.

- Concept vs content URL semantics: see [[concept.url]]
- Transposability guidance (avoid hardcoded bases): see [[principle.transposability]]
- Publication history patterns: see [[concept.publication]]

Only sites have a namespace base. Meshes (and sites) also have a [[concept.root-node]], which corresponds to the top-level folder of the mesh.

## Platform mappings (GitHub Pages examples)

- User/Org site base:
  - `https://org.github.io/`
  - Mesh path `/ns/people/alice/` publishes at `https://org.github.io/ns/people/alice/`
- Project site base with a [[concept.mesh-repo]]:
  - `https://org.github.io/repo/`
  - Mesh path `/ns/people/alice/` publishes at `https://org.github.io/repo/ns/people/alice/`
- Project site base with an [[concept.mesh.embedded]]

## Guidance

- Prefer relative or site-root-absolute paths inside the mesh; do not hardcode full base IRIs so the mesh remains portable across hosting locations (see [[concept.url.reference-path-choices]]).
- The base is a deployment concern; the mesh folder tree should be valid regardless of where it is served.
