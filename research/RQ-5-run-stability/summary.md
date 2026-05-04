# RQ-5 — Aggregation

_Wie groß ist die Run-zu-Run-Varianz innerhalb identischer Zellen?_

Generated: 2026-05-03T23:54:58Z

Cells declared: 11 · matched runs: 50 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | status |
|---|---|---|---:|---|
| game-of-life-prose | v1-oneshot | opus-4-7-no-thinking | 6 | ✅ |
| game-of-life-prose | v2-iterative | opus-4-7-no-thinking | 6 | ✅ |
| game-of-life-prose | v3-basic-tdd | opus-4-7-no-thinking | 3 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 6 | ✅ |
| game-of-life-user-story | v3-basic-tdd | opus-4-7-no-thinking | 3 | ✅ |
| game-of-life-prose | v4-exact-subagents | opus-4-7-no-thinking | 4 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 6 | ✅ |
| game-of-life-user-story | v4-exact-subagents | opus-4-7-no-thinking | 3 | ✅ |
| game-of-life-prose | v5-exact-single-context | opus-4-7-no-thinking | 4 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 6 | ✅ |
| game-of-life-user-story | v5-exact-single-context | opus-4-7-no-thinking | 3 | ✅ |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
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

### code_mass

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 | 156.83 |   139 |   185 | 20.11 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 | 169    |   140 |   209 | 23.98 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 | 157    |   146 |   184 | 13.56 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 | 164.17 |   157 |   175 |  7    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 | 163    |   144 |   175 | 11.47 |
| game-of-life-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   3 | 161    |   148 |   177 | 14.73 |
| game-of-life-prose           | v4-exact-subagents      | opus-4-7-no-thinking |   4 | 168    |   153 |   197 | 19.97 |
| game-of-life-prose           | v5-exact-single-context | opus-4-7-no-thinking |   4 | 169    |   153 |   185 | 17.36 |
| game-of-life-user-story      | v3-basic-tdd            | opus-4-7-no-thinking |   3 | 154.67 |   142 |   175 | 17.79 |
| game-of-life-user-story      | v4-exact-subagents      | opus-4-7-no-thinking |   3 | 149    |   119 |   166 | 26.06 |
| game-of-life-user-story      | v5-exact-single-context | opus-4-7-no-thinking |   3 | 177.67 |   154 |   203 | 24.54 |

### smell_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
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

### duration_seconds

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  56.5  |    45 |    83 |  14.27 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 | 779.17 |   659 |  1059 | 152.03 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 | 349.5  |   329 |   377 |  16.56 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  50    |    45 |    56 |   4.2  |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  52.17 |    43 |    59 |   6.97 |
| game-of-life-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  47.33 |    44 |    51 |   3.51 |
| game-of-life-prose           | v4-exact-subagents      | opus-4-7-no-thinking |   4 | 802    |   533 |   995 | 197.74 |
| game-of-life-prose           | v5-exact-single-context | opus-4-7-no-thinking |   4 | 354.5  |   233 |   399 |  81.05 |
| game-of-life-user-story      | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  50.67 |    45 |    54 |   4.93 |
| game-of-life-user-story      | v4-exact-subagents      | opus-4-7-no-thinking |   3 | 760.67 |   570 |   884 | 167.48 |
| game-of-life-user-story      | v5-exact-single-context | opus-4-7-no-thinking |   3 | 372    |   311 |   422 |  56.31 |
