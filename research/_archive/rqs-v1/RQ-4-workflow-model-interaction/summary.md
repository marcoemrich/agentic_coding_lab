# RQ-4 — Aggregation

_Profitieren schwächere Modelle stärker von strikteren Workflows als starke?_

Generated: 2026-05-10T17:19:21Z

Cells declared: 24 · matched runs: 71 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-prose | v1-oneshot | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-prose | v1-oneshot | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-prose | v1-oneshot | sonnet-4-6-no-thinking | 3 | 3 | ✅ |
| claim-office-prose | v1-oneshot | sonnet-4-6-no-thinking | 0 | 0 | ❌ keine Runs |
| game-of-life-prose | v1-oneshot | haiku-4-5-no-thinking | 3 | 3 | ✅ |
| claim-office-prose | v1-oneshot | haiku-4-5-no-thinking | 0 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | sonnet-4-6-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v3-basic-tdd | sonnet-4-6-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | haiku-4-5-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v3-basic-tdd | haiku-4-5-no-thinking | 4 | 4 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking | 0 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5-no-thinking | 4 | 4 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | sonnet-4-6-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-no-thinking | 0 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v5-exact-single-context | haiku-4-5-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-no-thinking | 0 | 0 | ❌ keine Runs |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow                | model                  |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:-----------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   4 |       3 |       75 |
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |       3 |      100 |
| claim-office-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   4 |       3 |       75 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   6 |       5 |       83 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |       3 |      100 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |       6 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | haiku-4-5-no-thinking  |   3 |       2 |       67 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |       6 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | sonnet-4-6-no-thinking |   3 |       3 |      100 |
| game-of-life-prose           | v1-oneshot              | haiku-4-5-no-thinking  |   3 |       3 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |       6 |      100 |
| game-of-life-prose           | v1-oneshot              | sonnet-4-6-no-thinking |   3 |       3 |      100 |

### verification_pct

| kata                         | workflow                | model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   4 |   0.65 |  0    |  1    |  0.44 |
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |   1    |  1    |  1    |  0    |
| claim-office-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |   0.96 |  0.87 |  1    |  0.08 |
| claim-office-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   4 |   0    |  0    |  0    |  0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   5 |   0.72 |  0.27 |  1    |  0.38 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |   1    |  1    |  1    |  0    |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |   0.22 |  0.2  |  0.27 |  0.04 |

### verification_passed

| kata                         | workflow                | model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   4 |   9.75 |     0 |    15 |  6.65 |
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |  15    |    15 |    15 |  0    |
| claim-office-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |  14.33 |    13 |    15 |  1.15 |
| claim-office-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   4 |   0    |     0 |     0 |  0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   5 |  10.8  |     4 |    15 |  5.76 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |  15    |    15 |    15 |  0    |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |   3.33 |     3 |     4 |  0.58 |
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   3 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   3 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6-no-thinking |   3 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | haiku-4-5-no-thinking  |   3 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | sonnet-4-6-no-thinking |   3 |   0    |     0 |     0 |  0    |
| game-of-life-prose           | v1-oneshot              | haiku-4-5-no-thinking  |   3 |   0    |     0 |     0 |  0    |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |   0    |     0 |     0 |  0    |
| game-of-life-prose           | v1-oneshot              | sonnet-4-6-no-thinking |   3 |   0    |     0 |     0 |  0    |

### verification_total

| kata                         | workflow                | model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   4 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   4 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   3 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   3 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6-no-thinking |   3 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v5-exact-single-context | haiku-4-5-no-thinking  |   3 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v5-exact-single-context | sonnet-4-6-no-thinking |   3 |      0 |     0 |     0 |     0 |
| game-of-life-prose           | v1-oneshot              | haiku-4-5-no-thinking  |   3 |      0 |     0 |     0 |     0 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |      0 |     0 |     0 |     0 |
| game-of-life-prose           | v1-oneshot              | sonnet-4-6-no-thinking |   3 |      0 |     0 |     0 |     0 |

### code_mass

