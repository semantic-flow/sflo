---
id: 1c023wm7blmyv94jqsw8slt
title: Weave Label
desc: ''
updated: 1764134127628
created: 1762811935065
---

A sortable identifier for a given weave that can be used in composing [[folder.snapshot]].

The value encodes the UTC date and time of [[mesh-resource.node-component.flow-shot]]creation (weave) in compact decimal form
(YYYYMMDD.HHMMSS or YYYYMMDD.HHMMSSmmm), enabling simple chronological (lexical AND numeric) comparison in SPARQL and across file-system hierarchies.
Used as the identifier for folder-named snapshots and as a lightweight temporal ordering key when full RDF provenance data is unavailable.
