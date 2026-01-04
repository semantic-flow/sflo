---
id: 6hmxoiahi5lxjg1urdibvi1
title: local config flow
desc: ''
updated: 1764954352850
created: 1755844590439
---

An **local config flow** defines a knop's final, resolved settings. It is the direct consumer of the configuration inheritance chain and controls the knop's actual behavior (e.g., versioning, distribution formats).

If a knop has an local config flow, it can still inherit settings from the [[inheritance chain|mesh-resource.component.flow.inheritable-config]]. Any settings explicitly defined in the local config will override those that would have been inherited.

If a knop lacks an local config flow, its behavior is determined by the resolved settings from the inheritance chain, with service defaults and platform defaults filling in any gaps.
