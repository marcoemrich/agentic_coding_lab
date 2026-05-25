# RQ-tdd-quality — Aggregation

_Wie wirkt sich die Workflow-Struktur (von oneshot ueber iterativ bis zu striktem TDD mit Subagents) auf die Code-Qualitaet aus, und macht die TDD-Striktheit einen Unterschied?_

Generated: 2026-05-25T19:26:52Z

Cells declared: 16 · matched runs: 103 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-prose | v1-oneshot | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |
| claim-office-prose | v1-oneshot | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-prose | v2-iterative | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |
| claim-office-prose | v2-iterative | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v3-basic-tdd | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v4.1-testlist-scope-fix | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v5.1-testlist-scope-fix | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v5.1-testlist-scope-fix | opus-4-7-portkey-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking | 7 | 7 | ✅ |
| game-of-life-example-mapping | v8a-delayed-refactor-agent | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v8a-delayed-refactor-agent | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v8b-delayed-refactor-native | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v8b-delayed-refactor-native | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 | 992.4  |   933 |  1058 | 50.71 |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 | 621.6  |   538 |   703 | 65.58 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 | 692.67 |   575 |   796 | 78.8  |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   7 | 861.29 |   759 |   982 | 74.51 |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 | 813.8  |   715 |   929 | 81.4  |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 | 780.2  |   669 |   865 | 75.34 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 | 835.4  |   757 |   930 | 69.19 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 | 851    |   811 |   927 | 46.18 |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 | 165.6  |   151 |   194 | 13.88 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 | 156.6  |   131 |   178 | 18.06 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 | 154    |   142 |   172 | 11.81 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 | 153.7  |   131 |   191 | 18.79 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 | 142    |   120 |   159 | 14.05 |
| game-of-life-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 | 145.8  |   139 |   157 |  6.72 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 | 155    |   137 |   167 |  8.06 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 | 157.8  |   145 |   172 |  8.72 |

### smell_total

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |  16.8  |     6 |    21 |  6.22 |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  13.2  |     0 |    19 |  7.53 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |   6.83 |     1 |    17 |  7.55 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   7 |   1.29 |     0 |     4 |  1.5  |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |   4    |     0 |    10 |  4.69 |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |   6.2  |     1 |    13 |  5.45 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |  11.6  |     0 |    21 |  7.57 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |  15.8  |    12 |    22 |  3.7  |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |   6    |     4 |     8 |  1.41 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   2.4  |     2 |     3 |  0.55 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   4.8  |     4 |     5 |  0.45 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |   2.4  |     2 |     3 |  0.52 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |   3    |     2 |     4 |  1    |
| game-of-life-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |   2.4  |     2 |     4 |  0.89 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |   4.8  |     2 |     6 |  1.23 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |   4.1  |     2 |     6 |  1.29 |

### cc_longest_function

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |  51.6  |    34 |    72 | 17.16 |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  40.8  |    17 |    86 | 27.12 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |  32.67 |    20 |    50 | 10.19 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   7 |  18.14 |    11 |    25 |  5.11 |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |  28.4  |    26 |    30 |  1.52 |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |  35.8  |    24 |    49 | 11.52 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |  40.4  |    34 |    52 |  7.23 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |  41.4  |    36 |    47 |  5.32 |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |  32.5  |    24 |    41 |  5.84 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  16.4  |    10 |    22 |  5.18 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  20.8  |    13 |    24 |  4.44 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |  14.2  |     2 |    25 |  6.25 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |  17.6  |    12 |    27 |  6.27 |
| game-of-life-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |  17.6  |    11 |    27 |  6.47 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |  31.7  |    28 |    38 |  3.3  |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |  32.1  |    24 |    39 |  4.61 |

