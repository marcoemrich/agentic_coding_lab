# RQ-tdd-quality — Aggregation

_Wie wirkt sich die Workflow-Struktur (von oneshot ueber iterativ bis zu striktem TDD mit Subagents) auf die Code-Qualitaet aus, und macht die TDD-Striktheit einen Unterschied?_

Generated: 2026-05-23T13:59:58Z

Cells declared: 16 · matched runs: 97 · min_replicates: 5

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
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
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
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 | 878.6  |   759 |   982 | 80.23 |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 | 777.4  |   647 |   862 | 93.13 |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 | 812    |   708 |   885 | 68.83 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 | 835.4  |   757 |   930 | 69.19 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 | 851    |   811 |   927 | 46.18 |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 | 165.6  |   151 |   194 | 13.88 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 | 156.6  |   131 |   178 | 18.06 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 | 154    |   142 |   172 | 11.81 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 | 159.8  |   131 |   191 | 21.46 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 | 147.2  |   137 |   162 | 10.23 |
| game-of-life-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 | 158.2  |   149 |   165 |  6.53 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 | 155    |   137 |   167 |  8.06 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 | 157.8  |   145 |   172 |  8.72 |

### smell_total

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |  16.8  |     6 |    21 |  6.22 |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  13.2  |     0 |    19 |  7.53 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |   6.83 |     1 |    17 |  7.55 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |   1.6  |     0 |     4 |  1.67 |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |   7.2  |     0 |    13 |  5.45 |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |   1    |     0 |     2 |  1    |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |  11.6  |     0 |    21 |  7.57 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |  15.8  |    12 |    22 |  3.7  |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |   6    |     4 |     8 |  1.41 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   2.4  |     2 |     3 |  0.55 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   4.8  |     4 |     5 |  0.45 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |   2.2  |     2 |     3 |  0.45 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |   3.4  |     2 |     5 |  1.34 |
| game-of-life-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |   3.2  |     2 |     5 |  1.3  |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |   4.8  |     2 |     6 |  1.23 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |   4.1  |     2 |     6 |  1.29 |

### cc_longest_function

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |  51.6  |    34 |    72 | 17.16 |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  40.8  |    17 |    86 | 27.12 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |  32.67 |    20 |    50 | 10.19 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |  18.4  |    11 |    25 |  5.98 |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |  25.6  |    17 |    31 |  5.37 |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |  25    |    22 |    32 |  4    |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |  40.4  |    34 |    52 |  7.23 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |  41.4  |    36 |    47 |  5.32 |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |  32.5  |    24 |    41 |  5.84 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  16.4  |    10 |    22 |  5.18 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  20.8  |    13 |    24 |  4.44 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |  13.4  |    11 |    19 |  3.21 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |  16.6  |    12 |    26 |  6.23 |
| game-of-life-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |  13.8  |    12 |    18 |  2.39 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |  31.7  |    28 |    38 |  3.3  |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |  32.1  |    24 |    39 |  4.61 |

### cc_loc

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 | 317.4  |   277 |   344 | 25.09 |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 | 156.8  |   125 |   220 | 37.96 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 | 167.17 |   121 |   193 | 27.92 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 | 198.4  |   181 |   221 | 19.6  |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 | 228    |   218 |   242 | 10.22 |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 | 259.2  |   211 |   311 | 38.87 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 | 269.4  |   247 |   315 | 31.15 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 | 268.6  |   257 |   281 | 10.5  |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |  31.9  |    27 |    37 |  3.48 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  32    |    27 |    36 |  4.3  |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  26.6  |    23 |    31 |  2.88 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |  31    |    25 |    40 |  5.61 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |  33    |    28 |    37 |  3.32 |
| game-of-life-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |  33    |    30 |    36 |  2.12 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |  33.6  |    31 |    37 |  1.78 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |  32.5  |    29 |    38 |  2.8  |

### mccabe_max

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |  15.4  |     8 |    22 |  5.08 |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  16    |     5 |    30 |  8.97 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |  10.17 |     7 |    14 |  2.64 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |   5.2  |     4 |     7 |  1.64 |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |   5.8  |     4 |     7 |  1.1  |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |   7    |     6 |     8 |  0.71 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |   8.4  |     7 |    10 |  1.14 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |   8.4  |     6 |    12 |  2.61 |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |  13.7  |    11 |    15 |  1.57 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   5    |     4 |     7 |  1.41 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  10.2  |     7 |    13 |  2.28 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |   5.2  |     4 |     8 |  1.64 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |   6.8  |     4 |    10 |  2.77 |
| game-of-life-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |   6    |     4 |     7 |  1.41 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |  12.8  |     9 |    15 |  1.81 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |  11.6  |     9 |    14 |  1.51 |

