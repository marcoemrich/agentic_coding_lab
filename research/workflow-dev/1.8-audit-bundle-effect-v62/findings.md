# RQ-audit-bundle-v62 Findings

## Overview

Primary outcomes per cell (n=10 per workflow, opus-4-7-portkey-no-thinking, game-of-life-example-mapping). 🏆 = best value per outcome; ties all get the trophy; pure noise differences (Δ << σ) get none.

| Outcome (direction)                                          | exact-hybrid-v4-cleaned-cc | exact-hybrid-v4.3-audit-bundle-cc      |
|-------------------------------------------------------------|-----------------------|------------------------|
| `tests_passed_immediately` (lower = better)                 | 0.7 ± 2.21 (max 7)    | **0 ± 0** 🏆           |
| `refactorings_applied` (higher = better)                    | 7.9 ± 1.85            | **8.7 ± 0.67** 🏆      |
| `predictions_correct_rate` (higher = better, pooled)        | **100 %** 🏆          | 97.4 % (185/190)       |
| `cycle_count` (informative, no clear direction)             | 8.5 ± 1.35            | 8.7 ± 0.67             |
| Code Mass (APP) (`code_mass`, lower = better)               | 153.3 ± 13.83         | **149.3 ± 12.14** 🏆   |
| Smell Total (`smell_total`, lower = better)                 | 2.4 ± 0.52            | **2.2 ± 0.63** 🏆      |
| Complexity Peak (`cc_longest_function`, lower = better)     | 12.2 ± 6.89           | 12.7 ± 4.32            |
| `cognitive_max` (lower = better)                            | 4.3 ± 2.79            | 4.5 ± 2.59             |
| `mccabe_max` (lower = better)                               | 4.2 ± 1.32            | 4.6 ± 1.07             |
| `tests_passing` / `completed_within_budget`                 | 100 % / 100 %         | 100 % / 100 %          |
| `total_tokens` (lower = better)                             | **8.32 M ± 1.61** 🏆  | 9.65 M ± 2.34          |
| `duration_seconds` (lower = better, Δ << σ)                 | 627 ± 117             | 631 ± 101              |

Complexity outcomes `cc_longest_function`, `cognitive_max`, `mccabe_max`: the mean Δ is markedly smaller than σ → no trophy, the workflows are indistinguishable on the Complexity Peak axis.

---

## F-1.8.1 — Mandatory-procedure preamble eliminates premature greens on the hybrid-v4 base too

`tests_passed_immediately` drops from 0.7 ± 2.21 (max 7) to **0 ± 0**. Across ten hybrid-v4.3 runs, *no* test stood green immediately after the red switch.

| workflow | mean | σ | min | max |
|---|---:|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | 0.7 | 2.21 | 0 | 7 |
| exact-hybrid-v4.3-audit-bundle-cc     | 0   | 0    | 0 | 0 |

Identical pattern to the RQ-audit precedent (v6.5-lean → v6.5.1: 1.4 → 0). The mandatory-procedure preamble in `commands/red.md` forbids skipping the seven red steps even when the active test already stands green — the result: a green that implicitly over-implemented in the preceding iteration is forced by the next red cycle to produce a genuine failure.

The effect replicates on the MUST/PEP-carrying hybrid-v4 base (that is, without v6.5-lean-specific reductions). The audit bundle is independently effective here, not merely the repair of a reduced base.

---

## F-1.8.2 — Refactor rationale + three-path bar raises and stabilizes refactoring discipline

`refactorings_applied` 7.9 ± 1.85 → **8.7 ± 0.67**. Mean +10 %, σ barely a third.

| workflow | mean | σ | min | max |
|---|---:|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | 7.9 | 1.85 | 4 | 9 |
| exact-hybrid-v4.3-audit-bundle-cc     | 8.7 | 0.67 | 8 | 10 |

The effect direction is identical to the RQ-audit precedent (v6.5-lean → v6.5.1: 6.9 → 7.8, +13 %, σ −82 %). On the hybrid-v4 base the effect size is smaller as hypothesized (why blocks in hybrid-v4 already carry part of the rationale effect), but the σ reduction is clear.

Mechanisms: the measurement-pipeline rationale makes the mandatory refactor floor explicitly motivated ("missing attempt drops the signal to zero"); the concrete three-path bar (name tightening / APP mass drop ≥1 / removable smell) closes the "code is already optimal" escape and forces the refactor subagent to address each path explicitly.

---

## F-1.8.3 — Code quality equivalent, no regression

Code quality outcomes each stay within 1 σ — no degradation.

