---
id: p9f3gmbx90yp2trxcvrz8pe
title: Principles
desc: ''
updated: 1779677678383
created: 1773878299267
---


## Dereferencability for Humans

If you put any [[ont.concepts.semantic-flow-identifier]] in a browser, it should return some useful context. 

## Composability

Composability is the ability to graft Knops and Meshes onto other meshes. See [[ont.concepts.submesh]] for details. This principle requires that Knops and Meshes are self-contained.

## Transposability

Transposability is the ability to move a mesh to a different <meshBase> and have it work with as little change as possible. Transposability can be useful for changing hosting providers, but also for, say, setting up a different "universe" for independent evolution, i.e. branching.

## Psuedo-immutability

Ideally, once minted, states don't change. Excpetions for privacy/security concerns are understandable. 

## Avoid local path leakage into published meshes

Maybe it's occasionally avoidable when working files are outside the repo, but ArtifactResolutionTargets work better as URLs or repo targets, since local path relations aren't consistent between devices.