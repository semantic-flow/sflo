
Perfect — I like **intramesh identifiers** as a project-specific term, since it makes clear: “these are inside the mesh, and they behave like relative IRIs but with conventions.” 👍

Here’s a doc-style write-up on **namespace-relative basing**, phrased to integrate with your terminology and conventions:

---

# Namespace-Relative Basing

In Semantic Flow, distributions are often nested deeply inside a node’s flows (e.g., `_data-flow/_current/...`). If base IRIs are left implicit, relative identifiers would need multiple `../` steps to reach the node or its siblings. To simplify this, Semantic Flow recommends **namespace-relative basing**.

## Concept

* Every distribution file declares an explicit `@base` (in TriG/Turtle) or `@context/@base` (in JSON-LD).
* Instead of using the document’s path as the base (the default in RDF), the base is set **relative to the namespace root** (one level above the node root).
* This makes the **namespace root** the anchor, so that nodes can be referred to by simple `<name>` identifiers.

### Path layout

```
namespace-root/
  djradon/
    _data-flow/_current/djradon.trig
    _meta-flow/_current/meta.trig
  another-node/
```

### With namespace-relative basing

```turtle
@base <../../../> .

<djradon> a :Node ;
  :hasMeta <djradon/_meta-flow/_current/meta.trig> ;
  :relatedTo <another-node> .
```

* `<>` resolves to the namespace root (`namespace-root/`).
* `<djradon>` resolves to the node (`namespace-root/djradon/`).
* `<another-node>` is a sibling in the namespace.
* Intra-node flows are reached with `djradon/...`.

---

## Advantages

* **Sibling references are short**: `<another-node>` instead of climbing out with `../../../`.
* **Node references are stable**: `<djradon>` always means the node root, regardless of where the distribution lives.
* **Clarity**: `<>` = namespace, `<name>` = node, `<name/path>` = subresources.

---

## Comparison with Node-Relative Basing

| Basing Style           | `@base` value | `<>` =         | `<djradon>` = | Best For…                                    |
| ---------------------- | ------------- | -------------- | ------------- | -------------------------------------------- |
| **Node-relative**      | `../../`      | Node root      | Child of node | Config/meta flows describing the node itself |
| **Namespace-relative** | `../../../`   | Namespace root | Node root     | Data/reference flows linking across nodes    |

---

## Guidelines

* ***data-flow* and *ref-flow*** distributions should use **namespace-relative basing**, since they often refer to siblings or other nodes.
* ***meta-flow* and *config-flow*** distributions may use **node-relative basing** if they mostly describe the node itself.
* Always set `@base` explicitly in every distribution to avoid fragile relative paths.

---

## JSON-LD Example

```json
{
  "@context": {
    "@base": "../../../"
  },
  "@id": "djradon",
  "@type": "Node",
  "hasMeta": "djradon/_meta-flow/_current/meta.trig",
  "relatedTo": "another-node"
}
```

---

✅ With namespace-relative basing, intramesh identifiers remain short, predictable, and consistent across all distributions, while still resolving correctly to absolute IRIs.

