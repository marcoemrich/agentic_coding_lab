# RQ-5 — Aggregation

_Wie groß ist die Run-zu-Run-Varianz innerhalb identischer Zellen?_

Generated: 2026-05-09T09:36:28Z

Cells declared: 22 · matched runs: 71 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-prose | v1-oneshot | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-prose | v1-oneshot | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-prose | v2-iterative | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-prose | v2-iterative | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-prose | v3-basic-tdd | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-prose | v3-basic-tdd | opus-4-7-no-thinking | 0 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-user-story | v3-basic-tdd | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-user-story | v3-basic-tdd | opus-4-7-no-thinking | 0 | 0 | ❌ keine Runs |
| game-of-life-prose | v4-exact-subagents | opus-4-7-no-thinking | 4 | 4 | ✅ |
| claim-office-prose | v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-user-story | v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-user-story | v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-prose | v5-exact-single-context | opus-4-7-no-thinking | 4 | 4 | ✅ |
| claim-office-prose | v5-exact-single-context | opus-4-7-no-thinking | 0 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-user-story | v5-exact-single-context | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-user-story | v5-exact-single-context | opus-4-7-no-thinking | 0 | 0 | ❌ keine Runs |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-prose           | v4-exact-subagents      | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-user-story      | v4-exact-subagents      | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-prose           | v4-exact-subagents      | opus-4-7-no-thinking |   4 |       4 |      100 |
| game-of-life-prose           | v5-exact-single-context | opus-4-7-no-thinking |   4 |       4 |      100 |
| game-of-life-user-story      | v3-basic-tdd            | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-user-story      | v4-exact-subagents      | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-user-story      | v5-exact-single-context | opus-4-7-no-thinking |   3 |       3 |      100 |

### verification_pct

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   1    |  1    |  1    |  0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   0.98 |  0.93 |  1    |  0.04 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   1    |  1    |  1    |  0    |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   0.22 |  0.2  |  0.27 |  0.04 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   0.27 |  0.27 |  0.27 |  0    |
| claim-office-prose           | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   0.29 |  0.2  |  0.4  |  0.1  |
| claim-office-user-story      | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   0.31 |  0.13 |  0.47 |  0.17 |

### verification_passed

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  15    |    15 |    15 |  0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  14.67 |    14 |    15 |  0.58 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  15    |    15 |    15 |  0    |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   3.33 |     3 |     4 |  0.58 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   4    |     4 |     4 |  0    |
| claim-office-prose           | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   4.33 |     3 |     6 |  1.53 |
| claim-office-user-story      | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   4.67 |     2 |     7 |  2.52 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   0    |     0 |     0 |  0    |
| game-of-life-prose           | v4-exact-subagents      | opus-4-7-no-thinking |   4 |   0    |     0 |     0 |  0    |
| game-of-life-prose           | v5-exact-single-context | opus-4-7-no-thinking |   4 |   0    |     0 |     0 |  0    |
| game-of-life-user-story      | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   0    |     0 |     0 |  0    |
| game-of-life-user-story      | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   0    |     0 |     0 |  0    |
| game-of-life-user-story      | v5-exact-single-context | opus-4-7-no-thinking |   3 |   0    |     0 |     0 |  0    |

### verification_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v4-exact-subagents      | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-user-story      | v4-exact-subagents      | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |      0 |     0 |     0 |     0 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |      0 |     0 |     0 |     0 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |      0 |     0 |     0 |     0 |
| game-of-life-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   3 |      0 |     0 |     0 |     0 |
| game-of-life-prose           | v4-exact-subagents      | opus-4-7-no-thinking |   4 |      0 |     0 |     0 |     0 |
| game-of-life-prose           | v5-exact-single-context | opus-4-7-no-thinking |   4 |      0 |     0 |     0 |     0 |
| game-of-life-user-story      | v3-basic-tdd            | opus-4-7-no-thinking |   3 |      0 |     0 |     0 |     0 |
| game-of-life-user-story      | v4-exact-subagents      | opus-4-7-no-thinking |   3 |      0 |     0 |     0 |     0 |
| game-of-life-user-story      | v5-exact-single-context | opus-4-7-no-thinking |   3 |      0 |     0 |     0 |     0 |

