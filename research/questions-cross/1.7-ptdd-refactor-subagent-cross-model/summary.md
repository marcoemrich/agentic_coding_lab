# RQ-ptdd-refactor-subagent-cross-model — Aggregation

_Does isolating only the per-cycle Refactor phase improve PTDD v1 product structure enough to justify its context cost on native Opus and GPT-5.6 SOL/pi?_

Generated: 2026-09-23T05:02:15Z

Cells declared: 4 · matched runs: 30 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking | 5 | 4 | ⚠️ only 4/5 without timeout |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 |   0.99 |  0.93 |     1 |  0.02 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   0.96 |  0.8  |     1 |  0.09 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                         | cell_workflow                        | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 |      10 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                        | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 |      10 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |       4 |       80 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |       5 |      100 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 |   5.95 |  4.89 |  7.95 |  0.93 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 |   6.42 |  4.53 |  8    |  1.24 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   4.6  |  4.23 |  5.06 |  0.33 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   4.21 |  3.62 |  4.66 |  0.4  |

### cc_median_loc_per_function

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 |    4.7 |     3 |   7   |  1.27 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 |    5.3 |     2 |   8   |  1.96 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    3.2 |     3 |   3.5 |  0.27 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |    3   |     3 |   3   |  0    |

### cc_longest_function

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 |   18.9 |     9 |    25 |  5.26 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 |   18.4 |    15 |    23 |  2.37 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   15.2 |    11 |    19 |  3.35 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   15.8 |    12 |    19 |  3.56 |

### cc_functions

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 |   25.3 |    20 |    32 |  4.42 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 |   13.7 |     8 |    21 |  4.06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   40.2 |    32 |    44 |  4.82 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   32.2 |    28 |    39 |  4.66 |

### cognitive_max

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 |    2.8 |     2 |     4 |  0.63 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 |    3.9 |     2 |     5 |  1.1  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    2.2 |     2 |     3 |  0.45 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |    2.6 |     2 |     4 |  0.89 |

### cognitive_avg

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 |   1.47 |  1.13 |  1.92 |  0.26 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 |   1.83 |  1.25 |  2.43 |  0.37 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   1.13 |  1.06 |  1.19 |  0.06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   1.24 |  1.08 |  1.75 |  0.29 |

### mccabe_max

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 |    3.3 |     3 |     4 |  0.48 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 |    5   |     3 |     7 |  1.56 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    3   |     3 |     3 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |    3.6 |     3 |     4 |  0.55 |

### smell_total

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |

### code_mass

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 |  714.8 |   646 |   896 |  70.12 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 |  633.1 |   546 |   834 |  94.67 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  968   |   724 |  1152 | 159.62 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  685.4 |   628 |   776 |  63.25 |

### cc_loc

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 |  245.7 |   215 |   310 |  32.92 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 |  152.4 |   120 |   195 |  28.12 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  526.8 |   351 |   724 | 150.9  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  224   |   200 |   272 |  27.94 |

### refactorings_applied

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 |   51.5 |    23 |    68 | 13.81 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 |   39.2 |    11 |    48 | 10.54 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   47.4 |    28 |    59 | 13.13 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   37.2 |    35 |    41 |  2.28 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                        | cell_model         |   n |   correct |   total |   rate_% |
|:-----------------------------|:-------------------------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 |      1033 |    1044 |     98.9 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 |       809 |     812 |     99.6 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |       519 |     529 |     98.1 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |       370 |     370 |    100   |

### duration_seconds

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |     std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|--------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 | 1206.1 |   879 |  1999 |  318.12 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 | 1486   |   637 |  2140 |  476.69 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 | 5499.4 |  3574 |  7201 | 1417.51 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 | 4927   |  4434 |  5934 |  610.52 |

### total_tokens

| kata                         | cell_workflow                        | cell_model         |   n |        mean |      min |      max |         std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|------------:|---------:|---------:|------------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 | 2.13754e+07 | 11078090 | 34449879 | 7.1087e+06  |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 | 6.87568e+06 |   767175 | 11127662 | 4.1366e+06  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 | 4.84135e+07 | 28328974 | 60459272 | 1.32536e+07 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 | 1.7516e+07  | 15012350 | 24797598 | 4.15925e+06 |

### cost_usd

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 |  16.1  |  9.39 | 22.71 |  4.28 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 |   4.76 |  0.46 |  7.31 |  2.55 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  32.05 | 20.24 | 39.18 |  7.85 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  18.27 | 16.41 | 23.6  |  3.05 |

### mutation_score

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 |   0.92 |  0.8  |  0.99 |  0.06 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 |   0.78 |  0    |  0.94 |  0.28 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   0.89 |  0.75 |  0.99 |  0.1  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   4 |   0.88 |  0.86 |  0.91 |  0.02 |

### mutants_total

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 |  134.1 |   124 |   159 | 11.57 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 |  130.7 |   110 |   182 | 23.43 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  156   |   125 |   175 | 20.59 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   4 |  143   |   129 |   171 | 19.58 |

### mutants_survived

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 |  10.4  |     1 |    26 |  8.68 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 |  27.7  |     8 |   112 | 30.42 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  18    |     1 |    37 | 15.3  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   4 |  16.75 |    11 |    24 |  5.44 |

### mutants_no_coverage

| kata                         | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 |    5.8 |     0 |    19 |  6.61 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 |    4.9 |     0 |    10 |  3.07 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   15.2 |     0 |    33 | 13.95 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   4 |    4   |     3 |     6 |  1.41 |
