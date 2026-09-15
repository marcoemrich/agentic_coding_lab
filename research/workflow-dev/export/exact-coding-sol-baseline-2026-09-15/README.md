# EXACT Coding — SOL / Predictive TDD — 2026-09-15

Consumer-ready export of `exact-sol-v1.5-tcr-parity-domain-trial-pi`. This is the second EXACT Coding line; it
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
Refactoring is inline and follows the Four Rules of Simple Design. It treats domain language as the semantic anchor, tests independently changing policies with a concrete boundary trial, and keeps or narrowly undoes the result based on semantic and behavioral evidence.
There is no APP mass objective, metric-driven end-refactor, or refactor subagent.

Language and tool details live exclusively in the profiles under
`skills/predictive-tdd/stacks/`; orchestration and method files are stack-neutral.
The export currently includes TypeScript/Vitest and Java/JUnit 5/Maven profiles.
It removes experiment-specific autonomy,
completion, and measurement content, restores configurable human checkpoints, and gates
the workflow behind explicit invocation.

Validated on `gpt-5-6-sol-codex` with pi and Claim Office in `RQ-tcr-ptdd-parity-claim-sol` (5/5 parity-port runs internally and externally correct). Other harness directories are semantic distribution ports and
have not yet been validated as independent cross-harness experiment cells.

## Credits

The Guessing Game and Predictive TDD approach used here is inspired by
[Ted M. Young's Predictive TDD and TDD Game](https://tdd.cards/) and
[Jon Jagger's cyber-dojo](https://cyber-dojo.org/).
