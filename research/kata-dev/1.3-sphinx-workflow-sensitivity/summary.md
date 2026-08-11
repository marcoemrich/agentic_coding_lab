# RQ-kata-sphinx-workflow-sensitivity — Aggregation

_Does sphinx-score resolve a workflow difference in code quality — does the decomposition gap between a minimal and an elaborate TDD workflow show up as clearly as it does on claim-office?_

Generated: 2026-08-11T13:55:02Z

Cells declared: 6 · matched runs: 36 · min_replicates: 6

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| sphinx-score-example-mapping | v3-basic-tdd | opus-5-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v3-basic-tdd | opus-5-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | opus-5-no-thinking | 6 | 6 | ✅ |

## Outcome-Pivots (pro Zelle)

### cc_longest_function

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |  24.33 |    19 |    27 |  2.8  |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  13.83 |    10 |    18 |  3.19 |
| game-of-life-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |  14.5  |     9 |    22 |  5.01 |
| game-of-life-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   7.5  |     4 |     9 |  1.87 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |  11    |     8 |    13 |  1.9  |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   5.83 |     2 |     7 |  1.94 |

### cc_avg_loc_per_function

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   8.9  |  7.44 | 11.54 |  1.65 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   3.19 |  2.91 |  3.48 |  0.23 |
| game-of-life-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   6.48 |  4.25 |  9.25 |  2.16 |
| game-of-life-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   3.46 |  2.33 |  5.09 |  1    |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   8.38 |  7    | 11    |  1.42 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   3.54 |  2    |  5.2  |  1.11 |

### cognitive_max

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   5.33 |     4 |     9 |  1.86 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   2    |     1 |     3 |  1.1  |
| game-of-life-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   7.17 |     5 |    10 |  2.04 |
| game-of-life-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   1.17 |     1 |     2 |  0.41 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   1.5  |     1 |     3 |  0.84 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   1    |     1 |     1 |  0    |

### mccabe_max

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   5.33 |     4 |     7 |  1.03 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   2.83 |     2 |     4 |  0.75 |
| game-of-life-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   5.67 |     4 |     8 |  1.63 |
| game-of-life-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   2.5  |     2 |     3 |  0.55 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   2.33 |     2 |     3 |  0.52 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   2    |     2 |     2 |  0    |

### cc_functions

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |  14.5  |    11 |    20 |  3.15 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  38    |    33 |    47 |  5.51 |
| game-of-life-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   4.83 |     4 |     7 |  1.17 |
| game-of-life-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   8.5  |     6 |    11 |  2.07 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   3.5  |     3 |     4 |  0.55 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   6.5  |     5 |     9 |  1.64 |

### smell_total (rate %)

| kata                         | cell_workflow     | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |       0 |        0 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |       0 |        0 |
| game-of-life-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |       0 |        0 |
| game-of-life-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |       0 |        0 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |       0 |        0 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |       0 |        0 |

### code_mass

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 | 758.17 |   674 |   881 | 95.71 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 | 997    |   896 |  1083 | 67.06 |
| game-of-life-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 | 196.83 |   166 |   216 | 18.64 |
| game-of-life-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 | 195.83 |   171 |   222 | 21.24 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 | 182.83 |   150 |   233 | 31.01 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 | 182.83 |   154 |   251 | 36.22 |

### lines_of_code

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 | 314.67 |   267 |   365 | 40.04 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 | 523    |   411 |   618 | 86.38 |
| game-of-life-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |  55    |    45 |    67 |  8.65 |
| game-of-life-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  53.5  |    45 |    76 | 11.29 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |  77.5  |    65 |    93 |  9.14 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  57.5  |    47 |    74 | 11.18 |

### refactorings_applied

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   2    |     1 |     3 |  0.89 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  44.5  |    36 |    57 |  8.02 |
| game-of-life-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   0.33 |     0 |     2 |  0.82 |
| game-of-life-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   8.83 |     2 |    11 |  3.37 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   2.67 |     1 |     4 |  1.03 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  11.67 |    10 |    16 |  2.16 |

### cycle_count

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   5.17 |     2 |     8 |  2.32 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  45.83 |    36 |    57 |  7.08 |
| game-of-life-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   3.67 |     2 |     6 |  1.37 |
| game-of-life-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  10.33 |    10 |    11 |  0.52 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   1.5  |     1 |     2 |  0.55 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  11.67 |    10 |    16 |  2.16 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow     | cell_model         |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |       544 |     550 |     98.9 |
| game-of-life-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |       124 |     126 |     98.4 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |       139 |     140 |     99.3 |

### tests_passed_immediately

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   1.17 |     0 |     3 |  1.17 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  20.33 |     0 |    33 | 11.17 |
| game-of-life-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   0.5  |     0 |     1 |  0.55 |
| game-of-life-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   1.5  |     0 |     9 |  3.67 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   0.33 |     0 |     1 |  0.52 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   2    |     0 |     4 |  2.19 |

### verification_pct

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   0.94 |  0.93 |     1 |  0.03 |
| game-of-life-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   1    |  1    |     1 |  0    |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   0.97 |  0.81 |     1 |  0.08 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                         | cell_workflow     | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |       6 |      100 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |       6 |      100 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow     | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |       6 |      100 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |       6 |      100 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |

### duration_seconds

| kata                         | cell_workflow     | cell_model         |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------|:-------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |  329.5  |   258 |   453 |  65.09 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 | 5514.33 |  4856 |  6450 | 716.16 |
| game-of-life-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |  166.5  |   143 |   205 |  25.67 |
| game-of-life-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 | 1145.33 |   602 |  1408 | 294.1  |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |  251    |   169 |   378 |  73.04 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 | 1475    |  1258 |  1911 | 227.02 |

### total_tokens

| kata                         | cell_workflow     | cell_model         |   n |        mean |       min |       max |              std |
|:-----------------------------|:------------------|:-------------------|----:|------------:|----------:|----------:|-----------------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 | 4.4615e+06  |   3194079 |   5719313 | 834832           |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 | 1.3611e+08  | 121120560 | 176135411 |      2.03967e+07 |
| game-of-life-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 | 2.08094e+06 |   1777833 |   2774928 | 361627           |
| game-of-life-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 | 1.50243e+07 |   8780237 |  19927182 |      3.69196e+06 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 | 2.86057e+06 |   1726241 |   4976600 |      1.10385e+06 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 | 1.9079e+07  |  14796862 |  30728141 |      5.91678e+06 |

### cost_usd

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |    max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|-------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   3.89 |  2.73 |   4.43 |  0.6  |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  78.98 | 70.7  | 101.67 | 11.54 |
| game-of-life-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   1.72 |  1.52 |   2.11 |  0.22 |
| game-of-life-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  10.82 |  6.33 |  14.22 |  2.75 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   2.64 |  1.9  |   4.36 |  0.91 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  12.86 | 10.17 |  20.1  |  3.68 |
