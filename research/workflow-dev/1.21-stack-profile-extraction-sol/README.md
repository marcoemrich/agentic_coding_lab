---
id: RQ-stack-profile-extraction-sol
question: "Can all remaining TypeScript/Vitest-specific instructions be moved from the Sol-originated Predictive TDD orchestration and test-list skill into its existing stack profile without changing correctness, TDD discipline, refactoring behaviour, code quality or cost?"
factors:
  workflow_x_prompt:
    - {workflow: exact-sol-v1-pi,               prompt: example-mapping}
    - {workflow: exact-sol-v1.3-stack-profile-pi, prompt: example-mapping}
  kata_base: [game-of-life, claim-office]
controls:
  model: gpt-5-6-sol-codex
outcomes:
  - verification_pct
  - tests_passing
  - completed_within_budget
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  - tests_passed_immediately
  - cc_avg_loc_per_function
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  - smell_total
  - code_mass
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: open
---

# Complete Stack-Profile Extraction on Sol-Originated Predictive TDD

## Motivation

`exact-sol-v1-pi` was designed with an explicit
`.pi/skills/predictive-tdd/stacks/typescript-vitest.md` profile. The Predictive
TDD skill itself is already largely stack-neutral, but the split is incomplete:
`AGENTS.md` still names the TypeScript profile and hard-codes `pnpm test`, while
the separate test-list skill still embeds `it.todo()`, a Vitest import, a
`.spec.ts` path, `RangeError`, and a complete TypeScript template.

The candidate `exact-sol-v1.3-stack-profile-pi` moves those remaining details
into the stack profile that the workflow already requires the model to read. It
does not introduce a new document, skill, subagent, or invocation. The factor is
only the completeness of the existing separation.

This RQ is separate from the Opus/Hybrid extraction RQ because model, harness,
workflow architecture, prediction method, and refactor mechanism differ. Pooling
them would make an observed effect uninterpretable.

## Controlled change

| Concern | Baseline | Candidate |
|---|---|---|
| Workflow methodology | Predictive TDD, prose predictions, inline Four Rules refactor | unchanged |
| Stack profile boundary | existing nested stack document | unchanged |
| Stack semantics | duplicated in orchestration/test-list and profile | concentrated in the existing profile |
| Marker contract | pi markers P1–P7 | unchanged |
| Language and framework | TypeScript + Vitest | unchanged |
| Harness, model, route | pi + `gpt-5-6-sol-codex` subscription route | unchanged |

Files intentionally changed:

- `.pi/AGENTS.md`
- `.pi/skills/test-list/SKILL.md`
- `.pi/skills/predictive-tdd/stacks/typescript-vitest.md`

`.pi/skills/predictive-tdd/SKILL.md` is inherited byte-identically because its
terms—matching stack profile, load/compile outcome, behavior check and applicable
gates—are stack roles rather than TypeScript/Vitest implementations.

## Why two katas

Results are reported separately and never averaged across katas:

- **game-of-life** checks code quality and workflow mechanics on the
  training-known case.
- **claim-office** checks Correctness (external), test-list completeness and
  premature completion on a long novel specification.

The route is held to the OpenAI subscription model ID. Requesty-labelled Sol runs
must not be mixed into these cells because RQ-route-effect-pi found route effects
on the quality outcomes measured here.

## Hypotheses

- **H1 — behavioural neutrality:** completing the existing profile split preserves
  Correctness (internal), Correctness (external), TDD markers and inline refactor
  behaviour.
- **H2 — test-list preservation:** moving the concrete inactive-test template does
  not reduce coverage of specification examples or operations.
- **H3 — no quality or cost shift:** code-quality, duration and token outcomes stay
  within ordinary replicate variation on each kata.
- **H4 — profile-attention risk:** if the move is not neutral, the likely mechanism
  is failure to consult the profile before Test List or Red rather than a change to
  Predictive TDD itself.

## Interpretation constraints

- The native Sol line permits already-green cycles. Therefore
  `predictions_total ≈ 2 × cycle_count` is not required; evaluate
  `predictions_correct_rate` and transcript compliance instead.
- `## Red`, `## Green`, `Test List Created`, `## Refactor`, the prediction block,
  and `experiment-done.txt` remain load-bearing. A missing marker is an
  implementation defect, not an experimental result.
- The text `## Refactor` remains the only refactor signal because this workflow
  refactors inline.
- Do not average across katas.

## Execution sequence

1. Audit that no TypeScript/Vitest implementation detail remains outside the
   profile and that P1–P7 remain intact.
2. Run one Game of Life smoke test for the candidate.
3. Inspect merged summary/final metrics and manually distinguish legitimate
   already-green cycles from missing prediction blocks.
4. Fill through `/run-rq RQ-stack-profile-extraction-sol`.
5. Spot-check that the model reads the matching stack profile before creating the
   test list, then aggregate.
