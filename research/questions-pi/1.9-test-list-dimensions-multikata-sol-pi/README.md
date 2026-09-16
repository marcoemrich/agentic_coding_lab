---
id: RQ-test-list-dimensions-multikata-sol-pi
question: "Across Game of Life and Sphinx Score on GPT-5.6 SOL/pi, does the v1.6 independent-dimensions test-list cross-check justify its overhead relative to the v1.5 SOL default?"
factors:
  workflow:
    - exact-sol-v1.5-tcr-parity-domain-trial-pi
    - exact-sol-v1.6-test-list-dimensions-pi
  kata_base:
    - game-of-life
    - sphinx-score
controls:
  model: gpt-5-6-sol-codex
  prompt: example-mapping
outcomes:
  - verification_pct
  - tests_passing
  - completed_within_budget
  - tests_total
  - test_lines
  - cc_avg_loc_per_function
  - cc_median_loc_per_function
  - cc_longest_function
  - cc_functions
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - smell_total
  - code_mass
  - cc_loc
  - refactorings_applied
  - predictions_correct_rate
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: answered
---

# RQ-test-list-dimensions-multikata-sol-pi: Multikata Validation of v1.6 on SOL/pi

## Question

Does the v1.6 independent-dimensions cross-check provide enough correctness or quality value to justify its overhead relative to the v1.5 SOL default on two additional katas?

This RQ follows the Claim Office comparison in `RQ-test-list-dimensions-sol-pi`, where both workflows achieved complete Correctness (external), while v1.6 used more time, tokens, tests, and hypothetical list-price cost. Game of Life and Sphinx Score test whether that result is specific to a broad catalogue-and-policy specification or generalizes to smaller algorithmic domains.

## Design

| Factor | Levels |
|---|---|
| Workflow | `exact-sol-v1.5-tcr-parity-domain-trial-pi`, `exact-sol-v1.6-test-list-dimensions-pi` |
| Kata | `game-of-life-example-mapping`, `sphinx-score-example-mapping` |
| Model and harness | `gpt-5-6-sol-codex` via pi |

Five replicates are required per workflow × kata cell. Results are always reported separately by kata; Game of Life and Sphinx Score are never averaged.

The workflows differ only in the test-list completion rule. v1.6 adds independent-dimensions, parallel-catalogue, operation-specific, and falsifying-counterfactual checks. Predictive TDD mechanics, Four Rules refactoring, domain-boundary review, shared context, stack profile, and lab markers remain fixed.

The existing v1.6 Game of Life marker smoke used the `prose` prompt and therefore does not match this RQ.

## Routing — binding

All runs use `gpt-5-6-sol-codex` through pi and the OpenAI subscription route (`openai-codex`). Requesty/Azure `gpt-5-6-sol`, Claude Code ports, and other models must not be pooled.

`cost_usd` is a hypothetical API list-price comparison, not the subscription invoice.

## Primary contrasts

For each kata independently:

1. **Correctness gate:** Correctness (external), internal tests, and completion within budget.
2. **Efficiency:** duration, tokens, and hypothetical list-price cost.
3. **Test behavior:** executable tests and Test LoC as mechanism evidence rather than automatic quality wins.
4. **Product quality:** typical and longest function size, Complexity Peak, Cognitive Complexity, McCabe, Smell Total, Code Mass (APP), and Production LoC.
5. **Process evidence:** visible cross-check behavior, prediction accuracy, and refactor markers. Marker counts are descriptive.

## Hypotheses

- **H1 — Claim Office overhead generalizes.** v1.6 ties v1.5 on correctness but consumes more time, tokens, and tests on both katas. Keep v1.5 as the SOL/pi default.
- **H2 — v1.6 prevents another omission.** It improves Correctness (external) or removes a correctness tail on at least one kata without a material quality regression. This supports a single v1.6 maintenance and export line.
- **H3 — overhead is specification-dependent.** The workflows tie on correctness and efficiency on these smaller domains, indicating that v1.6's Claim Office overhead scales with the number of dimensions it discovers.
- **H4 — stronger tests improve product quality.** v1.6 ties correctness but produces lower complexity or more robust decomposition. Promotion then depends on whether that benefit justifies cost.
- **H5 — stronger tests distort small solutions.** v1.6 increases Test LoC, Production LoC, Code Mass (APP), or complexity without external benefit. Keep it platform-specific to Opus.

## Interpretation rules

- Never average across katas.
- Internally green but externally incomplete runs remain valid outcomes.
- Timeouts count and are not refilled.
- Correctness gates efficiency and quality trophies.
- Test count, Test LoC, function count, Production LoC, Code Mass (APP), and refactor markers have ambiguous direction and receive no trophy solely for being lower or higher.
- On Sphinx Score, decomposition metrics may collapse to a single production function. In that case average function size is not evidence of abstraction quality; longest function and complexity are reported descriptively.
- Process markers are compared only within the pi harness.

## Decision rule

Keep v1.5 as the universal SOL/pi default if v1.6 shows no correctness advantage across Claim Office, Game of Life, and Sphinx Score while retaining a repeatable efficiency penalty. Prefer one v1.6 maintenance/export line only if the added cross-check demonstrates a correctness or product-quality benefit outside Opus that plausibly compensates for its SOL/pi overhead.
