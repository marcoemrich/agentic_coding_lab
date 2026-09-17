# RQ-1.7: exact-hybrid-v4-cleaned-cc vs exact-hybrid-v3-with-why-cc (game-of-life)

## Overview

Baseline (`exact-hybrid-v3-with-why-cc`, n=5) vs. cleaned (`exact-hybrid-v4-cleaned-cc`, n=5) on `game-of-life-example-mapping × opus-4-7-portkey-no-thinking`. Directions: ↑ = higher = better, ↓ = lower = better.

| Metric | Direction | exact-hybrid-v3-with-why-cc | exact-hybrid-v4-cleaned-cc |
|---|---|---:|---:|
| `tests_passing` rate (Correctness (internal)) | ↑ | **100 %** 🏆 | **100 %** 🏆 |
| `completed_within_budget` rate | ↑ | **100 %** 🏆 | **100 %** 🏆 |
| `predictions_correct_rate` (pooled) | ↑ | 98.8 % | **100 %** 🏆 |
| `refactorings_applied` mean | ↑ | 6.40 (σ 3.21) | **7.80** 🏆 (σ 2.17) |
| `tests_passed_immediately` mean | — | 2.20 (σ 3.03) | 1.40 (σ 3.13) |
| `cycle_count` mean (σ) | — | 8.40 (σ 0.55) | 9.00 (σ 0.71) |
| `code_mass` mean | ↓ | 151.0 (σ 11) | **148.8** 🏆 (σ 10) |
| `smell_total` mean | ↓ | 2.80 (σ 0.84) | **2.60** 🏆 (σ 0.55) |
| `cc_longest_function` mean (σ, max) | ↓ | **9.40** 🏆 (σ 8.29, max 22) | **9.40** 🏆 (σ 6.80, max 18) |
| `cognitive_max` mean (σ, max) | ↓ | 4.80 (σ 5.81, max 15) | **2.80** 🏆 (σ 1.10, max 4) |
| `mccabe_max` mean (σ, max) | ↓ | 4.60 (σ 3.13, max 10) | **3.60** 🏆 (σ 1.14, max 5) |
| `duration_seconds` mean | ↓ | **569** 🏆 | 644 (+13 %) |
| `total_tokens` mean | ↓ | **7.56 M** 🏆 | 8.67 M (+15 %) |

Reading in two sentences: the RQ-1.6 recommendation generalizes to GoL — hybrid-v4 is correctness-equivalent (both 100/100), shows a **marked improvement in Complexity Peak** (`cognitive_max` −42 % mean, σ −81 %; `mccabe_max` −22 % mean, σ −64 %) and a moderate discipline drift (+22 % refactorings). The cost surcharge of +13 %/+15 % is in the same range as on claim-office.

---

## F-1.1 — Cleanup equivalence generalizes: no correctness regression on GoL

**Statement.** On game-of-life-example-mapping, correctness stays invariant between exact-hybrid-v3-with-why-cc and exact-hybrid-v4-cleaned-cc: `tests_passing` 100 %/100 %, `completed_within_budget` 100 %/100 %, `predictions_correct_rate` 98.8 % / 100 %. This repeats the cleanup equivalence picture from RQ-1.6 (claim-office) — both main finding axes stay stable in the cross-kata validation.

**Data (n=5 per cell).**

| Metric | exact-hybrid-v3-with-why-cc | exact-hybrid-v4-cleaned-cc |
|---|---|---|
| `tests_passing` | 5/5 (100 %) | 5/5 (100 %) |
| `completed_within_budget` | 5/5 (100 %) | 5/5 (100 %) |
| `predictions_correct_rate` | 98.8 % (83/84) | 100.0 % (90/90) |

**Rationale.** H0 (equivalence on GoL) confirmed. As expected, `verification_pct` is not informative on GoL because internal vitest tests are the only correctness source — both workflows reach 100 %. The difference in prediction rate (98.8 % → 100 %) is statistically within the noise (1 wrong prediction for hybrid-v2 across 84 predictions), but directionally consistent with the RQ-1.6 finding. H1 (kata-specific cleanup effect) is thus clearly refuted on the correctness axis.

