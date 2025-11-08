

## Overview

The **namespace context** is the URL under which a [[concept.semantic-flow-site]] publishes all mesh identifiers. It "contains" the mesh and so is outside the mesh’s namespace. It is determined by the hosting platform.

Sites have a namespace context that starts with `http://` or `https://`.

Filesystem-based meshes have a namespace context that starts with `file://`.

The context is a deployment concern; a [[woven|concept.weave-process]] mesh should be valid regardless of where it is served.

## Platform mappings 

### GitHub Pages

- User/Org site:
  - namespace context: `https://org.github.io/`
  - Mesh namespace `/ns/people/alice/` publishes at `https://org.github.io/ns/people/alice/`
- Project site context:
  - `https://org.github.io/repo/`
  - Mesh path `/ns/people/alice/` publishes at `https://org.github.io/repo/ns/people/alice/`

These mappings can be accomplished with both [[concept.mesh-repo]]s and [[concept.mesh.embedded]]

