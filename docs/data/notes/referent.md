
## Definition

The *referent* is the thing (real or imaginary) to which a [[resource|mesh-resource]]’s [[concept.identifier]] **refers**. Every identifier [[denotes|concept.denotation]] its referent, 

## Node vs. referent

- **Referent**: the subject that the node’s identifier names (a person, concept, event, dataset, etc.).
- **Node**: the mesh construct that provides an identifier for and contains linked data about the referent. It also provides linked data about itself (as a node), and may contain other resources used for supporting [[concept.semantic-flow-site]]s.

To talk about the node itself, you use its **node handle** (e.g. published IRI `https://ns.example.org/persons/djradon/_node-handle` or mesh identifier `<djradon/_node-handle>`).

**Where it’s described**

* The **referent’s description** lives in the node’s [[mesh-resource.node-component.flow.reference]].
* The **node’s own metadata and provenance** live in the **`_node-*` flows** (e.g. `_node-metadata-flow`, `_node-config-*`).

**Special case: payload nodes**

* In a **payload node**, the **referent** is not an external entity but an **evolvable dataset** contained in the node.
* The dataset evolves as versioned distributions inside the node’s `_payload-flow` (e.g. `v1/`, `v2/`, …).
* The `_reference-flow` may describe the dataset, e.g. its **name, type, and provenance**.
* Example:

  * Node IRI: `https://ns.example.org/projects/atlas/`
  * Referent: *the Atlas dataset* (identified by the node IRI, evolving over time).
  * `_reference-flow`: declares it as a dataset, supplies label and attribution.
  * `_payload-flow`: provides concrete versions (`v1`, `v2`, …).


## Why referent matters

Understanding what a IRI refers to is crucial for proper semantic web implementation. In the past, people have tried to use content IRIs to represent the things they refer to. A classic example is using `http://example.org/person.html` to identify a person, when it actually identifies an HTML document about the person. This conflation creates semantic ambiguity and breaks linked data principles.

Semantic Flow enforces clear referent distinctions through IRI patterns: slash-terminated IRIs always refer to concepts or entities, while extension-terminated IRIs always refer to retrievable content. This prevents the classic "document vs thing" confusion that has plagued semantic web implementations.
