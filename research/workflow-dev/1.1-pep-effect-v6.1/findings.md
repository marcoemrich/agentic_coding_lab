# RQ-pep-v6.1 — Findings

_Do psychological justifications ('pep talks') in the Red and Green skill prompts on the hybrid-v2 base deliver a measurable code quality or TDD discipline advantage over purely operational instructions?_

## Overview (primary outcome code quality — lower = better)

| Outcome | v6.1-hybrid (pep) | exact-hybrid-v2.1-no-pep-cc |
|---|---:|---:|
| `code_mass` (APP) | 147.6 | **144.6** 🏆 |
| `smell_total` | 2.6 | **2.0** 🏆 |
| `cc_longest_function` | 15.0 | **13.2** 🏆 |
| `cognitive_max` | 6.2 | **4.6** 🏆 |
| `mccabe_max` | 5.2 | **4.8** 🏆 |

All code quality metrics lean slightly toward **no-pep**, but the spreads are large (std mostly ≥ 1σ of the mean delta) — reading: **no clear effect**, slight trend in favour of the reduction.

---

## F-1.1 — Pep talks: no code quality advantage, but a discipline shift

**Statement:** Removing the "Psychological Resistance" section and motivating inline comments from `green.md`/`red.md` on the hybrid-v2 base degrades neither correctness (both 100% `verification_pct`) nor code quality. It does change TDD behaviour: **no-pep refactors considerably more often** and implements **considerably less often up front** (fewer `tests_passed_immediately`).

| Metric (direction) | v6.1-hybrid (pep) | exact-hybrid-v2.1-no-pep-cc | Δ |
|---|---:|---:|---|
| `refactorings_applied` (higher = more active) | 4.2 (std 2.28) | **7.0** 🏆 (std 3.24) | +67% |
| `tests_passed_immediately` (lower = more disciplined) | 4.8 (std 2.95) | **1.2** 🏆 (std 2.68) | −75% |
| `cycle_count` | 8.4 | 8.8 | ≈ |
| `predictions_correct_rate` | 98.8% | **100.0%** 🏆 | ≈ |
| `verification_pct` | **100%** 🏆 | **100%** 🏆 | = |
| `tests_passing` | **100%** 🏆 | **100%** 🏆 | = |
| `duration_seconds` (lower = cheaper) | **597** 🏆 | 777 | +30% |
| `total_tokens` (lower = cheaper) | **7.17M** 🏆 | 8.66M | +21% |

**Rationale:** the a-priori hypothesis H3 predicted the opposite (no-pep → more over-implementation). The inverse pattern is observed — without motivating reassurance the model stays stricter on the minimal Green step and defers extensions to the refactor subagent. Mechanism open: presumably the loss of the "Hardcoded returns are perfectly fine" reassurance shifts the default strategy rather than explicit discipline. **Cost:** no-pep needs +30% wallclock and +21% tokens, driven by the additional refactor cycles. H1 (pep talks have no effect) is confirmed for code quality, but qualified by the H3-inverse TDD discipline pattern.

**Consequence:** exact-hybrid-v2.1-no-pep-cc is a valid reduction for code-quality-oriented workflows. For token efficiency v6.1-hybrid remains better. The MARKERS classification as "decorative" holds for output quality, but is imprecise for TDD behaviour.

**Data basis:** n=5 per cell, `game-of-life-example-mapping`, `opus-4-7-no-thinking`. See `summary.md` and `runs.csv`.
