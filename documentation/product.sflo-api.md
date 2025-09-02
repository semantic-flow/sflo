---
id: 63tfb27btzbph10tpvckz7b
title: sflo-api
desc: ''
updated: 1756767742320
created: 1755903460930
---

TODO: 


## Mesh Management

### `POST /api/meshes`

**Description**: Registers a new mesh with the service, making it available for further operations. This endpoint does not create any files or nodes; it simply associates a logical name with a filesystem path.

**Request Body**:
```json
{
  "name": "test-ns",
  "path": "./test-ns"
}
```

**Success Response (201 Created)**:
```json
{
  "message": "Mesh 'test-ns' registered successfully.",
  "links": [
    { "rel": "self", "href": "/api/meshes/test-ns" },
    { "rel": "nodes", "href": "/api/meshes/test-ns/nodes" }
  ]
}
```

**HATEOAS Prompting**: If there's no mesh signature (e.g., a `_handle` or `_meta-flow` folder) in the specified path, the response includes a prompt to create a root node:

```json
{
  "message": "Mesh 'test-ns' registered successfully. No mesh signature detected.",
  "links": [
    { "rel": "self", "href": "/api/meshes/test-ns" },
    { "rel": "nodes", "href": "/api/meshes/test-ns/nodes" },
    { "rel": "create-root-node", "href": "/api/meshes/test-ns/nodes", "method": "POST", "title": "Initialize this mesh by creating a root node" }
  ]
}
```

### `GET /api/meshes`

**Description**: Lists all registered meshes.

**Success Response (200 OK)**:
```json
{
  "meshes": [
    {
      "name": "test-ns",
      "path": "./test-ns",
      "links": [
        { "rel": "self", "href": "/api/meshes/test-ns" },
        { "rel": "nodes", "href": "/api/meshes/test-ns/nodes" }
      ]
    }
  ]
}
```

## Node Management

### `POST /api/meshes/{meshName}/nodes`

**Description**: Creates a new node at a specified path within a registered mesh. This is used for creating all nodes, including the root node of a mesh.

**IRI Parameters**:
- `{meshName}`: The logical name of the mesh (e.g., "test-ns").

**Request Body**:
```json
{
  "path": "/",
  "nodeType": "Namespace",
  "initialData": {
    "title": "djradon's primary semantic mesh"
  },
  "options": {
    "copyDefaultAssets": true
  }
}
```

**Key Body Parameters**:
- `path`: The relative path for the new node. For the root node, use `/` or an empty string; the API will return `/{meshName}/` as its path.
- `nodeType`: The type of node to create ("Namespace", "Reference", or "Dataset").
- `initialData`: An object containing the initial metadata for the node.
- `options.copyDefaultAssets`: A boolean to indicate if default assets (templates, CSS) should be copied into the mesh. This is typically `true` only when creating the root node.

**Success Response (201 Created)**:
```json
{
  "message": "Node created successfully at path '/test-ns/' in mesh 'test-ns'.",
  "nodePath": "/test-ns/",
  "filesCreated": [
    "./test-ns/index.html",
    "./test-ns/_meta-component/v1.trig"
  ],
  "links": [
    { "rel": "self", "href": "/api/meshes/test-ns/nodes/test-ns/" },
    { "rel": "mesh", "href": "/api/meshes/test-ns" }
  ]
}
```

### Other Node Endpoints

- `GET /api/meshes/{meshName}/nodes/{path}` - Retrieve node
- `PUT /api/meshes/{meshName}/nodes/{path}` - Update node
- `DELETE /api/meshes/{meshName}/nodes/{path}` - Delete node
- `POST /api/meshes/{meshName}/nodes/{path}/graft` - Start a new node from an existing snapshot

## Weave and Distribution

- `POST /api/meshes/{meshName}/weave` - Trigger weave operation
- `POST /api/meshes/{meshName}/dataset/upload` - Upload RDF dataset distribution
- `GET /api/meshes/{meshName}/dataset/{path}/versions` - List dataset versions
- `POST /api/meshes/{meshName}/assets/upload` - Upload binary file resources

## Service Management


## 

### mesh registration


### node initialization


#### differences with mesh init

- same as mesh initialization, except:
  - specify an [[sflo.concept.relative-identifier]] and select a parent node (or specify a path which is equivalent),
  - by default, no template/css copy

### weave

- copy any [[sflo.concept.mesh.resource.folder._next]]  to  
