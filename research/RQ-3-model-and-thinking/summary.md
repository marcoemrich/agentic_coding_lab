# RQ-3 — Aggregation

_Wirken Modell-Klasse (Opus / Sonnet / Haiku) und Thinking-Mode auf Output-Qualität und Effizienz?_

Generated: 2026-05-10T13:01:33Z

Cells declared: 10 · matched runs: 20 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7 | 3 | 3 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7 | 5 | 4 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 2 | 2 | ⚠️ unter min_replicates (2/3) |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6 | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6 | 1 | 1 | ⚠️ unter min_replicates (1/3) |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking | 0 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5 | 3 | 3 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5 | 3 | 3 | ✅ |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow           | model                |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5            |   3 |       2 |       67 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7             |   5 |       5 |      100 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6           |   1 |       1 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5            |   3 |       2 |       67 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7             |   3 |       0 |        0 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   2 |       0 |        0 |

### verification_pct

| kata                         | workflow           | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5            |   3 |   0    |  0    |     0 |   0    |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7             |   5 |   0.4  |  0    |     1 |   0.45 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |   0.78 |  0.33 |     1 |   0.38 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6           |   1 |   0    |  0    |     0 | nan    |

### verification_passed

| kata                         | workflow           | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5            |   3 |   0    |     0 |     0 |   0    |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7             |   5 |   6    |     0 |    15 |   6.75 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |  11.67 |     5 |    15 |   5.77 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6           |   1 |   0    |     0 |     0 | nan    |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5            |   3 |   0    |     0 |     0 |   0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7             |   3 |   0    |     0 |     0 |   0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   1 |   0    |     0 |     0 | nan    |

### verification_total

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5            |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7             |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6           |   1 |     15 |    15 |    15 |   nan |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5            |   3 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7             |   3 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   1 |      0 |     0 |     0 |   nan |

### code_mass

| kata                         | workflow           | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5            |   3 | 438.67 |   288 |   526 | 131.03 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7             |   5 | 707.2  |   629 |   758 |  52.42 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 | 796    |   617 |   902 | 155.89 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6           |   1 | 465    |   465 |   465 | nan    |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5            |   3 | 317.33 |   225 |   500 | 158.2  |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7             |   3 | 168.33 |   168 |   169 |   0.58 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   1 | 145    |   145 |   145 | nan    |

### smell_total

| kata                         | workflow           | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5            |   3 |   8.33 |     5 |    12 |   3.51 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7             |   5 |   0.6  |     0 |     1 |   0.55 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |   1    |     0 |     2 |   1    |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6           |   1 |   5    |     5 |     5 | nan    |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5            |   3 |   7.67 |     5 |    11 |   3.06 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7             |   3 |   2    |     2 |     2 |   0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   1 |   2    |     2 |     2 | nan    |

### cc_longest_function

| kata                         | workflow           | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5            |   3 |  24.33 |    14 |    30 |   8.96 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7             |   5 |  16.2  |     9 |    22 |   6.61 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |  14.33 |    12 |    16 |   2.08 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6           |   1 |  28    |    28 |    28 | nan    |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5            |   3 |  33.67 |    12 |    52 |  20.21 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7             |   3 |  14.67 |     9 |    24 |   8.14 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   1 |  14    |    14 |    14 | nan    |

### mccabe_max

| kata                         | workflow           | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5            |   3 |   5.67 |     5 |     6 |   0.58 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7             |   5 |   4.6  |     3 |     8 |   1.95 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |   7.33 |     4 |    13 |   4.93 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6           |   1 |   8    |     8 |     8 | nan    |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5            |   3 |  10    |     4 |    14 |   5.29 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7             |   3 |   4.33 |     3 |     5 |   1.15 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   1 |   4    |     4 |     4 | nan    |

### cognitive_max

| kata                         | workflow           | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5            |   3 |   4.67 |     4 |     5 |   0.58 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7             |   5 |   3.6  |     1 |     6 |   1.82 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |   7.67 |     5 |    10 |   2.52 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6           |   1 |  13    |    13 |    13 | nan    |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5            |   3 |  12.33 |     6 |    19 |   6.51 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7             |   3 |   5.33 |     3 |     7 |   2.08 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   1 |   3    |     3 |     3 | nan    |

### duration_seconds

| kata                         | workflow           | model                |   n |    mean |   min |   max |    std |
|:-----------------------------|:-------------------|:---------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5            |   3 | 2463.33 |  1626 |  3186 | 786.3  |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7             |   4 | 4664    |  3799 |  5400 | 677.31 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 | 4247    |  3402 |  4780 | 740.09 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6           |   1 | 4102    |  4102 |  4102 | nan    |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5            |   3 | 1112.33 |  1059 |  1142 |  46.29 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7             |   3 | 1304.33 |  1183 |  1366 | 105.08 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   1 | 1360    |  1360 |  1360 | nan    |

### total_tokens

| kata                         | workflow           | model                |   n |        mean |         min |         max |             std |
|:-----------------------------|:-------------------|:---------------------|----:|------------:|------------:|------------:|----------------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5            |   3 | 1.0167e+07  | 6.88446e+06 | 1.20006e+07 |     2.84922e+06 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7             |   5 | 9.00721e+06 | 0           | 1.45351e+07 |     5.89114e+06 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 | 1.51804e+07 | 1.32112e+07 | 1.65481e+07 |     1.74788e+06 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6           |   1 | 9.66854e+06 | 9.66854e+06 | 9.66854e+06 |   nan           |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5            |   3 | 4.47241e+06 | 2.98723e+06 | 5.74246e+06 |     1.39016e+06 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7             |   3 | 3.53425e+06 | 3.45983e+06 | 3.59701e+06 | 69331.5         |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   1 | 3.01266e+06 | 3.01266e+06 | 3.01266e+06 |   nan           |

### context_utilization_pct

| kata                         | workflow           | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5            |   3 |  45.67 |    38 |    51 |   6.81 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7             |   5 |  12.8  |     0 |    17 |   7.36 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |  16.67 |    16 |    17 |   0.58 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6           |   1 |  13    |    13 |    13 | nan    |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5            |   3 |  32.33 |    29 |    36 |   3.51 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7             |   3 |   9    |     9 |     9 |   0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   1 |   8    |     8 |     8 | nan    |

### completed_within_budget (rate %)

| kata                         | workflow           | model                |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5            |   3 |       3 |      100 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7             |   5 |       4 |       80 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6           |   1 |       1 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5            |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7             |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   2 |       2 |      100 |
