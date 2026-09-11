# RQ-tdd-correctness Findings

Kata: `claim-office-example-mapping` (novel). Model: `opus-4-7-no-thinking` (Portkey OR direct, OR-match). 5 TDD workflow variants, n=22 runs. end-refactor-only-v1-agent/end-refactor-only-v1-native (non-TDD control group) still without runs.

## Overview — Correctness per Workflow

🏆 = best value per column (also multiple times in case of a tie). `verification_pct`/`tests_passing`: higher = better.

| Workflow | n | `verification_pct` (mean ± std) | `verification_passed` / 15 (min – max) | `tests_passing` |
|---|---:|---|---|---|
| baseline-inline-tdd-v1-cc                  | 5 | **1.00 ± 0** 🏆    | 15 – 15 | **100 %** 🏆 |
| exact-subagents-v2-testlist-fix-cc       | 5 | 0.96 ± 0.09        | 12 – 15 | **100 %** 🏆 |
| exact-single-context-v2-testlist-fix-cc       | 6 | **1.00 ± 0** 🏆    | 15 – 15 | **100 %** 🏆 |
| v6.1-hybrid-…                 | 3 | **1.00 ± 0** 🏆    | 15 – 15 | **100 %** 🏆 |
| v7.1-hybrid-green-refactor-…  | 3 | 0.98 ± 0.04        | 14 – 15 | **100 %** 🏆 |

`completed_within_budget` is 100 % in all cells.

## F-tdd-correctness.1 — Three of Five TDD Workflows Solve claim-office Perfectly; subagents-v2 and green-refactor-v2 Lose Isolated Scenarios

On the novel claim-office kata that is not contained in the training data, inline-tdd-v1 (n=5), single-context-v2 (n=6) and hybrid-v2 (n=3) reach the full acceptance suite (15/15 verification scenarios) in every single run. subagents-v2 shows one outlier (4/5 runs perfect, 1 run at 12/15 → 0.96), green-refactor-v2 a smaller one (2/3 runs perfect, 1 run at 14/15 → 0.98). Notably: the two workflows with an isolated green subagent (subagents-v2, green-refactor-v2) each carry one correctness outlier; the three workflows with green in the shared context (inline-tdd-v1, single-context-v2, hybrid-v2) are perfect. Plausible mechanic: an isolated green subagent sees neither the test-list discussion nor earlier cycle discussions and can overlook edge cases that are implicitly present in the shared context.

Hypothesis H1 ("phase-structured workflows reach higher correctness than minimal TDD") is therefore not confirmed — minimal TDD (inline-tdd-v1) is on a par with the structured workflows. H3 (null hypothesis: all workflows similarly high >0.8) is confirmed.

## F-tdd-correctness.2 — subagents-v2 Reaches Correctness Only via Drastically Higher Effort per Cycle

The effort profiles per workflow. 🏆 = best value per column. Directions: `predictions_correct_rate` higher = better; `duration_seconds`/`total_tokens`/`tests_passed_immediately` lower = better; `cycle_count` and `refactorings_applied` are ambivalent (no trophy).

| Workflow | `cycle_count` | `refactorings_applied` | `predictions_correct_rate` | `tests_passed_immediately` | `duration_seconds` | `total_tokens` |
|---|---:|---:|---:|---:|---:|---:|
| baseline-inline-tdd-v1-cc                  |  3.8 |  1.8 |   —             | **0.6** 🏆 | **312** 🏆 | **3.28 M** 🏆 |
| exact-subagents-v2-testlist-fix-cc       | 44.6 |  6.8 |  92.9 %         | 22.2 | 3 229 | 14.10 M |
| exact-single-context-v2-testlist-fix-cc       |  5.5 |  2.2 | **100.0 %** 🏆  |  1.7 |   641 | 18.73 M |
| v6.1-hybrid-…                 | 24.7 | 10.7 |  94.9 %         | 13.0 | 1 424 | 30.16 M |
| v7.1-hybrid-green-refactor-…  | 18.3 | 14.0 | **100.0 %** 🏆  |  6.3 | 1 970 | 26.11 M |

subagents-v2 runs on average **44.6 TDD cycles** per run (vs. 3.8 for inline-tdd-v1, 5.5 for single-context-v2), at comparable correctness. The wallclock is at ~54 min per run against ~10 min for single-context-v2 and ~5 min for inline-tdd-v1. Tokens 14 M (subagents-v2) vs. 3.3 M (inline-tdd-v1). Despite this effort, subagents-v2 is the only setup with a 0.8 outlier.

hybrid-v2 and green-refactor-v2 both run considerably more refactor steps than single-context-v2 (10.7 / 14.0 vs. 2.2) — the isolated refactor subagent visibly "works" more; green-refactor-v2 reaches the highest refactor rate of all workflows. Despite the hybrid constructions, both pay for stability, not for a better correctness mean.

## F-tdd-correctness.3 — The Predictions Rate Comparison Is Distorted by an Unequal Prediction Base

`predictions_correct_rate` is at 100 % for single-context-v2 (39/39) and green-refactor-v2 (99/99), 94.9 % for hybrid-v2 (131/138), 92.9 % for subagents-v2 (302/325). The denominators differ drastically: single-context-v2 ~6.5, green-refactor-v2 ~33, hybrid-v2 ~46, subagents-v2 ~65 predictions/run. The predictions rate here does not primarily measure discipline but is dominated by the task size per cycle — subagents-v2 decomposes most finely and uses more predictions, thereby also having more opportunities for errors.

Hypothesis H3 from RQ-tdd-quality ("subagents-v2 has higher prediction_accuracy") is not confirmed under this reading. The comparison only becomes robust once the predictions are normalized per cycle — currently not directly derivable from the metrics.

## F-tdd-correctness.4 — The Wallclock Range Is 10×, the Token Range 9×; No Correlation with Correctness

Across the five TDD workflows:

- cheapest workflow by tokens: **inline-tdd-v1 (3.28 M)** — at 100 % correctness
- cheapest workflow by wallclock: **inline-tdd-v1 (5 min)**
- most expensive workflow by tokens: **hybrid-v2 (30.16 M, σ=18.6 M)** — at 100 % correctness
- most expensive workflow by wallclock: **subagents-v2 (54 min, σ=15 min)** — at 0.96 correctness

green-refactor-v2 slots in the middle (33 min wallclock, 26 M tokens, 0.98 correctness). For claim-office under Opus 4.7, correctness is not a scarce good; the workflow choice determines almost exclusively effort and spread. inline-tdd-v1 dominates the correctness-per-token rating on this kata. Structured workflows do not justify themselves on claim-office through correctness — their value lies in code quality (see RQ-context F-context.1/2 for the complexity and smell differences on the same kata).
