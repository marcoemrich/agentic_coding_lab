# RQ-workflow-axis-gpt61-sol — Aggregation

_On GPT-6.1 Sol, what does EXACT Coding Predictive TDD buy over a plain inline-TDD baseline, and does isolating the Refactor phase in a subagent add anything on top?_

Generated: 2026-10-05T08:51:23Z

Cells declared: 6 · matched runs: 30 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi | gpt-6-1-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi | gpt-6-1-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      1 |     1 |     1 |     0 |

### tests_passing (rate %)

| kata                         | cell_workflow                        | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                        | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |       5 |      100 |

### code_mass

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |  615.8 |   592 |   638 | 19.8  |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |  561.2 |   535 |   580 | 18.05 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |  582   |   566 |   600 | 14.88 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |  149.8 |   143 |   165 |  9.01 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |  171.4 |   155 |   181 | 10.26 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |  172.2 |   151 |   190 | 17.31 |

### smell_total

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |    3.8 |     0 |    19 |  8.5  |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |    3.2 |     0 |     4 |  1.79 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |    0   |     0 |     0 |  0    |

### cc_loc

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |  142.2 |   120 |   154 | 13.12 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |  130.2 |   119 |   141 |  7.98 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |  150.6 |   137 |   159 |  8.76 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   26.4 |    23 |    34 |  4.51 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   40.6 |    36 |    44 |  3.44 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   48.2 |    44 |    53 |  3.83 |

### cognitive_max

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |    9   |     4 |    20 |  6.63 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |    3   |     2 |     5 |  1.41 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |    2.4 |     2 |     3 |  0.55 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   15.2 |     8 |    17 |  4.02 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |    7   |     7 |     7 |  0    |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |    5.4 |     3 |     8 |  1.95 |

### cognitive_avg

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   3.23 |  2.31 |  4.67 |  0.91 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   1.47 |  1.18 |  1.91 |  0.32 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   1.33 |  1.18 |  1.55 |  0.15 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |  15.1  |  7.5  | 17    |  4.25 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   3.4  |  2.5  |  4.25 |  0.72 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   2.49 |  2    |  3.5  |  0.59 |

### mccabe_max

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |    6.4 |     5 |     9 |  1.95 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |    3.8 |     3 |     5 |  1.1  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |    3.2 |     3 |     4 |  0.45 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   10.4 |     8 |    11 |  1.34 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |    5   |     5 |     5 |  0    |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |    4.2 |     4 |     5 |  0.45 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   7.55 |  6.07 |  8.67 |  0.94 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   4.56 |  4.14 |  5.25 |  0.41 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   4.36 |  4    |  4.64 |  0.26 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |  17.53 | 10.67 | 25    |  6.51 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   6    |  4.67 |  7.6  |  1.1  |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   5.38 |  4.64 |  6.14 |  0.69 |

### cc_median_loc_per_function

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |    6.2 |     4 |   7.5 |  1.6  |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |    3.5 |     3 |   4.5 |  0.61 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |    3.2 |     3 |   4   |  0.45 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   17.2 |     9 |  25   |  6.98 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |    5   |     3 |   9   |  2.55 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |    4.1 |     3 |   5   |  0.74 |

### cc_longest_function

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   20.4 |    17 |    29 |  4.93 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   12   |    10 |    14 |  1.87 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   14.2 |    10 |    17 |  3.03 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   23.8 |    20 |    25 |  2.17 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   10.6 |     9 |    13 |  1.67 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   10.4 |     9 |    14 |  2.19 |

### cc_functions

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   12.4 |     9 |    15 |  2.3  |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   18.6 |    16 |    21 |  1.95 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   25.2 |    22 |    29 |  2.59 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |    1.8 |     1 |     3 |  0.84 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |    6   |     5 |     7 |  0.71 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |    8.8 |     7 |    11 |  1.48 |

### tests_total

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   24.2 |    21 |    27 |  3.03 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   48.8 |    48 |    50 |  1.1  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   42.4 |    42 |    43 |  0.55 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   13   |    12 |    14 |  0.71 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   15.2 |    15 |    16 |  0.45 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   13.8 |    12 |    15 |  1.1  |

