# RQ-kata-sphinx-workflow-sensitivity — Aggregation

_Does sphinx-score resolve a workflow difference in code quality — does the decomposition gap between a minimal and an elaborate TDD workflow show up as clearly as it does on claim-office?_

Generated: 2026-08-11T13:13:36Z

Cells declared: 4 · matched runs: 24 · min_replicates: 6

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| sphinx-score-example-mapping | v3-basic-tdd | opus-5-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v3-basic-tdd | opus-5-no-thinking | 6 | 6 | ✅ |

## Outcome-Pivots (pro Zelle)

### cc_longest_function

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |  24.33 |    19 |    27 |  2.8  |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  13.83 |    10 |    18 |  3.19 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |  11    |     8 |    13 |  1.9  |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   5.83 |     2 |     7 |  1.94 |

### cc_avg_loc_per_function

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   8.9  |  7.44 | 11.54 |  1.65 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   3.19 |  2.91 |  3.48 |  0.23 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   8.38 |  7    | 11    |  1.42 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   3.54 |  2    |  5.2  |  1.11 |

### cognitive_max

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   5.33 |     4 |     9 |  1.86 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   2    |     1 |     3 |  1.1  |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   1.5  |     1 |     3 |  0.84 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   1    |     1 |     1 |  0    |

### mccabe_max

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   5.33 |     4 |     7 |  1.03 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   2.83 |     2 |     4 |  0.75 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   2.33 |     2 |     3 |  0.52 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   2    |     2 |     2 |  0    |

### cc_functions

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   14.5 |    11 |    20 |  3.15 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   38   |    33 |    47 |  5.51 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |    3.5 |     3 |     4 |  0.55 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |    6.5 |     5 |     9 |  1.64 |

### smell_total (rate %)

| kata                         | cell_workflow     | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |       0 |        0 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |       0 |        0 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |       0 |        0 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |       0 |        0 |

### code_mass

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 | 758.17 |   674 |   881 | 95.71 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 | 997    |   896 |  1083 | 67.06 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 | 182.83 |   150 |   233 | 31.01 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 | 182.83 |   154 |   251 | 36.22 |

### lines_of_code

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 | 314.67 |   267 |   365 | 40.04 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 | 523    |   411 |   618 | 86.38 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |  77.5  |    65 |    93 |  9.14 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  57.5  |    47 |    74 | 11.18 |

### refactorings_applied

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   2    |     1 |     3 |  0.89 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  44.5  |    36 |    57 |  8.02 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   2.67 |     1 |     4 |  1.03 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  11.67 |    10 |    16 |  2.16 |

### cycle_count

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   5.17 |     2 |     8 |  2.32 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  45.83 |    36 |    57 |  7.08 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   1.5  |     1 |     2 |  0.55 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  11.67 |    10 |    16 |  2.16 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow     | cell_model         |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |       544 |     550 |     98.9 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |       139 |     140 |     99.3 |

### tests_passed_immediately

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   1.17 |     0 |     3 |  1.17 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  20.33 |     0 |    33 | 11.17 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   0.33 |     0 |     1 |  0.52 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   2    |     0 |     4 |  2.19 |

### verification_pct

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   0.94 |  0.93 |     1 |  0.03 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   0.97 |  0.81 |     1 |  0.08 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                         | cell_workflow     | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |       6 |      100 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |       6 |      100 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow     | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |       6 |      100 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |       6 |      100 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |

### duration_seconds

| kata                         | cell_workflow     | cell_model         |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------|:-------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |  329.5  |   258 |   453 |  65.09 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 | 5514.33 |  4856 |  6450 | 716.16 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |  251    |   169 |   378 |  73.04 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 | 1475    |  1258 |  1911 | 227.02 |

### total_tokens

| kata                         | cell_workflow     | cell_model         |   n |        mean |       min |       max |              std |
|:-----------------------------|:------------------|:-------------------|----:|------------:|----------:|----------:|-----------------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 | 4.4615e+06  |   3194079 |   5719313 | 834832           |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 | 1.3611e+08  | 121120560 | 176135411 |      2.03967e+07 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 | 2.86057e+06 |   1726241 |   4976600 |      1.10385e+06 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 | 1.9079e+07  |  14796862 |  30728141 |      5.91678e+06 |

### cost_usd

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |    max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|-------:|------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   3.89 |  2.73 |   4.43 |  0.6  |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  78.98 | 70.7  | 101.67 | 11.54 |
| sphinx-score-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   6 |   2.64 |  1.9  |   4.36 |  0.91 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   6 |  12.86 | 10.17 |  20.1  |  3.68 |
