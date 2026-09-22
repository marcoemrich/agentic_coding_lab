# RQ-exact-coding-python — Aggregation

_On Python with pytest, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness and code quality for GPT-5.6 SOL and Opus 5?_

Generated: 2026-09-22T13:18:31Z

Cells declared: 12 · matched runs: 65 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex | 6 | 5 | ✅ |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-python-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-python-example-mapping | exact-ptdd-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking | 8 | 8 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   1    |     1 |     1 |  0    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   1    |     1 |     1 |  0    |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   1    |     1 |     1 |  0    |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   1    |     1 |     1 |  0    |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 |   0.61 |     0 |     1 |  0.5  |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   1    |     1 |     1 |  0    |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   1    |     1 |     1 |  0    |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |   0.83 |     0 |     1 |  0.41 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   1    |     1 |     1 |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   1    |     1 |     1 |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |   0.83 |     0 |     1 |  0.41 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   1    |     1 |     1 |  0    |

### tests_passing (rate %)

| kata                                | cell_workflow                        | cell_model         |   n |   match |   rate_% |
|:------------------------------------|:-------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 |       6 |       75 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |       6 |      100 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |       5 |       83 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                                | cell_workflow                        | cell_model         |   n |   match |   rate_% |
|:------------------------------------|:-------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 |       8 |      100 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |       5 |       83 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |       6 |      100 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |       5 |      100 |

### tests_total

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  50.6  |    44 |    62 |  7.47 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |  12.4  |    10 |    19 |  3.78 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  55.8  |    49 |    62 |  5.22 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  34.8  |    20 |    43 |  8.87 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 |  40.12 |     0 |    60 | 25.06 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  34.2  |    30 |    40 |  3.77 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  15.8  |    10 |    27 |  6.53 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |  11    |     4 |    13 |  3.52 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  20.2  |    15 |    24 |  3.56 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  14.2  |    13 |    16 |  1.1  |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |  17.67 |     0 |    25 |  9.22 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  13.8  |    12 |    15 |  1.1  |

### test_lines

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |    std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 | 408.4  |   322 |   532 |  81.1  |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 | 180.8  |   136 |   222 |  34.13 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 | 736.8  |   528 |  1043 | 215.85 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 | 277.6  |   227 |   331 |  41.79 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 | 430.25 |     0 |  1203 | 385.53 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 | 266.6  |   208 |   319 |  41.91 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 | 113    |    71 |   206 |  53.42 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |  90.17 |    21 |   113 |  34.6  |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 | 170    |   153 |   193 |  16.9  |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 | 165.8  |   150 |   193 |  16.12 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 | 140.33 |     0 |   222 |  77.86 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 | 144.4  |   115 |   180 |  25.46 |

### lines_of_code

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |    std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 | 258.2  |   223 |   288 |  23.72 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 | 213    |   200 |   238 |  16.58 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 | 263.2  |   230 |   300 |  30.28 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 | 163.8  |   138 |   184 |  18.5  |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 | 321.25 |     0 |   644 | 272.33 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 | 243.6  |   219 |   308 |  36.39 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  56.6  |    48 |    66 |   8.88 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |  55.33 |    28 |    64 |  13.94 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  75.2  |    67 |    83 |   7.29 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  76.2  |    62 |    93 |  11.12 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |  72.67 |     0 |   112 |  38.6  |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  89    |    70 |   121 |  19.33 |

### code_mass

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |    std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 | 837.4  |   793 |   913 |  48.52 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 | 875.8  |   838 |   930 |  36.43 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 | 832.4  |   754 |   909 |  74.1  |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 | 590.2  |   548 |   676 |  50.37 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 | 641.88 |     0 |  1108 | 517.01 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 | 671.6  |   623 |   794 |  69.44 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 | 179    |   162 |   198 |  14.11 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 | 170.33 |    88 |   216 |  43.31 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 | 206.4  |   186 |   227 |  18.09 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 | 202.8  |   192 |   213 |   9.31 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 | 186.17 |     0 |   258 |  93.56 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 | 208.2  |   192 |   231 |  14.6  |

### smell_total

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |

### smell_complexity

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |

### smell_duplication

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |

### smell_magic_numbers

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |

### smell_code_quality

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 |      0 |     0 |     0 |     0 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |      0 |     0 |     0 |     0 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |

