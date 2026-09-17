# RQ-1.6: exact-hybrid-v4-cleaned-cc vs exact-hybrid-v3-with-why-cc (claim-office)

## Overview

Baseline (`exact-hybrid-v3-with-why-cc`, n=8) vs. cleaned (`exact-hybrid-v4-cleaned-cc`, n=8) on `claim-office-example-mapping × opus-4-7-portkey-no-thinking`. Directions: ↑ = higher = better, ↓ = lower = better.

| Metric | Direction | exact-hybrid-v3-with-why-cc | exact-hybrid-v4-cleaned-cc |
|---|---|---:|---:|
| `verification_pct` (Correctness (external)) mean | ↑ | 0.91 (σ 0.26) | **0.96** 🏆 (σ 0.09) |
| `tests_passing` rate (Correctness (internal)) | ↑ | **100 %** 🏆 | **100 %** 🏆 |
| `completed_within_budget` rate | ↑ | **100 %** 🏆 | **100 %** 🏆 |
| `predictions_correct_rate` (pooled) | ↑ | 96.2 % (n=7) | **97.2 %** 🏆 (n=8) |
| `refactorings_applied` mean | ↑ | 18.50 (σ 8.42, min 0) | **24.88** 🏆 (σ 6.90, min 18) |
| `tests_passed_immediately` mean | — | 15.38 (σ 7.27) | 15.12 (σ 5.84) |
| `cycle_count` mean (σ, min) | — | 35.00 (σ 14.22, min 0) | 37.38 (σ 1.60, min 35) |
| `code_mass` mean | ↓ | **769.12** 🏆 (σ 197) | 878.50 (σ 91) |
| `smell_total` mean | ↓ | **0.38** 🏆 | **0.38** 🏆 |
| `cc_longest_function` mean | ↓ | 13.25 (σ 1.58) | **12.38** 🏆 (σ 1.41) |
| `cognitive_max` mean | ↓ | **4.38** 🏆 (σ 1.06) | 5.00 (σ 1.77) |
| `mccabe_max` mean | ↓ | **4.25** 🏆 (σ 0.46) | 4.50 (σ 0.76) |
| `duration_seconds` mean | ↓ | **2234** 🏆 | 2530 (+13 %) |
| `total_tokens` mean | ↓ | **39.78 M** 🏆 | 44.44 M (+12 %) |

Reading in two sentences: the three v6.5.1 cleanups (consistency, refactor.md decoupling, tdd-experiment-mode reframing) do **not** damage the exact-hybrid-v3-with-why-cc baseline — all correctness and discipline axes sit within the baseline corridor or slightly above it, with a considerably tighter spread. The price is moderately higher cost (+13 % wallclock, +12 % tokens), driven by +34 % refactorings.

---

## F-1.1 — Cleanups are behaviourally equivalent to the baseline; no correctness regression

**Statement.** exact-hybrid-v4-cleaned-cc shows no correctness regression against exact-hybrid-v3-with-why-cc on claim-office with Opus 4.7 Portkey no-thinking. The verification_pct mean of 0.96 is slightly above the baseline 0.91, and the spread collapses from σ 0.26 to σ 0.09 (−65 %). Tests passing and completed-within-budget are at 100 % in both cells.

**Data (n=8 per cell).**

| Metric | exact-hybrid-v3-with-why-cc | exact-hybrid-v4-cleaned-cc |
|---|---|---|
| `verification_pct` mean / σ / min | 0.91 / 0.26 / 0.27 | **0.96 / 0.09 / 0.73** |
| Runs with verif = 1.0 | 6/8 | 6/8 |
| Runs with verif ≥ 0.9 | 6/8 | 7/8 |
| Runs with verif < 0.5 | 1/8 (0.27) | 0/8 |
| `tests_passing` | 100 % | 100 % |

