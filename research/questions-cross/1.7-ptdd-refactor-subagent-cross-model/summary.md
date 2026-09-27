# RQ-ptdd-refactor-subagent-cross-model — Aggregation

_Does isolating only the per-cycle Refactor phase improve PTDD v1 product structure enough to justify its context cost on native Opus and GPT-5.6 SOL/pi?_

Generated: 2026-09-27T09:15:47Z

Cells declared: 4 · matched runs: 45 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-no-thinking | 15 | 15 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking | 10 | 9 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex | 15 | 15 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |   0.99 |  0.93 |     1 |  0.02 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 |   0.97 |  0.8  |     1 |  0.06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                         | cell_workflow                        | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      15 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      15 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                        | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      15 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      15 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 |       9 |       90 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |       5 |      100 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |   6    |  4.89 |  8.1  |  1    |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |   6.14 |  4.53 |  8    |  1.09 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 |   4.74 |  4.23 |  5.57 |  0.37 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   4.21 |  3.62 |  4.66 |  0.4  |

### cc_median_loc_per_function

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |   4.8  |     3 |     7 |  1.16 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |   5    |     2 |     8 |  1.66 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 |   3.35 |     3 |     5 |  0.63 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   3    |     3 |     3 |  0    |

### cc_longest_function

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |  18.53 |     9 |    25 |  5.13 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |  17.8  |    12 |    23 |  2.93 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 |  15    |    11 |    19 |  2.45 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  15.8  |    12 |    19 |  3.56 |

### cc_functions

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |   25.2 |    20 |    32 |  4.38 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |   14.6 |     8 |    22 |  4.5  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 |   38.4 |    30 |    44 |  4.62 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   32.2 |    28 |    39 |  4.66 |

### cognitive_max

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |   2.73 |     2 |     5 |  0.88 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |   4.07 |     2 |     7 |  1.22 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 |   2.6  |     2 |     5 |  1.07 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   2.6  |     2 |     4 |  0.89 |

### cognitive_avg

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |   1.44 |  1.13 |  1.92 |  0.27 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |   1.86 |  1.25 |  2.43 |  0.35 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 |   1.22 |  1.06 |  1.67 |  0.18 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   1.24 |  1.08 |  1.75 |  0.29 |

### mccabe_max

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |   3.27 |     3 |     4 |  0.46 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |   4.73 |     3 |     7 |  1.44 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 |   3.2  |     3 |     5 |  0.63 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   3.6  |     3 |     4 |  0.55 |

### smell_total

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |

### code_mass

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 | 706.73 |   646 |   896 |  62.07 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 | 616.47 |   519 |   834 |  87.1  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 | 921.1  |   689 |  1152 | 137.64 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 | 685.4  |   628 |   776 |  63.25 |

### cc_loc

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 | 243.87 |   210 |   310 |  32.81 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 | 149.33 |   100 |   195 |  29.27 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 | 447.9  |   247 |   724 | 142.72 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 | 224    |   200 |   272 |  27.94 |

### refactorings_applied

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |  47.2  |    15 |    68 | 15.33 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |  39.47 |    11 |    48 |  8.6  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 |  39.6  |    17 |    59 | 13.63 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  37.2  |    35 |    41 |  2.28 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                        | cell_model         |   n |   correct |   total |   rate_% |
|:-----------------------------|:-------------------------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      1415 |    1430 |     99   |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      1204 |    1209 |     99.6 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 |       958 |     984 |     97.4 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |       370 |     370 |    100   |

### duration_seconds

| kata                         | cell_workflow                        | cell_model         |   n |    mean |   min |   max |     std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|--------:|------:|------:|--------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 | 1103    |   679 |  1999 |  310.97 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 | 1573.93 |   637 |  2208 |  495.01 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 | 4624    |  2479 |  7201 | 1422.45 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 | 4927    |  4434 |  5934 |  610.52 |

### total_tokens

| kata                         | cell_workflow                        | cell_model         |   n |        mean |      min |      max |         std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|------------:|---------:|---------:|------------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 | 1.91578e+07 |  8566267 | 34449879 | 6.96491e+06 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 | 6.71986e+06 |   767175 | 11127662 | 4.14218e+06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 | 4.08676e+07 | 25148536 | 60459272 | 1.25328e+07 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 | 1.7516e+07  | 15012350 | 24797598 | 4.15925e+06 |

### cost_usd

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |  14.68 |  7.74 | 22.71 |  4.34 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |   4.67 |  0.46 |  7.47 |  2.62 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 |  27.54 | 18.18 | 39.18 |  7.44 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  18.27 | 16.41 | 23.6  |  3.05 |

### mutation_score

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |   0.91 |  0.8  |  0.99 |  0.06 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |   0.81 |  0    |  0.94 |  0.23 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 |   0.9  |  0.75 |  0.99 |  0.09 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   4 |   0.88 |  0.86 |  0.91 |  0.02 |

### mutants_total

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 | 134.13 |   124 |   159 | 11.49 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 | 128    |   110 |   182 | 20.17 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 | 154.4  |   125 |   175 | 19.87 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   4 | 143    |   129 |   171 | 19.58 |

### mutants_survived

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |  12.13 |     1 |    26 |  7.97 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |  23.87 |     8 |   112 | 25.13 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 |  15.4  |     1 |    37 | 13.92 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   4 |  16.75 |    11 |    24 |  5.44 |

### mutants_no_coverage

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |   7.33 |     0 |    19 |  6.73 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |   4.6  |     0 |    10 |  2.59 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 |  10.7  |     0 |    33 | 12.59 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   4 |   4    |     3 |     6 |  1.41 |
