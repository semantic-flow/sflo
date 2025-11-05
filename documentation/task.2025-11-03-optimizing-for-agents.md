---
id: g97elh6q5bszy2c74gsmuqk
title: 2025 11 03 Optimizing for Agents
desc: ''
updated: 1762324788092
created: 1762220840574
---

## Prompt

I want to optimize Roo Code's use in this project by customizing modes and introducing the concept of a task-level memory-bank

Roo Code must use and help maintain both. 

### Project-level files (all in documentation/, and will be part of published site documentation)

#### Add to context for every new task

- [[guide.project-brief]] : Foundation document that points to other files and discusses the memory-bank approach
- [[guide.product-brief]] : Why this project exists, Problems it solves; what components/applications are included; how it should work, User experience goals
- [[dev.general-guidance]] : developer/agent info
- [[dev.memory-bank]] : ground rules for giving agents and humans a git-based shared memory
- [[guide.status]] : where we're at, project wise; what's currently working; summarizes across 

#### Probably helpful on most tasks, need to be rigorously maintained regardless

- [[dev.patterns]] : helpful the Architecture Mode
- [[dev.dependencies]] : Key dependencies
- [[dev.debugging]] : useful for QA
- [[now]] : what's currentlly going on, big-picture
- [[todo]] : general list of things that need doing; can include links to tasks being groomed but not started, but also that haven't been broken into tasks yet
- [[progress]] : completed tasks, summarized
- [[decision-log]] : important project-level decisions

#### Everything else

- all the other files (and there are lots) in documentation/ should get pulled into context as needed, and should periodically be groomed for pithiness, consistency, and currency. Maybe we define a "skill" or a "Documentation Grooming" Roo Mode.

### Task Working Memory

This will be used to externalize Roo's short-term memory. 

For each new task (in Roo Code or Cline or whatever), we'll create a new markdown file "task.YYYY-MM-DD-task-name.md" that will be used to keep track of the active-context, task-specific TODOs, progress, and potential updates to the general project-level memory-bank. If the task file isn't present yet, Orchestrator Roo should suggest creating it, or give the option to proceed without it.

Every task should have these second-level headings:

- Prompt
- TODO
- Decisions

The Agent's TODO list should be mirrored into the "TODO" section and updated as work progresses.


## TODO

- [x] Gather context and understand requirements
- [x] Create guide.project-brief.md - Foundation document explaining memory bank approach and pointing to other files
- [x] Create guide.product-brief.md - Product vision, problems solved, components/applications, user experience goals
- [x] Create guide.status.md - Current project status overview (new "every task context" file)
- [x] Update dev.memory-bank.md - Core rules including "read ALL memory bank files at start of EVERY task"
- [x] Update dev.patterns.md - Document patterns as they emerge (minimal initial content)
- [x] Update dev.dependencies.md - List key dependencies (Fastify, TypeScript, pnpm, Dendron, etc.)
- [x] Verify dev.debugging.md has proper structure (already has good content)
- [x] Update now.md - Current work focus (not dated entries)
- [x] Update todo.md - General task list structure
- [x] Update progress.md - Dated entries for completed work
- [x] Update decision-log.md - Dated entries for important decisions
- [x] Update Roo Mode custom instructions to reference memory bank files
- [x] Review all files for inconsistencies and repetitions 


## Decisions

### Documentation Review Findings (2025-11-05)

A review of all 90 documentation files in `documentation/` revealed several areas for improvement:

1.  **Critical Repetition:** The file [`documentation/product-ideas.hateoas-driven-api-recipes.md`](documentation/product-ideas.hateoas-driven-api-recipes.md) contains its entire content duplicated four times, requiring immediate consolidation.
2.  **Inconsistencies:** Several core concept files, including [`documentation/concept.mesh.md`](documentation/concept.mesh.md) and [`documentation/mesh-resource.node.md`](documentation/mesh-resource.node.md), inconsistently define the full set of node types (omitting "reference nodes"). Provenance documentation also shows conflicting naming conventions for internal identifiers.
3.  **Clarity/Pithiness:** 18 files are empty or contain minimal content (e.g., [`documentation/concept.hosting.md`](documentation/concept.hosting.md), [`documentation/facet.filesystem.md`](documentation/facet.filesystem.md), and six plugin files), suggesting opportunities for consolidation or expansion to improve clarity and reduce unnecessary file clutter.
4.  **Broken Links/Currency:** Multiple files, including [`documentation/concept.summary.md`](documentation/concept.summary.md) and [`documentation/concept.immutability.md`](documentation/concept.immutability.md), contain broken internal links or unaddressed `TODO` items, indicating outdated references or incomplete sections.


