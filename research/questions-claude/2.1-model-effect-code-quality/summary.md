# RQ-model-quality — Aggregation

_How strongly do the available models (Sonnet 4.6, Opus 4.6, Opus 4.7, Opus 4.8, Fable 5 — each with/without thinking) differ in code quality on a training-known kata under the strongest workflow?_

Generated: 2026-09-30T21:56:53Z

Cells declared: 12 · matched runs: 44 · min_replicates: 3

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5 | 3 | 3 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5 | 3 | 3 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8 | 3 | 3 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking | 4 | 4 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7 | 3 | 3 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey | 3 | 3 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6 | 3 | 3 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking | 3 | 3 | ✅ |

## Outcome pivots (per cell)

### code_mass

| kata                         | cell_workflow         | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 | 163    |   148 |   172 | 13.08 |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 | 163.33 |   148 |   183 | 17.9  |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 | 173    |   139 |   193 | 29.6  |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 | 175.67 |   127 |   211 | 43.56 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 | 159    |   155 |   165 |  5.29 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 | 166.6  |   146 |   201 | 17.65 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 | 145.33 |   138 |   158 | 11.02 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 | 190.5  |   168 |   208 | 18.48 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 | 172.67 |   136 |   200 | 33.01 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 | 149.33 |   138 |   159 | 10.6  |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 | 178    |   163 |   206 | 24.27 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 | 166.67 |   165 |   170 |  2.89 |

### smell_total

| kata                         | cell_workflow         | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |   3    |     3 |     3 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |   2.33 |     2 |     3 |  0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |   4.33 |     3 |     6 |  1.53 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |   4.33 |     3 |     6 |  1.53 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |   2.33 |     2 |     3 |  0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |   2.6  |     2 |     4 |  0.7  |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |   2.67 |     2 |     3 |  0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |   3    |     3 |     3 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |   1.67 |     0 |     3 |  1.53 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |   2.67 |     2 |     3 |  0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |   5.67 |     3 |     8 |  2.52 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |   3.33 |     3 |     4 |  0.58 |

### cc_longest_function

| kata                         | cell_workflow         | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |   8.33 |     6 |    10 |  2.08 |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |   6.67 |     4 |     9 |  2.52 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |  19.33 |    14 |    26 |  6.11 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |  18.67 |    11 |    26 |  7.51 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |   7    |     2 |    15 |  7    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |   8.1  |     2 |    15 |  4.04 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |   4.33 |     2 |     9 |  4.04 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |  11.5  |    11 |    12 |  0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |   6.33 |     6 |     7 |  0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |   5.33 |     4 |     6 |  1.15 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |  21.67 |    16 |    33 |  9.81 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |  15    |    10 |    24 |  7.81 |

### cc_loc

| kata                         | cell_workflow         | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |  29.33 |    27 |    32 |  2.52 |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |  29.33 |    23 |    39 |  8.5  |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |  28.33 |    20 |    34 |  7.37 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |  31.33 |    22 |    37 |  8.14 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |  25.67 |    25 |    27 |  1.15 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |  31.1  |    25 |    47 |  6.74 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |  31.33 |    27 |    39 |  6.66 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |  40.75 |    35 |    46 |  5.12 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |  37.33 |    34 |    42 |  4.16 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |  32    |    27 |    35 |  4.36 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |  32.67 |    29 |    38 |  4.73 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |  31.33 |    28 |    34 |  3.06 |

### mccabe_max

| kata                         | cell_workflow         | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |   2    |     2 |     2 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |   2.67 |     2 |     3 |  0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |   6.67 |     6 |     7 |  0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |   7.67 |     5 |    11 |  3.06 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |   3.33 |     3 |     4 |  0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |   4.5  |     3 |    11 |  2.42 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |   4.33 |     3 |     6 |  1.53 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |   4.25 |     3 |     5 |  0.96 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |   3    |     3 |     3 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |   2.67 |     2 |     3 |  0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |   6.33 |     4 |     8 |  2.08 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |   6    |     4 |    10 |  3.46 |

### cognitive_max

| kata                         | cell_workflow         | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |   1    |     1 |     1 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |   1.67 |     1 |     2 |  0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |  12    |     9 |    15 |  3    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |  13    |     7 |    17 |  5.29 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |   3    |     2 |     4 |  1    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |   4.4  |     2 |    17 |  4.48 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |   5.33 |     3 |     7 |  2.08 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |   4.75 |     2 |     7 |  2.63 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |   2    |     2 |     2 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |   1.67 |     1 |     2 |  0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |  11    |     2 |    16 |  7.81 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |   5    |     2 |    11 |  5.2  |

### tests_passing (rate %)

| kata                         | cell_workflow         | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |       3 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |       3 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |       3 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |       3 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      10 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |       3 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |       4 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |       3 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |       3 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |       3 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |       3 |      100 |

### verification_pct

| kata                         | cell_workflow         | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |   0.73 |   0.2 |     1 |  0.46 |

### verification_passed

| kata                         | cell_workflow         | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |     11 |     3 |    15 |  6.93 |

### verification_total

| kata                         | cell_workflow         | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |     15 |    15 |    15 |     0 |

### completed_within_budget (rate %)

| kata                         | cell_workflow         | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |       3 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |       3 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |       3 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |       3 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      10 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |       3 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |       4 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |       3 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |       3 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |       3 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |       3 |      100 |

### duration_seconds

| kata                         | cell_workflow         | cell_model                   |   n |    mean |   min |   max |    std |
|:-----------------------------|:----------------------|:-----------------------------|----:|--------:|------:|------:|-------:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 | 1269    |  1038 |  1425 | 204.11 |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 | 1158    |   975 |  1309 | 169.28 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |  956.33 |   866 |  1100 | 125.79 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 | 1160.67 |   727 |  1645 | 461.09 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |  827.67 |   637 |  1055 | 211.4  |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 | 1162.9  |   604 |  3923 | 984.46 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 | 1017    |   838 |  1265 | 221.7  |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 | 1045.5  |   959 |  1137 |  73.89 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 | 1526.33 |  1201 |  1737 | 285.81 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 | 1467.67 |  1396 |  1523 |  65.06 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |  846.33 |   802 |   894 |  46.09 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 | 1116.67 |  1057 |  1211 |  82.65 |

### total_tokens

| kata                         | cell_workflow         | cell_model                   |   n |        mean |      min |      max |              std |
|:-----------------------------|:----------------------|:-----------------------------|----:|------------:|---------:|---------:|-----------------:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 | 8.95879e+06 |  7798595 |  9925537 |      1.07659e+06 |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 | 7.81926e+06 |  7296419 |  8267965 | 489998           |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 | 6.64428e+06 |  6307713 |  7295759 | 564299           |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 | 8.34565e+06 |  5201622 | 12098538 |      3.48854e+06 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 | 7.63811e+06 |  6054958 |  9422212 |      1.6926e+06  |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 | 7.28733e+06 |  5864196 |  8969653 |      1.0652e+06  |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 | 8.63911e+06 |  7869853 |  9315233 | 727177           |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 | 9.3722e+06  |  8386759 | 10047168 | 703636           |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 | 1.29582e+07 | 10274383 | 15428827 |      2.58382e+06 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 | 1.31571e+07 | 11929474 | 13809704 |      1.06383e+06 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 | 6.41847e+06 |  6145488 |  6591216 | 239175           |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 | 6.71601e+06 |  5553237 |  7899067 |      1.17305e+06 |
