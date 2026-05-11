# RQ-7 — Aggregation

_Wirkt sich dedizierte Subagents-pro-Phase (v4) gegenüber Single-Context (v5) auf Code-Qualität und TDD-Disziplin aus, bei sonst identischem Phasen-Skript?_

Generated: 2026-05-10T17:19:22Z

Cells declared: 4 · matched runs: 18 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 6 | 6 | ✅ |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |       5 |       83 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |       6 |      100 |

### verification_pct

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |   0.72 |  0.27 |     1 |  0.38 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   1    |  1    |     1 |  0    |

### verification_passed

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |   10.8 |     4 |    15 |  5.76 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   15   |    15 |    15 |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |    0   |     0 |     0 |  0    |

### verification_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |      0 |     0 |     0 |     0 |

### cc_loc

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 | 146.8  |    39 |   275 | 97.78 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 | 213    |   188 |   246 | 29.82 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  31    |    25 |    35 |  5.29 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  29.67 |    24 |    36 |  4.5  |

### code_mass

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |  555.8 |   167 |   902 | 347.47 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  835   |   759 |   883 |  66.57 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  161   |   145 |   184 |  20.42 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  157   |   146 |   184 |  13.56 |

### cc_avg_loc_per_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |   5.89 |  4.48 |  8    |  1.3  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  10.07 |  9.15 | 11.77 |  1.47 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   5.38 |  3.4  |  6.75 |  1.76 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7.17 |  2    | 13    |  3.66 |

### cc_longest_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |  14.2  |    11 |    17 |  2.59 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  29    |    24 |    39 |  8.66 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  12    |    10 |    14 |  2    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  16.83 |     2 |    25 |  7.99 |

### smell_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |   0.6  |     0 |     2 |  0.89 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   5.33 |     1 |    11 |  5.13 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   2.33 |     2 |     3 |  0.58 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   3.17 |     2 |     5 |  1.47 |

### smell_complexity

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |    1   |     0 |     2 |  1    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |    1   |     0 |     3 |  1.55 |

### mccabe_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |   6.4  |     4 |    13 |  3.78 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   8.67 |     6 |    11 |  2.52 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   4.67 |     4 |     5 |  0.58 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   6.33 |     3 |    11 |  2.66 |

### mccabe_avg

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |   1.96 |  1.68 |  2.24 |  0.26 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   2.7  |  2.43 |  3.11 |  0.36 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   2.24 |  2    |  2.6  |  0.32 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   2.96 |  1.25 |  6    |  1.62 |

### cognitive_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |   6.6  |     5 |    10 |  2.3  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  10.67 |     8 |    12 |  2.31 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   4.67 |     3 |     7 |  2.08 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  10.17 |     2 |    21 |  7.11 |

### cognitive_avg

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |   2.19 |  1.82 |  2.75 |  0.35 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   3.78 |  3.08 |  4.33 |  0.64 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   3.5  |  2.5  |  5    |  1.32 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7.33 |  2    | 21    |  6.92 |

### cycle_count

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |  41.4  |    28 |    49 |  7.89 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   4    |     2 |     5 |  1.73 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   8    |     8 |     8 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7.67 |     6 |     8 |  0.82 |

### refactorings_applied

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |  18    |    14 |    25 |  4.3  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   2.67 |     2 |     3 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   6.33 |     3 |     8 |  2.89 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7    |     4 |     8 |  1.67 |

### predictions_correct

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |  51    |    35 |    65 | 11.85 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   6    |     4 |     8 |  2    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  14.67 |    14 |    16 |  1.15 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  15.17 |    12 |    16 |  1.6  |

### predictions_correct_rate (pooled %)

| kata                         | workflow                | model                |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |       255 |     261 |     97.7 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |        18 |      18 |    100   |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |        44 |      44 |    100   |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |        91 |      92 |     98.9 |

### tests_passed_immediately

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |  21.4  |    12 |    27 |  6.11 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   1.33 |     0 |     2 |  1.15 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   1.67 |     0 |     5 |  2.89 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   0.67 |     0 |     4 |  1.63 |

### duration_seconds

| kata                         | workflow                | model                |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 | 4051.4  |  3402 |  4780 | 602.88 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  684.33 |   607 |   822 | 119.53 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 | 1195    |   849 |  1376 | 299.75 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  349.5  |   329 |   377 |  16.56 |

### total_tokens

| kata                         | workflow                | model                |   n |        mean |         min |         max |              std |
|:-----------------------------|:------------------------|:---------------------|----:|------------:|------------:|------------:|-----------------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 | 1.46412e+07 | 1.20828e+07 | 1.65481e+07 |      1.89817e+06 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 | 1.55372e+07 | 1.2322e+07  | 2.15118e+07 |      5.17918e+06 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 | 3.10337e+06 | 2.52134e+06 | 3.7761e+06  | 632284           |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 | 8.84631e+06 | 7.64506e+06 | 1.07731e+07 |      1.12327e+06 |
