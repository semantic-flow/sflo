---
id: 8akbl2qj0nz38yrvet4oq3k
title: 2025-11-09-replace-monotonic-vN-with-timestamp
desc: ''
updated: 1762713954316
created: 1762712674617
---

## Decisions

- to accomodate "as-of" querying across meshes, we decided to move from monotonic (_vN) versions to "snapshotTime" versions with millisecond precision, e.g. 20251109181158123. On weave, lock CRUD (if using API; if using fs, you could consider locking files but meh), check local clock's accuracy, pick a snapshotTime, and use it for "releasing" all the "working" distributions. 

## Prompt

You are migrating Semantic Flow from monotonic integer versions (_v1, _v2, …) to timestamp-based snapshot IDs.

GOAL
- Replace all versioned snapshot folders and references with a UTC timestamp identifier in compact form (YYYYMMDDhhmmssSSS), called snapshotTimestamp.
- Keep behavior identical or better: immutable snapshots, easy “as-of time” queries, stable manifests, and optional default materialization.
- Preserve backward compatibility reads for _vN paths until deprecation.

TERMS
- snapshotTimestamp (folder name and identifier): 17-digit UTC time “YYYYMMDDhhmmssSSS”. Example: 20251109181158123.
- Working copy: _working/
- Default snapshot: _default/


REQUIREMENTS
1) Folder layout
   - For each Flow directory:
     - _working/
     - <snapshotTimestamp>/   # immutable
     - _default/              # optional, copy of latest published snapshot
   - Example:
     /ns/djradon/_reference-flow/
       _working/
       20251109181158123/
       20251109182247044/

2) Identifier format and generation
   - snapshotTimestamp format: ^\d{17}$ (UTC, pad ms to 3 digits).
   - Source of truth is server time from sflo-host.

3) Metadata
   - On each snapshot dataset (folder):
     - prov:generatedAtTime "2025-11-09T18:11:58.123Z"^^xsd:dateTime .
   - On _default/ :
     - prov:wasDerivedFrom </…/20251109182247044/> .
   - Ontology additions:
     - sflo:snapshotTimestamp a owl:DatatypeProperty ; schema:domainIncludes sflo:Snapshot, dcat:Dataset ; schema:rangeIncludes xsd:string ; rdfs:comment "Compact UTC timestamp ID YYYYMMDDhhmmssSSS for an immutable snapshot." .
     - (Optional) sflo:hasDefaultSnapshot a owl:ObjectProperty ; rdfs:domain sflo:Flow ; rdfs:range dcat:Dataset .

4) Manifest (atomic cut)
   - Path: /_manifests/manifest-<snapshotTimestamp>.trig
   - Shape:
     :m a sflo:WeaveManifest ;
       prov:generatedAtTime "…"^^xsd:dateTime ;
       sflo:select [ sflo:flow </ns/djradon/_reference-flow/> ; sflo:snapshot </ns/djradon/_reference-flow/20251109182247044/> ] , … .
   - Write manifests using stage → fsync → atomic rename. Treat manifest publish as the commit point.
   - Readers that require consistency MUST resolve via a manifest.

5) API changes
   - POST /flows/{id}/snapshots → 201 Created
     - Location: …/<snapshotTimestamp>/
     - Body: { "snapshotTimestamp": "20251109181158123", "generatedAt": "2025-11-09T18:11:58.123Z" }
   - POST /weaves → 201 Created (or 202 Accepted for async job)
     - Returns manifest URI and its snapshotTimestamp.
   - GET endpoints accept either legacy _vN/ or timestamp; server resolves both while legacy is supported.

6) Backward compatibility
   - Read path adapter: map _vN/ → its recorded snapshotTimestamp if present; otherwise serve legacy.
   - Deprecation plan: warn for _vN/ in logs; remove after N releases.

7) SHACL guards (optional)
   - Folder IRI pattern for snapshots:
     sh:targetClass dcat:Dataset ;
     sh:sparql "FILTER regex(str(?this), '/[0-9]{17}/$')" .
   - Property constraint on snapshotTimestamp:
     sh:path sflo:snapshotTimestamp ; sh:pattern "^[0-9]{17}$" ; sh:minCount 1 ; sh:maxCount 1 .

8) “As-of” selection
   - Given an instant T, for each Flow pick the max snapshotTimestamp ≤ T. No inner file timestamps required.
   - Provide helper: GET /flows/{id}/snapshots?asOf=2025-11-09T18:12:00Z → returns chosen timestamp and URI.

9) Filesystem publish semantics
   - No global locks. For each new snapshot:
     1) Write to ._staging/<snapshotTimestamp>/, fsync.
     2) Rename into place (same volume).
     3) Write manifest, rename into place.
     4) Optionally refresh _default/ via atomic directory swap.
   - Document guarantee as “snapshot publish”: manifest yields point-in-time consistency; _default/ is convenience.

10) Clock drift
   - sflo-host is authoritative, but check internet time and record skew if detected:
     sflo:clockSkew "+00:00:01.234" on the snapshot.
   - Always store prov:generatedAtTime in UTC.

11) Testing and acceptance
   - Unit: format generator, collision bump, parsing.
   - Integration: create two snapshots in the same ms → unique IDs.
   - Manifest atomicity: readers never see partial cuts.
   - Backcompat: _vN/ and timestamp both resolve during deprecation window.
   - As-of correctness: queries select expected snapshots across multiple flows.

DELIVERABLES
- documentation changes (look for "_vN"), ID generation
- Ontology and SHACL updates (as above).

## TODO