### code_mass

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 | 309    |   276 |   328 |  28.69 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 | 159.33 |    81 |   286 | 110.72 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  95.67 |    86 |   112 |  14.22 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 | 144.33 |   116 |   178 |  31.34 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 | 150    |   135 |   160 |  13.23 |
| claim-office-prose           | v4-exact-subagents      | opus-4-7-no-thinking |   3 | 192.33 |    73 |   263 | 103.93 |
| claim-office-user-story      | v4-exact-subagents      | opus-4-7-no-thinking |   3 | 102.67 |    70 |   158 |  48.18 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 | 156.83 |   139 |   185 |  20.11 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 | 169    |   140 |   209 |  23.98 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 | 157    |   146 |   184 |  13.56 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 | 164.17 |   157 |   175 |   7    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 | 163    |   144 |   175 |  11.47 |
| game-of-life-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   3 | 161    |   148 |   177 |  14.73 |
| game-of-life-prose           | v4-exact-subagents      | opus-4-7-no-thinking |   4 | 168    |   153 |   197 |  19.97 |
| game-of-life-prose           | v5-exact-single-context | opus-4-7-no-thinking |   4 | 169    |   153 |   185 |  17.36 |
| game-of-life-user-story      | v3-basic-tdd            | opus-4-7-no-thinking |   3 | 154.67 |   142 |   175 |  17.79 |
| game-of-life-user-story      | v4-exact-subagents      | opus-4-7-no-thinking |   3 | 149    |   119 |   166 |  26.06 |
| game-of-life-user-story      | v5-exact-single-context | opus-4-7-no-thinking |   3 | 177.67 |   154 |   203 |  24.54 |

### smell_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  19.33 |    17 |    21 |  2.08 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   8    |     2 |    17 |  7.94 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   5.33 |     1 |    11 |  5.13 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  16.33 |    12 |    19 |  3.79 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  17    |    16 |    18 |  1    |
| claim-office-prose           | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   2.67 |     1 |     4 |  1.53 |
| claim-office-user-story      | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   5    |     1 |    11 |  5.29 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   4.33 |     2 |     5 |  1.21 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   2.5  |     2 |     3 |  0.55 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   3.17 |     2 |     5 |  1.47 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   3.67 |     2 |     6 |  1.51 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   4.67 |     2 |     6 |  1.37 |
| game-of-life-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   4.33 |     2 |     6 |  2.08 |
| game-of-life-prose           | v4-exact-subagents      | opus-4-7-no-thinking |   4 |   3    |     2 |     6 |  2    |
| game-of-life-prose           | v5-exact-single-context | opus-4-7-no-thinking |   4 |   3    |     2 |     5 |  1.41 |
| game-of-life-user-story      | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   4    |     2 |     6 |  2    |
| game-of-life-user-story      | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   2.33 |     2 |     3 |  0.58 |
| game-of-life-user-story      | v5-exact-single-context | opus-4-7-no-thinking |   3 |   2.67 |     2 |     3 |  0.58 |

### cc_longest_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  19.33 |    10 |    34 | 12.86 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  13.67 |    12 |    17 |  2.89 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  14    |    12 |    18 |  3.46 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  31    |    24 |    37 |  6.56 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  20.67 |    15 |    25 |  5.13 |
| claim-office-prose           | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  24.67 |     8 |    36 | 14.74 |
| claim-office-user-story      | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   9    |     7 |    13 |  3.46 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  29.83 |    24 |    44 |  8.28 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |  15.17 |     8 |    23 |  6.21 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  16.83 |     2 |    25 |  7.99 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  26.83 |    21 |    31 |  3.6  |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  31    |    25 |    41 |  5.62 |
| game-of-life-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  28.67 |    22 |    33 |  5.86 |
| game-of-life-prose           | v4-exact-subagents      | opus-4-7-no-thinking |   4 |  11.25 |     8 |    17 |  3.95 |
| game-of-life-prose           | v5-exact-single-context | opus-4-7-no-thinking |   4 |  17.75 |    10 |    29 |  8.38 |
| game-of-life-user-story      | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  26.33 |    21 |    31 |  5.03 |
| game-of-life-user-story      | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   8    |     2 |    11 |  5.2  |
| game-of-life-user-story      | v5-exact-single-context | opus-4-7-no-thinking |   3 |  13    |    10 |    17 |  3.61 |