### cc_loc

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 | 317.4  |   277 |   344 | 25.09 |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 | 156.8  |   125 |   220 | 37.96 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 | 167.17 |   121 |   193 | 27.92 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   7 | 191.14 |   170 |   221 | 20.32 |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 | 245.6  |   210 |   298 | 33.49 |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 | 238.8  |   197 |   272 | 26.86 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 | 269.4  |   247 |   315 | 31.15 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 | 268.6  |   257 |   281 | 10.5  |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |  31.9  |    27 |    37 |  3.48 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  32    |    27 |    36 |  4.3  |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  26.6  |    23 |    31 |  2.88 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |  29.2  |    21 |    40 |  5.53 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |  31.2  |    26 |    35 |  3.56 |
| game-of-life-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |  31    |    26 |    39 |  4.85 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |  33.6  |    31 |    37 |  1.78 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |  32.5  |    29 |    38 |  2.8  |

### mccabe_max

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |  15.4  |     8 |    22 |  5.08 |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  16    |     5 |    30 |  8.97 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |  10.17 |     7 |    14 |  2.64 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   7 |   5.71 |     4 |    10 |  2.36 |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |   6.6  |     4 |     9 |  1.95 |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |   8    |     6 |    13 |  2.92 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |   8.4  |     7 |    10 |  1.14 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |   8.4  |     6 |    12 |  2.61 |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |  13.7  |    11 |    15 |  1.57 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   5    |     4 |     7 |  1.41 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  10.2  |     7 |    13 |  2.28 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |   5.2  |     3 |     8 |  1.69 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |   7.4  |     4 |     9 |  2.07 |
| game-of-life-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |   6.8  |     5 |    11 |  2.39 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |  12.8  |     9 |    15 |  1.81 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |  11.6  |     9 |    14 |  1.51 |

### cognitive_max

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |  19.8  |    12 |    28 |  5.85 |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  26.8  |     5 |    68 | 24.07 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |  14.83 |     8 |    19 |  4.17 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   7 |   5.71 |     3 |    11 |  2.87 |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |   7.4  |     4 |    10 |  2.3  |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |  11    |     8 |    19 |  4.64 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |  12.2  |     8 |    18 |  3.9  |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |  11.4  |     6 |    18 |  4.77 |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |  21.8  |    17 |    28 |  3.61 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   6.4  |     4 |    10 |  2.51 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  17.6  |    12 |    21 |  3.44 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |   6.5  |     2 |    12 |  3.24 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |  10.6  |     4 |    15 |  4.93 |
| game-of-life-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |   9    |     7 |    17 |  4.47 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |  18.8  |    10 |    23 |  3.58 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |  16.2  |    10 |    20 |  3.58 |

### mutation_score

| kata                         | workflow     | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd | opus-4-7-portkey-no-thinking |   5 |   0.78 |  0.75 |  0.8  |  0.02 |
| claim-office-prose           | v1-oneshot   | opus-4-7-portkey-no-thinking |   5 |   0.86 |  0.73 |  0.91 |  0.08 |
| claim-office-prose           | v2-iterative | opus-4-7-portkey-no-thinking |   5 |   0.87 |  0.81 |  0.89 |  0.04 |
| game-of-life-example-mapping | v3-basic-tdd | opus-4-7-portkey-no-thinking |  10 |   0.95 |  0.94 |  0.96 |  0.01 |
| game-of-life-prose           | v1-oneshot   | opus-4-7-portkey-no-thinking |  10 |   0.95 |  0.93 |  0.96 |  0.01 |
| game-of-life-prose           | v2-iterative | opus-4-7-portkey-no-thinking |  10 |   0.95 |  0.94 |  0.96 |  0.01 |

### tests_passing (rate %)

| kata                         | workflow                       | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |       6 |      100 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   7 |       7 |      100 |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |

