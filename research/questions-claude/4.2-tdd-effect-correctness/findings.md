# RQ-tdd-correctness Findings

Kata: `claim-office-example-mapping` (novel). Model: `opus-4-7-no-thinking` (Portkey OR direct, OR-match). 5 TDD workflow variants, n=22 runs. v8a/v8b (non-TDD control group) still without runs.

## Overview — Correctness per Workflow

🏆 = best value per column (also multiple times in case of a tie). `verification_pct`/`tests_passing`: higher = better.

| Workflow | n | `verification_pct` (mean ± std) | `verification_passed` / 15 (min – max) | `tests_passing` |
|---|---:|---|---|---|
| v3-basic-tdd                  | 5 | **1.00 ± 0** 🏆    | 15 – 15 | **100 %** 🏆 |
| v4.1-testlist-scope-fix       | 5 | 0.96 ± 0.09        | 12 – 15 | **100 %** 🏆 |
| v5.1-testlist-scope-fix       | 6 | **1.00 ± 0** 🏆    | 15 – 15 | **100 %** 🏆 |
| v6.1-hybrid-…                 | 3 | **1.00 ± 0** 🏆    | 15 – 15 | **100 %** 🏆 |
| v7.1-hybrid-green-refactor-…  | 3 | 0.98 ± 0.04        | 14 – 15 | **100 %** 🏆 |

`completed_within_budget` is 100 % in all cells.

## F-tdd-correctness.1 — Three of Five TDD Workflows Solve claim-office Perfectly; v4.1 and v7.1 Lose Isolated Scenarios

On the novel claim-office kata that is not contained in the training data, v3 (n=5), v5.1 (n=6) and v6.1 (n=3) reach the full acceptance suite (15/15 verification scenarios) in every single run. v4.1 shows one outlier (4/5 runs perfect, 1 run at 12/15 → 0.96), v7.1 a smaller one (2/3 runs perfect, 1 run at 14/15 → 0.98). Notably: the two workflows with an isolated green subagent (v4.1, v7.1) each carry one correctness outlier; the three workflows with green in the shared context (v3, v5.1, v6.1) are perfect. Plausible mechanic: an isolated green subagent sees neither the test-list discussion nor earlier cycle discussions and can overlook edge cases that are implicitly present in the shared context.

Hypothesis H1 ("phase-structured workflows reach higher correctness than minimal TDD") is therefore not confirmed — minimal TDD (v3) is on a par with the structured workflows. H3 (null hypothesis: all workflows similarly high >0.8) is confirmed.

## F-tdd-correctness.2 — v4.1 Reaches Correctness Only via Drastically Higher Effort per Cycle

The effort profiles per workflow. 🏆 = best value per column. Directions: `predictions_correct_rate` higher = better; `duration_seconds`/`total_tokens`/`tests_passed_immediately` lower = better; `cycle_count` and `refactorings_applied` are ambivalent (no trophy).

| Workflow | `cycle_count` | `refactorings_applied` | `predictions_correct_rate` | `tests_passed_immediately` | `duration_seconds` | `total_tokens` |
|---|---:|---:|---:|---:|---:|---:|
| v3-basic-tdd                  |  3.8 |  1.8 |   —             | **0.6** 🏆 | **312** 🏆 | **3.28 M** 🏆 |
| v4.1-testlist-scope-fix       | 44.6 |  6.8 |  92.9 %         | 22.2 | 3 229 | 14.10 M |
| v5.1-testlist-scope-fix       |  5.5 |  2.2 | **100.0 %** 🏆  |  1.7 |   641 | 18.73 M |
| v6.1-hybrid-…                 | 24.7 | 10.7 |  94.9 %         | 13.0 | 1 424 | 30.16 M |
| v7.1-hybrid-green-refactor-…  | 18.3 | 14.0 | **100.0 %** 🏆  |  6.3 | 1 970 | 26.11 M |

v4.1 runs on average **44.6 TDD cycles** per run (vs. 3.8 for v3, 5.5 for v5.1), at comparable correctness. The wallclock is at ~54 min per run against ~10 min for v5.1 and ~5 min for v3. Tokens 14 M (v4.1) vs. 3.3 M (v3). Despite this effort, v4.1 is the only setup with a 0.8 outlier.

v6.1 and v7.1 both run considerably more refactor steps than v5.1 (10.7 / 14.0 vs. 2.2) — the isolated refactor subagent visibly "works" more; v7.1 reaches the highest refactor rate of all workflows. Despite the hybrid constructions, both pay for stability, not for a better correctness mean.

## F-tdd-correctness.3 — The Predictions Rate Comparison Is Distorted by an Unequal Prediction Base

`predictions_correct_rate` is at 100 % for v5.1 (39/39) and v7.1 (99/99), 94.9 % for v6.1 (131/138), 92.9 % for v4.1 (302/325). The denominators differ drastically: v5.1 ~6.5, v7.1 ~33, v6.1 ~46, v4.1 ~65 predictions/run. The predictions rate here does not primarily measure discipline but is dominated by the task size per cycle — v4.1 decomposes most finely and uses more predictions, thereby also having more opportunities for errors.

Hypothesis H3 from RQ-tdd-quality ("v4.1 has higher prediction_accuracy") is not confirmed under this reading. The comparison only becomes robust once the predictions are normalized per cycle — currently not directly derivable from the metrics.

## F-tdd-correctness.4 — The Wallclock Range Is 10×, the Token Range 9×; No Correlation with Correctness

Across the five TDD workflows:

- cheapest workflow by tokens: **v3 (3.28 M)** — at 100 % correctness
- cheapest workflow by wallclock: **v3 (5 min)**
- most expensive workflow by tokens: **v6.1 (30.16 M, σ=18.6 M)** — at 100 % correctness
- most expensive workflow by wallclock: **v4.1 (54 min, σ=15 min)** — at 0.96 correctness

v7.1 slots in the middle (33 min wallclock, 26 M tokens, 0.98 correctness). For claim-office under Opus 4.7, correctness is not a scarce good; the workflow choice determines almost exclusively effort and spread. v3 dominates the correctness-per-token rating on this kata. Structured workflows do not justify themselves on claim-office through correctness — their value lies in code quality (see RQ-context F-context.1/2 for the complexity and smell differences on the same kata).