### test_lines

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |  185.2 |   150 |   232 | 34.13 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |  148.2 |   102 |   228 | 54.73 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |  186.8 |   159 |   211 | 19.29 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   93.4 |    89 |   100 |  4.28 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   72.4 |    65 |    80 |  5.86 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   69.2 |    65 |    76 |  4.21 |

### mutation_score

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   0.71 |  0.58 |  0.83 |  0.09 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   0.54 |  0    |  0.92 |  0.49 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   0.55 |  0    |  0.93 |  0.5  |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   0.95 |  0.95 |  0.96 |  0    |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   0.95 |  0.93 |  0.96 |  0.01 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   0.94 |  0.92 |  0.96 |  0.01 |

### mutants_total

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |  181.8 |   172 |   191 |  6.98 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |  113   |   109 |   118 |  3.81 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |  121.8 |   115 |   126 |  5.02 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   43.6 |    43 |    46 |  1.34 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   49.4 |    46 |    52 |  2.79 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   63   |    49 |    79 | 11.02 |

### mutants_survived

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   53.2 |    33 |    76 | 15.99 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   51.4 |     9 |   111 | 54.45 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   54.8 |     9 |   126 | 60.12 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |    2   |     2 |     2 |  0    |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |    2.6 |     2 |     3 |  0.55 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |    3.6 |     2 |     5 |  1.14 |

### mutants_no_coverage

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   20.6 |     0 |    72 | 29.13 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |    1.8 |     0 |     3 |  1.64 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |    1.8 |     0 |     3 |  1.64 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |    0   |     0 |     0 |  0    |

### tdd_discipline_step

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   0.18 |  0.12 |   0.2 |  0.03 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   1    |  1    |   1   |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   1    |  1    |   1   |  0    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   1    |  1    |   1   |  0    |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   1    |  1    |   1   |  0    |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   1    |  1    |   1   |  0    |

### red_batch_max

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |    9.8 |     7 |    13 |  2.68 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |    1   |     1 |     1 |  0    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |    1   |     1 |     1 |  0    |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |    1   |     1 |     1 |  0    |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |    1   |     1 |     1 |  0    |

### refactor_events

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |    0.8 |     0 |     1 |  0.45 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   19.6 |    16 |    24 |  3.36 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   31   |    25 |    38 |  5.1  |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |    5.2 |     3 |     7 |  1.48 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |    8.6 |     6 |    11 |  2.3  |

### cycles_closed

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   10.2 |     8 |    11 |  1.3  |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   25   |    24 |    26 |  1    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   22.6 |    19 |    26 |  2.88 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |    3.8 |     3 |     4 |  0.45 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |    3.4 |     3 |     4 |  0.55 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |    3   |     2 |     4 |  0.71 |

### chain_suite_runs

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   21.6 |    18 |    23 |  2.07 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |  123.6 |   104 |   134 | 11.87 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |  171   |   142 |   207 | 25.29 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   15.6 |    14 |    17 |  1.52 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   36.6 |    36 |    37 |  0.55 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   54   |    46 |    61 |  5.87 |

### duration_seconds

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |  450.2 |   379 |   473 |  40.03 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 | 2171.4 |  1945 |  2437 | 190.46 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 | 4683.2 |  3875 |  5394 | 633.13 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |  194.6 |   179 |   209 |  12.97 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |  649.2 |   614 |   708 |  36.36 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 | 1404.8 |  1209 |  1572 | 160.1  |

### total_tokens

| kata                         | cell_workflow                        | cell_model        |   n |             mean |      min |      max |              std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-----------------:|---------:|---------:|-----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 | 960475           |   903152 |  1066793 |  69843.1         |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      8.97392e+06 |  3500257 | 12129902 |      3.43777e+06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      1.62672e+07 | 12629297 | 20952980 |      3.07539e+06 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 | 269091           |   232525 |   322962 |  35646.2         |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      1.51481e+06 |  1408019 |  1664613 | 104257           |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      2.64734e+06 |  2359493 |  3095563 | 296154           |

### cost_usd

| kata                         | cell_workflow                        | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   0.33 |  0.31 |  0.35 |  0.02 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   1.47 |  0.51 |  2    |  0.58 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   4.44 |  3.94 |  4.89 |  0.35 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   0.13 |  0.1  |  0.14 |  0.02 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   0.39 |  0.34 |  0.42 |  0.03 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   1.09 |  1.02 |  1.22 |  0.09 |
