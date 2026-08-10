# RQ-architecture-axis-sol-pi — Aggregation

_Does the TDD architecture axis (v4.1 isolated subagents / v5.1 single context / v6.1 hybrid) rank the same way on gpt-5-6-sol as it does on opus-4-7 — or does Sol land on the other side of the documented v4/v6 model swap?_

Generated: 2026-08-10T11:28:55Z

Cells declared: 10 · matched runs: 50 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v1-oneshot-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| game-of-life-example-mapping | v1-oneshot-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| claim-office-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| claim-office-example-mapping | v4.1-testlist-scope-fix-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| game-of-life-example-mapping | v4.1-testlist-scope-fix-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| claim-office-example-mapping | v5.1-testlist-scope-fix-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct (rate %)

| kata                         | cell_workflow                     | cell_model   |   n |   match |   rate_% |
|:-----------------------------|:----------------------------------|:-------------|----:|--------:|---------:|
| claim-office-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |       4 |       80 |
| claim-office-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |       5 |      100 |
| claim-office-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |       2 |       40 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |       5 |      100 |
| game-of-life-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |       5 |      100 |
| game-of-life-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |       5 |      100 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |       5 |      100 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |       5 |      100 |

### tests_passing (rate %)

| kata                         | cell_workflow                     | cell_model   |   n |   match |   rate_% |
|:-----------------------------|:----------------------------------|:-------------|----:|--------:|---------:|
| claim-office-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |       4 |       80 |
| claim-office-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |       5 |      100 |
| claim-office-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |       5 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |       5 |      100 |
| game-of-life-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |       5 |      100 |
| game-of-life-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |       5 |      100 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |       5 |      100 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                     | cell_model   |   n |   match |   rate_% |
|:-----------------------------|:----------------------------------|:-------------|----:|--------:|---------:|
| claim-office-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |       5 |      100 |
| claim-office-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |       5 |      100 |
| claim-office-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |       5 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |       5 |      100 |
| game-of-life-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |       5 |      100 |
| game-of-life-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |       5 |      100 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |       5 |      100 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |       5 |      100 |

### cognitive_max

| kata                         | cell_workflow                     | cell_model   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------|:-------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |    7.8 |     5 |    10 |  2.28 |
| claim-office-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |    9.2 |     3 |    18 |  5.54 |
| claim-office-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   11.6 |     8 |    15 |  3.36 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |    8.4 |     5 |    11 |  2.19 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |    5.8 |     3 |    13 |  4.09 |
| game-of-life-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |    4.2 |     3 |     6 |  1.1  |
| game-of-life-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |    4   |     3 |     5 |  0.71 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |    7   |     3 |    12 |  4.58 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |    7.4 |     3 |    19 |  6.66 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |    8.6 |     4 |    17 |  5.73 |

### cognitive_avg

| kata                         | cell_workflow                     | cell_model   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------|:-------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |   2.54 |  1.55 |  3.77 |  0.81 |
| claim-office-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |   3.65 |  2.12 |  7.14 |  2.06 |
| claim-office-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   3.7  |  2.24 |  5.4  |  1.39 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   3.58 |  2.5  |  5.67 |  1.28 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |   2.65 |  2.1  |  3.43 |  0.56 |
| game-of-life-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |   2.41 |  2    |  3    |  0.38 |
| game-of-life-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |   2.35 |  2    |  2.75 |  0.27 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   3.23 |  2.33 |  5    |  1.21 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   4.37 |  2.5  | 10    |  3.16 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |   6.2  |  3    | 17    |  6.1  |

### mccabe_max

| kata                         | cell_workflow                     | cell_model   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------|:-------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |    8   |     5 |    10 |  2    |
| claim-office-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |    8.2 |     4 |    15 |  4.38 |
| claim-office-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   13.6 |     9 |    18 |  3.21 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |    8.2 |     5 |    10 |  1.92 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |    6   |     4 |    10 |  2.35 |
| game-of-life-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |    4.8 |     3 |     7 |  1.48 |
| game-of-life-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |    4.6 |     4 |     5 |  0.55 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |    6   |     4 |     8 |  1.58 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |    6.2 |     3 |    13 |  3.96 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |    6.6 |     4 |    11 |  2.88 |

