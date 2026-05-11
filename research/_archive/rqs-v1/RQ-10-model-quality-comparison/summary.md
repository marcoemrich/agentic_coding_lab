# RQ-10 — Aggregation

_Wie unterscheiden sich Opus 4.7 und Opus 4.6 hinsichtlich Code-Qualität unter den Workflows v4 und v5?_

Generated: 2026-05-11T03:41:22Z

Cells declared: 8 · matched runs: 34 · min_replicates: 4

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7 | 4 | 4 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7 | 4 | 4 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 4 | 4 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey | 4 | 4 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey | 4 | 4 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking | 4 | 4 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking | 4 | 4 | ✅ |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow                | model                        |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey             |   4 |       4 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   4 |       4 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7                     |   4 |       3 |       75 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |   4 |       3 |       75 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey             |   4 |       4 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking |   4 |       4 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7                     |   4 |       0 |        0 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking         |   6 |       6 |      100 |

### code_mass

| kata                         | workflow                | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey             |   4 | 157.75 |   106 |   191 | 38.59 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   4 | 155.75 |   139 |   167 | 11.93 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7                     |   4 | 162.75 |   146 |   169 | 11.18 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |   4 | 155    |   137 |   184 | 20.54 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey             |   4 | 145.75 |   125 |   172 | 19.45 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking |   4 | 131    |   125 |   137 |  6.93 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7                     |   4 | 175.5  |   147 |   202 | 29.56 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking         |   6 | 157    |   146 |   184 | 13.56 |

### cc_loc

| kata                         | workflow                | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey             |   4 |  29.5  |    20 |    36 |  7.51 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   4 |  28.25 |    23 |    33 |  4.99 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7                     |   4 |  31.75 |    29 |    35 |  2.75 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |   4 |  29.75 |    25 |    35 |  4.99 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey             |   4 |  25.5  |    21 |    35 |  6.4  |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking |   4 |  21.75 |    21 |    23 |  0.96 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7                     |   4 |  29.25 |    22 |    37 |  7.37 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking         |   6 |  29.67 |    24 |    36 |  4.5  |

### cc_avg_loc_per_function

| kata                         | workflow                | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey             |   4 |   9.98 |  3.8  | 23    |  8.83 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   4 |   6.21 |  2.33 | 13.5  |  5.12 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7                     |   4 |   5.95 |  3.8  |  9.5  |  2.67 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |   4 |   5.46 |  3.4  |  6.75 |  1.44 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey             |   4 |  12.69 |  8.75 | 24    |  7.54 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking |   4 |  16.34 |  8.67 | 24    |  8.85 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7                     |   4 |   5.68 |  1.5  | 12.33 |  5.23 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking         |   6 |   7.17 |  2    | 13    |  3.66 |

### cc_longest_function

| kata                         | workflow                | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey             |   4 |  16.75 |    11 |    23 |  6.13 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   4 |   9    |     3 |    14 |  5.83 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7                     |   4 |  14.25 |     9 |    24 |  6.7  |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |   4 |  12.25 |    10 |    14 |  1.71 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey             |   4 |  22.75 |    19 |    24 |  2.5  |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking |   4 |  23.5  |    23 |    24 |  0.58 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7                     |   4 |  10.25 |     2 |    25 | 10.9  |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking         |   6 |  16.83 |     2 |    25 |  7.99 |

### mccabe_max

| kata                         | workflow                | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey             |   4 |   7.5  |     5 |    11 |  2.65 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   4 |   5.75 |     2 |     8 |  2.63 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7                     |   4 |   4.25 |     3 |     5 |  0.96 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |   4 |   5.25 |     4 |     7 |  1.26 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey             |   4 |  10.25 |     8 |    11 |  1.5  |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking |   4 |  11    |    11 |    11 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7                     |   4 |   8    |     6 |    11 |  2.16 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking         |   6 |   6.33 |     3 |    11 |  2.66 |

### mccabe_avg

| kata                         | workflow                | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey             |   4 |   4.23 |  1.54 | 11    |  4.53 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   4 |   2.41 |  1.15 |  4.33 |  1.35 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7                     |   4 |   2.06 |  1.4  |  3    |  0.68 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |   4 |   2.43 |  2    |  3    |  0.46 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey             |   4 |   3.88 |  2.5  |  6    |  1.49 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking |   4 |   4.75 |  3.5  |  6    |  1.44 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7                     |   4 |   3.47 |  2.14 |  4.33 |  0.97 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking         |   6 |   2.96 |  1.25 |  6    |  1.62 |

### cognitive_max

| kata                         | workflow                | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey             |   4 |  11.75 |     7 |    17 |  5.5  |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   4 |   7.75 |     1 |    12 |  4.72 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7                     |   4 |   4.75 |     3 |     7 |  2.06 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |   4 |   5.25 |     3 |     7 |  2.06 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey             |   4 |  16.75 |    16 |    17 |  0.5  |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking |   4 |  17    |    17 |    17 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7                     |   4 |  11.75 |     7 |    17 |  4.11 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking         |   6 |  10.17 |     2 |    21 |  7.11 |

### cognitive_avg

