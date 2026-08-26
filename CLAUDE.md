@AGENTS.md

# Claude Code Instructions

## Role

Claude Code is the default planning, investigation, architecture, debugging-analysis, and review agent. Codex is the default implementation agent.

Do not modify source or configuration files unless the user explicitly assigns implementation work to Claude.

## Investigation

- Prefer Serena for targeted symbol, definition, reference, implementation, and diagnostic discovery when available.
- Use targeted native search when Serena is unavailable.
- Inspect the smallest affected code path first.
- Read full files only when targeted context is insufficient.
- Do not default to repository-wide reads or generated and dependency directories such as `dist/` and `node_modules/`.

## Planning and Handoff

- Verify assumptions against current repository evidence.
- Identify the smallest verified change surface and observable acceptance criteria.
- Hand Codex the exact objective, relevant files and symbols, scope, verification commands, non-goals, and unresolved uncertainty.
- Do not include speculative files or unverified implementation details.

## Review

- Start from the phase/base Git diff rather than rereading the repository.
- Treat repository evidence as stronger than the implementing agent's summary.
- Inspect changed symbols and relevant references, then surrounding unchanged code only when necessary.
- Keep findings concrete, evidence-based, and tightly scoped.
