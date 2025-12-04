---
id: s5ild34tbe4w2wt4m8ldllg
title: Example Mesh Hierarchy
desc: ''
updated: 1764867799448
created: 1750640592487
---

```file
/test-ns/                                        # bare knop
├── _meta/                                       # knop flow (metadata)
│   ├── _default/                                # flow version
│   │   ├── ns_meta.trig                         # system metadata about the bare knop
│   │   └── index.html                           # resource page
│   └── index.html                               # resource page
├── _assets/                                     # asset tree
│   ├── images/
│   │   └── logo.svg
│   └── index.html                               # resource page
└── index.html                                   # resource page

/test-ns/djradon/                                # dataset knop
├── _knop-handle/                                     # handle component
│   └── index.html                               # mesh knop handle page
├── _data/                                       # knop flow (data)
│   ├── _default/                                # flow version
│   │   └── index.html                           # resource page
│   ├── _working/                                # flow version (draft)
│   │   └── index.html                           # resource page
│   └── index.html                               # resource page
├── _meta/                                       # knop flow (metadata)
│   ├── _default/                                # flow version
│   │   ├── djradon_meta.trig                    # system metadata, verification status
│   │   └── index.html                           # resource page
│   └── index.html                               # resource page
├── _assets/                                     # asset tree
│   ├── profile-photo.jpg
│   └── index.html                               # resource page
├── index.html                                   # resource page
├── CHANGELOG.md                                 # resource changelog
└── README.md                                    # resource documentation

/test-ns/djradon/bio/                            # dataset knop (unversioned dataset)
├── _data/                                       # knop flow (data)
│   ├── _default/                                # flow version
│   │   ├── djradon-bio_data.trig                      # biographical data distribution
│   │   ├── djradon-bio_data.jsonld                   # alternative distribution
│   │   └── index.html                           # resource page
│   ├── _working/                                # flow version (draft)
│   │   ├── djradon-bio_data.trig                      # draft biographical data
│   │   └── index.html                           # resource page
│   └── index.html                               # resource page
├── _meta/                                       # knop flow (metadata)
│   ├── _default/                                # flow version
│   │   ├── djradon-bio_meta.trig                # dataset metadata, provenance
│   │   └── index.html                           # resource page
│   ├── _working/                                # flow version (draft)
│   │   ├── djradon-bio_meta.trig                # draft dataset metadata
│   │   └── index.html                           # resource page
│   └── index.html                               # resource page
├── index.html                                   # resource page
├── CHANGELOG.md                                   # resource page
└── README.md                                    # resource documentation

/test-ns/djradon/picks/                          # dataset knop (versioned dataset)
├── _data/                                       # knop flow (data)
│   ├── _default/                                # flow version
│   │   ├── djradon-picks.trig                    # current picks data
│   │   ├── djradon-picks.jsonld
│   │   └── index.html                           # resource page
│   ├── _working/                                # flow version (draft)
│   │   ├── djradon-picks.trig                    # draft picks data
│   │   ├── djradon-picks.jsonld
│   │   └── index.html                           # resource page
│   ├── 2025-11-24_0142_07_v1/                   # flow version (version 1)
│   │   ├── djradon-picks_v1.trig                 # version 1 version
│   │   └── index.html                           # resource page
│   ├── 2025-11-24_0142_08_v2/                   # flow version (version 2)
│   │   ├── djradon-picks_v2.trig                 # version 2 version
│   │   └── index.html                           # resource page
│   └── index.html                               # resource page
├── _meta/                                       # knop flow (metadata)
│   ├── _default/                                # flow version
│   │   ├── djradon-picks_meta.trig              # versioning metadata, series info
│   │   └── index.html                           # resource page
│   ├── _working/                                # flow version (draft)
│   │   ├── djradon-picks_meta.trig              # draft versioning metadata
│   │   └── index.html                           # resource page
│   └── index.html                               # resource page
├── djradon-picks.trig                            # aggregated distribution
├── index.html                                   # resource page
└── CHANGELOG.md                                 # resource documentation

/test-ns/djradon/underbrush/playlists/                              # bare knop (container for playlist series)
├── _meta/                                       # knop flow (metadata)
│   ├── _default/                                # flow version
│   │   ├── playlists_meta.trig                  # metadata about playlist namespace
│   │   └── index.html                           # resource page
│   ├── _working/                                # flow version (draft)
│   │   ├── playlists_meta.trig                  # draft metadata
│   │   └── index.html                           # resource page
│   └── index.html                               # resource page
├── index.html                                   # resource page
├── 1996-11-10/                                  # dataset knop (individual playlist)
│   ├── _data/                                   # knop flow (data)
│   │   ├── _default/                            # flow version
│   │   │   ├── 1996-11-10.trig                   # playlist data
│   │   │   └── index.html                       # resource page
│   │   ├── _working/                            # flow version (draft)
│   │   │   ├── 1996-11-10.trig                   # draft playlist data
│   │   │   └── index.html                       # resource page
│   │   └── index.html                           # resource page
│   ├── _meta/                                   # knop flow (metadata)
│   │   ├── _default/                            # flow version
│   │   │   ├── 1996-11-10_meta.trig             # playlist metadata
│   │   │   └── index.html                       # resource page
│   │   ├── _working/                            # flow version (draft)
│   │   │   ├── 1996-11-10_meta.trig             # draft playlist metadata
│   │   │   └── index.html                       # resource page
│   │   └── index.html                           # resource page
│   ├── _assets/                                 # asset tree
│   │   ├── _meta/                               # knop flow (metadata)
│   │   │   ├── _default/                        # flow version
│   │   │   │   ├── 1996-11-10_assets.trig       # asset metadata
│   │   │   │   └── index.html                   # resource page
│   │   │   ├── _working/                        # flow version (draft)
│   │   │   │   ├── 1996-11-10_assets.trig       # draft asset metadata
│   │   │   │   └── index.html                   # resource page
│   │   │   └── index.html                       # resource page
│   │   ├── cover-photo.jpg
│   │   └── index.html                           # resource page
│   ├── 1996-11-10.trig                           # aggregated distribution
│   └── index.html                               # resource page
└── 1996-11-17/                                  # dataset knop (another playlist)
    ├── _data/                                   # knop flow (data)
    │   ├── _default/                            # flow version
    │   │   ├── 1996-11-17.trig
    │   │   └── index.html                       # resource page
    │   ├── _working/                            # flow version (draft)
    │   │   ├── 1996-11-17.trig
    │   │   └── index.html                       # resource page
    │   └── index.html                           # resource page
    ├── _meta/                                   # knop flow (metadata)
    │   ├── _default/                            # flow version
    │   │   ├── 1996-11-17_meta.trig
    │   │   └── index.html                       # resource page
    │   ├── _working/                            # flow version (draft)
    │   │   ├── 1996-11-17_meta.trig
    │   │   └── index.html                       # resource page
    │   └── index.html                           # resource page
    ├── 1996-11-17.trig                           # aggregated distribution
    └── index.html                               # resource page

```
