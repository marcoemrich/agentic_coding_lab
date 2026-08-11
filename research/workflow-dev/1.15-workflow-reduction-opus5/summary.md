# RQ-workflow-reduction-opus5 — Aggregation

_How much of the v6.6 architecture can be removed on opus-5 before code quality degrades — and how much of its result comes from the APP subordination patch (v6.7) rather than from the end-refactor phase (v6.8) or the isolated refactor subagent (v5.2)?_

Generated: 2026-08-11T21:31:48Z

Cells declared: 12 · matched runs: 62 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| sphinx-score-example-mapping | v6.7-app-subordinate-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.7-app-subordinate-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| sphinx-score-example-mapping | v6.8-no-end-refactor-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.8-no-end-refactor-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| sphinx-score-example-mapping | v5.2-no-subagent-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v5.2-no-subagent-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| sphinx-score-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking | 5 | 5 | ✅ |
| sphinx-score-example-mapping | v5.1-testlist-scope-fix | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v5.1-testlist-scope-fix | opus-5-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### cc_avg_loc_per_function

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   4.12 |  3    |  5.78 |  1.12 |
| game-of-life-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |   4.04 |  3.22 |  5.8  |  1.03 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   4.54 |  2.83 |  5.33 |  1.03 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |   3.46 |  2.33 |  5.09 |  1    |
| game-of-life-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |   3.83 |  2.6  |  5.1  |  0.95 |
| game-of-life-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |   4.67 |  2.9  |  6.6  |  1.81 |
| sphinx-score-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   6.16 |  3.67 | 11    |  2.88 |
| sphinx-score-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |   3.16 |  2.38 |  4.43 |  0.76 |
| sphinx-score-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   3.68 |  3    |  5    |  0.88 |
| sphinx-score-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |   3.54 |  2    |  5.2  |  1.11 |
| sphinx-score-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |   2.96 |  2.62 |  4.17 |  0.68 |
| sphinx-score-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |   3.24 |  2.75 |  3.86 |  0.44 |

### cc_longest_function

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   8    |     7 |    10 |  1.41 |
| game-of-life-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |   8.8  |     6 |    13 |  2.68 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |  10.8  |     6 |    15 |  3.27 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |   7.5  |     4 |     9 |  1.87 |
| game-of-life-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |   7.2  |     5 |     9 |  1.48 |
| game-of-life-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |  11.8  |     7 |    23 |  6.72 |
| sphinx-score-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   8.6  |     6 |    15 |  3.65 |
| sphinx-score-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |   7.2  |     5 |    10 |  1.92 |
| sphinx-score-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   6.8  |     6 |     8 |  0.84 |
| sphinx-score-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |   5.83 |     2 |     7 |  1.94 |
| sphinx-score-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |   5.8  |     5 |     9 |  1.79 |
| sphinx-score-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |   7    |     6 |     9 |  1.22 |

### cognitive_max

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   1.8  |     1 |     4 |  1.3  |
| game-of-life-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |   3.2  |     1 |     8 |  3.19 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   1.8  |     1 |     3 |  0.84 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |   1.17 |     1 |     2 |  0.41 |
| game-of-life-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |   1.4  |     1 |     2 |  0.55 |
| game-of-life-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |   2.8  |     1 |     7 |  2.68 |
| sphinx-score-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   1.4  |     1 |     3 |  0.89 |
| sphinx-score-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |   1    |     1 |     1 |  0    |
| sphinx-score-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   1    |     1 |     1 |  0    |
| sphinx-score-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |   1    |     1 |     1 |  0    |
| sphinx-score-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |   1    |     1 |     1 |  0    |
| sphinx-score-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |   1.4  |     1 |     3 |  0.89 |

### cognitive_avg

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   1.6  |     1 |  3    |  0.89 |
| game-of-life-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |   2.8  |     1 |  7.5  |  2.84 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   1.5  |     1 |  2    |  0.5  |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |   1.17 |     1 |  2    |  0.41 |
| game-of-life-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |   1.13 |     1 |  1.33 |  0.18 |
| game-of-life-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |   2.1  |     1 |  4.5  |  1.6  |
| sphinx-score-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   1.4  |     1 |  3    |  0.89 |
| sphinx-score-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |   1    |     1 |  1    |  0    |
| sphinx-score-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   1    |     1 |  1    |  0    |
| sphinx-score-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |   1    |     1 |  1    |  0    |
| sphinx-score-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |   1    |     1 |  1    |  0    |
| sphinx-score-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |   1.13 |     1 |  1.67 |  0.3  |

