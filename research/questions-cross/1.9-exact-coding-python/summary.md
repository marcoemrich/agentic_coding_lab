# RQ-exact-coding-python — Aggregation

_On Python with pytest, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness and code quality for GPT-5.6 SOL and Opus 5?_

Generated: 2026-10-12T08:37:46Z

Cells declared: 12 · matched runs: 60 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-python-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-python-example-mapping | exact-ptdd-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   1    | 0    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   1    | 0    |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   1    | 0    |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   1    | 0    |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   1    | 0    |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   1    | 0    |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   0.97 | 0.04 |

### tests_passing

| kata                                | cell_workflow                        | cell_model         |   n |   k |   null |   rate_% |
|:------------------------------------|:-------------------------------------|:-------------------|----:|----:|-------:|---------:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   5 |      0 |      100 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   5 |      0 |      100 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   5 |      0 |      100 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   5 |      0 |      100 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   5 |      0 |      100 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   5 |      0 |      100 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   5 |      0 |      100 |

### tests_total

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   12.4 | 0.89 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   12.4 | 3.78 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   14.2 | 1.1  |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   34.8 | 8.87 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   13.8 | 1.1  |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   34.2 | 3.77 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   15.8 | 6.53 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   50.6 | 7.47 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   20.2 | 3.56 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   55.8 | 5.22 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   21.2 | 3.56 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   54   | 4.85 |

### test_lines

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |     sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |  104   |   7.81 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |  180.8 |  34.13 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |  165.8 |  16.12 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |  277.6 |  41.79 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |  144.4 |  25.46 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |  266.6 |  41.91 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |  113   |  53.42 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |  408.4 |  81.1  |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  170   |  16.9  |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  736.8 | 215.85 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |  168.4 |  40.87 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |  627.2 | 339.42 |

### lines_of_code

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |     sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   60.8 |   4.32 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |  213   |  16.58 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   76.2 |  11.12 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |  163.8 |  18.5  |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   89   |  19.33 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |  243.6 |  36.39 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   56.6 |   8.88 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |  258.2 |  23.72 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   75.2 |   7.29 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  263.2 |  30.28 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   87.2 |  16.68 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |  508.6 | 112.52 |

### code_mass

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |  186.8 | 17.64 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |  875.8 | 36.43 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |  202.8 |  9.31 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |  590.2 | 50.37 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |  208.2 | 14.6  |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |  671.6 | 69.44 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |  179   | 14.11 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |  837.4 | 48.52 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  206.4 | 18.09 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  832.4 | 74.1  |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |  223.4 | 23.34 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 | 1013.2 | 85.87 |

### smell_total

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |      0 |    0 |

### smell_complexity

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |      0 |    0 |

### smell_duplication

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |      0 |    0 |

### smell_magic_numbers

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |      0 |    0 |

### smell_code_quality

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |      0 |    0 |

### cognitive_max

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   10.4 | 5.5  |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   14.2 | 3.56 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    4.2 | 1.48 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    5   | 1    |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    3   | 0.71 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    4.8 | 1.3  |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    5   | 1.87 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    6.2 | 1.64 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    5.4 | 3.05 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    7   | 0.71 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    3   | 0.71 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    4.6 | 1.34 |

### cognitive_avg

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   5.9  | 2.68 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   5.48 | 1.32 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   1.68 | 0.29 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   2.01 | 0.47 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   1    | 0.29 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   0.81 | 0.13 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   3.45 | 1.39 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   1.7  | 0.27 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   1.64 | 0.24 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   1.47 | 0.47 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   1.14 | 0.18 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   0.7  | 0.21 |

### mccabe_max

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    3.8 | 1.64 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    8.6 | 1.14 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    2   | 0    |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    3.4 | 0.55 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    2   | 0    |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    3.4 | 0.55 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    3   | 1    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    3.8 | 0.45 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    3   | 1.41 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    3.6 | 0.89 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    2.2 | 0.45 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    3.2 | 0.45 |

