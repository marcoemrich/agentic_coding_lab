# RQ-7 — Aggregation

_Wirkt sich dedizierte Subagents-pro-Phase (v4) gegenüber Single-Context (v5) auf Code-Qualität und TDD-Disziplin aus, bei sonst identischem Phasen-Skript?_

Generated: 2026-05-10T13:01:34Z

Cells declared: 4 · matched runs: 14 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 2 | 2 | ⚠️ unter min_replicates (2/3) |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 6 | 6 | ✅ |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   2 |       0 |        0 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |       6 |      100 |

### verification_pct

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   0.78 |  0.33 |     1 |  0.38 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   1    |  1    |     1 |  0    |

### verification_passed

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  11.67 |     5 |    15 |   5.77 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  15    |    15 |    15 |   0    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   1 |   0    |     0 |     0 | nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |   0    |

### verification_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   1 |      0 |     0 |     0 |   nan |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |      0 |     0 |     0 |     0 |

### cc_loc

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 | 211.33 |   161 |   275 |  58.16 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 | 213    |   188 |   246 |  29.82 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   1 |  25    |    25 |    25 | nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  29.67 |    24 |    36 |   4.5  |

### code_mass

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |    796 |   617 |   902 | 155.89 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |    835 |   759 |   883 |  66.57 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   1 |    145 |   145 |   145 | nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |    157 |   146 |   184 |  13.56 |

### cc_avg_loc_per_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   5.16 |  4.48 |  5.61 |   0.6  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  10.07 |  9.15 | 11.77 |   1.47 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   1 |   6    |  6    |  6    | nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7.17 |  2    | 13    |   3.66 |

### cc_longest_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  14.33 |    12 |    16 |   2.08 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  29    |    24 |    39 |   8.66 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   1 |  14    |    14 |    14 | nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  16.83 |     2 |    25 |   7.99 |

### smell_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   1    |     0 |     2 |   1    |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   5.33 |     1 |    11 |   5.13 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   1 |   2    |     2 |     2 | nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   3.17 |     2 |     5 |   1.47 |

### smell_complexity

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   0.33 |     0 |     1 |   0.58 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   1    |     0 |     2 |   1    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   1 |   0    |     0 |     0 | nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   1    |     0 |     3 |   1.55 |

### mccabe_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   7.33 |     4 |    13 |   4.93 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   8.67 |     6 |    11 |   2.52 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   1 |   4    |     4 |     4 | nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   6.33 |     3 |    11 |   2.66 |

### mccabe_avg

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   1.79 |  1.68 |  1.97 |   0.16 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   2.7  |  2.43 |  3.11 |   0.36 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   1 |   2    |  2    |  2    | nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   2.96 |  1.25 |  6    |   1.62 |

### cognitive_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   7.67 |     5 |    10 |   2.52 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  10.67 |     8 |    12 |   2.31 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   1 |   3    |     3 |     3 | nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  10.17 |     2 |    21 |   7.11 |

### cognitive_avg

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   1.98 |  1.82 |  2.13 |   0.16 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   3.78 |  3.08 |  4.33 |   0.64 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   1 |   2.5  |  2.5  |  2.5  | nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7.33 |  2    | 21    |   6.92 |

### cycle_count

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  45.33 |    43 |    49 |   3.21 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   4    |     2 |     5 |   1.73 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   1 |   8    |     8 |     8 | nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7.67 |     6 |     8 |   0.82 |

### refactorings_applied

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  19.33 |    14 |    25 |   5.51 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   2.67 |     2 |     3 |   0.58 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   1 |   8    |     8 |     8 | nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7    |     4 |     8 |   1.67 |

### predictions_correct

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  58    |    49 |    65 |   8.19 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   6    |     4 |     8 |   2    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   1 |  14    |    14 |    14 | nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  15.17 |    12 |    16 |   1.6  |

### predictions_correct_rate (pooled %)

| kata                         | workflow                | model                |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |       174 |     177 |     98.3 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |        18 |      18 |    100   |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   1 |        14 |      14 |    100   |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |        91 |      92 |     98.9 |

### tests_passed_immediately

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  23    |    19 |    27 |   4    |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   1.33 |     0 |     2 |   1.15 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   1 |   0    |     0 |     0 | nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   0.67 |     0 |     4 |   1.63 |

### duration_seconds

| kata                         | workflow                | model                |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 | 4247    |  3402 |  4780 | 740.09 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  684.33 |   607 |   822 | 119.53 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   1 | 1360    |  1360 |  1360 | nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  349.5  |   329 |   377 |  16.56 |

### total_tokens

| kata                         | workflow                | model                |   n |        mean |         min |         max |           std |
|:-----------------------------|:------------------------|:---------------------|----:|------------:|------------:|------------:|--------------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 | 1.51804e+07 | 1.32112e+07 | 1.65481e+07 |   1.74788e+06 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 | 1.55372e+07 | 1.2322e+07  | 2.15118e+07 |   5.17918e+06 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   1 | 3.01266e+06 | 3.01266e+06 | 3.01266e+06 | nan           |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 | 8.84631e+06 | 7.64506e+06 | 1.07731e+07 |   1.12327e+06 |
