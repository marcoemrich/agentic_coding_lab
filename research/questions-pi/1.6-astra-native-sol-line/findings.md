# Findings — RQ-astra-native-sol

## Overview

Claim Office, example-mapping, pi harness and OpenAI subscription route.
Eight cells × five runs = 40 runs. Floor = `baseline-inline-tdd-v1-pi`;
Inline = `exact-sol-v1-pi`; Isolated = `exact-sol-v1.1-subagent-pi`;
EXACT = `exact-hybrid-v4.2-phase-continuation-pi`.
Astra = `gpt-6-astra-codex-no-thinking`; Sol = `gpt-5-6-sol-codex`, with the
README's documented equivalent labels. All cells have 100% internal correctness
and completion within budget.

### Astra

| Outcome | Floor | Inline | Isolated | EXACT |
|---|---:|---:|---:|---:|
| Correctness (external) | 100% | 100% | 100% | 100% |
| `cc_avg_loc_per_function` | 27.93 | 6.17 | 7.34 | 12.83 |
| `cc_median_loc_per_function` | 26.8 | 4.8 | 6.9 | 11.8 |
| Complexity Peak | 32.6 | 13.4 | 14.0 | 19.8 |
| `cognitive_max` | 13.8 | 3.2 | 4.0 | 5.2 |
| `cognitive_avg` | 6.10 | 2.36 | 2.48 | 2.64 |
| `mccabe_max` | 8.6 | 4.2 | 5.0 | 6.2 |
| Smell Total, lower is better | 16.6 | **0.0** 🏆 | **0.0** 🏆 | 15.4 |
| Production LoC | 59.4 | 73.6 | 72.2 | 58.0 |
| Code Mass (APP) | 367.6 | 426.2 | 440.4 | 348.2 |
| `cc_functions` | 1.8 | 7.4 | 5.6 | 2.8 |
| `cycle_count` | n/a | 40.4 | 39.4 | 42.4 |
| Refactor markers | n/a | 40.4 | 39.4 | 23.6 |
| Prediction accuracy, pooled | n/a | 98.7% | 99.2% | 99.7% |
| Duration, seconds (lower is better) | **343.8** 🏆 | 1801.6 | 4186.2 | 2565.4 |
| Tokens (lower is better) | **0.529 M** 🏆 | 7.459 M | 12.230 M | 7.163 M |

### Sol

| Outcome | Floor | Inline | Isolated | EXACT |
|---|---:|---:|---:|---:|
| Correctness (external) | 100% | 100% | 93% | 100% |
| `cc_avg_loc_per_function` | 8.45 | 7.42 | 7.75 | 9.52 |
| `cc_median_loc_per_function` | 6.1 | 4.5 | 5.9 | 6.0 |
| Complexity Peak | 27.0 | 20.8 | 18.4 | 24.0 |
| `cognitive_max` | 11.4 | 4.8 | 4.8 | 8.2 |
| `cognitive_avg` | 3.40 | 2.10 | 2.33 | 3.55 |
| `mccabe_max` | 9.8 | 5.6 | 5.0 | 6.2 |
| Smell Total | 4.2 | 0.0 | 0.0 | 9.6 |
| Production LoC | 164.0 | 117.6 | 161.0 | 110.4 |
| Code Mass (APP) | 750.0 | 562.6 | 618.0 | 492.4 |
| `cc_functions` | 14.2 | 8.4 | 11.6 | 6.6 |
| `cycle_count` | n/a | 33.4 | 33.2 | 28.0 |
| Refactor markers | n/a | 33.2 | 32.2 | 14.2 |
| Prediction accuracy, pooled | n/a | 99.3% | 99.4% | 99.3% |
| Duration, seconds (lower is better) | **218.2** 🏆 | 1083.8 | 2397.2 | 1265.6 |
| Tokens (lower is better) | **0.272 M** 🏆 | 4.869 M | 7.126 M | 4.610 M |

Means; all sample SDs and ranges appear in [summary.md](summary.md). Trophies
compare workflows within each model, not an implicit eight-cell contest. Only
clear contrasts are marked; ties at a universal ceiling are not crowned. All
cells meet the standard 0.90 correctness gate, including Sol Isolated, though
its failure matters for the RQ's stricter recommendation criterion. Code Mass,
function counts and marker counts are not quality rankings. Low Production LoC
can accompany very weak decomposition, so it carries no trophy here.

**Cohort limitation:** Astra's cells are September 5 runs; Sol Inline consists
of September 13 fresh-comparison runs, while the remaining Sol cells are August
runs. Date/environment confounds all cross-model contrasts and also Sol's
within-model Inline contrasts. Astra's within-model comparisons retain their
shared cohort. No new experiments or analysis-pipeline reruns were performed
for this update; existing metrics were reaggregated and costs recomputed.

## F-1.6.1 — The native inline arm has better observed quality means than EXACT

| Outcome | Astra Inline | Astra EXACT | Sol Inline | Sol EXACT |
|---|---:|---:|---:|---:|
| Average function length | 6.17 | 12.83 | 7.42 | 9.52 |
| Median function length | 4.8 | 11.8 | 4.5 | 6.0 |
| Complexity Peak | 13.4 | 19.8 | 20.8 | 24.0 |
| `cognitive_max` | 3.2 | 5.2 | 4.8 | 8.2 |
| `mccabe_max` | 4.2 | 6.2 | 5.6 | 6.2 |
| Smell Total | 0.0 | 15.4 | 0.0 | 9.6 |

Correctness is perfect in all four cells. The Astra cognitive-peak difference
(2.0, SDs 0.45 and 0.84) is clearer than its noisy function-length contrast
(EXACT SD 7.61). The workflow line is demonstrably usable on Astra, but these
bundled workflow contrasts do not identify APP alone as the cause. Sol's
reference comparison additionally carries the cohort limitation.

