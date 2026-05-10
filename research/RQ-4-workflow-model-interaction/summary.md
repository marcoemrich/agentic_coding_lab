# RQ-4 — Aggregation

_Profitieren schwächere Modelle stärker von strikteren Workflows als starke?_

Generated: 2026-05-10T13:01:33Z

Cells declared: 24 · matched runs: 52 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-prose | v1-oneshot | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-prose | v1-oneshot | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-prose | v1-oneshot | sonnet-4-6-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-prose | v1-oneshot | sonnet-4-6-no-thinking | 0 | 0 | ❌ keine Runs |
| game-of-life-prose | v1-oneshot | haiku-4-5-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-prose | v1-oneshot | haiku-4-5-no-thinking | 0 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | sonnet-4-6-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v3-basic-tdd | sonnet-4-6-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | haiku-4-5-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v3-basic-tdd | haiku-4-5-no-thinking | 4 | 4 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 2 | 2 | ⚠️ unter min_replicates (2/3) |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking | 0 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5-no-thinking | 4 | 4 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | sonnet-4-6-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-no-thinking | 0 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v5-exact-single-context | haiku-4-5-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-no-thinking | 0 | 0 | ❌ keine Runs |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow                | model                  |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:-----------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   4 |       3 |       75 |
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |       3 |      100 |
| claim-office-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   4 |       3 |       75 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |       3 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |       3 |      100 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |       6 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |       0 |        0 |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   2 |       0 |        0 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |       6 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |       6 |      100 |

### verification_pct

| kata                         | workflow                | model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   4 |   0.65 |  0    |  1    |  0.44 |
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |   1    |  1    |  1    |  0    |
| claim-office-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |   0.96 |  0.87 |  1    |  0.08 |
| claim-office-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   4 |   0    |  0    |  0    |  0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |   0.78 |  0.33 |  1    |  0.38 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |   1    |  1    |  1    |  0    |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |   0.22 |  0.2  |  0.27 |  0.04 |

### verification_passed

| kata                         | workflow                | model                  |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:-----------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   4 |   9.75 |     0 |    15 |   6.65 |
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |  15    |    15 |    15 |   0    |
| claim-office-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |  14.33 |    13 |    15 |   1.15 |
| claim-office-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   4 |   0    |     0 |     0 |   0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |  11.67 |     5 |    15 |   5.77 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |  15    |    15 |    15 |   0    |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |   3.33 |     3 |     4 |   0.58 |
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   3 |   0    |     0 |     0 |   0    |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |   0    |     0 |     0 |   0    |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |   0    |     0 |     0 |   0    |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   3 |   0    |     0 |     0 |   0    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   1 |   0    |     0 |     0 | nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |   0    |     0 |     0 |   0    |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |   0    |     0 |     0 |   0    |

### verification_total

| kata                         | workflow                | model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   4 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   4 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   3 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   3 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   1 |      0 |     0 |     0 |   nan |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |      0 |     0 |     0 |     0 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |      0 |     0 |     0 |     0 |

### code_mass

| kata                         | workflow                | model                  |   n |    mean |   min |   max |     std |
|:-----------------------------|:------------------------|:-----------------------|----:|--------:|------:|------:|--------:|
| claim-office-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   4 | 1890    |   968 |  3727 | 1296.17 |
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 | 1000.33 |   933 |  1058 |   63.06 |
| claim-office-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 | 1093    |   935 |  1231 |  149.01 |
| claim-office-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   4 |  430.75 |   158 |   598 |  194.64 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |  796    |   617 |   902 |  155.89 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |  835    |   759 |   883 |   66.57 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |  830    |   785 |   861 |   39.89 |
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   3 |  294.33 |   278 |   307 |   14.84 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |  156.83 |   139 |   185 |   20.11 |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |  128    |   116 |   141 |   12.53 |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   3 |  330    |   230 |   474 |  127.81 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   1 |  145    |   145 |   145 |  nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |  157    |   146 |   184 |   13.56 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |  164.17 |   157 |   175 |    7    |