### mccabe_max

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |    2.8 |     2 |     4 |  0.84 |
| game-of-life-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |    3.8 |     2 |     7 |  2.17 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |    3.2 |     3 |     4 |  0.45 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |    2.5 |     2 |     3 |  0.55 |
| game-of-life-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |    2.6 |     2 |     3 |  0.55 |
| game-of-life-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |    3.2 |     2 |     6 |  1.79 |
| sphinx-score-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |    2.4 |     2 |     4 |  0.89 |
| sphinx-score-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |    2   |     2 |     2 |  0    |
| sphinx-score-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |    2   |     2 |     2 |  0    |
| sphinx-score-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |    2   |     2 |     2 |  0    |
| sphinx-score-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |    2.4 |     2 |     3 |  0.55 |
| sphinx-score-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |    2.2 |     2 |     3 |  0.45 |

### smell_total

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |    1.2 |     0 |     3 |  1.64 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |    0.6 |     0 |     3 |  1.34 |
| game-of-life-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |    1.6 |     0 |     3 |  1.52 |
| sphinx-score-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |    0.6 |     0 |     3 |  1.34 |
| sphinx-score-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |    0.4 |     0 |     2 |  0.89 |
| sphinx-score-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |    0.2 |     0 |     1 |  0.45 |
| sphinx-score-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |    0   |     0 |     0 |  0    |
| sphinx-score-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| sphinx-score-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |

### code_mass

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 | 176.2  |   128 |   198 | 28.1  |
| game-of-life-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 | 199.2  |   185 |   217 | 11.58 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 | 181.8  |   142 |   211 | 25.68 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 | 195.83 |   171 |   222 | 21.24 |
| game-of-life-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 | 184.4  |   138 |   214 | 33.63 |
| game-of-life-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 | 184.4  |   151 |   245 | 37.25 |
| sphinx-score-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 | 159.8  |   141 |   177 | 14.17 |
| sphinx-score-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 | 194.6  |   179 |   216 | 14.24 |
| sphinx-score-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 | 169.8  |   144 |   194 | 24.09 |
| sphinx-score-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 | 182.83 |   154 |   251 | 36.22 |
| sphinx-score-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 | 178    |   163 |   200 | 15.05 |
| sphinx-score-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 | 198.4  |   187 |   213 | 10.67 |

### verification_pct

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   1    |  1    |     1 |   0   |
| game-of-life-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |   1    |  1    |     1 |   0   |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   1    |  1    |     1 |   0   |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |   1    |  1    |     1 |   0   |
| game-of-life-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |   1    |  1    |     1 |   0   |
| game-of-life-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |   1    |  1    |     1 |   0   |
| sphinx-score-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   1    |  1    |     1 |   0   |
| sphinx-score-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |   1    |  1    |     1 |   0   |
| sphinx-score-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   1    |  1    |     1 |   0   |
| sphinx-score-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |   1    |  1    |     1 |   0   |
| sphinx-score-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |   0.92 |  0.81 |     1 |   0.1 |
| sphinx-score-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |   1    |  1    |     1 |   0   |

### tests_passing (rate %)

| kata                         | cell_workflow                  | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |       5 |      100 |
| sphinx-score-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |       5 |      100 |
| sphinx-score-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |       5 |      100 |
| sphinx-score-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |       5 |      100 |
| sphinx-score-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |       6 |      100 |
| sphinx-score-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |       5 |      100 |
| sphinx-score-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                  | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |       5 |      100 |
| sphinx-score-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |       5 |      100 |
| sphinx-score-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |       5 |      100 |
| sphinx-score-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |       5 |      100 |
| sphinx-score-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |       6 |      100 |
| sphinx-score-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |       5 |      100 |
| sphinx-score-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |       5 |      100 |

### cycle_count

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   7.2  |     5 |    10 |  2.59 |
| game-of-life-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |  10.2  |     8 |    13 |  1.79 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |  10.4  |     9 |    13 |  1.52 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |  10.33 |    10 |    11 |  0.52 |
| game-of-life-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |  10.2  |     9 |    13 |  1.64 |
| game-of-life-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |  10.6  |    10 |    12 |  0.89 |
| sphinx-score-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |  10.8  |    10 |    13 |  1.3  |
| sphinx-score-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |  10.2  |    10 |    11 |  0.45 |
| sphinx-score-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |  10.4  |    10 |    11 |  0.55 |
| sphinx-score-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |  11.67 |    10 |    16 |  2.16 |
| sphinx-score-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |  10.6  |    10 |    12 |  0.89 |
| sphinx-score-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |  10.2  |    10 |    11 |  0.45 |