### cognitive_max

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    6.2 |     5 |     9 |  1.64 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   14.2 |    11 |    20 |  3.56 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    7   |     6 |     8 |  0.71 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |    5   |     4 |     6 |  1    |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 |    3   |     0 |     6 |  2.45 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |    4.8 |     4 |     7 |  1.3  |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    5   |     3 |     7 |  1.87 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |   10   |     3 |    15 |  5.02 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    5.4 |     3 |    10 |  3.05 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |    4.2 |     2 |     6 |  1.48 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |    2.5 |     0 |     4 |  1.38 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |    3   |     2 |     4 |  0.71 |

### cognitive_avg

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   1.7  |  1.27 |  2    |  0.27 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   5.48 |  3.85 |  6.89 |  1.32 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   1.47 |  0.9  |  2.06 |  0.47 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   2.01 |  1.39 |  2.6  |  0.47 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 |   0.48 |  0    |  1.03 |  0.36 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   0.81 |  0.62 |  0.97 |  0.13 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   3.45 |  2.5  |  5.67 |  1.39 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |   6.25 |  2.5  |  8.5  |  2.54 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   1.64 |  1.44 |  1.91 |  0.24 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   1.68 |  1.29 |  2    |  0.29 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |   0.95 |  0    |  1.4  |  0.49 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   1    |  0.79 |  1.5  |  0.29 |

### mccabe_max

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   3.8  |     3 |     4 |  0.45 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   8.6  |     7 |    10 |  1.14 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   3.6  |     3 |     5 |  0.89 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   3.4  |     3 |     4 |  0.55 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 |   2.12 |     0 |     4 |  1.55 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   3.4  |     3 |     4 |  0.55 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   3    |     2 |     4 |  1    |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |   3.67 |     2 |     5 |  1.51 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   3    |     2 |     5 |  1.41 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   2    |     2 |     2 |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |   1.83 |     0 |     3 |  0.98 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   2    |     2 |     2 |  0    |

### mccabe_avg

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   1.95 |  1.62 |  2.26 |  0.26 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   3.98 |  3.08 |  4.8  |  0.77 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   1.75 |  1.45 |  2.11 |  0.26 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   1.89 |  1.5  |  2.36 |  0.36 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 |   1    |  0    |  1.55 |  0.63 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   1.39 |  1.3  |  1.48 |  0.08 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   1.76 |  1.33 |  2.33 |  0.38 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |   2.54 |  1.25 |  3.5  |  1.02 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   1.33 |  1.09 |  1.55 |  0.18 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   1.17 |  1.12 |  1.29 |  0.07 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |   1.03 |  0    |  1.31 |  0.51 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   1.19 |  1.07 |  1.5  |  0.18 |

### unit_count

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  20.6  |    18 |    26 |  3.13 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |  11.2  |     9 |    13 |  1.79 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  23.6  |    18 |    32 |  6.43 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  13.4  |    10 |    18 |  3.13 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 |  26.62 |     0 |    48 | 22.03 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  31.8  |    29 |    37 |  3.35 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   4.2  |     3 |     6 |  1.3  |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |   2.5  |     1 |     4 |  1.05 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   9.8  |     8 |    11 |  1.3  |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   7.2  |     6 |     8 |  0.84 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |   9.5  |     0 |    13 |  4.76 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  10.2  |     6 |    14 |  3.03 |

### unit_size_max

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  16.6  |    12 |    21 |  3.91 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |  31.4  |    25 |    36 |  4.16 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  17.6  |    14 |    25 |  4.39 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  17.6  |    15 |    21 |  2.41 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 |  12.62 |     0 |    25 |  9.44 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  18.2  |    16 |    23 |  2.86 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   9.4  |     6 |    15 |  3.65 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |  15    |    11 |    19 |  3.22 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   8.6  |     7 |    12 |  2.07 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   9.4  |     8 |    13 |  2.07 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |   6.67 |     0 |    10 |  3.44 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   7.2  |     6 |     8 |  0.84 |

### unit_size_avg

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   7.03 |  5.15 |  8.22 |  1.34 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |  12.36 | 10.46 | 15.44 |  2.33 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   6.77 |  5    |  8.78 |  1.48 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   7.3  |  5.67 |  9.45 |  1.55 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 |   5.2  |  0    |  8.83 |  3.52 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   4.32 |  3.82 |  4.65 |  0.32 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   6.68 |  3.83 | 10.33 |  2.42 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |  11.35 |  7.75 | 14    |  2.46 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   4.06 |  3.56 |  4.5  |  0.39 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   5.39 |  5    |  6.38 |  0.56 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |   3.49 |  0    |  5.23 |  1.8  |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   4.39 |  3.83 |  5.33 |  0.64 |

