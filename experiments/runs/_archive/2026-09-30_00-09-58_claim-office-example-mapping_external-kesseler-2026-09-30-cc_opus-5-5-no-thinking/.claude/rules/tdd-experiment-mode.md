# TDD Experiment Mode (No HITL) — Kesseler TDD Skill

## Provenance

The skill under `.claude/skills/tdd/` is **not authored by this project**. It is
vendored **byte-identical** from
[lexler/skill-factory](https://github.com/lexler/skill-factory) (Lada Kesseler),
path `output_skills/testing/tdd`, commit `474433af2e` (2026-04-06), retrieved
2026-09-30. Apache-2.0; the upstream license is preserved in `LICENSE.upstream`
at the workflow root.

Two files are vendored: `SKILL.md` (the loop) and `references/zombies.md` (the
ZOMBIES test-discovery heuristic the test-planning step walks through). Both are
unchanged — verified by checksum against the upstream raw blobs.
**This rules file is the only project-authored addition.**

### `evals/` is deliberately not vendored

Upstream ships `output_skills/testing/tdd/evals/evals.json` alongside the skill.
It is left out on purpose. It is eval infrastructure, not part of the runtime
skill — and its `expectations` arrays spell out, in order, the behaviour a
grader looks for ("ZOMBIES checklist is explicitly walked through", "The two-step
red phase is followed", "Production code contains no comments"). A file in the
run directory that enumerates the scored behaviours is a rubric the agent can
read, which would measure compliance-with-a-checklist instead of the skill.
Excluding it does not change the skill: nothing in `SKILL.md` references
`evals/`.

### No marker block was inserted

No RED marker block was added to the skill. See
`experiments/workflows/MARKERS.md` → "Vendored external workflows: no RED marker
block". Consequences to expect, and not to "fix":

- `predictions_correct` / `predictions_total` are **n/a**, not 0. The skill does
  ask the model to predict failures (Core Rule 3, Implementation steps 4/7/10),
  but it emits no `Red Phase Complete` gate and no `(Correct|Incorrect)` lines,
  so the parser cannot see those predictions.
- `refactorings_applied` comes from inline-tool inference and is an **upper
  bound**, not a refactoring count. The skill does refactor inside the loop
  (Implementation step 13) and announces it with `🧹 Starting refactoring stage`,
  but the emoji is not a parsed marker and `## Refactor` is not emitted.
- `cycle_count` falls back to the transcript path. Use `test_blocks`, and measure
  cycle discipline with `experiments/measure-tdd-rigour.py`, which reads the tool
  sequence only.

## Override for Automated Experiments

There is no human in the loop. For this run:

- Do NOT wait for human approval — not before starting, not between phases.
- Wherever the skill says to ask, confirm with, or tell the user something,
  decide yourself and continue. The specific cases are listed below.
- Complete the whole exercise autonomously.

### MODE is `auto`

The skill takes a MODE the user specifies and defaults to `auto`. This run is
`auto`. Announce it as the skill asks — `Using TDD skill in mode: auto` — and
then honour what `auto` means there: *"DO NOT ask for confirmation or approval.
Proceed through all steps without stopping."*

Concretely, the one place the skill branches on MODE is Test Planning step 4,
"If MODE is human, wait for confirmation after test planning". Under `auto` that
step does not apply: finish the test plan and go straight into the
implementation phase.

### Core Rule 10, "Push back", has no addressee

The skill's tenth core rule is to push back when something seems wrong or
unclear. Keep the judgement, drop the handoff: state the concern in your reply,
resolve it yourself from `prompt.md`, and continue. Do not stop and wait for an
answer, and do not treat an ambiguity as a reason to leave the exercise
incomplete.

### Planning input: `prompt.md` is the approved plan

Test Planning step 1 is "Think about what the code you want to write should do".
Derive that from `prompt.md`, not from your own choice of scope.

When `prompt.md` is in example-mapping format (rules + examples + questions),
treat it as the agreed plan: **every concrete example is one behaviour to test**,
every rule constrains the implementation. Answer the open questions yourself and
record the answer; do not ask. When the prompt is prose or user-story format,
derive the behaviours yourself.

The ZOMBIES completeness walk (Test Planning step 3) still runs — it may add
tests the prompt implies but does not spell out. That is the skill working as
designed, not scope creep.

## Test Command

Dependencies are already installed. The full-suite command is the one the run's
stack uses — the skill's Core Rule 7 ("Run all tests every time") means this
command, not a single test file:

| Stack | Full suite |
|---|---|
| `typescript-vitest` | `pnpm test` |
| `java-junit-maven` | `mvn test` |
| `python-pytest` | `pytest` |

Read the project manifest (`package.json`, `pom.xml`, `pyproject.toml`) if you
need the exact script name; do not invent build plugins or change the build to
obtain a check it does not declare.

## Done Marker

When the Final Evaluation section is complete, write a file
`experiment-done.txt` in the working directory containing the single word `DONE`
on its own line. Do not write any other summary or report file — your account of
the work belongs in your reply, not on disk.

Without this file the run driver will hit its timeout and the run will be
flagged as incomplete.
