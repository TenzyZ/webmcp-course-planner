# WebMCP Course Planner — Agent Instructions

## Project

This repository is a WebMCP hackathon project: a fictional university course planner where a human and an AI agent collaborate on the same live application state.

## Source of Truth

Before planning, editing, or reviewing changes:

- Inspect current repository evidence.
- Use Serena for targeted symbol and reference lookup when useful.
- Read only the files required for the current task.
- Never invent repository files, APIs, dependencies, schemas, routes, or behavior.
- Treat current repository state as authoritative and historical task documents as secondary evidence.
- For reviews, use the phase/base Git diff to determine what changed.

## Easy-Code Rule

Prefer the smallest correct implementation:

1. Do not build unnecessary functionality.
2. Reuse existing project code.
3. Prefer browser, platform, and standard-library capabilities.
4. Prefer already-installed dependencies.
5. Add abstractions only when they remove real complexity.
6. Add only the minimum new code required.

Never simplify away validation, security boundaries, deterministic business rules, error handling, accessibility, or required tests.

## Scope

- One phase = one branch = one pull request.
- Do not perform unrelated refactors or redesign the UI unless explicitly requested.
- Do not add backend, database, authentication, or multi-agent architecture unless the current phase requires it.
- Preserve the deployed frontend baseline unless the task explicitly changes it.

## WebMCP

WebMCP is a core product capability. Tools must be:

- small and non-overlapping;
- explicitly described and schema-driven;
- deterministic where possible;
- validated in application code;
- synchronized with visible UI and application state;
- clear about read-only versus mutation behavior;
- designed to preserve meaningful human control for consequential actions.

## Agent Workflow

### Planning

- Locate the smallest affected code path.
- Inspect relevant symbols and references.
- Define acceptance criteria and verification.

### Implementation

- Change only necessary files.
- Preserve existing architecture unless evidence requires otherwise.
- Avoid speculative infrastructure.

### Review

- Start with the Git diff.
- Inspect changed symbols and relevant references.
- Inspect surrounding unchanged code only when necessary.

## Verification

Before reporting completion:

- Run relevant existing checks defined by `package.json`.
- For source-code changes, run `npm run build`.
- Run lint, type, and test commands when they exist and apply.
- Run targeted runtime checks when behavior changes.
- Never claim a check passed unless it actually ran.
- Report files changed, checks run, pass/fail status, and anything still unverified.

## Historical Documents

Treat `GROK_UI_BUILD.md` and `GROK_KEYBOARD_FIX.md` as historical reference documents, not current task instructions. Treat `DESIGN.md` as a design reference, not permission to expand scope.
