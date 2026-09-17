---
id: RQ-pep-emoji-claim-office
question: "Does the interaction finding from RQ-pep-emoji-v6.1 (pep+emoji reduction: anti-additivity for refactorings_applied, saturation for tests_passed_immediately, correctness invariant) also hold on a more complex kata with genuine ambiguities?"
factors:
  workflow_x_prompt:
    - {workflow: exact-hybrid-v2-testlist-fix-cc, prompt: example-mapping}  # pep + emoji (baseline)
    - {workflow: exact-hybrid-v2.1-no-pep-cc,                    prompt: example-mapping}  # no-pep + emoji
    - {workflow: exact-hybrid-v2.2-no-emoji-cc,                  prompt: example-mapping}  # pep + no-emoji
    - {workflow: exact-hybrid-v2.3-no-pep-no-emoji-cc,           prompt: example-mapping}  # neither
controls:
  model: opus-4-7-portkey-no-thinking
  kata_base: claim-office
outcomes:
  # primary: correctness (claim-office has genuine ambiguities, verification_pct scales non-trivially)
  - verification_pct
  - tests_passing
  - completed_within_budget
  # secondary: code quality
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  # TDD discipline (interaction confirmation expected if the finding is kata-stable)
  - refactorings_applied
  - cycle_count
  - predictions_correct_rate
  - tests_passed_immediately
  # cost
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-pep-emoji-claim-office: hybrid-v2 reduction series on claim-office (correctness stress test)

Does the interaction reading from [RQ-pep-emoji-v6.1](../1.3-pep-emoji-combined-v6.1/findings.md) F-1.1 also hold on claim-office — or does `exact-hybrid-v2.3-no-pep-no-emoji-cc` in particular slide into a correctness regression because of its reduced refactor activity (3.8 vs baseline 4.1 on game-of-life)?

## Motivation

RQ-pep-emoji-v6.1 showed on `game-of-life-example-mapping`:
- correctness invariant across all 4 workflows (100/100/100/100)
- discipline shift **not additive**: combined refactors *less* than the baseline (3.8 vs 4.1), combined is the *fastest* cell (-15 % wallclock)
- code quality indistinguishable (all Δ < 1σ)

These findings were recommended as "exact-hybrid-v2.1-no-pep-cc best choice for code quality research, exact-hybrid-v2.3-no-pep-no-emoji-cc best choice for speed". Before adoption into the `model-recommendation-matrix.md`, though, it has to be checked whether that stays stable on a **more complex kata**.

**Why claim-office instead of -lite:** per memory ([claim-office-lite profile](../../.claude/projects/-home-memrich-sync-workspace-agentic-coding-lab-project-main/memory/claim-office-lite.md)) lite is unsuitable for correctness research — it saturates or collapses depending on style. The full variant (15 scenarios, with cap/multi-claim) has a working `verification_pct` scale in which correctness regressions become visible. That is exactly what is needed here.

**Concrete prediction for exact-hybrid-v2.3-no-pep-no-emoji-cc:** if the "less refactor activity" reading is right, claim-office-specific ambiguities (HPSMV first-party insurance, alike components, multi-claim ordering) should be resolved worse. Expectation: `verification_pct` < 90 % vs baseline > 95 %.

## Workflow definition

All 4 workflows as defined in RQ-pep-emoji-v6.1; no new workflow files needed. Reuse of the existing v6.1-* definitions.

## Hypotheses

- **H1 (correctness invariant)**: all 4 workflows deliver statistically indistinguishable `verification_pct` (median spread < 5 pp). Consequence: the RQ-1.3 finding is kata-stable; exact-hybrid-v2.3-no-pep-no-emoji-cc cleared as a recipe recommendation.
- **H2 (no-pep-no-emoji regression)**: `exact-hybrid-v2.3-no-pep-no-emoji-cc` falls behind `v6.1-hybrid` by ≥ 10 pp in `verification_pct`. Consequence: the combination identified in RQ-1.3 as the "speed choice" is not safe on complex katas; the recommendation stays with `exact-hybrid-v2.1-no-pep-cc` or `v6.1-hybrid`.
- **H3 (discipline pattern stable)**: `refactorings_applied` and `tests_passed_immediately` show the same non-additive interaction as on game-of-life (combined refactors less than the baseline, no-pep-saturated immediate values).
- **H4 (discipline pattern kata-specific)**: on claim-office the interaction pattern inverts — combined refactors *more* than the single reductions, because ambiguities force additional iterations. Consequence: the H1 finding would be ambiguous to read.
- **H5 (code quality still indistinguishable)**: all 5 code quality metrics stay consistent within 1σ across the 4 workflows.

**A-priori expectation:** H1 + H3 (kata-stable) is the most likely scenario, because the hybrid-v2 base is correctness-robust and the mechanism from RQ-1.3 F-1.1 ("loss of the reassurance layer leads to fewer refactor subagent triggers") is not kata-specific. But claim-office has genuine ambiguities, which were identified in RQ-1 (oneshot-v1 archive) as kata-style-dependent — a correctness regression of the combined reduction cannot be ruled out.

## Design

```
Factor:  workflow_x_prompt — 4 levels (all with example-mapping)
           exact-hybrid-v2-testlist-fix-cc   (pep + emoji, baseline)
           exact-hybrid-v2.1-no-pep-cc                      (no-pep + emoji)
           exact-hybrid-v2.2-no-emoji-cc                    (pep + no-emoji)
           exact-hybrid-v2.3-no-pep-no-emoji-cc             (neither)
Control: model            — opus-4-7-portkey-no-thinking (sharded)
Control: kata_base        — claim-office

Cells:      4 (4 workflows x 1 kata)
Replicates: n = 5
Runs:       20 total, all new (no v6.1-* x claim-office runs available)
Shards:     8 (Portkey)
```

## Caveats

- **Single model, single kata (claim-office)**: the same restriction as RQ-1.3, but now with the "harder" kata, which is the actual stress test.
- **Portkey routing**: all 20 runs on `opus-4-7-portkey-no-thinking` (homogeneous) — no routing asymmetry as in RQ-1.3.
- **Verification suite (15 scenarios)**: `verification_pct` is a float 0.0-1.0, more granular than pure pass/fail. At only n=5, however, small pp differences are still within the sampling noise.
- **Predictions on claim-office**: so far an unusual kata for the prediction discipline metric. Values could be distributed differently than on game-of-life.

## Findings

See [findings.md](findings.md).

## Data source

All runs in `experiments/runs/` with
`workflow ∈ {exact-hybrid-v2-testlist-fix-cc, exact-hybrid-v2.1-no-pep-cc, exact-hybrid-v2.2-no-emoji-cc, exact-hybrid-v2.3-no-pep-no-emoji-cc}`,
`kata = claim-office-example-mapping`,
`model = opus-4-7-portkey-no-thinking`.
