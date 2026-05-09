# RQ-7 — Aggregation

_Wirkt sich dedizierte Subagents-pro-Phase (v4) gegenüber Single-Context (v5) auf Code-Qualität und TDD-Disziplin aus, bei sonst identischem Phasen-Skript?_

Generated: 2026-05-09T09:36:28Z

Cells declared: 4 · matched runs: 18 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 6 | 6 | ✅ |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |       6 |      100 |

### verification_pct

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   0.98 |  0.93 |     1 |  0.04 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   1    |  1    |     1 |  0    |

### verification_passed

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  14.67 |    14 |    15 |  0.58 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  15    |    15 |    15 |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |

### verification_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |      0 |     0 |     0 |     0 |

### cc_loc

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  49.33 |    22 |   101 | 44.77 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  24.67 |    22 |    27 |  2.52 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |  31.33 |    25 |    39 |  4.59 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  29.67 |    24 |    36 |  4.5  |

### code_mass

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 | 159.33 |    81 |   286 | 110.72 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  95.67 |    86 |   112 |  14.22 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 | 169    |   140 |   209 |  23.98 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 | 157    |   146 |   184 |  13.56 |

### cc_avg_loc_per_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   9.33 |     8 |    11 |  1.53 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  10.67 |     9 |    12 |  1.53 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   5.83 |     2 |     9 |  2.79 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7.17 |     2 |    13 |  3.66 |

### cc_longest_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  13.67 |    12 |    17 |  2.89 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  14    |    12 |    18 |  3.46 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |  15.17 |     8 |    23 |  6.21 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  16.83 |     2 |    25 |  7.99 |

### smell_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   8    |     2 |    17 |  7.94 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   5.33 |     1 |    11 |  5.13 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   2.5  |     2 |     3 |  0.55 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   3.17 |     2 |     5 |  1.47 |

### smell_complexity

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   3.33 |     1 |     7 |  3.21 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   1    |     0 |     2 |  1    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   1    |     0 |     3 |  1.55 |

### mccabe_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   8    |     4 |    16 |  6.93 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   8.67 |     6 |    11 |  2.52 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   4.5  |     2 |     6 |  1.52 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   6.33 |     3 |    11 |  2.66 |

### mccabe_avg

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   2.81 |  1.61 |  5.22 |  2.08 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   2.7  |  2.43 |  3.11 |  0.36 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   2.62 |  1.08 |  4.25 |  1.22 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   2.96 |  1.25 |  6    |  1.62 |

### cognitive_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  10.67 |     3 |    25 | 12.42 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  10.67 |     8 |    12 |  2.31 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   5.67 |     1 |    10 |  3.2  |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  10.17 |     2 |    21 |  7.11 |

### cognitive_avg

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   4.89 |  1.47 | 11.5  |  5.72 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   3.78 |  3.08 |  4.33 |  0.64 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   3.72 |  1    |  6.67 |  2.1  |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7.33 |  2    | 21    |  6.92 |

### cycle_count

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  35    |    19 |    45 | 14    |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   4    |     2 |     5 |  1.73 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   8.5  |     8 |     9 |  0.55 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7.67 |     6 |     8 |  0.82 |

### refactorings_applied

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  13.33 |     4 |    19 |  8.14 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   2.67 |     2 |     3 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   5.33 |     4 |     8 |  2.07 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7    |     4 |     8 |  1.67 |

### predictions_correct

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  21.33 |    15 |    25 |  5.51 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   6    |     4 |     8 |  2    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   5.83 |     5 |     7 |  0.75 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  15.17 |    12 |    16 |  1.6  |

### predictions_correct_rate (pooled %)

| kata                         | workflow                | model                |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |        64 |      64 |    100   |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |        18 |      18 |    100   |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |        35 |      36 |     97.2 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |        91 |      92 |     98.9 |

### tests_passed_immediately

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  17.33 |     6 |    28 | 11.02 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   1.33 |     0 |     2 |  1.15 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   5.17 |     1 |     7 |  2.14 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   0.67 |     0 |     4 |  1.63 |

### duration_seconds

| kata                         | workflow                | model                |   n |    mean |   min |   max |     std |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|------:|------:|--------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 | 2914.33 |  1720 |  3526 | 1034.42 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  684.33 |   607 |   822 |  119.53 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |  779.17 |   659 |  1059 |  152.03 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  349.5  |   329 |   377 |   16.56 |

### total_tokens

| kata                         | workflow                | model                |   n |        mean |      min |      max |              std |
|:-----------------------------|:------------------------|:---------------------|----:|------------:|---------:|---------:|-----------------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 | 1.35454e+07 |  9131179 | 16604812 |      3.91668e+06 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 | 1.55372e+07 | 12322036 | 21511782 |      5.17918e+06 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 | 2.6189e+06  |  2353934 |  3215887 | 326772           |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 | 8.84631e+06 |  7645056 | 10773096 |      1.12327e+06 |
