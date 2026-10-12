# RQ-kata-sphinx-workflow-sensitivity — Aggregation

_Does sphinx-score resolve a workflow difference in code quality — does the decomposition gap between a minimal and an elaborate TDD workflow show up as clearly as it does on claim-office?_

Generated: 2026-10-12T10:46:26Z

Cells declared: 6 · matched runs: 36 · min_replicates: 6

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking | 6 | 6 | ✅ |

## Outcome pivots (per cell)

### longest_function

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   5.83 | 1.94 |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |  11    | 1.9  |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  13.83 | 3.19 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |  24.33 | 2.8  |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   7.5  | 1.87 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |  14.5  | 5.01 |

### avg_loc_per_function

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   3.54 | 1.11 |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |   8.38 | 1.42 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   3.19 | 0.23 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |   8.9  | 1.65 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   3.46 | 1    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |   6.48 | 2.16 |

### cognitive_max

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   1    | 0    |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |   1.5  | 0.84 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   2    | 1.1  |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |   5.33 | 1.86 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   1.17 | 0.41 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |   7.17 | 2.04 |

### mccabe_max

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   2    | 0    |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |   2.33 | 0.52 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   2.83 | 0.75 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |   5.33 | 1.03 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   2.5  | 0.55 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |   5.67 | 1.63 |

### functions

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   6.5  | 1.64 |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |   3.5  | 0.55 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  38    | 5.51 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |  14.5  | 3.15 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   8.5  | 2.07 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |   4.83 | 1.17 |

### smell_total

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |      0 |    0 |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |      0 |    0 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |      0 |    0 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |      0 |    0 |

### code_mass

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 182.83 | 36.22 |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 | 182.83 | 31.01 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 997    | 67.06 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 | 758.17 | 95.71 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 195.83 | 21.24 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 | 196.83 | 18.64 |

### lines_of_code

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  57.5  | 11.18 |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |  77.5  |  9.14 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 523    | 86.38 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 | 314.67 | 40.04 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  53.5  | 11.29 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |  55    |  8.65 |

### predictions_correct_rate

| kata                         | cell_workflow                | cell_model         |   n |   k |   t |   null |   rate_% |   mean |   sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|----:|----:|-------:|---------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 139 | 140 |      0 |     99.3 |    nan |  nan |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   0 | nan | nan |      6 |    nan   |    nan |  nan |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 544 | 550 |      0 |     98.9 |    nan |  nan |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   0 | nan | nan |      6 |    nan   |    nan |  nan |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 124 | 126 |      0 |     98.4 |    nan |  nan |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   0 | nan | nan |      6 |    nan   |    nan |  nan |

### verification_pct

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   1    | 0    |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |   0.97 | 0.08 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   0.94 | 0.03 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   1    | 0    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |   1    | 0    |

### tests_passing

| kata                         | cell_workflow                | cell_model         |   n |   k |   null |   rate_% |
|:-----------------------------|:-----------------------------|:-------------------|----:|----:|-------:|---------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   6 |      0 |      100 |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |   6 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   6 |      0 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |   6 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   6 |      0 |      100 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |   6 |      0 |      100 |

### duration_seconds

| kata                         | cell_workflow                | cell_model         |   n |   null |    mean |     sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|--------:|-------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 1475    | 227.02 |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |  251    |  73.04 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 5514.33 | 716.16 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |  329.5  |  65.09 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 1145.33 | 294.1  |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |  166.5  |  25.67 |

### total_tokens

| kata                         | cell_workflow                | cell_model         |   n |   null |        mean |               sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------------:|-----------------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 2.51255e+07 |      6.47713e+06 |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 | 2.86057e+06 |      1.10385e+06 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 1.61604e+08 |      2.27384e+07 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 | 4.4615e+06  | 834832           |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 1.96883e+07 |      4.62056e+06 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 | 2.08094e+06 | 361627           |

### cost_usd

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  20.01 |  4.37 |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |   2.64 |  0.91 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 109.59 | 15.26 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |   3.89 |  0.6  |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  16.5  |  4.16 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc    | opus-5-no-thinking |   6 |      0 |   1.72 |  0.22 |
