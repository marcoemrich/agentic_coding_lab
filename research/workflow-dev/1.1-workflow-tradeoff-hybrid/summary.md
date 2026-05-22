# RQ-workflow-tradeoff — Aggregation

_Liefert ein Hybrid-Workflow (v6: red/green im Single-Context, refactor im isolierten Subagent) ein besseres Tradeoff aus Code-Qualitaet, Wallclock-Dauer und Tokenverbrauch als die Reinformen v4 (alles Subagents) und v5 (alles Single-Context)?_

Generated: 2026-05-22T16:38:10Z

Cells declared: 8 · matched runs: 73 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 9 | 9 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 9 | 9 | ✅ |
| game-of-life-example-mapping | v6-hybrid | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v6-hybrid | opus-4-7-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking | 10 | 10 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow                 | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 | 625.9  |   167 |   932 | 289.39 |
| claim-office-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 | 819.78 |   628 |   939 | 104.23 |
| claim-office-example-mapping | v6-hybrid                | opus-4-7-no-thinking |   5 | 883.2  |   839 |   923 |  36.53 |
| claim-office-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 | 782.5  |   565 |   988 | 124.16 |
| game-of-life-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 | 166.6  |   146 |   201 |  17.65 |
| game-of-life-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 | 154.44 |   137 |   173 |  13.32 |
| game-of-life-example-mapping | v6-hybrid                | opus-4-7-no-thinking |  10 | 158.6  |   140 |   187 |  15.14 |
| game-of-life-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 | 170.3  |   138 |   224 |  26.17 |

### smell_total

| kata                         | workflow                 | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |   1.8  |     0 |    10 |  3.29 |
| claim-office-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |   9.56 |     0 |    20 |  7.88 |
| claim-office-example-mapping | v6-hybrid                | opus-4-7-no-thinking |   5 |   0.2  |     0 |     1 |  0.45 |
| claim-office-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |   3.3  |     0 |    15 |  5.06 |
| game-of-life-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |   2.6  |     2 |     4 |  0.7  |
| game-of-life-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |   4.33 |     2 |     7 |  1.73 |
| game-of-life-example-mapping | v6-hybrid                | opus-4-7-no-thinking |  10 |   2.2  |     2 |     3 |  0.42 |
| game-of-life-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |   2.8  |     2 |     5 |  0.92 |

### cc_longest_function

| kata                         | workflow                 | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |  25    |    11 |    76 | 19.7  |
| claim-office-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |  32.78 |    18 |    66 | 15.47 |
| claim-office-example-mapping | v6-hybrid                | opus-4-7-no-thinking |   5 |  21    |    12 |    29 |  7.18 |
| claim-office-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |  22.7  |     9 |    86 | 22.93 |
| game-of-life-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |   8.1  |     2 |    15 |  4.04 |
| game-of-life-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |  17.11 |     2 |    32 |  9.77 |
| game-of-life-example-mapping | v6-hybrid                | opus-4-7-no-thinking |  10 |  13.1  |     4 |    21 |  5.97 |
| game-of-life-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |  10.9  |     2 |    19 |  5.53 |

### cognitive_max

| kata                         | workflow                 | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |  10.5  |     4 |    30 |  9.44 |
| claim-office-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |  14.89 |     5 |    49 | 13.21 |
| claim-office-example-mapping | v6-hybrid                | opus-4-7-no-thinking |   5 |   6.6  |     3 |    14 |  4.28 |
| claim-office-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |  10.4  |     3 |    58 | 16.87 |
| game-of-life-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |   4.4  |     2 |    17 |  4.48 |
| game-of-life-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |  15.11 |    10 |    24 |  4.7  |
| game-of-life-example-mapping | v6-hybrid                | opus-4-7-no-thinking |  10 |   5.2  |     1 |     7 |  2.3  |
| game-of-life-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |   4.9  |     1 |    16 |  4.53 |

### mccabe_max

| kata                         | workflow                 | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |   7.9  |     4 |    14 |  4.15 |
| claim-office-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |  10.56 |     4 |    29 |  7.33 |
| claim-office-example-mapping | v6-hybrid                | opus-4-7-no-thinking |   5 |   6.2  |     4 |    12 |  3.35 |
| claim-office-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |   7.4  |     4 |    27 |  7.09 |
| game-of-life-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |   4.5  |     3 |    11 |  2.42 |
| game-of-life-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |   9    |     6 |    12 |  2.18 |
| game-of-life-example-mapping | v6-hybrid                | opus-4-7-no-thinking |  10 |   4.5  |     2 |     7 |  1.51 |
| game-of-life-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |   4.1  |     2 |     8 |  1.85 |

### duration_seconds

| kata                         | workflow                 | cell_model           |   n |    mean |   min |   max |     std |
|:-----------------------------|:-------------------------|:---------------------|----:|--------:|------:|------:|--------:|
| claim-office-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 | 3692.7  |  1640 |  4822 |  942.11 |
| claim-office-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |  688.22 |   526 |   822 |   97.14 |
| claim-office-example-mapping | v6-hybrid                | opus-4-7-no-thinking |   5 | 2116    |  1058 |  2883 |  716.26 |
| claim-office-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 | 2381.2  |  1360 |  5738 | 1275.32 |
| game-of-life-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 | 1162.9  |   604 |  3923 |  984.46 |
| game-of-life-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |  379.56 |   220 |   508 |  100.79 |
| game-of-life-example-mapping | v6-hybrid                | opus-4-7-no-thinking |  10 |  521.4  |   427 |   711 |   95.48 |
| game-of-life-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |  785.5  |   491 |  2697 |  678.61 |

