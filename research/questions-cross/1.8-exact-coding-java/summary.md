# RQ-exact-coding-java — Aggregation

_On Java 17 with JUnit 5 and Maven, does EXACT Coding Predictive TDD improve correctness and code quality over unstructured inline TDD on Game of Life and Claim Office, for GPT-5.6 SOL and Opus 5?_

Generated: 2026-09-20T08:44:26Z

Cells declared: 8 · matched runs: 40 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-java-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-java-example-mapping | exact-ptdd-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |   1    |  1    |     1 |  0    |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |   1    |  1    |     1 |  0    |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |   0.97 |  0.93 |     1 |  0.04 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   1    |  1    |     1 |  0    |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |   1    |  1    |     1 |  0    |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |   1    |  1    |     1 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |   1    |  1    |     1 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                              | cell_workflow             | cell_model         |   n |   match |   rate_% |
|:----------------------------------|:--------------------------|:-------------------|----:|--------:|---------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                              | cell_workflow             | cell_model         |   n |   match |   rate_% |
|:----------------------------------|:--------------------------|:-------------------|----:|--------:|---------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |       5 |      100 |

### tests_total

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |   46.8 |    28 |    76 | 20.07 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |    6.4 |     4 |    10 |  2.3  |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |   53.4 |    52 |    56 |  1.67 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   38.6 |    35 |    43 |  2.97 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |   14   |    11 |    16 |  1.87 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |   11.2 |    10 |    14 |  1.79 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |   21.4 |    20 |    22 |  0.89 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   13.8 |    12 |    16 |  1.79 |

### test_lines

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |    std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |  425.8 |   329 |   640 | 135.8  |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |  130.6 |   101 |   181 |  31.74 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |  536.4 |   428 |   687 |  94.38 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |  195.6 |   109 |   275 |  67.92 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |  134.8 |   122 |   158 |  14.02 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |  119.2 |   102 |   140 |  15.16 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |  227.4 |   191 |   266 |  26.58 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |  143.8 |   128 |   156 |  10.92 |

### lines_of_code

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |  397.6 |   335 |   482 | 55.39 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |  292.2 |   235 |   330 | 40.11 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |  376.4 |   263 |   457 | 75.3  |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |  206.2 |   181 |   234 | 25.29 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |  102.8 |    88 |   122 | 13.03 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |  109.2 |    94 |   129 | 13.07 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |  116.4 |   100 |   130 | 11.93 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   94.4 |    87 |   105 |  6.58 |

### code_mass

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |    std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 | 1101.4 |  1035 |  1197 |  62.54 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 | 1028.6 |   910 |  1072 |  66.94 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |  966.2 |   820 |  1084 | 106.48 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |  720.4 |   641 |   791 |  65.55 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |  266.4 |   246 |   284 |  17.84 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |  324.4 |   269 |   383 |  48.94 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |  290.6 |   271 |   330 |  24.11 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |  265.8 |   244 |   304 |  23.58 |

### smell_total

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |

### smell_complexity

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |

### smell_duplication

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |

### smell_code_quality

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |

### cognitive_max

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |    6.6 |     5 |     7 |  0.89 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |    9.8 |     8 |    13 |  2.17 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |    4.4 |     3 |     7 |  1.67 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |    5.8 |     4 |     7 |  1.1  |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |    5   |     2 |     7 |  2.74 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |    9.8 |     7 |    17 |  4.38 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |    4.6 |     1 |     7 |  3.29 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |    5.8 |     1 |    11 |  3.96 |

### cognitive_avg

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |   2.18 |  1.45 |  2.53 |  0.42 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |   3.24 |  2.81 |  3.67 |  0.38 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |   1.49 |  1.33 |  1.73 |  0.15 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   2.22 |  1.62 |  3.21 |  0.59 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |   2.1  |  1.5  |  2.8  |  0.58 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |   4.73 |  3.17 |  5.8  |  1.2  |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |   1.75 |  1    |  2.75 |  0.75 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   2.24 |  1    |  3.4  |  0.95 |

### mccabe_max

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |    6.2 |     5 |     8 |  1.3  |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |   10.4 |     7 |    13 |  2.41 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |    4.4 |     4 |     6 |  0.89 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |    7.4 |     5 |     8 |  1.34 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |    3.8 |     2 |     5 |  1.64 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |    8.2 |     5 |    13 |  3.27 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |    3.8 |     2 |     5 |  1.64 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |    4.2 |     2 |     6 |  1.79 |

### mccabe_avg

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |   2.13 |  1.72 |  2.4  |  0.28 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |   3.52 |  3.27 |  3.83 |  0.25 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |   1.75 |  1.53 |  2.17 |  0.25 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   2.71 |  2.16 |  2.95 |  0.32 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |   1.61 |  1.08 |  2.1  |  0.48 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |   4.38 |  2.88 |  5.57 |  1.26 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |   1.57 |  1.19 |  2.15 |  0.4  |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   1.64 |  1.11 |  2.38 |  0.49 |

### java_methods

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |   34   |    25 |    47 |  8.94 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |   22   |    16 |    27 |  4.85 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |   39.4 |    23 |    49 | 10.78 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   19.6 |    18 |    22 |  1.52 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |    9.8 |     8 |    12 |  1.48 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |    6.4 |     5 |     8 |  1.34 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |   13.4 |    10 |    16 |  2.3  |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |    9.6 |     8 |    12 |  1.82 |

