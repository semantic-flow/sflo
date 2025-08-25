
## t.2025.08.20.22

- the AIs feel like they have a lot more exp

## t.2025.08.20.12

- Starting a rewrite with NodeJS. But Deno will always be my first love. 

![](assets/images/deno-vs-node.png)

## t.2025.07.12.06

- node config is a component, so it can travel around ([[principle.transposability]] and [[principle.composability]])
- the [[resource.node-component.node-config-defaults]] is actually a "defaults" file that only gets used when nodes don't have a config yet (or their config is reset)
  - when importing, grafting, you have the option to reset (parts of) config.
  - the tree walk for config-defaults only needs to happen when:
    - a node's config is empty
    - config schema version gets bumped?

## t.2025.07.07.05

Ready.

## t.2025.07.05.22

It's hard to imagine the design shifting significantly, but that's been true for days (weeks?) and yet the shifts continue. Ready to start on the ontology. 

## t.2025.06.29.20

Lume is great. 

Also, the idea of letting contributors keep a devlog in-repo... Someone must've thought of that.

I think I've basically figure out the mesh design. Straightening out the docs, ready to partner with Cline (or maybe RooCode) to start my SDLC. Although it'll be more like a random star walk where you can transition to any point, docs ^ ontology ^ test-repo ^ api ^ service ^ client ^ qa ^ etc

## t.2024.11.11.06

 - I was ready to abandon Cliffy and Deno (probably for Gluegun), but the security and dynamicness seem important enough. Turns out Cliffy is great. Lume seems good too.

## t.2024.10.31.04

from [[t.cs.ai.assistant.memory-hygiene]]:

![[daily.journal.2024.10.31#^fsmlpwwwuvic]]
![[daily.journal.2024.10.31#^padng51sf3k8]]
![[daily.journal.2024.10.31#^4wdvmcwtsqi6]]
![[daily.journal.2024.10.31#^rx7vbtp5gar1]]
 

## t.2024.10.29.11

- now thinking about a "terms" hierarchy next to the namespace hierarchy. Names are supposed to be unique. Maybe punning could help
- how do we keep a history of the index.trig file? I guess it might change while in development, but once settled, it should very rarely change. 
  - if it does change, perhaps its content could be discovered using the inverse properties from the default and catalog datasets
  - it might be easiest if everything was a dataset; I mean, everything almost already is, for gods sake. I just can't bear to say that <dave-richardson> a dcat:dataset.

## t.2024.10.29.09

- renamed to [[concept.mesh-repo]]
- instead of duplicating highlights in a NI's index.trig, just define the _default datasets as "highlights" and use owl:imports

## t.2024.10.29.06

- I've been wanting to have a place where people can just make changes directly to the RDF, and the tooling (on commit) copies it to a new version. "current"
- I think there's a decision to be made between using the src hierarchy structure and generating the hierarchy; it might be related to the tension between supporting multiple repos.
  - seems like the issue is "distributions", the files have to live in the hierarchy. Unless you just break distribution out of the namespace entirely, but that seems lame
  - probably doesn't make any sense to call it a namespace-repo any more... the namespaces live under it
  - 

## t.2024.10.28.15

- tried metalsmith-ldschema, underscored the point that the docs folder/site might need some javascript and templates and assets that could interfere with the namespace, so the actual namespace will probably need to live the next level down
- got a site to build... it's basically empty because metalsmith-ldschema only generates pages for classes and properties, but still, feeling good.

## t.2024.10.01.09

### chatgpt memory

- dave: Remember: I'm trying to develop a static-site generator called "Semantic Flow" that takes ontologies defined in RDF and/or conforming RDF data files and generates a static site to be hosted on GitHub pages that includes HTML-based index files (that can be based on a template or customized as necessary) that describe identified resources and link to raw RDF data files (possibly in multiple formats) that can be access by semantically-aware applications.
