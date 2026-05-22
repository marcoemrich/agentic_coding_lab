# RQ-tdd-quality — Aggregation

_Wie wirkt sich die Workflow-Struktur (von oneshot ueber iterativ bis zu striktem TDD mit Subagents) auf die Code-Qualitaet aus, und macht die TDD-Striktheit einen Unterschied?_

Generated: 2026-05-22T20:19:42Z

Cells declared: 6 · matched runs: 39 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-prose | v1-oneshot | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |
| game-of-life-prose | v2-iterative | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v4.1-testlist-scope-fix | opus-4-7-portkey-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v5.1-testlist-scope-fix | opus-4-7-portkey-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking | 3 | 3 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 | 165.6  |   151 |   194 | 13.88 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 | 158    |   147 |   165 |  9.64 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 | 151    |   142 |   157 |  7.94 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 | 159.33 |   131 |   191 | 30.14 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 | 155    |   137 |   167 |  8.06 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 | 157.8  |   145 |   172 |  8.72 |

### smell_total

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |   6    |     4 |     8 |  1.41 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |   2.67 |     2 |     3 |  0.58 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |   5    |     5 |     5 |  0    |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |   2.33 |     2 |     3 |  0.58 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |   4.8  |     2 |     6 |  1.23 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |   4.1  |     2 |     6 |  1.29 |

### cc_longest_function

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |  32.5  |    24 |    41 |  5.84 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |  16    |    10 |    20 |  5.29 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |  23    |    22 |    24 |  1    |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |  14.67 |    12 |    19 |  3.79 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |  31.7  |    28 |    38 |  3.3  |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |  32.1  |    24 |    39 |  4.61 |

### cc_loc

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |  31.9  |    27 |    37 |  3.48 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |  33    |    27 |    36 |  5.2  |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |  25.33 |    23 |    27 |  2.08 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |  33    |    28 |    40 |  6.24 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |  33.6  |    31 |    37 |  1.78 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |  32.5  |    29 |    38 |  2.8  |

### mccabe_max

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |  13.7  |    11 |    15 |  1.57 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |   4.67 |     4 |     6 |  1.15 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |  11    |     9 |    13 |  2    |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |   5.67 |     4 |     8 |  2.08 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |  12.8  |     9 |    15 |  1.81 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |  11.6  |     9 |    14 |  1.51 |

### cognitive_max

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |  21.8  |    17 |    28 |  3.61 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |   6    |     4 |    10 |  3.46 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |  19.67 |    19 |    21 |  1.15 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |   7.67 |     7 |     9 |  1.15 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |  18.8  |    10 |    23 |  3.58 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |  16.2  |    10 |    20 |  3.58 |

### mutation_score

| kata                         | workflow     | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd | opus-4-7-portkey-no-thinking |  10 |   0.95 |  0.94 |  0.96 |  0.01 |
| game-of-life-prose           | v1-oneshot   | opus-4-7-portkey-no-thinking |  10 |   0.95 |  0.93 |  0.96 |  0.01 |
| game-of-life-prose           | v2-iterative | opus-4-7-portkey-no-thinking |  10 |   0.95 |  0.94 |  0.96 |  0.01 |

### tests_passing (rate %)

| kata                         | workflow                       | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |       3 |      100 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |

### verification_pct (rate %)

| kata                         | workflow                       | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |       3 |      100 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |

### verification_passed

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |     15 |    15 |    15 |     0 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |     15 |    15 |    15 |     0 |

### verification_total

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |     15 |    15 |    15 |     0 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |     15 |    15 |    15 |     0 |

### completed_within_budget (rate %)

| kata                         | workflow                       | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |       3 |      100 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |

### tdd_cycles

_Spalte `tdd_cycles` nicht in CSV — wird nicht erhoben oder Tippfehler im Frontmatter._

### refactorings

_Spalte `refactorings` nicht in CSV — wird nicht erhoben oder Tippfehler im Frontmatter._

### prediction_accuracy

_Spalte `prediction_accuracy` nicht in CSV — wird nicht erhoben oder Tippfehler im Frontmatter._

### tests_immediately_passing

_Spalte `tests_immediately_passing` nicht in CSV — wird nicht erhoben oder Tippfehler im Frontmatter._

### duration_seconds

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |  75.1  |    59 |   126 |  21    |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 | 790.33 |   515 |   931 | 238.46 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 | 273    |   254 |   294 |  20.07 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 | 379.33 |   292 |   453 |  81.37 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |  87.7  |    62 |   125 |  21.92 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |  83.3  |    65 |   113 |  13.42 |

### total_tokens

| kata                         | workflow                       | cell_model                   |   n |             mean |     min |      max |              std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-----------------:|--------:|---------:|-----------------:|
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 | 799074           |  595232 |  1263063 | 187141           |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |      3.77801e+06 | 3084530 |  4544523 | 732732           |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   3 |      7.65736e+06 | 5208968 | 11165338 |      3.11635e+06 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |      6.18637e+06 | 5566735 |  7053445 | 773626           |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 | 993521           |  679521 |  1302769 | 223585           |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 | 966999           |  719553 |  1225127 | 175027           |
