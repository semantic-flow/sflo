
A human-readable, sortable identifier for a given weave that is used in composing [[snapshot folder names|folder.snapshot]].

The value encodes the UTC date and time of [[mesh-resource.node-component.flow-shot.snapshot]] creation (weave) in the format `YYYY-MM-DD_HHMM_SS` (with underscores between date, time, and seconds), enabling simple chronological (lexical) comparison in SPARQL and across file-system hierarchies.

Format: `YYYY-MM-DD_HHMM_SS`
- Example: `2025-11-24_0142_55`

The weave label is combined with a sequence number to form complete snapshot folder names:
- Full format: `YYYY-MM-DD_HHMM_SS_vN`
- Example: `2025-11-24_0142_55_v7`

Used as the human-readable component of snapshot folder names and as a lightweight temporal ordering key when full RDF provenance data is unavailable.
