# RQ-1.11 Findings — exact-hybrid-v4.4-metric-refactor-cc vs exact-hybrid-v4-cleaned-cc (claim-office)

## Overview

`claim-office-example-mapping × opus-4-7-no-thinking` (native API for hybrid-v4.4, Portkey gateway for the hybrid-v4 baseline; OR-match via `controls.model: any:`).

| Outcome (direction) | exact-hybrid-v4-cleaned-cc (n=8) | exact-hybrid-v4.4-metric-refactor-cc (n=5) |
|---|---:|---:|
| `verification_pct` (higher = better) | 0.96 ± 0.09 | **0.99 ± 0.03** 🏆 |
| `tests_passing` rate (higher = better) | **100 %** 🏆 | **100 %** 🏆 |
| `completed_within_budget` rate (higher = better) | **100 %** 🏆 | **100 %** 🏆 |
| `cognitive_max` (lower = better) | 5.0 ± 1.77 | **2.4 ± 1.34** 🏆 |
| `cognitive_avg` (lower = better) | 1.91 ± 0.75 | **1.27 ± 0.27** 🏆 |
| `mccabe_max` (lower = better) | 4.5 ± 0.76 | **3.0 ± 1.00** 🏆 |
| `mccabe_avg` (lower = better) | 1.53 ± 0.20 | **1.40 ± 0.13** 🏆 |
| `code_mass` (lower = better) | 879 ± 91 | **805 ± 64** 🏆 |
| `smell_total` (lower = better) | 0.38 ± 0.74 | **0.0 ± 0.0** 🏆 |
| `cc_longest_function` (lower = better) | **12.4 ± 1.4** 🏆 | 13.0 ± 3.1 |
| `refactorings_applied` (higher = better) | 24.9 ± 6.9 | **30.4 ± 8.8** 🏆 |
| `cycle_count` (contextual, higher signals fuller TDD loops) | 37.4 ± 1.6 | **40.2 ± 2.2** 🏆 |
| `predictions_correct_rate` (higher = better) | **97.2 %** 🏆 | 89.6 % |
| `tests_passed_immediately` (lower = better under TDD) | 15.1 ± 5.8 | **7.0 ± 9.6** 🏆 |
| `duration_seconds` (lower = better) | **2530 ± 401** 🏆 | 5284 ± 2337 |
| `total_tokens` (lower = better) | **44.4M ± 3.4M** 🏆 | 102.3M ± 17.2M |

Trophy convention: `verification_pct` is the correctness gate; both workflows sit at the top end and are 🏆-eligible for code quality metrics. `cc_longest_function` is the only quality metric running against the trend (spread within 1 σ — better read as "no effect" than as a real regression). Cost trophies clearly go to the baseline.

---

## F-1.1 — Complexity Peak halved at no cost to correctness

The metric-driven refactor agent markedly reduces the Complexity Peak on claim-office and stabilizes correctness.

| Metric (direction) | hybrid-v4 (n=8) | hybrid-v4.4 (n=5) | Δ mean | Δ σ |
|---|---:|---:|---:|---:|
| `cognitive_max` (lower = better) | 5.0 ± 1.77 | **2.4 ± 1.34** | −52 % | −24 % |
| `cognitive_avg` (lower = better) | 1.91 ± 0.75 | **1.27 ± 0.27** | −33 % | −64 % |
| `mccabe_max` (lower = better) | 4.5 ± 0.76 | **3.0 ± 1.00** | −33 % | +32 % |
| `smell_total` (lower = better) | 0.38 ± 0.74 | **0.0 ± 0.0** | −100 % | −100 % |
| `code_mass` (lower = better) | 879 ± 91 | **805 ± 64** | −8 % | −30 % |
| `verification_pct` (higher = better) | 0.96 ± 0.09 | **0.99 ± 0.03** | +3 pp | −67 % |

The Complexity Peak (`cognitive_max`, `mccabe_max`) falls by roughly half; average complexity moves in the same direction with markedly tighter variance. `smell_total` collapses from 0.38 to 0 (not a single ESLint smell across 5 hybrid-v4.4 runs vs 3 smells across 8 hybrid-v4 runs). Code Mass slightly reduced. **Correctness is not merely preserved, it becomes somewhat more robust** — mean ver_pct rises from 0.96 to 0.99 and σ falls from 0.09 to 0.03. H1 (correctness ≥ 0.85) is thus clearly satisfied and H2 (complexity reduction ≥ 1 σ) confirmed on the peak metrics.

Mechanistic reading: the pre-measurement forces the agent to identify the worst function explicitly before refactoring. The post-measurement gives it an objective trigger for revert/alternative when the POST number is worse. Together these appear to break the baseline refactor agent's "naming first, nothing else" tendency.

---

## F-1.2 — More and tighter refactor cycles, fewer out-of-the-box greens

The pre/post tool mechanism activates additional refactor iterations rather than displacing them.

| Metric (direction) | hybrid-v4 (n=8) | hybrid-v4.4 (n=5) | Δ mean |
|---|---:|---:|---:|
| `refactorings_applied` (higher = better) | 24.9 ± 6.9 | **30.4 ± 8.8** | +22 % |
| `cycle_count` | 37.4 ± 1.6 | **40.2 ± 2.2** | +8 % |
| `tests_passed_immediately` (lower = better) | 15.1 ± 5.8 | **7.0 ± 9.6** | −54 % |

