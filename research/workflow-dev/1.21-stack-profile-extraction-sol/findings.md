# Sol stack-profile extraction — fresh comparison

## Overview

Baseline: `exact-sol-v1-pi`. Extracted: `exact-sol-v1.3-stack-profile-pi`.
Model: `gpt-5-6-sol-codex`, pi 0.81.1, subscription route, example-mapping.
Same image and development dependency environment; five runs per cell.
Only the prespecified fresh cohort is included; no exclusions or replacements.

### Game of Life

| Outcome | Baseline | Extracted |
|---|---:|---:|
| Correctness (external), mean | 100% | 100% |
| Correctness (internal), success rate | 100% | 100% |
| Completed within budget | 100% | 100% |
| `cycle_count` | 9.8 | 9.8 |
| `refactorings_applied` (markers) | 9.8 | 9.8 |
| Prediction accuracy (pooled) | 100% (48/48) | 100% (50/50) |
| `tests_passed_immediately` (not measured) | 0 | 0 |
| `cc_avg_loc_per_function` | 7.44 | 6.63 |
| Complexity Peak | 14.0 | 13.0 |
| `cognitive_max` | 4.2 | 4.2 |
| `mccabe_max` | 4.4 | 4.4 |
| Smell Total | 0 | 0 |
| Code Mass (APP) | 156.8 | 155.4 |
| Duration (seconds) | 400.2 | 416.8 |
| `total_tokens` | 0.933 M | 1.036 M |
| `cost_usd` | $1.03 | $1.10 |

### Claim Office

| Outcome | Baseline | Extracted |
|---|---:|---:|
| Correctness (external), mean | 100% | 100% |
| Correctness (internal), success rate | 100% | 100% |
| Completed within budget | 100% | 100% |
| `cycle_count` | 33.4 | 32.6 |
| `refactorings_applied` (markers) | 33.2 | 32.6 |
| Prediction accuracy (pooled) | 99.3% (137/138) | 100% (173/173) |
| `tests_passed_immediately` (not measured) | 0 | 0 |
| `cc_avg_loc_per_function` | 7.42 | 7.69 |
| Complexity Peak, lower is better | 20.8 | **17.0** 🏆 |
| `cognitive_max` | 4.8 | 4.2 |
| `mccabe_max` | 5.6 | 4.6 |
| Smell Total | 0 | 0 |
| Code Mass (APP) | 562.6 | 566.6 |
| Duration (seconds) | 1083.8 | 1158.8 |
| `total_tokens` | 4.869 M | 4.925 M |
| `cost_usd` | $3.66 | $3.65 |

Values are means unless stated otherwise. Correctness and prediction accuracy
are higher-is-better; code-size, complexity, smells, duration and cost are
lower-is-better only for correct solutions. All cells pass the 0.90 correctness
gate. No cross-kata comparison is made. Only the Complexity Peak contrast
exceeds both cell standard deviations; other differences are tied or below the
larger within-cell standard deviation, so no winner is assigned there. The trophy
is descriptive, not a significance test or a general superiority claim.

## F-1.21.3 — Claim Office has a lower Complexity Peak with extraction

The extracted workflow's longest function averages 3.8 fewer lines (18.3%).
This exceeds each cell's standard deviation while both arms retain perfect
internal and external correctness.

| Claim Office outcome | Baseline, mean ± SD | Extracted, mean ± SD |
|---|---:|---:|
| Complexity Peak | 20.8 ± 2.39 | 17.0 ± 2.83 |
| `cc_avg_loc_per_function` | 7.42 ± 1.04 | 7.69 ± 1.42 |
| Code Mass (APP) | 562.6 ± 48.81 | 566.6 ± 51.91 |
| `cognitive_max` | 4.8 ± 2.39 | 4.2 ± 0.84 |
| `mccabe_max` | 5.6 ± 1.52 | 4.6 ± 0.55 |

This is a narrow code-shape signal: neither average function length nor Code
Mass (APP) shows a similarly separated contrast. Complexity Peak measures lines,
not cognitive complexity. With five runs per cell and multiple outcomes, this
is exploratory evidence, not proof of a universal improvement.

## Overall interpretation

All 20 runs pass internal and external verification and finish within budget.
The four transcript spot-checks cover both arms and katas: each reads its stack
profile before test creation, follows phase transitions, and reports final green
gates and DONE. No observed correctness or completion regression is present.

Duration differences are small relative to variation: Game of Life is
400.2 ± 25.76 versus 416.8 ± 56.81 seconds (+4.1%); Claim Office is
1083.8 ± 251.77 versus 1158.8 ± 200.80 seconds (+6.9%). List-price costs are
$1.03 ± $0.09 versus $1.10 ± $0.15, and $3.66 ± $1.03 versus $3.65 ± $0.70,
respectively. These data do not establish a clear runtime or cost penalty.

The results support using the extracted workflow on these two katas: correctness
is preserved in the observed sample, most measured outcomes are close, and Claim
Office has a smaller Complexity Peak. They do not prove statistical equivalence,
absence of rare failures, or neutrality on other tasks/models. No equivalence
margin or formal equivalence test was prespecified. Shard order was balanced by
rotation, not randomized; service variability remains possible.

Measurement caveats: `tests_passed_immediately` is hardcoded to zero by the pi
parser, so already-green behavior cannot be inferred from it. Refactor markers
include no-op reviews, not only actual code improvements. Prediction accuracy
covers parsed blocks, not all prose predictions; perfect parsed accuracy is not
proof of perfect foresight. Costs are token-derived list-price equivalents,
not subscription invoices. All four cost cells contain five nonzero values.

Data and reproducibility: [summary.md](summary.md), [runs.csv](runs.csv), and
the prespecified protocol in [fresh-20260913.md](fresh-20260913.md).
