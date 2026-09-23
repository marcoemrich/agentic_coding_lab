---
id: RQ-gpt6-sol-vs-gpt56-sol
question: "Does GPT-6 Sol match or beat GPT-5.6 Sol on the canonical Predictive TDD workflow (exact-ptdd-v1-pi) — in correctness, code quality and cost?"
# Route is a constant, not a factor: both cells run on the OpenAI subscription
# route (pi provider `openai-codex`), encoded in the `-codex` model ids.
factors:
  model:
    - gpt-6-sol-codex      # NEW — openai-codex/gpt-6-sol, released 2026-09-22
    - gpt-5-6-sol-codex    # reference — openai-codex/gpt-5.6-sol
  kata_base:
    - claim-office         # correctness kata
    - game-of-life         # code-quality kata
controls:
  workflow: exact-ptdd-v1-pi
  prompt: example-mapping
outcomes:
  # primary: correctness. A cell that drops here disqualifies itself
  # regardless of its quality numbers.
  - verification_pct
  - tests_passing
  - completed_within_budget
  # primary: code quality
  - code_mass
  - smell_total
  - cc_loc
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - cc_avg_loc_per_function
  - cc_longest_function
  - cc_functions
  - tests_total
  - test_lines
  # TDD discipline (marker health)
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  # cost
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: open
---

# RQ-gpt6-sol-vs-gpt56-sol: Does GPT-6 Sol Replace GPT-5.6 Sol?

## Question

OpenAI released GPT-6 Sol on 2026-09-22 as the successor of GPT-5.6 Sol, at
less than half the list price ($2 / $10 vs. $5 / $30 per 1M input/output
tokens). GPT-5.6 Sol on pi with `exact-ptdd-v1-pi` is the lab's recommended
EXACT Coding default (`research/workflow-dev/model-recommendation-matrix.md`).
This RQ tests whether GPT-6 Sol can take over that default without losing
correctness or code quality — and what it costs in tokens, wall-clock and
list-price.

## Design

| Factor | Levels |
|---|---|
| Model | `gpt-6-sol-codex`, `gpt-5-6-sol-codex` |
| Kata | `claim-office-example-mapping` (correctness), `game-of-life-example-mapping` (code quality) |
| Workflow | `exact-ptdd-v1-pi` (constant) |
| Harness and route | pi, `openai-codex` subscription (constant) |

2 models × 2 katas × 5 replicates = 20 runs. Results are reported per kata;
the two katas are never averaged.

## Why both cells are filled fresh

Content-identical GPT-5.6 Sol runs exist under the pre-promotion name
`exact-sol-v1.6-test-list-dimensions-pi` (10 on Claim Office, 5 on Game of
Life). They are **deliberately not pooled** via a workflow `any:`: they date
from August/September, and pairing them with launch-day GPT-6 runs would
confound the model factor with harness, image and upstream-serving drift.
Both cells therefore run in the same batch under the canonical name, so a
fill plan produces 10 runs per model. The older v1.6 cells stay available
as a replication check of the GPT-5.6 reference.

## Hypotheses

- **H1 (correctness parity):** GPT-6 Sol reaches the same Correctness
  (external) on Claim Office as GPT-5.6 Sol.
- **H2 (quality parity):** on Game of Life, GPT-6 Sol's Code Mass (APP) and
  Smell Total lie within the GPT-5.6 Sol range.
- **H3 (cost):** GPT-6 Sol's `cost_usd` falls below GPT-5.6 Sol's in both
  katas. At a 2.5–3× lower tariff this can only fail if GPT-6 Sol uses
  substantially more tokens.

## Caveats

- **Launch-day model.** Serving on the codex route may still change in the
  first weeks; a replication after a few weeks is advisable before a
  default switch.
- **`models.json` limits are copied from GPT-6 Astra** (272,000 context /
  128,000 output). No source for GPT-6 Sol's codex-route limits was
  reachable at wiring time (`research/model-pricing.md`).
- **Reasoning is on in both cells.** The codex route emits reasoning
  regardless of `--thinking` (see `RQ-route-effect-pi`), so there is no
  `-no-thinking` arm.
- **`cost_usd` is a list-price comparison value**, not a billed amount:
  the subscription is flat-rate. `compute-cost.py` `PRICES` is the only
  source; the long-context tariff jump above 272k is not modelled.
- **Smoke first.** GPT-6 Sol is new to the lab: before the full batch,
  run one Claim Office replicate and check marker health
  (`cycle_count >= 3`, `refactorings_applied >= 1`,
  `predictions_total ~ 2 * cycle_count`) and that the transcript records
  `gpt-6-sol` rather than a silent fallback model.
