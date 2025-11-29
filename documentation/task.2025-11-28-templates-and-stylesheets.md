---
id: sngbxo44ylhlflch69d4qfb
title: 2025 11 28 Templates and Stylesheets
desc: ''
updated: 1764371338645
created: 1764371302931
---

## Prompt

Implement a proper templates/stylesheets system for Semantic Flow that:

1. Treats templates and CSS as **real files in `_assets`** folders owned by nodes in a mesh.
2. Represents those assets as **RDF nodes** (with IRIs) that config refers to, not bare strings.
3. Extracts **platform defaults** out of the config ontology file into a separate **`sflo-platform-defaults` mesh**.
4. Preserves inheritance semantics (platform → application → node) while making asset resolution unambiguous and offline-capable.

This epic covers required changes to **sflo-config ontology**, introduction of **template/stylesheet resource nodes**, and **runtime resolution** from config → node → `_assets` files.

---

## Background / Problems in current config ontology

You currently have:

* `hasResourcePageTemplate` as a **DatatypeProperty** (xsd:string path).
* `stylesheetPath` as a **DatatypeProperty** (xsd:string path).
* `TemplatePathShape` enforcing a regex on a **relative path string**.
* `TemplateMappings` / `TemplateMapping` that still assume string paths, not node IRIs.
* `defaultPlatformConfig` as **instance data embedded in the ontology document**.

Key structural issues:

1. **Path strings instead of IRIs**

   * Config is entangled with filesystem layout.
   * No way to distinguish “path of defining node” vs “path of consuming node.”
   * No clean way to support inheritance across nodes while keeping assets anchored to their defining node.

2. **Instance data in ontology**

   * `defaultPlatformConfig` is ABox data living in a TBox file.
   * Makes it harder to version the ontology independently of platform defaults.
   * Makes “platform defaults” look like they’re part of the schema, which they aren’t.

3. **TemplateMappings is underspecified**

   * It’s a collection wrapper (`TemplateMappings`) plus `TemplateMapping` + `hasResourcePageTemplate` string.
   * No clear mapping semantics (e.g., map which resource types to which template nodes).
   * Hard to evolve toward node-based templates without either breaking or duplicating semantics.

4. **CSS and templates not modeled as resources**

   * There is no class for “Template resource” or “Stylesheet resource.”
   * No way, in RDF, to say “this node’s default template is *that* node’s `_assets` file.”

---

## High-level decisions

### D1. Represent templates and stylesheets as first-class RDF resources

Add **resource classes** for templates and stylesheets in the config ontology:

* `TemplateResource/` (class)
* `StylesheetResource/` (class)

These are *not* the bytes themselves; they are RDF nodes that:

* Have an IRI.
* Are associated with a **defining node** (a `sflo:Handle`).
* Point to a file under that node’s `_assets` folder via a relative asset path.

JSON-LD sketch (not implement yet, just conceptual):

```jsonld
{
  "@id": "TemplateResource/",
  "@type": "rdfs:Class",
  "rdfs:subClassOf": { "@id": "ConfigurationClass/" },
  "rdfs:label": "Template Resource",
  "rdfs:comment": "Template resource anchored in a mesh node's _assets folder."
},
{
  "@id": "StylesheetResource/",
  "@type": "rdfs:Class",
  "rdfs:subClassOf": { "@id": "ConfigurationClass/" },
  "rdfs:label": "Stylesheet Resource",
  "rdfs:comment": "Stylesheet resource anchored in a mesh node's _assets folder."
}
```

### D2. Asset location is always relative to the **defining node folder**

Introduce a property like:

* `assetPath/` (DatatypeProperty)

  * `schema:domainIncludes`: `TemplateResource/`, `StylesheetResource/`
  * Range: `xsd:string` (relative filesystem path)
  * Semantics: **relative to the node folder that “owns” the resource**, not to the consumer node.

Either:

* Make the owning node explicit via `definedAtNode/` (ObjectProperty) to `sflo:Handle/`, **or**
* Rely on “this RDF lives in that node’s dataset” as implied ownership (more magical; more fragile).

Epic should bias toward an explicit `definedAtNode/` for clarity.

