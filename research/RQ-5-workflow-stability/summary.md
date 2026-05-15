# RQ-5 — Aggregation

_Wie stabil ist die Code-Qualitaet pro Workflow ueber Replikate, und unter welchen Bedingungen ist n=3 als Replikat-Anzahl ausreichend?_

Generated: 2026-05-15T02:48:46Z

Cells declared: 5 · matched runs: 50 · min_replicates: 10

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-prose | v1-oneshot | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-prose | v2-iterative | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 10 | 10 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |  165.6 |   151 |   194 | 13.88 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |  166.6 |   146 |   201 | 17.65 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |  152.6 |   136 |   173 | 13.85 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |  155   |   137 |   167 |  8.06 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |  157.8 |   145 |   172 |  8.72 |

### smell_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |    6   |     4 |     8 |  1.41 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    2.6 |     2 |     4 |  0.7  |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    4.1 |     2 |     7 |  1.79 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |    4.8 |     2 |     6 |  1.23 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |    4.1 |     2 |     6 |  1.29 |

### cc_longest_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |   32.5 |    24 |    41 |  5.84 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    8.1 |     2 |    15 |  4.04 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   17.4 |     2 |    32 |  9.25 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |   31.7 |    28 |    38 |  3.3  |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |   32.1 |    24 |    39 |  4.61 |

### mccabe_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |   13.7 |    11 |    15 |  1.57 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    4.5 |     3 |    11 |  2.42 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    8.9 |     6 |    12 |  2.08 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |   12.8 |     9 |    15 |  1.81 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |   11.6 |     9 |    14 |  1.51 |

### cognitive_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |   21.8 |    17 |    28 |  3.61 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    4.4 |     2 |    17 |  4.48 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   14.5 |     9 |    24 |  4.84 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |   18.8 |    10 |    23 |  3.58 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |   16.2 |    10 |    20 |  3.58 |

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |      10 |      100 |

### verification_pct (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |      10 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |      10 |      100 |

### duration_seconds

| kata                         | workflow                | model                |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|------:|------:|-------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |   75.1  |    59 |   126 |  21    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 1162.9  |   604 |  3923 | 984.46 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |  379.56 |   220 |   508 | 100.79 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |   87.7  |    62 |   125 |  21.92 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |   83.3  |    65 |   113 |  13.42 |

### total_tokens

| kata                         | workflow                | model                |   n |             mean |     min |      max |              std |
|:-----------------------------|:------------------------|:---------------------|----:|-----------------:|--------:|---------:|-----------------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 | 799074           |  595232 |  1263063 | 187141           |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      2.56189e+06 | 2023377 |  3201698 | 382603           |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      8.14255e+06 |       0 | 12207170 |      3.79036e+06 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 | 993521           |  679521 |  1302769 | 223585           |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 | 966999           |  719553 |  1225127 | 175027           |