---

## F-1.2 — Complexity Peak collapses: cognitive_max −42 %, mccabe_max −22 %, spread sharply capped

**Statement.** exact-hybrid-v4-cleaned-cc markedly reduces the Complexity Peak on GoL relative to exact-hybrid-v3-with-why-cc. `cognitive_max` falls in the mean from 4.80 to 2.80 (−42 %) with a spread reduction from σ 5.81 to σ 1.10 (−81 %); `mccabe_max` falls from 4.60 to 3.60 (−22 %) with σ 3.13 → σ 1.14 (−64 %). The maxima drop accordingly (cognitive_max 15 → 4, mccabe_max 10 → 5).

**Data (n=5 per cell).**

| Metric (↓ = better) | exact-hybrid-v3-with-why-cc | exact-hybrid-v4-cleaned-cc | Δ |
|---|---:|---:|---|
| `cognitive_max` mean / σ / max | 4.80 / 5.81 / 15 | **2.80 / 1.10 / 4** | −42 % mean, σ −81 % |
| `mccabe_max` mean / σ / max | 4.60 / 3.13 / 10 | **3.60 / 1.14 / 5** | −22 % mean, σ −64 % |
| `cc_longest_function` mean / σ / max | 9.40 / 8.29 / 22 | 9.40 / 6.80 / 18 | = mean, σ −18 %, max −18 % |

**Rationale.** The spread collapse pattern is striking: exact-hybrid-v3-with-why-cc occasionally produces heavy outlier runs (cognitive_max=15, mccabe_max=10, longest=22), hybrid-v4 does not. Mechanistically plausible: the +22 % refactorings (see F-1.3) drive the distribution of complexity peaks downward. The same pattern was documented in RQ-1.5 for exact-hybrid-v3-with-why-cc vs v6.1-hybrid on claim-office (σ −82–90 % on Complexity Peak) and recurs here in the next reduction iteration.

`code_mass` (151.0 → 148.8) and `smell_total` (2.8 → 2.6) show small improvements within the noise — no degradation as on claim-office, where `code_mass` rose +14 %. On the training-known GoL kata, hybrid-v4 therefore tends to produce *more consistent and slightly smaller* implementations, while on claim-office the Code Mass (APP) grows slightly (more tests implemented completely).

---

## F-1.3 — Discipline drift carries over to GoL: +22 % refactorings (claim-office: +34 %)

**Statement.** exact-hybrid-v4-cleaned-cc refactors +22 % more often on GoL than exact-hybrid-v3-with-why-cc (6.40 → 7.80 mean, σ 3.21 → 2.17). The absolute effect is smaller than on claim-office (+34 %), but the direction is the same. `cycle_count` is nearly identical (8.40 → 9.00), and `tests_passed_immediately` falls from 2.20 to 1.40 (more tests are actually produced in Red instead of going green directly).

**Data (n=5 per cell).**

| Metric (↑ = better for discipline) | exact-hybrid-v3-with-why-cc | exact-hybrid-v4-cleaned-cc | Δ |
|---|---:|---:|---|
| `refactorings_applied` mean / σ | 6.40 / 3.21 | **7.80 / 2.17** | +22 % mean, σ −32 % |
| `cycle_count` mean / σ / range | 8.40 / 0.55 / 8–9 | 9.00 / 0.71 / 8–10 | +7 % |
| `tests_passed_immediately` mean | 2.20 | 1.40 | −36 % (discipline improvement) |
| `predictions_correct_rate` | 98.8 % | **100 %** | +1.2 pp |

**Rationale.** H1 (kata-specific cleanup effect) is refuted on the discipline axis as well — the refactor.md decoupling effect is not claim-office-specific but also produces additional refactor subagent spawns on GoL. The smaller effect size (+22 % vs +34 %) is plausible: GoL has fewer cycles (mean 9 vs 37 on claim-office), hence fewer absolute iterations in which the drift can build up.