### refactorings_applied

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   4.4  |     3 |     5 |  0.89 |
| game-of-life-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |   9.2  |     6 |    12 |  2.28 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   4.4  |     4 |     5 |  0.55 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |   8.83 |     2 |    11 |  3.37 |
| game-of-life-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |   9    |     3 |    13 |  3.67 |
| game-of-life-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |   9.2  |     5 |    11 |  2.39 |
| sphinx-score-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |   5.8  |     2 |    13 |  4.49 |
| sphinx-score-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |   9    |     5 |    10 |  2.24 |
| sphinx-score-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   6    |     5 |     7 |  0.71 |
| sphinx-score-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |  11.67 |    10 |    16 |  2.16 |
| sphinx-score-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |  10.4  |     9 |    12 |  1.14 |
| sphinx-score-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |   7.8  |     6 |    10 |  2.05 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                  | cell_model         |   n |   correct |   total |   rate_% |
|:-----------------------------|:-------------------------------|:-------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |        72 |      72 |    100   |
| game-of-life-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |       101 |     102 |     99   |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |       104 |     104 |    100   |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |       124 |     126 |     98.4 |
| game-of-life-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |       102 |     102 |    100   |
| game-of-life-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |       107 |     107 |    100   |
| sphinx-score-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |        99 |      99 |    100   |
| sphinx-score-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |       102 |     102 |    100   |
| sphinx-score-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |       104 |     104 |    100   |
| sphinx-score-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 |       139 |     140 |     99.3 |
| sphinx-score-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 |       106 |     106 |    100   |
| sphinx-score-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |       102 |     102 |    100   |

### duration_seconds

| kata                         | cell_workflow                  | cell_model         |   n |    mean |   min |   max |    std |
|:-----------------------------|:-------------------------------|:-------------------|----:|--------:|------:|------:|-------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |  430.6  |   355 |   536 |  68.68 |
| game-of-life-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |  743    |   529 |   936 | 145.06 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |  620.6  |   509 |   722 |  89.77 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 | 1145.33 |   602 |  1408 | 294.1  |
| game-of-life-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 | 1183.2  |   794 |  1407 | 259.14 |
| game-of-life-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 | 1097.4  |   686 |  1436 | 269.72 |
| sphinx-score-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 |  609    |   381 |   920 | 208.66 |
| sphinx-score-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 |  744.6  |   479 |   964 | 207.69 |
| sphinx-score-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |  785.8  |   688 |   854 |  66.11 |
| sphinx-score-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 | 1475    |  1258 |  1911 | 227.02 |
| sphinx-score-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 | 1264.4  |  1073 |  1491 | 160.22 |
| sphinx-score-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 |  985.6  |   841 |  1135 | 117.46 |

### total_tokens

| kata                         | cell_workflow                  | cell_model         |   n |        mean |      min |      max |              std |
|:-----------------------------|:-------------------------------|:-------------------|----:|------------:|---------:|---------:|-----------------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 | 1.18026e+07 |  8095497 | 14837536 |      2.65544e+06 |
| game-of-life-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 | 2.11134e+07 | 12482049 | 28733215 |      6.00616e+06 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 | 7.99486e+06 |  6503338 | 10565106 |      1.66386e+06 |
| game-of-life-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 | 1.50243e+07 |  8780237 | 19927182 |      3.69196e+06 |
| game-of-life-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 | 1.51037e+07 |  9703302 | 18950101 |      4.09419e+06 |
| game-of-life-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 | 1.22266e+07 |  8873521 | 15713360 |      2.77031e+06 |
| sphinx-score-example-mapping | v5.1-testlist-scope-fix        | opus-5-no-thinking |   5 | 1.66434e+07 |  9156744 | 29666022 |      7.98071e+06 |
| sphinx-score-example-mapping | v5.2-no-subagent-cc            | opus-5-no-thinking |   5 | 1.87542e+07 | 12083900 | 24584975 |      4.48638e+06 |
| sphinx-score-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 | 1.05637e+07 |  9302858 | 11251467 | 747475           |
| sphinx-score-example-mapping | v6.6-lab-split-cc              | opus-5-no-thinking |   6 | 1.9079e+07  | 14796862 | 30728141 |      5.91678e+06 |
| sphinx-score-example-mapping | v6.7-app-subordinate-cc        | opus-5-no-thinking |   5 | 1.46813e+07 | 10730323 | 16417988 |      2.28789e+06 |
| sphinx-score-example-mapping | v6.8-no-end-refactor-cc        | opus-5-no-thinking |   5 | 1.22992e+07 | 10620924 | 14650830 |      1.98567e+06 |
