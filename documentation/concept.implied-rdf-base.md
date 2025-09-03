---
id: implied-rdf-base
title: implied rdf base
desc: publishing platform IRI prefix for a site
updated: 1756839979810
created: 1750486049862
---

## Overview

[[mesh-resource.node-component.snapshot-distribution]]s have an **implied namespace base**, essentially the absolute IRI that corresponds to the [[concept.publication]] URL (without the filename).

## RDF Bases

An RDF BASE declaration is a directive within an RDF document that establishes a document's base IRI, defining a default location to which all relative IRIs within that document will be resolved.

If the base isn't declared explicitly, applications are supposed to fall back to the IRI used to retrieve the document. (See RFC 3986 Section 5.1.3: "[Base URI from the Retrieval URI](https://datatracker.ietf.org/doc/html/rfc3986#section-5.1.3)").

To keep meshes transposable, Semantic Flow relies on this implicit basing to give meshes [[principle.transposability.host]].
