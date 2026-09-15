# Source and Lab Adaptations

- Parent lab workflow: `exact-tcr-v1.2-domain-responsibility-pi`
- Variant change: adds a mandatory domain-boundary trial to the operational responsibility review; broad responsibility names are challenged with change counterfactuals, a concrete semantic move is tried through TCR commit-or-revert, and a domain-focused before/after record explains the retained or reverted boundary
- Stack boundary: language- and framework-specific guidance remains confined to the existing stack profiles, which are inherited unchanged
- Source: `exact-coding-exercises/.pi`
- Source version: `2026-09-13`
- Imported skills: `exact-coding-tcr`, `tcrdd`, `test-list`
- Imported stack profiles: TypeScript/Vitest and Java/JUnit/Maven

The source files were copied into this workflow. Lab-specific behavior is
isolated as follows:

1. `.pi/AGENTS.md` selects the composed workflow and defines the pi parser
   markers, uninterrupted autonomous execution, repository boundary, and
   `experiment-done.txt` contract.
2. `human-in-the-loop.md` selects the source workflow's existing `autonomous`
   level because lab runs are unattended.

No subagent or external TCR tool is used. RED, GREEN, and REFACTOR are executed
in one shared pi context with native Git.
