# RQ-workflow-axis-gpt61-sol — Aggregation

_On GPT-6.1 Sol, what does EXACT Coding Predictive TDD buy over a plain inline-TDD baseline, and does isolating the Refactor phase in a subagent add anything on top?_

Generated: 2026-10-12T08:37:49Z

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

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |      1 |    0 |

### tests_passing

| kata                         | cell_workflow                        | cell_model        |   n |   k |   null |   rate_% |
|:-----------------------------|:-------------------------------------|:------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |   5 |      0 |      100 |

### code_mass

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |  615.8 | 19.8  |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |  149.8 |  9.01 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |  561.2 | 18.05 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |  171.4 | 10.26 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |  582   | 14.88 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |  172.2 | 17.31 |

### smell_total

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |    3.8 | 8.5  |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |    3.2 | 1.79 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |    0   | 0    |

### production_loc

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |  142.2 | 13.12 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   26.4 |  4.51 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |  130.2 |  7.98 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   40.6 |  3.44 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |  150.6 |  8.76 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   48.2 |  3.83 |

### cognitive_max

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |    9   | 6.63 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   15.2 | 4.02 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |    3   | 1.41 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |    7   | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |    2.4 | 0.55 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |    5.4 | 1.95 |

### cognitive_avg

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   3.23 | 0.91 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |  15.1  | 4.25 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   1.47 | 0.32 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   3.4  | 0.72 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   1.33 | 0.15 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   2.49 | 0.59 |

### mccabe_max

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |    6.4 | 1.95 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   10.4 | 1.34 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |    3.8 | 1.1  |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |    5   | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |    3.2 | 0.45 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |    4.2 | 0.45 |

### avg_loc_per_function

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   7.55 | 0.94 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |  17.53 | 6.51 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   4.56 | 0.41 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   6    | 1.1  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   4.36 | 0.26 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   5.38 | 0.69 |

### median_loc_per_function

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |    6.2 | 1.6  |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   17.2 | 6.98 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |    3.5 | 0.61 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |    5   | 2.55 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |    3.2 | 0.45 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |    4.1 | 0.74 |

### longest_function

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   20.4 | 4.93 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   23.8 | 2.17 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   12   | 1.87 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   10.6 | 1.67 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   14.2 | 3.03 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   10.4 | 2.19 |

### functions

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   12.4 | 2.3  |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |    1.8 | 0.84 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   18.6 | 1.95 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |    6   | 0.71 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   25.2 | 2.59 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |    8.8 | 1.48 |

### tests_total

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   24.2 | 3.03 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   13   | 0.71 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   48.8 | 1.1  |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   15.2 | 0.45 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   42.4 | 0.55 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   13.8 | 1.1  |

### test_lines

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |  185.2 | 34.13 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   93.4 |  4.28 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |  148.2 | 54.73 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   72.4 |  5.86 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |  186.8 | 19.29 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   69.2 |  4.21 |

### mutation_score

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   0.71 | 0.09 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   0.95 | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   0.54 | 0.49 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   0.95 | 0.01 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   0.55 | 0.5  |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   0.94 | 0.01 |

### mutants_total

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |  181.8 |  6.98 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   43.6 |  1.34 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |  113   |  3.81 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   49.4 |  2.79 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |  121.8 |  5.02 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   63   | 11.02 |

### mutants_survived

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   53.2 | 15.99 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |    2   |  0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   51.4 | 54.45 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |    2.6 |  0.55 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   54.8 | 60.12 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |    3.6 |  1.14 |

### mutants_no_coverage

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   20.6 | 29.13 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |    0   |  0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |    1.8 |  1.64 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |    0   |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |    1.8 |  1.64 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |    0   |  0    |

### tdd_discipline_step

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   0.18 | 0.03 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   1    | 0    |

### red_batch_max

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |    9.8 | 2.68 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |    1   | 0    |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |    1   | 0    |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |    1   | 0    |

### refactor_events

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |    0.8 | 0.45 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   19.6 | 3.36 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |    5.2 | 1.48 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   31   | 5.1  |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |    8.6 | 2.3  |

### cycles_closed

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   10.2 | 1.3  |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |    3.8 | 0.45 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   25   | 1    |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |    3.4 | 0.55 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   22.6 | 2.88 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |    3   | 0.71 |

### chain_suite_runs

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   21.6 |  2.07 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   15.6 |  1.52 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |  123.6 | 11.87 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   36.6 |  0.55 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |  171   | 25.29 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   54   |  5.87 |

### duration_seconds

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |     sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |  450.2 |  40.03 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |  194.6 |  12.97 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 | 2171.4 | 190.46 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |  649.2 |  36.36 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 | 4683.2 | 633.13 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 | 1404.8 | 160.1  |

### total_tokens

| kata                         | cell_workflow                        | cell_model        |   n |   null |             mean |               sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-----------------:|-----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 | 960475           |  69843.1         |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 | 269091           |  35646.2         |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |      8.97392e+06 |      3.43777e+06 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |      1.51481e+06 | 104257           |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |      1.62672e+07 |      3.07539e+06 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |      2.64734e+06 | 296154           |

### cost_usd

| kata                         | cell_workflow                        | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   0.33 | 0.02 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-1-sol-codex |   5 |      0 |   0.13 | 0.02 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   1.47 | 0.58 |
| game-of-life-example-mapping | exact-ptdd-v1-pi                     | gpt-6-1-sol-codex |   5 |      0 |   0.39 | 0.03 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   4.44 | 0.35 |
| game-of-life-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-1-sol-codex |   5 |      0 |   1.09 | 0.09 |
