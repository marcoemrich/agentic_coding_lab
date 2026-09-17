---
id: RQ-ptdd-refactor-subagent-cross-model
question: "Does isolating only the per-cycle Refactor phase improve PTDD v1 product structure enough to justify its context cost on native Opus and GPT-5.6 SOL/pi?"
factors:
  model_x_workflow:
    - {model: opus-5-no-thinking, workflow: {any: [exact-ptdd-v1-cc, exact-sol-v1.6-test-list-dimensions-cc]}}
    - {model: opus-5-no-thinking, workflow: exact-ptdd-v1.1-refactor-subagent-cc}
    - {model: gpt-5-6-sol-codex, workflow: {any: [exact-ptdd-v1-pi, exact-sol-v1.6-test-list-dimensions-pi]}}
    - {model: gpt-5-6-sol-codex, workflow: exact-ptdd-v1.1-refactor-subagent-pi}
controls:
  kata_base: claim-office
  prompt: example-mapping
outcomes:
  - verification_pct
  - tests_passing
  - completed_within_budget
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
status: aktiv
---

# RQ-ptdd-refactor-subagent-cross-model: Isolated Refactoring in PTDD v1

## Question

What changes when the universal PTDD v1 workflow keeps Test List, Red, and Green in the main context but delegates every per-cycle Four Rules and domain-boundary review to a fresh isolated refactor subagent?

## Cells

| Platform | Control | Treatment |
|---|---|---|
| Native Opus / Claude Code | `exact-ptdd-v1-cc` | `exact-ptdd-v1.1-refactor-subagent-cc` |
| GPT-5.6 SOL / pi | `exact-ptdd-v1-pi` | `exact-ptdd-v1.1-refactor-subagent-pi` |

The canonical control names are content-identical promotions of the measured `exact-sol-v1.6-test-list-dimensions-*` workflows. Their existing Claim Office runs are pooled through explicit workflow alternatives. Five fresh treatment runs are required per platform.

The only intended treatment is Refactor execution context. The test-list dimensions cross-check, Predictive-TDD cycle, compilation and runtime predictions, Four Rules ordering, domain-responsibility review, mandatory boundary trial, narrow undo, stack profiles, and lab contracts remain unchanged. The treatment agent receives the active behavior, relevant files, and stack commands but not the main context's Red/Green reasoning.

## Routing — binding

- `opus-5-no-thinking` uses native Claude Code and `claude-opus-5`.
- `gpt-5-6-sol-codex` uses pi through the OpenAI subscription route.

Compare control and treatment only within platform. Absolute cross-platform token and cost levels are not causal comparisons.

## Primary contrasts

1. **Correctness gate:** Correctness (external), internal tests, and completion within budget.
2. **Decomposition:** mean and median LoC/function are primary; longest function, function count, and Complexity Peak are robustness measures.
3. **Other product quality:** Cognitive Complexity, McCabe, Smell Total, Code Mass (APP), and Production LoC.
4. **Isolation cost:** duration, tokens, and hypothetical list-price comparison.
5. **Mechanism:** delegated refactor calls must appear once per completed cycle path rather than falling back to inline `## Refactor` markers. Process counts are descriptive.

## Hypotheses

- **H1 — fresh context improves decomposition.** The subagent lowers typical function size without reducing Correctness (external).
- **H2 — isolation buys no product benefit.** Product metrics remain within control spread while duration and tokens rise; keep inline PTDD v1.
- **H3 — effect is model-dependent.** Opus benefits from an independent reviewer while SOL does not, or vice versa.
- **H4 — context loss harms semantic refactoring.** The subagent lacks useful Red/Green reasoning and produces larger or more complex code despite receiving the active behavior and files.
- **H5 — isolation destabilizes completion.** Additional round trips create timeout, rate-limit, or incomplete-work tails that disqualify any quality gain.

## Interpretation rules

- Existing control runs and fresh treatment runs are pooled query-wise; no cross-kata averaging occurs.
- Correctness gates quality and efficiency trophies.
- Timeouts count and are not refilled.
- Compare treatment effects within platform; harness differences are controls, not a ranking.
- Function count, Code Mass (APP), Production LoC, and refactor-call counts have ambiguous direction.
- A treatment run without parser-visible delegated refactor calls is an architecture-compliance failure and must be inspected before aggregation.

## Decision rule

Promote the isolated-refactor branch only if it preserves the platform's correctness floor and produces a resolved decomposition or complexity improvement that plausibly justifies its added duration, tokens, and architectural maintenance. Otherwise retain inline PTDD v1.
