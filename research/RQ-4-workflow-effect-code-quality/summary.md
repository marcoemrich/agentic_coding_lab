# RQ-4 — Aggregation

_Wie wirkt sich die Workflow-Struktur (von oneshot ueber iterativ bis zu striktem TDD mit Subagents) auf die Code-Qualitaet aus, und macht die TDD-Striktheit einen Unterschied?_

Generated: 2026-05-14T22:44:51Z

Cells declared: 5 · matched runs: 18 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-prose | v1-oneshot | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-prose | v2-iterative | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 3 | 3 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 | 164.33 |   154 |   180 | 13.8  |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 | 167.67 |   154 |   193 | 13.95 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 | 161.67 |   153 |   169 |  8.08 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 | 160    |   154 |   167 |  6.56 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 | 154.67 |   145 |   161 |  8.5  |

### smell_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   5.67 |     5 |     6 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   2.5  |     2 |     3 |  0.55 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   5.67 |     4 |     7 |  1.53 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   5    |     4 |     6 |  1    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   4.33 |     4 |     5 |  0.58 |

### cc_longest_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  34    |    32 |    37 |  2.65 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   9.33 |     6 |    15 |  3.2  |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  24.33 |    20 |    32 |  6.66 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  33.67 |    29 |    38 |  4.51 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  34    |    29 |    37 |  4.36 |

### cc_loc

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  31.67 |    31 |    32 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |  32.33 |    25 |    47 |  8.14 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  31.67 |    31 |    33 |  1.15 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  34    |    31 |    37 |  3    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  32.33 |    30 |    36 |  3.21 |

### mccabe_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  14.33 |    14 |    15 |  0.58 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   4    |     3 |     5 |  0.89 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  10.67 |    10 |    12 |  1.15 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  14    |    12 |    15 |  1.73 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  12    |    12 |    12 |  0    |

### cognitive_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  23.33 |    19 |    28 |  4.51 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   2.83 |     2 |     4 |  0.75 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  18.33 |    11 |    24 |  6.66 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  20.67 |    18 |    23 |  2.52 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  16.67 |    14 |    18 |  2.31 |

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |       3 |      100 |

### verification_pct (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |       3 |      100 |

### verification_passed

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |

### verification_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |

### completed_within_budget (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |       3 |      100 |

### tdd_cycles

_Spalte `tdd_cycles` nicht in CSV — wird nicht erhoben oder Tippfehler im Frontmatter._

### refactorings

_Spalte `refactorings` nicht in CSV — wird nicht erhoben oder Tippfehler im Frontmatter._

### prediction_accuracy

_Spalte `prediction_accuracy` nicht in CSV — wird nicht erhoben oder Tippfehler im Frontmatter._

### tests_immediately_passing

_Spalte `tests_immediately_passing` nicht in CSV — wird nicht erhoben oder Tippfehler im Frontmatter._

### duration_seconds

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  67    |    59 |    82 |  13    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 | 865.17 |   661 |  1124 | 179.28 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 | 300.33 |   220 |   428 | 111.79 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  84.67 |    62 |   125 |  35.02 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  83.67 |    82 |    86 |   2.08 |

### total_tokens

| kata                         | workflow                | model                |   n |             mean |     min |      max |              std |
|:-----------------------------|:------------------------|:---------------------|----:|-----------------:|--------:|---------:|-----------------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 | 784518           |  688031 |   935220 | 132212           |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |      2.57698e+06 | 2023377 |  3201698 | 405256           |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |      6.86566e+06 | 4594513 | 10667191 |      3.31299e+06 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 | 854606           |  683747 |  1093416 | 213120           |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 | 959927           |  855529 |  1034902 |  93236           |
