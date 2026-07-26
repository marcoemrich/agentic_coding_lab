---
id: RQ-model-quality-cc-vs-pi
question: "Does the code-quality profile of Opus (opus-4-8) differ between the Claude Code and the pi harness, each with and without thinking, at a constant workflow generation (v6.2)?"
factors:
  # model (incl. thinking suffix) + harness (encoded in the workflow) as coupled
  # bundles. 4 cells: {CC, pi} × {thinking, no-thinking}. thinking sits in the
  # model suffix (-no-thinking); every cell collapses equivalent spellings
  # via {any:[...]} (v6.2 ≡ v6.2.1, opus-4-8 ≡ opus-4-8-requesty).
  model_x_workflow:
    # Claude Code, thinking
    - model: {any: [opus-4-8-requesty, opus-4-8]}
      workflow: {any: [v6.2-with-why-cleaned, v6.2.1-phase-continuation]}
    # Claude Code, no-thinking
    - model: opus-4-8-no-thinking
      workflow: {any: [v6.2-with-why-cleaned, v6.2.1-phase-continuation]}
    # pi, thinking
    - model: opus-4-8
      workflow: {any: [v6.2.1-phase-continuation-pi, v6.2-phase-continuation-pi]}
    # pi, no-thinking
    - model: opus-4-8-no-thinking
      workflow: {any: [v6.2.1-phase-continuation-pi, v6.2-phase-continuation-pi]}
controls:
  kata_base: game-of-life
  prompt: example-mapping
outcomes:
  # primary: code quality / complexity (the cognitive_max finding drives this RQ)
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - cc_longest_function
  - cc_avg_loc_per_function
  - lines_of_code
  - code_mass
  - smell_total
  # secondary: correctness
  - tests_passing
  - tests_total
  - verification_pct
  # tertiary: TDD discipline
  - cycle_count
  - refactorings_applied
  - predictions_correct
  - predictions_total
  # context
  - completed_within_budget
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: aktiv
---

# RQ-model-quality-cc-vs-pi: Opus via the Claude Code vs. pi path

## Motivation

The harness effect on Opus is to be isolated with **model, thinking and workflow generation held constant**: Claude Code (CC) vs. pi, both with `opus-4-8` and `thinking=true`, both on the v6.2 workflow generation, kata game-of-life-example-mapping. If a code-quality difference (`cognitive_max`, `cognitive_avg`) remains under this constancy, it is attributable to the harness/routing path — not to model, effort or workflow generation.

This RQ is the thinking-constant core of an originally broader harness comparison. cursor and OpenCode are deliberately excluded: cursor cannot do `thinking` due to its roster (only `medium`), OpenCode is not pursued further here.

Only game-of-life-example-mapping: the RQ targets the code-quality/complexity signal that game-of-life carries. claim-office (correctness) would lie on a different axis.

## Constancy and remaining confounds

- **Model + effort constant**: both cells `opus-4-8` with `thinking=true`. The 5 existing CC runs use `opus-4-8-requesty`, the pi cell `opus-4-8` — both actually routed via Requesty/Vertex-EU (container-global), same route, logged differently in the `cli_model` field. No routing confound in the model.
- **Workflow generation constant, workflow line NOT**: CC runs on `v6.2-with-why-cleaned`, pi on `v6.2.1-phase-continuation-pi`. Both belong to the v6.2 generation and are here — as an explicit stipulation — **treated as identical in workflow terms** (incl. `v6.2.1` ≡ `v6.2` and their harness variants such as `-pi`). Structurally they are two lines of the same generation (with-why-cleaned uses `commands`/`rules`, phase-continuation uses `skills`/`extensions`/`AGENTS.md`). A remaining difference can therefore be harness OR workflow line — name it as a caveat in the finding.

`model` is therefore not pinned as `controls.model`, but bound per cell via the `model_x_workflow` pair factor to the matching harness workflow/model spelling. Every cell uses `{any:[...]}` to collapse equivalent spellings (v6.2 ≡ v6.2.1; `opus-4-8` ≡ `opus-4-8-requesty`).

## Existing data (as of 2026-07-26)

- **CC cell** (`v6.2-with-why-cleaned`, `opus-4-8-requesty`, thinking=true): **5** runs — all DONE, tests green. No topping up needed.
- **pi cell** (`v6.2.1-phase-continuation-pi`, `opus-4-8`, thinking=true): **5** runs (incl. one `-2` rerun). No topping up needed.

Both cells fillable from existing data → no fill batch. Should a cell fall below n=5 in the future, the `{any:[...]}` match also covers the respective other spelling.

## Hypotheses

- **H1 (harness isolation)**: At constant model/thinking/workflow generation the `cognitive_max`/`cognitive_avg` difference between CC and pi is small (< 1σ) → harness-neutral. A large difference is attributable to the harness path (or the workflow line, see caveat).
- **H2 (parsimony)**: If the harnesses differ in `lines_of_code`, the same parsimony/complexity tradeoff as in [RQ-model-quality-cursor](../../questions-cursor-cli/1.1-model-quality-cursor/findings.md) may show up (few LoC at high density).

## Methodological notes

- **Harness encoded in the workflow**: analogous to [RQ-harness](../1.1-harness-effect/README.md), the workflow carries the harness. A 1:1 identical workflow file across harnesses is impossible (different marker dirs: `.claude/` vs `.pi/`).
- **Tariff confound**: `cost_usd` is present for the CC-requesty cell, likewise pi (both Requesty). Comparable as long as both run via Requesty.
- `n=5` per cell follows memory [[replicates-n-reliability]].
- `verification_pct` mirrors `tests_passing` on game-of-life (no external suite); the correctness anchor is `tests_passing`.
