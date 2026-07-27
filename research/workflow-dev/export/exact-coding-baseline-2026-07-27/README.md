# Exact Coding TDD Baseline — Version 2026-07-27

A ready-to-copy Test-Driven Development workflow with configurable
human-in-the-loop checkpoints, shipped for **four agent harnesses**. Copy the
one config directory your harness reads into your project root.

| Harness | Copy this | Start with |
|---|---|---|
| Claude Code | `.claude/` | ask for TDD in plain language |
| pi | `.pi/` | `/skill:tdd`, or ask for TDD |
| OpenCode | `.opencode/` | the `tdd` command |
| cursor-agent | `.cursor/` | ask for TDD in plain language |

Only copy the directory you need. The four are independent; nothing breaks if
the others are absent.

## What it is

A four-phase TDD cycle (Test-List → Red → Green → Refactor), plus a final
end-refactor pass on harnesses that support isolated subagents.

| Phase | Mechanism | Why |
|---|---|---|
| Test List | Main context | Needs the full spec in working memory |
| Red | Main context | Predictions ("Guessing Game") share state with the test list |
| Green | Main context | Builds on the failing test and current error from Red |
| Refactor | Isolated subagent¹ | Fresh perspective — sees the code, not the red/green history |

¹ On cursor-agent, refactor runs inline: that harness has no subagent
mechanism. The phase is otherwise identical.

### End-refactor

After the last cycle, a final metric-driven pass runs once over the whole
`src/`: ESLint smells and cognitive complexity, plus APP mass and McCabe,
measured before and after each change, iterating until no metric improves.

All four subtrees have it. The only difference is mechanism:

| | Refactor | End-refactor |
|---|---|---|
| Claude Code | Task subagent | Task subagent |
| pi | `subagent` tool | `subagent` tool |
| OpenCode | `task` tool | `task` tool |
| cursor-agent | inline | inline |

cursor applies both inline because that harness has no subagent mechanism.
The content of the phases is the same everywhere.

## The workflow is opt-in, by design

On every harness the TDD workflow is **explicitly invoked**, not
auto-loaded. Ordinary coding tasks are unaffected by it; you get
Red-Green-Refactor discipline when you ask for it.

What that means per harness:

| Harness | Gate |
|---|---|
| Claude Code | `.claude/skills/tdd/SKILL.md` — a skill, not a rule |
| pi | `.pi/skills/tdd/SKILL.md` — registers as `/skill:tdd` |
| OpenCode | `command.tdd` in `.opencode/opencode.json` |
| cursor-agent | `.cursor/rules/tdd.mdc` with `alwaysApply: false` |

Ambient configuration — HITL settings and TypeScript/Vitest conventions —
*does* load automatically. Those are cheap and useful in any session; the
workflow itself is not.

## Human-in-the-loop

The Autonomy Level in the `human-in-the-loop` file controls every stop.
Default is `full-hitl`: stops after Test-List, Red and Refactor (not Green),
and on any failed prediction.

Levels: `full-hitl`, `refactor-only`, `red-only`, `every-n-tests N`,
`task-end`, `autonomous`. Edit the setting at the top of that one file —
the phase files reference it and embed no stop logic of their own.

Per harness the file lives at `.claude/rules/`, `.pi/rules/`,
`.opencode/rules/`, or `.cursor/rules/human-in-the-loop.mdc`.

## Installation

1. Copy the one config directory for your harness into your project root.
2. Ensure the project has TypeScript, Vitest, and a package manager set up.
3. Optionally change the Autonomy Level (see above).
4. Ask for TDD explicitly — "let's TDD this feature", "do this as a TDD
   kata", or on pi `/skill:tdd`.

### pi only: accept the trust prompt

pi has no native subagent tool. The refactor phase depends on the bundled
extension in `.pi/extensions/subagent/`, and pi gates project-local
extensions behind project trust — so the first run prompts you.

**Accept it.** If you decline, the extension does not load, the `subagent`
tool is unavailable, and refactoring silently collapses into the main
context. Nothing errors; the isolated-context architecture is simply gone.

## Provenance

Derived from the `v6.6-lab-split-*` workflow family in the agentic-coding-lab
research repository, which measures TDD workflow variants against coding
katas. Three transformations separate this baseline from the lab originals:

1. **Lab measurement content removed** — autonomy mandates, done-markers and
   harness-specific stall workarounds that only make sense in an unattended
   batch harness.
2. **Human checkpoints re-enabled** — the lab runs unattended by definition;
   this baseline stops and asks.
3. **Invocation gated** — the lab loads the workflow on every run; here you
   invoke it.

Version is date-based and recorded in `VERSION` at this directory's root.
