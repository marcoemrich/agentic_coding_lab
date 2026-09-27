# RQ-current-ptdd-vs-exact-opus-native — Aggregation

_On native Opus 5, how does the current SOL Predictive-TDD workflow compare with the default EXACT Coding workflow on correctness, decomposition, development behavior, and efficiency?_

Generated: 2026-09-27T09:15:45Z

Cells declared: 2 · matched runs: 28 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking | 18 | 18 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |   0.96 |  0.93 |     1 |  0.03 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   0.96 |  0.73 |     1 |  0.08 |

### tests_passing (rate %)

| kata                         | cell_workflow                             | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      18 |      100 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      10 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                             | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      18 |      100 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      10 |      100 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |   3.81 |  2.64 |  5    |  0.64 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   5.53 |  4.54 |  6.65 |  0.65 |

### cc_median_loc_per_function

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |   2    |     2 |     2 |  0    |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   4.55 |     3 |     6 |  1.12 |

### cc_longest_function

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |  16.22 |     8 |    29 |  5.78 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |  17.7  |     9 |    26 |  6.25 |

### cognitive_max

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |   2.78 |     1 |     7 |  1.35 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   2.8  |     2 |     4 |  0.63 |

### cognitive_avg

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |   1.3  |  1    |  2    |  0.29 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   1.52 |  1.23 |  1.92 |  0.21 |

### mccabe_max

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |   3.39 |     3 |     6 |  0.78 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   3.3  |     3 |     6 |  0.95 |

### smell_total

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |     0 |     0 |     0 |

### code_mass

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |  859.5 |   725 |  1114 | 99.25 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |  661.7 |   632 |   698 | 26.47 |

### cc_loc

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |  264.5 |   209 |   333 | 37.61 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |  236.2 |   197 |   274 | 22.51 |

### test_lines

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 | 765.39 |   587 |  1009 | 111.87 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 | 457    |   302 |   718 | 131.76 |

### cycle_count

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |  45.89 |    38 |    52 |  4.93 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |  54.3  |     1 |    93 | 26.46 |

### refactorings_applied

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |  21.28 |     9 |    46 |  7.55 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |  45    |    24 |    59 | 11.21 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                             | cell_model         |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      1608 |    1614 |     99.6 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |       777 |     800 |     97.1 |

### duration_seconds

| kata                         | cell_workflow                             | cell_model         |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 | 2650.06 |  1946 |  3685 | 464.89 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 | 1434.6  |   837 |  2592 | 518.37 |

### total_tokens

| kata                         | cell_workflow                             | cell_model         |   n |        mean |      min |       max |         std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|------------:|---------:|----------:|------------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 | 8.36653e+07 | 51719658 | 123086078 | 1.64834e+07 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 | 3.03866e+07 | 10941593 |  96163464 | 2.59743e+07 |

### cost_usd

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |  49.13 | 31.43 | 71.07 |  9.15 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |  23.12 |  9.46 | 65.09 | 17.33 |
