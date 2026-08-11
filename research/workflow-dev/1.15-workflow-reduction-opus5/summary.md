# RQ-workflow-reduction-opus5 — Aggregation

_How much of the v6.6 architecture can be removed on opus-5 before code quality degrades — does dropping the end-refactor phase (v6.8) or additionally the isolated refactor subagent (v5.2) cost more than it saves?_

Generated: 2026-08-11T07:02:34Z

Cells declared: 10 · matched runs: 30 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v6.8-no-end-refactor-cc | opus-5-no-thinking | 0 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v6.8-no-end-refactor-cc | opus-5-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v5.2-no-subagent-cc | opus-5-no-thinking | 0 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v5.2-no-subagent-cc | opus-5-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v5.1-testlist-scope-fix | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v5.1-testlist-scope-fix | opus-5-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### cc_avg_loc_per_function

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   5.89 |  4.67 |  6.62 |  0.78 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   4.04 |  3.44 |  5    |  0.58 |
| claim-office-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |   3.21 |  2.91 |  3.48 |  0.24 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   4.12 |  3    |  5.78 |  1.12 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   4.54 |  2.83 |  5.33 |  1.03 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |   3.57 |  2.33 |  5.09 |  1.07 |

### cc_longest_function

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   18.6 |     8 |    24 |  6.69 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   17   |    11 |    22 |  4.47 |
| claim-office-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |   14.6 |    11 |    18 |  2.88 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |    8   |     7 |    10 |  1.41 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   10.8 |     6 |    15 |  3.27 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |    7.4 |     4 |     9 |  2.07 |

### cognitive_max

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |    2.8 |     1 |     5 |  1.48 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |    2.4 |     1 |     3 |  0.89 |
| claim-office-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |    2.2 |     1 |     3 |  1.1  |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |    1.8 |     1 |     4 |  1.3  |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |    1.8 |     1 |     3 |  0.84 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |    1.2 |     1 |     2 |  0.45 |

### cognitive_avg

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   1.65 |     1 |  2.18 |  0.43 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   1.34 |     1 |  1.91 |  0.37 |
| claim-office-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |   1.18 |     1 |  1.36 |  0.17 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   1.6  |     1 |  3    |  0.89 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   1.5  |     1 |  2    |  0.5  |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |   1.2  |     1 |  2    |  0.45 |

### mccabe_max

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |    3.4 |     2 |     4 |  0.89 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |    3.2 |     3 |     4 |  0.45 |
| claim-office-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |    3   |     2 |     4 |  0.71 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |    2.8 |     2 |     4 |  0.84 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |    3.2 |     3 |     4 |  0.45 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |    2.4 |     2 |     3 |  0.55 |

### smell_total

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |    1.2 |     0 |     3 |  1.64 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |

### code_mass

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |  569   |   177 |   770 | 227.85 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |  861.6 |   729 |   999 | 103.54 |
| claim-office-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 | 1002.8 |   896 |  1083 |  73.27 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |  176.2 |   128 |   198 |  28.1  |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |  181.8 |   142 |   211 |  25.68 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |  194.4 |   171 |   222 |  23.42 |

### verification_pct

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   0.79 |  0    |     1 |  0.44 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   0.99 |  0.93 |     1 |  0.03 |
| claim-office-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |   0.95 |  0.93 |     1 |  0.03 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                         | cell_workflow                  | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                  | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |       5 |      100 |

### cycle_count

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   27   |     2 |    48 | 20.94 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   42.8 |    38 |    52 |  5.76 |
| claim-office-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |   45   |    36 |    57 |  7.58 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |    7.2 |     5 |    10 |  2.59 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   10.4 |     9 |    13 |  1.52 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |   10.4 |    10 |    11 |  0.55 |

### refactorings_applied

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   12.2 |     2 |    30 | 12.3  |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   17.4 |     9 |    22 |  5.03 |
| claim-office-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |   43.4 |    36 |    57 |  8.44 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |    4.4 |     3 |     5 |  0.89 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |    4.4 |     4 |     5 |  0.55 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |    8.6 |     2 |    11 |  3.71 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                  | cell_model         |   n |   correct |   total |   rate_% |
|:-----------------------------|:-------------------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |       269 |     270 |     99.6 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |       433 |     433 |    100   |
| claim-office-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |       444 |     450 |     98.7 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |        72 |      72 |    100   |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |       104 |     104 |    100   |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 |       105 |     106 |     99.1 |

### duration_seconds

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 | 1388.8 |   252 |  2246 | 822.9  |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 | 2660.8 |  2130 |  3256 | 411.31 |
| claim-office-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 | 5551   |  4856 |  6450 | 794.37 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |  430.6 |   355 |   536 |  68.68 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |  620.6 |   509 |   722 |  89.77 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 | 1121   |   602 |  1408 | 321.99 |

### total_tokens

| kata                         | cell_workflow                  | cell_model         |   n |        mean |       min |       max |         std |
|:-----------------------------|:-------------------------------|:-------------------|----:|------------:|----------:|----------:|------------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 | 8.2553e+07  |   3841157 | 157449550 | 6.59236e+07 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 | 8.18549e+07 |  65109038 | 107931232 | 1.69643e+07 |
| claim-office-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 | 1.37357e+08 | 121120560 | 176135411 | 2.25471e+07 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 | 1.18026e+07 |   8095497 |  14837536 | 2.65544e+06 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 | 7.99486e+06 |   6503338 |  10565106 | 1.66386e+06 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   5 | 1.49692e+07 |   8780237 |  19927182 | 4.12498e+06 |