### java_method_ncss_max

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |   19.4 |    14 |    23 |  3.51 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |   32.6 |    30 |    37 |  2.97 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |   12.6 |     9 |    19 |  3.85 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   24.4 |    20 |    28 |  3.65 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |    7   |     6 |     8 |  0.71 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |   14   |    10 |    17 |  3.08 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |    7   |     6 |     8 |  0.71 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |    7.4 |     6 |     9 |  1.14 |

### java_method_ncss_avg

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |   4.89 |  3.91 |  5.75 |  0.78 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |   7.75 |  6.89 |  8.69 |  0.74 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |   4.05 |  3.47 |  5.22 |  0.69 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   5.64 |  5.11 |  6.7  |  0.64 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |   3.65 |  2.67 |  4.4  |  0.77 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |   7.26 |  5.5  |  8.8  |  1.19 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |   3.6  |  2.87 |  4.77 |  0.77 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   3.84 |  3.22 |  5.12 |  0.77 |

### java_method_ncss_median

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |    3.4 |   2   |     5 |  1.34 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |    4.3 |   4   |     5 |  0.45 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |    3.2 |   2   |     4 |  1.1  |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |    4.2 |   3.5 |     5 |  0.57 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |    3.3 |   2   |     5 |  1.3  |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |    6.4 |   5   |     9 |  1.67 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |    3.1 |   2   |     5 |  1.52 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |    3.3 |   2   |     6 |  1.57 |

### test_blocks

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |    2.6 |     2 |     4 |  0.89 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   33.4 |     3 |    44 | 17.27 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |    5   |     4 |     6 |  0.71 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   16   |    13 |    19 |  2.45 |

### test_cases_total

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |    7.2 |     4 |    12 |  3.11 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   78.6 |    70 |    88 |  6.54 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |   14.4 |    11 |    19 |  3.13 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   28.4 |    25 |    32 |  3.29 |

### test_cases_first_block

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |    3   |     1 |     5 |  1.87 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   37.4 |    35 |    40 |  2.07 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |    1   |     1 |     1 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   13.8 |    12 |    16 |  1.79 |

### red_verified

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |    2.4 |     1 |     4 |  1.14 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   33.4 |     3 |    44 | 17.27 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |    4.8 |     4 |     5 |  0.45 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   16   |    13 |    19 |  2.45 |

### red_unverified

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |

### refactorings_applied

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |   52.8 |    52 |    55 |  1.3  |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   39   |    35 |    43 |  2.92 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |   21.4 |    20 |    22 |  0.89 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   13.8 |    12 |    16 |  1.79 |

### predictions_correct_rate (pooled %)

| kata                              | cell_workflow    | cell_model         |   n |   correct |   total |   rate_% |
|:----------------------------------|:-----------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-java-example-mapping | exact-ptdd-v1-cc | opus-5-no-thinking |   5 |       543 |     543 |    100   |
| claim-office-java-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex  |   5 |       390 |     391 |     99.7 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc | opus-5-no-thinking |   5 |       215 |     221 |     97.3 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex  |   5 |       158 |     162 |     97.5 |

### duration_seconds

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |    std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |  346.6 |   246 |   615 | 152.02 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |  295.6 |   278 |   306 |  11.08 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 | 1313   |  1211 |  1566 | 153.31 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 | 1995.6 |   354 |  2761 | 944.55 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |  251.2 |   204 |   345 |  56.8  |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |  194.8 |   180 |   231 |  21.53 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |  756   |   607 |   861 | 103.83 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |  916   |   776 |  1142 | 138.4  |

### total_tokens

| kata                              | cell_workflow             | cell_model         |   n |             mean |      min |      max |              std |
|:----------------------------------|:--------------------------|:-------------------|----:|-----------------:|---------:|---------:|-----------------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |      2.63649e+06 |  1937687 |  3318099 | 522806           |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 | 290305           |   181527 |   361987 |  68985.3         |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |      1.90708e+07 | 15567936 | 21681052 |      2.25436e+06 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |      7.73577e+06 |   373356 | 10771798 |      4.22543e+06 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |      1.28782e+06 |  1080503 |  1643160 | 245097           |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 | 222893           |   166300 |   277743 |  40811.7         |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |      6.19072e+06 |  4899509 |  7127568 | 931045           |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |      2.44864e+06 |  1845360 |  4081982 | 933131           |

### cost_usd

| kata                              | cell_workflow             | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:--------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |   2.88 |  2.32 |  3.7  |  0.54 |
| claim-office-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |   0.58 |  0.44 |  0.7  |  0.11 |
| claim-office-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |  15.33 | 12.72 | 17.51 |  1.71 |
| claim-office-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   5.25 |  0.74 |  6.93 |  2.59 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking |   5 |   1.41 |  1.13 |  1.81 |  0.27 |
| game-of-life-java-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex  |   5 |   0.42 |  0.38 |  0.49 |  0.04 |
| game-of-life-java-example-mapping | exact-ptdd-v1-cc          | opus-5-no-thinking |   5 |   5.88 |  4.88 |  6.63 |  0.71 |
| game-of-life-java-example-mapping | exact-ptdd-v1-pi          | gpt-5-6-sol-codex  |   5 |   2.21 |  1.86 |  3.23 |  0.58 |