### total_tokens

| kata                         | workflow                 | cell_model           |   n |        mean |      min |      max |              std |
|:-----------------------------|:-------------------------|:---------------------|----:|------------:|---------:|---------:|-----------------:|
| claim-office-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 | 1.3655e+07  |  9411553 | 16548065 |      2.09204e+06 |
| claim-office-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 | 1.46868e+07 |  7282501 | 23265439 |      5.33619e+06 |
| claim-office-example-mapping | v6-hybrid                | opus-4-7-no-thinking |   5 | 3.3248e+07  | 21492140 | 39096785 |      7.41969e+06 |
| claim-office-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 | 2.21062e+07 | 13621153 | 26237726 |      4.23211e+06 |
| game-of-life-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 | 2.56189e+06 |  2023377 |  3201698 | 382603           |
| game-of-life-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 | 9.04728e+06 |  4594513 | 12207170 |      2.63708e+06 |
| game-of-life-example-mapping | v6-hybrid                | opus-4-7-no-thinking |  10 | 6.62354e+06 |  4863281 |  8557921 |      1.31893e+06 |
| game-of-life-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 | 5.03416e+06 |  1014451 |  6649789 |      1.58323e+06 |

### tests_passing (rate %)

| kata                         | workflow                 | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:-------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |       9 |      100 |
| claim-office-example-mapping | v6-hybrid                | opus-4-7-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |       9 |      100 |
| game-of-life-example-mapping | v6-hybrid                | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |      10 |      100 |

### verification_pct

| kata                         | workflow                 | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |   0.67 |  0.2  |     1 |  0.36 |
| claim-office-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |   0.97 |  0.73 |     1 |  0.09 |
| claim-office-example-mapping | v6-hybrid                | opus-4-7-no-thinking |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |   0.78 |  0    |     1 |  0.42 |
| game-of-life-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v6-hybrid                | opus-4-7-no-thinking |  10 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |   1    |  1    |     1 |  0    |

### completed_within_budget (rate %)

| kata                         | workflow                 | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:-------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |       9 |      100 |
| claim-office-example-mapping | v6-hybrid                | opus-4-7-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |       9 |      100 |
| game-of-life-example-mapping | v6-hybrid                | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |      10 |      100 |

### mutation_score

| kata                         | workflow                 | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |   0.93 |  0.83 |  0.98 |  0.04 |
| claim-office-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |   0.87 |  0.84 |  0.9  |  0.02 |
| claim-office-example-mapping | v6-hybrid                | opus-4-7-no-thinking |   5 |   0.93 |  0.87 |  0.99 |  0.04 |
| claim-office-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |   0.92 |  0.86 |  0.97 |  0.03 |
| game-of-life-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |   0.91 |  0.74 |  0.96 |  0.08 |
| game-of-life-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |   0.94 |  0.84 |  0.96 |  0.04 |
| game-of-life-example-mapping | v6-hybrid                | opus-4-7-no-thinking |  10 |   0.95 |  0.94 |  0.96 |  0    |
| game-of-life-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |   0.92 |  0.71 |  0.96 |  0.08 |

### cycle_count

| kata                         | workflow                 | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |  37.8  |    16 |    49 |  9.51 |
| claim-office-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |   3.44 |     1 |     5 |  1.51 |
| claim-office-example-mapping | v6-hybrid                | opus-4-7-no-thinking |   5 |  25.8  |     8 |    33 | 10.8  |
| claim-office-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |  18.1  |     3 |    32 | 10.77 |
| game-of-life-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |   7.8  |     6 |     9 |  0.92 |
| game-of-life-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |   7.44 |     4 |     8 |  1.33 |
| game-of-life-example-mapping | v6-hybrid                | opus-4-7-no-thinking |  10 |   8.3  |     7 |    10 |  0.82 |
| game-of-life-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |   7.4  |     1 |    10 |  2.76 |

### refactorings_applied

| kata                         | workflow                 | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |  16.4  |     3 |    27 |  7.4  |
| claim-office-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |   2    |     1 |     3 |  0.87 |
| claim-office-example-mapping | v6-hybrid                | opus-4-7-no-thinking |   5 |  10.4  |     4 |    13 |  3.78 |
| claim-office-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |  11.3  |     3 |    20 |  6    |
| game-of-life-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |   5.9  |     3 |     8 |  2.02 |
| game-of-life-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |   6.67 |     2 |     8 |  2.4  |
| game-of-life-example-mapping | v6-hybrid                | opus-4-7-no-thinking |  10 |   4    |     3 |     8 |  1.63 |
| game-of-life-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |   3.5  |     1 |     6 |  1.35 |

### tests_passed_immediately

| kata                         | workflow                 | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |  17.8  |     6 |    27 |  6.97 |
| claim-office-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |   0.89 |     0 |     3 |  1.17 |
| claim-office-example-mapping | v6-hybrid                | opus-4-7-no-thinking |   5 |  10    |     2 |    14 |  4.74 |
| claim-office-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |   4.3  |     0 |    13 |  4.5  |
| game-of-life-example-mapping | v4-exact-subagents       | opus-4-7-no-thinking |  10 |   3.3  |     0 |     6 |  2.87 |
| game-of-life-example-mapping | v5-exact-single-context  | opus-4-7-no-thinking |   9 |   1    |     0 |     5 |  1.73 |
| game-of-life-example-mapping | v6-hybrid                | opus-4-7-no-thinking |  10 |   3.3  |     0 |     7 |  3.02 |
| game-of-life-example-mapping | v7-hybrid-green-refactor | opus-4-7-no-thinking |  10 |   4.1  |     1 |     8 |  2.18 |
