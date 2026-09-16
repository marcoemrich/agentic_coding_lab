# RQ-current-ptdd-vs-exact-opus-native — Aggregation

_On native Opus 5, how does the current SOL Predictive-TDD workflow compare with the default EXACT Coding workflow on correctness, decomposition, development behavior, and efficiency?_

Generated: 2026-09-16T05:55:54Z

Cells declared: 2 · matched runs: 23 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking | 18 | 18 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |   0.96 |  0.93 |     1 |  0.03 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |   0.95 |  0.73 |     1 |  0.12 |

### tests_passing (rate %)

| kata                         | cell_workflow                             | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      18 |      100 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                             | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      18 |      100 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |       5 |      100 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |   3.81 |  2.64 |  5    |  0.64 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |   5.38 |  4.54 |  5.66 |  0.48 |

### cc_median_loc_per_function

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |    2   |     2 |     2 |  0    |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |    4.3 |     3 |     5 |  0.97 |

### cc_longest_function

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |  16.22 |     8 |    29 |  5.78 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |  17.8  |     9 |    24 |  6.14 |

### cognitive_max

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |   2.78 |     1 |     7 |  1.35 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |   2.8  |     2 |     3 |  0.45 |

### cognitive_avg

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |   1.3  |  1    |  2    |  0.29 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |   1.55 |  1.23 |  1.73 |  0.19 |

### mccabe_max

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |   3.39 |     3 |     6 |  0.78 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |   3    |     3 |     3 |  0    |

### smell_total

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |

### code_mass

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |  859.5 |   725 |  1114 | 99.25 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |  672   |   637 |   698 | 26.42 |

### cc_loc

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |  264.5 |   209 |   333 | 37.61 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |  244.2 |   235 |   251 |  6.26 |

### test_lines

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 | 765.39 |   587 |  1009 | 111.87 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 | 475.2  |   345 |   718 | 151.49 |

### cycle_count

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |  45.89 |    38 |    52 |  4.93 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |  59.6  |    31 |    93 | 25.22 |

### refactorings_applied

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |  21.28 |     9 |    46 |  7.55 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |  43.6  |    24 |    59 | 15.24 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                             | cell_model         |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |      1608 |    1614 |     99.6 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |       299 |     311 |     96.1 |

### duration_seconds

| kata                         | cell_workflow                             | cell_model         |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 | 2650.06 |  1946 |  3685 | 464.89 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 | 1642.6  |   837 |  2592 | 692.41 |

### total_tokens

| kata                         | cell_workflow                             | cell_model         |   n |        mean |      min |       max |         std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|------------:|---------:|----------:|------------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 | 8.36653e+07 | 51719658 | 123086078 | 1.64834e+07 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 | 4.29805e+07 | 10941593 |  96163464 | 3.33524e+07 |

### cost_usd

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc           | opus-5-no-thinking |  18 |  49.13 | 31.43 | 71.07 |  9.15 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |   5 |  31.88 |  9.46 | 65.09 | 21.9  |
