# RQ-inline-refactor-operationalization-opus-native — Aggregation

_On native Opus 5, can naming-first and a mandatory inline refactoring trial improve SOL PTDD v1.6 decomposition without paying the isolated-subagent cost of the Opus default?_

Generated: 2026-10-12T08:37:37Z

Cells declared: 2 · matched runs: 15 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc | opus-5-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   0.99 | 0.02 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |      0 |   0.99 | 0.03 |

### tests_passing

| kata                         | cell_workflow                             | cell_model         |   n |   k |   null |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |  10 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |   5 |      0 |      100 |

### tests_total

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   61.2 | 6.7  |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |      0 |   54.2 | 2.17 |

### test_lines

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |  599.1 | 258.57 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |      0 |  692.8 | 300.6  |

### avg_loc_per_function

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   5.95 | 0.93 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |      0 |   6.76 | 0.59 |

### median_loc_per_function

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |    4.7 | 1.27 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |      0 |    6.2 | 0.84 |

### longest_function

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   18.9 | 5.26 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |      0 |   22.2 | 3.83 |

### functions

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   25.3 | 4.42 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |      0 |   21.8 | 3.63 |

### cognitive_max

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |    2.8 | 0.63 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |      0 |    3   | 0    |

### cognitive_avg

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   1.47 | 0.26 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |      0 |   1.59 | 0.1  |

### mccabe_max

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |    3.3 | 0.48 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |      0 |    3.6 | 0.55 |

### smell_total

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |      0 |      0 |    0 |

### code_mass

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |  714.8 | 70.12 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |      0 |  686   | 27.03 |

### production_loc

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |  245.7 | 32.92 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |      0 |  242.2 | 14.2  |

### refactorings_applied

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   51.5 | 13.81 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |      0 |   36.4 | 15.08 |

### predictions_correct_rate

| kata                         | cell_workflow                             | cell_model         |   n |    k |    t |   null |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-----:|-----:|-------:|---------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 | 1033 | 1044 |      0 |     98.9 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |  294 |  300 |      0 |     98   |

### duration_seconds

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 | 1206.1 | 318.12 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |      0 | 1128.6 | 269.66 |

### total_tokens

| kata                         | cell_workflow                             | cell_model         |   n |   null |        mean |          sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 | 2.13754e+07 | 7.1087e+06  |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |      0 | 2.13946e+07 | 1.08334e+07 |

### cost_usd

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |  16.1  | 4.28 |
| claim-office-example-mapping | exact-sol-v1.6.1-naming-refactor-trial-cc | opus-5-no-thinking |   5 |      0 |  15.84 | 6.4  |
