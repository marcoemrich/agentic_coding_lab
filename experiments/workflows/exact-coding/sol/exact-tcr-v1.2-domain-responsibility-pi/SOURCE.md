# Source and Lab Adaptations

- Parent lab workflow: `exact-tcr-v1.1-srp-pi`
- Variant change: the qualitative SRP sentence is operationalized as a mandatory domain-responsibility review; DDD ubiquitous language anchors responsibility names, independently changing policy decisions are made explicit, and intent-revealing domain boundaries explicitly outrank Fewest Elements
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