| kata                         | workflow                | model                  |   n |    mean |   min |   max |     std |
|:-----------------------------|:------------------------|:-----------------------|----:|--------:|------:|------:|--------:|
| claim-office-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   4 | 1890    |   968 |  3727 | 1296.17 |
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 | 1000.33 |   933 |  1058 |   63.06 |
| claim-office-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 | 1093    |   935 |  1231 |  149.01 |
| claim-office-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   4 |  430.75 |   158 |   598 |  194.64 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   5 |  555.8  |   167 |   902 |  347.47 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |  835    |   759 |   883 |   66.57 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |  830    |   785 |   861 |   39.89 |
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   3 |  294.33 |   278 |   307 |   14.84 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |  156.83 |   139 |   185 |   20.11 |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |  128    |   116 |   141 |   12.53 |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   3 |  330    |   230 |   474 |  127.81 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |  161    |   145 |   184 |   20.42 |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6-no-thinking |   3 |  188.67 |   120 |   324 |  117.21 |
| game-of-life-example-mapping | v5-exact-single-context | haiku-4-5-no-thinking  |   3 |  134.33 |     0 |   260 |  130.22 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |  157    |   146 |   184 |   13.56 |
| game-of-life-example-mapping | v5-exact-single-context | sonnet-4-6-no-thinking |   3 |  148.67 |   125 |   184 |   31.18 |
| game-of-life-prose           | v1-oneshot              | haiku-4-5-no-thinking  |   3 |  236.67 |   198 |   296 |   52.17 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |  164.17 |   157 |   175 |    7    |
| game-of-life-prose           | v1-oneshot              | sonnet-4-6-no-thinking |   3 |  134.67 |   118 |   162 |   23.86 |

### smell_total

| kata                         | workflow                | model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   4 |  38.25 |     0 |   128 | 60.12 |
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |  19.33 |    17 |    21 |  2.08 |
| claim-office-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |  22.33 |    14 |    34 | 10.41 |
| claim-office-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   4 |   9.75 |     5 |    17 |  5.25 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   5 |   0.6  |     0 |     2 |  0.89 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |   5.33 |     1 |    11 |  5.13 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |  16.33 |    12 |    19 |  3.79 |
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   3 |   5.33 |     4 |     7 |  1.53 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |   4.33 |     2 |     5 |  1.21 |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |   4    |     2 |     5 |  1.73 |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   3 |   4.67 |     2 |     8 |  3.06 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |   2.33 |     2 |     3 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6-no-thinking |   3 |   5.67 |     3 |    10 |  3.79 |
| game-of-life-example-mapping | v5-exact-single-context | haiku-4-5-no-thinking  |   3 |   5.67 |     0 |    12 |  6.03 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |   3.17 |     2 |     5 |  1.47 |
| game-of-life-example-mapping | v5-exact-single-context | sonnet-4-6-no-thinking |   3 |   4    |     3 |     6 |  1.73 |
| game-of-life-prose           | v1-oneshot              | haiku-4-5-no-thinking  |   3 |   6    |     4 |     8 |  2    |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |   3.67 |     2 |     6 |  1.51 |
| game-of-life-prose           | v1-oneshot              | sonnet-4-6-no-thinking |   3 |   2.67 |     2 |     4 |  1.15 |

### cc_longest_function

| kata                         | workflow                | model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   4 |  51    |     2 |    80 | 34.22 |
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |  53.67 |    34 |    72 | 19.04 |
| claim-office-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |  75.33 |    51 |    88 | 21.08 |
| claim-office-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   4 |  18    |     7 |    23 |  7.44 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   5 |  14.2  |    11 |    17 |  2.59 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |  29    |    24 |    39 |  8.66 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |  38.67 |    37 |    40 |  1.53 |
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   3 |  18.33 |     0 |    55 | 31.75 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |  29.83 |    24 |    44 |  8.28 |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |  25.33 |    21 |    29 |  4.04 |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   3 |  19.67 |    12 |    26 |  7.09 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |  12    |    10 |    14 |  2    |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6-no-thinking |   3 |  12.67 |    10 |    14 |  2.31 |
| game-of-life-example-mapping | v5-exact-single-context | haiku-4-5-no-thinking  |   3 |   6.33 |     0 |    10 |  5.51 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |  16.83 |     2 |    25 |  7.99 |
| game-of-life-example-mapping | v5-exact-single-context | sonnet-4-6-no-thinking |   3 |  14.33 |     7 |    19 |  6.43 |
| game-of-life-prose           | v1-oneshot              | haiku-4-5-no-thinking  |   3 |  41.67 |    33 |    49 |  8.08 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |  26.83 |    21 |    31 |  3.6  |
| game-of-life-prose           | v1-oneshot              | sonnet-4-6-no-thinking |   3 |  21    |    20 |    22 |  1    |

