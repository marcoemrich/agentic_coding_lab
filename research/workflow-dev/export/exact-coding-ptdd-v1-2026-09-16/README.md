# EXACT Coding — Predictive TDD v1 — 2026-09-16

Consumer-ready export of `exact-ptdd-v1-pi`, the universal maintained EXACT Coding
Predictive-TDD line.

| Harness | Directory | Invocation |
|---|---|---|
| Claude Code | `.claude/` | `/exact-coding` or ask for EXACT Coding |
| pi | `.pi/` | `/skill:exact-coding` or ask for EXACT Coding |
| OpenCode | `.opencode/` | `/exact-coding` |
| Cursor | `.cursor/` | `/exact-coding` or ask for EXACT Coding |
| GitHub Copilot | `.github/` | `/exact-coding` or ask for EXACT Coding |

The workflow creates a complete test list, then runs one-test Predictive
Red-Green-Refactor cycles. Before every deterministic check it states a
falsifiable prediction and compares it with reality. Two explicit entry points
are installed side by side: `exact-coding` refactors inline, while
`exact-coding-isolated-refactor` delegates the Four Rules review after every
Green. Both use the same Predictive-TDD core, stack profiles, test-list method,
and human-checkpoint policy. It treats domain language as the semantic anchor, tests independently changing policies with a concrete boundary trial, and keeps or narrowly undoes the result based on semantic and behavioral evidence. There is no APP mass objective or
metric-driven end-refactor.

Language and tool details live exclusively in the profiles under
`skills/predictive-tdd/stacks/`; orchestration and method files are stack-neutral.
The export currently includes TypeScript/Vitest and Java/JUnit 5/Maven profiles.
It removes experiment-specific autonomy,
completion, and measurement content, restores configurable human checkpoints, and gates
the workflow behind explicit invocation.

Validated on `gpt-5-6-sol-codex` with pi and native Opus 5 with Claude Code in `RQ-test-list-dimensions-replication` (n=10 per workflow and platform cell on Claim Office). Other harness directories are semantic distribution ports and
have not yet been validated as independent cross-harness experiment cells.

## Credits

The Guessing Game and Predictive TDD approach used here is inspired by
[Ted M. Young's Predictive TDD and TDD Game](https://tdd.cards/) and
[Jon Jagger's cyber-dojo](https://cyber-dojo.org/).
