# RQ-exact-coding-java — Aggregation

_On Java 17 with JUnit 5 and Maven, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness and code quality for GPT-5.6 SOL and Opus 5?_

Generated: 2026-10-19T08:17:04Z

Cells declared: 12 · matched runs: 61 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-java-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-java-example-mapping | exact-ptdd-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking | 6 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   1    | 0    |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   1    | 0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   1    | 0    |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   1    | 0    |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   1    | 0    |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   1    | 0    |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   0.97 | 0.04 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   0.97 | 0.04 |

### tests_passing

| kata                              | cell_workflow                        | cell_model         |   n |   k |   null |   rate_% |
|:----------------------------------|:-------------------------------------|:-------------------|----:|----:|-------:|---------:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   5 |      0 |      100 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   5 |      0 |      100 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   5 |      0 |      100 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   5 |      0 |      100 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   5 |      0 |      100 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   5 |      0 |      100 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   5 |      0 |      100 |

### tests_total

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   11.2 |  1.79 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    6.4 |  2.3  |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   13.8 |  1.79 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   38.6 |  2.97 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   13.8 |  1.64 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   32.2 |  7.19 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   14   |  1.87 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   46.8 | 20.07 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   21.4 |  0.89 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   53.4 |  1.67 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   21.6 |  2.7  |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   51.8 |  1.79 |

### test_lines

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |     sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |  119.2 |  15.16 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |  130.6 |  31.74 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |  143.8 |  10.92 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |  195.6 |  67.92 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |  132.2 |   7.01 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |  158   |  69.62 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |  134.8 |  14.02 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |  425.8 | 135.8  |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  227.4 |  26.58 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  536.4 |  94.38 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |  256.2 |  36    |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |  650.4 | 139.72 |

### lines_of_code

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |     sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |  109.2 |  13.07 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |  292.2 |  40.11 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   94.4 |   6.58 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |  206.2 |  25.29 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |  113.4 |  14.72 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |  314.6 |  43.45 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |  102.8 |  13.03 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |  397.6 |  55.39 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  116.4 |  11.93 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  376.4 |  75.3  |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |  143.6 |  11.87 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |  791   | 194.66 |

### code_mass

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |     sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |  324.4 |  48.94 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 | 1028.6 |  66.94 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |  265.8 |  23.58 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |  720.4 |  65.55 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |  277.4 |  17.7  |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |  828   |  60.57 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |  266.4 |  17.84 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 | 1101.4 |  62.54 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  290.6 |  24.11 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  966.2 | 106.48 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |  328.8 |  28.6  |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 | 1276   | 137.58 |

### smell_total

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |      0 |    0 |

### cognitive_max

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    9.8 | 4.38 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    9.8 | 2.17 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    5.8 | 3.96 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    5.8 | 1.1  |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    6   | 1.73 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    7.8 | 3.11 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    5   | 2.74 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    6.6 | 0.89 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    4.6 | 3.29 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    4.4 | 1.67 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    7   | 0    |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    3.2 | 0.45 |

### cognitive_avg

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   4.73 | 1.2  |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   3.24 | 0.38 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   2.24 | 0.95 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   2.22 | 0.59 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   2.22 | 0.35 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   1.97 | 0.32 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   2.1  | 0.58 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   2.18 | 0.42 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   1.75 | 0.75 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   1.49 | 0.15 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   2.08 | 0.09 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   1.37 | 0.14 |

### mccabe_max

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    8.2 | 3.27 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   10.4 | 2.41 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    4.2 | 1.79 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    7.4 | 1.34 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    4.4 | 0.89 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    7.8 | 0.45 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    3.8 | 1.64 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    6.2 | 1.3  |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    3.8 | 1.64 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    4.4 | 0.89 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    4.8 | 0.45 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    4.4 | 0.89 |

### mccabe_avg

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   4.38 | 1.26 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   3.52 | 0.25 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   1.64 | 0.49 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   2.71 | 0.32 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   1.67 | 0.16 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   1.87 | 0.16 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   1.61 | 0.48 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   2.13 | 0.28 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   1.57 | 0.4  |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   1.75 | 0.25 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   1.86 | 0.3  |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   1.45 | 0.14 |

### unit_count

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    6.4 |  1.34 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   22   |  4.85 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    9.6 |  1.82 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   19.6 |  1.52 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   12   |  1.22 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   39   |  8.28 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    9.8 |  1.48 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   34   |  8.94 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   13.4 |  2.3  |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   39.4 | 10.78 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   13.4 |  1.52 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   57.4 | 12.05 |

