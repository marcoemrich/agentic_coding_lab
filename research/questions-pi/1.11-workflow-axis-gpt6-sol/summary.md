# RQ-workflow-axis-gpt6-sol — Aggregation

_On GPT-6 Sol, what does EXACT Coding Predictive TDD buy over a plain inline-TDD baseline, and does isolating the Refactor phase in a subagent add anything on top?_

Generated: 2026-10-12T10:46:39Z

Cells declared: 6 · matched runs: 30 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi | gpt-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi | gpt-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                        | cell_model      |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |      1 |    0 |

### tests_passing

| kata                         | cell_workflow                        | cell_model      |   n |   k |   null |   rate_% |
|:-----------------------------|:-------------------------------------|:----------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   5 |      0 |      100 |

### code_mass

| kata                         | cell_workflow                        | cell_model      |   n |   null |   mean |     sd |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |  414.6 |  17.7  |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |  154.2 |  24.19 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |  655.6 | 272.36 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |  154   |  15.89 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |  580.6 | 101.26 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |  168.8 |  14.75 |

### smell_total

| kata                         | cell_workflow                        | cell_model      |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |   23.4 | 7.83 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |    3   | 2.74 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |    0   | 0    |

### production_loc

| kata                         | cell_workflow                        | cell_model      |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |   70.2 | 10.33 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |   24.2 |  3.7  |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |  112.8 | 31.04 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |   37   |  4.3  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |  119.8 | 27.24 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |   45.2 |  3.77 |

### cognitive_max

| kata                         | cell_workflow                        | cell_model      |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |   35.4 | 11.17 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |   14.6 |  8.02 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |    4.6 |  1.52 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |    6   |  0.71 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |    5.2 |  1.79 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |    5   |  1.87 |

### cognitive_avg

| kata                         | cell_workflow                        | cell_model      |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |  12.41 | 9.27 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |  12    | 9.43 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |   2.1  | 0.28 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |   2.77 | 0.38 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |   2.38 | 0.46 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |   2.23 | 0.96 |

### mccabe_max

| kata                         | cell_workflow                        | cell_model      |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |   14.4 | 3.65 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |    7.8 | 3.56 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |    4.4 | 0.55 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |    4.2 | 0.45 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |    5.4 | 1.67 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |    4   | 0.71 |

### avg_loc_per_function

| kata                         | cell_workflow                        | cell_model      |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |  22.5  | 10.65 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |  13.1  |  7.21 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |   5.57 |  0.69 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |   6.83 |  1.03 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |   5.97 |  1.24 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |   5.09 |  0.62 |

### median_loc_per_function

| kata                         | cell_workflow                        | cell_model      |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |   19.3 | 14.58 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |   13.1 |  7.21 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |    3.6 |  1.08 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |    5.8 |  2.68 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |    4.2 |  1.1  |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |    3.8 |  0.84 |

### longest_function

| kata                         | cell_workflow                        | cell_model      |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |   36   |  6.16 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |   17.8 |  9.68 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |   20   | 10.32 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |   12.2 |  2.17 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |   19.4 |  2.61 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |   10.8 |  1.79 |

### functions

| kata                         | cell_workflow                        | cell_model      |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |    2.2 | 0.84 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |    1.6 | 0.55 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |   12.2 | 3.96 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |    4.8 | 1.1  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |   13.6 | 8.26 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |    8.4 | 1.14 |

### tests_total

| kata                         | cell_workflow                        | cell_model      |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |   12.6 |  3.29 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |   11   |  1.87 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |   34.6 | 18.9  |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |   14   |  0.71 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |   42.6 |  8.91 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |   12.4 |  1.34 |

### test_lines

| kata                         | cell_workflow                        | cell_model      |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |  123.4 | 17.21 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |   67.2 |  9.31 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |   93.2 | 53.28 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |   56.2 |  3.27 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |  114   | 28.78 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |   51   |  7.58 |

### mutation_score

| kata                         | cell_workflow                        | cell_model      |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |   0.94 | 0.03 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |   0.95 | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |   0.46 | 0.44 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |   0.95 | 0.03 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |   0    | 0    |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |   0.95 | 0.02 |

### mutants_total

| kata                         | cell_workflow                        | cell_model      |   n |   null |   mean |     sd |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |  101.8 |   8.23 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |   42.4 |   2.88 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |  135.2 | 104.24 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |   59.2 |  15.16 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |  119.6 |  23.46 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |   65.4 |   9.13 |

### mutants_survived

| kata                         | cell_workflow                        | cell_model      |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |    6.2 |  3.63 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |    2   |  0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |   61.2 | 56.57 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |    3.4 |  3.13 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |  119.6 | 23.46 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |    3.2 |  1.64 |

### mutants_no_coverage

| kata                         | cell_workflow                        | cell_model      |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |    0.4 |  0.89 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |    0   |  0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |   19.6 | 38.86 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |    0   |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |    0   |  0    |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |    0   |  0    |

### predictions_correct_rate

| kata                         | cell_workflow                        | cell_model      |   n |   null |   mean |   sd |   k |   t |   rate_% |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|-------:|-----:|----:|----:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |    nan |  nan | 277 | 278 |     99.6 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |    nan |  nan | 140 | 140 |    100   |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |    nan |  nan | 128 | 130 |     98.5 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |    nan |  nan | 124 | 124 |    100   |

### duration_seconds

| kata                         | cell_workflow                        | cell_model      |   n |   null |   mean |      sd |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|-------:|--------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |  221   |   34.17 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |  117.6 |   33.24 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 | 1300.6 |  588.54 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |  573   |   37.72 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 | 1825.2 | 1838.75 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 | 1257.6 |   88.58 |

### total_tokens

| kata                         | cell_workflow                        | cell_model      |   n |   null |             mean |               sd |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|-----------------:|-----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 | 435467           | 121182           |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 | 158407           |  69088           |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |      4.19828e+06 |      2.24845e+06 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |      1.45364e+06 | 127077           |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |      5.11468e+06 |      6.5031e+06  |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |      3.02818e+06 | 380068           |

### cost_usd

| kata                         | cell_workflow                        | cell_model      |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |   0.21 | 0.03 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      0 |   0.09 | 0.03 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |   1.24 | 0.56 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      0 |   0.49 | 0.05 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |   2.12 | 2.42 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      0 |   1.41 | 0.12 |
