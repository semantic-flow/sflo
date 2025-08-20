---
id: c0dzq31sldfjnznpzbcqecq
title: Check Namespace before Creating
desc: ''
updated: 1751748065274
created: 1750467289008
---

- when creating a new repo, sflow should check whether there's an existing folder with the same name in the parent user/org site.
- best practice is probably not to put an sflow-site at the user/org level? At least if it might have repos someday.

## References

- [[sflo.issue.github-bare-namespace-can-overlap-with-repo-namespaces]]