---
id: mesh-resource
title: mesh resources
desc: ''
updated: 1756161408900
created: 1750709094321
---

## Overview

A **mesh resource** is any addressable component within a [[semantic mesh|concept.mesh]]. Every mesh resource has a unique [[Intramesh|concept.intramesh-identifier]] based on its path and locally unique name, making it dereferenceable via URL.

In RDF terms, a resource is any node in an RDF graph that can be represented with an IRI (the other kinds of RDF graph nodes are literals and blank nodes). So theoretically, files and folders in [[mesh-resource.node-component.asset-tree]] could be considered RDF resources. But they are not considered **mesh** resources

## Types of Mesh Resources

The structure of a semantic mesh is built on a fundamental distinction between **extensible** and **terminal** resources:

- **[[Mesh nodes|mesh-resource.node]]** are extensible namespace containers:
- **[[Mesh node components|mesh-resource.node-component]]** are terminal mesh resources:
  - Can be physically represented as folders or files
    - Folder [[concept.intramesh-identifier]] are part of the namespace but cannot be extended beyond their own internal structure
  - All files and folders within a component folder are considered to be part of the parent node

**Folder-based components:**


- **[[metadata flows|mesh-resource.node-component.flow.node-metadata]]**: Administrative metadata (in `_meta-flow/` folders)
- **[[Asset trees|mesh-resource.node-component.asset-tree]]**: File collections (in `_assets/` folders)
- **[[Version datasets|mesh-resource.node-component.flow-snapshot.version]]**: Versioned snapshots
- **[[next snapshots|mesh-resource.node-component.flow-snapshot.next]]**: Draft workspaces

**File-based components:**
- **Documentation files**: 
  - [[Resource pages|mesh-resource.node-component.documentation-resource.resource-page]] are index.html files that provide de-referencability for their containing [[concept.intramesh-identifier]] [[facet.filesystem.folder]]
  - **README.md and CHANGELOG.md**: unstructured documentation
- **[[snapshot distribution files|mesh-resource.node-component.snapshot-distribution]]**: Data files in RDF formats

## Physical vs Logical Structure

**Physical Representation:**
- Mesh nodes and components are represented as folders in the filesystem
- File resources are represented as individual files
- Folder names become namespace segments and URL path components

**Logical Function:**
- All mesh resources are addressable via their URL path
- URLs must return meaningful content when dereferenced
- Resources maintain semantic relationships through containment and cross-references

## Asset Tree Special Case

[[Asset trees|mesh-resource.node-component.asset-tree]] represent a special category where:
- The asset tree itself (with its [[mesh-resource.node-component.flow.node-metadata]]) is part of the mesh structure
- The files and folders contained within asset trees are "attached to" but not "contained in" the mesh
- Asset tree contents are addressable but are not considered semantic flow resources

This distinction maintains clean separation between semantic mesh structure and arbitrary file attachments while preserving addressability.
