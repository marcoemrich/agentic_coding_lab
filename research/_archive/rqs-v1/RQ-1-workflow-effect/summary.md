# RQ-1 — Aggregation

_Wirkt der gewählte Workflow auf Code-Qualität, Korrektheit und TDD-Disziplin?_

Generated: 2026-05-10T17:19:20Z

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
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 3 | 3 | ✅ |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |       5 |       83 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |       6 |      100 |

### verification_pct

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   1    |  1    |  1    |  0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |   0.72 |  0.27 |  1    |  0.38 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   1    |  1    |  1    |  0    |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   0.22 |  0.2  |  0.27 |  0.04 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   0.27 |  0.27 |  0.27 |  0    |

### verification_passed

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  15    |    15 |    15 |  0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |  10.8  |     4 |    15 |  5.76 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  15    |    15 |    15 |  0    |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   3.33 |     3 |     4 |  0.58 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   4    |     4 |     4 |  0    |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |

### verification_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |      0 |     0 |     0 |     0 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |      0 |     0 |     0 |     0 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |      0 |     0 |     0 |     0 |

### cc_loc

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 | 322    |   315 |   330 |  7.55 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 | 146.8  |    39 |   275 | 97.78 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 | 213    |   188 |   246 | 29.82 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 | 276.67 |   263 |   288 | 12.66 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 | 272    |   265 |   280 |  7.55 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  29.83 |    24 |    38 |  5.81 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  31    |    25 |    35 |  5.29 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  29.67 |    24 |    36 |  4.5  |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  35.83 |    31 |    44 |  5.15 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  34.83 |    31 |    39 |  2.86 |

### code_mass

| kata                         | workflow                | model                |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 | 1000.33 |   933 |  1058 |  63.06 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |  555.8  |   167 |   902 | 347.47 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  835    |   759 |   883 |  66.57 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  830    |   785 |   861 |  39.89 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  809.33 |   796 |   824 |  14.05 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  156.83 |   139 |   185 |  20.11 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  161    |   145 |   184 |  20.42 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  157    |   146 |   184 |  13.56 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  164.17 |   157 |   175 |   7    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  163    |   144 |   175 |  11.47 |

### cc_avg_loc_per_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  13.74 | 11.24 | 16.57 |  2.68 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |   5.89 |  4.48 |  8    |  1.3  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  10.07 |  9.15 | 11.77 |  1.47 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  12.1  |  9.38 | 16.15 |  3.58 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  12.18 | 10.41 | 15.33 |  2.73 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  13.17 | 10    | 16    |  1.94 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   5.38 |  3.4  |  6.75 |  1.76 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7.17 |  2    | 13    |  3.66 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  10.33 |  8    | 12    |  1.37 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  13.17 | 10    | 22    |  4.45 |

### cc_longest_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  53.67 |    34 |    72 | 19.04 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |  14.2  |    11 |    17 |  2.59 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  29    |    24 |    39 |  8.66 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  38.67 |    37 |    40 |  1.53 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  37.33 |    36 |    39 |  1.53 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  29.83 |    24 |    44 |  8.28 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  12    |    10 |    14 |  2    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  16.83 |     2 |    25 |  7.99 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  26.83 |    21 |    31 |  3.6  |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  31    |    25 |    41 |  5.62 |

### smell_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  19.33 |    17 |    21 |  2.08 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |   0.6  |     0 |     2 |  0.89 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   5.33 |     1 |    11 |  5.13 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  16.33 |    12 |    19 |  3.79 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  17    |    16 |    18 |  1    |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   4.33 |     2 |     5 |  1.21 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   2.33 |     2 |     3 |  0.58 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   3.17 |     2 |     5 |  1.47 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   3.67 |     2 |     6 |  1.51 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   4.67 |     2 |     6 |  1.37 |

### smell_complexity

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   5    |     2 |     7 |  2.65 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |   0.2  |     0 |     1 |  0.45 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   1    |     0 |     2 |  1    |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   1.67 |     0 |     3 |  1.53 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   1.67 |     1 |     2 |  0.58 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   1.67 |     0 |     2 |  0.82 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   1    |     0 |     3 |  1.55 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   1.33 |     0 |     2 |  1.03 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   1.17 |     0 |     2 |  0.75 |