### mccabe_avg

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   2.45 | 1.11 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   3.98 | 0.77 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   1.17 | 0.07 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   1.89 | 0.36 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   1.19 | 0.18 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   1.39 | 0.08 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   1.76 | 0.38 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   1.95 | 0.26 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   1.33 | 0.18 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   1.75 | 0.26 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   1.24 | 0.08 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   1.4  | 0.1  |

### unit_count

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    2.8 | 0.84 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   11.2 | 1.79 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    7.2 | 0.84 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   13.4 | 3.13 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   10.2 | 3.03 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   31.8 | 3.35 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    4.2 | 1.3  |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   20.6 | 3.13 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    9.8 | 1.3  |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   23.6 | 6.43 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   11.4 | 1.14 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   42   | 7.71 |

### unit_size_max

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   15.2 | 3.56 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   31.4 | 4.16 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    9.4 | 2.07 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   17.6 | 2.41 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    7.2 | 0.84 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   18.2 | 2.86 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    9.4 | 3.65 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   16.6 | 3.91 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    8.6 | 2.07 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   17.6 | 4.39 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    8   | 1.22 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   18.8 | 4.55 |

### unit_size_avg

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |  10.82 | 2.34 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |  12.36 | 2.33 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   5.39 | 0.56 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   7.3  | 1.55 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   4.39 | 0.64 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   4.32 | 0.32 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   6.68 | 2.42 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   7.03 | 1.34 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   4.06 | 0.39 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   6.77 | 1.48 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   4.18 | 0.63 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   7.46 | 1.28 |

### unit_size_median

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   10.3 | 2.99 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    9.3 | 2.44 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    5.5 | 0.79 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    5.8 | 2.46 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    4.4 | 0.65 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    3   | 0    |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    6.1 | 1.52 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    6.2 | 1.6  |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    3.1 | 0.89 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    6   | 1.77 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    3.5 | 0.87 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    6.4 | 2.33 |

### coverage_statements_pct

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   56.2 |  5.54 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   71   | 12.75 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   49.6 |  2.07 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   29.8 | 41.15 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   53.2 |  2.59 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    0   |  0    |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   55.6 |  7.5  |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   88   |  1.87 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   58.4 |  4.56 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   90   |  0.71 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   57.4 |  2.97 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   79.8 |  7.53 |

### test_blocks

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    7.4 | 3.21 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    3   | 1    |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   15.6 | 1.52 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   36.8 | 9.2  |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   15   | 1.22 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   35.8 | 4.09 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    0.4 | 0.55 |

### test_cases_total

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   16.2 |  4.15 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   13   |  3.67 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   25.8 |  4.49 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   43   | 17.42 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   19.8 |  5.85 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   43.6 | 21.02 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    0   |  0    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    0   |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    0   |  0    |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    0   |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    0   |  0    |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   23   | 31.54 |

### test_cases_first_block

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    1   |  0    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    7.2 |  5.54 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   14   |  0.71 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   34.4 |  9.07 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   13.8 |  1.1  |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   33.6 |  2.7  |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    0   |  0    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    0   |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    0   |  0    |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    0   |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    0   |  0    |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   23   | 31.54 |

### red_verified

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    7.4 | 3.21 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    2.8 | 0.84 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   15.6 | 1.52 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   36.8 | 9.2  |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   14.8 | 1.3  |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   35.8 | 4.09 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    0.4 | 0.55 |

### red_unverified

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    0   | 0    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    0.2 | 0.45 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    0   | 0    |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    0   | 0    |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    0.2 | 0.45 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    0   | 0    |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    0   | 0    |

### refactorings_applied

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    0   |  0    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    0   |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   14.2 |  1.1  |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   35.4 |  9.4  |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   13.8 |  1.1  |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   34.2 |  3.77 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    0   |  0    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    0   |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   20   |  3.32 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   55.2 |  4.44 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   21   |  3.81 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   47.4 | 14.5  |