### mccabe_avg

| kata                         | cell_workflow                     | cell_model   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------|:-------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |   2.6  |  2.13 |  3.09 |  0.41 |
| claim-office-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |   3.16 |  2.13 |  5.78 |  1.48 |
| claim-office-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   2.51 |  2.22 |  2.9  |  0.29 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   2.82 |  2.29 |  3.6  |  0.51 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |   2.59 |  2.29 |  2.9  |  0.22 |
| game-of-life-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |   2.22 |  1.75 |  2.67 |  0.39 |
| game-of-life-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |   1.82 |  1.7  |  2    |  0.12 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   2.44 |  2    |  2.83 |  0.32 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   2.57 |  1.8  |  4.25 |  0.98 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |   3.17 |  2.2  |  6    |  1.59 |

### cc_longest_function

| kata                         | cell_workflow                     | cell_model   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------|:-------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |   17.8 |    16 |    21 |  1.92 |
| claim-office-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |   21.8 |    16 |    34 |  7.22 |
| claim-office-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   43.4 |    27 |    53 | 10.11 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   23   |    21 |    24 |  1.41 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |   23   |    18 |    32 |  5.29 |
| game-of-life-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |   13.2 |    11 |    17 |  2.39 |
| game-of-life-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |   15.6 |    11 |    21 |  4.62 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   22   |    18 |    28 |  4.3  |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   20.6 |    18 |    26 |  3.21 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |   20.8 |    17 |    26 |  3.9  |

### smell_total

| kata                         | cell_workflow                     | cell_model   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------|:-------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |    6.8 |     0 |    19 |  9.42 |
| claim-office-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   28   |    18 |    39 |  9.57 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   12.4 |     0 |    17 |  7.02 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |   15.2 |    11 |    19 |  2.95 |
| game-of-life-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |    3.8 |     2 |     7 |  2.05 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |    2.4 |     0 |    10 |  4.34 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |    2.8 |     2 |     4 |  1.1  |

### code_mass

| kata                         | cell_workflow                     | cell_model   |   n |   mean |   min |   max |    std |
|:-----------------------------|:----------------------------------|:-------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |  874.6 |   830 |   955 |  60.64 |
| claim-office-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |  678.8 |   567 |   818 | 100.34 |
| claim-office-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |  646.8 |   407 |  1002 | 281.42 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |  524.6 |   451 |   563 |  46.44 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |  446.4 |   395 |   507 |  40.05 |
| game-of-life-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |  188   |   171 |   203 |  12.69 |
| game-of-life-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |  174.8 |   163 |   188 |  11.43 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |  146.8 |   120 |   165 |  18.29 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |  141   |   109 |   173 |  24.63 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |  125.8 |   105 |   145 |  14.27 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                     | cell_model   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------|:-------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |   6.74 |  5.48 |  8.29 |  1.17 |
| claim-office-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |   8.01 |  5.7  | 10    |  1.81 |
| claim-office-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   6.96 |  5.7  |  8.18 |  1    |
| claim-office-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |  10.48 |  8.5  | 15.5  |  2.87 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |  10.72 |  7    | 13.25 |  2.37 |
| game-of-life-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |   6.8  |  5.2  |  8    |  1.2  |
| game-of-life-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |   8.66 |  5.8  | 12    |  2.68 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |  12.83 |  8.67 | 17    |  3.44 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |  13.07 |  8.33 | 26    |  7.29 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |  15.9  |  9.5  | 26    |  7.96 |

### cycle_count

