# RQ-3 — Aggregation

_Wirken Modell-Klasse (Opus / Sonnet / Haiku) und Thinking-Mode auf Output-Qualität und Effizienz?_

Generated: 2026-05-10T17:19:21Z

Cells declared: 10 · matched runs: 31 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7 | 3 | 3 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7 | 6 | 5 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6 | 3 | 3 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6 | 1 | 1 | ⚠️ unter min_replicates (1/3) |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking | 0 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5 | 3 | 3 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5 | 3 | 3 | ✅ |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow           | model                  |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:-----------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |       2 |       67 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7               |   6 |       6 |      100 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   6 |       5 |       83 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6             |   1 |       1 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |       2 |       67 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7               |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6             |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking |   3 |       3 |      100 |

### verification_pct

| kata                         | workflow           | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5            |   3 |   0    |  0    |     0 |   0    |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7             |   6 |   0.5  |  0    |     1 |   0.47 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   5 |   0.72 |  0.27 |     1 |   0.38 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6           |   1 |   0    |  0    |     0 | nan    |

### verification_passed

| kata                         | workflow           | model                  |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:-----------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |    0   |     0 |     0 |   0    |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7               |   6 |    7.5 |     0 |    15 |   7.06 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   5 |   10.8 |     4 |    15 |   5.76 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6             |   1 |    0   |     0 |     0 | nan    |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |    0   |     0 |     0 |   0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7               |   3 |    0   |     0 |     0 |   0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   3 |    0   |     0 |     0 |   0    |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6             |   3 |    0   |     0 |     0 |   0    |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking |   3 |    0   |     0 |     0 |   0    |

### verification_total

| kata                         | workflow           | model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7               |   6 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6             |   1 |     15 |    15 |    15 |   nan |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7               |   3 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   3 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6             |   3 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking |   3 |      0 |     0 |     0 |     0 |

### code_mass

| kata                         | workflow           | model                  |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:-----------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5              |   3 | 438.67 |   288 |   526 | 131.03 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7               |   6 | 655    |   182 |   900 | 247.9  |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   5 | 555.8  |   167 |   902 | 347.47 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6             |   1 | 465    |   465 |   465 | nan    |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5              |   3 | 317.33 |   225 |   500 | 158.2  |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7               |   3 | 168.33 |   168 |   169 |   0.58 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   3 | 161    |   145 |   184 |  20.42 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6             |   3 | 183    |   153 |   210 |  28.62 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking |   3 | 188.67 |   120 |   324 | 117.21 |

### smell_total

| kata                         | workflow           | model                  |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:-----------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |   8.33 |     5 |    12 |   3.51 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7               |   6 |   0.5  |     0 |     1 |   0.55 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   5 |   0.6  |     0 |     2 |   0.89 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6             |   1 |   5    |     5 |     5 | nan    |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |   7.67 |     5 |    11 |   3.06 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7               |   3 |   2    |     2 |     2 |   0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   3 |   2.33 |     2 |     3 |   0.58 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6             |   3 |   4    |     3 |     5 |   1    |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking |   3 |   5.67 |     3 |    10 |   3.79 |

### cc_longest_function

| kata                         | workflow           | model                  |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:-----------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |  24.33 |    14 |    30 |   8.96 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7               |   6 |  16.83 |     9 |    22 |   5.78 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   5 |  14.2  |    11 |    17 |   2.59 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6             |   1 |  28    |    28 |    28 | nan    |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |  33.67 |    12 |    52 |  20.21 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7               |   3 |  14.67 |     9 |    24 |   8.14 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   3 |  12    |    10 |    14 |   2    |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6             |   3 |  16    |     6 |    23 |   8.89 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking |   3 |  12.67 |    10 |    14 |   2.31 |

### mccabe_max

