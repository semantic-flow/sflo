---
id: jncnax3gfzyher3vg87tf5k
title: Reference Identity and Essentialness
desc: ''
updated: 1767716809398
created: 1767373938172
---

*A working philosophical and architectural position document*

---

## 1. Purpose of This Document

This document articulates the philosophical and structural commitments underlying **Semantic Flow**, with particular focus on:

* reference and identity
* assertions
* payloads and artifacts
* essentialness as a gradient
* the role of refinement over time

It is intentionally **descriptive, not prescriptive**. Semantic Flow does not impose a metaphysics; it provides machinery capable of supporting multiple metaphysical and epistemic stances.

---

## 2. Core Commitments

Semantic Flow is built around a small number of deliberately minimal commitments:

1. **Referents may exist independently of representations.** Some referents are tightly bound to representation ("payload referents" and external digital artifacts), while others exist independently of any artifact.
2. **Assertions may be made in reference datasets and  in artifacts themselves.** Where assertions appear does not determine their authority.
3. **Payloads are artifacts; they may contain assertions and may carry authority claims, but no authority is assumed by default.** Authority is always contingent on provenance, context, and interpretation.
4. **Identity is not fixed at minting time and may shift or fork  through refinement.**
5. **Essentialness is a gradient, not a binary property.**
6. **Authority and accountability are optional, modelled concerns.**

These commitments are designed to support real-world data practices: evolving knowledge, disagreement, partial understanding, refinement, and branching interpretations over time.

---

## 3. Referents, Payloads, and Reference Datasets

### 3.1 Referents

A **referent** is the thing being referred to. It may be:

* physical (a river, a person)
* abstract (a number, a concept)
* institutional (a corporation, a law)
* fictional (a character)
* digital (a file, a dataset, or any other essentially-digital thing)

  * digital referents may be kept in the Knop as PayloadFlows

Semantic Flow does not require non-payload referents to be fully knowable or stable.

---

### 3.2 Payloads

A **payload** is a digital artifact.

Payloads:

* may contain assertions
* may describe other things
* may describe themselves
* may be opaque
* may be authoritative *by convention*, but not by nature

Crucially:

> Payloads are the referents of their identifiers.

Payloads may contain assertions, descriptions, context, or even truth claims. However, the *intended aboutness* (*scope)* of those assertions is not constrained by the Semantic Flow platform.

In other words, payloads can assert, even about themselves, but those assertions are not constrained.

---

### 3.3 Reference Datasets

A **reference dataset** is a collection of assertions **intended to be about a single referent**.

In practice, a reference dataset may include:

* direct assertions about that referent
* contextual assertions needed to interpret those claims
* quoted or attributed claims from multiple sources
* contradictory statements
* assertions with or without provenance

The unifying constraint is *intentional focus*: all assertions in the reference dataset are ultimately meant to relate back to the same referent, even if some provide background or framing rather than direct description.

Importantly:

> A reference dataset is not automatically authoritative.

Authority, if present, is expressed explicitly, attributed to specific assertions, or inferred externally by consumers of the data.

---

## 4. Identity as Refinement and Forking

### 4.1 Identity Is Not Fixed at Minting

When an identifier (IRI) is minted in the Semantic Flow, it does **not** fix or freeze the identity of its referent.

An IRI is **a-temporal**: it does not itself encode when, how, or under what assumptions it is used. By contrast, the **Knop** that supports an IRI is **temporal**. It evolves as reference assertions are added, revised, or superseded. It also evolves as its payload (if present) evolves.

At minting time, an identifier is created with an **initial intended referent**. Over time:

* reference assertions accumulate
* interpretations evolve
* contextual assumptions change
* scope may narrow, broaden, or split

As a result, the *intended referent* of an identifier may **shift**, sometimes subtly and sometimes dramatically. Best practices encourage continuity, but Semantic Flow explicitly allows such drift as a feature of real-world knowledge work.

Because this evolution should be reflected in an evolving Knop, referent shift is not catastrophic. Applications that are aware of time may:

* infer the usage period of an identifier
* interpret assertions relative to when they were made
* recover the intended meaning of an IRI at the time of use

Semantic Flow therefore treats identity as **historical and revisable**, rather than immutable, and treats referent drift as normal rather than erroneous.

---

### 4.2 Identity Forking

In addition to gradual refinement and drift, Semantic Flow explicitly supports **identity forking**.

An identifier may initially refer to a relatively broad or underspecified referent, and later give rise to multiple related identifiers as the domain of discourse expands, diversifies, or is re-understood.

**Example: The Simpsons**

