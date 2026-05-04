# RQ-4 — Aggregation

_Profitieren schwächere Modelle stärker von strikteren Workflows als starke?_

Generated: 2026-05-04T07:56:45Z

Cells declared: 12 · matched runs: 48 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | status |
|---|---|---|---:|---|
| game-of-life-prose | v1-oneshot | opus-4-7-no-thinking | 6 | ✅ |
| game-of-life-prose | v1-oneshot | sonnet-4-6 | 3 | ✅ |
| game-of-life-prose | v1-oneshot | haiku-4-5 | 3 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 6 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | sonnet-4-6 | 3 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | haiku-4-5 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 6 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5 | 3 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 6 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | sonnet-4-6 | 3 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | haiku-4-5 | 3 | ✅ |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5            |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6           |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5            |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6           |   3 |       3 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | haiku-4-5            |   3 |       2 |       67 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | sonnet-4-6           |   3 |       3 |      100 |
| game-of-life-prose           | v1-oneshot              | haiku-4-5            |   3 |       3 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v1-oneshot              | sonnet-4-6           |   3 |       3 |      100 |

### code_mass

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5            |   3 | 220.33 |   184 |   255 |  35.53 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 | 156.83 |   139 |   185 |  20.11 |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6           |   3 | 136.67 |   127 |   142 |   8.39 |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5            |   3 | 272.67 |   253 |   305 |  28.22 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 | 169    |   140 |   209 |  23.98 |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6           |   3 | 210    |   158 |   293 |  72.64 |
| game-of-life-example-mapping | v5-exact-single-context | haiku-4-5            |   3 | 143.33 |     0 |   264 | 133.45 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 | 157    |   146 |   184 |  13.56 |
| game-of-life-example-mapping | v5-exact-single-context | sonnet-4-6           |   3 | 172.33 |   143 |   191 |  25.72 |
| game-of-life-prose           | v1-oneshot              | haiku-4-5            |   3 | 232.67 |   224 |   242 |   9.02 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 | 164.17 |   157 |   175 |   7    |
| game-of-life-prose           | v1-oneshot              | sonnet-4-6           |   3 | 126.33 |   124 |   131 |   4.04 |

### smell_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5            |   3 |   4.33 |     3 |     6 |  1.53 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   4.33 |     2 |     5 |  1.21 |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6           |   3 |   4.67 |     4 |     6 |  1.15 |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5            |   3 |   5.33 |     5 |     6 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   2.5  |     2 |     3 |  0.55 |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6           |   3 |   4.67 |     3 |     6 |  1.53 |
| game-of-life-example-mapping | v5-exact-single-context | haiku-4-5            |   3 |   5.67 |     0 |    13 |  6.66 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   3.17 |     2 |     5 |  1.47 |
| game-of-life-example-mapping | v5-exact-single-context | sonnet-4-6           |   3 |   4.33 |     3 |     6 |  1.53 |
| game-of-life-prose           | v1-oneshot              | haiku-4-5            |   3 |   4.67 |     4 |     6 |  1.15 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   3.67 |     2 |     6 |  1.51 |
| game-of-life-prose           | v1-oneshot              | sonnet-4-6           |   3 |   2.67 |     2 |     4 |  1.15 |

### cc_longest_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | haiku-4-5            |   3 |  44.67 |    37 |    57 | 10.79 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  29.83 |    24 |    44 |  8.28 |
| game-of-life-example-mapping | v3-basic-tdd            | sonnet-4-6           |   3 |  27    |    26 |    29 |  1.73 |
| game-of-life-example-mapping | v4-exact-subagents      | haiku-4-5            |   3 |  19.67 |     0 |    40 | 20.01 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |  15.17 |     8 |    23 |  6.21 |
| game-of-life-example-mapping | v4-exact-subagents      | sonnet-4-6           |   3 |  14    |    12 |    16 |  2    |
| game-of-life-example-mapping | v5-exact-single-context | haiku-4-5            |   3 |  14.67 |     0 |    32 | 16.17 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  16.83 |     2 |    25 |  7.99 |
| game-of-life-example-mapping | v5-exact-single-context | sonnet-4-6           |   3 |  19.33 |    14 |    23 |  4.73 |
| game-of-life-prose           | v1-oneshot              | haiku-4-5            |   3 |  27    |    12 |    35 | 13    |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  26.83 |    21 |    31 |  3.6  |
| game-of-life-prose           | v1-oneshot              | sonnet-4-6           |   3 |  21.33 |    20 |    24 |  2.31 |