### D3. Config points to resource IRIs, not to paths

Replace “string path” usage in config with **object properties to TemplateResource/StylesheetResource** nodes:

* New properties (object properties):

  * `defaultResourcePageTemplate/`
  * `defaultStylesheet/`

Likely domains:

* `schema:domainIncludes`: `AbstractNodeConfig/`, `PlatformConfig/`, `ApplicationConfig/`.
* `schema:rangeIncludes`: `TemplateResource/` or `StylesheetResource/`.

This keeps inheritance purely in terms of **IRIs**, not filesystem layout.

### D4. Deprecate string-based path properties for new configs

* `hasResourcePageTemplate/` (DatatypeProperty) and `stylesheetPath/` are legacy.
* For **new configs**, prefer **IRI-based properties**.
* Keep the old properties temporarily for:

  * Migration,
  * Legacy configs,
  * Clear deprecation path.

You must not design a half-and-half world where both are “equally first-class”; you’ll end up with ambiguous behavior. The epic should mandate a *clear precedence* rule: IRIs > strings.

### D5. Extract platform defaults to a `sflo-platform-defaults` mesh

* Remove `defaultPlatformConfig` instance from the ontology file.
* Create a new **single-mesh repo** (e.g., `sflo-platform-defaults`).
* In that repo:

  * A **platform config node** (of class `PlatformConfig/`) with an IRI, e.g.:

    `https://semantic-flow.github.io/platform/config/default`

  * Template and stylesheet nodes (TemplateResource/StylesheetResource) plus `_assets` files for each.
* Ship a **snapshot** of that mesh (RDF + `_assets`) with the platform tooling for offline use.

Ontology file remains **schema-only**.

### D6. Runtime behavior: config → TemplateResource → node folder → `_assets` file

Define the runtime lookup:

1. Effective config resolves to a template IRI and stylesheet IRI (via inheritance).
2. For each:

   * Load its RDF.
   * Determine defining node (via `definedAtNode/` or similar).
   * Map node IRI → node folder.
   * Combine node folder + `assetPath/` to get the actual file.
3. HTML references the `_assets` file directly (no RDF parsing from the page).

---

## Scope

**In scope:**

* Ontology changes in `sflo-config` necessary to support Template/Stylesheet resources and IRI-based config.
* Definition of TemplateResource/StylesheetResource + `assetPath` + (optional) `definedAtNode`.
* Definition of new config properties for default template/stylesheet.
* Extraction of `defaultPlatformConfig` from ontology into `sflo-platform-defaults` mesh.
* Runtime resolution rules and implementation for templates/styles.
* Minimum working set of platform-default templates/styles wired through config.

**Out of scope (for this epic):**

* Full refactor of TemplateMappings to support arbitrarily complex mapping rules.
* Implementing per-resource-type template selection beyond a single “resource page template” per node.
* The TODO `VersioningState` properties (they’re orthogonal).

---

## Workstreams & Tasks

### WS1: Config ontology refactor for templates/styles

**Goal:** introduce node-based Template/Stylesheet resources and IRI-based config, while preserving backward compatibility.

#### T1.1 Add TemplateResource and StylesheetResource classes

* Add `TemplateResource/` and `StylesheetResource/` as subclasses of `ConfigurationClass/`.
* Ensure comments make it explicit that they describe template/CSS assets anchored to mesh nodes.

#### T1.2 Introduce `assetPath/` and (optionally) `definedAtNode/`

* `assetPath/`:

  * `@type`: `owl:DatatypeProperty`
  * `schema:domainIncludes`: `TemplateResource/`, `StylesheetResource/`
  * `schema:rangeIncludes`: `xsd:string`
  * Comment: “Relative path to an asset under the defining node’s folder (usually its `_assets` directory).”

* `definedAtNode/`:

  * `@type`: `owl:ObjectProperty`
  * `schema:domainIncludes`: `TemplateResource/`, `StylesheetResource/`
  * `schema:rangeIncludes`: `sflo:Handle/`
  * Comment: “Node whose `_assets` subtree contains the file indicated by `assetPath`.”

