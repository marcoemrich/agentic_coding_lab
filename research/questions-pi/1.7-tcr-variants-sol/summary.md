# RQ-tcr-variants-sol — Aggregation

_How do first-party EXACT Coding TCR, classic TCR, and external TCRDD variants affect correctness, code quality, development behavior, and efficiency for SOL on pi, and how do their native-Git and tool-enforced execution strategies differ?_

Generated: 2026-09-15T00:05:19Z

Cells declared: 6 · matched runs: 30 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-tcr-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |

### tests_passing (rate %)

| kata                         | cell_workflow                           | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:----------------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                           | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:----------------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |

### test_blocks

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |    3.8 |     3 |     5 |  0.84 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   25.2 |    13 |    37 |  8.67 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   37   |    35 |    39 |  1.58 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |    7.8 |     4 |    10 |  2.49 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |   17.2 |    14 |    19 |  1.92 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |   12.2 |     7 |    16 |  3.56 |

### test_cases_total

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |   12.4 |     9 |    17 |  3.21 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   29.8 |    20 |    37 |  6.38 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   36.4 |    34 |    40 |  2.61 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |   26   |    14 |    35 |  7.65 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |   29   |    16 |    36 |  7.68 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |   19.8 |     6 |    31 |  9.39 |

### test_cases_first_block

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |    2.8 |     1 |     6 |  2.49 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |    1.8 |     1 |     3 |  1.1  |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |    0.8 |     0 |     1 |  0.45 |

### red_verified

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |    2.8 |     2 |     5 |  1.3  |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    9.8 |     1 |    20 |  7.33 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   36.8 |    35 |    39 |  1.79 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |    6.2 |     3 |    10 |  3.11 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |   17.2 |    14 |    19 |  1.92 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |   12.2 |     7 |    16 |  3.56 |

### red_unverified

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |    1   |     0 |     2 |  0.71 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   15.4 |    12 |    18 |  2.3  |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |    1.6 |     0 |     7 |  3.05 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |

### tcr_refactor_steps

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |    5.6 |     1 |    12 |  4.16 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |    6.6 |     3 |     9 |  2.61 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |    2.8 |     2 |     4 |  0.84 |

### tcr_method_commits

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   58.8 |    48 |    67 |  7.73 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |   10.4 |     8 |    13 |  1.95 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |   24.8 |    17 |    32 |  6.38 |

### tcr_red_commits

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   17.2 |    13 |    21 |  2.95 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |

### tcr_green_commits

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   35.4 |    33 |    38 |  1.95 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |

### tcr_refactor_commits

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |    5.2 |     1 |    10 |  3.42 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |

### cc_avg_loc_per_function

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |   7.29 |  5.73 |  9.09 |  1.23 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   6.8  |  6.3  |  7.22 |  0.39 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   8    |  5.89 | 10.33 |  2.13 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |   8    |  6.5  |  9.42 |  1.14 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |   9.81 |  5.78 | 12.75 |  2.85 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |   8.31 |  6.6  | 10    |  1.35 |

### cc_longest_function

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |   20.2 |    17 |    25 |  3.27 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   16.2 |    15 |    18 |  1.3  |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   18.2 |    12 |    30 |  6.91 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |   22   |    16 |    29 |  6.44 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |   18.6 |    16 |    22 |  2.61 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |   17.4 |    15 |    19 |  1.67 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |    6.6 |     4 |     9 |  2.07 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    4   |     2 |     5 |  1.22 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |    3.2 |     2 |     4 |  0.84 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |    6.8 |     6 |     8 |  0.84 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |    5.4 |     4 |     7 |  1.52 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |    6.2 |     4 |     8 |  1.79 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |    8.4 |     4 |    12 |  3.58 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    4.8 |     3 |     6 |  1.3  |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |    4   |     3 |     5 |  0.71 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |    7.4 |     6 |     9 |  1.14 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |    5.6 |     5 |     7 |  0.89 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |    6.2 |     6 |     7 |  0.45 |

### smell_total

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |

### code_mass

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |  770.2 |   696 |   878 | 73.72 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |  574.2 |   549 |   627 | 34.31 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |  553.6 |   533 |   604 | 29.13 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |  819.2 |   740 |   879 | 58.79 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |  505   |   424 |   584 | 60.32 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |  556.6 |   530 |   590 | 24.34 |

### duration_seconds

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |  278.2 |   217 |   316 |  40.71 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 | 1388.4 |  1007 |  1742 | 303.23 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 | 1082   |   956 |  1309 | 141.17 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |  459.8 |   355 |   564 |  76.82 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |  707.6 |   472 |   947 | 172.23 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |  558   |   410 |   618 |  83.89 |

### total_tokens

| kata                         | cell_workflow                           | cell_model        |   n |             mean |     min |     max |              std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-----------------:|--------:|--------:|-----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 | 335810           |  240067 |  406371 |  65135.9         |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      5.48161e+06 | 4140296 | 6995978 |      1.25818e+06 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      6.29228e+06 | 5377695 | 7031633 | 653247           |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 | 750982           |  543543 |  853260 | 128860           |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      2.32028e+06 | 1693881 | 2832331 | 414861           |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      1.71331e+06 | 1016512 | 2827452 | 752009           |