### predictions_correct_rate

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |   k |   t |   rate_% |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|----:|----:|---------:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    nan |  nan | 142 | 142 |    100   |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    nan |  nan | 365 | 365 |    100   |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    nan |  nan | 137 | 138 |     99.3 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    nan |  nan | 378 | 378 |    100   |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    nan |  nan | 194 | 200 |     97   |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    nan |  nan | 551 | 554 |     99.5 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    nan |  nan | 203 | 208 |     97.6 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    nan |  nan | 520 | 520 |    100   |

### duration_seconds

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |      sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|--------:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |  220.2 |   39.15 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |  341   |   59.46 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |  769.2 |   32.24 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 | 1596.6 |  326.66 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 | 2219.6 |  183.33 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 | 5685.8 |  595.48 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |  654   | 1295.84 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |  198.4 |   39.71 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  390   |   24.63 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 | 1086.4 |  184.94 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 | 2095.2 |  609.77 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 | 3896.2 | 1636.21 |

### total_tokens

| kata                                | cell_workflow                        | cell_model         |   n |   null |             mean |               sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-----------------:|-----------------:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 | 228274           |  72841.9         |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 | 256858           |  78403.6         |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |      1.73019e+06 | 310050           |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |      6.65078e+06 |      1.9246e+06  |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |      3.68093e+06 | 329532           |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |      1.37922e+07 |      4.01383e+06 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |      1.22285e+06 | 124458           |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |      2.81693e+06 | 615773           |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |      6.0471e+06  | 596600           |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |      2.29763e+07 |      3.87527e+06 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |      2.00525e+07 |      2.29768e+06 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |      6.59365e+07 |      2.20594e+07 |

### cost_usd

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   0.37 |  0.09 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   0.52 |  0.1  |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   1.63 |  0.33 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   4.6  |  1.16 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   4.75 |  0.38 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |  14.61 |  3.13 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   1.17 |  0.13 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   2.7  |  0.5  |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   5.62 |  0.42 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  17.55 |  2.69 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |  20.95 |  2.28 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |  61.04 | 19.81 |

### mutation_score

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |     sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   0.91 |   0.03 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   0.74 |   0.09 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   0.9  |   0.05 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   2 |      3 |   0.91 |   0    |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   0.89 |   0.09 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   0 |      5 | nan    | nan    |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   0.93 |   0.02 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   0.92 |   0.01 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   0.92 |   0.05 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   0.94 |   0.03 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   0.9  |   0.07 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   0.92 |   0.02 |

### mutants_total

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |     sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   33.6 |  11.46 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |  356.4 |  39.47 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   45.6 |   7.73 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   2 |      3 |  198   |  42.43 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   33.8 |  13.55 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   0 |      5 |  nan   | nan    |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   30.6 |   6.35 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |  259.2 |  13.52 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   47.8 |   7.79 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  230.4 |  27.91 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   39.6 |   3.78 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |  203.2 |  32.93 |

### mutants_survived

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |     sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    3.2 |   2.68 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   95   |  40.5  |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    4.8 |   2.95 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   2 |      3 |   17   |   2.83 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    3.2 |   1.64 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   0 |      5 |  nan   | nan    |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    2   |   0    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   21.8 |   2.49 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    3.6 |   2.51 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   14   |   4.24 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    3.6 |   2.3  |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   15   |   3.67 |

### mutants_no_coverage

| kata                                | cell_workflow                        | cell_model         |   n |   null |   mean |     sd |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    0   |   0    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   20.8 |  46.51 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    0   |   0    |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   2 |      3 |    0   |   0    |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    1.2 |   1.64 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   0 |      5 |  nan   | nan    |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    0   |   0    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    0   |   0    |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    1.2 |   1.64 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    0   |   0    |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    1.6 |   2.3  |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    1   |   2.24 |
