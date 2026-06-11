# RQ-model-quality — Aggregation

_Wie stark unterscheiden sich die verfügbaren Modelle (Sonnet 4.6, Opus 4.6, Opus 4.7, Opus 4.8, Fable 5 — jeweils mit/ohne Thinking) in der Code-Qualität auf einer trainingsbekannten Kata bei stärkstem Workflow?_

Generated: 2026-06-10T01:29:58Z

Cells declared: 10 · matched runs: 38 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v4-exact-subagents | fable-5 | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | fable-5-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8 | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8-no-thinking | 4 | 4 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7 | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6 | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking | 3 | 3 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | fable-5                      |   3 | 163    |   148 |   172 | 13.08 |
| game-of-life-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   3 | 163.33 |   148 |   183 | 17.9  |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 | 173    |   139 |   193 | 29.6  |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 | 175.67 |   127 |   211 | 43.56 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 | 159    |   155 |   165 |  5.29 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 | 166.6  |   146 |   201 | 17.65 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8                     |   3 | 145.33 |   138 |   158 | 11.02 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   4 | 190.5  |   168 |   208 | 18.48 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 | 178    |   163 |   206 | 24.27 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 | 166.67 |   165 |   170 |  2.89 |

### smell_total

| kata                         | workflow           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | fable-5                      |   3 |   3    |     3 |     3 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   3 |   2.33 |     2 |     3 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |   4.33 |     3 |     6 |  1.53 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 |   4.33 |     3 |     6 |  1.53 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |   2.33 |     2 |     3 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |   2.6  |     2 |     4 |  0.7  |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8                     |   3 |   2.67 |     2 |     3 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   4 |   3    |     3 |     3 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |   5.67 |     3 |     8 |  2.52 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |   3.33 |     3 |     4 |  0.58 |

### cc_longest_function

| kata                         | workflow           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | fable-5                      |   3 |   8.33 |     6 |    10 |  2.08 |
| game-of-life-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   3 |   6.67 |     4 |     9 |  2.52 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |  19.33 |    14 |    26 |  6.11 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 |  18.67 |    11 |    26 |  7.51 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |   7    |     2 |    15 |  7    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |   8.1  |     2 |    15 |  4.04 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8                     |   3 |   4.33 |     2 |     9 |  4.04 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   4 |  11.5  |    11 |    12 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |  21.67 |    16 |    33 |  9.81 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |  15    |    10 |    24 |  7.81 |

### cc_loc

| kata                         | workflow           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | fable-5                      |   3 |  29.33 |    27 |    32 |  2.52 |
| game-of-life-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   3 |  29.33 |    23 |    39 |  8.5  |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |  28.33 |    20 |    34 |  7.37 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 |  31.33 |    22 |    37 |  8.14 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |  25.67 |    25 |    27 |  1.15 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |  31.1  |    25 |    47 |  6.74 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8                     |   3 |  31.33 |    27 |    39 |  6.66 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   4 |  40.75 |    35 |    46 |  5.12 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |  32.67 |    29 |    38 |  4.73 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |  31.33 |    28 |    34 |  3.06 |

### mccabe_max

| kata                         | workflow           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | fable-5                      |   3 |   2    |     2 |     2 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   3 |   2.67 |     2 |     3 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |   6.67 |     6 |     7 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 |   7.67 |     5 |    11 |  3.06 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |   3.33 |     3 |     4 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |   4.5  |     3 |    11 |  2.42 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8                     |   3 |   4.33 |     3 |     6 |  1.53 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   4 |   4.25 |     3 |     5 |  0.96 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |   6.33 |     4 |     8 |  2.08 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |   6    |     4 |    10 |  3.46 |

### cognitive_max

| kata                         | workflow           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | fable-5                      |   3 |   1    |     1 |     1 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   3 |   1.67 |     1 |     2 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |  12    |     9 |    15 |  3    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 |  13    |     7 |    17 |  5.29 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |   3    |     2 |     4 |  1    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |   4.4  |     2 |    17 |  4.48 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8                     |   3 |   5.33 |     3 |     7 |  2.08 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   4 |   4.75 |     2 |     7 |  2.63 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |  11    |     2 |    16 |  7.81 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |   5    |     2 |    11 |  5.2  |

### tests_passing (rate %)

| kata                         | workflow           | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents | fable-5                      |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |      10 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8                     |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   4 |       4 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |       3 |      100 |

### verification_pct

| kata                         | workflow           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | fable-5                      |   3 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   3 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8                     |   3 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   4 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |   0.73 |   0.2 |     1 |  0.46 |

### verification_passed

| kata                         | workflow           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | fable-5                      |   3 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   3 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8                     |   3 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   4 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |     11 |     3 |    15 |  6.93 |

### verification_total

| kata                         | workflow           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | fable-5                      |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8                     |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   4 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |     15 |    15 |    15 |     0 |

### completed_within_budget (rate %)

| kata                         | workflow           | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents | fable-5                      |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |      10 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8                     |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   4 |       4 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |       3 |      100 |

### duration_seconds

| kata                         | workflow           | cell_model                   |   n |    mean |   min |   max |    std |
|:-----------------------------|:-------------------|:-----------------------------|----:|--------:|------:|------:|-------:|
| game-of-life-example-mapping | v4-exact-subagents | fable-5                      |   3 | 1269    |  1038 |  1425 | 204.11 |
| game-of-life-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   3 | 1158    |   975 |  1309 | 169.28 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |  956.33 |   866 |  1100 | 125.79 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 | 1160.67 |   727 |  1645 | 461.09 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |  827.67 |   637 |  1055 | 211.4  |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 | 1162.9  |   604 |  3923 | 984.46 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8                     |   3 | 1017    |   838 |  1265 | 221.7  |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   4 | 1045.5  |   959 |  1137 |  73.89 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |  846.33 |   802 |   894 |  46.09 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 | 1116.67 |  1057 |  1211 |  82.65 |

### total_tokens

| kata                         | workflow           | cell_model                   |   n |        mean |     min |     max |              std |
|:-----------------------------|:-------------------|:-----------------------------|----:|------------:|--------:|--------:|-----------------:|
| game-of-life-example-mapping | v4-exact-subagents | fable-5                      |   3 | 2.63545e+06 | 2057267 | 3147340 | 548052           |
| game-of-life-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   3 | 2.25552e+06 | 1963846 | 2526529 | 281910           |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 | 2.92588e+06 | 2759447 | 3192684 | 233411           |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 | 3.86715e+06 | 2456809 | 5761590 |      1.70475e+06 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 | 2.48847e+06 | 1868493 | 2918497 | 550171           |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 | 2.56189e+06 | 2023377 | 3201698 | 382603           |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8                     |   3 | 3.8e+06     | 3237908 | 4562493 | 684656           |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   4 | 3.17198e+06 | 2812743 | 3822763 | 459273           |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 | 2.40718e+06 | 1984762 | 2659370 | 368110           |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 | 2.21178e+06 | 1881808 | 2793688 | 505455           |
