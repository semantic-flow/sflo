
## Operational Modalities

### Manual Manipulation
- Pre-built node folder structures with user-editable flows and other components
- Manual mesh resource creation (nodes; flows, snapshots, distributions and other components)
- File-system based editing workflows
- Validation of hand-crafted mesh structures

### API-Driven Node Manipulation
- Flow-service API endpoints for programmatic node creation
- Support for root node initialization
- Flow and other component management via API
- RESTful mesh resource manipulation

### Dataset Distribution Upload + Extraction
- Upload mechanisms for payload RDF datasets (.trig, .jsonld, etc.)
- Automatic named entity extraction from semantic data
- System-generated reference and dataset nodes
- Batch processing of semantic data
- **Limitation**: Cannot handle binary file resources (audio, images, etc.) - only RDF data
- File resources must be handled via Direct Manual Construction or API-Driven modalities
