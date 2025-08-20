---
id: mf6mhj0ihmdxtftnxfatghj
title: Mesh CRUD
desc: 'CReate, Update, or Delete mesh data'
updated: 1753014787991
created: 1753014706077
---

## Operational Modalities

**A. Manual Manipulation**
- Pre-built node folder structures with user-editable layers
- Manual mesh resource creation (nodes; flows, snapshots, distributions and other elements)
- File-system based editing workflows
- Validation of hand-crafted mesh structures

**B. API-Driven Node Manipulation**
- Flow-service API endpoints for programmatic node creation
- Support for root node initialization
- Component and element management via API
- RESTful mesh resource manipulation

**C. Dataset Distribution Upload + Extraction**
- Upload mechanisms for RDF dataset distributions (.trig, .jsonld, etc.)
- Automatic named entity extraction from semantic data
- System-generated reference and data nodes
- Batch processing of semantic data
- **Limitation**: Cannot handle binary file resources (audio, images, etc.) - only RDF data
- File resources must be handled via Direct Manual Construction or API-Driven modalities