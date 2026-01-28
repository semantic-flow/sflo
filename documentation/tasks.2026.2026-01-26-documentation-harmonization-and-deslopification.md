---
id: nk89dligk32no2np4hjsfqs
title: 2026 01 26 Documentation Harmonization and Deslopification
desc: ''
updated: 1769587525508
created: 1769480325310
---

## Task 


This document outlines the plan for a comprehensive update of the project documentation. The goal is to harmonize the documentation, rename (or remove) outdated terminology, tighten up all pages and ensure they are consistent and accurate. (deslopification)

The process will involve:

1.  Identifying and tracking outdated terms and their replacements.
2.  Systematically updating all documentation pages, including those for classes, properties, concepts, and guides.
3.  Keeping a checklist of all documentation files to track progress.
4.  Updating related project files, such as the memory bank, as needed.

This is a collaborative effort, and this document will serve as the central plan and progress tracker for the task.

The goal is a more-maintainable documentation base that can be useful for humans and provide precision context for LLMs. Documentation must be ruthlessly concise and non-repetitive, both within pages and across pages.

c.* (Class) and p.* (Property) pages should be especially concise. 

During the process, if any pages need to be renamed or moved, notify the user so they you can perform the action using Dendron's tools to maintain backlink integrity.

## Acceptance Criteria

* No Class, Property, or Concept page may re-explain a term already defined elsewhere; it must link to the canonical definition.
* Internal links are "wikilinks"-style: [[filename-without-extension]]

## TODO

*   [ ] Create `documentation/outdated-terms.csv` to track outdated terms, their replacements, and notes.
*   [ ] Populate `documentation/outdated-terms.csv` with an initial list of terms to be replaced.
*   [ ] Generate a checklist of all documentation files that need to be updated and add it to this document.
*   [ ] Systematically update all class pages and folder pages, and other pages as we go
*   [ ] add Property pages
*   [ ] After class pages are consistent, make any remaing updates to concept.*, faq.*, use-case.*, principle.* and product.* pages
*   [ ] after those pages are consistent, make any remaining updates to guide.* and dev.* pages
*   [ ] Update the memory bank files as needed to reflect the documentation changes.
*   [ ] Once all content updates are complete, review all changes for consistency and accuracy.

## Updated Dendron page set

### Classes 

[ ] `c.MeshResource`
[ ] `c.ArtifactContainer`
[ ] `c.Mesh`
[ ] `c.Knop`
[ ] `c.Nomen`
[ ] `c.MeshMetadataFlow`
[ ] `c.MeshInventoryDataset`
[ ] `c.FlowPayload`
[ ] `c.SimplePayload` *(also `c.Realizable`)*
[ ] `c.KnopMetadataFlow`
[ ] `c.KnopInventoryDataset`
[ ] `c.NomenMetadataFlow`
[ ] `c.NomenInventoryDataset`

[ ] `c.DigitalArtifact`
[ ] `c.FlowArtifact`
[ ] `c.SimpleArtifact`

[ ] `c.RdfDataset`

[ ] `c.Slice`
[ ] `c.WorkingSlice`
[ ] `c.HistoricalSlice`

[ ] `c.Realizable`

[ ] `c.Realization`
[ ] `c.AbstractFile`
[ ] `c.AbstractStream`

[ ] `c.LocatedFile`
[ ] `c.ResourcePage`

[ ] `c.ReferenceLink`
[ ] `c.ReferenceRole`


---

If you only have time for ~10 property pages, do: `containsMeshResource`, `meshBase`, `designatorPath`, `hasFlowPayload`, `hasSimplePayload`, `hasSlice`, `currentSlice`, `hasAbstractFile`, `hasLocatedFile`.


## Decisions

