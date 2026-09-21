# Forced Ponytail on SOL/pi — Findings

## Overview

Baseline: `exact-sol-v1.3-stack-profile-pi`. Ponytail: `exact-sol-v1.3.1-ponytail-pi` with forced `full` activation. Model: `gpt-5-6-sol-codex`, pi, subscription route, example-mapping, n=5 per cell. Lower is better for code-size, function-length, complexity, smell and cost outcomes; higher is better for correctness and Mutation Score. Results are separated by kata.

### Game of Life

| Outcome | Baseline | Ponytail |
|---|---:|---:|
| Correctness (external) | **100%** 🏆 | **100%** 🏆 |
| Correctness (internal) | **100%** 🏆 | **100%** 🏆 |
| Mutation Score | 0.91 ± 0.09 | 0.95 ± 0.04 |
| Unnoticed Changes | 5.4 ± 6.50 | 2.0 ± 1.41 |
| Mutant Population | 53.2 ± 11.12 | 39.0 ± 1.87 |
| Code Mass (APP) | 155.4 ± 9.24 | **139.8 ± 12.03** 🏆 |
| Production LoC | 34.0 ± 3.32 | **23.4 ± 1.67** 🏆 |
| `cc_functions` | 4.0 ± 0.71 | 2.2 ± 0.84 |
| `cc_avg_loc_per_function` | 6.63 ± 1.41 | 9.53 ± 4.27 |
| `cc_median_loc_per_function` | 4.6 ± 1.52 | 7.6 ± 6.19 |
| Complexity Peak | 13.0 ± 4.00 | 16.4 ± 1.52 |
| `cognitive_max` | 4.2 ± 1.79 | 4.0 ± 0.00 |
| `cognitive_avg` | 2.77 ± 0.52 | 2.87 ± 0.30 |
| `cognitive_high_count` | 0 | 0 |
| `mccabe_max` | 4.4 ± 0.55 | 4.0 ± 0.00 |
| `mccabe_avg` | 2.06 ± 0.30 | 2.00 ± 0.00 |
| `mccabe_high_count` | 0 | 0 |
| Smell Total | 0 | 0 |
| `smell_complexity` | 0 | 0 |
| `smell_duplication` | 0 | 0 |
| `smell_magic_numbers` | 0 | 0 |
| `smell_code_quality` | 0 | 0 |
| Test LoC | 53.4 ± 8.99 | 45.2 ± 2.95 |
| Duration | 416.8 ± 56.81 s | 502.8 ± 119.21 s |
| Tokens | 1.036 ± 0.214 M | 1.072 ± 0.112 M |
| Cost | $1.10 ± $0.15 | $1.14 ± $0.13 |

### Claim Office

| Outcome | Baseline | Ponytail |
|---|---:|---:|
| Correctness (external) | **100%** 🏆 | **100%** 🏆 |
| Correctness (internal) | **100%** 🏆 | **100%** 🏆 |
| Mutation Score | 0.88 ± 0.05 | 0.87 ± 0.05 |
| Unnoticed Changes | 14.0 ± 8.22 | 15.6 ± 6.80 |
| Mutant Population | 116.6 ± 17.30 | 116.6 ± 10.64 |
| Code Mass (APP) | 566.6 ± 51.91 | 532.0 ± 37.85 |
| Production LoC | 131.6 ± 19.06 | **96.8 ± 11.69** 🏆 |
| `cc_functions` | 8.4 ± 1.95 | 5.6 ± 1.52 |
| `cc_avg_loc_per_function` | 7.69 ± 1.42 | 8.70 ± 1.92 |
| `cc_median_loc_per_function` | 5.7 ± 1.30 | 8.5 ± 3.43 |
| Complexity Peak | 17.0 ± 2.83 | 17.0 ± 2.45 |
| `cognitive_max` | 4.2 ± 0.84 | 5.8 ± 2.05 |
| `cognitive_avg` | 2.16 ± 0.36 | 2.69 ± 0.62 |
| `cognitive_high_count` | 0 | 0 |
| `mccabe_max` | 4.6 ± 0.55 | 6.2 ± 1.64 |
| `mccabe_avg` | 1.95 ± 0.31 | 1.95 ± 0.33 |
| `mccabe_high_count` | 0 | 0 |
| Smell Total | 0 | 0 |
| `smell_complexity` | 0 | 0 |
| `smell_duplication` | 0 | 0 |
| `smell_magic_numbers` | 0 | 0 |
| `smell_code_quality` | 0 | 0 |
| Test LoC | 192.4 ± 34.31 | 199.8 ± 25.83 |
| Duration | 1158.8 ± 200.80 s | 1048.8 ± 91.76 s |
| Tokens | 4.925 ± 1.073 M | 5.415 ± 1.104 M |
| Cost | $3.65 ± $0.70 | $4.02 ± $0.77 |

