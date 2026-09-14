# EXACT Coding — SOL / Predictive TDD — 2026-09-14

Consumer-ready export of `exact-sol-v1.3-stack-profile-pi`. This is the second EXACT Coding line; it
does not replace the Opus/Hybrid baseline.

| Harness | Directory | Invocation |
|---|---|---|
| Claude Code | `.claude/` | `/exact-coding` or ask for EXACT Coding |
| pi | `.pi/` | `/skill:exact-coding` or ask for EXACT Coding |
| OpenCode | `.opencode/` | `/exact-coding` |
| Cursor | `.cursor/` | `/exact-coding` or ask for EXACT Coding |
| GitHub Copilot | `.github/` | `/exact-coding` or ask for EXACT Coding |

The workflow creates a complete test list, then runs one-test Predictive
Red-Green-Refactor cycles in one shared context. Before every deterministic
check it states a falsifiable prediction and compares it with reality.
Refactoring is inline and follows the Four Rules of Simple Design. There is no
APP mass objective, metric-driven end-refactor, or refactor subagent.

Language and tool details live exclusively in the profiles under
`skills/predictive-tdd/stacks/`; orchestration and method files are stack-neutral.
The export currently includes TypeScript/Vitest and Java/JUnit 5/Maven profiles.
It removes experiment-specific autonomy,
completion, and measurement content, restores configurable human checkpoints, and gates
the workflow behind explicit invocation.

Validated on `gpt-5-6-sol-codex` with pi in
`RQ-stack-profile-extraction-sol` (20/20 fresh runs internally and externally
correct). Other harness directories are semantic distribution ports and have
not yet been validated as independent cross-harness experiment cells.

## Credits

The Guessing Game and Predictive TDD approach used here is inspired by
[Ted M. Young's Predictive TDD and TDD Game](https://tdd.cards/) and
[Jon Jagger's cyber-dojo](https://cyber-dojo.org/).
