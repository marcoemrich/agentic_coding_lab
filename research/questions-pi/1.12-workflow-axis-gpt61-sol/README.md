---
id: RQ-workflow-axis-gpt61-sol
question: "On GPT-6.1 Sol, what does EXACT Coding Predictive TDD buy over a plain inline-TDD baseline, and does isolating the Refactor phase in a subagent add anything on top?"
# Model and route are constants: pi provider `openai-codex` (subscription),
# encoded in the `-codex` model id. Only the workflow and the kata vary.
# Same design as RQ-workflow-axis-gpt6-sol, cell for cell, so the two RQs can
# be read side by side per kata.
factors:
  workflow:
    - baseline-inline-tdd-v1-pi                 # TDD without EXACT Coding structure
    - exact-ptdd-v1-pi                          # canonical EXACT Coding PTDD, refactor inline
    - exact-ptdd-v1.1-refactor-subagent-pi      # same, per-cycle refactor in an isolated subagent
  kata_base:
    - claim-office         # correctness kata
    - game-of-life         # code-quality kata
controls:
  model: gpt-6-1-sol-codex
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
  # suite strength. Stryker on this stack. Report mutants_total and
  # mutants_survived alongside the ratio, since the arms differ in code size.
  - mutation_score
  - mutants_total
  - mutants_survived
  - mutants_no_coverage
  # TDD discipline from the phase chain. Only columns that stay comparable
  # across the test-list boundary: the baseline has no test list, the two
  # EXACT arms do, so tdd_discipline and skip_events are left out.
  - tdd_discipline_step
  - red_batch_max
  - refactor_events
  - cycles_closed
  - chain_suite_runs
  # cost
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
---

# RQ-workflow-axis-gpt61-sol: The Workflow Axis on GPT-6.1 Sol

## Question

On GPT-6 Sol both EXACT arms produced a decomposed product with zero findings
where the inline-TDD baseline wrote a working monolith, and the isolated
Refactor subagent added nothing on top on Claim Office
(`RQ-workflow-axis-gpt6-sol`). GPT-6.1 Sol is the point release that followed
eight days later. This RQ repeats the same three-arm design on it:

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
| Model | `gpt-6-1-sol-codex` (constant) |
| Prompt style | Example Mapping (constant) |
| Harness and route | pi, `openai-codex` subscription (constant) |
| Stack | TypeScript / Vitest (constant) |

3 workflows × 2 katas × 5 replicates = 30 runs, no pooled runs. Results are
reported per kata; the two katas are never averaged.

## Hypotheses

- **H1 (structure buys quality):** both EXACT arms beat the inline-TDD
  baseline on `cognitive_max`, Smell Total and per-function size at equal
  Correctness (external), as on GPT-6 Sol.
- **H2 (isolation stays flat):** the isolated-refactor arm lands within one
  standard deviation of inline PTDD on the structural axes, as it did on
  GPT-6 Sol (`RQ-workflow-axis-gpt6-sol`), rather than improving every
  structural measure as on GPT-5.6 Sol and native Opus 5
  (`RQ-ptdd-refactor-subagent-cross-model`, F-1.7.1).
- **H3 (isolation is the expensive arm):** the subagent arm costs multiples of
  inline PTDD in tokens and wall-clock.
- **H4 (step size is the mechanism):** the baseline writes several failing
  tests per Red (`red_batch_max` > 1) while both EXACT arms stay at one, as
  measured on Opus 5 and Opus 5.5 (RQ-opus55-current-workflow, F-2.4.6).

## Caveats

- **New model.** GPT-6.1 Sol was released 2026-09-30 and wired on 2026-10-05;
  codex-route serving may still change.
- **Context window of the codex route is unverified.** The API lists 1,050,000
  tokens; `models.json` carries 272,000 like the other Sol entries. A run that
  compacts early would show it in the transcript.
- **No cross-model claim.** This RQ holds the model constant. Reading it next
  to `RQ-workflow-axis-gpt6-sol` per kata is fine for directions; a model
  comparison needs its own RQ.
- **Test-list boundary.** `tdd_discipline`, `skip_events` and related columns
  are not comparable between the baseline and the EXACT arms and are not
  outcomes here (README, "Comparability: the test-list boundary").
- **Reasoning is on in every cell.** The codex route emits reasoning
  regardless of `--thinking` (`RQ-route-effect-pi`), so there is no
  `-no-thinking` arm.
- **`cost_usd` is a list-price comparison value**, not a billed amount: the
  subscription is flat-rate. `compute-cost.py` `PRICES` is the only source;
  the long-context tariff step above 272k is not modelled.
- **Mutation Score on Claim Office can be structurally unmeasurable** for
  suites that only drive a spawned CLI (RQ-workflow-axis-gpt6-sol F-1.11.5).
  Expect fewer mutation replicates than metric replicates in that kata and
  report the n.
