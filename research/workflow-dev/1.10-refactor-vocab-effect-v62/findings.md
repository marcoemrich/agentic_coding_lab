# RQ-1.10 — Findings: exact-hybrid-v4.1-refactor-vocab-cc vs exact-hybrid-v4-cleaned-cc

Status: 2026-05-26 · n=5 per new cell (refactor-vocab), n=8 / n=10 baseline reuse from RQ-1.9 (claim-office) and RQ-1.7 (game-of-life) respectively · model `opus-4-7-portkey-no-thinking` · prompt style `example-mapping`.

## Overview

Primary outcome **correctness** (`verification_pct` / `tests_passing`, higher = better) plus the bundle-risk sentinel **Code Mass (APP)** (higher = more productive output; diagnostic here for "the agent stopped"):

| kata          | metric                  | exact-hybrid-v4-cleaned-cc | exact-hybrid-v4.1-refactor-vocab-cc | Trophy |
|---|---|---:|---:|:--|
| game-of-life  | tests_passing rate      | **100 %** 🏆          | **100 %** 🏆        | tie    |
| game-of-life  | code_mass (mean)        | **153** 🏆            | 172                 | Baseline (refactor-vocab +12 %) |
| claim-office  | verification_pct (mean) | **0.96** 🏆           | 0.23                | Baseline (−0.73 absolute) |
| claim-office  | verification_pct (min)  | **0.73** 🏆           | 0.00                | Baseline |
| claim-office  | cycle_count (mean)      | **37.4** 🏆           | 16.0                | Baseline (agent stops after <½ the cycles) |
| claim-office  | code_mass (mean)        | **879** 🏆            | 372                 | Baseline (−58 % output) |

On game-of-life there is no correctness difference (both 100 %); on claim-office refactor-vocab collapses in 4/5 runs (`verification_pct ∈ {0, 0, 0.067, 0.133}`, 1/5 at 0.933). The cost means (`duration_seconds`, `total_tokens`) on claim-office look favorable to refactor-vocab — but are **not trophy-eligible**: the agent gives up early, rather than the solution being shorter (`code_mass` halved, `cycle_count` halved). The **correctness gating** of the trophy convention applies: quality/cost trophies only from `verification_pct = 1.0` upward; on claim-office refactor-vocab has no 1.0 run, hence no quality/cost trophies there.

---

## F-1.10.1 — Correctness collapse on claim-office (bundle risk confirmed)

The additive refactor vocabulary block (complexity awareness + SRP + smell table) breaks correctness on claim-office from `verification_pct = 0.96` (baseline, σ=0.09) to `0.23` (refactor-vocab, σ=0.40). 4 of 5 runs sit below 0.15, one run reaches 0.93.

| kata         | workflow              | n | verif mean | verif min | verif max | σ    |
|---|---|---:|---:|---:|---:|---:|
| claim-office | exact-hybrid-v4-cleaned-cc | 8 | **0.96** 🏆 | **0.73** 🏆 | 1.00 | 0.09 |
| claim-office | exact-hybrid-v4.1-refactor-vocab-cc   | 5 | 0.23      | 0.00      | 0.93 | 0.40 |

**Mechanism** (from a spot-check of the 5 refactor-vocab runs):

- The agent self-terminates prematurely: `cycle_count = 7, 8, 8, 22, 35` (baseline 36-40), `duration_seconds = 629-2328` (baseline 2194-3285), no rate limit, no timeout, `exit_code = 0` in all 5 cases.
- `code_mass` halved (372 vs 879). The tests that _were_ written run green, but the test list was not worked through — which makes `tests_passing = true` a misleading internal signal.
- The CLI nudge (`run-batch.sh` creates `src/cli.ts` post hoc when the agent forgets it) makes stub calls against `runScenario` that fail because the domain logic is incomplete — hence `verification_pct ≈ 0` rather than `null`.
- Hypothesis for the early stop: the additional refactor vocabulary shifts attention from working through the test list toward a code quality self-audit; the agent regards the first cycles as "complete, because refactored".

