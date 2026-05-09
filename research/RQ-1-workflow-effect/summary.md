# RQ-1 — Aggregation

_Wirkt der gewählte Workflow auf Code-Qualität, Korrektheit und TDD-Disziplin?_

Generated: 2026-05-09T08:17:40Z

Cells declared: 10 · matched runs: 45 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-prose | v1-oneshot | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-prose | v1-oneshot | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-prose | v2-iterative | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-prose | v2-iterative | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 3 | 3 | ✅ |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |       6 |      100 |

### verification_pct

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   1    |  1    |  1    |  0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   0.98 |  0.93 |  1    |  0.04 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   1    |  1    |  1    |  0    |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   0.22 |  0.2  |  0.27 |  0.04 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   0.27 |  0.27 |  0.27 |  0    |

### verification_passed

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  15    |    15 |    15 |  0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  14.67 |    14 |    15 |  0.58 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  15    |    15 |    15 |  0    |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   3.33 |     3 |     4 |  0.58 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   4    |     4 |     4 |  0    |

### verification_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |

### cc_loc

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  87.33 |    78 |    97 |  9.5  |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  49.33 |    22 |   101 | 44.77 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  24.67 |    22 |    27 |  2.52 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  48.33 |    42 |    58 |  8.5  |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  47    |    43 |    49 |  3.46 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  29.83 |    24 |    38 |  5.81 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |  31.33 |    25 |    39 |  4.59 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  29.67 |    24 |    36 |  4.5  |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  35.83 |    31 |    44 |  5.15 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  34.83 |    31 |    39 |  2.86 |

### code_mass

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 | 309    |   276 |   328 |  28.69 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 | 159.33 |    81 |   286 | 110.72 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  95.67 |    86 |   112 |  14.22 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 | 144.33 |   116 |   178 |  31.34 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 | 150    |   135 |   160 |  13.23 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 | 156.83 |   139 |   185 |  20.11 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 | 169    |   140 |   209 |  23.98 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 | 157    |   146 |   184 |  13.56 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 | 164.17 |   157 |   175 |   7    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 | 163    |   144 |   175 |  11.47 |

### cc_avg_loc_per_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   9.67 |     4 |    17 |  6.66 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   9.33 |     8 |    11 |  1.53 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  10.67 |     9 |    12 |  1.53 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  20    |     8 |    37 | 15.13 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  12    |     7 |    18 |  5.57 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  13.17 |    10 |    16 |  1.94 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   5.83 |     2 |     9 |  2.79 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7.17 |     2 |    13 |  3.66 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  10.33 |     8 |    12 |  1.37 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  13.17 |    10 |    22 |  4.45 |

### cc_longest_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  19.33 |    10 |    34 | 12.86 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  13.67 |    12 |    17 |  2.89 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  14    |    12 |    18 |  3.46 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  31    |    24 |    37 |  6.56 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  20.67 |    15 |    25 |  5.13 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  29.83 |    24 |    44 |  8.28 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |  15.17 |     8 |    23 |  6.21 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  16.83 |     2 |    25 |  7.99 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  26.83 |    21 |    31 |  3.6  |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  31    |    25 |    41 |  5.62 |

### smell_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  19.33 |    17 |    21 |  2.08 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   8    |     2 |    17 |  7.94 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   5.33 |     1 |    11 |  5.13 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  16.33 |    12 |    19 |  3.79 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  17    |    16 |    18 |  1    |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   4.33 |     2 |     5 |  1.21 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   2.5  |     2 |     3 |  0.55 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   3.17 |     2 |     5 |  1.47 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   3.67 |     2 |     6 |  1.51 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   4.67 |     2 |     6 |  1.37 |

### smell_complexity

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   5    |     2 |     7 |  2.65 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   3.33 |     1 |     7 |  3.21 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   1    |     0 |     2 |  1    |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   1.67 |     0 |     3 |  1.53 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   1.67 |     1 |     2 |  0.58 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   1.67 |     0 |     2 |  0.82 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   1    |     0 |     3 |  1.55 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   1.33 |     0 |     2 |  1.03 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   1.17 |     0 |     2 |  0.75 |

### cycle_count

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   3.33 |     3 |     4 |  0.58 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  35    |    19 |    45 | 14    |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   4    |     2 |     5 |  1.73 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   1    |     1 |     1 |  0    |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   1    |     1 |     1 |  0    |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   1.33 |     1 |     2 |  0.52 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   8.5  |     8 |     9 |  0.55 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7.67 |     6 |     8 |  0.82 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   1    |     1 |     1 |  0    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   1    |     1 |     1 |  0    |

### refactorings_applied

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   2    |     2 |     2 |  0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  13.33 |     4 |    19 |  8.14 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   2.67 |     2 |     3 |  0.58 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   0    |     0 |     0 |  0    |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   0.33 |     0 |     1 |  0.58 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   5.33 |     4 |     8 |  2.07 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7    |     4 |     8 |  1.67 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |

### predictions_correct

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   0    |     0 |     0 |  0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  21.33 |    15 |    25 |  5.51 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   6    |     4 |     8 |  2    |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   5.67 |     5 |     7 |  0.82 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  15.17 |    12 |    16 |  1.6  |

### predictions_correct_rate (pooled %)

| kata                         | workflow                | model                |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |        64 |      64 |    100   |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |        18 |      18 |    100   |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |        34 |      35 |     97.1 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |        91 |      92 |     98.9 |

### tests_passed_immediately

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   0.33 |     0 |     1 |  0.58 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  17.33 |     6 |    28 | 11.02 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   1.33 |     0 |     2 |  1.15 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   0.67 |     0 |     1 |  0.58 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   0.67 |     0 |     1 |  0.58 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   0.33 |     0 |     1 |  0.52 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   5.17 |     1 |     7 |  2.14 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   0.67 |     0 |     4 |  1.63 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   0.83 |     0 |     1 |  0.41 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   0.17 |     0 |     1 |  0.41 |

### duration_seconds

| kata                         | workflow                | model                |   n |    mean |   min |   max |     std |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|------:|------:|--------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  301.33 |   257 |   356 |   50.3  |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 | 2914.33 |  1720 |  3526 | 1034.42 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  684.33 |   607 |   822 |  119.53 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  227.33 |   220 |   239 |   10.21 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  190.67 |   190 |   192 |    1.15 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   56.5  |    45 |    83 |   14.27 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |  779.17 |   659 |  1059 |  152.03 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  349.5  |   329 |   377 |   16.56 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   50    |    45 |    56 |    4.2  |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   52.17 |    43 |    59 |    6.97 |

### completed_within_budget (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |       6 |      100 |
