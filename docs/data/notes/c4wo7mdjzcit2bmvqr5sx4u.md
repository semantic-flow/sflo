
A Semantic Flow mesh repository (or mesh repo for short) is a git repository that contains a [[concept.root-node]] at the top of the repo, and any number of additional, contained [[mesh-resource.node]]


## Github Repos

- can either be "username/org pages repository"" (which automatically hosts content at the namesake IRI, so maybe call it a namesake repository, e.g. djradon.github.io) or 2nd-level (corresponding to an owned repo)
- under "classic" github pages (i.e., "deploy from a branch"), you can either use the whole repo, or just the docs folder as the source; Semantic Flow works seamlessly using the entire folder for mesh repos.
  - for [[concept.mesh.embedded]] repos, a build step will be needed to copy the mesh folders and files into "docs"
  
## Questions

- can you include a mesh in an existing repo?
  - Sure! That's an [[concept.mesh.embedded]].
  - but when composing a mesh from existing meshes, (i.e., linking a repo into an existing mesh) you need an unbroken chain, so embedding a root mesh below the top of a repo might make it harder for people to re-use. 