### verification_pct

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |   1    |  1    |  1    |  0    |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   0.96 |  0.8  |  1    |  0.09 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |   1    |  1    |  1    |  0    |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   7 |   1    |  1    |  1    |  0    |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |   1    |  1    |  1    |  0    |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |   0.97 |  0.87 |  1    |  0.06 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |   0.28 |  0.2  |  0.33 |  0.06 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |   0.28 |  0.2  |  0.33 |  0.06 |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |   1    |  1    |  1    |  0    |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   1    |  1    |  1    |  0    |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   1    |  1    |  1    |  0    |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |   1    |  1    |  1    |  0    |
| game-of-life-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |   1    |  1    |  1    |  0    |
| game-of-life-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |   1    |  1    |  1    |  0    |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |   1    |  1    |  1    |  0    |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |   1    |  1    |  1    |  0    |

### verification_passed

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |   15   |    15 |    15 |  0    |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   14.4 |    12 |    15 |  1.34 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |   15   |    15 |    15 |  0    |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   7 |   15   |    15 |    15 |  0    |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |   15   |    15 |    15 |  0    |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |   14.6 |    13 |    15 |  0.89 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |    4.2 |     3 |     5 |  0.84 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |    4.2 |     3 |     5 |  0.84 |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |   15   |    15 |    15 |  0    |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   15   |    15 |    15 |  0    |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   15   |    15 |    15 |  0    |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |   15   |    15 |    15 |  0    |
| game-of-life-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |   15   |    15 |    15 |  0    |
| game-of-life-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |   15   |    15 |    15 |  0    |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |   15   |    15 |    15 |  0    |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |   15   |    15 |    15 |  0    |

### verification_total

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   7 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |     15 |    15 |    15 |     0 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |     15 |    15 |    15 |     0 |

### completed_within_budget (rate %)

| kata                         | workflow                       | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |       6 |      100 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   7 |       7 |      100 |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
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
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |  312.4 |   257 |   381 |  53.36 |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 | 3228.8 |  2180 |  4333 | 919.93 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |  641   |   525 |   872 | 122.02 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   7 | 1569   |   556 |  2071 | 519.28 |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |  307.8 |   280 |   368 |  35.1  |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |  276.4 |   228 |   362 |  53.17 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |  231   |   168 |   321 |  57.35 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |  244.2 |   198 |   310 |  42.39 |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |   75.1 |    59 |   126 |  21    |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  837.6 |   515 |   977 | 187    |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  292.6 |   254 |   384 |  53.33 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |  507.9 |   292 |   727 | 147.13 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |  142.8 |   120 |   166 |  20.66 |
| game-of-life-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |  115.8 |    89 |   153 |  27.71 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |   87.7 |    62 |   125 |  21.92 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |   83.3 |    65 |   113 |  13.42 |

### total_tokens

| kata                         | workflow                       | cell_model                   |   n |             mean |      min |      max |              std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-----------------:|---------:|---------:|-----------------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |      3.28141e+06 |  2734813 |  4185323 | 545757           |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |      1.41003e+07 | 11422803 | 18869365 |      2.99239e+06 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |      1.87267e+07 | 14120743 | 28366021 |      5.35498e+06 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   7 |      3.45442e+07 |  9306264 | 44845398 |      1.19731e+07 |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |      2.12087e+06 |  1432251 |  3226054 | 695551           |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |      3.44636e+06 |  2116892 |  5135072 |      1.09186e+06 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |      2.10814e+06 |  1459870 |  3279079 | 736133           |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |      2.11557e+06 |  1500227 |  2659631 | 444735           |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 | 799074           |   595232 |  1263063 | 187141           |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |      4.32469e+06 |  3084530 |  5805452 |      1.02328e+06 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |      8.40104e+06 |  5208968 | 12953864 |      3.43516e+06 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |      6.94053e+06 |  5264335 |  9796559 |      1.36348e+06 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |      1.1754e+06  |   983991 |  1364864 | 151956           |
| game-of-life-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |      1.3226e+06  |  1156615 |  1521323 | 171935           |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 | 993521           |   679521 |  1302769 | 223585           |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 | 966999           |   719553 |  1225127 | 175027           |
