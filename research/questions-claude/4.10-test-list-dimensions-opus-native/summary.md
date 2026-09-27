# RQ-test-list-dimensions-opus-native — Aggregation

_On native Opus 5, does an independent-dimensions cross-check in the SOL PTDD test-list phase improve external completeness without sacrificing the workflow's efficiency advantage or code quality?_

Generated: 2026-09-27T09:15:44Z

Cells declared: 2 · matched runs: 20 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc | opus-5-no-thinking | 10 | 10 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   0.96 |  0.73 |     1 |  0.08 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   0.99 |  0.93 |     1 |  0.02 |

### tests_passing (rate %)

| kata                         | cell_workflow                             | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      10 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                             | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      10 |      100 |

### tests_total

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   52   |    48 |    59 |  3.16 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   61.2 |    54 |    73 |  6.7  |

### test_lines

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |  457   |   302 |   718 | 131.76 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |  599.1 |   308 |   937 | 258.57 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   5.53 |  4.54 |  6.65 |  0.65 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   5.95 |  4.89 |  7.95 |  0.93 |

### cc_median_loc_per_function

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   4.55 |     3 |     6 |  1.12 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   4.7  |     3 |     7 |  1.27 |

### cc_longest_function

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   17.7 |     9 |    26 |  6.25 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   18.9 |     9 |    25 |  5.26 |

### cognitive_max

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |    2.8 |     2 |     4 |  0.63 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |    2.8 |     2 |     4 |  0.63 |

### cognitive_avg

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   1.52 |  1.23 |  1.92 |  0.21 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   1.47 |  1.13 |  1.92 |  0.26 |

### mccabe_max

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |    3.3 |     3 |     6 |  0.95 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |    3.3 |     3 |     4 |  0.48 |

### smell_total

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |     0 |     0 |     0 |

### code_mass

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |  661.7 |   632 |   698 | 26.47 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |  714.8 |   646 |   896 | 70.12 |

### cc_loc

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |  236.2 |   197 |   274 | 22.51 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |  245.7 |   215 |   310 | 32.92 |

### cycle_count

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   54.3 |     1 |    93 | 26.46 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   14.8 |     1 |    61 | 24.12 |

### refactorings_applied

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   45   |    24 |    59 | 11.21 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   51.5 |    23 |    68 | 13.81 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                             | cell_model         |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |       777 |     800 |     97.1 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      1033 |    1044 |     98.9 |

### duration_seconds

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 | 1434.6 |   837 |  2592 | 518.37 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 | 1206.1 |   879 |  1999 | 318.12 |

### total_tokens

| kata                         | cell_workflow                             | cell_model         |   n |        mean |      min |      max |         std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|------------:|---------:|---------:|------------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 | 3.03866e+07 | 10941593 | 96163464 | 2.59743e+07 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 | 2.13754e+07 | 11078090 | 34449879 | 7.1087e+06  |

### cost_usd

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |  23.12 |  9.46 | 65.09 | 17.33 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |  16.1  |  9.39 | 22.71 |  4.28 |
