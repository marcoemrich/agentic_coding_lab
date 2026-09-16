---
id: RQ-test-list-dimensions-sol-pi
question: "On GPT-5.6 SOL via pi, does the independent-dimensions test-list cross-check improve the current SOL PTDD default's external completeness without sacrificing its efficiency or product quality?"
factors:
  workflow_x_prompt:
    - {workflow: exact-sol-v1.5-tcr-parity-domain-trial-pi, prompt: example-mapping}
    - {workflow: exact-sol-v1.6-test-list-dimensions-pi, prompt: example-mapping}
controls:
  model: gpt-5-6-sol-codex
  kata_base: claim-office
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

# RQ-test-list-dimensions-sol-pi: Test-List Dimensions on SOL/pi

## Question

Does the independent-dimensions cross-check validated on native Opus also improve or preserve the current SOL PTDD default when the model and harness return to the line's native GPT-5.6 SOL/pi platform?

| Cell | Test-list completion rule | Remaining workflow |
|---|---|---|
| `exact-sol-v1.5-tcr-parity-domain-trial-pi` | every rule and example represented | current SOL default: shared-context PTDD, Four Rules, domain-boundary trial |
| `exact-sol-v1.6-test-list-dimensions-pi` | v1.5 plus independent-dimensions, parallel-catalogue, operation, and omission-counterfactual review | byte-identical to v1.5 |

The v1.5 cell reuses the five Claim Office runs that established the current SOL default. The v1.6 cell requires five new runs. The existing v1.6 `game-of-life-prose` run is a marker smoke only and does not match this RQ.

## Motivation

On native Opus, v1.6 removed the v1.5 external-completeness tail: Correctness (external) moved from 0.95 ± 0.12 with one run at 0.733 to 1.00 ± 0.00, while mean duration, tokens, and list-price comparison also fell. That result is platform-specific until replicated on SOL/pi.

The source SOL line already achieved complete Correctness (external) with v1.5 on Claim Office. This RQ therefore tests two risks that the Opus result cannot answer:

- the extra coverage review may be redundant on GPT-5.6 SOL and add only prompt or test cost;
- the review may alter test selection, implementation shape, or execution behavior differently on the model for which the workflow was originally designed.

## Routing — binding

All runs use `gpt-5-6-sol-codex` through the pi harness and the OpenAI subscription route (`openai-codex`). They must not be pooled with Requesty/Azure `gpt-5-6-sol` runs, native Opus runs, or another harness.

The model id encodes the route. `cost_usd` is a hypothetical API list-price comparison, not a subscription invoice.

Model, route, reasoning profile, harness, kata, prompt style, shared context, Predictive TDD mechanics, Four Rules, domain-boundary review, stack profile, autonomy, and parser markers are controls. Only the test-list completion rule varies.

## Primary contrasts

1. **External completeness:** compare mean, minimum, and distribution of Correctness (external). Since v1.5 is already perfect in the existing sample, v1.6 must preserve that floor rather than merely improve a mean.
2. **Test behavior:** compare executable tests and Test LoC. Additional tests are mechanism evidence, not an automatic quality win.
3. **Efficiency:** compare duration, tokens, and hypothetical list-price estimates. A neutral correctness result favors the lower-cost workflow.
4. **Product shape:** compare typical function size, function count, Complexity Peak, Cognitive Complexity, McCabe, Smell Total, Code Mass (APP), and Production LoC.
5. **Process evidence:** inspect the visible coverage cross-check and compare refactor markers and prediction accuracy. Marker counts are descriptive rather than quality rankings.

## Hypotheses

- **H1 — correctness is preserved.** v1.6 retains complete Correctness (external), green internal suites, and completion within budget on all SOL/pi runs.
- **H2 — the cross-check is model-neutral.** v1.6 identifies independent dimensions without producing a mechanical test cross product or changing product shape beyond run-level variance.
- **H3 — efficiency remains within the v1.5 spread.** The added review does not materially increase duration, tokens, or list-price comparison.
- **H4 — SOL already supplied the missing discipline.** Correctness and product metrics tie while v1.6 adds test or token cost; v1.5 remains the SOL/pi default even though v1.6 is preferred on Opus.
- **H5 — v1.6 is cross-model promotable.** It preserves complete correctness and is neutral or better on efficiency and product quality, supporting one current PTDD default across Opus/CC and SOL/pi.

## Interpretation rules

- Katas are never averaged; this RQ has one kata.
- Internally green but externally incomplete runs remain valid workflow outcomes.
- Timeouts count and are not refilled.
- Code-quality and efficiency trophies are correctness-gated.
- Test count, Test LoC, function count, Code Mass (APP), Production LoC, and refactor markers are contextual metrics when their direction is ambiguous.
- The pi marker parser must report healthy cycle, refactor, prediction, and completion signals before aggregation. Process counts are not compared to CC runs.
- Findings from the native-Opus RQ are contextual motivation only; no cross-harness pooling is allowed.

## Promotion decision

Promote `exact-sol-v1.6-test-list-dimensions-pi` as the SOL/pi default only if it preserves the v1.5 perfect correctness floor and does not create a material efficiency or product-quality regression. If the treatment is neutral but measurably more expensive, keep v1.5 on SOL/pi and v1.6 on Opus/CC as model-specific defaults.
