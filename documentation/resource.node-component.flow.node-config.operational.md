---
id: 6hmxoiahi5lxjg1urdibvi1
title: operational config flow
desc: ''
updated: 1755846188515
created: 1755844590439
---

An **operational config flow** defines a node's final, resolved settings. It is the direct consumer of the configuration inheritance chain and controls the node's actual behavior (e.g., versioning, distribution formats).

If a node has an operational config flow, it can still inherit settings from the [[inheritance chain|resource.node-component.flow.node-config.inheritable]]. Any settings explicitly defined in the operational config will override those that would have been inherited.

If a node lacks an operational config flow, its behavior is determined by the resolved settings from the inheritance chain, with service defaults and platform defaults filling in any gaps.
