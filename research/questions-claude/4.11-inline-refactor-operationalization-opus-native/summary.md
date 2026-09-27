# RQ-inline-refactor-operationalization-opus-native — Aggregation

_On native Opus 5, can naming-first and a mandatory inline refactoring trial improve SOL PTDD v1.6 decomposition without paying the isolated-subagent cost of the Opus default?_

Generated: 2026-09-27T09:15:45Z

Cells declared: 2 · matched runs: 15 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc | opus-5-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   0.99 |  0.93 |     1 |  0.02 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |   0.99 |  0.93 |     1 |  0.03 |

### tests_passing (rate %)

| kata                         | cell_workflow                             | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                             | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |       5 |      100 |

### tests_total

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   61.2 |    54 |    73 |  6.7  |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |   54.2 |    51 |    57 |  2.17 |

### test_lines

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |  599.1 |   308 |   937 | 258.57 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |  692.8 |   332 |   917 | 300.6  |

### cc_avg_loc_per_function

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   5.95 |  4.89 |  7.95 |  0.93 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |   6.76 |  6.38 |  7.77 |  0.59 |

### cc_median_loc_per_function

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |    4.7 |     3 |     7 |  1.27 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |    6.2 |     5 |     7 |  0.84 |

### cc_longest_function

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   18.9 |     9 |    25 |  5.26 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |   22.2 |    18 |    27 |  3.83 |

### cc_functions

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   25.3 |    20 |    32 |  4.42 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |   21.8 |    16 |    26 |  3.63 |

### cognitive_max

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |    2.8 |     2 |     4 |  0.63 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |    3   |     3 |     3 |  0    |

### cognitive_avg

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   1.47 |  1.13 |  1.92 |  0.26 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |   1.59 |  1.47 |  1.75 |  0.1  |

### mccabe_max

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |    3.3 |     3 |     4 |  0.48 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |    3.6 |     3 |     4 |  0.55 |

### smell_total

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |

### code_mass

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |  714.8 |   646 |   896 | 70.12 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |  686   |   640 |   706 | 27.03 |

### cc_loc

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |  245.7 |   215 |   310 | 32.92 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |  242.2 |   223 |   258 | 14.2  |

### refactorings_applied

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   51.5 |    23 |    68 | 13.81 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |   36.4 |    18 |    53 | 15.08 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                             | cell_model         |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      1033 |    1044 |     98.9 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |       294 |     300 |     98   |

### duration_seconds

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 | 1206.1 |   879 |  1999 | 318.12 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 | 1128.6 |   849 |  1440 | 269.66 |

### total_tokens

| kata                         | cell_workflow                             | cell_model         |   n |        mean |      min |      max |         std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|------------:|---------:|---------:|------------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 | 2.13754e+07 | 11078090 | 34449879 | 7.1087e+06  |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 | 2.13946e+07 | 11637622 | 33818782 | 1.08334e+07 |

### cost_usd

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |  16.1  |  9.39 | 22.71 |  4.28 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |  15.84 |  9.78 | 23.08 |  6.4  |