The H0 falsifier from the RQ README is triggered: "correctness regresses on claim-office → the vocabulary extension is empirically redundant, hybrid-v4 stays the default". The pattern matches [audit-bundle-kata-asymmetry](../1.9-audit-bundle-validation-claim-office/findings.md) — RQ-1.9 showed exact-hybrid-v4.3-audit-bundle-cc at 0.96 → 0.35 on the same kata.

**Consequence**: exact-hybrid-v4.1-refactor-vocab-cc is **not promoted**. The default remains exact-hybrid-v4-cleaned-cc.

---

## F-1.10.2 — game-of-life: no discernible code quality gain

On game-of-life all primary complexity metrics sit within 1σ of the baseline. `code_mass` rises by 12 %, `duration_seconds` by 14 %, `total_tokens` by 15.5 %.

| metric                  | exact-hybrid-v4-cleaned-cc (n=10) | exact-hybrid-v4.1-refactor-vocab-cc (n=5) | Δ        |
|---|---:|---:|---:|
| cognitive_max (mean)    | 4.3 (σ 2.8)                  | 4.2 (σ 2.2)               | -0.1     |
| cognitive_avg (mean)    | 2.9 (σ 1.7)                  | 2.9 (σ 0.8)               | 0        |
| mccabe_max (mean)       | 4.2 (σ 1.3)                  | 3.8 (σ 0.5)               | -0.4     |
| mccabe_avg (mean)       | 2.01 (σ 0.58)                | 1.67 (σ 0.42)             | -0.34    |
| cc_longest_function     | 12.2 (σ 6.9)                 | 10.0 (σ 5.6)              | -2.2     |
| cc_avg_loc_per_function | 5.2 (σ 2.0)                  | 4.4 (σ 2.2)               | -0.8     |
| code_mass (mean)        | **153** (σ 14)               | 172 (σ 26)                | +12 %    |
| smell_total (mean)      | 2.4 (σ 0.5)                  | 2.2 (σ 0.5)               | -0.2     |
| refactorings_applied    | 7.9 (σ 1.9)                  | 9.2 (σ 0.8)               | +1.3     |
| duration_seconds        | **627** (σ 117)              | 716 (σ 70)                | +14 %    |
| total_tokens            | **8.32 M**                   | 9.60 M                    | +15.5 %  |

All complexity differences sit within 1σ of the baseline variance — no robust gain. `refactorings_applied` rises slightly (+1.3): the agent acts on the additional vocabulary as an occasion to refactor, without the measured metrics moving. Trophies only for unambiguously better columns (`code_mass`, `duration_seconds`, `total_tokens`); on the complexity columns the spread is under 1σ → no trophy ("tie").

**Goodhart caveat** (per the README's "Goodhart's Law"): `cognitive_*` and `mccabe_*` are named explicitly in the new `refactor.md` — for exact-hybrid-v4.1-refactor-vocab-cc they are **compliance metrics**, while for exact-hybrid-v4-cleaned-cc they stay independent. A cross-workflow comparison on these metrics is therefore asymmetric and tinted in refactor-vocab's favor. The fact that no gain is visible even _with_ that tint reinforces H0. `mutation_score` (a hidden metric) would be the clean test, but it is not enabled for this RQ.

---

## F-1.10.3 — TDD discipline: GoL neutral, claim-office disturbed (consequence of F-1.10.1)

| kata         | workflow              | cycle_count mean | refactorings_applied mean | predictions_correct_rate |
|---|---|---:|---:|---:|
| game-of-life | exact-hybrid-v4-cleaned-cc | 8.5  | 7.9  | **100 %** 🏆 |
| game-of-life | exact-hybrid-v4.1-refactor-vocab-cc   | 9.2  | 9.2  | 97.8 %       |
| claim-office | exact-hybrid-v4-cleaned-cc | **37.4** 🏆 | **24.9** 🏆 | 97.2 % |
| claim-office | exact-hybrid-v4.1-refactor-vocab-cc   | 16.0 (σ 12.3) | 12.0 | 98.1 %  |

On GoL: TDD discipline stays within the baseline (H3 satisfied). On claim-office: `cycle_count` halved with σ=12.3 — a consequence of F-1.10.1 (the agent stops early), not an independent effect. `predictions_correct_rate` stays high in both workflows (≥ 97 %) — when the agent _works_, its self-prediction is correct; the bundle breaks quantity, not prediction quality.
