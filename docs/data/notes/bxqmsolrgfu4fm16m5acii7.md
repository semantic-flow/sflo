
## Definition

A **reference node** is a [[resource.node]] that represents the (non-dataset) **referent** of the node — i.e., the thing in the world that the node stands for.

**Purpose**

* To describe what the node *refers to* (person, place, concept, dataset, etc.).
* To supply human/machine labels, identifiers, and minimal provenance about the referent.
* To differentiate between metadata about the **node itself** (`_node-metadata-flow`) and metadata about the **referent**.

**Contents (typical minimum)**

* `rdfs:label` (human-readable name of the referent).
* `rdf:type` (classifying what kind of thing the referent is).
* Optional provenance (creator, source, temporal scope).
* Optional identifiers (sameAs links, external URIs).

## Example Snapshot Distribution

```trig
# The referent of the node (the actual person)
<djradon>
    rdf:type foaf:Person ;
    rdfs:label "dj radon" ;
    foaf:mbox <mailto:djradon@example.org> ;
```
