---
id: kknjn44xhec8po61lrtdc8l
title: Consistency
desc: ''
updated: 1765761372809
created: 1765757808666
---

This document defines the consistency model used by **Semantic Flow** during weave operations.

## Summary

**Weave publishes a snapshot.**
Consistency is achieved by capturing a stable, in-memory snapshot of the targeted `_working` inputs at the start of a weave. Subsequent edits do not affect the published result and are treated as input for future weaves.

No filesystem locks, Git assumptions, or directory-wide copies are required.

---

## Scope of Mutability

* **Mutable (user-authored):** `_working/`
  Typically a *single file* (plus a stub `index.html`, which is expected not to change).
* **immutable**
  All published slices

* **Managed by weave (not user-edited):**
  * `_slice-inventory.ttl`
  * `_pointers.jsonld`


The latter files are not immutable, but **must only be modified by sflo tooling**.

---

## Snapshot Semantics

A weave captures a **coherent snapshot** of `_working` by reading files into memory and verifying stability during the read.

### Procedure (per file)

1. `stat₁` → record `(size, mtime)`
2. Prune (see below) to produce "selected" distributions
3. `read` → read distribution file bytes into memory
4. `stat₂`
5. Accept snapshot **iff** `stat₁ == stat₂` for all selected distributions
   Otherwise retry or abort.

This prevents mid-read edits from corrupting the snapshot.

After all selected `_working` distributions are successfully read:

* The snapshot is fixed for this weave.
* The advisory sentinel may be removed.
* Any later edits to `_working` are irrelevant to this weave and apply to future weaves.

### Pruning Procedure


Pruning is an optimization applied **during snapshot capture**, after `stat₁` is recorded.

For each targeted **flow**:

1. Perform `stat₁` on the flow’s `_working` distribution.
2. Compare `stat₁` with the metadata recorded from the previous successful weave for that flow.
3. If the distribution is unchanged:

   * The flow is **pruned**.
   * It is **excluded from the weave**.
   * No read–verify is performed for that flow.
4. If the distribution has changed:

   * Proceed with the normal read–verify procedure.
   * The flow is included in the weave.

Pruning decisions are made **after `stat₁`** and before any reads occur.

---

### Correctness Guarantees

* Pruned flows do not participate in the current weave and therefore do not affect the published snapshot.
* Snapshot correctness applies only to **non-pruned flows**.
* If pruning metadata is unavailable, ambiguous, or inconsistent, the weave MUST treat the flow as changed and include it.
* Changes made to `_working` after `stat₁` are outside the snapshot boundary and are handled by a subsequent weave.

---

### Rationale

This pruning model ensures:

* Only flows with actual input changes are woven.
* Snapshot capture remains race-safe by anchoring decisions to `stat₁`.
* No stale data is reused or implicitly revalidated.
* The weave remains incremental without weakening correctness.

In other words:

> **Unchanged flows are not re-woven; changed flows are snapshot and woven.**


---

## Multi-Knop Consistency

When consistency is required across multiple knops (e.g., a role-playing game state):

1. Capture snapshots for all targeted knops first.
2. If any snapshot is unstable, abort before weaving.
3. Weave from the captured snapshots.
4. Publish results together (optionally via a single release switch).

This ensures the published state corresponds to a single logical snapshot across knops.

---

## Concurrency Signaling

`/_weave-in-progress.jsonld` MAY be present to discourage simultaneous weaves.

* It is **advisory**, not a lock.
* Tools SHOULD avoid starting a new weave while it exists.
* Edits are not prevented; **edits made during the brief snapshot read phase will cause the weave to fail**.
* The sentinel MAY be removed immediately after all targeted `_working` distributions are read.

Optional fields:

* `startedAt`
* `startedBy`
* `weaveLabel` (optional; replaces `txnId`, especially when `useTimestamps: false`)

---

## What Consistency Does *Not* Require

* No Git working tree
* No filesystem snapshots
* No directory-wide copying
* No hard locks
* No blocking or prevention of edits outside the snapshot read window

---

## Design Rationale

* **Minimal surface:** One file per `_working` keeps snapshot logic simple.
* **Correctness:** Read–verify ensures snapshots reflect a real, coherent state.
* **Predictability:** Published slices always correspond to an actual snapshot that existed.

---

## Required Invariant

> `_working` is the only user-authored mutable input to a weave.
> `_pointers.jsonld` and `_slice-inventory.ttl` are managed exclusively by sflo tooling.

If this invariant holds, the consistency model is sound.
