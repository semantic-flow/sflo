
This element is "mesh-terminal" and should contain no [[sflow-resources|concept.mesh.resource]]. 

It can be contained in any [[concept.mesh.resource.folder.node]], i.e., only Nodes get assets trees.

Its metadata (if any) should be stored in the closest parent node.

It can contain an arbitray set of files and folders, but two (optional) folders are special:
- _templates can contain html files to be used when generating [[concept.mesh.resource.element.documentation-resource.resource-page]] for the containing [[concept.mesh.resource.node]] or its sub-resources.     