**Rationale.** H0 (cleanups behaviour-neutral) is confirmed. The central worry — a repeat of the v6.5-lean damage (see memory `v6.5-correctness-setback`, where skill-creator-driven reductions destroyed correctness) — is refuted. The three cleanups applied now (consistency renames, refactor.md decoupling, tdd-experiment-mode rewording) left MUSTs, why blocks and all four MARKERS.md markers untouched; that shows up measurably in stable correctness. H1 (correctness break) is clearly refuted.

**Caveat outlier asymmetry.** The exact-hybrid-v3-with-why-cc data set contains an extreme outlier (`2026-05-24_00-08-47`, verif=0.27, cycles=0, dur=1030s) — a symptom of the nudge transcript overwrite bug (memory `nudge-transcript-overwrite-bug`), which affected the pipeline until 2026-05-24. All hybrid-v4 runs were produced after the pipeline fix. Filtering exact-hybrid-v3-with-why-cc on `end_turn=1` runs (n=7) puts verification there at 7/7 = 1.0 — strictly higher than v6.2-with-why 6/8 = 0.75 (mean=0.96). This asymmetry distorts the overview trophy: hybrid-v4 holds the 🏆 because of the better mean including the outlier, while without the outlier hybrid-v2 is better. What is certain: hybrid-v4 is not *worse*, and the exact sign of the effect is within the noise at n=8.

---

## F-1.2 — Discipline drift: more refactorings, tighter spread

**Statement.** hybrid-v4 refactors considerably more often (+34 %) and no longer stops early: `cycle_count` now only spreads from 35–40 (σ 1.6, vs. hybrid-v2 σ 14.2 with range 0–42). `refactorings_applied` σ also drops from 8.42 to 6.90; the min rises from 0 to 18 (no refactoring dropout any more).

**Data (n=8 per cell).**

| Metric | exact-hybrid-v3-with-why-cc | exact-hybrid-v4-cleaned-cc | Δ |
|---|---:|---:|---|
| `refactorings_applied` mean / σ / min | 18.50 / 8.42 / 0 | **24.88 / 6.90 / 18** | +34 % mean, σ −18 % |
| `cycle_count` mean / σ / range | 35.00 / 14.22 / 0–42 | **37.38 / 1.60 / 35–40** | +7 % mean, σ −89 % |
| `predictions_correct_rate` | 96.2 % | **97.2 %** | +1 pp |
| `tests_passed_immediately` mean | 15.38 | 15.12 | ≈ |

**Rationale.** H2 (discipline drift with stable correctness) is partially confirmed. hybrid-v4 shows a measurable rise over the baseline, particularly on `refactorings_applied`. Mechanistically plausible: the `refactor.md` decoupling (role-neutral language instead of "TDD Refactor Phase specialist" + dropping the "Proceeding to the next test" coda) removes an implicit chaining inhibition — the subagent no longer sees itself as part of a finite TDD sequence and delivers more iterations. The cycle spread compression from σ 14.22 to σ 1.60 is also striking, but is strongly inflated by the single hybrid-v2 outlier (cycles=0) — see the caveat in F-1.1.

Prediction correctness rises minimally (+1 pp) and stays within the noise. The tests-passed-immediately values are virtually identical — the cleanups neither weakened discipline nor reinforced hard-coupled look-ahead planning.

---

## F-1.3 — Code quality neutral to slightly worse; smells unchanged

**Statement.** The code quality metrics show a mixed picture: `smell_total` is identical (both 0.38), `cc_longest_function` slightly better in hybrid-v4 (12.38 vs 13.25), but `code_mass` (+14 %), `cognitive_max` (+14 %) and `mccabe_max` (+6 %) are slightly raised in hybrid-v4. None of the increases exceeds 1σ of the respective spread.

**Data (n=8 per cell).**

