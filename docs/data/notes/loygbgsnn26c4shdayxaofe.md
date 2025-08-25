
Resource fragments are [[product.service.design.htmx]] fragments, support dynamic behaviour in [[resource.node-component.documentation-resource.resource-page]] or external web apps without a "live" backend.

For resource pages, they're most useful for "saving bandwidth": data that might not be needed can be loaded later.

For external apps, they save the overhead of parsing and discovery.

Fragment generation can be configured per node or inherited from config hierarchy.

## **Multiple Resource Fragments in Assets**

This is a natural extension of your asset tree concept (.9):

```
mesh-node/
├── _assets/
│   ├── fragments/               # Generated resource pages
│   │   ├── README.html          # generated from README.md
│   │   ├── CHANGELOG.html       # generated from CHANGELOG.md
│   │   └── back-references.html # list of back-references
│   └── styles/
│       └── common.css
├── _meta-flow/
├── CHANGELOG.md
└── README.md
```