| outcome | exact-hybrid-v4-cleaned-cc | exact-hybrid-v4.3-audit-bundle-cc |
|---|---|---|
| Code Mass (APP) (`code_mass`)           | 153.3 ± 13.83 | **149.3 ± 12.14** |
| Smell Total (`smell_total`)             | 2.4 ± 0.52    | **2.2 ± 0.63**    |
| Complexity Peak (`cc_longest_function`) | 12.2 ± 6.89   | 12.7 ± 4.32       |
| `cognitive_max`                         | 4.3 ± 2.79    | 4.5 ± 2.59        |
| `mccabe_max`                            | 4.2 ± 1.32    | 4.6 ± 1.07        |

Code Mass and Smell Total drop slightly; Complexity Peak, cognitive and McCabe max stay statistically indistinguishable (Δ < σ). hybrid-v4.3 also shows a tighter σ on the Complexity Peak (6.89 → 4.32, −37 %), as observed in the RQ-audit precedent.

Correctness is saturated on GoL for both workflows (100 % `tests_passing`, 100 % `completed_within_budget`). H2 (correctness must not regress) is satisfied.

---

## F-1.8.4 — The wrong-predictions block shows up as a 2.6 pp predictions-rate drop

`predictions_correct_rate` falls from 100 % (170/170) to 97.4 % (185/190). Five of 190 compilation/runtime predictions are explicitly marked `Incorrect` in hybrid-v4.3.

This is not a loss of discipline but the intended effect of the "Wrong Predictions Are Data" block: the backfill ban ("do not edit the original prediction to match the observed result") prevents a wrong prediction from being retroactively rewritten into the observation. The hybrid-v4 base permits that implicitly (no explicit ban, and the red-phase STOP clause can invite smoothing). The rate drop measures exactly those honest wrong predictions that in hybrid-v4 were presumably "corrected" in part before publication.

For assessing TDD discipline, hybrid-v4.3 is the more informative arm here, even though the number looks lower.

---

## F-1.8.5 — The audit bundle costs +16 % tokens but no wallclock surcharge

| outcome | exact-hybrid-v4-cleaned-cc | exact-hybrid-v4.3-audit-bundle-cc | Δ |
|---|---:|---:|---:|
| `total_tokens`     | 8.32 M ± 1.61 | 9.65 M ± 2.34 | +16 % |
| `duration_seconds` | 627 ± 117     | 631 ± 101     | +0.6 % |

The token surcharge (+16 %) replicates the RQ-audit precedent (+15 %) almost exactly — the added text volume (mandatory preamble, three rationale blocks, three-path bar, wrong-predictions block) shows up in token consumption as expected.

Wallclock neutrality (+0.6 %), by contrast, breaks with the RQ-audit precedent, which showed +16 % wallclock. Possible explanations under which the token/wallclock decoupling becomes intelligible:
- hybrid-v4 averages 0.7 premature greens, each of which can trigger a full "test passed already" detour cycle; hybrid-v4.3 saves those. The extra text-processing effort is offset by the eliminated detour.
- v6.5-lean → v6.5.1 started from a reduced base (less pep, less emoji) in which the detour effect did not exist and the audit text surcharge fed straight through to wallclock.

Token variance does rise, however (σ 1.61M → 2.34M, +45 %) — a single hybrid-v4.3 run at 16 M tokens (vs a cluster around ~9 M) dominates. That points to an outlier, not systematic drift.

---

## F-1.8.6 — Variance shrink confirmed in discipline and complexity outcomes

| outcome | σ hybrid-v4 | σ hybrid-v4.3 | factor |
|---|---:|---:|---:|
| `tests_passed_immediately` | 2.21 | 0    | 0    |
| `refactorings_applied`     | 1.85 | 0.67 | 0.36 |
| `cycle_count`              | 1.35 | 0.67 | 0.50 |
| `cc_longest_function`      | 6.89 | 4.32 | 0.63 |
| `mccabe_max`               | 1.32 | 1.07 | 0.81 |
| `cognitive_max`            | 2.79 | 2.59 | 0.93 |
| `code_mass`                | 13.83| 12.14| 0.88 |
| `duration_seconds`         | 117  | 101  | 0.86 |
| `smell_total`              | 0.52 | 0.63 | 1.21 |
| `total_tokens` (M)         | 1.61 | 2.34 | 1.45 |

On the TDD discipline outcomes the σ shrink is dramatic (`tests_passed_immediately` σ 2.21 → 0; `refactorings_applied` σ by a factor of 0.36; `cycle_count` halved). The complexity outcomes follow more weakly in the same direction. Smell Total and token σ rise — the token increase traces back to the 16M outlier run mentioned above; the smell σ increase comes from a single hybrid-v4.3 run with 4 smells (vs 2 otherwise).

The audit bundle makes the workflow *markedly* more predictable on the discipline axes — at n=10, hybrid-v4.3 is near-deterministic in `tests_passed_immediately` and `cycle_count`.
