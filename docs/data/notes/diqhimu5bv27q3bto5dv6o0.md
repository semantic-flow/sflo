

## Github Pages and Github Repos

- can either be "username/org pages repository"" (which automatically hosts content at the namesake IRI, so maybe call it a namesake repository, e.g. djradon.github.io) or 2nd-level (corresponding to an owned repo)
- under "classic" github pages (i.e., "deploy from a branch"), you can either use the whole repo, or just the docs folder as the source
  - Semantic Flow works seamlessly using the entire folder for[[concept.single-mesh-repo]].
  - for [[concept.mesh.embedded]] repos, a build step will be needed to copy the mesh folders and files into "docs"
  
## Questions

- can you include a mesh in an existing repo?
  - Sure! That's an [[concept.mesh.embedded]].
  - but when composing a mesh from existing meshes, (i.e., linking a repo into an existing mesh) you need an unbroken chain, so embedding a non-[[concept.single-mesh-repo]] might be more difficult, e.g. requiring sparse checkouts. 


## 1. Git Constraints

### 1.1 Weave does not interact with Git

Weave is a pure filesystem operation. It:

- reads current FlowShots (especially each Flow’s `_working/` directory),
- validates and processes them,
- writes new snapshot directories and `_default/` content,
- updates `_working/` to match `_default/` after a successful weave.

Weave **does not**:

- create commits,
- stage files,
- modify any Git metadata.

Git history is independent of weave activity.

---

### 1.2 Weave operates on current FlowShots, not commit state

Weave consumes the **current contents of the mesh’s FlowShots in the working
tree** (primarily `_working/` for each Flow), regardless of whether those files
are committed to Git.

Therefore:

- The working tree **does not need to be clean**.
- You may have modified, staged, or untracked files.
- What matters is whether the Flow’s `_working/` datasets are in a state the
  weaver can understand (valid enough to process), not whether they’re committed.

Git commits are optional checkpoints, not prerequisites.

---

### 1.3 Flow ordinality is maintained in RDF metadata and reflected into the filesystem

Each versioned Flow maintains:

- a `sequenceNumber` (monotonic integer per Flow),
- a weaveLabel (format: `YYYY-MM-DD_HHMM_SS`, e.g. `2025-11-24_0142_07`),
- snapshot directories combining weaveLabel and sequence number (format: `YYYY-MM-DD_HHMM_SS_vN`, e.g., `2025-11-24_0142_07_v1`).

These are:

- assigned by weave, based on Flow state,
- independent of the Git commit graph.

---

## 2. Why Git Constraints Exist

Semantic meshes assume that each Flow evolves along **one linear timeline**.

If Git introduces merges joining divergent histories, you can end up with:

- multiple incompatible "next" snapshots for the same Flow,
- ambiguous or duplicated sequence numbers in snapshot folder names,
- weaveLabels that no longer line up with a single causal sequence.

So the Git constraints are solely about preventing Git from fabricating
histories that the FlowShot model cannot represent.

---

## 3. Canonical Branch Rules

### 3.1 Canonical branch must remain linear

Each mesh designates one **canonical branch** (typically `main`). For this branch:

- **Fast-forward only**  
  - No merge commits that join divergent histories.
- **No overlapping-branch merges**  
  - Branches may exist, but if they diverge from canonical and canonical advances,
    reconciliation must use rebase, not merge.
- **No force-push**  
  - Canonical history must not be rewritten.

This preserves a single linear sequence for FlowShot ordinality.

---

### 3.2 Local branches may diverge, but reconciliation is restricted

You can create arbitrary feature/WIP branches.

If canonical has moved ahead while your branch diverged:

- You must rebase onto canonical, then re-weave as needed.
- You must **not** merge back divergent histories into canonical.

If you want to keep a divergent lineage, you treat that branch (or fork) as
a separate mesh lineage, not something that merges back into the original mesh.

Possible use case: an application evolves a mesh on a branch, and the owner has a chance to approve it before merging. 

---

## 4. Weave and Git Interactions

### 4.1 You may commit at any time

All of the following patterns are valid:

- **A. Weave-first**  
  `edit → weave → test → commit`
- **B. Checkpoint-first**  
  `edit → commit WIP → weave → commit weave outputs`
- **C. Heavy local WIP**  
  `edit → weave multiple times → commit occasionally`

Weave always reads the Flow’s `_working/` state in the working tree, regardless of
commit status.

---

### 4.2 Pushing requires linear history

You may push whenever you like, subject to remote branch protection:

- If pushing to canonical fails (non-fast-forward), you must:
  - `git fetch`,
  - `git rebase` (or equivalent) onto canonical,
  - re-weave as needed on top of the updated filesystem state,
  - then push.

No merge commits that join two separate weave timelines.

---

### 4.3 Offline work is supported

You can:

1. clone a mesh,
2. edit, weave, and commit locally,
3. later push when back online.

If canonical advanced while you were offline:

- rebase your local commits onto canonical,
- reconcile filesystem conflicts,
- re-weave as needed,
- then push.

No merges; only rebased linear histories.

---

## 5. Mesh Integrity Expectations

### 5.1 Snapshots are immutable

Once a Snapshot directory (e.g. `2025-11-24_0142_07_v3/`) is created:

- its contents must not be edited by hand,
- any change to the Flow must go through `_working/` and a new weave,
- Git diffs should only ever see new snapshots added, not old ones mutated.

---

### 5.2 `_default/` mirrors the latest committed dataset state

After a successful weave:

- `_default/` must reflect the current authoritative dataset for the Flow:
  - for versioned flows, it matches the latest Snapshot,
  - for unversioned flows, it is *the* dataset state.
- `_working/` is reset from `_default/` to provide a clean starting point.

If Git rewrites `_default/` or `_working/` via rebase, the next weave will
normalize them by recomputing snapshots.

---

### 5.3 No parallel “next snapshots”

Two different weave runs from divergent Git histories cannot both claim to be
the next snapshot with the same sequence number for the same Flow in canonical.

- Rebasing chooses which sequence is "first."
- The other must be re-woven atop the new canonical state.

---

## 6. Explicitly Allowed

- Uncommitted edits during weave.  
- Arbitrary local branches and WIP commits.  
- Editing `_working/` FlowShots directly.  
- Offline edit + weave + later push.  
- Rebasing local history onto canonical, followed by re-weave.

---

## 7. Explicitly Forbidden

- Merge commits that combine diverged histories on canonical.
- Force-push to canonical.
- Editing Snapshot directories in-place.
- Any Git operation that makes Flow `sequenceNumber` or snapshot folder names ambiguous.
- Merging two different weave timelines back into a single canonical line.

---

## 8. Summary

Semantic meshes impose a **small, strict** set of Git rules:

- One linear canonical history (fast-forward only, no force-push).  
- Divergent work is reconciled via rebase + re-weave, not merge.  
- Weave operates on FlowShots in the working tree, independent of commit state.  
- Snapshot ordinality is defined by weave runs along that single timeline.

These constraints keep filesystem-based weave semantics coherent and ensure that
every Flow evolves along a single, interpretable timeline.
