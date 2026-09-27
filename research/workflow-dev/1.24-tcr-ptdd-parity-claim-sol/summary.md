# RQ-tcr-ptdd-parity-claim-sol — Aggregation

_On Claim Office with SOL/pi, does a TCR-source-parity transfer of the domain-boundary workflow to Predictive TDD reproduce TCR's decomposition when all non-method-specific test-list, domain-review, stack, and lab contracts are retained, or does the commit-or-revert phase mechanism still separate the methods?_

Generated: 2026-09-27T09:15:50Z

Cells declared: 3 · matched runs: 20 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex | 10 | 10 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |

### tests_passing (rate %)

| kata                         | cell_workflow                             | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      10 |      100 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                             | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      10 |      100 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |       5 |      100 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   6.61 |  5.12 |  9.6  |  1.81 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |   5.72 |  5.21 |  6.78 |  0.52 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   5.67 |  4.64 |  6.56 |  0.69 |

### cc_median_loc_per_function

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   6    |   3.5 |  10.5 |  2.67 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |   4.35 |   3.5 |   5   |  0.58 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   4.7  |   3.5 |   5   |  0.67 |

### cc_longest_function

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   15.8 |    13 |    20 |  2.77 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |   16.8 |    15 |    20 |  1.69 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   14.2 |    11 |    18 |  2.59 |

### cc_functions

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   13   |    10 |    16 |  2.24 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |   15.3 |     9 |    22 |  4.03 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   15.4 |    14 |    16 |  0.89 |

### cognitive_max

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |    3.4 |     2 |     7 |  2.07 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |    3.7 |     2 |     5 |  0.95 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |    3   |     2 |     4 |  0.71 |

### cognitive_avg

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   1.81 |  1.31 |  2.42 |  0.48 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |   1.87 |  1.3  |  2.8  |  0.48 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   1.47 |  1.33 |  1.67 |  0.15 |

### mccabe_max

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |    4.6 |     3 |     7 |  1.52 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |    4.3 |     3 |     6 |  1.16 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |    4.2 |     3 |     7 |  1.64 |

### mccabe_avg

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   2.02 |  1.71 |  2.59 |  0.36 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |   1.85 |  1.39 |  2.46 |  0.31 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   1.5  |  1.42 |  1.68 |  0.11 |

### smell_total

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |

### smell_code_quality

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |

### code_mass

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |  600.8 |   535 |   650 | 43.56 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |  578.2 |   529 |   660 | 35.65 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |  568.4 |   541 |   605 | 26.09 |

### cc_loc

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |  151.8 |   145 |   163 |  8.93 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |  150.2 |   101 |   196 | 27.18 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |  153.2 |   141 |   166 | 10.13 |

### test_lines

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |  186.8 |   146 |   212 | 27.22 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |  218.3 |   113 |   279 | 47.84 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |  218.4 |   146 |   262 | 44.72 |

### test_blocks

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   21.8 |    12 |    31 |  8.32 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |   34.8 |     9 |    40 |  9.25 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   37.6 |    36 |    41 |  1.95 |

### red_verified

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |    8.6 |     0 |    17 |  7.64 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |   32.6 |     5 |    40 | 11.64 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   37.4 |    35 |    41 |  2.19 |

### red_unverified

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   13.2 |    12 |    14 |  0.84 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |    2.2 |     0 |    17 |  5.35 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |    0.2 |     0 |     1 |  0.45 |

### tcr_refactor_steps

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   10.6 |     4 |    14 |  4.16 |

### tcr_method_commits

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |  0    |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |     0 |     0 |  0    |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |     62 |    48 |    73 |  9.06 |

### tcr_red_commits

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   15.6 |    10 |    21 |  3.97 |

### tcr_green_commits

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |  0    |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |     0 |     0 |  0    |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |     36 |    34 |    40 |  2.35 |

### tcr_refactor_commits

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |    9.4 |     2 |    14 |  4.93 |

### cycle_count

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   27.2 |    21 |    32 |  4.44 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |   36   |    34 |    38 |  1.49 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   36   |    34 |    40 |  2.35 |

### refactorings_applied

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   27.2 |    21 |    32 |  4.44 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |   36.2 |    34 |    38 |  1.32 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   37.4 |    35 |    40 |  2.07 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                             | cell_model        |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------------------------------|:------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |       125 |     130 |     96.2 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |       713 |     721 |     98.9 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |       360 |     362 |     99.4 |

### duration_seconds

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 | 1087.8 |   860 |  1380 | 198.3  |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 | 1263.4 |   495 |  1754 | 351.01 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 | 1439.8 |  1041 |  1884 | 314.57 |

### total_tokens

| kata                         | cell_workflow                             | cell_model        |   n |        mean |     min |     max |         std |
|:-----------------------------|:------------------------------------------|:------------------|----:|------------:|--------:|--------:|------------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 | 4.76884e+06 | 2734920 | 5769614 | 1.36416e+06 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 | 6.58223e+06 | 1085533 | 8968978 | 2.24387e+06 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 | 6.64817e+06 | 4236451 | 9830011 | 2.5006e+06  |

### cost_usd

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   3.65 |  2.28 |  4.32 |  0.86 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |   4.78 |  1.34 |  6.25 |  1.43 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   4.83 |  3.03 |  6.95 |  1.72 |
