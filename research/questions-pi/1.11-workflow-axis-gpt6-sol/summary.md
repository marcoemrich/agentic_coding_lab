# RQ-workflow-axis-gpt6-sol — Aggregation

_On GPT-6 Sol, what does EXACT Coding Predictive TDD buy over a plain inline-TDD baseline, and does isolating the Refactor phase in a subagent add anything on top?_

Generated: 2026-09-24T08:27:17Z

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

| kata                         | cell_workflow                        | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      1 |     1 |     1 |     0 |

### tests_passing (rate %)

| kata                         | cell_workflow                        | cell_model      |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------------|:----------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                        | cell_model      |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------------|:----------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |       5 |      100 |

### code_mass

| kata                         | cell_workflow                        | cell_model      |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |  414.6 |   395 |   439 |  17.7  |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |  655.6 |   496 |  1139 | 272.36 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |  580.6 |   512 |   760 | 101.26 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |  154.2 |   128 |   189 |  24.19 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |  154   |   136 |   175 |  15.89 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |  168.8 |   152 |   191 |  14.75 |

### smell_total

| kata                         | cell_workflow                        | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |   23.4 |    18 |    37 |  7.83 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |    3   |     0 |     5 |  2.74 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |    0   |     0 |     0 |  0    |

### cc_loc

| kata                         | cell_workflow                        | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |   70.2 |    61 |    88 | 10.33 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |  112.8 |    82 |   163 | 31.04 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |  119.8 |   103 |   168 | 27.24 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |   24.2 |    20 |    29 |  3.7  |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   37   |    31 |    42 |  4.3  |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   45.2 |    41 |    49 |  3.77 |

### cognitive_max

| kata                         | cell_workflow                        | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |   35.4 |    24 |    54 | 11.17 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |    4.6 |     3 |     7 |  1.52 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |    5.2 |     3 |     8 |  1.79 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |   14.6 |     4 |    23 |  8.02 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |    6   |     5 |     7 |  0.71 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |    5   |     3 |     7 |  1.87 |

### cognitive_avg

| kata                         | cell_workflow                        | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |  12.41 |  8.2  | 29    |  9.27 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   2.1  |  1.86 |  2.56 |  0.28 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   2.38 |  1.85 |  3    |  0.46 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |  12    |  3    | 23    |  9.43 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   2.77 |  2.5  |  3.33 |  0.38 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   2.23 |  1.4  |  3.75 |  0.96 |

### mccabe_max

| kata                         | cell_workflow                        | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |   14.4 |    10 |    20 |  3.65 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |    4.4 |     4 |     5 |  0.55 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |    5.4 |     4 |     8 |  1.67 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |    7.8 |     4 |    12 |  3.56 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |    4.2 |     4 |     5 |  0.45 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |    4   |     3 |     5 |  0.71 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                        | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |  22.5  | 12.33 | 37    | 10.65 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   5.57 |  4.56 |  6.25 |  0.69 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   5.97 |  4.39 |  7.22 |  1.24 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |  13.1  |  1.5  | 21    |  7.21 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   6.83 |  6.2  |  8.67 |  1.03 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   5.09 |  4.4  |  5.86 |  0.62 |

### cc_median_loc_per_function

| kata                         | cell_workflow                        | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |   19.3 |   4   |  37   | 14.58 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |    3.6 |   2   |   4.5 |  1.08 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |    4.2 |   3   |   5   |  1.1  |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |   13.1 |   1.5 |  21   |  7.21 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |    5.8 |   3   |  10   |  2.68 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |    3.8 |   3   |   5   |  0.84 |

### cc_longest_function

| kata                         | cell_workflow                        | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |   36   |    31 |    46 |  6.16 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   20   |    13 |    38 | 10.32 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   19.4 |    18 |    24 |  2.61 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |   17.8 |     2 |    27 |  9.68 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   12.2 |     9 |    15 |  2.17 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   10.8 |     9 |    13 |  1.79 |

### cc_functions

| kata                         | cell_workflow                        | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |    2.2 |     1 |     3 |  0.84 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   12.2 |     9 |    19 |  3.96 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   13.6 |     8 |    28 |  8.26 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |    1.6 |     1 |     2 |  0.55 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |    4.8 |     3 |     6 |  1.1  |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |    8.4 |     7 |    10 |  1.14 |

### tests_total

