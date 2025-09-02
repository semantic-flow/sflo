---
id: f2dk7cwbol4o1jsnd0cun1g
title: namespace base
desc: publishing platform IRI prefix for a site
updated: 1756767742301
created: 1750486049862
---

## Overview

The namespace base is the IRI prefix under which a [[concept.semantic-flow-site]] publishes all mesh identifiers. It is outside the mesh’s folder tree and is determined by the hosting platform.

- Concept vs content IRI semantics: see [[concept.identifier]]
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

- Prefer relative or site-root-absolute paths inside the mesh; do not hardcode full base IRIs so the mesh remains portable across hosting locations (see [[faq.reference-iri-choices]]).
- The base is a deployment concern; the mesh folder tree should be valid regardless of where it is served.
