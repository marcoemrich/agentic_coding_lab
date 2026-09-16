---
id: RQ-test-list-dimensions-replication
question: "Does the apparent platform interaction between PTDD v1.5 and v1.6 replicate at n=10 per cell on Claim Office, or was it driven by small-sample variance?"
factors:
  model_x_workflow:
    - {model: opus-5-no-thinking, workflow: exact-sol-v1.5-tcr-parity-domain-trial-cc}
    - {model: opus-5-no-thinking, workflow: exact-sol-v1.6-test-list-dimensions-cc}
    - {model: gpt-5-6-sol-codex, workflow: exact-sol-v1.5-tcr-parity-domain-trial-pi}
    - {model: gpt-5-6-sol-codex, workflow: exact-sol-v1.6-test-list-dimensions-pi}
controls:
  kata_base: claim-office
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
min_replicates: 10
status: aktiv
---

# RQ-test-list-dimensions-replication: Replicating the Opus/SOL Interaction

## Question

Does the apparent platform interaction between PTDD v1.5 and v1.6 persist after increasing every Claim Office cell from five to ten runs?

The first samples point in opposite directions. On native Opus, v1.6 removes a completeness failure and has much lower mean duration, tokens, and list-price comparison. On GPT-5.6 SOL/pi, both versions are externally complete while v1.6 has higher efficiency means. Both comparisons have n=5 and large run-level variance, so a few long trajectories may be driving the apparent interaction.

## Design

| Platform | v1.5 workflow | v1.6 workflow | Existing n | Target n |
|---|---|---|---:|---:|
| Native Opus / Claude Code | `exact-sol-v1.5-tcr-parity-domain-trial-cc` | `exact-sol-v1.6-test-list-dimensions-cc` | 5 each | 10 each |
| GPT-5.6 SOL / pi | `exact-sol-v1.5-tcr-parity-domain-trial-pi` | `exact-sol-v1.6-test-list-dimensions-pi` | 5 each | 10 each |

The RQ adds five runs per cell: 20 new runs in total. Results are compared within platform first. Cross-platform absolute cost and token values remain descriptive because harness and provider differ; the primary cross-platform question is whether the direction of the v1.6 treatment effect changes.

The only operative workflow difference is the test-list skill. v1.6 adds an independent-dimensions coverage cross-check; Predictive TDD mechanics, prediction markers, Red/Green/Refactor behavior, Four Rules, domain-boundary trial, and stack profile are unchanged within each harness.

## Routing — binding

- `opus-5-no-thinking` uses native Claude Code with the bare `claude-opus-5` id and native Anthropic credentials.
- `gpt-5-6-sol-codex` uses pi through the OpenAI subscription route (`openai-codex`).

Requesty/Azure SOL runs and non-native Opus runs must not be pooled. `cost_usd` is a hypothetical list-price comparison rather than an invoice.

## Primary contrasts

Within each platform:

1. Correctness (external), its minimum, and the count of perfect runs.
2. Duration, tokens, and list-price comparison, including medians and ranges from `runs.csv` where long-tailed means are suspected.
3. Executable tests and Test LoC as evidence that the cross-check changes test planning.
4. Typical function size, Complexity Peak, Cognitive Complexity, McCabe, Smell Total, Code Mass (APP), and Production LoC.

Across platforms, compare the signed v1.6 − v1.5 effect rather than absolute levels.

## Hypotheses

- **H1 — the interaction replicates.** v1.6 remains correctness-safer and cheaper on Opus but costlier without a correctness gain on SOL/pi. Model-specific defaults are justified.
- **H2 — the interaction is a small-sample artifact.** Additional runs pull one or both efficiency contrasts toward zero or reverse them. Default selection should use the pooled n=10 result.
- **H3 — the Opus correctness tail persists.** v1.5 produces further external omissions while v1.6 preserves a stronger floor, making the dimensions cross-check valuable even if efficiency converges.
- **H4 — SOL also develops a v1.5 tail.** The larger sample reveals omissions under v1.5 that v1.6 prevents, supporting one v1.6 maintenance line.
- **H5 — test volume is the stable mechanism.** v1.6 consistently increases executable coverage on both platforms even when cost effects remain noisy.

## Interpretation rules

- Existing and new runs are pooled query-wise to n=10 per exact cell.
- Correctness gates quality and efficiency trophies.
- Internal-green external failures remain valid outcomes.
- Timeouts count and are not refilled.
- Compare workflows within a platform; never award a cross-platform cost or quality trophy where harness/provider differences are uncontrolled.
- Test count, Test LoC, function count, Code Mass (APP), Production LoC, and refactor markers have ambiguous direction.
- Report medians and ranges for duration, tokens, and cost in findings because the original n=5 cells contain substantial skew.
- CC and pi process-marker totals are not compared across harnesses.

## Decision rule

Maintain separate optimized defaults only if the n=10 within-platform treatment effects remain directionally distinct and practically relevant. Prefer one workflow if the interaction disappears or if one version establishes a correctness advantage on both platforms without a consistent efficiency or product-quality penalty.
