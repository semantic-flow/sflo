---
id: 1c023wm7blmyv94jqsw8slt
title: Version Key
desc: ''
updated: 1762812017669
created: 1762811935065
---

A sortable numeric identifier for a flow's snapshots. The value encodes the UTC date and time of [[mesh-resource.node-component.flow-snapshot]]creation (weave) in compact decimal form
(YYYYMMDD.HHMMSS or YYYYMMDD.HHMMSSmmm), enabling simple chronological (lexical AND numeric) comparison in SPARQL and across file-system hierarchies.
Used as the identifier for folder-named snapshots and as a lightweight temporal ordering key when full RDF provenance data is unavailable.