A trophy requires a meaningful separated contest. All cells pass the correctness gate. Correctness trophies mark the exact tie. Production LoC separates by more than both cell standard deviations on both katas; Game of Life Code Mass (APP) does too. No trophy is assigned to identical high-count/smell rows or to differences within ordinary replicate variation. Function count is reported as code shape rather than ranked as intrinsically good or bad.

## F-1.22.1 — Ponytail substantially reduces Production LoC

Forced Ponytail produces less production code on both katas while all 20 runs retain perfect internal and external correctness. The reduction is 10.6 lines (31.2%) on Game of Life and 34.8 lines (26.4%) on Claim Office; each difference exceeds both cells' standard deviations.

| Kata | Baseline Production LoC | Ponytail Production LoC | Change |
|---|---:|---:|---:|
| Game of Life | 34.0 ± 3.32 | 23.4 ± 1.67 | −31.2% |
| Claim Office | 131.6 ± 19.06 | 96.8 ± 11.69 | −26.4% |

Code Mass (APP) confirms the effect on Game of Life (155.4 ± 9.24 to 139.8 ± 12.03, −10.0%). Claim Office points in the same direction (566.6 ± 51.91 to 532.0 ± 37.85, −6.1%) but remains within ordinary cell variation. Ponytail therefore has a strong LoC effect and a narrower, kata-dependent Code Mass (APP) effect.

## F-1.22.2 — The reduction comes from fewer functions, not shorter functions

Ponytail reduces the function count on both katas, but does not improve function-length decomposition. Mean and median function length rise, and Complexity Peak is unchanged on Claim Office and directionally higher on Game of Life.

| Kata | Workflow | Functions | Mean function LoC | Median function LoC | Complexity Peak |
|---|---|---:|---:|---:|---:|
| Game of Life | Baseline | 4.0 ± 0.71 | 6.63 ± 1.41 | 4.6 ± 1.52 | 13.0 ± 4.00 |
| Game of Life | Ponytail | 2.2 ± 0.84 | 9.53 ± 4.27 | 7.6 ± 6.19 | 16.4 ± 1.52 |
| Claim Office | Baseline | 8.4 ± 1.95 | 7.69 ± 1.42 | 5.7 ± 1.30 | 17.0 ± 2.83 |
| Claim Office | Ponytail | 5.6 ± 1.52 | 8.70 ± 1.92 | 8.5 ± 3.43 | 17.0 ± 2.45 |

The function-count differences exceed both cells' standard deviations, whereas the function-length differences generally do not. The mechanism is nevertheless consistent across katas: Ponytail removes elements and consolidates behavior rather than decomposing it into smaller functions. This is genuine code reduction, but not a broad win across every code-quality dimension.

## F-1.22.3 — Correctness and Mutation Score show no safety erosion

All four cells reach 100% Correctness (internal), 100% Correctness (external), and 100% completion within budget. Mutation Score remains within replicate variation on both katas.

