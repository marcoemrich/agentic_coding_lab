# Exact Coding TDD Baseline — Version 2026-07-28

A ready-to-copy Claude Code workflow for Test-Driven Development with
configurable human-in-the-loop checkpoints. This baseline ships the
`.claude/` directory you can drop into your project.

> **This is the Claude Code subtree.** The same workflow ships for pi
> (`.pi/`), OpenCode (`.opencode/`), and cursor-agent (`.cursor/`) in the
> snapshot this directory came from — see the snapshot-level `README.md`
> there for the harness comparison. The four are independent; you only need
> the one your harness reads. If you received `.claude/` on its own, nothing
> is missing — it is self-contained.

## What it is

A five-phase TDD cycle (Test-List → Red → Green → Refactor, then one final
End-Refactor) implemented as Claude Code skills and two Task subagents:

| Phase | Mechanism | Why |
|---|---|---|
| Test List | Skill in main context | Needs the full spec in working memory |
| Red | Skill in main context | Predictions ("Guessing Game") share state with the test list |
| Green | Skill in main context | Builds on the failing test and current error from Red |
| Refactor (per cycle) | Task subagent (isolated) | Fresh perspective — refactor sees the code, not the red/green history |
| End-Refactor (once) | Task subagent (isolated) | Sees the whole `src/` after the design has stabilised — catches cross-file duplication and complexity hot spots a per-cycle pass cannot |

The Refactor subagent is mandated to attempt at least one improvement per
cycle, evaluates naming first (Beck's Four Rules of Simple Design), and uses
the Absolute Priority Premise (APP) to measure mass before/after. The
End-Refactor subagent runs once after the last green cycle and iterates one
change at a time, measuring ESLint smells, SonarJS cognitive complexity, APP
mass and McCabe cyclomatic complexity before and after each change.

Between phases, the workflow consults `.claude/rules/human-in-the-loop.md`
to decide whether to pause for human approval. The default Autonomy Level
(`full-hitl`) stops after Test-List, Red, and Refactor — and on prediction
failures — but **not** after Green (Green is the most mechanical phase;
stopping there mostly produces "yes, continue" with no review value).
Switch the level by editing one line in the HITL file.

## Tested parameters

This snapshot derives from `v6.6-lab-split-cc`. The recommendation
for that workflow comes from
`research/workflow-dev/workflow-construction.md` in the upstream lab repo
(`agentic_coding_lab_project`). Refer there for the validating
experiments, replicate counts, and outcome metrics.

- **Model:** Claude Opus 4.8 (no-thinking variant) — primary validation target
- **Harness:** Claude Code CLI 2.1.170
- **Language stack:** TypeScript, Vitest, pnpm

Different models or harness versions may produce different results. The
hybrid architecture (skills + isolated refactor subagents) was found to be a
Pareto-optimal point against pure single-context and pure all-subagent
variants on Opus 4.x.

## Original name and lineage

Source workflow: `v6.6-lab-split-cc` from
`agentic_coding_lab_project/experiments/workflows/`.

For the full lineage and the empirical findings that promoted this workflow
to "current best for correctness-critical work", see
`research/workflow-dev/workflow-construction.md` in the upstream lab repo.

## HITL adaptation

The source workflow was built for unattended batch runs — it ran with no human
gates between phases, start to finish. For interactive use, that
autonomous-by-default behavior is wrong.

This export changes it to:

- **HITL on by default** (`full-hitl`): stops after Test-List, Red, Refactor,
  and on prediction failures.
- **Green skipped by default**: keeps cycles tight; can be re-enabled by
  switching to a custom level.
- **Autonomy Level as a single setting**: one line at the top of
  `.claude/rules/human-in-the-loop.md` controls the whole workflow. Choices
  include `full-hitl`, `refactor-only`, `red-only`, `every-n-tests N`,
  `task-end`, and `autonomous`.

The HITL logic lives **only** in `.claude/rules/human-in-the-loop.md`. Phase
files reference it but do not embed stop logic, so you can swap the HITL
file out without touching the workflow files.

## Installation

1. Copy the `.claude/` directory into your project root.
2. Ensure the project has TypeScript, Vitest, and pnpm set up (see
   `.claude/rules/tdd-with-ts-and-vitest.md`).
3. To use a different Autonomy Level, edit the first non-comment line of
   `.claude/rules/human-in-the-loop.md` under "Autonomy Level".
4. Start a TDD task by asking Claude to implement a feature **using TDD**. The
   workflow lives in `.claude/skills/tdd/SKILL.md` and is **not** auto-loaded:
   Claude pulls it in when you ask for TDD, and leaves it out of context for
   ordinary coding work.

## File layout

```
.claude/
├── README.md                           This file (travels with the workflow)
├── VERSION                             Date-based version tag
├── settings.json                       Permissions allowlist (Read/Write/Edit/Bash/Skill/Task)
├── skills/
│   └── tdd/SKILL.md                    ★ The workflow — gated, loads only when you ask for TDD
├── agents/
│   ├── refactor.md                     Per-cycle refactor subagent (isolated context)
│   └── end-refactor.md                 Final whole-src metric-driven pass (isolated context)
├── commands/
│   ├── test-list.md                    /test-list skill
│   ├── red.md                          /red skill
│   └── green.md                        /green skill
└── rules/
    ├── human-in-the-loop.md            ★ Single source of truth for HITL stops
    ├── tdd-execution-mode.md           Phase sequence; interactive-by-default execution
    ├── subagent-prompts.md             What to pass the isolated refactor subagents
    └── tdd-with-ts-and-vitest.md       Tech-stack conventions
```

Only `skills/tdd/SKILL.md` is gated. The files under `rules/` are ambient: the
tech-stack conventions apply whenever you touch a `*.spec.ts`, and the HITL and
execution-mode files are read by the workflow itself.

README.md and VERSION live **inside** `.claude/` on purpose: when you copy
`.claude/` into a project, the version info and overview travel with it, and
they don't clash with your project's own `README.md`.

## Version and updates

Version: **2026-07-28** (date-based — also recorded in the `VERSION` file in
this directory).

Future updates ship in their own dated sub-directory next to this one.
Earlier snapshots are kept verbatim — no in-place edits — so books and
articles can refer to a specific version reproducibly.

## License

Same as the surrounding project. If you redistribute this snapshot, please
keep this README intact so readers can trace the version, model, and source.
