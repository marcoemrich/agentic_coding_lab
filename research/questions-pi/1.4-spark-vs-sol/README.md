---
id: RQ-spark-vs-sol
question: "On the OpenAI subscription route, how does GPT-5.3 Codex Spark compare to GPT-5.6 Sol on the two native Sol workflows — does the smaller, cheaper-tier model hold correctness and code quality, or does it only look competitive because the workflow carries it?"
factors:
  model: [gpt-5-6-sol-codex, gpt-5-3-codex-spark]
  workflow: [basic-sol-tdd-pi, basic-sol-tdd-subagent-pi]
controls:
  kata_base: sphinx-score
  prompt: example-mapping
outcomes:
  # primary: correctness — an external suite the agent never sees.
  # A model that loses here disqualifies itself regardless of its quality numbers.
  - verification_pct
  - tests_passing
  - completed_within_budget
  # code quality — the second axis. sphinx-score is a quality kata, so these
  # differentiate rather than gate.
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - cc_longest_function
  - cc_avg_loc_per_function
  - smell_total
  # code mass — reported without trophy, see "Metric blind spot" in RQ-1.14:
  # APP has no notion of nesting and rewards one long function.
  - code_mass
  # TDD discipline. predictions_correct_rate only, never predictions_total --
  # see the marker caveat below before reading these.
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  # cost. cost_usd is deliberately NOT an outcome here: both models run on the
  # flat-rate subscription and are wired without per-token prices, so the field
  # is a constant 0 and would fake a tie. Tokens and wall-clock are the real
  # cost signal on this route.
  - duration_seconds
  - total_tokens
min_replicates: 5
status: answered
---

# RQ-spark-vs-sol: Does Spark Hold Against Sol on the Native Sol Workflows?

## The question this answers

`RQ-native-sol-workflows-sub` (workflow-dev/1.16) established that the two native
Sol workflows — `basic-sol-tdd-pi` (refactor inline) and `basic-sol-tdd-subagent-pi`
(refactor isolated) — are the line worth running on the subscription route. Both were
measured on **one** model: `gpt-5-6-sol-codex`.

This RQ opens the model axis on that same line. `gpt-5.3-codex-spark` is the smaller,
lower-tier model on the same OpenAI subscription. Same auth, same provider
(`openai-codex`, `chatgpt.com/backend-api`), same flat-rate tariff — the route is held
constant and only the model varies. That makes it a clean 2x2: model x workflow.

The practical question behind it: if Spark holds, the subscription's cheaper tier
becomes the default for this workflow line, and Sol is reserved for cases that
demonstrably need it.

## Hypotheses

**H1 — Spark loses correctness.** The smaller model drops below Sol on
`verification_pct`. Expected as the default outcome for a lower-tier model on a
kata with 16 external scenarios covering threshold logic and special cases.

**H2 — Spark holds correctness but pays in code quality.** Same
`verification_pct`, worse `cognitive_max` / `smell_total` / `cc_longest_function`.

**H3 — Spark holds both.** Then the workflow, not the model, is doing the work on
this kata, and the cheaper tier is the honest recommendation for this cell.

**H4 — The workflow axis dominates the model axis.** `basic-sol-tdd-subagent-pi`
vs. `basic-sol-tdd-pi` separates the cells more than Spark vs. Sol does. Would say
the isolated-refactor decision matters more than the model choice — and would make
RQ-1.16's workflow finding the more portable one.

## Prior data

The RQ opened with two Spark smoke runs in the `basic-sol-tdd-subagent-pi` cell
(2026-08-17), which established that the newly wired route produces usable runs at all.
All four cells are now filled to n=5; see `findings.md` for the results and
`summary.md` for the per-cell pivots.

## Caveats

**Prediction marker counts are unreliable on Spark.** Spark's `predictions_total`
does not scale with `cycle_count` the way Sol's does — it logs 82 and 77 predictions
against Sol's 68 and 76 while running partly fewer cycles. Whether Spark emits the
`(Compilation|Runtime) Prediction: ... (Correct|Incorrect)` lines at a different rate
or the pi parser picks them up inconsistently on this route is **unresolved**. Until
it is, `predictions_total` must not be compared across models — only
`predictions_correct_rate`, which is a ratio within each model. See F-1.4.3.

**Phase timings and context utilization are not measured on the codex route.**
`avg_cycle_seconds`, `avg_red_seconds`, `avg_green_seconds`, `avg_refactor_seconds`
and `context_utilization_pct` come back as 0 in every Spark run inspected, despite
millions of tokens. This is a parser gap, not a measurement. They are excluded from
`outcomes:` for that reason; do not reintroduce them without fixing the parser first.

**`cost_usd` is structurally 0.** Spark is wired without per-token prices because the
subscription is flat-rate, and copying Sol's prices would fabricate a number. Any
cost comparison on this RQ must run on `total_tokens` and `duration_seconds`. Do not
let a `cost_usd` column into the findings table — a 0-vs-0 tie there is an artifact.

**Spark is newly wired.** The model was added to `pi-config/agent/models.json` and
`run-batch.sh` on 2026-08-17. Routing is verified (2621 transcript entries on
`gpt-5.3-codex-spark`, and a deliberately invalid id is rejected by the backend), so
there is no silent fallback. But no long-run history exists on this id yet.

**Sol's reasoning declaration differs by profile.** The `openai-codex` entry declares
`reasoning: true`; Spark is wired the same way. Both cells therefore run with
reasoning on. This RQ does not vary reasoning — see RQ-route-effect-pi (1.3) for that
axis. Do not mix a `-noreason` arm into these cells; open a new RQ instead.