### unit_size_median

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   6.2  |   4.5 |   8.5 |  1.6  |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   9.3  |   6   |  12.5 |  2.44 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   6    |   4   |   8   |  1.77 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   5.8  |   4   |  10   |  2.46 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 |   4.38 |   0   |   9   |  3.43 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   3    |   3   |   3   |  0    |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   6.1  |   4   |   8   |  1.52 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |  10.92 |   7   |  14   |  3.07 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   3.1  |   2   |   4.5 |  0.89 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   5.5  |   4.5 |   6.5 |  0.79 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |   2.92 |   0   |   5   |  1.63 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   4.4  |   3.5 |   5   |  0.65 |

### coverage_statements_pct

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  88    |    85 |    90 |  1.87 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |  71    |    53 |    81 | 12.75 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  90    |    89 |    91 |  0.71 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  29.8  |     0 |    82 | 41.15 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 |  62.38 |     0 |   100 | 39.54 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   0    |     0 |     0 |  0    |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  55.6  |    45 |    64 |  7.5  |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |  63.5  |    50 |   100 | 18.56 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  58.4  |    51 |    62 |  4.56 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  49.6  |    47 |    52 |  2.07 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |  47.83 |     0 |    60 | 23.58 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  53.2  |    50 |    57 |  2.59 |

### test_blocks

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   3    |     2 |     4 |  1    |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  36.8  |    22 |    45 |  9.2  |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |   0.29 |     0 |     1 |  0.49 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  35.8  |    31 |    42 |  4.09 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |   6.83 |     4 |    13 |  3.19 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  15.6  |    14 |    18 |  1.52 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  15    |    13 |    16 |  1.22 |

### test_cases_total

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |  13    |    10 |    19 |  3.67 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  43    |    22 |    70 | 17.42 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |  16.43 |     0 |    60 | 28.09 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  43.6  |    31 |    81 | 21.02 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |  14.5  |     6 |    22 |  5.58 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  25.8  |    18 |    29 |  4.49 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  19.8  |    15 |    28 |  5.85 |

### test_cases_first_block

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   7.2  |     2 |    16 |  5.54 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  34.4  |    19 |    42 |  9.07 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |  16.43 |     0 |    60 | 28.09 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  33.6  |    30 |    37 |  2.7  |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |   1    |     1 |     1 |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  14    |    13 |    15 |  0.71 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  13.8  |    12 |    15 |  1.1  |

### red_verified

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   2.8  |     2 |     4 |  0.84 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  36.8  |    22 |    45 |  9.2  |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |   0.29 |     0 |     1 |  0.49 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  35.8  |    31 |    42 |  4.09 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |   6.83 |     4 |    13 |  3.19 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  15.6  |    14 |    18 |  1.52 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  14.8  |    13 |    16 |  1.3  |

### red_unverified

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |    0   |     0 |     0 |  0    |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |    0   |     0 |     0 |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |    0.2 |     0 |     1 |  0.45 |

### refactorings_applied

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   0    |     0 |     0 |  0    |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  55.2  |    49 |    59 |  4.44 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  35.4  |    20 |    43 |  9.4  |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 |  30.38 |     0 |    60 | 25.95 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  34.2  |    30 |    40 |  3.77 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   0    |     0 |     0 |  0    |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |   0    |     0 |     0 |  0    |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  20    |    15 |    23 |  3.32 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  14.2  |    13 |    16 |  1.1  |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |  17.5  |     0 |    26 |  9.22 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  13.8  |    12 |    15 |  1.1  |

### predictions_correct_rate (pooled %)

| kata                                | cell_workflow                        | cell_model         |   n |   correct |   total |   rate_% |
|:------------------------------------|:-------------------------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |       551 |     554 |     99.5 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |       365 |     365 |    100   |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |       529 |     529 |    100   |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |       378 |     378 |    100   |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |       194 |     200 |     97   |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |       142 |     142 |    100   |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |       203 |     208 |     97.6 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |       137 |     138 |     99.3 |

### duration_seconds

