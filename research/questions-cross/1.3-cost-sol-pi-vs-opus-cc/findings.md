# RQ-cost-sol-pi-vs-opus-cc — Findings

**Setup:** Cost migration comparison of two coupled practice bundles —
**sol-pi** (`gpt-5-6-sol` on pi) vs **opus-cc** (`opus-4-8` on Claude Code) —
at constant prompt style (`example-mapping`) and outcome-equivalent
TDD workflow, across both katas. n=5 per cell, 4 cells (2 bundles × 2 katas).

**Confound caveat (binding):** model AND harness vary together — the
measured difference is the **sum** of model and harness effect, not
either alone. Isolated effects: harness in `RQ-harness-requesty`
(`../1.2-harness-requesty/`), model in `RQ-model-quality-pi`
(`../../questions-pi/1.1-model-quality-pi/`).

**Cost caveat:** `cost_usd` is a list-price estimate (tokens × price,
`compute-cost.py`), not a billed amount. The two bundles carry
**different tariffs** (sol `azure/gpt-5.6-sol` $5.00/$30.00/$0.50; opus
`vertex/claude-opus-4-8@eu` Requesty $5.50/$27.50/$0.55/$6.25 per 1M) — the
price difference is tariff **and** effort combined, which is exactly what the
migration question asks.

## Overview

Primary outcome **cost** `cost_usd` (lower = better) + Correctness (external)
`verification_pct` (higher = better), per bundle × kata.

### claim-office (CLI kata, high token load)

| Metric (direction) | sol-pi | opus-cc |
|---|---:|---:|
| `cost_usd` $ (lower) | **2.54** 🏆 | 32.89 |
| `total_tokens` (lower) | **2.09 M** 🏆 | 49.9 M |
| `duration_seconds` (lower) | **503** 🏆 | 3149 |
| `verification_pct` (higher) | **1.00** 🏆 | 0.93 |
| `tests_passing` rate (higher) | **100 %** 🏆 | **100 %** 🏆 |
| `cognitive_max` (lower) | 9.2 | **3.0** 🏆 |
| `mccabe_max` (lower) | 6.8 | **3.8** 🏆 |
| `smell_total` (Smell Total, lower) | 15.4 | **0.0** 🏆 |

### game-of-life (code-quality kata, all cells `verification_pct` = 1.0)

| Metric (direction) | sol-pi | opus-cc |
|---|---:|---:|
| `cost_usd` $ (lower) | **1.09** 🏆 | 3.45 |
| `total_tokens` (lower) | **0.66 M** 🏆 | 4.09 M |
| `duration_seconds` (lower) | **240** 🏆 | 719 |
| `verification_pct` (higher) | **1.0** 🏆 | **1.0** 🏆 |
| `cognitive_max` (lower) | 13.4 | **5.0** 🏆 |
| `mccabe_max` (lower) | 9.4 | **4.6** 🏆 |
| `smell_total` (Smell Total, lower) | 3.6 | **2.2** 🏆 |

Trophy gating: cost/correctness trophies go to the better bundle in each case;
quality trophies only among cells with full correctness — on both katas
both bundles satisfy `tests_passing` = 100 % (and on game-of-life both
`verification_pct` = 1.0), so they are awarded normally.

---

## F-1.1 — sol-pi is drastically cheaper on both katas — ~13× on the expensive kata

sol-pi's cost advantage scales with the kata's token load: ~3.2× on the
cheap game-of-life, ~13× on the token-heavy claim-office.

| Kata | sol-pi `cost_usd` | opus-cc `cost_usd` | Factor | Savings |
|---|---:|---:|---:|---:|
| claim-office | 2.54 | 32.89 | **~13.0×** | ~92 % |
| game-of-life | 1.09 | 3.45 | **~3.2×** | ~68 % |

The advantage comes from two aligned levers: sol-pi consumes **massively
fewer tokens** (claim-office 2.09 M vs 49.9 M = ~4 %, game-of-life 0.66 M vs
4.09 M = ~16 %) and runs on the cheaper model tariff. The token gap is
extreme on claim-office — opus-cc processes ~24× as much there. Since the two
bundles carry different tariffs, the $ factor is not purely token-driven, but
the token ranking dominates the order of magnitude. sol-pi is additionally
much faster (claim-office 503 s vs 3149 s, game-of-life 240 s vs 719 s). H1
confirmed: spread on claim-office > game-of-life.

---

## F-1.2 — The price advantage costs no correctness — on claim-office sol-pi is even more accurate

Despite ~13× lower cost, sol-pi matches or leads on externally measured
correctness.

| Kata | Outcome | sol-pi | opus-cc |
|---|---|---:|---:|
| claim-office | `verification_pct` (mean) | 1.00 | 0.93 |
| claim-office | `verification_pct` (σ) | 0.00 | 0.12 |
| claim-office | `tests_passing` | 100 % | 100 % |
| game-of-life | `verification_pct` (mean) | 1.0 | 1.0 |
| game-of-life | `tests_passing` | 100 % | 100 % |

On game-of-life both bundles are fully correct. On claim-office sol-pi reaches
`verification_pct` = 1.00 at σ = 0, while opus-cc spreads to 0.93 (σ = 0.12, min 0.73)
— a single opus-cc run drops to 0.73. The cheap migration therefore carries **no**
correctness penalty here, in fact a small advantage at
higher consistency. H2 confirmed. (Caveat: n=5, the opus-cc spread lies
within the replicate variance from `RQ-harness-requesty` — not a robust
model correctness deficit, but clearly no sol-pi deficit either.)

---

## F-1.3 — Cheaper does not mean cleaner: sol-pi carries higher complexity and more smells throughout

The price advantage buys itself with maintainability. opus-cc wins every quality axis
on both katas — most clearly on Smell Total on claim-office.

| Kata | Metric (lower = better) | sol-pi | opus-cc |
|---|---|---:|---:|
| claim-office | `cognitive_max` | 9.2 | 3.0 |
| claim-office | `mccabe_max` | 6.8 | 3.8 |
| claim-office | `smell_total` (Smell Total) | 15.4 | 0.0 |
| game-of-life | `cognitive_max` | 13.4 | 5.0 |
| game-of-life | `mccabe_max` | 9.4 | 4.6 |
| game-of-life | `smell_total` (Smell Total) | 3.6 | 2.2 |

opus-cc's `cognitive_max` sits at ~30–40 % of the sol-pi values; on claim-office
opus-cc produces **zero** smells against 15.4 for sol-pi. This matches
`RQ-model-quality-pi` F-1.2 (gpt-5-6-sol carries `cognitive_max` 13.4 on
game-of-life — identical value, since these are the same runs) and
`RQ-harness-requesty` F-1.3 (CC pushes down the Complexity Peak via more frequent
refactoring). Both effects add up here: the weaker model AND the
refactor-poorer harness pull in the same direction. H3 confirmed.

---

## Practical conclusion

Migrating from **opus-cc to sol-pi** saves **~68 % to ~92 %** of running cost
depending on the kata and runs ~3× faster, **without sacrificing correctness** (on
claim-office even more consistently). The price is **maintainability**: noticeably
higher Complexity Peak and considerably more code smells — the largest gap on the
CLI kata. Rule of thumb: sol-pi for cost- and throughput-critical work with
tolerable rework; opus-cc where low complexity and smell-freedom
justify the surcharge.