If you’re unwilling to add `definedAtNode/` yet, you must document the ownership rule (e.g., “TemplateResource nodes must be defined in the dataset belonging to their owning node”).

#### T1.3 Add IRI-based config properties for template & stylesheet selection

Add:

* `defaultResourcePageTemplate/`:

  * `@type`: `owl:ObjectProperty`
  * domain: `AbstractNodeConfig/`, `PlatformConfig/`, `ApplicationConfig/`
  * range: `TemplateResource/`
  * comment: “Template resource used to generate HTML resource pages for this node (before any more specific mapping rules).”

* `defaultStylesheet/`:

  * `@type`: `owl:ObjectProperty`
  * domain: same as above
  * range: `StylesheetResource/`
  * comment: “Stylesheet resource applied to generated pages for this node.”

These will eventually replace `hasResourcePageTemplate/` and `stylesheetPath/` for new configs.

#### T1.4 Mark string-based properties as legacy

* Update comments on:

  * `hasResourcePageTemplate/`
  * `stylesheetPath/`
* Indicate they are **legacy / string-path-based** and that object-property IRIs are the preferred mechanism.

Adjust or add SHACL shapes:

* `TemplatePathShape/` and any `stylesheetPath` regex enforcement become **legacy-only**.
* Add new shapes ensuring that `defaultResourcePageTemplate` and `defaultStylesheet` point to instances of the right classes (or at least exist).

#### T1.5 Remove `defaultPlatformConfig` ABox from ontology file

* Delete the `defaultPlatformConfig` individual and its embedded `defaultInheritableNodeConfig` from the ontology JSON-LD.
* Keep only class/property/shape definitions in the ontology document.
* Confirm that no tooling currently depends on that instance data living inside the ontology file.

---

### WS2: `sflo-platform-defaults` mesh repo and platform config

**Goal:** Establish a dedicated mesh repo that holds platform-default config + template/style assets.

#### T2.1 Create `sflo-platform-defaults` repo as a single-mesh repo

* Initialize as a mesh repo with:

  * A root node for platform config, e.g.: `…/platform/config/default/`.
  * One or more nodes for UI, e.g.: `…/platform/ui/`.
* Define a minimal `_assets` layout under `platform/ui/`:

  * `_assets/templates/resource-page-default.hbs`
  * `_assets/styles/platform-default.css`

#### T2.2 Define TemplateResource/StylesheetResource instances

In the `platform/ui` node’s dataset, add JSON-LD like:

```jsonld
{
  "@id": "https://semantic-flow.github.io/platform/ui/templates/resource-page/default",
  "@type": "TemplateResource/",
  "definedAtNode": { "@id": "https://semantic-flow.github.io/platform/ui/" },
  "assetPath": "_assets/templates/resource-page-default.hbs"
},
{
  "@id": "https://semantic-flow.github.io/platform/ui/styles/default",
  "@type": "StylesheetResource/",
  "definedAtNode": { "@id": "https://semantic-flow.github.io/platform/ui/" },
  "assetPath": "_assets/styles/platform-default.css"
}
```

#### T2.3 Define `PlatformConfig/` instance using new properties

Create a `PlatformConfig/` instance in the mesh (not in the ontology):

```jsonld
{
  "@id": "https://semantic-flow.github.io/platform/config/default",
  "@type": "PlatformConfig/",
  "rdfs:label": "Default Platform Configuration",
  "hasInheritableNodeConfig": {
    "@id": "https://semantic-flow.github.io/platform/config/default-inheritable",
    "@type": "InheritableNodeConfig/",
    "versioningEnabled": true,
    "formats:media_type": [
      "application/trig",
      "application/ld+json"
    ],
    "generateUnifiedDataset": false,
    "generateAggregatedDataset": false,
    "nodeConfigInheritanceEnabled": true,
    "defaultResourcePageTemplate": {
      "@id": "https://semantic-flow.github.io/platform/ui/templates/resource-page/default"
    },
    "defaultStylesheet": {
      "@id": "https://semantic-flow.github.io/platform/ui/styles/default"
    }
  }
}
```

This replaces the now-removed `defaultPlatformConfig` in the ontology file.

