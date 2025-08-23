---
id: 73k0himk6cuq7sqhp8rshtg
title: sflo-host
desc: ''
updated: 1755903461220
created: 1755903381862
---

- supports the official clients ([[product.cli]] and [[product.sflo-web]]) and third-party clients by
  - providing an [[product.sflo-api]]
  - serving meshes via a contained static http service
  - keeping central control of mesh operations.
    - e.g. locking sub-meshes during weave.
    - enables parallelism, which can speed up the weave and ensure processes don't clobber each others' work. It can also provide locking to allow multi-user or multi-client modification.

## Functions

- file watchers
- file locking