| kata                         | workflow           | model                  |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:-----------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |   5.67 |     5 |     6 |   0.58 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7               |   6 |   5.33 |     3 |     9 |   2.5  |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   5 |   6.4  |     4 |    13 |   3.78 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6             |   1 |   8    |     8 |     8 | nan    |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |  10    |     4 |    14 |   5.29 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7               |   3 |   4.33 |     3 |     5 |   1.15 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   3 |   4.67 |     4 |     5 |   0.58 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6             |   3 |   7.33 |     4 |    10 |   3.06 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking |   3 |   9    |     7 |    10 |   1.73 |

### cognitive_max

| kata                         | workflow           | model                  |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:-----------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |   4.67 |     4 |     5 |   0.58 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7               |   6 |   3.67 |     1 |     6 |   1.63 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   5 |   6.6  |     5 |    10 |   2.3  |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6             |   1 |  13    |    13 |    13 | nan    |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |  12.33 |     6 |    19 |   6.51 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7               |   3 |   5.33 |     3 |     7 |   2.08 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   3 |   4.67 |     3 |     7 |   2.08 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6             |   3 |   8    |     2 |    11 |   5.2  |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking |   3 |  15    |    11 |    23 |   6.93 |

### duration_seconds

| kata                         | workflow           | model                  |   n |    mean |   min |   max |    std |
|:-----------------------------|:-------------------|:-----------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5              |   3 | 2463.33 |  1626 |  3186 | 786.3  |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7               |   6 | 4761.67 |  3799 |  5400 | 548.6  |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   5 | 4051.4  |  3402 |  4780 | 602.88 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6             |   1 | 4102    |  4102 |  4102 | nan    |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5              |   3 | 1112.33 |  1059 |  1142 |  46.29 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7               |   3 | 1304.33 |  1183 |  1366 | 105.08 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   3 | 1195    |   849 |  1376 | 299.75 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6             |   3 | 1418.67 |   924 |  1990 | 537.12 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking |   3 | 1395    |  1300 |  1510 | 106.42 |

### total_tokens

| kata                         | workflow           | model                  |   n |        mean |         min |         max |              std |
|:-----------------------------|:-------------------|:-----------------------|----:|------------:|------------:|------------:|-----------------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5              |   3 | 1.0167e+07  | 6.88446e+06 | 1.20006e+07 |      2.84922e+06 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7               |   6 | 1.18197e+07 | 6.24516e+06 | 1.55439e+07 |      3.30852e+06 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   5 | 1.46412e+07 | 1.20828e+07 | 1.65481e+07 |      1.89817e+06 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6             |   1 | 9.66854e+06 | 9.66854e+06 | 9.66854e+06 |    nan           |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5              |   3 | 4.47241e+06 | 2.98723e+06 | 5.74246e+06 |      1.39016e+06 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7               |   3 | 3.53425e+06 | 3.45983e+06 | 3.59701e+06 |  69331.5         |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   3 | 3.10337e+06 | 2.52134e+06 | 3.7761e+06  | 632284           |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6             |   3 | 2.09487e+06 | 1.9209e+06  | 2.4236e+06  | 284848           |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking |   3 | 1.9912e+06  | 1.54086e+06 | 2.88874e+06 | 777289           |

### context_utilization_pct

| kata                         | workflow           | model                  |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:-----------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |  45.67 |    38 |    51 |   6.81 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7               |   6 |  16.17 |    13 |    17 |   1.6  |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   5 |  16.8  |    16 |    17 |   0.45 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6             |   1 |  13    |    13 |    13 | nan    |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |  32.33 |    29 |    36 |   3.51 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7               |   3 |   9    |     9 |     9 |   0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   3 |   8    |     7 |     9 |   1    |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6             |   3 |   5.33 |     5 |     6 |   0.58 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking |   3 |   5.33 |     5 |     6 |   0.58 |

### completed_within_budget (rate %)

| kata                         | workflow           | model                  |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:-----------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |       3 |      100 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7               |   6 |       5 |       83 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   6 |       6 |      100 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6             |   1 |       1 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7               |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6             |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking |   3 |       3 |      100 |
