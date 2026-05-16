# RQ-5 — Aggregation

_Wie stabil sind Code-Qualitaet und TDD-Disziplin pro Workflow ueber Replikate, und unter welchen Bedingungen ist n=3 als Replikat-Anzahl ausreichend?_

Generated: 2026-05-16T14:55:00Z

Cells declared: 6 · matched runs: 60 · min_replicates: 10

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-prose | v1-oneshot | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-prose | v2-iterative | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v6-hybrid | opus-4-7-no-thinking | 10 | 10 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |  165.6 |   151 |   194 | 13.88 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |  166.6 |   146 |   201 | 17.65 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |  152.6 |   136 |   173 | 13.85 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |  158.6 |   140 |   187 | 15.14 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |  155   |   137 |   167 |  8.06 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |  157.8 |   145 |   172 |  8.72 |

### smell_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |    6   |     4 |     8 |  1.41 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    2.6 |     2 |     4 |  0.7  |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    4.1 |     2 |     7 |  1.79 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |    2.2 |     2 |     3 |  0.42 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |    4.8 |     2 |     6 |  1.23 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |    4.1 |     2 |     6 |  1.29 |

### cc_longest_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |   32.5 |    24 |    41 |  5.84 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    8.1 |     2 |    15 |  4.04 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   17.4 |     2 |    32 |  9.25 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |   13.1 |     4 |    21 |  5.97 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |   31.7 |    28 |    38 |  3.3  |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |   32.1 |    24 |    39 |  4.61 |

### mccabe_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |   13.7 |    11 |    15 |  1.57 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    4.5 |     3 |    11 |  2.42 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    8.9 |     6 |    12 |  2.08 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |    4.5 |     2 |     7 |  1.51 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |   12.8 |     9 |    15 |  1.81 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |   11.6 |     9 |    14 |  1.51 |

### cognitive_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |   21.8 |    17 |    28 |  3.61 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    4.4 |     2 |    17 |  4.48 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   14.5 |     9 |    24 |  4.84 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |    5.2 |     1 |     7 |  2.3  |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |   18.8 |    10 |    23 |  3.58 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |   16.2 |    10 |    20 |  3.58 |

### mutation_score

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |   0.95 |  0.94 |  0.96 |  0.01 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   0.91 |  0.74 |  0.96 |  0.08 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   0.94 |  0.84 |  0.96 |  0.04 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |   0.95 |  0.94 |  0.96 |  0    |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |   0.95 |  0.93 |  0.96 |  0.01 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |   0.95 |  0.94 |  0.96 |  0.01 |

### predictions_correct_rate (pooled %)

| kata                         | workflow                | model                |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |        99 |     101 |     98   |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |       132 |     132 |    100   |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |       169 |     170 |     99.4 |

### refactorings_applied

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |    0.1 |     0 |     1 |  0.32 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    5.9 |     3 |     8 |  2.02 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    6   |     0 |     8 |  3.09 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |    4   |     3 |     8 |  1.63 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |    0   |     0 |     0 |  0    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |    0   |     0 |     0 |  0    |

### cycle_count

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |    1.5 |     1 |     4 |  0.97 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    7.8 |     6 |     9 |  0.92 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    6.7 |     0 |     8 |  2.67 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |    8.3 |     7 |    10 |  0.82 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |    1   |     1 |     1 |  0    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |    1   |     1 |     1 |  0    |

### tests_passed_immediately

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |    0.5 |     0 |     3 |  0.97 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    3.3 |     0 |     6 |  2.87 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    0.9 |     0 |     5 |  1.66 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |    3.3 |     0 |     7 |  3.02 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |    1   |     1 |     1 |  0    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |    1   |     1 |     1 |  0    |

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |      10 |      100 |

### verification_pct (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |      10 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |      10 |      100 |

### duration_seconds

| kata                         | workflow                | model                |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|------:|------:|-------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |   75.1  |    59 |   126 |  21    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 1162.9  |   604 |  3923 | 984.46 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |  379.56 |   220 |   508 | 100.79 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |  521.4  |   427 |   711 |  95.48 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |   87.7  |    62 |   125 |  21.92 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |   83.3  |    65 |   113 |  13.42 |

### total_tokens

| kata                         | workflow                | model                |   n |             mean |     min |      max |              std |
|:-----------------------------|:------------------------|:---------------------|----:|-----------------:|--------:|---------:|-----------------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 | 799074           |  595232 |  1263063 | 187141           |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      2.56189e+06 | 2023377 |  3201698 | 382603           |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      8.14255e+06 |       0 | 12207170 |      3.79036e+06 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |      6.62354e+06 | 4863281 |  8557921 |      1.31893e+06 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 | 993521           |  679521 |  1302769 | 223585           |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 | 966999           |  719553 |  1225127 | 175027           |
