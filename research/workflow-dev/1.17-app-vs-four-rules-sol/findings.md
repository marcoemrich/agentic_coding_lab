# Findings — RQ-app-vs-four-rules-sol

## Übersicht

Claim Office, example-mapping, OpenAI subscription route, `gpt-5-6-sol-codex`
(including the documented equivalent label). Three cells, five runs each.
Floor = `baseline-inline-tdd-v1-pi`; Four Rules = `exact-sol-v1-pi`;
APP = `exact-hybrid-v4.2-phase-continuation-pi`.

| Outcome | Floor | Four Rules | APP |
|---|---:|---:|---:|
| Correctness (external) | 100% | 100% | 100% |
| Correctness (internal) | 100% | 100% | 100% |
| Completed within budget | 100% | 100% | 100% |
| `cc_avg_loc_per_function` | 8.45 ± 2.41 | 7.42 ± 1.04 | 9.52 ± 5.69 |
| `cc_median_loc_per_function` | 6.10 ± 1.82 | 4.50 ± 0.87 | 6.00 ± 3.67 |
| Complexity Peak | 27.0 ± 11.34 | 20.8 ± 2.39 | 24.0 ± 13.17 |
| `cognitive_max` | 11.4 ± 10.01 | 4.8 ± 2.39 | 8.2 ± 4.66 |
| `cognitive_avg` | 3.40 | 2.10 | 3.55 |
| `mccabe_max` | 9.8 | 5.6 | 6.2 |
| Smell Total | 4.2 | 0.0 | 9.6 |
| Code Mass (APP), mechanism witness | 750.0 | 562.6 | 492.4 |
| `cycle_count` | n/a | 33.4 | 28.0 |
| `refactorings_applied`, markers | n/a | 33.2 | 14.2 |
| Prediction accuracy, pooled | n/a | 99.3% | 99.3% |
| Duration, seconds (lower is better) | **218.2** 🏆 | 1083.8 | 1265.6 |
| `total_tokens` (lower is better) | **0.272 M** 🏆 | 4.869 M | 4.610 M |
| `cost_usd` (lower is better) | **$0.58** 🏆 | $3.66 | $4.84 |

Mean ± sample SD where shown; all cells clear the 0.90 correctness gate.
The floor is clearly cheaper than either structured arm. No general quality
winner is assigned: wide replicate variation, the APP subgroup split, and cohort
confounds prevent interpreting rounded ranks as a stable contest. Code Mass is
a mechanism witness, not a quality trophy. Marker counts are not comparable
with the marker-free floor or equivalent to verified improvements.

**Cohort limitation:** the Four Rules reference consists of five September 13
fresh-comparison runs; the other cells are historical. Date, dependency environment
and possibly service/harness drift therefore confound contrasts involving that
reference. These are query-based observations, not a same-image causal experiment.
Costs were recomputed from list prices, not subscription invoices. Full pivots and
run identities are in [summary.md](summary.md) and [runs.csv](runs.csv).

## F-1.17.1 — The APP cell combines low Code Mass with weak average decomposition

| Metric | Floor | Four Rules | APP |
|---|---:|---:|---:|
| Code Mass (APP) | 750.0 | 562.6 | 492.4 |
| `cc_avg_loc_per_function` | 8.45 | 7.42 | 9.52 |
| Complexity Peak | 27.0 | 20.8 | 24.0 |

The APP arm has the lowest mass and highest average function length, but not
the highest Complexity Peak. Its refactor brief prices invocations, making
inlining a plausible mechanism. The data do not isolate that cause: architecture,
phase vocabulary and cohort also differ. The APP average-function contrast with
Four Rules (2.10 lines) is smaller than the APP cell's SD (5.69). Prefer the
Four Rules arm provisionally for its zero smells and tighter observed structure,
not as a demonstrated causal effect of removing APP.

## F-1.17.2 — The APP sample contains two distinct structural groups

The documented source inspection partitions the same five APP runs as follows:

| Group | n | Functions | Average function length | `cognitive_max` | Smell Total | Code Mass (APP) | Refactor markers |
|---|---:|---:|---:|---:|---:|---:|---:|
| A | 2 | 11.5 | 6.42 | 5.0 | 0.0 | 553 | 14.5 |
| B | 3 | 3.3 | 11.58 | 10.3 | 16.0 | 452 | 14.0 |

Group B carries the low-mass, poorly decomposed pattern; it includes a longest
function of 44 lines. Similar refactor counts do not establish similar effective
refactoring. Group A is closer to the Four Rules profile (7.42 average function
length, zero smells). This five-run partition is descriptive; it cannot establish
population bimodality or the frequency of either regime.

## F-1.17.3 — The proposed blind-spot signature is incomplete

| APP outcome | Mean |
|---|---:|
| `cognitive_max` | 8.2 |
| Smell Total | 9.6 |
| Code Mass (APP) | 492.4 |

The APP cell's low mass is not accompanied by universally favourable complexity
metrics. In Group B, too few function boundaries remain for callback-related
complexity resets to hide the structure. This is consistent with an inlining
mechanism, but does not identify it against a general workflow effect. Testing
only removal of the APP table within an otherwise identical workflow remains
the discriminating follow-up.

## F-1.17.4 — APP has higher observed cost, while its duration contrast is uncertain

| Metric | Four Rules, mean ± SD | APP, mean ± SD |
|---|---:|---:|
| Duration, seconds | 1083.8 ± 251.77 | 1265.6 ± 125.46 |
| `total_tokens` | 4.869 M ± 1.617 M | 4.610 M ± 0.895 M |
| `cost_usd` | $3.66 ± $1.03 | $4.84 ± $0.81 |

APP uses about 17% more time and 32% higher list-price cost, despite slightly
fewer total tokens. Total tokens alone do not determine cost because input,
output and cache-read prices differ. The duration gap is below the Four Rules
SD and is cohort-confounded. Both structured cells are substantially more
expensive than the floor at the same observed external correctness.

## Recommendation and scope

Four Rules is the provisional structured choice; the floor remains attractive
when cost dominates. No claim here proves that the APP table alone causes the
structural subgroup or that the pattern generalizes to Opus, Requesty, or other
katas. Needed follow-ups are a contemporaneous controlled brief swap and more
replicates to estimate the low-decomposition regime's frequency.
