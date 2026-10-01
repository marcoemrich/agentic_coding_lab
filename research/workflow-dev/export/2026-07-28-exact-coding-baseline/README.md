# Exact Coding TDD Baseline — Version 2026-07-28

A ready-to-copy Test-Driven Development workflow with configurable
human-in-the-loop checkpoints, shipped for **four coding agents**. Copy the one
directory your agent reads; the four subtrees are independent and equivalent.

## Which directory do I copy?

| Harness | Copy | Invoke with |
|---|---|---|
| Claude Code | `.claude/` | Ask for TDD in plain language ("let's TDD this feature") — the `tdd` skill loads on request |
| pi | `.pi/` | `/skill:tdd`, or ask for TDD in plain language |
| OpenCode | `.opencode/` | The `tdd` command |
| cursor-agent | `.cursor/` | Ask for TDD in plain language — the `tdd` rule is description-gated |

**None of them auto-load.** A session that never mentions TDD does not pull
Red-Green-Refactor discipline, prediction blocks, or subagent delegation into
context. That is deliberate: someone fixing a typo should not get the whole
workflow, and should have to *ask* for it.

## The workflow

Five phases. Test-List once, then Red-Green-Refactor per test, then a single
End-Refactor over the whole production tree.

| Phase | Runs in | Why |
|---|---|---|
| Test List | Main context | Needs the full spec in working memory |
| Red | Main context | Predictions ("Guessing Game") share state with the test list |
| Green | Main context | Builds on the failing test and current error from Red |
| Refactor (per cycle) | **Isolated subagent** | Fresh perspective — sees the code, not the red/green history |
| End-Refactor (once) | **Isolated subagent** | Sees the whole `src/` after the design has stabilised |

**All four harnesses delegate both refactor phases to an isolated subagent.**
Only the tool name differs:

| Harness | Refactor delegation |
|---|---|
| Claude Code | `Task({subagent_type: "refactor"})`, agents in `.claude/agents/` |
| pi | `subagent` tool with `agentScope: "both"`, agents in `.pi/agents/` |
| OpenCode | `task` tool, agents in `.opencode/agents/` with `mode: subagent` |
| cursor-agent | native Task tool, agents in `.cursor/agents/` |

The per-cycle Refactor agent must attempt at least one improvement, evaluates
naming first (Beck's Four Rules of Simple Design), and measures Absolute
Priority Premise (APP) mass before and after. The End-Refactor agent runs once
after the last green cycle and iterates one change at a time, measuring ESLint
smells, SonarJS cognitive complexity, APP mass and McCabe cyclomatic complexity
around each change, until no metric improves further.

## Human-in-the-loop

The default Autonomy Level is **`full-hitl`**: the workflow stops after
Test-List, Red, and Refactor, and on any failed prediction. It does **not** stop
after Green — Green is the most mechanical phase, and a stop there mostly
produces "yes, continue" with no review value.

Other levels: `refactor-only`, `red-only`, `every-n-tests N`, `task-end`,
`autonomous`. Switch by editing one line at the top of the HITL file:

| Harness | HITL file |
|---|---|
| Claude Code | `.claude/rules/human-in-the-loop.md` |
| pi | `.pi/rules/human-in-the-loop.md` |
| OpenCode | `.opencode/rules/human-in-the-loop.md` |
| cursor-agent | `.cursor/rules/human-in-the-loop.mdc` |

The stop logic lives **only** in that file. Phase files reference it but embed
no stop logic of their own, so you can swap the file out without touching the
workflow.

## Installation

1. Copy the subtree for your harness into your project root.
2. Ensure the project has TypeScript, Vitest, and a package manager set up. The
   phase files run tests with `pnpm test` — adjust if you use a different one.
3. To change checkpoint behavior, edit the Autonomy Level in the HITL file above.
4. Start a TDD task by explicitly asking for TDD.

### pi: two extra steps

pi has **no native subagent tool**. The `subagent` tool the refactor phases
depend on comes entirely from the bundled project-local extension at
`.pi/extensions/subagent/` — ship all three files (`index.ts`, `agents.ts`,
`README.md`).

pi loads project-local extensions only after the project is trusted, so **on
first use you get a trust prompt. Accept it.** Declining leaves you with a
workflow that has no refactor step: the model simply has no way to delegate,
and refactoring silently collapses into the main context.

This is the only genuinely harness-forced difference in the snapshot. Claude
Code, OpenCode and cursor-agent all have a subagent mechanism natively.

## Tested parameters

This snapshot derives from `v6.6-lab-split-{cc,pi,oc,cursor}` in the upstream
lab repo (`agentic_coding_lab_project`). See
`research/workflow-dev/workflow-construction.md` there for the validating
experiments, replicate counts, and outcome metrics.

- **Model:** Claude Opus 4.8 (no-thinking variant) — primary validation target
- **Harnesses:** Claude Code CLI 2.1.170, `opencode-ai@1.15.10`,
  `@earendil-works/pi-coding-agent@0.81.1`, `cursor-agent`
- **Language stack:** TypeScript, Vitest, pnpm

Different models or harness versions may produce different results. The hybrid
architecture (phase skills in shared context + isolated refactor subagents) was
found to be a Pareto-optimal point against pure single-context and pure
all-subagent variants on Opus 4.x.

## What changed from the lab workflow

The source workflows run unattended inside a research harness. Three
transformations turn them into consumer workflows:

1. **Lab content removed** — the autonomous-execution mandate, the completion
   marker, and the phase-continuation fix. Nothing in this snapshot refers to
   research tooling, internal metric names, or unattended batch runs.
2. **Human checkpoints re-enabled** — HITL on by default, at `full-hitl`.
3. **Invocation gated** — the workflow is requested, not auto-loaded.

## Version and updates

Version: **2026-07-28** (date-based — also recorded in `VERSION`).

Future updates ship in their own dated sibling directory. Earlier snapshots are
kept verbatim, so books and articles can cite a specific version reproducibly.

## License

Same as the surrounding project. If you redistribute this snapshot, please keep
this README intact so readers can trace the version, model, and source.
