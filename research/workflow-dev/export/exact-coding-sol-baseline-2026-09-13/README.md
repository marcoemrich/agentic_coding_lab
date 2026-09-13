# EXACT Coding — SOL / Predictive TDD — 2026-09-13

Consumer-ready export of `exact-sol-v1.3-stack-profile-pi`. This is the second EXACT Coding line; it
does not replace the Opus/Hybrid baseline.

| Harness | Directory | Invocation |
|---|---|---|
| Claude Code | `.claude/` | Ask to use TDD or Predictive TDD |
| pi | `.pi/` | `/skill:tdd` or ask for Predictive TDD |
| OpenCode | `.opencode/` | `/tdd` |
| Cursor | `.cursor/` | Ask for Predictive TDD |
| GitHub Copilot | `.github/` | `/tdd` or ask for Predictive TDD |

The workflow creates a complete test list, then runs one-test Predictive
Red-Green-Refactor cycles in one shared context. Before every deterministic
check it states a falsifiable prediction and compares it with reality.
Refactoring is inline and follows the Four Rules of Simple Design. There is no
APP mass objective, metric-driven end-refactor, or refactor subagent.

TypeScript and Vitest details live exclusively in
`skills/predictive-tdd/stacks/typescript-vitest.md`; orchestration and method
files are stack-neutral. The export removes experiment-specific autonomy,
completion, and measurement content, restores configurable human checkpoints, and gates
the workflow behind explicit invocation.

Validated on `gpt-5-6-sol-codex` with pi in
`RQ-stack-profile-extraction-sol` (20/20 fresh runs internally and externally
correct). Other harness directories are semantic distribution ports and have
not yet been validated as independent cross-harness experiment cells.
