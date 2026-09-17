# RQ-pep-emoji-v6.1 — Findings

_Are the effects of the pep and emoji reductions on the hybrid-v2 base additive (two independent channels) or jointly carried (a single 'prompt scaffolding' mechanism)?_

## Overview (primary outcome code quality — lower = better)

| Outcome | hybrid (pep+emoji) | no-pep | no-emoji | no-pep-no-emoji |
|---|---:|---:|---:|---:|
| `code_mass` (APP) | 153.7 | **144.6** 🏆 | 156.8 | 153.2 |
| `smell_total` | 2.4 | **2.0** 🏆 | **2.0** 🏆 | 2.2 |
| `cc_longest_function` | 14.2 | 13.2 | **11.4** 🏆 | 16.2 |
| `cognitive_max` | 6.5 | **4.6** 🏆 | 6.6 | 7.8 |
| `mccabe_max` | 5.2 | 4.8 | **4.6** 🏆 | 5.0 |

The combined reduction wins **no** code quality metric. All Δ < 1σ — code quality stays indistinguishable, but the trophy distribution (no-pep 3×, no-emoji 2×, combined 0×) is consistent with the discipline interaction finding below.

---

## F-1.1 — Pep and emoji reduction: no additivity, but saturation with an anti-effect

**Statement:** The combined removal of pep talks AND decoration emojis (exact-hybrid-v2.3-no-pep-no-emoji-cc) on the hybrid-v2 base behaves **non-additively** relative to the single reductions from [RQ-pep-v6.1](../1.1-pep-effect-v6.1/findings.md) and [RQ-emoji-v6.1](../1.2-emoji-effect-v6.1/findings.md). The discipline shift saturates for `tests_passed_immediately` and **reverses** for `refactorings_applied` — the combination even refactors less than the baseline with pep+emoji.

| Metric (direction) | hybrid (baseline) | no-pep | no-emoji | combined | Additive prediction |
|---|---:|---:|---:|---:|---:|
| `refactorings_applied` (higher = more active) | 4.1 | **7.0** 🏆 | 5.4 | 3.8 | ~9.1 |
| `tests_passed_immediately` (lower = more disciplined) | 4.7 | **1.2** 🏆 | 2.2 | **1.2** 🏆 | ~0.6 (multiplicative) |
| `cycle_count` | 8.7 | 8.8 | 8.8 | 9.2 | ≈ |
| `predictions_correct_rate` | 99.4% | **100%** 🏆 | 97.7% | 98.6% | ≈ |

**Rationale:** the interaction is non-monotonic: for `tests_passed_immediately` the pep removal alone suffices to reach the maximum discipline gain (1.2 = the same value in no-pep and no-pep-no-emoji). For `refactorings_applied` the single effect even *inverts* under combined application. A plausible reading: each of the two reductions removes a "reassurance/signpost" layer that motivates the model to spawn the refactor subagent. With *one* layer missing the model falls back on the remaining one and overcompensates. With *both* layers missing the trigger text for more refactoring is absent entirely — the workflow runs through faster, with fewer refactor subagent calls. Hypothesis A (additive) is thus clearly **refuted**; hypothesis B (shared mechanism / saturation) is partially confirmed, but the anti-additivity for `refactorings_applied` shows that the channels do not merely duplicate the same effect but interact with each other.

---

## F-1.2 — Correctness robust against all reduction combinations

**Statement:** All four workflows reach 100 % **Correctness (internal)** (`tests_passing`) and 100 % **Correctness (external)** (`verification_pct`) as well as 100 % `completed_within_budget`. Neither the single reductions nor their combination damage correctness on game-of-life-example-mapping.

| Outcome | hybrid | no-pep | no-emoji | no-pep-no-emoji |
|---|---:|---:|---:|---:|
| **Correctness (internal)** | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| **Correctness (external)** | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `completed_within_budget` | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |

**Rationale:** confirms H3. The hybrid-v2 base (with the test-list scope fix) is robust against the decoration/pep reductions examined — the correctness finding from RQ-pep-v6.1 and RQ-emoji-v6.1 carries over fully to the combination.

---

## F-1.3 — Combined reduction runs faster with fewer refactor phases

**Statement:** exact-hybrid-v2.3-no-pep-no-emoji-cc is the **fastest** cell (432 s, −15 % vs baseline 508 s) and sits below both single reductions on tokens. Mechanistically this is a consequence of F-1.1: fewer refactor subagent spawns (3.8 vs 7.0 in no-pep, 5.4 in no-emoji) → lower wallclock and token load.

| Metric (lower = better) | hybrid | no-pep | no-emoji | no-pep-no-emoji |
|---|---:|---:|---:|---:|
| `duration_seconds` (mean) | 507.9 | 777.2 | 668.8 | **432.0** 🏆 |
| `total_tokens` (mean) | **6.94 M** 🏆 | 8.66 M | 7.78 M | 7.58 M |

**Rationale:** contrary to the single-reduction expectation (no-pep / no-emoji cost *more* tokens because of additional refactor phases — see RQ-emoji-v6.1 F-1.2), the combination saves time, because the counteracting effect from F-1.1 reduces the number of refactor phases. The combination is therefore operationally cheaper — but at the price of the "missing" refactor activity that counted as a positive discipline effect in the single reductions. What is "saved" here is possibly the same activity that the no-pep finding praised as an advantage — the cost calculation depends on how one values "more refactoring".

---

## Hypothesis status

| Hypothesis | Status | Evidence |
|---|---|---|
| **H1** Effects additive | refuted | `refactorings_applied` combined = 3.8 vs. additive prediction ~9.1; even below baseline 4.1 |
| **H2** Effects saturated / shared mechanism | partially confirmed | `tests_passed_immediately` saturates exactly at the no-pep value; but anti-additivity for `refactorings_applied` is more than pure saturation |
| **H3** Correctness invariant | confirmed | 100/100/100/100 in both correctness metrics and `completed_within_budget` |
| **H4** Code quality indistinguishable | confirmed | all Δ < 1σ; trophy distribution (no-pep 3×, no-emoji 2×, combined 0×) without a clear winner |
| **H5** Token cost combined higher than hybrid | refuted (with inverse trend) | combined is even **faster** than the baseline (-15 %), because of fewer refactor phases |

**Consequence for the reduction recipe:** pep and emoji are **not orthogonal** as reduction levers — their combination produces qualitatively different behaviour than the sum of the single effects. A combined exact-hybrid-v2.3-no-pep-no-emoji-cc variant is interesting as the "fastest hybrid-v2 workflow without correctness loss", but sacrifices part of the refactor activity that the single reductions showed as a positive discipline effect. Which of these readings ("faster & leaner" vs. "less disciplined") prevails depends on the application context and should be validated on a more complex kata (claim-office) as the next step, before exact-hybrid-v2.3-no-pep-no-emoji-cc is adopted as a recipe recommendation.

**Caveat routing asymmetry:** the 5 new exact-hybrid-v2.3-no-pep-no-emoji-cc runs went via the Portkey gateway, the 15 reused baseline runs via direct API. The `duration_seconds` difference could partly be a routing artifact (Portkey latency usually differs from direct). The discipline findings (`refactorings_applied`, `tests_passed_immediately`) and correctness findings should be routing-independent.