The `tests_passed_immediately` reduction (2.20 → 1.40, −36 %) shows that hybrid-v4 stays *stricter in Red* — more tests actually go red before the Green skill makes them pass. This is a qualitative discipline gain that was not visible in RQ-1.6 on claim-office (both were at ~15 there).

---

## F-1.4 — Cost surcharge consistent: +13 % wallclock, +15 % tokens

**Statement.** hybrid-v4 costs +75 s wallclock (+13 %) and +1.10 M tokens (+15 %) per run on GoL. The surcharge is in the same range as on claim-office (+13 % / +12 % in RQ-1.6).

**Data (n=5 per cell).**

| Metric (↓ = better) | exact-hybrid-v3-with-why-cc | exact-hybrid-v4-cleaned-cc | Δ |
|---|---:|---:|---|
| `duration_seconds` mean | **569** 🏆 (σ 171) | 644 (σ 140) | +13 % |
| `total_tokens` mean | **7.56 M** 🏆 (σ 1.88 M) | 8.67 M (σ 1.57 M) | +15 % |
| `cycle_count` mean | 8.40 | 9.00 | +7 % |
| `total_tokens / cycle` (≈) | 0.90 M | 0.96 M | +7 % |

**Rationale.** H2 (cost equivalence on GoL) is refuted — hybrid-v4 is noticeably more expensive on GoL as well. The cost surcharge per cycle, at +7 % tokens/cycle, is higher than on claim-office (+5 %), but still small. As on claim-office, the spread drops for both `duration_seconds` (σ 171 → 140) and `total_tokens` (σ 1.88 M → 1.57 M) — hybrid-v4 is more consistent in cost, which is an operational advantage for wallclock budgeting.

---

## Hypothesis status

| Hypothesis | Status | Evidence |
|---|---|---|
| **H0** Cleanup equivalence on GoL | confirmed | correctness 100/100, discipline/code quality drift in the same direction as on claim-office |
| **H1** Kata-specific cleanup effect | clearly refuted | +22 % refactorings on GoL (vs +34 % on claim-office), same direction; code quality on GoL improved even more strongly (cognitive_max −42 %) |
| **H2** Cost equivalence on GoL | refuted | +13 % wallclock, +15 % tokens — almost identical to the claim-office difference |

## Consequences

1. **The exact-hybrid-v4-cleaned-cc recommendation holds for GoL.** The default baseline established in RQ-1.6 is behaviourally equivalent on the training-known kata too, and even produces stronger code quality advantages (cognitive_max −42 %, mccabe_max −22 %). The recommendation in [`workflow-construction.md`](../workflow-construction.md) stays unchanged; the cross-kata validation strengthens it.
2. **The complexity spread collapse is a recurring pattern.** The phenomenon first documented in RQ-1.5 (exact-hybrid-v3-with-why-cc vs v6.1-hybrid on claim-office) — a σ reduction of 80–90 % on cognitive_max/longest_function — now recurs on GoL in the next workflow iteration (hybrid-v4 vs exact-hybrid-v3-with-why-cc). That argues for a robust mechanism: more refactorings → more consistent Complexity Peak, independent of kata and workflow iteration.
3. **Open questions for follow-up RQs:**
   - Do the findings hold on other models (Sonnet, Haiku, direct API without Portkey)?
   - Are the +13 % wallclock worth it — is there a hybrid-v4.3 variant that keeps only one of the three cleanup axes and is more cost-optimal?
   - Are the +22 % refactorings on GoL "real" improvements (the code gets better with each iteration) or overshooting (refactorings without marginal value)? A Mutation Score measurement would be the direct test.

**Caveat n=5.** The replicate count is deliberately smaller than RQ-1.6 (n=8), because this test is a cross-kata validation of an already documented effect, not a first demonstration. At n=5 all effect size estimates carry larger confidence intervals; the strong `cognitive_max` reduction (−81 % σ) in particular should be extended to n=8 if needed before it is adopted into a general methodology recommendation.