### mccabe_max

| kata                         | workflow                | model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   4 |  11    |     0 |    17 |  7.79 |
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |  12.67 |     8 |    16 |  4.16 |
| claim-office-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |  16    |    12 |    18 |  3.46 |
| claim-office-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   4 |   6    |     2 |     8 |  2.71 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   5 |   6.4  |     4 |    13 |  3.78 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |   8.67 |     6 |    11 |  2.52 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |   7    |     5 |     8 |  1.73 |
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   3 |  11    |     7 |    16 |  4.58 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |  11.83 |     8 |    15 |  2.48 |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |   9.67 |     8 |    11 |  1.53 |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   3 |   5.67 |     4 |     7 |  1.53 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |   4.67 |     4 |     5 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6-no-thinking |   3 |   9    |     7 |    10 |  1.73 |
| game-of-life-example-mapping | v5-exact-single-context | haiku-4-5-no-thinking  |   3 |   4.67 |     0 |     9 |  4.51 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |   6.33 |     3 |    11 |  2.66 |
| game-of-life-example-mapping | v5-exact-single-context | sonnet-4-6-no-thinking |   3 |   5.33 |     3 |     8 |  2.52 |
| game-of-life-prose           | v1-oneshot              | haiku-4-5-no-thinking  |   3 |  12.67 |     9 |    17 |  4.04 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |  11.17 |     8 |    14 |  2.23 |
| game-of-life-prose           | v1-oneshot              | sonnet-4-6-no-thinking |   3 |   9    |     8 |    11 |  1.73 |

### cognitive_max

| kata                         | workflow                | model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   4 |  17.75 |     0 |    25 | 11.9  |
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |  17.33 |    12 |    22 |  5.03 |
| claim-office-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |  17.67 |    13 |    20 |  4.04 |
| claim-office-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   4 |   4.25 |     1 |     6 |  2.36 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   5 |   6.6  |     5 |    10 |  2.3  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |  10.67 |     8 |    12 |  2.31 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |  10.67 |     9 |    12 |  1.53 |
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   3 |  18    |    10 |    33 | 13    |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |  16.67 |     9 |    21 |  4.08 |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |  10.67 |     9 |    12 |  1.53 |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   3 |   5.33 |     3 |     7 |  2.08 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |   4.67 |     3 |     7 |  2.08 |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6-no-thinking |   3 |  15    |    11 |    23 |  6.93 |
| game-of-life-example-mapping | v5-exact-single-context | haiku-4-5-no-thinking  |   3 |   6    |     0 |    13 |  6.56 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |  10.17 |     2 |    21 |  7.11 |
| game-of-life-example-mapping | v5-exact-single-context | sonnet-4-6-no-thinking |   3 |   8.33 |     2 |    16 |  7.09 |
| game-of-life-prose           | v1-oneshot              | haiku-4-5-no-thinking  |   3 |  20.67 |    15 |    29 |  7.37 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |  15.5  |     9 |    20 |  4.72 |
| game-of-life-prose           | v1-oneshot              | sonnet-4-6-no-thinking |   3 |  11.67 |     9 |    17 |  4.62 |

### completed_within_budget (rate %)

| kata                         | workflow                | model                  |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:-----------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   4 |       4 |      100 |
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |       3 |      100 |
| claim-office-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   4 |       4 |      100 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   6 |       6 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |       3 |      100 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |       6 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | haiku-4-5-no-thinking  |   3 |       3 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |       6 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | sonnet-4-6-no-thinking |   3 |       3 |      100 |
| game-of-life-prose           | v1-oneshot              | haiku-4-5-no-thinking  |   3 |       3 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |       6 |      100 |
| game-of-life-prose           | v1-oneshot              | sonnet-4-6-no-thinking |   3 |       3 |      100 |
