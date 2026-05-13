# RQ-3 — Aggregation

_Wie stark unterscheiden sich die verfügbaren Modelle (Sonnet 4.6, Opus 4.6, Opus 4.7 — jeweils mit/ohne Thinking) in der Code-Qualität auf einer trainingsbekannten Kata bei stärkstem Workflow?_

Generated: 2026-05-13T23:34:33Z

Cells declared: 6 · matched runs: 24 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7 | 4 | 4 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 4 | 4 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey | 6 | 6 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking | 4 | 4 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6 | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking | 3 | 3 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow           | model                        |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   6 | 153.83 |   106 |   191 |  32.55 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   4 | 155.75 |   139 |   167 |  11.93 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   4 | 162.75 |   146 |   169 |  11.18 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   4 | 155    |   137 |   184 |  20.54 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 | 183    |   153 |   210 |  28.62 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 | 188.67 |   120 |   324 | 117.21 |

### smell_total

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   6 |   3.83 |     2 |     6 |  1.33 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   4 |   3    |     2 |     4 |  0.82 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   4 |   2    |     2 |     2 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   4 |   2.5  |     2 |     3 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |   4    |     3 |     5 |  1    |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |   5.67 |     3 |    10 |  3.79 |

### cc_longest_function

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   6 |  16.5  |     4 |    28 |  8.96 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   4 |   9    |     3 |    14 |  5.83 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   4 |  14.25 |     9 |    24 |  6.7  |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   4 |  12.25 |    10 |    14 |  1.71 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |  16    |     6 |    23 |  8.89 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |  12.67 |    10 |    14 |  2.31 |

### cc_loc

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   6 |  29.67 |    20 |    38 |  7.71 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   4 |  28.25 |    23 |    33 |  4.99 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   4 |  31.75 |    29 |    35 |  2.75 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   4 |  29.75 |    25 |    35 |  4.99 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |  32.33 |    28 |    38 |  5.13 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |  32.33 |    21 |    54 | 18.77 |

### mccabe_max

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   6 |   8.5  |     5 |    12 |  2.74 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   4 |   5.75 |     2 |     8 |  2.63 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   4 |   4.25 |     3 |     5 |  0.96 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   4 |   5.25 |     4 |     7 |  1.26 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |   7.33 |     4 |    10 |  3.06 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |   9    |     7 |    10 |  1.73 |

### cognitive_max

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   6 |  13.17 |     7 |    18 |  4.96 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   4 |   7.75 |     1 |    12 |  4.72 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   4 |   4.75 |     3 |     7 |  2.06 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   4 |   5.25 |     3 |     7 |  2.06 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |   8    |     2 |    11 |  5.2  |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |  15    |    11 |    23 |  6.93 |

### tests_passing (rate %)

| kata                         | workflow           | model                        |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   6 |       6 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   4 |       4 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   4 |       4 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   4 |       4 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |       3 |      100 |

### verification_pct

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   6 |   0.84 |  0.07 |   1   |  0.38 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   4 |   1    |  1    |   1   |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   4 |   1    |  1    |   1   |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   4 |   0.8  |  0.2  |   1   |  0.4  |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |   0.18 |  0.13 |   0.2 |  0.04 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |   0.16 |  0.13 |   0.2 |  0.04 |

### verification_passed

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   6 |  12.67 |     1 |    15 |  5.72 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   4 |  15    |    15 |    15 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   4 |  15    |    15 |    15 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   4 |  12    |     3 |    15 |  6    |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |   2.67 |     2 |     3 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |   2.33 |     2 |     3 |  0.58 |

### verification_total

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   6 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   4 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   4 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   4 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |     15 |    15 |    15 |     0 |

### completed_within_budget (rate %)

| kata                         | workflow           | model                        |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   6 |       6 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   4 |       4 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   4 |       4 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   4 |       4 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 |       3 |      100 |

### duration_seconds

| kata                         | workflow           | model                        |   n |    mean |   min |   max |    std |
|:-----------------------------|:-------------------|:-----------------------------|----:|--------:|------:|------:|-------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   6 | 1008.5  |   739 |  1321 | 225.65 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   4 |  866.25 |   729 |  1074 | 151.34 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   4 | 1322.25 |  1183 |  1376 |  92.98 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   4 | 1087    |   763 |  1376 | 326.43 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 | 1418.67 |   924 |  1990 | 537.12 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 | 1395    |  1300 |  1510 | 106.42 |

### total_tokens

| kata                         | workflow           | model                        |   n |        mean |     min |     max |    std |
|:-----------------------------|:-------------------|:-----------------------------|----:|------------:|--------:|--------:|-------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey             |   6 | 4.37914e+06 | 3386005 | 5494710 | 940537 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   4 | 4.2758e+06  | 3614662 | 5037099 | 588023 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7                     |   4 | 3.68157e+06 | 3459827 | 4123535 | 300029 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |   4 | 3.05962e+06 | 2521335 | 3776105 | 523619 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6                   |   3 | 2.09487e+06 | 1920902 | 2423596 | 284848 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking       |   3 | 1.9912e+06  | 1540857 | 2888738 | 777289 |