* Initial identifier: "the-simpsons" (mostly referring to the TV series but also, in some sense, the imaginary world)
* Later developments and refinements:

  * A new identifier is minted to refer to "just the tv show" (the-simpson-television-series)
  * The original IRI (the-simpsons) gets a reference data rewrite to capture the Simpsons "superwork"

    * A superwork groups together derivative works (e.g., films, books, merchandise) related to a single original creative work, character, or universe.

  - The Simpsons comic book series (the-simpsons-comics)
  - The Simpsons video game franchise (the-simpsons-videogames)
  - The Simpsons imaginary world (the-simpsons-world)
  - A popular fan theory suggests that *every* story takes place in a slightly different, parallel universe to explain the numerous continuity errors and character inconsistencies. There is also fan fiction, [https://simpsonsfanon.fandom.com/wiki/Multiverse](https://simpsonsfanon.fandom.com/wiki/Multiverse), (the-simpsons-multiverse)

In this scenario:

* the original identifier reflects a time-bound intention that lacks specificity
* re-definition and subsequent identifiers may refine the world of discourse, partially invalidating earlier usage

Semantic Flow should support linking these identifiers through explicit relations (e.g. refinement, specialization, derivation), while preserving the temporal context in which each usage was meaningful.

---

### 4.3 Identity vs. Description

Identity is not equivalent to description, but can be affected by it.

Descriptions:

* can change
* can be corrected
* can conflict

Identity:

* tends to persist, but may evolve across those changes
* may branch into multiple related identities

Semantic Flow supports **identity evolution** and conceptual refinement

---

## 5. Essentialness as a Gradient

Semantic Flow does not treat essence as a binary property.

Instead, it recognizes **degrees of essentialness**, depending on how tightly a thing’s identity is bound to its structure or description.

### Axes of Evaluation

1. **Ontological Independence**
   Does the thing exist independently of representations?

2. **Representational Exhaustiveness**
   Does a representation fully determine the thing?

3. **Essentialness**
   How much does changing structure change identity?

Representational exhaustiveness concerns whether a representation fully specifies a thing; essentialness concerns whether changes to representation change the identity of that thing. The two often correlate, but they are not identical.

---

## 6. Example Spectrum

| Thing               | Ontological Independence | Representational Exhaustiveness | Essentialness |
| ------------------- | ------------------------ | ------------------------------- | ------------- |
| Water (physical)    | High                     | Low                             | Low           |
| Historical person   | High                     | Low                             | Low           |
| Legal entity        | Medium                   | Medium                          | Medium        |
| Fictional character | Medium                   | Medium                          | Medium        |
| Scientific dataset  | Low                      | High                            | High          |
| Ontology file       | Low                      | High                            | High          |
| Software binary     | Low                      | High                            | High          |
| Binary blob         | Low                      | High                            | Very High     |
| Research paper      | Low                      | Medium                          | Medium        |
| Conceptual model    | Medium                   | Medium                          | Medium        |

This spectrum is descriptive, not normative.

---

## 7. Truth, Interpretation, and (Optional) Models

Semantic Flow does **not** address truth directly, nor does it require a notion of "models" in the formal, logical sense.

Instead, Semantic Flow focuses on **preserving assertions, their contexts, and their temporal relationships to referents**, while leaving questions of truth evaluation to downstream consumers.

The term *model* may be used informally to describe any interpretive framework a consumer applies when reading assertions, such as:

* a scientific framework (e.g. contemporary chemistry)
* a legal or institutional framework
* a fictional or narrative world
* an application-specific operational context
* a user-defined interpretive stance

Under such a framework, a consumer *may* choose to evaluate statements as true or false, but Semantic Flow itself does not require or enforce this.

When used in this loose sense, one can say:

> A statement may be considered true relative to an interpretive framework.

However:

* Semantic Flow does not require truth values
* Semantic Flow does not require formal model theory
* Semantic Flow does not privilege any particular framework
* Assertions may be preserved without evaluation

Semantic Flow therefore supports scientific, narrative, legal, provisional, or even contradictory assertions, without committing to any single theory of truth.

---

## 8. Authority and Accountability

Semantic Flow does **not** enforce authority.

It supports:

* attribution
* provenance
* signatures
* trust models
* delegation

But none are mandatory.

This allows:

* authoritative datasets
* informal collections
* collaborative editing
* speculative modeling
* archival preservation

Accountability is therefore **modeled, not assumed**. And like meaning, it may be time-relative.

---

## 9. Philosophical Position (Summary)

Semantic Flow:

* supports but does not impose metaphysical essentialism
* supports but does not impose semantic relativism
* rejects automatic authority
* supports evolving identity
* accepts referent multiplicity (multiple related referents for a single identifier) but encourages single-referentness by allowing refinement
* supports disagreement

It is best described as:

> A pragmatic framework for naming referents (possibly embedded as digital "payload" artifacts), and hosting evolving assertions about those referents, over time, without imposing a single theory of truth, meaning, or authority.

---

## 10. Closing Note

Semantic Flow is designed for real systems, real data, and real uncertainty.

It does not attempt to solve philosophy.
It attempts to remain coherent in its presence.

---
