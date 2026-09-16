---
id: RQ-test-list-dimensions-opus-native
question: "On native Opus 5, does an independent-dimensions cross-check in the SOL PTDD test-list phase improve external completeness without sacrificing the workflow's efficiency advantage or code quality?"
factors:
  workflow_x_prompt:
    - {workflow: exact-sol-v1.5-tcr-parity-domain-trial-cc, prompt: example-mapping}
    - {workflow: exact-sol-v1.6-test-list-dimensions-cc, prompt: example-mapping}
controls:
  model: opus-5-no-thinking
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
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - smell_total
  - code_mass
  - cc_loc
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: answered
---

# RQ-test-list-dimensions-opus-native: Independent-Dimensions Test Lists on Native Opus

## Question

Does adding a qualitative independent-dimensions cross-check to the test-list phase prevent externally incomplete implementations on native Opus 5 without erasing the current SOL PTDD workflow's efficiency advantage or changing its product shape?

This RQ isolates one prompt change:

| Cell | Test-list completion rule | Everything else |
|---|---|---|
| `exact-sol-v1.5-tcr-parity-domain-trial-cc` | every rule and example represented | unchanged PTDD, shared context, Four Rules, domain-boundary trial |
| `exact-sol-v1.6-test-list-dimensions-cc` | v1.5 plus a visible cross-check of independent dimensions, parallel catalogues, operations, and falsifying omission counterfactuals | byte-identical to v1.5 |

The v1.5 cell reuses the five runs from `RQ-current-ptdd-vs-exact-opus-native`. The v1.6 cell requires new runs. No v1.5 run is refilled or discarded.

## Motivation

One of five v1.5 runs completed normally with 59 passing internal tests but reached only 0.733 Correctness (external). Four failed verification scenarios shared one defect: Staff and Potion were present in the base-premium catalogue but absent from the independently specified insurance-value catalogue. The initial inactive test list covered Staff and Potion premiums but never exercised their insurance values.

The implementation then followed its list correctly. The failure therefore occurred at the workflow's completeness boundary: a test of one specified attribute was treated as coverage of another independently changeable attribute of the same values.

The v1.6 treatment adds a qualitative coverage-map review before `Test List Created`. It asks whether parallel catalogues or operations can drift while every planned test stays green, requires a discriminating test for independently specified entries, and explicitly rejects a mechanical Cartesian product where dimensions cannot fail independently.

## Why Claim Office

Claim Office directly contains the structure the treatment targets:

- the same item variants carry independently specified base premiums and insurance values;
- quote and policy/claim operations consume different attributes of those items;
- integration scenarios reveal catalogue omissions that unit tests can miss;
- the external verifier distinguishes internally green completeness failures from correct implementations.

A smaller kata can verify marker and execution health but cannot answer the treatment question. The completed `game-of-life-prose` runs for both v1.6 ports are smoke tests only and do not match this RQ.

## Routing — binding

Every run uses Claude Code with `opus-5-no-thinking` and the bare `claude-opus-5` API model id. `run-batch.sh` blanks the container-global Requesty variables for this native id, so Claude Code uses the mounted native Anthropic OAuth credentials. Requesty-labelled runs must never be pooled into either cell.

Model, thinking setting, provider, harness, kata, prompt style, PTDD method, context architecture, refactor guidance, stack profile, lab markers, and autonomy hardening are controls. Only the test-list completion rule varies.

## Treatment fidelity

The workflow directories must remain identical except for:

- the test-list command content;
- version/provenance metadata;
- lineage identity.

The v1.6 command adds no numerical coverage threshold and no requirement to enumerate a full cross product. It asks whether values or rules can fail independently and permits representative tests when they cannot.

Both the pi source and CC port have passed marker smokes. This RQ measures only the CC port because the motivating failure and the intended Opus recommendation are native-Claude-Code questions.

## Primary contrasts

1. **External completeness:** compare mean, minimum, and distribution of `verification_pct`. The motivating signal is whether v1.6 avoids a low-completeness tail while keeping internal tests green.
2. **Test-list behavior:** compare executable test count and Test LoC. More tests are evidence of changed coverage behavior, not automatically a product-quality win.
3. **Efficiency cost:** compare duration, tokens, and list-price estimates. The treatment is successful only if any completeness gain does not consume the efficiency advantage that motivated considering PTDD as an Opus price/performance profile.
4. **Product shape:** compare decomposition, complexity, smells, Code Mass (APP), and Production LoC. These are safeguards against the added review changing implementation style rather than only test coverage.
5. **Process behavior:** report cycles, refactor phases, and prediction accuracy. Cycle and refactor counts remain descriptive because marker-based inline phases are not architecture-neutral units of work.

## Hypotheses

- **H1 — completeness floor improves.** v1.6 removes the low Correctness (external) tail seen in v1.5 while keeping all internal suites green.
- **H2 — focused test growth.** v1.6 creates discriminating tests for independently specified catalogue and operation dimensions, increasing test coverage selectively rather than producing a mechanical cross product.
- **H3 — efficiency is retained.** Duration, tokens, and list-price estimates remain within the natural v1.5 spread; the cross-check adds review work but not another implementation architecture.
- **H4 — product shape is neutral.** Decomposition, complexity, smells, Code Mass (APP), and Production LoC remain within the observed v1.5 spread because the treatment changes test-list completeness rather than refactor guidance.
- **H5 — no resolved effect.** If v1.6 reproduces a comparable external completeness failure or merely increases tests and cost, the added cross-check is insufficient as a promotion gate.

## Interpretation rules

- Katas are never averaged; this RQ has one kata.
- Internally green but externally incomplete runs remain valid workflow outcomes, not refill candidates.
- Timeouts count toward the target and are evaluated through `completed_within_budget`.
- A single v1.6 failure is inspected for mechanism before drawing a general conclusion, but it is not removed unless caused by infrastructure rather than the workflow.
- Code-quality and efficiency trophies are correctness-gated according to the repository convention.
- Code Mass (APP), Production LoC, Test LoC, test count, cycles, and refactor phases are contextual metrics and receive no trophy when their direction is ambiguous or their constructs are not directly rankable.

## Promotion decision

This RQ can promote v1.6 as the Opus PTDD price/performance profile if it preserves near-complete external correctness without reproducing the v1.5 low tail, retains a material efficiency advantage over the existing Opus default documented in `RQ-current-ptdd-vs-exact-opus-native`, and introduces no material product-quality regression.

It does not by itself make PTDD the general Opus default. That broader decision still requires evidence beyond one large novel kata and must account for the stronger decomposition of `exact-hybrid-v2-testlist-fix-cc`.
