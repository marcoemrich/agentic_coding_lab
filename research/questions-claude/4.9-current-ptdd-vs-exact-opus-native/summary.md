# RQ-current-ptdd-vs-exact-opus-native — Aggregation

_On native Opus 5, how does the current SOL Predictive-TDD workflow compare with the default EXACT Coding workflow on correctness, decomposition, development behavior, and efficiency?_

Generated: 2026-10-12T10:46:32Z

Cells declared: 2 · matched runs: 28 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking | 18 | 18 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |   0.96 | 0.08 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      0 |   0.96 | 0.03 |

### tests_passing

| kata                         | cell_workflow                             | cell_model         |   n |   k |   null |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |  10 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |  18 |      0 |      100 |

### avg_loc_per_function

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |   5.53 | 0.65 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      0 |   3.81 | 0.64 |

### median_loc_per_function

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |   4.55 | 1.12 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      0 |   2    | 0    |

### longest_function

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |  17.7  | 6.25 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      0 |  16.22 | 5.78 |

### cognitive_max

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |   2.8  | 0.63 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      0 |   2.78 | 1.35 |

### cognitive_avg

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |   1.52 | 0.21 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      0 |   1.3  | 0.29 |

### mccabe_max

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |   3.3  | 0.95 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      0 |   3.39 | 0.78 |

### smell_total

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      0 |      0 |    0 |

### code_mass

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |  661.7 | 26.47 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      0 |  859.5 | 99.25 |

### production_loc

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |  236.2 | 22.51 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      0 |  264.5 | 37.61 |

### test_lines

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 | 457    | 131.76 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      0 | 765.39 | 111.87 |

### predictions_correct_rate

| kata                         | cell_workflow                             | cell_model         |   n |    k |    t |   null |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-----:|-----:|-------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |  777 |  800 |      0 |     97.1 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 | 1608 | 1614 |      0 |     99.6 |

### duration_seconds

| kata                         | cell_workflow                             | cell_model         |   n |   null |    mean |     sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|--------:|-------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 | 1434.6  | 518.37 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      0 | 2650.06 | 464.89 |

### total_tokens

| kata                         | cell_workflow                             | cell_model         |   n |   null |        mean |          sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 | 3.03866e+07 | 2.59743e+07 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      0 | 9.42234e+07 | 1.76387e+07 |

### cost_usd

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |  23.12 | 17.33 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      0 |  61.94 | 10.74 |
