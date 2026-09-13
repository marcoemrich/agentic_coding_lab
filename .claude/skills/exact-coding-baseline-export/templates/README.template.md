# Exact Coding TDD Baseline — Version {{DATE}}

A ready-to-copy Claude Code workflow for Test-Driven Development with
configurable human-in-the-loop checkpoints. This baseline ships the
`.claude/` directory you can drop into your project.

{{MULTI_HARNESS_NOTE}}

## What it is

Test-List once, then Red → Green → Refactor for every test, until the list is
done. Implemented as Claude Code skills and one Task subagent:

| Phase | Mechanism | Why |
|---|---|---|
| Test List | Skill in main context | Needs the full spec in working memory |
| Red | Skill in main context | Predictions ("Guessing Game") share state with the test list |
| Green | Skill in main context | Builds on the failing test and current error from Red |
| Refactor (every cycle) | Task subagent (isolated) | Fresh perspective — refactor sees the code, not the red/green history |

The Refactor subagent is mandated to attempt at least one improvement per
cycle, evaluates naming first (Beck's Four Rules of Simple Design), and uses
the Absolute Priority Premise (APP) to measure mass before/after.

Between phases, the workflow consults `.claude/skills/tdd/human-in-the-loop.md`
to decide whether to pause for human approval. The default Autonomy Level
(`full-hitl`) stops after Test-List, Red, and Refactor — and on prediction
failures — but **not** after Green (Green is the most mechanical phase;
stopping there mostly produces "yes, continue" with no review value).
Switch the level by editing one line in the HITL file.

### Manual extra: `end-refactor` (not part of the workflow)

> **You have to start this yourself. The workflow never runs it.**

When a piece of work is finished and you want an extra cleanup across the
whole `src/`, invoke it explicitly:

```
Skill({ skill: "end-refactor" })
```

It measures ESLint smells, cognitive complexity, McCabe and APP mass across
`src/`, changes one thing at a time and re-measures after each change. It is
not in the loop for a reason: it takes noticeably more time and tokens, and
in the lab, running it automatically at the end of every task did not make the
average function any smaller. Use it on multi-file code where duplication
across files has had room to build up.

### Optional: Example Mapping before the loop

When a feature is not yet well understood, run Example Mapping before writing
any test:

```
Skill({ skill: "example-mapping" })
```

It is a conversation, not a generator: it discovers business rules, collects
concrete examples for each, and parks genuine unknowns as open questions. The
examples it produces are what the Test List turns into `it.todo()` cases.
Skip it when the spec is already unambiguous — but see below for why concrete
examples matter so much.

## Why this workflow: what was measured

{{MEASUREMENTS}}

## Tested parameters

This snapshot derives from `{{SOURCE_WORKFLOW}}`. The recommendation
for that workflow comes from
`research/workflow-dev/workflow-construction.md` in the upstream lab repo
(`agentic_coding_lab_project`). Refer there for the validating
experiments, replicate counts, and outcome metrics.

- **Model:** {{MODEL}} — primary validation target
- **Harness:** Claude Code CLI {{CC_VERSION}}
- **Language stack:** TypeScript, Vitest, pnpm

Different models or harness versions may produce different results.

## Original name and lineage

Source workflow: `{{SOURCE_WORKFLOW}}` from
`agentic_coding_lab_project/experiments/workflows/`.

For the full lineage and the empirical findings that promoted this workflow
to "current best for correctness-critical work", see
`research/workflow-dev/workflow-construction.md` and
`research/workflow-dev/model-recommendation-matrix.md` in the upstream lab repo.

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
  `.claude/skills/tdd/human-in-the-loop.md` controls the whole workflow.
  Choices include `full-hitl`, `refactor-only`, `red-only`, `every-n-tests N`,
  `task-end`, and `autonomous`.

The HITL logic lives **only** in `.claude/skills/tdd/human-in-the-loop.md`.
Phase files reference it but do not embed stop logic, so you can swap the HITL
file out without touching the workflow files.

## Installation

1. Copy the `.claude/` directory into your project root.
2. Ensure the project has TypeScript, Vitest, and pnpm set up (see
   `.claude/rules/tdd-with-ts-and-vitest.md`).
3. To use a different Autonomy Level, edit the first non-comment line of
   `.claude/skills/tdd/human-in-the-loop.md` under "Autonomy Level".
4. Start a TDD task by asking Claude to implement a feature **using TDD**. The
   workflow lives in `.claude/skills/tdd/SKILL.md` and is **not** auto-loaded:
   Claude pulls it in when you ask for TDD, and leaves it out of context for
   ordinary coding work.

## File layout

```
.claude/
├── README.md                           This file (travels with the workflow)
├── VERSION                             Date-based version tag
├── skills/
│   ├── tdd/
│   │   ├── SKILL.md                    ★ The workflow — gated, loads only when you ask for TDD
│   │   ├── human-in-the-loop.md        ★ Single source of truth for HITL stops
│   │   └── tdd-execution-mode.md       Phase sequence and subagent prompt contract
│   ├── example-mapping/SKILL.md        Optional requirements session — run it before the loop
│   └── end-refactor/SKILL.md           Manual extra — you invoke it, the workflow never does
├── agents/
│   └── refactor.md                     Per-cycle refactor subagent (isolated context)
├── commands/
│   ├── test-list.md                    /test-list skill
│   ├── red.md                          /red skill
│   └── green.md                        /green skill
└── rules/
    └── tdd-with-ts-and-vitest.md       Tech-stack conventions (ambient, not gated)
```

The workflow's own files live **inside** `skills/tdd/`, not under `rules/`.
Claude Code auto-loads everything in `rules/`, so a file left there would be in
context on every session. `tdd-with-ts-and-vitest.md` is the deliberate
exception: TS and Vitest conventions should apply whenever you touch a
`*.spec.ts`, whether or not you asked for a TDD session.

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
