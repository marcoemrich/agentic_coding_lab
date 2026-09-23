# RQ-exact-coding-java — Aggregation

_On Java 17 with JUnit 5 and Maven, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness and code quality for GPT-5.6 SOL and Opus 5?_

Generated: 2026-09-23T05:03:52Z

Cells declared: 12 · matched runs: 60 · min_replicates: 5

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
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking | 5 | 4 | ⚠️ only 4/5 without timeout |

## Outcome pivots (per cell)

### verification_pct

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   1    |  1    |     1 |  0    |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   1    |  1    |     1 |  0    |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   0.97 |  0.93 |     1 |  0.04 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   1    |  1    |     1 |  0    |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   0.97 |  0.93 |     1 |  0.04 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   1    |  1    |     1 |  0    |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   1    |  1    |     1 |  0    |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   1    |  1    |     1 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   1    |  1    |     1 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   1    |  1    |     1 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   1    |  1    |     1 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                              | cell_workflow                        | cell_model         |   n |   match |   rate_% |
|:----------------------------------|:-------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                              | cell_workflow                        | cell_model         |   n |   match |   rate_% |
|:----------------------------------|:-------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |       4 |       80 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |       5 |      100 |

### tests_total

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   46.8 |    28 |    76 | 20.07 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    6.4 |     4 |    10 |  2.3  |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   53.4 |    52 |    56 |  1.67 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   38.6 |    35 |    43 |  2.97 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   51.8 |    49 |    53 |  1.79 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   32.2 |    23 |    40 |  7.19 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   14   |    11 |    16 |  1.87 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   11.2 |    10 |    14 |  1.79 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   21.4 |    20 |    22 |  0.89 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   13.8 |    12 |    16 |  1.79 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   21.6 |    18 |    25 |  2.7  |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   13.8 |    12 |    16 |  1.64 |

### test_lines

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |    std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  425.8 |   329 |   640 | 135.8  |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |  130.6 |   101 |   181 |  31.74 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  536.4 |   428 |   687 |  94.38 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  195.6 |   109 |   275 |  67.92 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  614.8 |   500 |   860 | 152.97 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  158   |   101 |   266 |  69.62 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  134.8 |   122 |   158 |  14.02 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |  119.2 |   102 |   140 |  15.16 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  227.4 |   191 |   266 |  26.58 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  143.8 |   128 |   156 |  10.92 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  256.2 |   211 |   300 |  36    |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  132.2 |   123 |   140 |   7.01 |

### lines_of_code

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |    std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  397.6 |   335 |   482 |  55.39 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |  292.2 |   235 |   330 |  40.11 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  376.4 |   263 |   457 |  75.3  |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  206.2 |   181 |   234 |  25.29 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  805.8 |   493 |   985 | 205.71 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  314.6 |   254 |   373 |  43.45 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  102.8 |    88 |   122 |  13.03 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |  109.2 |    94 |   129 |  13.07 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  116.4 |   100 |   130 |  11.93 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   94.4 |    87 |   105 |   6.58 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  143.6 |   127 |   153 |  11.87 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  113.4 |    90 |   129 |  14.72 |

### code_mass

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |    std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 | 1101.4 |  1035 |  1197 |  62.54 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 | 1028.6 |   910 |  1072 |  66.94 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  966.2 |   820 |  1084 | 106.48 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  720.4 |   641 |   791 |  65.55 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 | 1316.4 |  1135 |  1487 | 143.97 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  828   |   757 |   924 |  60.57 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  266.4 |   246 |   284 |  17.84 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |  324.4 |   269 |   383 |  48.94 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  290.6 |   271 |   330 |  24.11 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  265.8 |   244 |   304 |  23.58 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  328.8 |   286 |   356 |  28.6  |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  277.4 |   252 |   301 |  17.7  |

### smell_total

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |

### smell_complexity

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |

### smell_duplication

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |

### smell_code_quality

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |

