---
id: 4b9afsut6cakxh55iabvirt
title: Composability
desc: ''
updated: 1751237165789
created: 1751233874377
---

//TODO: re-verify this ai-generated content

## Overview

Composability is the ability to combine multiple meshes or extract submeshes to create new, functional semantic structures. Semantic Flow enables flexible mesh composition through git-native operations and intelligent reference resolution.

## Key Concepts

### Mesh Boundaries

Each git repository represents a complete mesh with its own root namespace. Cross-mesh references use absolute URIs, while intra-mesh references use relative URIs.

### Upward Reference Problem

When extracting submeshes, upward references can break. For example, if something within `ns/djradon/bio/` references `../../` (pointing to `ns/djradon/`), that reference will break if only the `bio/` subtree is copied elsewhere.

### Weaving Process Solution

During weaving, tools:
1. **Scan for broken relatives**: Check all relative URLs in the mesh
2. **Convert broken ones**: Replace with absolute URLs using canonical publication data
3. **Leave working relatives alone**: Preserve transposability where possible

After weaving, submeshes are semantically complete and can be composed using standard file operations.

## Incorporating External Meshes

### Importing (No External Connection)

Import meshes or submeshes as permanent copies with no ongoing connection to the source:

```bash
# Method 1: Git archive (clean, can target specific paths)
git archive --remote=https://github.com/djradon/mesh.git main ns/djradon/ | tar -x -C collaborators/
git add collaborators/djradon/
git commit -m "Import djradon's mesh"

# Method 2: Download and copy
curl -L https://github.com/djradon/mesh/archive/main.zip -o mesh.zip
unzip mesh.zip
cp -r mesh-main/ns/djradon/ collaborators/djradon/
git add collaborators/djradon/
git commit -m "Import djradon's mesh"
```

The imported content becomes permanently part of your repository with no external dependencies.

### Embedding (Maintains External Connection)

Embed external meshes while maintaining a connection for updates:

```bash
# Import with ongoing connection to source repo
git subtree add --prefix=collaborators/djradon/ https://github.com/djradon/mesh.git main --squash

# Update embedded mesh later
git subtree pull --prefix=collaborators/djradon/ https://github.com/djradon/mesh.git main --squash
```

The embedded content becomes part of your repository and site, but you can pull updates from the source repository.

### Directory Structure After Incorporation

```
your-mesh/
├── _flow/                           # Your mesh metadata
├── _handle/
├── ns/
│   └── yourdata/
└── collaborators/
    └── djradon/                     # Imported/embedded mesh - served as static files
        ├── _flow/                   # Their mesh metadata
        ├── _handle/
        └── ns/
            └── djradon/
```

All files are served directly as static content when the repository is published (e.g., via GitHub Pages).

## Extracting Submeshes

### Post-Weave Extraction

After weaving resolves broken references, any subtree becomes a semantically complete mesh that can be copied using standard file operations:

```bash
# Copy submesh to create standalone mesh
cp -r ns/djradon/ ../standalone-mesh/

# Copy submesh to another location (e.g., for backup)
rsync -av collaborators/alice/ backup/alice/
```

### Pre-Weave Considerations

Before weaving, analyze upward dependencies:
- Identify references that point outside the intended extraction boundary
- Determine if the extracted submesh will be semantically complete
- Consider whether broken references should become absolute URLs

## Cross-Mesh References

### Between Independent Meshes

References between separate mesh repositories use absolute URIs:

```turtle
# Reference to external mesh
<> foaf:knows <https://alice.github.io/mesh/ns/alice/> .
```

### Discovery Patterns

**TBD**: Standardized mechanisms for:
- Mesh discovery and registration
- Stable cross-mesh URI patterns
- Handling moved or unavailable external meshes

## Composition Patterns

### Collaborative Collection

Multiple researchers contributing to a shared mesh:

```bash
# Add each contributor's mesh
git subtree add --prefix=contributors/alice/ https://alice.example/mesh.git main
git subtree add --prefix=contributors/bob/ https://bob.example/mesh.git main
```

### Organizational Hierarchy

Department-level meshes within institutional mesh:

```bash
# Add department submeshes
git subtree add --prefix=departments/cs/ https://github.com/cs-dept/mesh.git main
git subtree add --prefix=departments/bio/ https://github.com/bio-dept/mesh.git main
```

### Temporal Snapshots

Preserving historical versions of external meshes:

```bash
# Import specific version
git subtree add --prefix=snapshots/2024/djradon/ https://github.com/djradon/mesh.git v2024.1
```

## Best Practices

### For Mesh Designers

1. **Minimize upward references** in submesh boundaries to reduce weaving complexity
2. **Design clear extraction points** - consider which subtrees should be independently viable
3. **Document dependencies** - note which parts of the mesh reference external components
4. **Use semantic boundaries** - align mesh structure with logical domain boundaries

### For Mesh Composers

1. **Choose import vs embed** based on maintenance needs - import for permanent copies, embed for ongoing updates
2. **Import entire meshes** rather than attempting partial extraction from external repos
3. **Weave before extraction** to ensure semantic completeness
4. **Maintain incorporation metadata** - track source repositories and versions
5. **Test extracted submeshes** independently before distribution

### For Cross-Mesh References

1. **Use absolute URIs** for references to external meshes
2. **Prefer stable, canonical URIs** over temporary or redirect-based URLs
3. **Document external dependencies** for mesh consumers
4. **Consider fallback strategies** for unavailable external resources

## Workflow Integration

### Development Workflow
1. Incorporate external meshes using import (permanent) or embed (updateable) as needed
2. Work with relative references for local development
3. Weave before sharing to resolve broken dependencies
4. Test extracted submeshes independently

### Maintenance Workflow
1. For embedded meshes: periodically update with `git subtree pull`
2. For imported meshes: manually re-import if updates are needed
3. Re-weave after updates to handle any new broken references
4. Validate that composition still functions correctly
5. Update documentation of external dependencies

## TBD Items

- **Cross-mesh reference protocols**: Standardized discovery and resolution mechanisms
- **Version compatibility**: Handling version mismatches between composed meshes
- **Dependency management**: Tools for tracking and updating external mesh dependencies
- **Conflict resolution**: Handling namespace or identifier conflicts between composed meshes
- **Performance optimization**: Efficient composition strategies for large meshes

Composability enables Semantic Flow meshes to be combined and extracted flexibly while maintaining semantic integrity through intelligent tooling and clear design patterns.