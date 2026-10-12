# RQ-architecture-axis-sol-pi — Aggregation

_Does the TDD architecture axis (subagents-v2 isolated subagents / single-context-v2 single context / hybrid-v2 hybrid) rank the same way on gpt-5-6-sol as it does on opus-4-7 — and does any architecture, including the current hybrid-v6 generation, beat structureless TDD (inline-tdd-v1) on Sol?_

Generated: 2026-10-12T10:46:44Z

Cells declared: 10 · matched runs: 50 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-pi | gpt-5-6-sol | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                           | cell_model   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |    1   | 0    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |    0.4 | 0.55 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |    1   | 0    |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |    1   | 0    |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |    1   | 0    |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |    1   | 0    |

### tests_passing

| kata                         | cell_workflow                           | cell_model   |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:-------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |   5 |      0 |      100 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |    9.2 | 5.54 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |    4   | 0.71 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |   11.6 | 3.36 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |    7   | 4.58 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |    8.4 | 2.19 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |    7.4 | 6.66 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |    5.8 | 4.09 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |    8.6 | 5.73 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |    4.4 | 1.14 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |    5.6 | 3.21 |

### cognitive_avg

| kata                         | cell_workflow                           | cell_model   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |   3.65 | 2.06 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |   2.35 | 0.27 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |   3.7  | 1.39 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |   3.23 | 1.21 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |   3.58 | 1.28 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |   4.37 | 3.16 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |   2.65 | 0.56 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |   6.2  | 6.1  |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |   2.45 | 0.36 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |   5.05 | 3.68 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |    8.2 | 4.38 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |    4.6 | 0.55 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |   13.6 | 3.21 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |    6   | 1.58 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |    8.2 | 1.92 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |    6.2 | 3.96 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |    6   | 2.35 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |    6.6 | 2.88 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |    5.8 | 1.92 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |    5.8 | 2.05 |

### mccabe_avg

| kata                         | cell_workflow                           | cell_model   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |   3.16 | 1.48 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |   1.82 | 0.12 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |   2.51 | 0.29 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |   2.44 | 0.32 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |   2.82 | 0.51 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |   2.57 | 0.98 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |   2.59 | 0.22 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |   3.17 | 1.59 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |   2.6  | 0.56 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |   2.62 | 0.71 |

### longest_function

| kata                         | cell_workflow                           | cell_model   |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |   21.8 |  7.22 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |   15.6 |  4.62 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |   43.4 | 10.11 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |   22   |  4.3  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |   23   |  1.41 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |   20.6 |  3.21 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |   23   |  5.29 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |   20.8 |  3.9  |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |   21.2 |  5.07 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |   19.8 |  2.95 |

### smell_total

| kata                         | cell_workflow                           | cell_model   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |    6.8 | 9.42 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |   28   | 9.57 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |    3.8 | 2.05 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |   12.4 | 7.02 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |    2.4 | 4.34 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |   15.2 | 2.95 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |    2.8 | 1.1  |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |    0   | 0    |

### code_mass

| kata                         | cell_workflow                           | cell_model   |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------------|:-------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |  678.8 | 100.34 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |  174.8 |  11.43 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |  646.8 | 281.42 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |  146.8 |  18.29 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |  524.6 |  46.44 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |  141   |  24.63 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |  446.4 |  40.05 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |  125.8 |  14.27 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |  466.8 |  36.42 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |  135.8 |   5.31 |

### avg_loc_per_function

| kata                         | cell_workflow                           | cell_model   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |   8.01 | 1.81 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |   8.66 | 2.68 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |   6.96 | 1    |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |  12.83 | 3.44 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |  10.48 | 2.87 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |  13.07 | 7.29 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |  10.72 | 2.37 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |  15.9  | 7.96 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |  11.05 | 3.07 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |  10.8  | 1.6  |

### predictions_correct_rate

| kata                         | cell_workflow                           | cell_model   |   n |   null |   mean |   sd |   k |   t |   rate_% |
|:-----------------------------|:----------------------------------------|:-------------|----:|-------:|-------:|-----:|----:|----:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |    nan |  nan | 409 | 518 |     79   |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |    nan |  nan | 108 | 128 |     84.4 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |    nan |  nan | 122 | 124 |     98.4 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |    nan |  nan |  47 |  49 |     95.9 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |    nan |  nan | 146 | 148 |     98.6 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |    nan |  nan |  44 |  44 |    100   |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |    nan |  nan | 147 | 152 |     96.7 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |    nan |  nan |  46 |  48 |     95.8 |

### duration_seconds

| kata                         | cell_workflow                           | cell_model   |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------------|:-------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |  229   |  80.74 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |  139.6 |  16.27 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 | 4296.2 | 737.14 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |  898.8 | 122.6  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |  255   |  89.81 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |  198.2 |  33.18 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 | 1185   | 229.79 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |  343.2 | 112.81 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 | 1204.4 | 186.71 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |  449.6 |  44.27 |

### total_tokens

| kata                         | cell_workflow                           | cell_model   |   n |   null |             mean |               sd |
|:-----------------------------|:----------------------------------------|:-------------|----:|-------:|-----------------:|-----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 | 287901           | 158796           |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 | 134408           |  30455.6         |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |      1.40613e+07 |      4.33165e+06 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |      1.61284e+06 | 254479           |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 | 821150           | 894346           |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 | 701473           |  77501.2         |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |      4.98683e+06 |      1.2496e+06  |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 | 802887           | 169984           |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |      5.08047e+06 | 926418           |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |      1.15397e+06 | 112097           |

### cost_usd

| kata                         | cell_workflow                           | cell_model   |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |   1.18 |  0.61 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol  |   5 |      0 |   0.57 |  0.12 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |  38.22 | 11.75 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-pi      | gpt-5-6-sol  |   5 |      0 |   4.84 |  0.54 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |   1.72 |  1.39 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-pi | gpt-5-6-sol  |   5 |      0 |   1.58 |  0.25 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |   9.52 |  2.14 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-pi         | gpt-5-6-sol  |   5 |      0 |   2.18 |  0.76 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |   7.25 |  1.19 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-pi            | gpt-5-6-sol  |   5 |      0 |   2.35 |  0.36 |