| kata                         | cell_workflow                     | cell_model   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------|:-------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   87.4 |    76 |   103 | 12.99 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   29.6 |     6 |    39 | 13.39 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |   34.2 |    22 |    45 |  8.17 |
| game-of-life-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   22   |    17 |    28 |  4.3  |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |    9.4 |     8 |    11 |  1.14 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |    9   |     8 |    11 |  1.22 |

### refactorings_applied

| kata                         | cell_workflow                     | cell_model   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------|:-------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   10.2 |     8 |    13 |  2.17 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   19.6 |     2 |    40 | 17.4  |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |   15   |    13 |    18 |  2.35 |
| game-of-life-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   10.2 |     8 |    12 |  1.48 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |    5.2 |     4 |     8 |  1.64 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |    4.4 |     3 |     6 |  1.14 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                     | cell_model   |   n |   correct |   total |   rate_% |
|:-----------------------------|:----------------------------------|:-------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |       409 |     518 |     79   |
| claim-office-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |       122 |     124 |     98.4 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |       146 |     148 |     98.6 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |       108 |     128 |     84.4 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |        47 |      49 |     95.9 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |        44 |      44 |    100   |

### duration_seconds

| kata                         | cell_workflow                     | cell_model   |   n |   mean |   min |   max |    std |
|:-----------------------------|:----------------------------------|:-------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |  166.6 |   134 |   214 |  31.45 |
| claim-office-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |  229   |   154 |   334 |  80.74 |
| claim-office-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 | 4296.2 |  3429 |  5084 | 737.14 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |  255   |   184 |   412 |  89.81 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 | 1185   |   918 |  1530 | 229.79 |
| game-of-life-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |   86.8 |    63 |   100 |  14.13 |
| game-of-life-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |  139.6 |   112 |   154 |  16.27 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |  898.8 |   699 |  1024 | 122.6  |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |  198.2 |   166 |   247 |  33.18 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |  343.2 |   198 |   463 | 112.81 |

### total_tokens

| kata                         | cell_workflow                     | cell_model   |   n |             mean |      min |      max |              std |
|:-----------------------------|:----------------------------------|:-------------|----:|-----------------:|---------:|---------:|-----------------:|
| claim-office-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 | 176989           |   119239 |   256220 |  68478.7         |
| claim-office-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 | 287901           |   157812 |   496677 | 158796           |
| claim-office-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |      1.40613e+07 | 10735563 | 20872763 |      4.33165e+06 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 | 821150           |   122462 |  2373987 | 894346           |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |      4.98683e+06 |  3368221 |  6457103 |      1.2496e+06  |
| game-of-life-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |  65544           |    43142 |    77596 |  14588.4         |
| game-of-life-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 | 134408           |    87615 |   167331 |  30455.6         |
| game-of-life-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |      1.61284e+06 |  1353680 |  1999334 | 254479           |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 | 701473           |   622962 |   823017 |  77501.2         |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 | 802887           |   654096 |  1050283 | 169984           |

### cost_usd

| kata                         | cell_workflow                     | cell_model   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------|:-------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |   0.74 |  0.61 |  1.07 |  0.19 |
| claim-office-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |   1.18 |  0.68 |  2.02 |  0.61 |
| claim-office-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |  38.22 | 29.25 | 56.61 | 11.75 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   1.72 |  0.57 |  4.12 |  1.39 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |   9.52 |  6.89 | 12.47 |  2.14 |
| game-of-life-example-mapping | v1-oneshot-pi                     | gpt-5-6-sol  |   5 |   0.35 |  0.25 |  0.43 |  0.07 |
| game-of-life-example-mapping | v3-basic-tdd-pi                   | gpt-5-6-sol  |   5 |   0.57 |  0.43 |  0.73 |  0.12 |
| game-of-life-example-mapping | v4.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   4.84 |  3.97 |  5.37 |  0.54 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-pi        | gpt-5-6-sol  |   5 |   1.58 |  1.36 |  1.98 |  0.25 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix-pi | gpt-5-6-sol  |   5 |   2.18 |  1.1  |  3    |  0.76 |
