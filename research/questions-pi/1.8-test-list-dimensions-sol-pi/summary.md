# RQ-test-list-dimensions-sol-pi — Aggregation

_On GPT-5.6 SOL via pi, does the independent-dimensions test-list cross-check improve the current SOL PTDD default's external completeness without sacrificing its efficiency or product quality?_

Generated: 2026-09-27T09:15:48Z

Cells declared: 2 · matched runs: 20 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi | gpt-5-6-sol-codex | 10 | 10 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |      1 |     1 |     1 |     0 |

### tests_passing (rate %)

| kata                         | cell_workflow                             | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      10 |      100 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |      10 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                             | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      10 |      100 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |      10 |      100 |

### tests_total

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |   35.8 |    34 |    38 |  1.55 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |   42   |    39 |    48 |  3.59 |

### test_lines

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |  218.3 |   113 |   279 | 47.84 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |  220.6 |    74 |   292 | 71.3  |

### cc_avg_loc_per_function

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |   5.72 |  5.21 |  6.78 |  0.52 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |   6.42 |  4.53 |  8    |  1.24 |

### cc_median_loc_per_function

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |   4.35 |   3.5 |     5 |  0.58 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |   5.3  |   2   |     8 |  1.96 |

### cc_longest_function

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |   16.8 |    15 |    20 |  1.69 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |   18.4 |    15 |    23 |  2.37 |

### cc_functions

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |   15.3 |     9 |    22 |  4.03 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |   13.7 |     8 |    21 |  4.06 |

### cognitive_max

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |    3.7 |     2 |     5 |  0.95 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |    3.9 |     2 |     5 |  1.1  |

### cognitive_avg

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |   1.87 |  1.3  |  2.8  |  0.48 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |   1.83 |  1.25 |  2.43 |  0.37 |

### mccabe_max

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |    4.3 |     3 |     6 |  1.16 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |    5   |     3 |     7 |  1.56 |

### smell_total

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |      0 |     0 |     0 |     0 |

### code_mass

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |  578.2 |   529 |   660 | 35.65 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |  633.1 |   546 |   834 | 94.67 |

### cc_loc

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |  150.2 |   101 |   196 | 27.18 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |  152.4 |   120 |   195 | 28.12 |

### refactorings_applied

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |   36.2 |    34 |    38 |  1.32 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |   39.2 |    11 |    48 | 10.54 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                             | cell_model        |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------------------------------|:------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |       713 |     721 |     98.9 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |       809 |     812 |     99.6 |

### duration_seconds

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 | 1263.4 |   495 |  1754 | 351.01 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 | 1486   |   637 |  2140 | 476.69 |

### total_tokens

| kata                         | cell_workflow                             | cell_model        |   n |        mean |     min |      max |         std |
|:-----------------------------|:------------------------------------------|:------------------|----:|------------:|--------:|---------:|------------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 | 6.58223e+06 | 1085533 |  8968978 | 2.24387e+06 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 | 6.87568e+06 |  767175 | 11127662 | 4.1366e+06  |

### cost_usd

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |   4.78 |  1.34 |  6.25 |  1.43 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |   4.76 |  0.46 |  7.31 |  2.55 |
