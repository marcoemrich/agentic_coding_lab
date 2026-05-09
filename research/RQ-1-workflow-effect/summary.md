# RQ-1 — Aggregation

_Wirkt der gewählte Workflow auf Code-Qualität, Korrektheit und TDD-Disziplin?_

Generated: 2026-05-09T13:58:36Z

Cells declared: 10 · matched runs: 36 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-prose | v1-oneshot | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-prose | v1-oneshot | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-prose | v2-iterative | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-prose | v2-iterative | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 0 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 3 | 3 | ✅ |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |       6 |      100 |

### verification_pct

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   1    |  1    |  1    |  0    |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   1    |  1    |  1    |  0    |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   0.22 |  0.2  |  0.27 |  0.04 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   0.27 |  0.27 |  0.27 |  0    |

### verification_passed

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  15    |    15 |    15 |  0    |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  15    |    15 |    15 |  0    |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   3.33 |     3 |     4 |  0.58 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   4    |     4 |     4 |  0    |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |

### verification_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |      0 |     0 |     0 |     0 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |      0 |     0 |     0 |     0 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |      0 |     0 |     0 |     0 |

### cc_loc

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  87.33 |    78 |    97 |  9.5  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  24.67 |    22 |    27 |  2.52 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  48.33 |    42 |    58 |  8.5  |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  47    |    43 |    49 |  3.46 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  29.83 |    24 |    38 |  5.81 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  29.67 |    24 |    36 |  4.5  |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  35.83 |    31 |    44 |  5.15 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  34.83 |    31 |    39 |  2.86 |

### code_mass

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 | 309    |   276 |   328 | 28.69 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  95.67 |    86 |   112 | 14.22 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 | 144.33 |   116 |   178 | 31.34 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 | 150    |   135 |   160 | 13.23 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 | 156.83 |   139 |   185 | 20.11 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 | 157    |   146 |   184 | 13.56 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 | 164.17 |   157 |   175 |  7    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 | 163    |   144 |   175 | 11.47 |

### cc_avg_loc_per_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   9.67 |     4 |    17 |  6.66 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  10.67 |     9 |    12 |  1.53 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  20    |     8 |    37 | 15.13 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  12    |     7 |    18 |  5.57 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  13.17 |    10 |    16 |  1.94 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7.17 |     2 |    13 |  3.66 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  10.33 |     8 |    12 |  1.37 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  13.17 |    10 |    22 |  4.45 |

### cc_longest_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  19.33 |    10 |    34 | 12.86 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  14    |    12 |    18 |  3.46 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  31    |    24 |    37 |  6.56 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  20.67 |    15 |    25 |  5.13 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  29.83 |    24 |    44 |  8.28 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  16.83 |     2 |    25 |  7.99 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  26.83 |    21 |    31 |  3.6  |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  31    |    25 |    41 |  5.62 |

### smell_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  19.33 |    17 |    21 |  2.08 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   5.33 |     1 |    11 |  5.13 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  16.33 |    12 |    19 |  3.79 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  17    |    16 |    18 |  1    |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   4.33 |     2 |     5 |  1.21 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   3.17 |     2 |     5 |  1.47 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   3.67 |     2 |     6 |  1.51 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   4.67 |     2 |     6 |  1.37 |

### smell_complexity

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   5    |     2 |     7 |  2.65 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   1    |     0 |     2 |  1    |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   1.67 |     0 |     3 |  1.53 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   1.67 |     1 |     2 |  0.58 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   1.67 |     0 |     2 |  0.82 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   1    |     0 |     3 |  1.55 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   1.33 |     0 |     2 |  1.03 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   1.17 |     0 |     2 |  0.75 |

### mccabe_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  12.67 |     8 |    16 |  4.16 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   8.67 |     6 |    11 |  2.52 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   7    |     5 |     8 |  1.73 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   7.33 |     5 |    10 |  2.52 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  11.83 |     8 |    15 |  2.48 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   6.33 |     3 |    11 |  2.66 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  11.17 |     8 |    14 |  2.23 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  11.67 |     9 |    14 |  1.97 |

### mccabe_avg

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   3.27 |  2.91 |  3.69 |  0.39 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   2.7  |  2.43 |  3.11 |  0.36 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   2.25 |  2.21 |  2.3  |  0.05 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   2.31 |  2.09 |  2.72 |  0.36 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   4.75 |  3.33 |  6.5  |  1.19 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   2.96 |  1.25 |  6    |  1.62 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   4.21 |  2.6  |  5.33 |  0.93 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   4.83 |  3.67 |  6    |  0.86 |

### cognitive_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  17.33 |    12 |    22 |  5.03 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  10.67 |     8 |    12 |  2.31 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  10.67 |     9 |    12 |  1.53 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  10.67 |     7 |    14 |  3.51 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  16.67 |     9 |    21 |  4.08 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  10.17 |     2 |    21 |  7.11 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  15.5  |     9 |    20 |  4.72 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  14.67 |    10 |    20 |  4.08 |

### cognitive_avg

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   6.14 |  5.73 |  6.7  |  0.5  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   3.78 |  3.08 |  4.33 |  0.64 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   3.65 |  3    |  4.5  |  0.77 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   3.76 |  3.5  |  4.11 |  0.31 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  16.67 |  9    | 21    |  4.08 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7.33 |  2    | 21    |  6.92 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  13.17 |  5    | 20    |  6.25 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  14.67 | 10    | 20    |  4.08 |

### cycle_count

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   3.33 |     3 |     4 |  0.58 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   4    |     2 |     5 |  1.73 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   1    |     1 |     1 |  0    |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   1    |     1 |     1 |  0    |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   1.33 |     1 |     2 |  0.52 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7.67 |     6 |     8 |  0.82 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   1    |     1 |     1 |  0    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   1    |     1 |     1 |  0    |

### refactorings_applied

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   2    |     2 |     2 |  0    |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   2.67 |     2 |     3 |  0.58 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   0    |     0 |     0 |  0    |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   0.33 |     0 |     1 |  0.58 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7    |     4 |     8 |  1.67 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |

### predictions_correct

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   0    |     0 |     0 |   0   |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   6    |     4 |     8 |   2   |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |   0   |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  15.17 |    12 |    16 |   1.6 |

### predictions_correct_rate (pooled %)

| kata                         | workflow                | model                |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |        18 |      18 |    100   |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |        91 |      92 |     98.9 |

### tests_passed_immediately

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   0.33 |     0 |     1 |  0.58 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   1.33 |     0 |     2 |  1.15 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   0.67 |     0 |     1 |  0.58 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   0.67 |     0 |     1 |  0.58 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   0.33 |     0 |     1 |  0.52 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   0.67 |     0 |     4 |  1.63 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   0.83 |     0 |     1 |  0.41 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   0.17 |     0 |     1 |  0.41 |

### duration_seconds

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 | 301.33 |   257 |   356 |  50.3  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 | 684.33 |   607 |   822 | 119.53 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 | 227.33 |   220 |   239 |  10.21 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 | 190.67 |   190 |   192 |   1.15 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  56.5  |    45 |    83 |  14.27 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 | 349.5  |   329 |   377 |  16.56 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  50    |    45 |    56 |   4.2  |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  52.17 |    43 |    59 |   6.97 |

### completed_within_budget (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |       6 |      100 |
