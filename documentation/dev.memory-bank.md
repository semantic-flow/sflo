---
id: f0g7d31ivgn6rgllncdwep8
title: Memory Bank
desc: ''
updated: 1762552863614
created: 1762222195753
---

# Dev Memory Bank

The memory bank is a git-based shared memory system that enables both humans and AI agents to maintain context across sessions and tasks. It consists of:

- project-level documentation files that capture essential knowledge, decisions, and current state
- task-based documentation that should reflect the agent's short-term "working" memory.

## Core Rules

- **CRITICAL: Agents MUST read ALL "Every Task" memory bank files at the start of EVERY task.**
- Agents should use a "Task" memory bank file for every task
- Agents, in every mode, must try to keep the task file's TODO section synced with their own internal Todo List.
  - Use of the "Todo List Updated" (update_todo_list) tool should always trigger a resync of the task's TODO section
- All memory bank files should avoid repeating information, and should be continually checked for internal consistency

## Memory Bank Structure

### Project Memory Bank Files

#### "Every Task" Context Files

These files MUST be read at the start of every new task:

- [[guide.project-brief]] - Foundation document explaining the memory bank approach and pointing to other files
- [[guide.product-brief]] - Project vision, problems solved, components/applications, user experience goals
- [[guide.status]] - Current project status, what's working, high-level summary
- [[dev.memory-bank]] - This file; ground rules for the memory bank system

#### Frequently Referenced Memory Bank Files

These should be consulted as appropriate to the task:

- [[dev.general-guidance]] - for any development-related tasks
- [[dev.dependencies]] - for technical architecture questions or any development-related tasks
- [[guide.ontologies]] - for any RDF-related tasks
- [[dev.debugging]] - Debugging workflows and tips


#### Big Picture Memory Bank Files

- [[now]] - Current work focus (big-picture)
- [[todo]] - General task list; items not yet broken into formal tasks
- [[progress]] - Completed tasks with dated summaries
- [[decision-log]] - Important project-level decisions with dates

### Task Memory Bank Files

For each task, use a task file in documentation/: `tasks.YYYY-MM-DD-task-name.md`

Required sections:
- **Prompt** - Original task request
- **TODO** - Agent's todo list (mirrored from Roo's internal list); must be updated after every update_todo_list tool invocation
  - TODO items should have the "- [ ] " form, so we can x them off as we go.
- **Decisions** - Task-specific decisions made during execution

## Maintenance Guidelines

1. **Keep it current** - Update files as work progresses
2. **Keep it concise** - Less is more; avoid repetition
3. **Use wikilinks** - Link between documentation files using `[[filename]]` syntax
4. **Date entries** - Use `## YYYY-MM-DD` format for dated logs
5. **Ask questions** - If documentation is confusing or outdated, ask for clarification

## Agent Responsibilities

- Read all "Every Task Context" files before starting work
- Update the task file's TODO section to mirror your internal todo list
- Document decisions in the task file's Decisions section
- Suggest updates to project-level memory bank files when appropriate
- Keep documentation pithy, consistent, and current
