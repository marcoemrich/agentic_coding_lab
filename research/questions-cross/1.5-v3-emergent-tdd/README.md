---
id: RQ-v3-emergent-tdd
question: "Under a bare 'use TDD' instruction that prescribes no phase markers (v3), do models actually work test-first and refactor — and how far apart do the models sit once the evidence is hand-validated?"
factors:
  # model + harness as coupled bundles. The harness is encoded in the workflow
  # name (v3-basic-tdd = CC, v3-basic-tdd-pi = pi), so model and workflow must
  # stay paired — a plain controls.workflow {any:[...]} would collapse CC and pi
  # into one cell and hide the harness entirely.
  model_x_workflow:
    # core: the two models the observation started from
    - model: opus-5-no-thinking
      workflow: v3-basic-tdd            # Claude Code
    - model: gpt-5-6-sol
      workflow: v3-basic-tdd-pi         # pi
    # contrast: is the behaviour special, or does every model do it?
    - model: opus-4-7-no-thinking
      workflow: v3-basic-tdd
    - model: sonnet-4-6-no-thinking
      workflow: v3-basic-tdd
    - model: haiku-4-5-no-thinking
      workflow: v3-basic-tdd
  kata_base: [game-of-life, claim-office]
controls:
  prompt: example-mapping
outcomes:
  # TDD discipline — inferred from the tool sequence, not from markers.
  # Read together with the caveats below; cycle_count is not comparable to
  # marker-based counts, refactorings_applied is an upper bound.
  - cycle_count
  - refactorings_applied
  # correctness / completion — measured from the source tree, unaffected
  - tests_passing
  - verification_pct
  - completed_within_budget
  # cost of the bare instruction, for reference against instrumented workflows
  - duration_seconds
  - total_tokens
min_replicates: 3
status: open
---

# RQ-v3-emergent-tdd: Does "use TDD" alone produce test-first and refactoring?

## Motivation

`v3-basic-tdd` says *"Complete the TDD exercise autonomously using Test-Driven
Development"* and nothing else. No phase skills, no `## Red` heading, no
prediction block. It was built as the floor of the architecture axis: the
condition where a model is told to do TDD but given no scaffolding to do it in.

The lab has been reading that floor as **unmeasurable**. `MARKERS.md` recorded
`cycle_count 1, refactorings_applied 0, predictions_total 0` for v3 "without
exception", and two RQs (`RQ-architecture-axis-opus5`,
`RQ-architecture-axis-sol-pi`) instruct readers to treat those rows as n/a.

But the runs are full of TDD. Reading a v3 transcript directly shows
`write premium.spec.ts` → `pnpm test` → *then* `write premium.ts`, cycle after
cycle. The behaviour was there all along; the measurement was not.

Two things were missing, and neither required a new run:

1. **cc could already see it.** `analyze_transcript.py` infers phases from the
   tool sequence when no marker fires. That inference has been running on every
   v3 run — it just never made it into `MARKERS.md`, so the results were read as
   zeros.
2. **pi could not.** `parse_pi_transcript.py` had no equivalent, so every
   `v3-basic-tdd-pi` run reported 0 across the board — indistinguishable from
   "this model never did TDD". Fixed in 2026-08 by importing the same heuristic.

This RQ asks what the floor actually looks like once both harnesses can see it.

## Method

**Phase detection.** Marker-free runs are scored from the write/edit/bash
sequence: test-edit → `pnpm test` = red, impl-edit → `pnpm test` = green,
impl-edit with no fresh test before it = refactor. Same function on both
harnesses (`infer_phases_from_tool_sequence`), applied per run and only when the
transcript carries no marker of any kind. `phase_source: "inline-tool"` marks
the runs scored this way.

**Test-first rate** is measured independently of that heuristic: the first
write/edit to a source file in the run, ignoring config and the done-marker. If
it is a `.spec.ts` / `.test.ts`, the run opened test-first.

**TDD rigour** is measured separately, because ordering alone says nothing about
step size or feedback. Two properties of the **first cycle**:

- *first-cycle cases* — how many `it(` / `test(` cases were written before the
  first line of implementation. TDD means one or two; a dozen means a test suite
  was authored up front.
- *red verified* — whether a test run happened between writing that test and
  writing the implementation. Without it the model never saw the test fail.

The first cycle is the right place to measure: later small edits are typically
fixes to an already-written suite, and a median over all blocks lets them mask a
big-bang opening.

**Refactoring is hand-validated.** The inferred refactor count is a weak proxy —
"impl-edit with no fresh test before it" also matches bugfixes, lint fixes and
brand-new files. Every candidate was read in its transcript together with the
assistant text that introduced it and classified as *refactoring* (structural
change, no behaviour change), *bugfix*, *toolchain fix* (tsc/ESLint), or *new
untested file*. Both numbers are reported: the raw candidate count and the
validated one.

Borderline rule: lint-triggered edits count as refactoring only when the model
argues the change on its own merits ("naming them makes the rules read better
anyway"); silent lint compliance counts as a toolchain fix.

## Caveats

- **Model and harness are confounded in the core comparison.** opus-5 runs on
  Claude Code, gpt-5-6-sol on pi. A difference between them cannot be attributed
  to either factor. The claim is per model — "this model does X under v3" — and
  no ranking between the two is implied. The three contrast cells are all cc, so
  model comparisons *within* cc are clean.
- **`cycle_count` is not comparable to instrumented workflows.** On opus-5, v3
  yields 1–8 and v6.6 yields 7–57. Inferred tool sequence and marker emission
  are different constructs; the numbers must not share a column.
- **`refactorings_applied` (raw) is an upper bound**, with model-dependent
  precision. Use the validated count for any claim about refactoring.
- **`predictions_*` remain genuinely unmeasurable** and are not in `outcomes:` —
  no inference reconstructs a prediction the model was never asked to state.
- `sphinx-score` v3 runs exist for opus-5 only and are therefore outside the
  factor grid; they are cited in findings where the extra evidence matters.

## Open hypotheses

- **H1** — Test-first survives without scaffolding: models open with a test even
  when nothing asks them to.
- **H1b** — Ordering is not rigour: a model can open with a test and still author
  the whole suite up front, never observing a red state. Whether the bare
  instruction produces *small verified steps* is a separate question from
  whether it produces test-first ordering.
- **H2** — Refactoring does not: without a refactor phase, models stop at green.
  If any model refactors unprompted, that is a model property, not a workflow
  property.
- **H3** — Test-first discipline is not uniform across the run. The core
  algorithm is driven by tests; peripheral code (CLI, scaffolding) is written
  without them.