### cognitive_max

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    6.6 |     5 |     7 |  0.89 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    9.8 |     8 |    13 |  2.17 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    4.4 |     3 |     7 |  1.67 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |    5.8 |     4 |     7 |  1.1  |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    3.4 |     3 |     4 |  0.55 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |    7.8 |     5 |    13 |  3.11 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    5   |     2 |     7 |  2.74 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    9.8 |     7 |    17 |  4.38 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    4.6 |     1 |     7 |  3.29 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |    5.8 |     1 |    11 |  3.96 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    7   |     7 |     7 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |    6   |     3 |     7 |  1.73 |

### cognitive_avg

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   2.18 |  1.45 |  2.53 |  0.42 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   3.24 |  2.81 |  3.67 |  0.38 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   1.49 |  1.33 |  1.73 |  0.15 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   2.22 |  1.62 |  3.21 |  0.59 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   1.38 |  1.21 |  1.59 |  0.14 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   1.97 |  1.65 |  2.47 |  0.32 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   2.1  |  1.5  |  2.8  |  0.58 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   4.73 |  3.17 |  5.8  |  1.2  |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   1.75 |  1    |  2.75 |  0.75 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   2.24 |  1    |  3.4  |  0.95 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   2.08 |  2    |  2.2  |  0.09 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   2.22 |  1.8  |  2.71 |  0.35 |

### mccabe_max

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    6.2 |     5 |     8 |  1.3  |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   10.4 |     7 |    13 |  2.41 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    4.4 |     4 |     6 |  0.89 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |    7.4 |     5 |     8 |  1.34 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    4.2 |     3 |     6 |  1.1  |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |    7.8 |     7 |     8 |  0.45 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    3.8 |     2 |     5 |  1.64 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    8.2 |     5 |    13 |  3.27 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    3.8 |     2 |     5 |  1.64 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |    4.2 |     2 |     6 |  1.79 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    4.8 |     4 |     5 |  0.45 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |    4.4 |     3 |     5 |  0.89 |

### mccabe_avg

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   2.13 |  1.72 |  2.4  |  0.28 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   3.52 |  3.27 |  3.83 |  0.25 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   1.75 |  1.53 |  2.17 |  0.25 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   2.71 |  2.16 |  2.95 |  0.32 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   1.37 |  1.12 |  1.59 |  0.19 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   1.87 |  1.63 |  2.03 |  0.16 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   1.61 |  1.08 |  2.1  |  0.48 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   4.38 |  2.88 |  5.57 |  1.26 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   1.57 |  1.19 |  2.15 |  0.4  |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   1.64 |  1.11 |  2.38 |  0.49 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   1.86 |  1.38 |  2.15 |  0.3  |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   1.67 |  1.5  |  1.92 |  0.16 |

### unit_count

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   34   |    25 |    47 |  8.94 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   22   |    16 |    27 |  4.85 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   39.4 |    23 |    49 | 10.78 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   19.6 |    18 |    22 |  1.52 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   62   |    41 |    76 | 14.16 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   39   |    30 |    52 |  8.28 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    9.8 |     8 |    12 |  1.48 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    6.4 |     5 |     8 |  1.34 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   13.4 |    10 |    16 |  2.3  |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |    9.6 |     8 |    12 |  1.82 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   13.4 |    12 |    16 |  1.52 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   12   |    10 |    13 |  1.22 |

### unit_size_max

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   19.4 |    14 |    23 |  3.51 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   32.6 |    30 |    37 |  2.97 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   12.6 |     9 |    19 |  3.85 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   24.4 |    20 |    28 |  3.65 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    9.8 |     8 |    13 |  1.92 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   27.8 |    24 |    36 |  4.82 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    7   |     6 |     8 |  0.71 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   14   |    10 |    17 |  3.08 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    7   |     6 |     8 |  0.71 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |    7.4 |     6 |     9 |  1.14 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    7.6 |     7 |     8 |  0.55 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |    7   |     6 |     8 |  0.71 |

### unit_size_avg

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   4.89 |  3.91 |  5.75 |  0.78 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   7.75 |  6.89 |  8.69 |  0.74 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   4.05 |  3.47 |  5.22 |  0.69 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   5.64 |  5.11 |  6.7  |  0.64 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   3.1  |  2.46 |  3.83 |  0.57 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   3.71 |  3.12 |  4.17 |  0.42 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   3.65 |  2.67 |  4.4  |  0.77 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   7.26 |  5.5  |  8.8  |  1.19 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   3.6  |  2.87 |  4.77 |  0.77 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   3.84 |  3.22 |  5.12 |  0.77 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   4.08 |  2.81 |  4.77 |  0.83 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   3.62 |  3.23 |  4.08 |  0.3  |