| kata                                | cell_workflow                        | cell_model         |   n |    mean |   min |   max |     std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|--------:|------:|------:|--------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  198.4  |   149 |   235 |   39.71 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |  341    |   282 |   441 |   59.46 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 | 1086.4  |   915 |  1357 |  184.94 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 | 1596.6  |  1194 |  1997 |  326.66 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 | 2660.12 |    10 |  6635 | 2169.94 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 | 5685.8  |  4794 |  6407 |  595.48 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  654    |    66 |  2972 | 1295.84 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |  751.83 |   173 |  3410 | 1302.7  |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  390    |   355 |   412 |   24.63 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  769.2  |   741 |   820 |   32.24 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 | 1921.33 |  1052 |  2856 |  691.98 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 | 2219.6  |  2024 |  2519 |  183.33 |

### total_tokens

| kata                                | cell_workflow                        | cell_model         |   n |             mean |      min |      max |              std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-----------------:|---------:|---------:|-----------------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      2.81693e+06 |  1899073 |  3407582 | 615773           |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 | 256858           |   172355 |   383799 |  78403.6         |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      2.29763e+07 | 19119476 | 29366975 |      3.87527e+06 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      6.65078e+06 |  3956453 |  9023314 |      1.9246e+06  |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 |      2.6889e+07  |        0 | 56729800 |      2.36896e+07 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      1.37922e+07 |  6707640 | 16652571 |      4.01383e+06 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      1.22285e+06 |  1084249 |  1399787 | 124458           |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 | 202043           |    70886 |   349237 |  91505.6         |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      6.0471e+06  |  5237285 |  6685577 | 596600           |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |      1.73019e+06 |  1311718 |  2092900 | 310050           |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |      9.42562e+06 |        0 | 13371479 |      4.79859e+06 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      3.68093e+06 |  3107478 |  3951522 | 329532           |

### cost_usd

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   2.7  |  1.98 |  3.13 |  0.5  |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   0.52 |  0.44 |  0.7  |  0.1  |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  17.55 | 15.04 | 21.96 |  2.69 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   4.6  |  2.89 |  6.13 |  1.16 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   8 |  18.25 |  0    | 38.13 | 15.58 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  14.61 |  9.23 | 17.35 |  3.13 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   1.17 |  1.03 |  1.32 |  0.13 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |   0.34 |  0.15 |  0.51 |  0.12 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   5.62 |  4.88 |  5.89 |  0.42 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   1.63 |  1.07 |  1.91 |  0.33 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |   7.6  |  0    | 10.49 |  3.84 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   4.75 |  4.13 |  5.11 |  0.38 |

### mutation_score

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   0.92 |  0.9  |  0.93 |  0.01 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |   0.74 |  0.58 |  0.8  |  0.09 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   0.94 |  0.89 |  0.96 |  0.03 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   2 |   0.91 |  0.91 |  0.92 |  0    |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |   0.94 |  0.91 |  1    |  0.04 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   0.93 |  0.91 |  0.95 |  0.02 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |   0.9  |  0.85 |  0.93 |  0.04 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   0.92 |  0.88 |  1    |  0.05 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   0.9  |  0.84 |  0.95 |  0.05 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   0.9  |  0.79 |  0.95 |  0.07 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   0.89 |  0.74 |  0.95 |  0.09 |

### mutants_total

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 | 259.2  |   244 |   274 | 13.52 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 | 356.4  |   287 |   385 | 39.47 |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 | 230.4  |   189 |   257 | 27.91 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   2 | 198    |   168 |   228 | 42.43 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 | 170.83 |     9 |   236 | 84.58 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  30.6  |    22 |    38 |  6.35 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |  32.5  |    27 |    54 | 10.6  |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  47.8  |    39 |    58 |  7.79 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |  45.6  |    37 |    57 |  7.73 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  39.6  |    33 |    42 |  3.78 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  33.8  |    19 |    52 | 13.55 |

### mutants_survived

| kata                                | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:------------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  21.8  |    18 |    25 |  2.49 |
| claim-office-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   5 |  95    |    58 |   162 | 40.5  |
| claim-office-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  14    |    10 |    20 |  4.24 |
| claim-office-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   2 |  17    |    15 |    19 |  2.83 |
| claim-office-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   6 |  12.5  |     0 |    19 |  6.95 |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   2    |     2 |     2 |  0    |
| game-of-life-python-example-mapping | baseline-inline-tdd-v1-pi            | gpt-5-6-sol-codex  |   6 |   3.33 |     2 |     8 |  2.42 |
| game-of-life-python-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   3.6  |     0 |     6 |  2.51 |
| game-of-life-python-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |   5 |   4.8  |     2 |     9 |  2.95 |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   3.6  |     2 |     7 |  2.3  |
| game-of-life-python-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   3.2  |     2 |     5 |  1.64 |
