Perfect — here’s an extended wiki note that folds in that case:

---

## Referent

**Definition**
The *referent* is the thing (real or imaginary) that a node’s IRI **refers to**. Every node IRI is an identifier for its referent.

**Node vs. referent**

* **Referent**: the subject that the node’s IRI names (a person, concept, event, dataset, etc.).
* **Node**: the mesh construct that manages flows about that referent.

  * To talk about the node itself, you use its **node handle** (e.g. published IRI `https://ns.example.org/persons/djradon/_node-handle` or mesh identifier `<djradon/_node-handle>`).

**Where it’s described**

* The **referent’s description** lives in the node’s [[resource.node-component.flow.reference]].
* The **node’s own metadata and provenance** live in the **`_node-*` flows** (e.g. `_node-metadata-flow`, `_node-config-*`).

**Special case: data nodes**

* In a **data node**, the **referent** is not an external entity but an **evolvable dataset** contained in the node.
* The dataset evolves as versioned distributions inside the node’s `_data-flow` (e.g. `v1/`, `v2/`, …).
* The `_ref-flow` may describe the dataset, e.g. its **name, type, and provenance**.
* Example:

  * Node IRI: `https://ns.example.org/projects/atlas/`
  * Referent: *the Atlas dataset* (identified by the node IRI, evolving over time).
  * `_ref-flow`: declares it as a dataset, supplies label and attribution.
  * `_data-flow`: provides concrete versions (`v1`, `v2`, …).

---

👉 Would you like me to also draft the **paired wiki note for “Node handle”**, so your docs have “Referent” and “Node handle” defined side-by-side?
