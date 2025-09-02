---
id: c4wo7mdjzcit2bmvqr5sx4u
title: mesh repo
desc: ''
updated: 1756767742297
created: 1729878955236
---

A Semantic Flow mesh repository (or mesh repo for short) is a git repository that contains a [[concept.root-node]] at the top of the repo, and any number of additional, contained [[mesh-resource.node]]


## Github Repos

- can either be "username/org pages repository"" (which automatically hosts content at the namesake IRI, so maybe call it a namesake repository, e.g. djradon.github.io) or 2nd-level (corresponding to an owned repo)
- a 'docs' folder that contains the generated sf site
    - within 'docs' there's a folder for each namespace
  
## Questions

- can you include a mesh in an existing repo?
  - Sure!
  - but for composability (i.e., linking a repo into an existing mesh) you need an unbroken chain, so embedding a root mesh below the top of a repo might make it harder for people to re-use. 