### smell_total

| kata                         | workflow                | model                  |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:-----------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   4 |  38.25 |     0 |   128 |  60.12 |
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |  19.33 |    17 |    21 |   2.08 |
| claim-office-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |  22.33 |    14 |    34 |  10.41 |
| claim-office-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   4 |   9.75 |     5 |    17 |   5.25 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |   1    |     0 |     2 |   1    |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |   5.33 |     1 |    11 |   5.13 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |  16.33 |    12 |    19 |   3.79 |
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   3 |   5.33 |     4 |     7 |   1.53 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |   4.33 |     2 |     5 |   1.21 |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |   4    |     2 |     5 |   1.73 |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   3 |   4.67 |     2 |     8 |   3.06 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   1 |   2    |     2 |     2 | nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |   3.17 |     2 |     5 |   1.47 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |   3.67 |     2 |     6 |   1.51 |

### cc_longest_function

| kata                         | workflow                | model                  |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:-----------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   4 |  51    |     2 |    80 |  34.22 |
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |  53.67 |    34 |    72 |  19.04 |
| claim-office-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |  75.33 |    51 |    88 |  21.08 |
| claim-office-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   4 |  18    |     7 |    23 |   7.44 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |  14.33 |    12 |    16 |   2.08 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |  29    |    24 |    39 |   8.66 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |  38.67 |    37 |    40 |   1.53 |
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   3 |  18.33 |     0 |    55 |  31.75 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |  29.83 |    24 |    44 |   8.28 |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |  25.33 |    21 |    29 |   4.04 |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   3 |  19.67 |    12 |    26 |   7.09 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   1 |  14    |    14 |    14 | nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |  16.83 |     2 |    25 |   7.99 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |  26.83 |    21 |    31 |   3.6  |

### mccabe_max

| kata                         | workflow                | model                  |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:-----------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   4 |  11    |     0 |    17 |   7.79 |
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |  12.67 |     8 |    16 |   4.16 |
| claim-office-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |  16    |    12 |    18 |   3.46 |
| claim-office-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   4 |   6    |     2 |     8 |   2.71 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |   7.33 |     4 |    13 |   4.93 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |   8.67 |     6 |    11 |   2.52 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |   7    |     5 |     8 |   1.73 |
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   3 |  11    |     7 |    16 |   4.58 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |  11.83 |     8 |    15 |   2.48 |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |   9.67 |     8 |    11 |   1.53 |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   3 |   5.67 |     4 |     7 |   1.53 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   1 |   4    |     4 |     4 | nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |   6.33 |     3 |    11 |   2.66 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |  11.17 |     8 |    14 |   2.23 |

### cognitive_max

| kata                         | workflow                | model                  |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:-----------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   4 |  17.75 |     0 |    25 |  11.9  |
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |  17.33 |    12 |    22 |   5.03 |
| claim-office-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |  17.67 |    13 |    20 |   4.04 |
| claim-office-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   4 |   4.25 |     1 |     6 |   2.36 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |   7.67 |     5 |    10 |   2.52 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |  10.67 |     8 |    12 |   2.31 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |  10.67 |     9 |    12 |   1.53 |
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   3 |  18    |    10 |    33 |  13    |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |  16.67 |     9 |    21 |   4.08 |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |  10.67 |     9 |    12 |   1.53 |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   3 |   5.33 |     3 |     7 |   2.08 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   1 |   3    |     3 |     3 | nan    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |  10.17 |     2 |    21 |   7.11 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |  15.5  |     9 |    20 |   4.72 |

### completed_within_budget (rate %)

| kata                         | workflow                | model                  |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:-----------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   4 |       4 |      100 |
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |       3 |      100 |
| claim-office-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   4 |       4 |      100 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |       3 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |       3 |      100 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5-no-thinking  |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |       6 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5-no-thinking  |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   2 |       2 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |       6 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |       6 |      100 |