| kata                         | cell_workflow                        | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |   12.6 |    10 |    18 |  3.29 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   34.6 |     1 |    46 | 18.9  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   42.6 |    27 |    49 |  8.91 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |   11   |     9 |    13 |  1.87 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   14   |    13 |    15 |  0.71 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   12.4 |    11 |    14 |  1.34 |

### test_lines

| kata                         | cell_workflow                        | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |  123.4 |    99 |   146 | 17.21 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   93.2 |    46 |   184 | 53.28 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |  114   |    81 |   144 | 28.78 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |   67.2 |    55 |    76 |  9.31 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   56.2 |    53 |    60 |  3.27 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   51   |    43 |    62 |  7.58 |

### mutation_score

| kata                         | cell_workflow                        | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |   0.94 |  0.9  |  0.99 |  0.03 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   0.46 |  0    |  0.9  |  0.44 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   0    |  0    |  0    |  0    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |   0.95 |  0.95 |  0.96 |  0    |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   0.95 |  0.89 |  0.97 |  0.03 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   0.95 |  0.92 |  0.97 |  0.02 |

### mutants_total

| kata                         | cell_workflow                        | cell_model      |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |  101.8 |    90 |   113 |   8.23 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |  135.2 |    42 |   314 | 104.24 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |  119.6 |    91 |   155 |  23.46 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |   42.4 |    38 |    45 |   2.88 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   59.2 |    46 |    85 |  15.16 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   65.4 |    54 |    73 |   9.13 |

### mutants_survived

| kata                         | cell_workflow                        | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |    6.2 |     1 |    11 |  3.63 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   61.2 |    11 |   144 | 56.57 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |  119.6 |    91 |   155 | 23.46 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |    2   |     2 |     2 |  0    |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |    3.4 |     2 |     9 |  3.13 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |    3.2 |     2 |     6 |  1.64 |

### mutants_no_coverage

| kata                         | cell_workflow                        | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |    0.4 |     0 |     2 |  0.89 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   19.6 |     0 |    89 | 38.86 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |    0   |     0 |     0 |  0    |

### cycle_count

| kata                         | cell_workflow                        | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |    6.8 |     4 |     9 |  1.79 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   31   |     3 |    46 | 17.99 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   13   |     1 |    44 | 17.73 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |    6.4 |     4 |    11 |  2.7  |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   14   |    13 |    15 |  0.71 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   12.4 |    11 |    14 |  1.34 |

### refactorings_applied

| kata                         | cell_workflow                        | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |    0.6 |     0 |     1 |  0.55 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   28   |     4 |    46 | 16.57 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   13.4 |     2 |    44 | 17.42 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |    0.2 |     0 |     1 |  0.45 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   14   |    13 |    15 |  0.71 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   12.4 |    11 |    14 |  1.34 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                        | cell_model      |   n |   correct |   total |   rate_% |
|:-----------------------------|:-------------------------------------|:----------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |       277 |     278 |     99.6 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |       128 |     130 |     98.5 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |       140 |     140 |    100   |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |       124 |     124 |    100   |

### duration_seconds

| kata                         | cell_workflow                        | cell_model      |   n |   mean |   min |   max |     std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|------:|------:|--------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |  221   |   166 |   255 |   34.17 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 | 1300.6 |   376 |  1906 |  588.54 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 | 1825.2 |   447 |  5017 | 1838.75 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |  117.6 |    93 |   171 |   33.24 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |  573   |   541 |   634 |   37.72 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 | 1257.6 |  1139 |  1377 |   88.58 |

### total_tokens

| kata                         | cell_workflow                        | cell_model      |   n |             mean |     min |      max |              std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-----------------:|--------:|---------:|-----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 | 435467           |  223484 |   506231 | 121182           |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      4.19828e+06 |  732743 |  6331495 |      2.24845e+06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      5.11468e+06 |  871311 | 16541980 |      6.5031e+06  |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 | 158407           |  106451 |   278813 |  69088           |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |      1.45364e+06 | 1290697 |  1627342 | 127077           |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |      3.02818e+06 | 2547329 |  3362537 | 380068           |

### cost_usd

| kata                         | cell_workflow                        | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |   0.21 |  0.16 |  0.25 |  0.03 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   1.24 |  0.36 |  1.82 |  0.56 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   2.12 |  0.48 |  6.34 |  2.42 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex |   5 |   0.09 |  0.07 |  0.14 |  0.03 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex |   5 |   0.49 |  0.45 |  0.56 |  0.05 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex |   5 |   1.41 |  1.28 |  1.53 |  0.12 |
