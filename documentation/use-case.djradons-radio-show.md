---
id: kawddwi1dx4qqbhdyip4896
title: 'Use Case: Radio Show Websiste'
desc: a simple user story
updated: 1753014248843
created: 1750645191521
---

Suppose DJ Radon wants to publish a website about himself, his musical activities, and maybe some album reviews. Call it a wiki, call it a knowledgebase, call it a show site. 

To get started, he wants to publish his top-5 most-played tracks of the week. 

Publishing them as plain-text might be adequate for this situation, but say he eventually wanted to make his site linked: you can click from a playlist, to an album, to a track, to an artist. 

But to get started:

* A **namespace** `/test-ns/`
* A **thing** `/ns/djradon/`
* A **dataset** `/ns/djradon/picks/`

#### Mesh Directory Structure

```file
test-ns                    # namespace node
   djradon                 # ref node (refering to a human dj)
      bio                  # data node
      picks                # data node 
      underbrush           # ref node
         playlists         # data (series) node
            1996-11-10     # data node
            1996-11-17     # data node
```

#### Sample RDF (Turtle)

1. **Namespace metadata**

   ```turtle
   # /ns/_id/ns_id.trig
   <> a sf:Namespace ;
      dct:title "Namespace Root" ;
      sf:contains <https://example.org/ns/djradon/> .
   ```

2. **Thing metadata**

   ```turtle
   # /ns/djradon/_id/djradon_id.trig
   <> a sf:Thing ;
      rdfs:label "djradon" ;
      sf:backlink <https://example.org/ns/> .
   ```

3. **Dataset metadata**

   ```turtle
   # /ns/djradon/picks/_id/picks_id.trig
   <> a sf:VersionedDataset ;
      dct:title "djradon picks" ;
      sf:backlink <https://example.org/ns/djradon/> .
   ```

4. **Current distribution**

   ```turtle
   # /ns/djradon/picks/picks.trig
   <> dct:issued "2025-06-22"^^xsd:date ;
      dct:creator <https://example.org/agents/bot> .
   ```

5. **Historical version**

   ```turtle
   # /ns/djradon/picks/_v-series/v1/picks_v1.trig
   <> dct:issued "2025-06-01"^^xsd:date .
   ```

---

With these few rules and a tiny folder-walking parser your **Semantic Mesh** is unambiguously self-describing, easy to validate, and ready for any RDF-aware tooling.
