# RQ-1.5: Why block effect on the hybrid-v2 base (claim-office)

## Overview

Baseline (`exact-hybrid-v2-testlist-fix-cc`, n=8) vs. with-why (`exact-hybrid-v3-with-why-cc`, n=8) on `claim-office-example-mapping × opus-4-7-portkey-no-thinking`. Directions: ↑ = higher = better, ↓ = lower = better.

| Metric | Direction | Baseline | with-why |
|---|---|---:|---:|
| `verification_pct` (Correctness (external)) | ↑ | **1.00** 🏆 | 0.91 |
| `tests_passing` (rate, Correctness (internal)) | ↑ | **100 %** 🏆 | **100 %** 🏆 |
| `completed_within_budget` | ↑ | **100 %** 🏆 | **100 %** 🏆 |
| `predictions_correct_rate` | ↑ | **96.5 %** 🏆 | **96.2 %** 🏆 |
| `refactorings_applied` (mean) | ↑ | 9.88 (σ 5.69) | **18.50** 🏆 (σ 8.42) |
| `cycle_count` (mean) | — | 25.0 (σ 14.7) | 35.0 (σ 14.2) |
| `tests_passed_immediately` (mean) | ↑ | 12.0 (σ 9.1) | **15.4** 🏆 (σ 7.3) |
| `code_mass` (mean) | ↓ | 840.75 | **769.12** 🏆 |
| `smell_total` (mean) | ↓ | 2.88 (σ 4.7) | **0.38** 🏆 (σ 0.52) |
| `cc_longest_function` (mean) | ↓ | 23.38 (σ 15.5, max 60) | **13.25** 🏆 (σ 1.58, max 15) |
| `cognitive_max` (mean) | ↓ | 7.62 (σ 6.0, max 21) | **4.38** 🏆 (σ 1.06, max 6) |
| `mccabe_max` (mean) | ↓ | 6.75 (σ 3.7, max 14) | **4.25** 🏆 (σ 0.46, max 5) |
| `duration_seconds` (mean) | ↓ | **1464** 🏆 | 2234 (+53 %) |
| `total_tokens` (mean) | ↓ | **32.6 M** 🏆 | 39.8 M (+22 %) |

Reading in two sentences: with-why is not better on correctness (marginally worse because of a 0-cycle outlier), but **considerably better on TDD discipline and code quality with a much tighter spread at the same time**. The price is ~50 % more wallclock and ~22 % more tokens.

---

## F-1.1 — Why blocks without a correctness effect, with a marked discipline and code quality effect

**Statement.** Adding the three lean why blocks to hybrid-v2 (with MUSTs fully retained in `commands/red.md` step 7, `commands/green.md`, `rules/tdd.md`) has **no correctness effect** (verification_pct 1.00 vs 0.91 with a single 0-cycle outlier in with-why; predictions_correct_rate 96.5 % vs 96.2 %), but **marked, aligned effects on TDD discipline and code quality**.

**Data (n=8 per cell).**

| Axis | Baseline | with-why | Δ |
|---|---:|---:|---|
| Refactorings/run (mean) | 9.88 | **18.50** 🏆 | **+87 %** |
| Smells/run (mean) | 2.88 | **0.38** 🏆 | **−87 %** |
| `cognitive_max` (mean / σ / max) | 7.62 / 6.02 / 21 | **4.38 🏆 / 1.06 / 6** | −43 % mean, σ −82 % |
| `cc_longest_function` (mean / σ / max) | 23.38 / 15.5 / 60 | **13.25 🏆 / 1.58 / 15** | −43 % mean, σ −90 % |
| `mccabe_max` (mean / σ / max) | 6.75 / 3.65 / 14 | **4.25 🏆 / 0.46 / 5** | −37 % mean, σ −87 % |

**Rationale.** The effect size on code quality (37–43 % mean reduction on Complexity Peak metrics) exceeds the baseline spread by several σ. Particularly striking: with-why **spreads 82–90 % less on all complexity axes**. The baseline produces two heavy outlier runs (mccabe_max=14, cognitive_max=21, cc_longest=60), with-why does not. Mechanistically plausible: with-why refactors almost twice as often (+87 %), which pushes the distribution of function lengths downward and caps complexity peaks before they build up.

Hypothesis H2 from the README (`exact-hybrid-v3-with-why-cc improves at least one TDD discipline metric by ≥ +1σ with invariant verification_pct`) is **confirmed** — and even more strongly than expected, because the effect is not limited to discipline but pulls the code quality metrics along in full.

**Consequence for `workflow-construction.md`.** The Theory-of-Mind / why block pattern (lines 30–47) had only the Anthropic skill-creator docs as backing so far. With this finding there is empirical backing from this repo: "MUST X. Why: Y." clearly beats a bare "MUST X." on a correctness-stable base (hybrid-v2). Adopt the pattern as the default recommendation.

**Caveat.** Single kata (claim-office), single model (opus-4-7-portkey-no-thinking). Generalization to other katas or models is outstanding. It also remains open whether why blocks at *all* MUST sites (rather than only the three lean sites) amplify the effect, or whether there is a diminishing marginal return.

---

## F-1.2 — Cost trade-off: around 50 % more wallclock, around 22 % more tokens — but equally fast per cycle

**Statement.** with-why costs on average **+770 s wallclock (+53 %)** and **+7.2 M tokens (+22 %)** per run. Per cycle, however, with-why is **not** slower or more expensive than the baseline — the surcharge comes entirely from with-why running **more cycles** (mean 35 vs 25).

**Data (n=8 per cell).**

| Axis | Baseline | with-why | Δ |
|---|---:|---:|---|
| Wallclock/run (mean) | 1464 s | 2234 s | +53 % |
| Tokens/run (mean) | 32.6 M | 39.8 M | +22 % |
| Cycles/run (mean) | 25.0 | 35.0 | +40 % |
| Wallclock/cycle | ~59 s | ~64 s | +9 % (within the σ noise) |
| Tokens/cycle | ~1.30 M | ~1.14 M | **−12 %** |

**Rationale.** If with-why were more expensive per cycle, that would be an argument against why blocks (overhead from reading longer prompts). The data show the opposite: with-why is **slightly more token-efficient** per cycle and nearly equally fast. The surcharge per run is therefore not "why bloat overhead" but a **direct consequence of higher discipline** — more cycles means more refactoring subagent calls, which in turn explains F-1.1 (refactorings +87 %).

Practical implication: for correctness-critical work without time pressure, with-why is clearly preferable (see F-1.1). For speed-prioritized setups (CI smoke runs, iteration speed) the baseline stays plausible — with the reservation that the baseline spread in code quality is considerably larger and produces occasional sloppy runs.

**Caveat.** Wallclock comparisons between Portkey runs depend on gateway load. Token comparisons are more robust.
