# RQ-workflow-reduction-opus5 — Aggregation

_How much of the hybrid-v6 architecture can be removed on opus-5 before code quality degrades — and how much of its result comes from the APP subordination patch (hybrid-v7) rather than from the end-refactor phase (hybrid-v8) or the isolated refactor subagent (single-context-v3)?_

Generated: 2026-10-12T10:46:44Z

Cells declared: 12 · matched runs: 63 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| sphinx-score-example-mapping | exact-hybrid-v7-app-subordinate-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v7-app-subordinate-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| sphinx-score-example-mapping | exact-hybrid-v8-no-end-refactor-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v8-no-end-refactor-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| sphinx-score-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| sphinx-score-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| sphinx-score-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### avg_loc_per_function

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |      0 |   2.96 | 0.68 |
| game-of-life-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |      0 |   3.83 | 0.95 |
| sphinx-score-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |      0 |   3.24 | 0.44 |
| game-of-life-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |      0 |   4.67 | 1.81 |
| sphinx-score-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |      0 |   3.16 | 0.76 |
| game-of-life-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |      0 |   4.04 | 1.03 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |      0 |   3.54 | 1.11 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |      0 |   3.46 | 1    |
| sphinx-score-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   5 |      0 |   3.68 | 0.88 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 |   4.23 | 1.19 |
| sphinx-score-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |      0 |   6.16 | 2.88 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |      0 |   4.12 | 1.12 |

### longest_function

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |      0 |   5.8  | 1.79 |
| game-of-life-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |      0 |   7.2  | 1.48 |
| sphinx-score-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |      0 |   7    | 1.22 |
| game-of-life-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |      0 |  11.8  | 6.72 |
| sphinx-score-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |      0 |   7.2  | 1.92 |
| game-of-life-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |      0 |   8.8  | 2.68 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |      0 |   5.83 | 1.94 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |      0 |   7.5  | 1.87 |
| sphinx-score-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   5 |      0 |   6.8  | 0.84 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 |  10.17 | 3.31 |
| sphinx-score-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |      0 |   8.6  | 3.65 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |      0 |   8    | 1.41 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |      0 |   1.4  | 0.55 |
| sphinx-score-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |      0 |   1.4  | 0.89 |
| game-of-life-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |      0 |   2.8  | 2.68 |
| sphinx-score-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |      0 |   3.2  | 3.19 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |      0 |   1.17 | 0.41 |
| sphinx-score-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 |   1.83 | 0.75 |
| sphinx-score-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |      0 |   1.4  | 0.89 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |      0 |   1.8  | 1.3  |

### cognitive_avg

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |      0 |   1.13 | 0.18 |
| sphinx-score-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |      0 |   1.13 | 0.3  |
| game-of-life-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |      0 |   2.1  | 1.6  |
| sphinx-score-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |      0 |   2.8  | 2.84 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |      0 |   1.17 | 0.41 |
| sphinx-score-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 |   1.58 | 0.49 |
| sphinx-score-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |      0 |   1.4  | 0.89 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |      0 |   1.6  | 0.89 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |      0 |   2.4  | 0.55 |
| game-of-life-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |      0 |   2.6  | 0.55 |
| sphinx-score-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |      0 |   2.2  | 0.45 |
| game-of-life-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |      0 |   3.2  | 1.79 |
| sphinx-score-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |      0 |   2    | 0    |
| game-of-life-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |      0 |   3.8  | 2.17 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |      0 |   2    | 0    |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |      0 |   2.5  | 0.55 |
| sphinx-score-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   5 |      0 |   2    | 0    |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 |   3.17 | 0.41 |
| sphinx-score-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |      0 |   2.4  | 0.89 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |      0 |   2.8  | 0.84 |

### smell_total

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |      0 |    0.6 | 1.34 |
| sphinx-score-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |      0 |    1.6 | 1.52 |
| sphinx-score-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |      0 |    0.4 | 0.89 |
| game-of-life-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |      0 |    0   | 0    |
| sphinx-score-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   5 |      0 |    0.2 | 0.45 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 |    1   | 1.55 |
| sphinx-score-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |      0 |    0.6 | 1.34 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |      0 |    0   | 0    |