### mccabe_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  12.67 |     8 |    16 |  4.16 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |   6.4  |     4 |    13 |  3.78 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   8.67 |     6 |    11 |  2.52 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   7    |     5 |     8 |  1.73 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   7.33 |     5 |    10 |  2.52 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  11.83 |     8 |    15 |  2.48 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   4.67 |     4 |     5 |  0.58 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   6.33 |     3 |    11 |  2.66 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  11.17 |     8 |    14 |  2.23 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  11.67 |     9 |    14 |  1.97 |

### mccabe_avg

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   3.27 |  2.91 |  3.69 |  0.39 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |   1.96 |  1.68 |  2.24 |  0.26 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   2.7  |  2.43 |  3.11 |  0.36 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   2.25 |  2.21 |  2.3  |  0.05 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   2.31 |  2.09 |  2.72 |  0.36 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   4.75 |  3.33 |  6.5  |  1.19 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   2.24 |  2    |  2.6  |  0.32 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   2.96 |  1.25 |  6    |  1.62 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   4.21 |  2.6  |  5.33 |  0.93 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   4.83 |  3.67 |  6    |  0.86 |

### cognitive_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  17.33 |    12 |    22 |  5.03 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |   6.6  |     5 |    10 |  2.3  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  10.67 |     8 |    12 |  2.31 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  10.67 |     9 |    12 |  1.53 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  10.67 |     7 |    14 |  3.51 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  16.67 |     9 |    21 |  4.08 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   4.67 |     3 |     7 |  2.08 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  10.17 |     2 |    21 |  7.11 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  15.5  |     9 |    20 |  4.72 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  14.67 |    10 |    20 |  4.08 |

### cognitive_avg

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   6.14 |  5.73 |  6.7  |  0.5  |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |   2.19 |  1.82 |  2.75 |  0.35 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   3.78 |  3.08 |  4.33 |  0.64 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   3.65 |  3    |  4.5  |  0.77 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   3.76 |  3.5  |  4.11 |  0.31 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  16.67 |  9    | 21    |  4.08 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   3.5  |  2.5  |  5    |  1.32 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7.33 |  2    | 21    |  6.92 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  13.17 |  5    | 20    |  6.25 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  14.67 | 10    | 20    |  4.08 |

### cycle_count

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   3.33 |     3 |     4 |  0.58 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |  41.4  |    28 |    49 |  7.89 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   4    |     2 |     5 |  1.73 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   1    |     1 |     1 |  0    |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   1    |     1 |     1 |  0    |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   1.33 |     1 |     2 |  0.52 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   8    |     8 |     8 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7.67 |     6 |     8 |  0.82 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   1    |     1 |     1 |  0    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   1    |     1 |     1 |  0    |

### refactorings_applied

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   2    |     2 |     2 |  0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |  18    |    14 |    25 |  4.3  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   2.67 |     2 |     3 |  0.58 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   0    |     0 |     0 |  0    |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   0.33 |     0 |     1 |  0.58 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   6.33 |     3 |     8 |  2.89 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7    |     4 |     8 |  1.67 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |

### predictions_correct

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   0    |     0 |     0 |  0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |  51    |    35 |    65 | 11.85 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   6    |     4 |     8 |  2    |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
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
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   0.33 |     0 |     1 |  0.58 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |  21.4  |    12 |    27 |  6.11 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   1.33 |     0 |     2 |  1.15 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   0.67 |     0 |     1 |  0.58 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   0.67 |     0 |     1 |  0.58 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   0.33 |     0 |     1 |  0.52 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   1.67 |     0 |     5 |  2.89 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   0.67 |     0 |     4 |  1.63 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   0.83 |     0 |     1 |  0.41 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   0.17 |     0 |     1 |  0.41 |

### duration_seconds

| kata                         | workflow                | model                |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  301.33 |   257 |   356 |  50.3  |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 | 4051.4  |  3402 |  4780 | 602.88 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  684.33 |   607 |   822 | 119.53 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  227.33 |   220 |   239 |  10.21 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  190.67 |   190 |   192 |   1.15 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   56.5  |    45 |    83 |  14.27 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 | 1195    |   849 |  1376 | 299.75 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  349.5  |   329 |   377 |  16.56 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   50    |    45 |    56 |   4.2  |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   52.17 |    43 |    59 |   6.97 |

### completed_within_budget (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |       6 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |       6 |      100 |