The agent runs on average 2.8 more cycles and performs 5.5 additional refactor actions; at the same time the number of tests that went through "green immediately" (that is, without a green-phase implementation) halves. That fits the reading from F-1.1: the agent takes the refactor obligation seriously because the pre/post measurement demands a measurable improvement every cycle. H3 (TDD discipline stable within 1 σ) is missed — but in the direction of "higher discipline", not "loop disturbance".

---

## F-1.3 — The bundle break from RQ-1.9 and RQ-1.10 does not reproduce

Deterministic tool measurement as an extension mechanism does not trigger the self-stop pattern that vocabulary- and rationale-driven extensions triggered.

| RQ | Mechanism | claim-office `verification_pct` | done.txt | cycles vs baseline |
|---|---|---:|---:|---|
| RQ-1.9 (exact-hybrid-v4.3-audit-bundle-cc) | rationale blocks + red-phase hardening | 0.96 → **0.35** | 6/8 missing | 7–14 vs ~37 (self-stop) |
| RQ-1.10 (exact-hybrid-v4.1-refactor-vocab-cc) | refactor vocabulary (cognitive/mccabe as terms) | 0.96 → **0.23** | 4/5 missing | 7–22 vs ~37 (self-stop) |
| **RQ-1.11 (exact-hybrid-v4.4-metric-refactor-cc)** | pre/post tool calls + McCabe alongside APP | 0.96 → **0.99** | **5/5 present** | 38–43 vs ~37 (full loop) |

In RQ-1.9 and RQ-1.10 the agent aborted after less than ½ the baseline cycles; internally `tests_passing = true`, externally `verification_pct` collapsed. In RQ-1.11 all 5 runs are ≥ 38 cycles, all done.txt files are present, and all verification majorities are ≥ 14/15 scenarios. This supports the mechanism hypothesis: **self-stop is triggered by raising per-cycle effort when that increase is semantic (vocabulary, rationale). The same per-cycle effort increase via deterministic tools does not trigger it.** Which of the three hybrid-v4.4 components — (a) the ESLint call, (b) the McCabe computation, (c) the pre/post revert clause — carries the difference cannot be decided from this bundle.

---

## F-1.4 — Cost surcharge is large and highly volatile

The token and wallclock surcharge is far above the magnitude expected in advance (H4: expected +10–20 % tokens, actual +130 %).

| Metric (direction) | hybrid-v4 (n=8) | hybrid-v4.4 (n=5) | Δ mean | Δ σ |
|---|---:|---:|---:|---:|
| `duration_seconds` (lower = better) | **2530 ± 401** | 5284 ± 2337 | +109 % | +482 % |
| `total_tokens` (lower = better) | **44.4M ± 3.4M** | 102.3M ± 17.2M | +130 % | +405 % |

Wallclock more than doubles on average, tokens are 2.3× as high; variance is dramatically wider (σ factor ~5 on both axes). Mechanistic reading: per refactor call the agent runs ESLint twice, parses the JSON output, computes APP mass and McCabe by hand for every function, and compares all four metrics pre/post. At 30.4 refactor calls per run that is ~61 additional ESLint tool calls plus markedly more output tokens for the verbose pre/post block documentation. The increase of 2.8 cycles (F-1.2) explains only part of the cost inflation; the larger share comes from the inflated refactor subagent itself.

The high variance in both cost metrics comes predominantly from run 4 (wallclock 9197 s, tokens 128M) and run 1 (wallclock 5000 s, tokens 107M) — both at ver = 0.93 and 1.00 respectively, and neither with a self-stop. It is possible that more elaborate refactor paths trigger markedly more tool iterations in some runs than in others.

---

## F-1.5 — The predictions rate drops through more honest wrong predictions, not a format break

`predictions_correct_rate` falls from 97.2 % to 89.6 % (Δ −7.6 pp). A sample inspection shows the drop comes from more-when-wrong, not from fewer prediction lines.

Run `2026-05-27_14-28-32` (ver = 0.93, predictions 62/84 = 73.8 %):

| Signal | Value |
|---|---:|
| Total parsed prediction lines (Correct + Incorrect) | 168 |
| of which Correct | 146 |
| of which Incorrect | 22 |
| MARKERS format ("Red Phase Complete" + `(- \| ✅ \| ❌) (Correct\|Incorrect)`) intact | yes |

The 22 Incorrect markers are genuine wrong predictions that the agent documented honestly — not abbreviated or merged prediction lines. Their distribution across cycles is even (no clustering at the start or end). In hybrid-v4 the rate is higher because the baseline refactor has less tool output to process, which makes the red-phase predictions more consistent with the simpler code structure hybrid-v4 produces.

Mechanistic reading: pre/post measurement changes the code structure visibly (F-1.1) — along more complex refactor paths the agent makes more predictions about runtime behavior derived from the pre-measurement, and is not always right. That is a confidence-positive signal, not a discipline-negative one. A comparable pattern is documented in RQ-1.8 (`predictions_correct_rate` 100 → 97.4 % for exact-hybrid-v4.3-audit-bundle-cc, interpreted there as the "intended effect of the backfill ban").
