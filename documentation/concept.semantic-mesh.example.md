---
id: s5ild34tbe4w2wt4m8ldllg
title: Example Mesh Hierarchy
desc: ''
updated: 1756869568790
created: 1750640592487
---

```file
/test-ns/                                        # bare node
├── _node-metadata-flow/                                       # node flow (metadata)
│   ├── _current/                                # flow snapshot
│   │   ├── ns_meta.trig                         # system metadata about the bare node
│   │   └── index.html                           # resource page
│   └── index.html                               # resource page
├── _assets/                                     # asset tree
│   ├── images/
│   │   └── logo.svg
│   └── index.html                               # resource page
└── index.html                                   # resource page

/test-ns/djradon/                                # dataset node  
├── _node-handle/                                     # handle component
│   └── index.html                               # mesh node handle page
├── _dataset-flow/                                       # node flow (data)
│   ├── _current/                                # flow snapshot
│   │   └── index.html                           # resource page
│   ├── _next/                                   # flow snapshot (draft)
│   │   └── index.html                           # resource page
│   └── index.html                               # resource page
├── _node-metadata-flow/                                       # node flow (metadata)
│   ├── _current/                                # flow snapshot
│   │   ├── djradon_meta.trig                    # system metadata, verification status
│   │   └── index.html                           # resource page
│   └── index.html                               # resource page
├── _assets/                                     # asset tree
│   ├── profile-photo.jpg
│   └── index.html                               # resource page
├── index.html                                   # resource page
├── CHANGELOG.md                                 # resource changelog
└── README.md                                    # resource documentation

/test-ns/djradon/bio/                            # dataset node (unversioned dataset)
├── _dataset-flow/                                       # node flow (data)
│   ├── _current/                                # flow snapshot
│   │   ├── djradon-bio_data.trig                      # biographical data distribution
│   │   ├── djradon-bio_data.jsonld                   # alternative distribution
│   │   └── index.html                           # resource page
│   ├── _next/                                   # flow snapshot (draft)
│   │   ├── djradon-bio_data.trig                      # draft biographical data
│   │   └── index.html                           # resource page
│   └── index.html                               # resource page
├── _node-metadata-flow/                                       # node flow (metadata)
│   ├── _current/                                # flow snapshot
│   │   ├── djradon-bio_meta.trig                # dataset metadata, provenance
│   │   └── index.html                           # resource page
│   ├── _next/                                   # flow snapshot (draft)
│   │   ├── djradon-bio_meta.trig                # draft dataset metadata
│   │   └── index.html                           # resource page
│   └── index.html                               # resource page
├── index.html                                   # resource page
├── CHANGELOG.md                                   # resource page
└── README.md                                    # resource documentation

/test-ns/djradon/picks/                          # dataset node (versioned dataset)
├── _dataset-flow/                                       # node flow (data)
│   ├── _current/                                # flow snapshot
│   │   ├── djradon-picks.trig                    # current picks data
│   │   ├── djradon-picks.jsonld
│   │   └── index.html                           # resource page
│   ├── _next/                                   # flow snapshot (draft)
│   │   ├── djradon-picks.trig                    # draft picks data
│   │   ├── djradon-picks.jsonld
│   │   └── index.html                           # resource page
│   ├── _v1/                                     # flow snapshot (version 1)
│   │   ├── djradon-picks_v1.trig                 # version 1 snapshot
│   │   └── index.html                           # resource page
│   ├── _v2/                                     # flow snapshot (version 2)
│   │   ├── djradon-picks_v2.trig                 # version 2 snapshot
│   │   └── index.html                           # resource page
│   └── index.html                               # resource page
├── _node-metadata-flow/                                       # node flow (metadata)
│   ├── _current/                                # flow snapshot
│   │   ├── djradon-picks_meta.trig              # versioning metadata, series info
│   │   └── index.html                           # resource page
│   ├── _next/                                   # flow snapshot (draft)
│   │   ├── djradon-picks_meta.trig              # draft versioning metadata
│   │   └── index.html                           # resource page
│   └── index.html                               # resource page
├── djradon-picks.trig                            # aggregated distribution
├── index.html                                   # resource page
└── CHANGELOG.md                                 # resource documentation

/test-ns/djradon/underbrush/playlists/                              # bare node (container for playlist series)
├── _node-metadata-flow/                                       # node flow (metadata)
│   ├── _current/                                # flow snapshot
│   │   ├── playlists_meta.trig                  # metadata about playlist namespace
│   │   └── index.html                           # resource page
│   ├── _next/                                   # flow snapshot (draft)
│   │   ├── playlists_meta.trig                  # draft metadata
│   │   └── index.html                           # resource page
│   └── index.html                               # resource page
├── index.html                                   # resource page
├── 1996-11-10/                                  # dataset node (individual playlist)
│   ├── _dataset-flow/                                   # node flow (data)
│   │   ├── _current/                            # flow snapshot
│   │   │   ├── 1996-11-10.trig                   # playlist data
│   │   │   └── index.html                       # resource page
│   │   ├── _next/                               # flow snapshot (draft)
│   │   │   ├── 1996-11-10.trig                   # draft playlist data
│   │   │   └── index.html                       # resource page
│   │   └── index.html                           # resource page
│   ├── _node-metadata-flow/                                   # node flow (metadata)
│   │   ├── _current/                            # flow snapshot
│   │   │   ├── 1996-11-10_meta.trig             # playlist metadata
│   │   │   └── index.html                       # resource page
│   │   ├── _next/                               # flow snapshot (draft)
│   │   │   ├── 1996-11-10_meta.trig             # draft playlist metadata
│   │   │   └── index.html                       # resource page
│   │   └── index.html                           # resource page
│   ├── _assets/                                 # asset tree
│   │   ├── _node-metadata-flow/                               # node flow (metadata)
│   │   │   ├── _current/                        # flow snapshot
│   │   │   │   ├── 1996-11-10_assets.trig       # asset metadata
│   │   │   │   └── index.html                   # resource page
│   │   │   ├── _next/                           # flow snapshot (draft)
│   │   │   │   ├── 1996-11-10_assets.trig       # draft asset metadata
│   │   │   │   └── index.html                   # resource page
│   │   │   └── index.html                       # resource page
│   │   ├── cover-photo.jpg
│   │   └── index.html                           # resource page
│   ├── 1996-11-10.trig                           # aggregated distribution
│   └── index.html                               # resource page
└── 1996-11-17/                                  # dataset node (another playlist)
    ├── _dataset-flow/                                   # node flow (data)
    │   ├── _current/                            # flow snapshot
    │   │   ├── 1996-11-17.trig
    │   │   └── index.html                       # resource page
    │   ├── _next/                               # flow snapshot (draft)
    │   │   ├── 1996-11-17.trig
    │   │   └── index.html                       # resource page
    │   └── index.html                           # resource page
    ├── _node-metadata-flow/                                   # node flow (metadata)
    │   ├── _current/                            # flow snapshot
    │   │   ├── 1996-11-17_meta.trig
    │   │   └── index.html                       # resource page
    │   ├── _next/                               # flow snapshot (draft)
    │   │   ├── 1996-11-17_meta.trig
    │   │   └── index.html                       # resource page
    │   └── index.html                           # resource page
    ├── 1996-11-17.trig                           # aggregated distribution
    └── index.html                               # resource page

```