### code_mass

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|------:|
| sphinx-score-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |      0 | 178    | 15.05 |
| game-of-life-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |      0 | 184.4  | 33.63 |
| sphinx-score-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |      0 | 198.4  | 10.67 |
| game-of-life-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |      0 | 184.4  | 37.25 |
| sphinx-score-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |      0 | 194.6  | 14.24 |
| game-of-life-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |      0 | 199.2  | 11.58 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |      0 | 182.83 | 36.22 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |      0 | 195.83 | 21.24 |
| sphinx-score-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   5 |      0 | 169.8  | 24.09 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 | 179    | 23.97 |
| sphinx-score-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |      0 | 159.8  | 14.17 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |      0 | 176.2  | 28.1  |

### verification_pct

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |      0 |   0.93 |  0.1 |
| game-of-life-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |      0 |   1    |  0   |
| sphinx-score-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |      0 |   1    |  0   |
| game-of-life-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |      0 |   1    |  0   |
| sphinx-score-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |      0 |   1    |  0   |
| game-of-life-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |      0 |   1    |  0   |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |      0 |   1    |  0   |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |      0 |   1    |  0   |
| sphinx-score-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   5 |      0 |   1    |  0   |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 |   1    |  0   |
| sphinx-score-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |      0 |   1    |  0   |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |      0 |   1    |  0   |

### tests_passing

| kata                         | cell_workflow                           | cell_model         |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:-------------------|----:|----:|-------:|---------:|
| sphinx-score-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| sphinx-score-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| sphinx-score-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |   6 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |   6 |      0 |      100 |
| sphinx-score-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |   6 |      0 |      100 |
| sphinx-score-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |   5 |      0 |      100 |

### predictions_correct_rate

| kata                         | cell_workflow                           | cell_model         |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:-------------------|----:|----:|----:|-------:|---------:|
| sphinx-score-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 | 106 | 106 |      0 |    100   |
| game-of-life-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 | 102 | 102 |      0 |    100   |
| sphinx-score-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 | 102 | 102 |      0 |    100   |
| game-of-life-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 | 107 | 107 |      0 |    100   |
| sphinx-score-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 | 102 | 102 |      0 |    100   |
| game-of-life-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 | 101 | 102 |      0 |     99   |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 | 139 | 140 |      0 |     99.3 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 | 124 | 126 |      0 |     98.4 |
| sphinx-score-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   5 | 104 | 104 |      0 |    100   |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 | 124 | 124 |      0 |    100   |
| sphinx-score-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |  99 |  99 |      0 |    100   |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |  72 |  72 |      0 |    100   |

### duration_seconds

| kata                         | cell_workflow                           | cell_model         |   n |   null |    mean |     sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|--------:|-------:|
| sphinx-score-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |      0 | 1264.4  | 160.22 |
| game-of-life-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |      0 | 1183.2  | 259.14 |
| sphinx-score-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |      0 |  985.6  | 117.46 |
| game-of-life-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |      0 | 1097.4  | 269.72 |
| sphinx-score-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |      0 |  744.6  | 207.69 |
| game-of-life-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |      0 |  743    | 145.06 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |      0 | 1475    | 227.02 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |      0 | 1145.33 | 294.1  |
| sphinx-score-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   5 |      0 |  785.8  |  66.11 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 |  580.17 | 127.5  |
| sphinx-score-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |      0 |  609    | 208.66 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |      0 |  430.6  |  68.68 |

### total_tokens

| kata                         | cell_workflow                           | cell_model         |   n |   null |        mean |               sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|------------:|-----------------:|
| sphinx-score-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |      0 | 1.92745e+07 |      2.86206e+06 |
| game-of-life-example-mapping | exact-hybrid-v7-app-subordinate-cc      | opus-5-no-thinking |   5 |      0 | 1.93744e+07 |      5.00908e+06 |
| sphinx-score-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |      0 | 1.52538e+07 |      2.68513e+06 |
| game-of-life-example-mapping | exact-hybrid-v8-no-end-refactor-cc      | opus-5-no-thinking |   5 |      0 | 1.57811e+07 |      3.82141e+06 |
| sphinx-score-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |      0 | 1.87542e+07 |      4.48638e+06 |
| game-of-life-example-mapping | exact-single-context-v3-no-subagent-cc  | opus-5-no-thinking |   5 |      0 | 2.11134e+07 |      6.00616e+06 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |      0 | 2.51255e+07 |      6.47713e+06 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking |   6 |      0 | 1.96883e+07 |      4.62056e+06 |
| sphinx-score-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   5 |      0 | 1.24763e+07 | 871959           |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 | 9.23738e+06 |      2.2932e+06  |
| sphinx-score-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |      0 | 1.66434e+07 |      7.98071e+06 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking |   5 |      0 | 1.18026e+07 |      2.65544e+06 |
