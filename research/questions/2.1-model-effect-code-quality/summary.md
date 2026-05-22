# RQ-3 — Aggregation

_Wie stark unterscheiden sich die verfügbaren Modelle (Sonnet 4.6, Opus 4.6, Opus 4.7 — jeweils mit/ohne Thinking) in der Code-Qualität auf einer trainingsbekannten Kata bei stärkstem Workflow?_

Generated: 2026-05-14T22:44:51Z

Cells declared: 6 · matched runs: 21 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7 | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6 | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking | 3 | 3 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 | 173    |   139 |   193 | 29.6  |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 | 175.67 |   127 |   211 | 43.56 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 | 159    |   155 |   165 |  5.29 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   6 | 167.67 |   154 |   193 | 13.95 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 | 178    |   163 |   206 | 24.27 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 | 166.67 |   165 |   170 |  2.89 |

### smell_total

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |   4.33 |     3 |     6 |  1.53 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 |   4.33 |     3 |     6 |  1.53 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |   2.33 |     2 |     3 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   6 |   2.5  |     2 |     3 |  0.55 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |   5.67 |     3 |     8 |  2.52 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |   3.33 |     3 |     4 |  0.58 |

### cc_longest_function

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |  19.33 |    14 |    26 |  6.11 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 |  18.67 |    11 |    26 |  7.51 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |   7    |     2 |    15 |  7    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   6 |   9.33 |     6 |    15 |  3.2  |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |  21.67 |    16 |    33 |  9.81 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |  15    |    10 |    24 |  7.81 |

### cc_loc

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |  28.33 |    20 |    34 |  7.37 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 |  31.33 |    22 |    37 |  8.14 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |  25.67 |    25 |    27 |  1.15 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   6 |  32.33 |    25 |    47 |  8.14 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |  32.67 |    29 |    38 |  4.73 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |  31.33 |    28 |    34 |  3.06 |

### mccabe_max

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |   6.67 |     6 |     7 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 |   7.67 |     5 |    11 |  3.06 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |   3.33 |     3 |     4 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   6 |   4    |     3 |     5 |  0.89 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |   6.33 |     4 |     8 |  2.08 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |   6    |     4 |    10 |  3.46 |

### cognitive_max

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |  12    |     9 |    15 |  3    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 |  13    |     7 |    17 |  5.29 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |   3    |     2 |     4 |  1    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   6 |   2.83 |     2 |     4 |  0.75 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |  11    |     2 |    16 |  7.81 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |   5    |     2 |    11 |  5.2  |

### tests_passing (rate %)

| kata                         | workflow           | model                        |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   6 |       6 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |       3 |      100 |

### verification_pct

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   6 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |   0.73 |   0.2 |     1 |  0.46 |

### verification_passed

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   6 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |     11 |     3 |    15 |  6.93 |

### verification_total

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   6 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |     15 |    15 |    15 |     0 |

### completed_within_budget (rate %)

| kata                         | workflow           | model                        |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   6 |       6 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |       3 |      100 |

### duration_seconds

| kata                         | workflow           | model                        |   n |    mean |   min |   max |    std |
|:-----------------------------|:-------------------|:-----------------------------|----:|--------:|------:|------:|-------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 |  956.33 |   866 |  1100 | 125.79 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 | 1160.67 |   727 |  1645 | 461.09 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 |  827.67 |   637 |  1055 | 211.4  |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   6 |  865.17 |   661 |  1124 | 179.28 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |  846.33 |   802 |   894 |  46.09 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 | 1116.67 |  1057 |  1211 |  82.65 |

### total_tokens

| kata                         | workflow           | model                        |   n |        mean |     min |     max |              std |
|:-----------------------------|:-------------------|:-----------------------------|----:|------------:|--------:|--------:|-----------------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   3 | 2.92588e+06 | 2759447 | 3192684 | 233411           |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   3 | 3.86715e+06 | 2456809 | 5761590 |      1.70475e+06 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   3 | 2.48847e+06 | 1868493 | 2918497 | 550171           |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   6 | 2.57698e+06 | 2023377 | 3201698 | 405256           |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 | 2.40718e+06 | 1984762 | 2659370 | 368110           |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 | 2.21178e+06 | 1881808 | 2793688 | 505455           |