### cognitive_max

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |  19.8  |    12 |    28 |  5.85 |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  26.8  |     5 |    68 | 24.07 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |  14.83 |     8 |    19 |  4.17 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |   5    |     3 |     8 |  2    |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |   7.6  |     4 |    10 |  2.3  |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |   8.4  |     8 |     9 |  0.55 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |  12.2  |     8 |    18 |  3.9  |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |  11.4  |     6 |    18 |  4.77 |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |  21.8  |    17 |    28 |  3.61 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   6.4  |     4 |    10 |  2.51 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  17.6  |    12 |    21 |  3.44 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |   6.8  |     4 |     9 |  1.79 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |  11    |     4 |    19 |  6.86 |
| game-of-life-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |   8.4  |     4 |    12 |  3.78 |
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
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   6 |       5 |       83 |
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
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |   1    |  1    |  1    |  0    |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |   0.97 |  0.87 |  1    |  0.06 |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |   0.97 |  0.87 |  1    |  0.06 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |   0.28 |  0.2  |  0.33 |  0.06 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |   0.28 |  0.2  |  0.33 |  0.06 |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |   1    |  1    |  1    |  0    |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   1    |  1    |  1    |  0    |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   1    |  1    |  1    |  0    |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |   1    |  1    |  1    |  0    |
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
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |   15   |    15 |    15 |  0    |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |   14.6 |    13 |    15 |  0.89 |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |   14.6 |    13 |    15 |  0.89 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |    4.2 |     3 |     5 |  0.84 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |    4.2 |     3 |     5 |  0.84 |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |   15   |    15 |    15 |  0    |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   15   |    15 |    15 |  0    |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   15   |    15 |    15 |  0    |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |   15   |    15 |    15 |  0    |
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
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
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
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   6 |       6 |      100 |
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
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 | 1551.4 |   556 |  2071 | 595.62 |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |  309.8 |   262 |   357 |  42.8  |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |  259.6 |   234 |   308 |  30.84 |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |  231   |   168 |   321 |  57.35 |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |  244.2 |   198 |   310 |  42.39 |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 |   75.1 |    59 |   126 |  21    |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  837.6 |   515 |   977 | 187    |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  292.6 |   254 |   384 |  53.33 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |  418.6 |   292 |   545 |  92.08 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |  126   |   106 |   148 |  18.67 |
| game-of-life-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |   86.8 |    67 |   113 |  16.89 |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 |   87.7 |    62 |   125 |  21.92 |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 |   83.3 |    65 |   113 |  13.42 |

### total_tokens

| kata                         | workflow                       | cell_model                   |   n |             mean |              min |         max |              std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-----------------:|-----------------:|------------:|-----------------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |      3.28141e+06 |      2.73481e+06 | 4.18532e+06 | 545757           |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |      1.41003e+07 |      1.14228e+07 | 1.88694e+07 |      2.99239e+06 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |      1.87267e+07 |      1.41207e+07 | 2.8366e+07  |      5.35498e+06 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |      3.32412e+07 |      9.30626e+06 | 4.48454e+07 |      1.39487e+07 |
| claim-office-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |      1.92499e+06 |      1.61473e+06 | 2.59108e+06 | 392165           |
| claim-office-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |      3.08897e+06 |      2.27649e+06 | 4.00003e+06 | 718219           |
| claim-office-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |   5 |      2.10814e+06 |      1.45987e+06 | 3.27908e+06 | 736133           |
| claim-office-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |   5 |      2.11557e+06 |      1.50023e+06 | 2.65963e+06 | 444735           |
| game-of-life-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |  10 | 799074           | 595232           | 1.26306e+06 | 187141           |
| game-of-life-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |      4.32469e+06 |      3.08453e+06 | 5.80545e+06 |      1.02328e+06 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |      8.40104e+06 |      5.20897e+06 | 1.29539e+07 |      3.43516e+06 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |      6.71233e+06 |      5.56674e+06 | 8.4322e+06  |      1.11859e+06 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent     | opus-4-7-portkey-no-thinking |   5 |      1.0824e+06  | 840737           | 1.26849e+06 | 174598           |
| game-of-life-example-mapping | v8b-delayed-refactor-native    | opus-4-7-portkey-no-thinking |   5 |      1.03108e+06 | 822541           | 1.24494e+06 | 159576           |
| game-of-life-prose           | v1-oneshot                     | opus-4-7-portkey-no-thinking |  10 | 993521           | 679521           | 1.30277e+06 | 223585           |
| game-of-life-prose           | v2-iterative                   | opus-4-7-portkey-no-thinking |  10 | 966999           | 719553           | 1.22513e+06 | 175027           |