### unit_size_max

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   14   | 3.08 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   32.6 | 2.97 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    7.4 | 1.14 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   24.4 | 3.65 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    7   | 0.71 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   27.8 | 4.82 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    7   | 0.71 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   19.4 | 3.51 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    7   | 0.71 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   12.6 | 3.85 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    7.6 | 0.55 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    9.4 | 1.14 |

### unit_size_avg

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   7.26 | 1.19 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   7.75 | 0.74 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   3.84 | 0.77 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   5.64 | 0.64 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   3.62 | 0.3  |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   3.71 | 0.42 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   3.65 | 0.77 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   4.89 | 0.78 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   3.6  | 0.77 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   4.05 | 0.69 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   4.08 | 0.83 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   3.29 | 0.44 |

### unit_size_median

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    6.4 | 1.67 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    4.3 | 0.45 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    3.3 | 1.57 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    4.2 | 0.57 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    3   | 1.06 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    2.2 | 0.45 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    3.3 | 1.3  |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    3.4 | 1.34 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    3.1 | 1.52 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    3.2 | 1.1  |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    4.1 | 1.34 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    2.2 | 0.45 |

### predictions_correct_rate

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |   k |   t |   rate_% |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|----:|----:|---------:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    nan |  nan | 158 | 162 |     97.5 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    nan |  nan | 390 | 391 |     99.7 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    nan |  nan | 140 | 141 |     99.3 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    nan |  nan | 321 | 322 |     99.7 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    nan |  nan | 215 | 221 |     97.3 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    nan |  nan | 543 | 543 |    100   |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    nan |  nan | 215 | 218 |     98.6 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    nan |  nan | 502 | 507 |     99   |

### duration_seconds

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |      sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|--------:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |  194.8 |   21.53 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |  295.6 |   11.08 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |  916   |  138.4  |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 | 1995.6 |  944.55 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 | 2256   |  359.95 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 | 6072   | 3050.94 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |  251.2 |   56.8  |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |  346.6 |  152.02 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  756   |  103.83 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 | 1313   |  153.31 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 | 2651.6 |  496.62 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 | 5444.6 | 1103.82 |

### total_tokens

| kata                              | cell_workflow                        | cell_model         |   n |   null |             mean |               sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-----------------:|-----------------:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 | 222893           |  40811.7         |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 | 290305           |  68985.3         |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |      2.44864e+06 | 933131           |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |      7.73577e+06 |      4.22543e+06 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |      4.44644e+06 |      1.37318e+06 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |      1.56753e+07 |      3.65065e+06 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |      1.28782e+06 | 245097           |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |      2.63649e+06 | 522806           |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |      6.19072e+06 | 931045           |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |      1.90708e+07 |      2.25436e+06 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |      2.99442e+07 |      1.63772e+07 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |      9.69005e+07 |      4.72397e+07 |

### cost_usd

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   0.42 |  0.04 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   0.58 |  0.11 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   2.21 |  0.58 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   5.25 |  2.59 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   5.92 |  1.19 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |  17.78 |  3.61 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   1.41 |  0.27 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   2.88 |  0.54 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   5.88 |  0.71 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  15.33 |  1.71 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |  27.49 |  7.82 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |  78.12 | 26.58 |

### mutation_score

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   0.86 | 0.05 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   0.81 | 0.07 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   0.9  | 0.08 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   0.91 | 0.03 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   0.94 | 0.04 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   0.94 | 0.01 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   0.91 | 0.01 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   0.88 | 0.03 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   0.92 | 0.01 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   0.93 | 0.02 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   0.93 | 0.01 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   0.96 | 0.03 |

### mutants_total

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   33   |  9.82 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   91.4 | 20.86 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   35.4 |  8.14 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |   65.6 | 12.48 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   29   |  2.83 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   80.6 |  8.32 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   23.4 |  4.16 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   68.4 | 12.56 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   31.2 |  2.39 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   78.8 | 11.71 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   32.6 |  1.14 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |   89.4 | 11.17 |

### mutants_survived

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    5   | 2.83 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |   17.8 | 8.11 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    3   | 2.35 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    6   | 2.12 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    1.8 | 1.1  |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    4.6 | 0.55 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    2   | 0    |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    8   | 2    |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    2.4 | 0.55 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    5.4 | 2.3  |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    2.2 | 0.45 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    3.6 | 2.3  |

### mutants_no_coverage

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    0.2 | 0.45 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |    4.8 | 1.92 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    1.6 | 3.05 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |    2.4 | 1.14 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    0.2 | 0.45 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |    2.4 | 0.55 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    4   | 1.41 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    0.2 | 0.45 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    3   | 1.41 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    0.2 | 0.45 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |    1.4 | 0.89 |
