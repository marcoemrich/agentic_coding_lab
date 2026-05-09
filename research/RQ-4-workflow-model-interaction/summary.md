# RQ-4 — Aggregation

_Profitieren schwächere Modelle stärker von strikteren Workflows als starke?_

Generated: 2026-05-09T09:36:28Z

Cells declared: 24 · matched runs: 39 · min_replicates: 3

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
| game-of-life-example-mapping | v3-basic-tdd | sonnet-4-6-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v3-basic-tdd | sonnet-4-6-no-thinking | 0 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v3-basic-tdd | haiku-4-5-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v3-basic-tdd | haiku-4-5-no-thinking | 0 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | sonnet-4-6-no-thinking | 0 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v4-exact-subagents | haiku-4-5-no-thinking | 0 | 0 | ❌ keine Runs |
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
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |       3 |      100 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |       3 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |       3 |      100 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |       6 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   6 |       6 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |       6 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |       6 |      100 |

### verification_pct

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   1    |  1    |  1    |  0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   0.98 |  0.93 |  1    |  0.04 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   1    |  1    |  1    |  0    |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   0.22 |  0.2  |  0.27 |  0.04 |

### verification_passed

| kata                         | workflow                | model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |  15    |    15 |    15 |  0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |  14.67 |    14 |    15 |  0.58 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |  15    |    15 |    15 |  0    |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |   3.33 |     3 |     4 |  0.58 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   6 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6-no-thinking |   3 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |   0    |     0 |     0 |  0    |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |   0    |     0 |     0 |  0    |

### verification_total

| kata                         | workflow                | model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   6 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6-no-thinking |   3 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |      0 |     0 |     0 |     0 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |      0 |     0 |     0 |     0 |

### code_mass

| kata                         | workflow                | model                  |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:-----------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 | 309    |   276 |   328 |  28.69 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 | 159.33 |    81 |   286 | 110.72 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |  95.67 |    86 |   112 |  14.22 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 | 144.33 |   116 |   178 |  31.34 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 | 156.83 |   139 |   185 |  20.11 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   6 | 169    |   140 |   209 |  23.98 |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6-no-thinking |   3 | 271.67 |   180 |   414 | 124.96 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 | 157    |   146 |   184 |  13.56 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 | 164.17 |   157 |   175 |   7    |

### smell_total

| kata                         | workflow                | model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |  19.33 |    17 |    21 |  2.08 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |   8    |     2 |    17 |  7.94 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |   5.33 |     1 |    11 |  5.13 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |  16.33 |    12 |    19 |  3.79 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |   4.33 |     2 |     5 |  1.21 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   6 |   2.5  |     2 |     3 |  0.55 |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6-no-thinking |   3 |   3    |     3 |     3 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |   3.17 |     2 |     5 |  1.47 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |   3.67 |     2 |     6 |  1.51 |

### cc_longest_function

| kata                         | workflow                | model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |  19.33 |    10 |    34 | 12.86 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |  13.67 |    12 |    17 |  2.89 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |  14    |    12 |    18 |  3.46 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |  31    |    24 |    37 |  6.56 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |  29.83 |    24 |    44 |  8.28 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   6 |  15.17 |     8 |    23 |  6.21 |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6-no-thinking |   3 |  19    |    10 |    26 |  8.19 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |  16.83 |     2 |    25 |  7.99 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |  26.83 |    21 |    31 |  3.6  |

### mccabe_max

| kata                         | workflow                | model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |  12.67 |     8 |    16 |  4.16 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |   8    |     4 |    16 |  6.93 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |   8.67 |     6 |    11 |  2.52 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |   7    |     5 |     8 |  1.73 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |  11.83 |     8 |    15 |  2.48 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   6 |   4.5  |     2 |     6 |  1.52 |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6-no-thinking |   3 |   6    |     5 |     7 |  1    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |   6.33 |     3 |    11 |  2.66 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |  11.17 |     8 |    14 |  2.23 |

### cognitive_max

| kata                         | workflow                | model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |  17.33 |    12 |    22 |  5.03 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |  10.67 |     3 |    25 | 12.42 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |  10.67 |     8 |    12 |  2.31 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |  10.67 |     9 |    12 |  1.53 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |  16.67 |     9 |    21 |  4.08 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   6 |   5.67 |     1 |    10 |  3.2  |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6-no-thinking |   3 |   8    |     7 |     9 |  1    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |  10.17 |     2 |    21 |  7.11 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |  15.5  |     9 |    20 |  4.72 |

### completed_within_budget (rate %)

| kata                         | workflow                | model                  |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:-----------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   3 |       3 |      100 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   3 |       3 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   3 |       3 |      100 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking   |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking   |   6 |       6 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking   |   6 |       6 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking   |   6 |       6 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking   |   6 |       6 |      100 |
