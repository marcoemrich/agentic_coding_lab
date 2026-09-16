# RQ-test-list-dimensions-opus-native — Aggregation

_On native Opus 5, does an independent-dimensions cross-check in the SOL PTDD test-list phase improve external completeness without sacrificing the workflow's efficiency advantage or code quality?_

Generated: 2026-09-16T09:13:53Z

Cells declared: 2 · matched runs: 10 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc | opus-5-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |   0.95 |  0.73 |     1 |  0.12 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |   5 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                         | cell_workflow                             | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                             | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |   5 |       5 |      100 |

### tests_total

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |   53.4 |    50 |    59 |  3.51 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |   5 |   59.2 |    54 |    66 |  5.07 |

### test_lines

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |  475.2 |   345 |   718 | 151.49 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |   5 |  661.2 |   347 |   937 | 274.38 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |   5.38 |  4.54 |  5.66 |  0.48 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |   5 |   6.07 |  4.89 |  7.95 |  1.3  |

### cc_median_loc_per_function

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |    4.3 |     3 |     5 |  0.97 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |   5 |    5   |     3 |     7 |  1.46 |

### cc_longest_function

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |   17.8 |     9 |    24 |  6.14 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |   5 |   17.2 |     9 |    24 |  5.97 |

### cognitive_max

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |    2.8 |     2 |     3 |  0.45 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |   5 |    2.6 |     2 |     3 |  0.55 |

### cognitive_avg

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |   1.55 |  1.23 |  1.73 |  0.19 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |   5 |   1.43 |  1.21 |  1.69 |  0.22 |

### mccabe_max

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |    3   |     3 |     3 |  0    |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |   5 |    3.2 |     3 |     4 |  0.45 |

### smell_total

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |

### code_mass

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |  672   |   637 |   698 | 26.42 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |   5 |  733.6 |   646 |   896 | 99.14 |

### cc_loc

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |  244.2 |   235 |   251 |  6.26 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |   5 |  243.4 |   215 |   299 | 34.67 |

### cycle_count

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |   59.6 |    31 |    93 | 25.22 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |   5 |   17   |     1 |    61 | 26.08 |

### refactorings_applied

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |   43.6 |    24 |    59 | 15.24 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |   5 |   56.2 |    46 |    66 |  9.12 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                             | cell_model         |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |       299 |     311 |     96.1 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |   5 |       571 |     574 |     99.5 |

### duration_seconds

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 | 1642.6 |   837 |  2592 | 692.41 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |   5 | 1114.4 |   879 |  1307 | 163.48 |

### total_tokens

| kata                         | cell_workflow                             | cell_model         |   n |        mean |      min |      max |         std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|------------:|---------:|---------:|------------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 | 4.29805e+07 | 10941593 | 96163464 | 3.33524e+07 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |   5 | 2.01471e+07 | 15196195 | 24221158 | 3.8889e+06  |

### cost_usd

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |  31.88 |  9.46 | 65.09 | 21.9  |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |   5 |  15.56 | 12.25 | 18.27 |  2.54 |
