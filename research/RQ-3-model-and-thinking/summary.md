# RQ-3 — Aggregation

_Wirken Modell-Klasse (Opus / Sonnet / Haiku) und Thinking-Mode auf Output-Qualität und Effizienz?_

Generated: 2026-05-09T08:17:47Z

Cells declared: 10 · matched runs: 23 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7 | 3 | 3 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7 | 2 | 2 | ⚠️ unter min_replicates (2/3) |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6 | 3 | 3 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6 | 0 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking | 0 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5 | 3 | 3 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5 | 0 | 0 | ❌ keine Runs |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow           | model                  |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:-----------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7               |   2 |       2 |      100 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7               |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   6 |       6 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6             |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking |   3 |       3 |      100 |

### verification_pct

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7             |   2 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |   0.98 |  0.93 |     1 |  0.04 |

### verification_passed

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7             |   2 |  15    |    15 |    15 |  0    |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |  14.67 |    14 |    15 |  0.58 |

### verification_total

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7             |   2 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |

### code_mass

| kata                         | workflow           | model                  |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:-----------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7               |   2 | 347.5  |   310 |   385 |  53.03 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   3 | 159.33 |    81 |   286 | 110.72 |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5              |   3 | 272.67 |   253 |   305 |  28.22 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7               |   3 | 177.67 |   165 |   192 |  13.58 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   6 | 169    |   140 |   209 |  23.98 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6             |   3 | 210    |   158 |   293 |  72.64 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking |   3 | 271.67 |   180 |   414 | 124.96 |

### smell_total

| kata                         | workflow           | model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7               |   2 |   2    |     0 |     4 |  2.83 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   3 |   8    |     2 |    17 |  7.94 |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |   5.33 |     5 |     6 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7               |   3 |   3    |     3 |     3 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   6 |   2.5  |     2 |     3 |  0.55 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6             |   3 |   4.67 |     3 |     6 |  1.53 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking |   3 |   3    |     3 |     3 |  0    |

### cc_longest_function

| kata                         | workflow           | model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7               |   2 |  47    |    31 |    63 | 22.63 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   3 |  13.67 |    12 |    17 |  2.89 |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |  19.67 |     0 |    40 | 20.01 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7               |   3 |   8.67 |     2 |    15 |  6.51 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   6 |  15.17 |     8 |    23 |  6.21 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6             |   3 |  14    |    12 |    16 |  2    |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking |   3 |  19    |    10 |    26 |  8.19 |

### duration_seconds

| kata                         | workflow           | model                  |   n |    mean |   min |   max |     std |
|:-----------------------------|:-------------------|:-----------------------|----:|--------:|------:|------:|--------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7               |   2 | 2762.5  |  2571 |  2954 |  270.82 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   3 | 2914.33 |  1720 |  3526 | 1034.42 |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5              |   3 | 1071.67 |   652 |  1429 |  392.23 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7               |   3 |  815    |   680 |  1056 |  209.22 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   6 |  779.17 |   659 |  1059 |  152.03 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6             |   3 |  989.33 |   838 |  1151 |  156.76 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking |   3 | 1092    |  1002 |  1211 |  107.48 |

### total_tokens

| kata                         | workflow           | model                  |   n |        mean |      min |      max |              std |
|:-----------------------------|:-------------------|:-----------------------|----:|------------:|---------:|---------:|-----------------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7               |   2 | 1.37145e+07 | 13638345 | 13790597 | 107658           |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   3 | 1.35454e+07 |  9131179 | 16604812 |      3.91668e+06 |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5              |   3 | 3.81099e+06 |  1839942 |  6270635 |      2.2554e+06  |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7               |   3 | 2.53471e+06 |  1809528 |  3121582 | 666872           |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   6 | 2.6189e+06  |  2353934 |  3215887 | 326772           |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6             |   3 | 1.63764e+06 |  1493902 |  1894077 | 222622           |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking |   3 | 2.10513e+06 |  1480979 |  2989978 | 787552           |

### context_utilization_pct

| kata                         | workflow           | model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7               |   2 |  16    |    15 |    17 |  1.41 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   3 |  15.33 |    15 |    16 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |  28.67 |    25 |    33 |  4.04 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7               |   3 |   7.67 |     7 |     9 |  1.15 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   6 |  22.17 |     7 |    37 | 15.89 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6             |   3 |   5    |     5 |     5 |  0    |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking |   3 |   5.67 |     5 |     7 |  1.15 |

### completed_within_budget (rate %)

| kata                         | workflow           | model                  |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:-----------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7               |   2 |       2 |      100 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5              |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7               |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking   |   6 |       6 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6             |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking |   3 |       3 |      100 |
