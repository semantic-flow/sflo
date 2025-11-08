
# Project Decision Log

This document records important project-level decisions, organized by date.

## YYYY-MM-DD

### Decision: [Brief title of the decision]

**Context:** [Why the decision was necessary.]

**Outcome:** [The chosen path and rationale.]

**Impact:** [How this decision affects the project.]

---

## 2025-11-04

### Decision: Implementation of Agent Memory Bank System

**Context:** To improve AI agent performance and maintain context across tasks, a structured, git-based memory bank system was required.

**Outcome:** The memory bank system was implemented using a set of dedicated Markdown files in the `documentation/` directory, categorized into "Every Task Context" and "Frequently Referenced" files.

**Impact:**
- Agents are now required to read core context files at the start of every task.
- Task-specific context is maintained in dedicated `tasks.YYYY-MM-DD-task-name.md` files.
- Documentation structure is standardized to avoid repetition and improve navigability (e.g., [[guide.project-brief]] acts as a directory, not a content duplicator).

### Decision: RDF Serialization Format

**Context:** Choosing a primary RDF serialization format for instance data and ontologies.

**Outcome:** JSON-LD was chosen over Turtle/TriG due to its native support for slash-terminated CURIEs, which aligns with the project's IRI naming conventions for distinguishing between files and resource names.

**Impact:** All RDF instance data and ontologies should primarily use JSON-LD.