| Kata | Baseline Mutation Score | Ponytail Mutation Score | Baseline Test LoC | Ponytail Test LoC |
|---|---:|---:|---:|---:|
| Game of Life | 0.91 ± 0.09 | 0.95 ± 0.04 | 53.4 ± 8.99 | 45.2 ± 2.95 |
| Claim Office | 0.88 ± 0.05 | 0.87 ± 0.05 | 192.4 ± 34.31 | 199.8 ± 25.83 |

The smaller Game of Life test suites do not have weaker mutation sensitivity in this sample. Claim Office Test LoC and Mutation Score are effectively unchanged.

The mutant counts behind the score settle what the ratio alone could not: whether an unchanged score merely reflects less code to defend.

| Kata | Arm | Mutant Population | Unnoticed Changes | Production LoC | Mutants per LoC |
|---|---|---:|---:|---:|---:|
| Game of Life | Baseline | 53.2 | 5.4 | 34.0 | 1.56 |
| Game of Life | Ponytail | 39.0 | 2.0 | 23.4 | 1.67 |
| Claim Office | Baseline | 116.6 | 14.0 | 131.6 | 0.89 |
| Claim Office | Ponytail | 116.6 | 15.6 | 96.8 | 1.20 |

On Claim Office the population is identical to the first decimal — 116.6 mutants in both arms — while Production LoC falls by 26%. Ponytail removes lines that carry no mutable behaviour and leaves the mutable logic untouched, which raises mutant density from 0.89 to 1.20 per line. The unchanged score is therefore a like-for-like comparison, not an artefact of a smaller denominator, and the unnoticed changes (14.0 against 15.6) are a tie within replicate variation.

On Game of Life the population falls roughly in proportion to the code (53.2 to 39.0 against 34.0 to 23.4 Production LoC, density 1.56 to 1.67), so part of the score gain there is the smaller denominator. The absolute gap falls as well, from 5.4 to 2.0, but that difference rests on a single baseline run that left 17 mutants unnoticed against 2, 2, 3, 3 for its four siblings. Treat the Game of Life improvement as one outlier, not as an effect.

The observed production-code reduction is therefore not explained by omitted externally verified behavior or an evidently weaker self-written suite.

## F-1.22.4 — Complexity, smells and operating cost do not show a general improvement

Smell Total and every smell subgroup remain zero in all cells. Cognitive and McCabe outcomes are mostly mixed or within variation: Claim Office has directionally higher maxima under Ponytail, while Game of Life is flat. No high-threshold complexity count fires.

Ponytail also provides no separated duration, token or cost saving. Game of Life is directionally slower (502.8 versus 416.8 seconds); Claim Office is directionally faster (1048.8 versus 1158.8 seconds) but uses more tokens and list-price cost. Every difference remains within at least one cell's standard deviation.

The practical result is specific: Ponytail buys substantially less production code, not a universal improvement across complexity, smells, speed or cost.

## Treatment fidelity and caveats

- All ten candidate runs read `.pi/skills/ponytail/SKILL.md` before implementation and used the default `full` level. Nine emitted the exact lab confirmation `Ponytail full loaded`; one Claim Office run read the full skill but omitted that confirmation string. It is retained and reported as a marker-compliance miss, not excluded or replaced.
- Every candidate run passes internal and external verification. Cycle and Refactor markers remain healthy: 9.6/9.6 on Game of Life and 31.4/31.4 on Claim Office. The baseline has 9.8/9.8 and 32.6/32.6 respectively.
- Baseline runs are the fresh September 13 cohort from RQ-1.21; Ponytail runs were executed September 14. The image, model route, harness, prompt and workflow base are held constant, but day-level service drift is not randomized away.
- All 20 green runs produced a Mutation Score. The mutation runner isolates host-pnpm deprecation output from CLI tests that assert empty stderr, without changing the recorded source or tests.
- Five replicates per cell are exploratory. The findings establish large observed LoC reductions, not population-level equivalence or statistical significance.
- `tests_passed_immediately` is not interpreted because the pi parser hardcodes it to zero. Refactor counts are phase markers and include no-change reviews.
- Cost is a token-derived list-price equivalent, not a subscription invoice.