| kata                         | workflow                | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey             |   4 |   7.58 |   2.5 |    17 |  6.47 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   4 |   5.88 |   1   |     9 |  3.71 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7                     |   4 |   3.25 |   2.5 |     5 |  1.19 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |   4 |   3.75 |   2.5 |     5 |  1.19 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey             |   4 |  14    |   5   |    17 |  6    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking |   4 |  17    |  17   |    17 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7                     |   4 |   9.75 |   4.5 |    17 |  5.42 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking         |   6 |   7.33 |   2   |    21 |  6.92 |

### smell_total

| kata                         | workflow                | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey             |   4 |   3.75 |     2 |     6 |  1.71 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   4 |   3    |     2 |     4 |  0.82 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7                     |   4 |   2    |     2 |     2 |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |   4 |   2.5  |     2 |     3 |  0.58 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey             |   4 |   4.5  |     4 |     6 |  1    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking |   4 |   4    |     4 |     4 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7                     |   4 |   3.5  |     3 |     4 |  0.58 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking         |   6 |   3.17 |     2 |     5 |  1.47 |

### cycle_count

| kata                         | workflow                | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey             |   4 |   8.5  |     7 |     9 |  1    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   4 |   6.5  |     5 |     9 |  1.73 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7                     |   4 |   8.25 |     7 |    10 |  1.26 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |   4 |   8    |     8 |     8 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey             |   4 |   7    |     6 |     8 |  1.15 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking |   4 |   7.5  |     7 |     9 |  1    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7                     |   4 |   8.5  |     6 |    10 |  1.73 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking         |   6 |   7.67 |     6 |     8 |  0.82 |

### predictions_correct

| kata                         | workflow                | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey             |   4 |  18    |    14 |    22 |  3.27 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   4 |  12.75 |    10 |    17 |  2.99 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7                     |   4 |  13.75 |    10 |    18 |  3.3  |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |   4 |  14    |    12 |    16 |  1.63 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey             |   4 |  13.5  |    12 |    15 |  1.73 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking |   4 |  15    |    14 |    18 |  2    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7                     |   4 |  16    |    12 |    19 |  2.94 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking         |   6 |  15.17 |    12 |    16 |  1.6  |

### predictions_total

| kata                         | workflow                | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey             |   4 |  18    |    14 |    22 |  3.27 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   4 |  12.75 |    10 |    17 |  2.99 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7                     |   4 |  14    |    10 |    18 |  3.27 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |   4 |  14    |    12 |    16 |  1.63 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey             |   4 |  14    |    12 |    16 |  2.31 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking |   4 |  15    |    14 |    18 |  2    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7                     |   4 |  16.5  |    12 |    20 |  3.42 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking         |   6 |  15.33 |    12 |    16 |  1.63 |

### predictions_correct_rate (pooled %)

| kata                         | workflow                | model                        |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------------|:-----------------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey             |   4 |        72 |      72 |    100   |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   4 |        51 |      51 |    100   |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7                     |   4 |        55 |      56 |     98.2 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |   4 |        56 |      56 |    100   |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey             |   4 |        54 |      56 |     96.4 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking |   4 |        60 |      60 |    100   |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7                     |   4 |        64 |      66 |     97   |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking         |   6 |        91 |      92 |     98.9 |

### duration_seconds

| kata                         | workflow                | model                        |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------------|:-----------------------------|----:|--------:|------:|------:|-------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey             |   4 | 1115.75 |   858 |  1321 | 191.94 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   4 |  866.25 |   729 |  1074 | 151.34 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7                     |   4 | 1322.25 |  1183 |  1376 |  92.98 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |   4 | 1087    |   763 |  1376 | 326.43 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey             |   4 |  618.5  |   390 |   725 | 154.74 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking |   4 |  569.5  |   501 |   637 |  64.84 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7                     |   4 |  474.75 |   355 |   557 |  91.75 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking         |   6 |  349.5  |   329 |   377 |  16.56 |

### total_tokens

| kata                         | workflow                | model                        |   n |        mean |     min |      max |              std |
|:-----------------------------|:------------------------|:-----------------------------|----:|------------:|--------:|---------:|-----------------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey             |   4 | 4.79718e+06 | 3533177 |  5494710 | 871145           |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   4 | 4.2758e+06  | 3614662 |  5037099 | 588023           |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7                     |   4 | 3.68157e+06 | 3459827 |  4123535 | 300029           |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |   4 | 3.05962e+06 | 2521335 |  3776105 | 523619           |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey             |   4 | 1.17988e+07 | 7360637 | 14043233 |      3.03699e+06 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking |   4 | 1.00102e+07 | 9001742 | 11101434 |      1.10813e+06 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7                     |   4 | 1.13325e+07 | 7783093 | 13111658 |      2.40388e+06 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking         |   6 | 8.84631e+06 | 7645056 | 10773096 |      1.12327e+06 |

### completed_within_budget (rate %)

| kata                         | workflow                | model                        |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey             |   4 |       4 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   4 |       4 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7                     |   4 |       4 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |   4 |       4 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey             |   4 |       4 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking |   4 |       4 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7                     |   4 |       4 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking         |   6 |       6 |      100 |