### unit_size_median

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    3.4 |   2   |   5   |  1.34 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    4.3 |   4   |   5   |  0.45 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    3.2 |   2   |   4   |  1.1  |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |    4.2 |   3.5 |   5   |  0.57 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    2.2 |   2   |   3   |  0.45 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |    2.2 |   2   |   3   |  0.45 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    3.3 |   2   |   5   |  1.3  |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    6.4 |   5   |   9   |  1.67 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    3.1 |   2   |   5   |  1.52 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |    3.3 |   2   |   6   |  1.57 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    4.1 |   2   |   5   |  1.34 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |    3   |   2   |   4.5 |  1.06 |

### test_blocks

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    2.6 |     2 |     4 |  0.89 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   33.4 |     3 |    44 | 17.27 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   27.4 |     6 |    41 | 13.18 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    5   |     4 |     6 |  0.71 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   16   |    13 |    19 |  2.45 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   15.2 |    13 |    18 |  2.17 |

### test_cases_total

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    7.2 |     4 |    12 |  3.11 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   78.6 |    70 |    88 |  6.54 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   60   |    43 |    81 | 14.71 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   14.4 |    11 |    19 |  3.13 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   28.4 |    25 |    32 |  3.29 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   27.8 |    25 |    32 |  3.03 |

### test_cases_first_block

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    3   |     1 |     5 |  1.87 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   37.4 |    35 |    40 |  2.07 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   32.8 |    23 |    40 |  6.76 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    1   |     1 |     1 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   13.8 |    12 |    16 |  1.79 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   13.8 |    12 |    16 |  1.64 |

### red_verified

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    2.4 |     1 |     4 |  1.14 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   33.4 |     3 |    44 | 17.27 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   27.4 |     6 |    41 | 13.18 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    4.8 |     4 |     5 |  0.45 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   16   |    13 |    19 |  2.45 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   15.2 |    13 |    18 |  2.17 |

### red_unverified

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |

### refactorings_applied

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   52.8 |    52 |    55 |  1.3  |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   39   |    35 |    43 |  2.92 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   30.6 |     1 |    52 | 20.54 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   26.8 |    11 |    40 | 10.92 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   21.4 |    20 |    22 |  0.89 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   13.8 |    12 |    16 |  1.79 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   16.8 |     1 |    23 |  9.04 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   13.8 |    12 |    16 |  1.64 |

### predictions_correct_rate (pooled %)

| kata                              | cell_workflow                        | cell_model         |   n |   correct |   total |   rate_% |
|:----------------------------------|:-------------------------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |       543 |     543 |    100   |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |       390 |     391 |     99.7 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |       499 |     503 |     99.2 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |       321 |     322 |     99.7 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |       215 |     221 |     97.3 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |       158 |     162 |     97.5 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |       215 |     218 |     98.6 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |       140 |     141 |     99.3 |

### duration_seconds

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |     std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|--------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  346.6 |   246 |   615 |  152.02 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |  295.6 |   278 |   306 |   11.08 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 | 1313   |  1211 |  1566 |  153.31 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 | 1995.6 |   354 |  2761 |  944.55 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 | 5509.2 |  4090 |  7200 | 1212.69 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 | 6072   |  2769 | 10980 | 3050.94 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  251.2 |   204 |   345 |   56.8  |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |  194.8 |   180 |   231 |   21.53 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  756   |   607 |   861 |  103.83 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  916   |   776 |  1142 |  138.4  |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 | 2651.6 |  2049 |  3415 |  496.62 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 | 2256   |  1864 |  2647 |  359.95 |

### total_tokens