#### T2.4 Decide and document the canonical platform-config IRI

* Pick a stable IRI for the platform default config node (above).
* Platform code will treat this as the **canonical fallback** when no other config is provided.

---

### WS3: Runtime resolution & integration into weave / host

**Goal:** Implement the end-to-end resolution from config → TemplateResource/StylesheetResource → `_assets` files, including offline bundling.

#### T3.1 Define a clear node-IRI → folder → HTTP-path mapping

You cannot handwave this.

* Document:

  * How a node’s IRI maps to its folder on disk.
  * How that folder maps to an HTTP path when served.
* Ensure `_assets` folders under that node are exposed at predictable URLs.

#### T3.2 Implement Template/Stylesheet resolution logic

Given a **resolved config** for a node:

1. Determine effective template and stylesheet IRIs:

   * Use inheritance chain: node → application → platform.
   * If both legacy string props and new object props are present, **favor IRIs**.

2. For each IRI:

   * Load its RDF (using current in-memory store).
   * Fetch `definedAtNode` (or infer the owning node).
   * Map node IRI → node folder.
   * Combine with `assetPath` to get a filesystem path.

3. Provide these as:

   * Internal filesystem path (for the renderer),
   * And optionally a corresponding HTTP path if needed for generated HTML.

#### T3.3 Integrate into resource-page generation

* Update weave/resource-page generation to:

  * Use the resolved template file instead of a hardwired or path-string-based template.
  * Inject the stylesheet via `<link>` tag referencing the resolved CSS asset.
* Ensure the engine can be configured per-node by altering Operational/Inheritable configs, not by tweaking code.

#### T3.4 Offline bundling of `sflo-platform-defaults`

* Introduce a build step that:

  * Pulls a tagged commit of `sflo-platform-defaults`.
  * Produces a snapshot bundle:

    * `platform-defaults.bundle.jsonld` (RDF dataset of the mesh),
    * A copy of the `_assets` tree under a known directory inside the platform distribution.
* At runtime:

  * The platform looks for that bundle and uses it as the default source.
  * Optionally allow overriding the bundle location/local mesh via config/env.

---

### WS4: Migration & compatibility

**Goal:** Avoid leaving the system in a hybrid half-migrated state.

#### T4.1 Decide behavior when both legacy and new properties are present

* Define strict precedence:

  * `defaultResourcePageTemplate` / `defaultStylesheet` (IRIs) override
  * `hasResourcePageTemplate` / `stylesheetPath` (strings).
* Implement this consistently in all config-resolution code.

#### T4.2 Add a migration path for existing configs

* Provide a script or documented recipe to:

  * Scan configs using string paths.
  * Produce TemplateResource/StylesheetResource nodes + assetPath.
  * Update configs to reference those new nodes by IRI.

Don’t rely on “tribal knowledge” for this; write it down.

#### T4.3 Add validation tests

* Unit tests:

  * Template/Stylesheet resolution from config.
  * Asset path resolution relative to defining node.
* Integration tests:

  * Sample node with inherited config from platform mesh generating a resource page with the correct template and stylesheet.

---

## Risks / Things to watch

1. **Half-migration trap**

   * If you leave string paths “just as good as IRIs,” people will keep using them and you’ll never converge.
   * The epic must end with IRIs as the clear default and strings clearly legacy.

2. **Ownership ambiguity**

   * If you don’t enforce or document `definedAtNode` (ownership), asset resolution will get messy once you have multiple meshes or more complex layouts.

3. **Implicit assumptions about mesh layout**

   * Any hidden assumptions about how IRIs map to disk paths will bite you when:

     * You change mesh root,
     * You package things differently,
     * Or you add remote sources.

4. **Ontology creep**

   * Be careful not to re-introduce platform-specific instance data into the ontology as “examples.”
   * Keep all defaults in the `sflo-platform-defaults` mesh.

---

If you want, a next step after this epic is to define a **minimal JSON-LD example** of:

* A node with an OperationalNodeConfig,
* Inheriting a PlatformConfig from `sflo-platform-defaults`,
* And producing a specific HTML page wired to a TemplateResource + StylesheetResource.
