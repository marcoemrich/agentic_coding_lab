# RQ-test-list-dimensions-replication — Aggregation

_Does the apparent platform interaction between PTDD v1.5 and v1.6 replicate at n=10 per cell on Claim Office, or was it driven by small-sample variance?_

Generated: 2026-09-23T05:13:14Z

Cells declared: 4 · matched runs: 40 · min_replicates: 10

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc | opus-5-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi | gpt-5-6-sol-codex | 10 | 10 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   0.96 |  0.73 |     1 |  0.08 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   0.99 |  0.93 |     1 |  0.02 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                         | cell_workflow                             | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      10 |      100 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      10 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                             | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      10 |      100 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      10 |      100 |

### tests_total

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   52   |    48 |    59 |  3.16 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |   35.8 |    34 |    38 |  1.55 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   61.2 |    54 |    73 |  6.7  |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |   42   |    39 |    48 |  3.59 |

### test_lines

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |  457   |   302 |   718 | 131.76 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |  218.3 |   113 |   279 |  47.84 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |  599.1 |   308 |   937 | 258.57 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |  220.6 |    74 |   292 |  71.3  |

### cc_avg_loc_per_function

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   5.53 |  4.54 |  6.65 |  0.65 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |   5.72 |  5.21 |  6.78 |  0.52 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   5.95 |  4.89 |  7.95 |  0.93 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |   6.42 |  4.53 |  8    |  1.24 |

### cc_median_loc_per_function

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   4.55 |   3   |     6 |  1.12 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |   4.35 |   3.5 |     5 |  0.58 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   4.7  |   3   |     7 |  1.27 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |   5.3  |   2   |     8 |  1.96 |

### cc_longest_function

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   17.7 |     9 |    26 |  6.25 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |   16.8 |    15 |    20 |  1.69 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   18.9 |     9 |    25 |  5.26 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |   18.4 |    15 |    23 |  2.37 |

### cc_functions

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   25.4 |    20 |    29 |  3.03 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |   15.3 |     9 |    22 |  4.03 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   25.3 |    20 |    32 |  4.42 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |   13.7 |     8 |    21 |  4.06 |

### cognitive_max

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |    2.8 |     2 |     4 |  0.63 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |    3.7 |     2 |     5 |  0.95 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |    2.8 |     2 |     4 |  0.63 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |    3.9 |     2 |     5 |  1.1  |

### cognitive_avg

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   1.52 |  1.23 |  1.92 |  0.21 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |   1.87 |  1.3  |  2.8  |  0.48 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   1.47 |  1.13 |  1.92 |  0.26 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |   1.83 |  1.25 |  2.43 |  0.37 |

### mccabe_max

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |    3.3 |     3 |     6 |  0.95 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |    4.3 |     3 |     6 |  1.16 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |    3.3 |     3 |     4 |  0.48 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |    5   |     3 |     7 |  1.56 |

### smell_total

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 |     0 |     0 |     0 |

### code_mass

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |  661.7 |   632 |   698 | 26.47 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |  578.2 |   529 |   660 | 35.65 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |  714.8 |   646 |   896 | 70.12 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |  633.1 |   546 |   834 | 94.67 |

### cc_loc

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |  236.2 |   197 |   274 | 22.51 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |  150.2 |   101 |   196 | 27.18 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |  245.7 |   215 |   310 | 32.92 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |  152.4 |   120 |   195 | 28.12 |

### refactorings_applied

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   45   |    24 |    59 | 11.21 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |   36.2 |    34 |    38 |  1.32 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   51.5 |    23 |    68 | 13.81 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |   39.2 |    11 |    48 | 10.54 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                             | cell_model         |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |       777 |     800 |     97.1 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |       713 |     721 |     98.9 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      1033 |    1044 |     98.9 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |       809 |     812 |     99.6 |

### duration_seconds

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 | 1434.6 |   837 |  2592 | 518.37 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 | 1263.4 |   495 |  1754 | 351.01 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 | 1206.1 |   879 |  1999 | 318.12 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 | 1486   |   637 |  2140 | 476.69 |

### total_tokens

| kata                         | cell_workflow                             | cell_model         |   n |        mean |      min |      max |         std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|------------:|---------:|---------:|------------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 | 3.03866e+07 | 10941593 | 96163464 | 2.59743e+07 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 | 6.58223e+06 |  1085533 |  8968978 | 2.24387e+06 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 | 2.13754e+07 | 11078090 | 34449879 | 7.1087e+06  |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 | 6.87568e+06 |   767175 | 11127662 | 4.1366e+06  |

### cost_usd

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |  23.12 |  9.46 | 65.09 | 17.33 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |   4.78 |  1.34 |  6.25 |  1.43 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |  16.1  |  9.39 | 22.71 |  4.28 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |   4.76 |  0.46 |  7.31 |  2.55 |

### mutation_score

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |   0.96 |  0.91 |  0.99 |  0.03 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |   0.89 |  0.8  |  0.96 |  0.05 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   0.92 |  0.8  |  0.99 |  0.06 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |   0.78 |  0    |  0.94 |  0.28 |

### mutants_total

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |  125.7 |   116 |   145 | 10.14 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |  117.4 |    99 |   153 | 15.61 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |  134.1 |   124 |   159 | 11.57 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |  130.7 |   110 |   182 | 23.43 |

### mutants_survived

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |    4.5 |     1 |    11 |  3.6  |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |   13.3 |     4 |    26 |  5.74 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |   10.4 |     1 |    26 |  8.68 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |   27.7 |     8 |   112 | 30.42 |

### mutants_no_coverage

| kata                         | cell_workflow                             | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |    1.9 |     0 |     9 |  3.14 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |    3.8 |     0 |     6 |  1.55 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |    5.8 |     0 |    19 |  6.61 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |    4.9 |     0 |    10 |  3.07 |