| kata                              | cell_workflow                        | cell_model         |   n |             mean |      min |      max |              std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-----------------:|---------:|---------:|-----------------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      2.63649e+06 |  1937687 |  3318099 | 522806           |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 | 290305           |   181527 |   361987 |  68985.3         |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      1.90708e+07 | 15567936 | 21681052 |      2.25436e+06 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      7.73577e+06 |   373356 | 10771798 |      4.22543e+06 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      5.10224e+07 | 32042461 | 72196918 |      1.83836e+07 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      1.56753e+07 | 12743202 | 21062043 |      3.65065e+06 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      1.28782e+06 |  1080503 |  1643160 | 245097           |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 | 222893           |   166300 |   277743 |  40811.7         |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      6.19072e+06 |  4899509 |  7127568 | 931045           |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      2.44864e+06 |  1845360 |  4081982 | 933131           |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      1.38154e+07 |  9292385 | 20767356 |      4.2814e+06  |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      4.44644e+06 |  3390889 |  6176513 |      1.37318e+06 |

### cost_usd

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   2.88 |  2.32 |  3.7  |  0.54 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   0.58 |  0.44 |  0.7  |  0.11 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  15.33 | 12.72 | 17.51 |  1.71 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   5.25 |  0.74 |  6.93 |  2.59 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  33.69 | 22.5  | 45.4  | 10.28 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  17.78 | 13.65 | 22.87 |  3.61 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   1.41 |  1.13 |  1.81 |  0.27 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   0.42 |  0.38 |  0.49 |  0.04 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   5.88 |  4.88 |  6.63 |  0.71 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   2.21 |  1.86 |  3.23 |  0.58 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  11.22 |  7.95 | 15.45 |  2.72 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   5.92 |  4.87 |  7.44 |  1.19 |

### mutation_score

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   0.88 |  0.85 |  0.92 |  0.03 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   0.81 |  0.72 |  0.9  |  0.07 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   0.93 |  0.9  |  0.96 |  0.02 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   0.91 |  0.87 |  0.95 |  0.03 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   0.96 |  0.91 |  0.99 |  0.03 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   0.94 |  0.94 |  0.95 |  0.01 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   0.91 |  0.89 |  0.93 |  0.01 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   0.86 |  0.8  |  0.93 |  0.05 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   0.92 |  0.91 |  0.94 |  0.01 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   0.9  |  0.77 |  0.98 |  0.08 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   0.93 |  0.91 |  0.94 |  0.01 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   0.94 |  0.9  |  1    |  0.04 |

### mutants_total

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   68.4 |    61 |    90 | 12.56 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   91.4 |    69 |   116 | 20.86 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   78.8 |    63 |    91 | 11.71 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   65.6 |    53 |    85 | 12.48 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   94.8 |    82 |   108 | 12.54 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   80.6 |    74 |    95 |  8.32 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   23.4 |    19 |    30 |  4.16 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   33   |    19 |    43 |  9.82 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   31.2 |    28 |    34 |  2.39 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   35.4 |    25 |    46 |  8.14 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   32.6 |    31 |    34 |  1.14 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   29   |    24 |    31 |  2.83 |

### mutants_survived

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    8   |     5 |    10 |  2    |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   17.8 |     8 |    25 |  8.11 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    5.4 |     3 |     8 |  2.3  |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |    6   |     4 |     9 |  2.12 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    3.4 |     1 |     7 |  2.3  |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |    4.6 |     4 |     5 |  0.55 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    2   |     2 |     2 |  0    |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    5   |     2 |     8 |  2.83 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    2.4 |     2 |     3 |  0.55 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |    3   |     1 |     7 |  2.35 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    2.2 |     2 |     3 |  0.45 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |    1.8 |     0 |     3 |  1.1  |

### mutants_no_coverage

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    4   |     3 |     6 |  1.41 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    4.8 |     2 |     7 |  1.92 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    3   |     1 |     4 |  1.41 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |    2.4 |     1 |     4 |  1.14 |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    1.2 |     0 |     3 |  1.1  |
| claim-office-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |    2.4 |     2 |     3 |  0.55 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    0.2 |     0 |     1 |  0.45 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    0.2 |     0 |     1 |  0.45 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |    1.6 |     0 |     7 |  3.05 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    0.2 |     0 |     1 |  0.45 |
| game-of-life-java-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |    0.2 |     0 |     1 |  0.45 |
