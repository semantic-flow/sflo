---
id: 1tphtl08apm6b0g0ynqj1qe
title: Identifier Hosting Strategy
desc: ''
updated: 1769724123351
created: 1769724104239
---

## Strategy A: Native GitHub Pages

Base IRI is https://{org}.github.io/{repo}/...

Zero ceremony.

## Strategy B: Custom domain (if they have one)

Still host on GitHub Pages, but IRIs use the custom domain.

This is the only path that solves your “after redirect, URLs don’t match” UX issue.

## Strategy C: Third-party persistent redirect (w3id / purl)

SF generates:

the exact .htaccess content,

the repo fork + PR text,

and a “copy/paste checklist.”

Your point is key: if an AI can do the annoying parts, the human overhead drops a lot.
