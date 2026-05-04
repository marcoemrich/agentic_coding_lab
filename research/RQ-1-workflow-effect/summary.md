# RQ-1 — Aggregation

_Wirkt der gewählte Workflow auf Code-Qualität, Korrektheit und TDD-Disziplin?_

Generated: 2026-05-04T01:13:51Z

Cells declared: 5 · matched runs: 30 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | status |
|---|---|---|---:|---|
| game-of-life-prose | v1-oneshot | opus-4-7-no-thinking | 6 | ✅ |
| game-of-life-prose | v2-iterative | opus-4-7-no-thinking | 6 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 6 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 6 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 6 | ✅ |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |       6 |      100 |

### cc_loc

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  29.83 |    24 |    38 |  5.81 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |  31.33 |    25 |    39 |  4.59 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  29.67 |    24 |    36 |  4.5  |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  35.83 |    31 |    44 |  5.15 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  34.83 |    31 |    39 |  2.86 |

### code_mass

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 | 156.83 |   139 |   185 | 20.11 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 | 169    |   140 |   209 | 23.98 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 | 157    |   146 |   184 | 13.56 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 | 164.17 |   157 |   175 |  7    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 | 163    |   144 |   175 | 11.47 |

### cc_avg_loc_per_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  13.17 |    10 |    16 |  1.94 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   5.83 |     2 |     9 |  2.79 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7.17 |     2 |    13 |  3.66 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  10.33 |     8 |    12 |  1.37 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  13.17 |    10 |    22 |  4.45 |

### cc_longest_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  29.83 |    24 |    44 |  8.28 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |  15.17 |     8 |    23 |  6.21 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  16.83 |     2 |    25 |  7.99 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  26.83 |    21 |    31 |  3.6  |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  31    |    25 |    41 |  5.62 |

### smell_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   4.33 |     2 |     5 |  1.21 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   2.5  |     2 |     3 |  0.55 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   3.17 |     2 |     5 |  1.47 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   3.67 |     2 |     6 |  1.51 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   4.67 |     2 |     6 |  1.37 |

### smell_complexity

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   1.67 |     0 |     2 |  0.82 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   1    |     0 |     3 |  1.55 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   1.33 |     0 |     2 |  1.03 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   1.17 |     0 |     2 |  0.75 |

### cycle_count

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   1.33 |     1 |     2 |  0.52 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   8.5  |     8 |     9 |  0.55 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7.67 |     6 |     8 |  0.82 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   1    |     1 |     1 |  0    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   1    |     1 |     1 |  0    |

### refactorings_applied

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   5.33 |     4 |     8 |  2.07 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   7    |     4 |     8 |  1.67 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |

### predictions_correct

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   5.67 |     5 |     7 |  0.82 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  15.17 |    12 |    16 |  1.6  |

### predictions_correct_rate (pooled %)

| kata                         | workflow                | model                |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |        34 |      35 |     97.1 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |        91 |      92 |     98.9 |

### tests_passed_immediately

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   0.33 |     0 |     1 |  0.52 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   5.17 |     1 |     7 |  2.14 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   0.67 |     0 |     4 |  1.63 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   0.83 |     0 |     1 |  0.41 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |   0.17 |     0 |     1 |  0.41 |

### duration_seconds

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  56.5  |    45 |    83 |  14.27 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 | 779.17 |   659 |  1059 | 152.03 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 | 349.5  |   329 |   377 |  16.56 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  50    |    45 |    56 |   4.2  |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   6 |  52.17 |    43 |    59 |   6.97 |
