# RQ-lab-split-neutrality — Aggregation

_Is exact-hybrid-v2.4-lab-split-cc behaviourally equivalent to exact-hybrid-v2-testlist-fix-cc, as the exact-coding baseline recommendation assumes, and if not, does removing the duplicated cycle enumeration restore neutrality? The production files are byte-identical; the rule layout differs (lab infrastructure isolated in rules/lab-only.md, subagent contracts in rules/subagent-prompts.md), and lab-only.md states the Red/Green/Refactor cycle a second time as an imperative chain whose third link makes refactor an unconditional consequence of green. hybrid-v2.7 removes that second statement and keeps the phase-continuation guard._

Generated: 2026-10-12T08:37:57Z

Cells declared: 8 · matched runs: 59 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking | 18 | 18 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v2.4-lab-split-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v2.8-pure-split-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2.8-pure-split-cc | opus-5-no-thinking | 10 | 10 | ✅ |

## Outcome pivots (per cell)

### refactorings_applied

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 |   4.33 |  0.52 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |  18 |      0 |  21.28 |  7.55 |
| game-of-life-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 |   6.2  |  3.11 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 |  33    | 14.27 |
| game-of-life-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 |   5    |  2.45 |
| claim-office-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 |  26.4  | 11.61 |
| game-of-life-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |   5 |      0 |   5.6  |  3.36 |
| claim-office-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |  10 |      0 |  24.1  |  4.79 |

### cycle_count

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 |  10.33 | 1.37 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |  18 |      0 |  45.89 | 4.93 |
| game-of-life-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 |  10    | 0.71 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 |  48    | 2.55 |
| game-of-life-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 |  10.4  | 1.52 |
| claim-office-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 |  46.8  | 4.76 |
| game-of-life-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |   5 |      0 |   9.8  | 0.45 |
| claim-office-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |  10 |      0 |  46.1  | 3.67 |

### duration_seconds

| kata                         | cell_workflow                           | cell_model         |   n |   null |    mean |      sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|--------:|--------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 |  580.17 |  127.5  |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |  18 |      0 | 2650.06 |  464.89 |
| game-of-life-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 |  687    |  106.49 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 | 3841    | 1522.52 |
| game-of-life-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 |  639.8  |  130.71 |
| claim-office-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 | 3521    |  764.88 |
| game-of-life-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |   5 |      0 |  679.2  |  212.62 |
| claim-office-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |  10 |      0 | 3214.9  |  599.08 |

### total_tokens

| kata                         | cell_workflow                           | cell_model         |   n |   null |        mean |          sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|------------:|------------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 | 9.23738e+06 | 2.2932e+06  |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |  18 |      0 | 9.42234e+07 | 1.76387e+07 |
| game-of-life-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 | 1.19705e+07 | 1.77506e+06 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 | 1.40925e+08 | 4.64453e+07 |
| game-of-life-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 | 1.18154e+07 | 2.04067e+06 |
| claim-office-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 | 1.30442e+08 | 3.02119e+07 |
| game-of-life-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |   5 |      0 | 1.24772e+07 | 4.21349e+06 |
| claim-office-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |  10 |      0 | 1.13685e+08 | 2.44048e+07 |

### verification_pct

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |  18 |      0 |   0.96 | 0.03 |
| game-of-life-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 |   0.96 | 0.04 |
| game-of-life-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 |   0.96 | 0.04 |
| game-of-life-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |  10 |      0 |   0.95 | 0.03 |

### tests_passing

| kata                         | cell_workflow                           | cell_model         |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:-------------------|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |   6 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |  18 |  18 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |  10 |  10 |      0 |      100 |

### avg_loc_per_function

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 |   4.23 | 1.19 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |  18 |      0 |   3.81 | 0.64 |
| game-of-life-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 |   3.05 | 1.39 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 |   4.49 | 0.54 |
| game-of-life-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 |   3.17 | 1.52 |
| claim-office-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 |   4.47 | 1.2  |
| game-of-life-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |   5 |      0 |   5.41 | 1.54 |
| claim-office-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |  10 |      0 |   4.35 | 0.87 |

### longest_function

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 |  10.17 |  3.31 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |  18 |      0 |  16.22 |  5.78 |
| game-of-life-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 |   5.4  |  4.56 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 |  17.6  |  4.39 |
| game-of-life-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 |   6.2  |  3.42 |
| claim-office-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 |  24    | 11.29 |
| game-of-life-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |   5 |      0 |  13.4  |  6.35 |
| claim-office-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |  10 |      0 |  20.5  |  4.88 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 |   1.83 | 0.75 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |  18 |      0 |   2.78 | 1.35 |
| game-of-life-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 |   2.4  | 2.61 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 |   2.8  | 0.84 |
| game-of-life-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 |   2.2  | 1.1  |
| claim-office-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 |   2.8  | 0.84 |
| game-of-life-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |   5 |      0 |   3.6  | 1.95 |
| claim-office-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |  10 |      0 |   3.2  | 1.03 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 |   3.17 | 0.41 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |  18 |      0 |   3.39 | 0.78 |
| game-of-life-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 |   2.8  | 1.3  |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 |   3.4  | 0.55 |
| game-of-life-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 |   3    | 0.71 |
| claim-office-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 |   3.4  | 0.55 |
| game-of-life-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |   5 |      0 |   3.8  | 1.48 |
| claim-office-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |  10 |      0 |   3.8  | 0.79 |

### smell_total

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 |    1   | 1.55 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |  18 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 |    1.8 | 1.64 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 |    0.8 | 1.1  |
| claim-office-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |   5 |      0 |    1.2 | 1.64 |
| claim-office-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |  10 |      0 |    0   | 0    |

### code_mass

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 |  179   |  23.97 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |  18 |      0 |  859.5 |  99.25 |
| game-of-life-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 |  179.6 |  35.68 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 |  821.2 | 110.71 |
| game-of-life-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 |  156.2 |  25.4  |
| claim-office-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 |  953.8 | 136.49 |
| game-of-life-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |   5 |      0 |  177.2 |  23.65 |
| claim-office-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |  10 |      0 |  857.2 | 177.32 |

### predictions_correct_rate

| kata                         | cell_workflow                           | cell_model         |   n |    k |    t |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-----:|-----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |  124 |  124 |      0 |    100   |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |  18 | 1608 | 1614 |      0 |     99.6 |
| game-of-life-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |  101 |  101 |      0 |    100   |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |  478 |  480 |      0 |     99.6 |
| game-of-life-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |  103 |  104 |      0 |     99   |
| claim-office-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |  463 |  469 |      0 |     98.7 |
| game-of-life-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |   5 |   98 |   98 |      0 |    100   |
| claim-office-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |  10 |  920 |  924 |      0 |     99.6 |

### tests_passed_immediately

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |   6 |      0 |   7.33 |  1.03 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking |  18 |      0 |  24.28 |  5.18 |
| game-of-life-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 |   6    |  3.39 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-no-thinking |   5 |      0 |  20.4  | 11.84 |
| game-of-life-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 |   6.2  |  3.9  |
| claim-office-example-mapping | exact-hybrid-v2.7-continuation-guard-cc | opus-5-no-thinking |   5 |      0 |  24.8  |  3.7  |
| game-of-life-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |   5 |      0 |   4.8  |  3.96 |
| claim-office-example-mapping | exact-hybrid-v2.8-pure-split-cc         | opus-5-no-thinking |  10 |      0 |  24.4  |  3.27 |
