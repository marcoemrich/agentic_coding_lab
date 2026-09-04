# TDD Experiment Mode (No HITL) — Pocock TDD Skill, 2026-08 architecture

## Provenance

The skills under `.claude/skills/` are **not authored by this project**. They are
vendored **byte-identical** from [mattpocock/skills](https://github.com/mattpocock/skills),
commit `6654f6b6` (2026-08-24), retrieved 2026-09-04. MIT-licensed; the upstream
license is preserved in `LICENSE.upstream` at the workflow root.

Three skills are vendored: `tdd` (the loop), `code-review` (the review stage the
tdd skill hands off to), and `codebase-design` (the vocabulary `tdd` calls out
to for interface questions). All files are unchanged — verified by checksum.
**This rules file is the only project-authored addition.**

No RED marker block was inserted into any skill. See
`experiments/workflows/MARKERS.md` → "Vendored external workflows: no RED marker
block". Cycle discipline comes from `experiments/measure-tdd-rigour.py`, which
reads the tool sequence only.

## Relation to v9-pocock-tdd

`v9-pocock-tdd` is the 2026-05-26 snapshot of the same author. This is **not an
updated v9** — upstream restructured the workflow in between. The tdd skill now
states, under "Rules of the loop":

> **Refactoring is not part of the loop.** It belongs to the review stage (see
> the `code-review` skill), not the red → green implementation cycle.

So v9 refactors at the tail *inside* the skill; v10 does not refactor in the loop
at all. Treat them as two different workflows, not two versions of one.

## Override for Automated Experiments

There is no human in the loop. For this run:

- Do NOT wait for human approval — not before starting, not between phases.
- Wherever a skill says to ask, confirm with, or tell the user something, decide
  yourself and continue. The specific cases are listed below.
- Complete the whole exercise autonomously.

### Seams are pre-agreed by the prompt

The tdd skill requires: "Before writing any test, write down the seams under test
and confirm them with the user. No test is written at an unconfirmed seam."

Do write the seams down — but derive them from `prompt.md` and treat them as
confirmed. The prompt is the user's agreement. Do not ask
"What's the public interface, and which seams should we test?"; answer it
yourself from the prompt and proceed.

### Planning input: the example mapping is the approved plan

When `prompt.md` is in example-mapping format (rules + examples + questions),
treat it as the agreed plan: **every concrete example is one behaviour to test**,
every rule constrains the implementation. No further questions, no approval
round. When the prompt is prose or user-story format, derive the behaviours
yourself.

## Workflow Entry and Order

Upstream's `implement` skill defines the order (it is not vendored here because
it carries `disable-model-invocation: true` and can only be triggered by a human
typing `/implement`):

> Use /tdd where possible, at pre-agreed seams.
> Run typechecking regularly, single test files regularly, and the full test
> suite once at the end.
> Once done, use /code-review to review the work.

Follow exactly that:

1. Invoke the `tdd` skill via the Skill tool and run the red → green loop until
   every behaviour from the prompt is implemented and the full suite is green.
2. Then invoke the `code-review` skill once, with the adaptations below.

Consult `codebase-design` only if the tdd skill points you there for interface
vocabulary — it is a reference, not a session to run.

## Test Command

The project uses **pnpm**; dependencies are already installed:

```bash
pnpm test
```

## Running `code-review` Without Git

The run directory is **not a git repository** and has no issue tracker. The
skill's git-based setup does not apply; everything else about it does. Substitute:

- **Fixed point** — there is none, and none is needed: the directory started
  empty, so the change set is every file you created. Skip `git rev-parse` and
  `git diff`; read the files you wrote instead. Do not run `git init`, and do not
  abort because the diff command fails.
- **Spec source** — `prompt.md`. Do not look for `docs/agents/issue-tracker.md`,
  do not tell the user to run `/setup-matt-pocock-skills`, do not ask where the
  spec is. Both axes run: Standards against the smell baseline in the skill,
  Spec against `prompt.md`.
- **Standards sources** — the repo documents none, so the Standards axis rests on
  the skill's own Fowler smell baseline alone. That is the skill's documented
  fallback ("applies even when a repo documents nothing"), not an improvisation.
- **Sub-agents** — still two, still in parallel, via the Task tool as the skill
  describes.

### The review reports; it does not change code

Present both reports under `## Standards` and `## Spec` in your reply, as the
skill prescribes. **Do not act on the findings.** Do not refactor, do not rename,
do not restructure after the review.

This is deliberate and is the property under measurement: in this architecture
refactoring is neither in the loop nor in the review — the review hands findings
to a human. An autonomous fix pass would be a step we invented, and it would make
this workflow silently comparable to a tail-refactor workflow it is not. Expect
`refactorings_applied` to be 0 here; that is the workflow, not a failure.

## Done Marker

After the code review report is written, write a file `experiment-done.txt` in
the working directory containing the single word `DONE` on its own line. Do not
write any other summary or report file — the review belongs in your reply, not
on disk.

Without this file the run driver will hit its timeout and the run will be
flagged as incomplete.
