# Exact Coding TDD Baseline — Version {{DATE}}

A ready-to-copy Claude Code workflow for Test-Driven Development with
configurable human-in-the-loop checkpoints. This baseline ships the
`.claude/` directory you can drop into your project.

## What it is

A four-phase TDD cycle (Test-List → Red → Green → Refactor) implemented as
Claude Code skills and one Task subagent:

| Phase | Mechanism | Why |
|---|---|---|
| Test List | Skill in main context | Needs the full spec in working memory |
| Red | Skill in main context | Predictions ("Guessing Game") share state with the test list |
| Green | Skill in main context | Builds on the failing test and current error from Red |
| Refactor | Task subagent (isolated) | Fresh perspective — refactor sees the code, not the red/green history |

The Refactor subagent is mandated to attempt at least one improvement per
cycle, evaluates naming first (Beck's Four Rules of Simple Design), and uses
the Absolute Priority Premise (APP) to measure mass before/after.

Between phases, the workflow consults `.claude/rules/human-in-the-loop.md`
to decide whether to pause for human approval. The default Autonomy Level
(`full-hitl`) stops after Test-List, Red, and Refactor — and on prediction
failures — but **not** after Green (Green is the most mechanical phase;
stopping there mostly produces "yes, continue" with no review value).
Switch the level by editing one line in the HITL file.

## Tested parameters

This snapshot derives from `{{SOURCE_WORKFLOW}}`. The recommendation
for that workflow comes from
`research/workflow-dev/workflow-construction.md` in the upstream lab repo
(`agentic_coding_lab_project`). Refer there for the validating
experiments, replicate counts, and outcome metrics.

- **Model:** Claude Opus 4.7 (no-thinking variant) — primary validation target
- **Harness:** Claude Code CLI 2.1.107
- **Language stack:** TypeScript, Vitest, pnpm

Different models or harness versions may produce different results. The
hybrid architecture (skills + isolated refactor subagent) was found to be a
Pareto-optimal point against pure single-context and pure all-subagent
variants on Opus 4.x.

## Original name and lineage

Source workflow: `{{SOURCE_WORKFLOW}}` from
`agentic_coding_lab_project/experiments/workflows/`.

For the full lineage and the empirical findings that promoted this workflow
to "current best for correctness-critical work", see
`research/workflow-dev/workflow-construction.md` in the upstream lab repo.

## HITL adaptation

The source workflow was built for unattended batch experiments — it ran with
no human gates between phases so a measurement pipeline could parse an
uninterrupted sequence of tool calls. For interactive use, that
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
4. Start a TDD task by asking Claude to implement a feature using TDD —
   `.claude/rules/tdd.md` is loaded automatically and instructs Claude to
   invoke the skills.

## File layout

```
.claude/
├── README.md                           This file (travels with the workflow)
├── VERSION                             Date-based version tag
├── settings.json                       Permissions allowlist (Read/Write/Edit/Bash/Skill/Task)
├── agents/
│   └── refactor.md                     Refactor subagent (isolated context)
├── commands/
│   ├── test-list.md                    /test-list skill
│   ├── red.md                          /red skill
│   └── green.md                        /green skill
└── rules/
    ├── tdd.md                          TDD workflow rules (top-level instructions)
    ├── tdd-execution-mode.md           Skill/subagent sequence; optional done marker
    ├── tdd-with-ts-and-vitest.md       Tech-stack conventions
    └── human-in-the-loop.md            ★ Single source of truth for HITL stops
```

README.md and VERSION live **inside** `.claude/` on purpose: when you copy
`.claude/` into a project, the version info and overview travel with it, and
they don't clash with your project's own `README.md`.

## Version and updates

Version: **{{DATE}}** (date-based — also recorded in the `VERSION` file in
this directory).

Future updates ship in their own dated sub-directory next to this one.
Earlier snapshots are kept verbatim — no in-place edits — so books and
articles can refer to a specific version reproducibly.

## License

Same as the surrounding project. If you redistribute this snapshot, please
keep this README intact so readers can trace the version, model, and source.