| Metric (↓ = better) | exact-hybrid-v3-with-why-cc | exact-hybrid-v4-cleaned-cc |
|---|---:|---:|
| `code_mass` mean | **769.12** 🏆 (σ 197) | 878.50 (σ 91) |
| `smell_total` mean | **0.38** 🏆 | **0.38** 🏆 |
| `cc_longest_function` mean | 13.25 (σ 1.58) | **12.38** 🏆 (σ 1.41) |
| `cognitive_max` mean | **4.38** 🏆 (σ 1.06) | 5.00 (σ 1.77) |
| `mccabe_max` mean | **4.25** 🏆 (σ 0.46) | 4.50 (σ 0.76) |

**Rationale.** The `code_mass` difference (769 → 879) is substantial, but comes out smaller than the hybrid-v2 spread (σ 197) and may partly stem from more hybrid-v4 runs implementing all tests completely (no "half-finished" outlier like the 0.27 hybrid-v2 run, which pulled the v6.1 Code Mass (APP) down). The Complexity Peak values (`cognitive_max`, `mccabe_max`) rise slightly, but stay in single digits and without `high_count` violations.

The equality of the smells (0.38 / 0.38) is the strongest signal: the refactor subagent behaviour still caps smells consistently.

---

## F-1.4 — Cost surcharge from more refactorings: +13 % wallclock, +12 % tokens

**Statement.** hybrid-v4 costs on average +296 s wallclock (+13 %) and +4.66 M tokens (+12 %) per run. The surcharge is consistent with the raised refactor activity from F-1.2 (+34 % refactorings, +7 % cycles).

**Data (n=8 per cell).**

| Metric (↓ = better) | exact-hybrid-v3-with-why-cc | exact-hybrid-v4-cleaned-cc | Δ |
|---|---:|---:|---|
| `duration_seconds` mean | **2234** 🏆 (σ 550) | 2530 (σ 401) | +13 % |
| `total_tokens` mean | **39.78 M** 🏆 (σ 16.1 M) | 44.44 M (σ 3.4 M) | +12 % |
| `cycle_count` mean | 35.00 | 37.38 | +7 % |
| `total_tokens / cycle` (≈) | 1.14 M | 1.19 M | +5 % |

**Rationale.** Per cycle, hybrid-v4 is only marginally more expensive than hybrid-v2 (+5 % tokens/cycle, within the σ noise). The surcharge per run comes almost entirely from the +7 % cycles and especially the +34 % refactorings. The spread of `total_tokens` drops drastically (σ 16.1 M → 3.4 M); hybrid-v4 is therefore significantly **more predictable** in cost — as is the near-halving of the wallclock spread.

---

## Hypothesis status

| Hypothesis | Status | Evidence |
|---|---|---|
| **H0** Cleanups behaviourally equivalent | largely confirmed | correctness, tests, budget identical; minor drifts in discipline/Code Mass (APP) within the noise range |
| **H1** Correctness break ≥ 5 pp | clearly refuted | verification_pct mean 0.91 → 0.96 (+5 pp), tests_passing 100 %/100 %, no failure mode reproduced |
| **H2** Discipline drift with stable correctness | partially confirmed | refactorings_applied +34 %, cycle_count spread capped — both without correctness damage |

## Consequences

1. **exact-hybrid-v4-cleaned-cc becomes the new default baseline** for claim-office RQs with Opus 4.7 no-thinking. exact-hybrid-v3-with-why-cc stays in the inventory as a predecessor reference, but is no longer used actively.
2. **The entry in `workflow-construction.md`** (inventory table + load-bearing findings) promotes hybrid-v4 as the new recommendation.
3. **Open questions** for follow-up RQs:
   - Does the cleanup picture hold on game-of-life (training-known kata)?
   - Does it hold on other models (Sonnet, Haiku, without Portkey)?
   - Are the +13 % wallclock worth it — or is there a hybrid-v4.3 variant that keeps only one of the three cleanup axes and reduces the cost?

**Caveat single-cell validation.** n=8 is enough for "no gross regression", not for strict equality proofs. The correctness difference in particular (1.0 vs 0.96 without the hybrid-v2 outlier) is not separable from noise at n=8. On adoption as the new baseline, hybrid-v4 should be validated on at least one further model or kata axis before it is recommended generally.