### mccabe_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  12.67 |     8 |    16 |  4.16 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   8    |     4 |    16 |  6.93 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   8.67 |     6 |    11 |  2.52 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   7    |     5 |     8 |  1.73 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   7.33 |     5 |    10 |  2.52 |
| claim-office-prose           | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   4.33 |     3 |     6 |  1.53 |
| claim-office-user-story      | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   4.67 |     3 |     6 |  1.53 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  11.83 |     8 |    15 |  2.48 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   4.5  |     2 |     6 |  1.52 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   6.33 |     3 |    11 |  2.66 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  11.17 |     8 |    14 |  2.23 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  11.67 |     9 |    14 |  1.97 |
| game-of-life-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  11    |     8 |    14 |  3    |
| game-of-life-prose           | v4-exact-subagents      | opus-4-7-no-thinking |   4 |   4.75 |     3 |     7 |  1.71 |
| game-of-life-prose           | v5-exact-single-context | opus-4-7-no-thinking |   4 |   7    |     5 |    11 |  2.71 |
| game-of-life-user-story      | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  11    |     8 |    14 |  3    |
| game-of-life-user-story      | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   3.33 |     3 |     4 |  0.58 |
| game-of-life-user-story      | v5-exact-single-context | opus-4-7-no-thinking |   3 |   4    |     3 |     5 |  1    |

### cognitive_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  17.33 |    12 |    22 |  5.03 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  10.67 |     3 |    25 | 12.42 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  10.67 |     8 |    12 |  2.31 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  10.67 |     9 |    12 |  1.53 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  10.67 |     7 |    14 |  3.51 |
| claim-office-prose           | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   4    |     4 |     4 |  0    |
| claim-office-user-story      | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   4    |     2 |     6 |  2    |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  16.67 |     9 |    21 |  4.08 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   5.67 |     1 |    10 |  3.2  |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  10.17 |     2 |    21 |  7.11 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  15.5  |     9 |    20 |  4.72 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  14.67 |    10 |    20 |  4.08 |
| game-of-life-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  13.67 |     9 |    20 |  5.69 |
| game-of-life-prose           | v4-exact-subagents      | opus-4-7-no-thinking |   4 |   7.25 |     3 |    15 |  5.44 |
| game-of-life-prose           | v5-exact-single-context | opus-4-7-no-thinking |   4 |  10    |     5 |    21 |  7.39 |
| game-of-life-user-story      | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  14    |     9 |    20 |  5.57 |
| game-of-life-user-story      | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   3.33 |     3 |     4 |  0.58 |
| game-of-life-user-story      | v5-exact-single-context | opus-4-7-no-thinking |   3 |   5.33 |     3 |     7 |  2.08 |

### duration_seconds

| kata                         | workflow                | model                |   n |    mean |   min |   max |     std |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|------:|------:|--------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  301.33 |   257 |   356 |   50.3  |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 | 2914.33 |  1720 |  3526 | 1034.42 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  684.33 |   607 |   822 |  119.53 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  227.33 |   220 |   239 |   10.21 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  190.67 |   190 |   192 |    1.15 |
| claim-office-prose           | v4-exact-subagents      | opus-4-7-no-thinking |   3 | 2138.67 |  1879 |  2380 |  251    |
| claim-office-user-story      | v4-exact-subagents      | opus-4-7-no-thinking |   3 | 2928.67 |  2642 |  3284 |  326.46 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   56.5  |    45 |    83 |   14.27 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |  779.17 |   659 |  1059 |  152.03 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  349.5  |   329 |   377 |   16.56 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   50    |    45 |    56 |    4.2  |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   52.17 |    43 |    59 |    6.97 |
| game-of-life-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   47.33 |    44 |    51 |    3.51 |
| game-of-life-prose           | v4-exact-subagents      | opus-4-7-no-thinking |   4 |  802    |   533 |   995 |  197.74 |
| game-of-life-prose           | v5-exact-single-context | opus-4-7-no-thinking |   4 |  354.5  |   233 |   399 |   81.05 |
| game-of-life-user-story      | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   50.67 |    45 |    54 |    4.93 |
| game-of-life-user-story      | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  760.67 |   570 |   884 |  167.48 |
| game-of-life-user-story      | v5-exact-single-context | opus-4-7-no-thinking |   3 |  372    |   311 |   422 |   56.31 |
