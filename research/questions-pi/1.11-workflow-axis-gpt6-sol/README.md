---
id: RQ-workflow-axis-gpt6-sol
question: "On GPT-6 Sol, what does EXACT Coding Predictive TDD buy over a plain inline-TDD baseline, and does isolating the Refactor phase in a subagent add anything on top?"
# Model and route are constants: pi provider `openai-codex` (subscription),
# encoded in the `-codex` model id. Only the workflow and the kata vary.
factors:
  workflow:
    - baseline-inline-tdd-v1-pi                 # TDD without EXACT Coding structure
    - exact-ptdd-v1-pi                          # canonical EXACT Coding PTDD, refactor inline
    - exact-ptdd-v1.1-refactor-subagent-pi      # same, per-cycle refactor in an isolated subagent
  kata_base:
    - claim-office         # correctness kata
    - game-of-life         # code-quality kata
controls:
  model: gpt-6-sol-codex
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
  - cc_median_loc_per_function
  - cc_longest_function
  - cc_functions
  - tests_total
  - test_lines
  # suite strength. Stryker on this stack; not comparable to the PIT/mutmut
  # numbers in the Java and Python RQs. Report mutants_total/mutants_survived
  # alongside the ratio — the arms differ in code size, and the score's
  # denominator moves with it.
  - mutation_score
  - mutants_total
  - mutants_survived
  - mutants_no_coverage
  # TDD discipline (marker health). The baseline arm has no prediction
  # markers, so predictions_correct_rate is structurally empty there.
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  # cost
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: answered
---

# RQ-workflow-axis-gpt6-sol: The Workflow Axis on GPT-6 Sol

## Question

GPT-6 Sol matches GPT-5.6 Sol on the canonical Predictive TDD workflow and
costs about a third as much (`RQ-gpt6-sol-vs-gpt56-sol`). That result holds one
workflow constant and says nothing about whether the workflow still earns its
keep on the new model. This RQ opens the workflow axis on GPT-6 Sol across
three points of the architecture gradient:

1. **inline TDD** — a plain Red/Green/Refactor instruction, no EXACT Coding
   structure, no test list, no predictions.
2. **EXACT Coding PTDD** — the canonical default: test list with dimensions,
   predictive cycle, Four Rules and domain-boundary review, all in one context.
3. **EXACT Coding PTDD + isolated Refactor** — identical, except every
   per-cycle refactor review runs in a fresh subagent.

## Design

| Factor | Levels |
|---|---|
| Workflow | `baseline-inline-tdd-v1-pi`, `exact-ptdd-v1-pi`, `exact-ptdd-v1.1-refactor-subagent-pi` |
| Kata | `claim-office-example-mapping` (correctness), `game-of-life-example-mapping` (code quality) |
| Model | `gpt-6-sol-codex` (constant) |
| Prompt style | Example Mapping (constant) |
| Harness and route | pi, `openai-codex` subscription (constant) |
| Stack | TypeScript / Vitest (constant) |

3 workflows × 2 katas × 5 replicates = 30 runs. The ten `exact-ptdd-v1-pi`
runs recorded for `RQ-gpt6-sol-vs-gpt56-sol` match this design cell for cell
(same model, prompt, stack, katas, image generation) and are pooled, so the
fill is 20 runs. Results are reported per kata; the two katas are never
averaged.

## Hypotheses

- **H1 (structure buys quality):** both EXACT arms beat the inline-TDD
  baseline on Complexity Peak and per-function size at equal Correctness
  (external).
- **H2 (isolation replicates):** the isolated-refactor arm improves every
  structural measure over inline PTDD, as it did on GPT-5.6 Sol and native
  Opus 5 (`RQ-ptdd-refactor-subagent-cross-model`, F-1.7.1) — and, as there,
  by splitting the product rather than shrinking it (F-1.7.2): more functions,
  not less code.
- **H3 (isolation is the expensive arm):** the subagent arm costs multiples of
  inline PTDD in tokens and wall-clock. On GPT-5.6 Sol it was 3.8× the cost
  and 3.3× the duration. The open question is whether GPT-6 Sol's lower tariff
  moves that trade-off, not whether the ordering holds.
- **H4 (baseline correctness):** the inline-TDD baseline reaches full
  Correctness (external) on Claim Office too. If it does, the EXACT arms must
  justify themselves on quality alone.

## Caveats

- **Launch-day model.** GPT-6 Sol was released 2026-09-22; codex-route serving
  may still change. The same replication caveat as `RQ-gpt6-sol-vs-gpt56-sol`
  applies.
- **`predictions_correct_rate` is not a contest.** Only the two EXACT arms
  emit prediction markers; the baseline's empty value is structural, not a
  discipline finding, and carries no trophy.
- **`refactorings_applied` counts differently per arm.** The EXACT arms review
  every cycle by contract; the baseline refactors when it decides to. The
  number is context, not an outcome.
- **Pooled PTDD cell.** The ten pooled runs come from a different batch than
  the fill. Same image, same route, days apart — documented here rather than
  re-run.
- **Reasoning is on in every cell.** The codex route emits reasoning
  regardless of `--thinking` (`RQ-route-effect-pi`), so there is no
  `-no-thinking` arm.
- **`cost_usd` is a list-price comparison value**, not a billed amount: the
  subscription is flat-rate. `compute-cost.py` `PRICES` is the only source;
  the long-context tariff jump above 272k is not modelled.
- **Mutation Score on Claim Office can be structurally unmeasurable** for
  suites that only drive a spawned CLI (F-1.10.2). Expect fewer mutation
  replicates than metric replicates in that kata and report the n.
