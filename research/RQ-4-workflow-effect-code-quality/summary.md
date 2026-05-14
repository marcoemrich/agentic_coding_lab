# RQ-4 — Aggregation

_Wie wirkt sich die Workflow-Struktur (von oneshot ueber iterativ bis zu striktem TDD mit Subagents) auf die Code-Qualitaet aus, und macht die TDD-Striktheit einen Unterschied?_

Generated: 2026-05-14T00:03:33Z

Cells declared: 5 · matched runs: 22 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-prose | v1-oneshot | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-prose | v2-iterative | opus-4-7-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 4 | 4 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 6 | 6 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 | 156.83 |   139 |   185 | 20.11 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   4 | 155    |   137 |   184 | 20.54 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 | 157    |   146 |   184 | 13.56 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 | 191.33 |   159 |   210 | 28.11 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 | 169.33 |   155 |   197 | 23.97 |

### smell_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   4.33 |     2 |     5 |  1.21 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   4 |   2.5  |     2 |     3 |  0.58 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   3.17 |     2 |     5 |  1.47 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   2.33 |     2 |     3 |  0.58 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   2.33 |     2 |     3 |  0.58 |

### cc_longest_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  29.83 |    24 |    44 |  8.28 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   4 |  12.25 |    10 |    14 |  1.71 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  16.83 |     2 |    25 |  7.99 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  21.33 |    19 |    24 |  2.52 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  24.67 |    21 |    29 |  4.04 |

### cc_loc

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  29.83 |    24 |    38 |  5.81 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   4 |  29.75 |    25 |    35 |  4.99 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  29.67 |    24 |    36 |  4.5  |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  51.33 |    48 |    55 |  3.51 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  44.33 |    36 |    55 |  9.71 |

### mccabe_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  11.83 |     8 |    15 |  2.48 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   4 |   5.25 |     4 |     7 |  1.26 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   6.33 |     3 |    11 |  2.66 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   8.33 |     8 |     9 |  0.58 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   8.67 |     8 |     9 |  0.58 |

### cognitive_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  16.67 |     9 |    21 |  4.08 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   4 |   5.25 |     3 |     7 |  2.06 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  10.17 |     2 |    21 |  7.11 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   9.33 |     9 |    10 |  0.58 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   9.67 |     9 |    10 |  0.58 |

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   4 |       4 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |       3 |      100 |

### verification_pct

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   1    |  1    |  1    |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   4 |   0.8  |  0.2  |  1    |  0.4  |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   1    |  1    |  1    |  0    |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |   0.07 |  0.07 |  0.07 |  0    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |   0.4  |  0.07 |  1    |  0.52 |

### verification_passed

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |     15 |    15 |    15 |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   4 |     12 |     3 |    15 |  6    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |     15 |    15 |    15 |  0    |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |      1 |     1 |     1 |  0    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |      6 |     1 |    15 |  7.81 |

### verification_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   4 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |     15 |    15 |    15 |     0 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |

### completed_within_budget (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   4 |       4 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |       6 |      100 |
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

| kata                         | workflow                | model                |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|------:|------:|-------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   56.5  |    45 |    83 |  14.27 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   4 | 1087    |   763 |  1376 | 326.43 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  349.5  |   329 |   377 |  16.56 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |  101.33 |    74 |   127 |  26.54 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |  109    |    89 |   120 |  17.35 |

### total_tokens

| kata                         | workflow                | model                |   n |             mean |     min |      max |              std |
|:-----------------------------|:------------------------|:---------------------|----:|-----------------:|--------:|---------:|-----------------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 | 630765           |  565424 |   720713 |  73695.5         |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   4 |      3.05962e+06 | 2521335 |  3776105 | 523619           |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |      8.84631e+06 | 7645056 | 10773096 |      1.12327e+06 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   3 |      1.02576e+06 |  822081 |  1147997 | 177568           |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |   3 |      1.33224e+06 | 1079254 |  1614279 | 268692           |