## F-1.6.2 — Low APP mass accompanies weaker structure in both EXACT samples

| Model / arm | Code Mass (APP) | Production LoC | Functions |
|---|---:|---:|---:|
| Astra Inline | 426.2 | 73.6 | 7.4 |
| Astra Isolated | 440.4 | 72.2 | 5.6 |
| Astra EXACT | 348.2 | 58.0 | 2.8 |
| Sol Inline | 562.6 | 117.6 | 8.4 |
| Sol EXACT | 492.4 | 110.4 | 6.6 |

The APP-priced invocation mechanism could encourage inlining, consistent with
low mass and fewer functions. But the brief also differs in architecture and
phase vocabulary; source inspection plus these means does not isolate causality.
The explicit clarity guard is not a guarantee that output stays decomposed.

## F-1.6.3 — Astra's floor concentrates the task into very few counted functions

| Floor outcome | Astra | Sol |
|---|---:|---:|
| Functions | 1.8 | 14.2 |
| Average function length | 27.93 | 8.45 |
| Complexity Peak | 32.6 | 27.0 |
| Smell Total | 16.6 | 4.2 |

The documented source inspection found domain logic inside nested callback chains
in a small number of named functions. Correctness is perfect, but low LoC is
not sufficient evidence of parsimony. Astra's native arms avoid this observed
shape. The model comparison is date-confounded; generalization beyond this kata
requires another controlled experiment.

## F-1.6.4 — Astra isolation adds substantial time without a clear quality gain

| Astra outcome | Inline | Isolated |
|---|---:|---:|
| Average function length | 6.17 | 7.34 |
| Complexity Peak | 13.4 | 14.0 |
| `cognitive_max` | 3.2 | 4.0 |
| Duration, seconds | 1801.6 | 4186.2 |
| Tokens | 7.459 M | 12.230 M |

Isolation costs 2.32× the observed time, with no better quality mean on these
measures and perfect correctness in both arms. Sol shows 2.21× time on Claim
Office, but that contrast is not contemporaneous. These observations do not
establish that isolation is inherently harmful on every model or task.

## F-1.6.5 — Astra correctness saturates across all four workflows

| Model | Perfect external runs | Internal tests green |
|---|---:|---:|
| Astra | 20/20 | 20/20 |
| Sol | 19/20 | 20/20 |

The Sol miss belongs to Isolated: one run passes 10/15 scenarios, yielding a
cell mean near 93%. It exits normally and builds its CLI, so it is not an
infrastructure exclusion. One miss does not reliably estimate a failure rate.
Astra's all-green sample does not prove an absence of rare failures.

## F-1.6.6 — Astra uses more observed time and tokens at every workflow

| Workflow | Astra seconds | Sol seconds | Time ratio | Astra tokens | Sol tokens |
|---|---:|---:|---:|---:|---:|
| Floor | 343.8 | 218.2 | 1.58× | 0.529 M | 0.272 M |
| Inline | 1801.6 | 1083.8 | 1.66× | 7.459 M | 4.869 M |
| Isolated | 4186.2 | 2397.2 | 1.75× | 12.230 M | 7.126 M |
| EXACT | 2565.4 | 1265.6 | 2.03× | 7.163 M | 4.610 M |

Token ratios range roughly 1.53–1.94×. Astra also has more marker-counted cycles
in every structured arm (39.4–42.4 versus 28.0–33.4). More iterations may explain
part of the gap, but model throughput cannot be separated from date, environment
or test-list granularity here. This is a cohort association, not an isolated
model-speed estimate.

## F-1.6.7 — Astra uses fewer Production LoC across the observed workflows

| Workflow | Astra | Sol | Astra/Sol |
|---|---:|---:|---:|
| Floor | 59.4 | 164.0 | 0.36 |
| Inline | 73.6 | 117.6 | 0.63 |
| Isolated | 72.2 | 161.0 | 0.45 |
| EXACT | 58.0 | 110.4 | 0.53 |

Astra's Inline Complexity Peak is 13.4 ± 2.79 versus Sol's 20.8 ± 2.39, but
average function lengths (6.17 ± 1.59 versus 7.42 ± 1.04) overlap variation.
The source is shorter without losing observed external correctness in these
Inline cells. In Floor/EXACT, low LoC accompanies fewer, longer functions; it
cannot be read as the same quality benefit. The Isolated correctness difference
also prevents treating every row as identical completeness.

## Caveats and scope

- One kata and one prompt style; no general result about small tasks or other routes.
- Five replicates and many outcomes: SD separation is descriptive, not a formal
  significance or equivalence test.
- Refactor markers include no-op reviews. Ratios to cycles reflect formatting and
  workflow contract, not verified improvements. For example, Sol Inline's means
  are 33.2/33.4, not an exact one-to-one identity.
- Pooled prediction accuracy (98.7–99.7% in structured cells) covers parsed blocks,
  not missing predictions. Already-green cycles need not produce failure blocks.
- `cost_usd` is not a declared outcome. The recomputed CSV costs use the lab's
  list-price table, not pi's inline costs or subscription invoices. Astra's
  undeclared model configuration makes inline pricing and context limits unsafe
  to interpret; transcript model identity is distinct from pricing metadata.
- Phase timing/context metrics are parser-limited on this route and remain outside
  the interpretation. The `-no-thinking` label does not establish reasoning off.

The practical preference is native Inline for structured Astra work in this
sample, with the floor as the cheap but poorly decomposed alternative. Fresh
same-image comparisons, and a brief-only intervention, are needed before
turning cross-model or APP-mechanism associations into causal claims.
