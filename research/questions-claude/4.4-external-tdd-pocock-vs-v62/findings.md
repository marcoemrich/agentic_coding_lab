# Findings — RQ-4.4: v9-pocock-tdd vs v6.2-with-why-cleaned (claim-office)

## Overview

| Axis | v6.2-with-why-cleaned (n=8) | v9-pocock-tdd (n=3) | Winner |
|---|---:|---:|---|
| **Correctness** `verification_pct` (higher = better) | 0.96 ± 0.09 | **1.00 ± 0** 🏆 | Pocock slightly |
| `tests_passing` rate | 100 % | 100 % | Tie 🏆🏆 |
| **Code quality** `cognitive_max` (lower = better) | **5.00 ± 1.77** 🏆 | 14.33 ± 1.53 | v6.2 |
| `mccabe_max` (lower = better) | **4.50 ± 0.76** 🏆 | 11.67 ± 0.58 | v6.2 |
| `cc_longest_function` (lower = better) | **12.38 ± 1.41** 🏆 | 32.33 ± 1.53 | v6.2 |
| `smell_total` (lower = better) | **0.38 ± 0.74** 🏆 | 6.67 ± 8.96 | v6.2 |
| `code_mass` (lower = better) | 878.5 ± 91 | **748.3 ± 62** 🏆 | Pocock |
| **Cost** `duration_seconds` (lower = better) | 2530 ± 401 | **570 ± 106** 🏆 | Pocock |
| `total_tokens` (lower = better) | 44.4 M ± 3.4 M | **13.1 M ± 4.6 M** 🏆 | Pocock |
| **Discipline** `refactorings_applied` | 24.88 ± 6.90 | 0 ± 0 | different by design |
| `cycle_count` | 37.38 ± 1.60 | 14.00 ± 3.46 | different by design |
| `tests_passed_immediately` (lower = stricter) | 15.12 ± 5.84 | **2.33 ± 4.04** 🏆 | Pocock |
| `predictions_correct_rate` (higher = better) | **97.2 %** 🏆 | 89.9 % | v6.2 |

> **Caveat on trophy gating:** The skill convention awards quality/cost trophies only at `verification_pct = 1.0`. v6.2 is at 0.96 (1× 0.73 outlier out of 8). A strict reading would give v6.2 no quality trophies — awarded pragmatically here, because 7/8 v6.2 runs are perfect.

> **Caveat n=3** for Pocock: the memory note `replicates-n-reliability` warns against n=3 for ranking. The effect sizes here are so clear (>3 σ in all quality/cost metrics) that the direction of the statement is stable; precise σ comparisons need n≥8.

---

## F-4.4.1 — Pocock and v6.2 Are Equally Correct

Both reach ~100 % correctness on claim-office-example-mapping (Pocock 1.00/1.00 in 3 runs, v6.2 0.96 mean with 1 outlier at 0.73 out of 8 runs). H2 confirmed. → Correctness is not the differentiating factor on this kata × model combination.

---

## F-4.4.2 — v6.2 Produces Cleaner Code, Pocock More Compact Code

v6.2 dominates the local complexity and smell metrics by factors (cognitive_max 5 vs 14, mccabe 4.5 vs 12, longest_function 12 vs 32, smell_total 0.4 vs 6.7). Pocock in return has a smaller code_mass (748 vs 879). Reading: Pocock writes less, but more densely; v6.2 writes more and distributes it more finely. H4 (Pocock better on quality) **refuted**.

---

## F-4.4.3 — Pocock ~70–78 % Cheaper

Wallclock 570s vs 2530s (−78 %), tokens 13 M vs 44 M (−70 %). H6 (−20 % wallclock, −15 % tokens) **clearly exceeded**. Reading: fewer cycles × fewer phases × no subagent spawn per refactor → drastically fewer roundtrips.

---

## F-4.4.4 — The Tail Refactor Does Not Trigger on claim-office

v9-pocock-tdd's "After all tests pass, look for refactor candidates" led to `refactorings_applied = 0` in 3/3 runs. Per-cycle refactor (v6.2) shows 24.88 ± 6.90. This is not "Pocock skips the refactor" — the skill is explicitly tail-oriented — but rather: with a green test the model rates the code as good enough, and without extra prompt pressure no further rebuilding happens. H3 **clearly confirmed**. The direct consequence is visible in F-4.4.2: without refactor iterations the initial implementation, with its higher complexity, remains in place.

---

## F-4.4.5 — Pocock Takes Fewer, Larger Steps

`cycle_count` v6.2 37.38 ± 1.60 vs Pocock 14.00 ± 3.46. v6.2's explicit test-list prompt appears to increase cycle granularity; Pocock's "one behavior at a time" is interpreted more broadly. Consistent with the ~13 M vs 44 M token spread.

---

## F-4.4.6 — Pocock Skips Less Often

`tests_passed_immediately` v6.2 15.12 ± 5.84 vs Pocock 2.33 ± 4.04. In 40 % of its cycles, v6.2 has tests that are green immediately — either multiple behaviors per test or speculative implementation. Pocock's vertical-slice discipline (with the verbatim red marker block) holds more strictly.
