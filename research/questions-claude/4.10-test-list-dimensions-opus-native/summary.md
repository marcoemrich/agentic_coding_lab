# RQ-test-list-dimensions-opus-native — Aggregation

_On native Opus 5, does an independent-dimensions cross-check in the SOL PTDD test-list phase improve external completeness without sacrificing the workflow's efficiency advantage or code quality?_

Generated: 2026-10-12T10:46:29Z

Cells declared: 2 · matched runs: 20 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc | opus-5-no-thinking | 10 | 10 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |   0.96 | 0.08 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   0.99 | 0.02 |

### tests_passing

| kata                         | cell_workflow                             | cell_model         |   n |   k |   null |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |  10 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |  10 |      0 |      100 |

### tests_total

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |   52   | 3.16 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   61.2 | 6.7  |

### test_lines

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |  457   | 131.76 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |  599.1 | 258.57 |

### avg_loc_per_function

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |   5.53 | 0.65 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   5.95 | 0.93 |

### median_loc_per_function

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |   4.55 | 1.12 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   4.7  | 1.27 |

### longest_function

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |   17.7 | 6.25 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   18.9 | 5.26 |

### cognitive_max

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |    2.8 | 0.63 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |    2.8 | 0.63 |

### cognitive_avg

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |   1.52 | 0.21 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   1.47 | 0.26 |

### mccabe_max

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |    3.3 | 0.95 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |    3.3 | 0.48 |

### smell_total

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |      0 |    0 |

### code_mass

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |  661.7 | 26.47 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |  714.8 | 70.12 |

### production_loc

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |  236.2 | 22.51 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |  245.7 | 32.92 |

### predictions_correct_rate

| kata                         | cell_workflow                             | cell_model         |   n |    k |    t |   null |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-----:|-----:|-------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |  777 |  800 |      0 |     97.1 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 | 1033 | 1044 |      0 |     98.9 |

### duration_seconds

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 | 1434.6 | 518.37 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 | 1206.1 | 318.12 |

### total_tokens

| kata                         | cell_workflow                             | cell_model         |   n |   null |        mean |          sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 | 3.03866e+07 | 2.59743e+07 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 | 2.13754e+07 | 7.1087e+06  |

### cost_usd

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |  23.12 | 17.33 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |  16.1  |  4.28 |
