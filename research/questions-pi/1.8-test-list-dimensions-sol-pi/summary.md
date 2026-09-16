# RQ-test-list-dimensions-sol-pi — Aggregation

_On GPT-5.6 SOL via pi, does the independent-dimensions test-list cross-check improve the current SOL PTDD default's external completeness without sacrificing its efficiency or product quality?_

Generated: 2026-09-16T13:02:52Z

Cells declared: 2 · matched runs: 10 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |

### tests_passing (rate %)

| kata                         | cell_workflow                             | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                             | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |       5 |      100 |

### tests_total

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   35   |    34 |    36 |   1   |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   43.8 |    39 |    48 |   3.7 |

### test_lines

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |  206   |   195 |   211 |  6.63 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |  224.6 |    74 |   292 | 86.78 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   5.69 |  5.21 |  6.78 |  0.63 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   6.1  |  4.76 |  7.42 |  1.06 |

### cc_median_loc_per_function

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |    4.2 |     4 |   5   |  0.45 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |    4.5 |     2 |   6.5 |  1.66 |

### cc_longest_function

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   16.6 |    15 |    18 |  1.34 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   17.6 |    16 |    19 |  1.52 |

### cc_functions

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   15.6 |     9 |    20 |  4.34 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   15.2 |    12 |    21 |  3.7  |

### cognitive_max

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |    3.6 |     2 |     5 |  1.14 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |    3.8 |     2 |     5 |  1.3  |

### cognitive_avg

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   1.83 |  1.3  |  2.57 |  0.47 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   1.8  |  1.25 |  2.2  |  0.39 |

### mccabe_max

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |    4.2 |     3 |     5 |  0.84 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |    5.2 |     3 |     7 |  1.64 |

### smell_total

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |

### code_mass

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |  564.8 |   529 |   580 |  21.02 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |  687   |   579 |   834 | 107.33 |

### cc_loc

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |  151.4 |   126 |   168 | 15.79 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |  157.8 |   120 |   194 | 30.14 |

### refactorings_applied

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   35.4 |    34 |    37 |  1.14 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   37.8 |    11 |    48 | 15.35 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                             | cell_model        |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------------------------------|:------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |       346 |     353 |       98 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |       378 |     378 |      100 |

### duration_seconds

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 | 1188.8 |  1047 |  1285 |  92.87 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 | 1604.2 |   826 |  2140 | 486.29 |

### total_tokens

| kata                         | cell_workflow                             | cell_model        |   n |        mean |     min |      max |              std |
|:-----------------------------|:------------------------------------------|:------------------|----:|------------:|--------:|---------:|-----------------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 | 6.48898e+06 | 5380033 |  7355134 | 876517           |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 | 8.51266e+06 | 1876791 | 11127662 |      3.81156e+06 |

### cost_usd

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   4.77 |  3.56 |  5.62 |  0.8  |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   5.75 |  1.91 |  7.31 |  2.21 |
