# RQ-end-refactor-v62 — Aggregation

_Does a metric-driven refactor pass improve code quality over the per-cycle baseline workflow (exact-hybrid-v4-cleaned-cc) — and does the lever work purely per-cycle (exact-hybrid-v4.4-metric-refactor-cc) or as an additional whole-src end pass (exact-hybrid-v5-end-refactor-cc) — without damaging correctness or TDD discipline, and does the result hold across two kata types (the multi-file CLI codebase claim-office vs the single-file library game-of-life)?_

Generated: 2026-10-12T10:46:43Z

Cells declared: 6 · matched runs: 43 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-7-portkey-no-thinking | 8 | 8 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-7-portkey-no-thinking | 15 | 15 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### cognitive_max

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |   8 |      0 |    5   | 1.77 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |  15 |      0 |    4   | 2.33 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 |    2.4 | 1.34 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 |    2.2 | 0.84 |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |    2.8 | 0.84 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |    3   | 2.24 |

### cognitive_avg

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |   8 |      0 |   1.91 | 0.75 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |  15 |      0 |   2.83 | 1.37 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   1.27 | 0.27 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   1.83 | 0.62 |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   1.39 | 0.31 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   2.2  | 1.04 |

### mccabe_max

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |   8 |      0 |   4.5  | 0.76 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |  15 |      0 |   4.13 | 1.13 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   3    | 1    |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   3.4  | 1.14 |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   3.4  | 0.55 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   3.2  | 0.45 |

### mccabe_avg

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |   8 |      0 |   1.53 | 0.2  |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |  15 |      0 |   1.91 | 0.5  |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   1.4  | 0.13 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   1.67 | 0.8  |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   1.44 | 0.09 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   1.63 | 0.64 |

### longest_function

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |   8 |      0 |  12.38 | 1.41 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |  15 |      0 |  11.47 | 5.95 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  13    | 3.08 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   8.4  | 3.36 |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |  11    | 0.71 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   9.8  | 2.59 |

### avg_loc_per_function

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |   8 |      0 |   4.22 | 0.3  |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |  15 |      0 |   4.75 | 1.8  |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   4.37 | 0.52 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   4.66 | 1.6  |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   3.66 | 0.4  |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   4.08 | 1.38 |

### smell_total

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |   8 |      0 |   0.38 | 0.74 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |  15 |      0 |   2.13 | 0.74 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   0    | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   0    | 0    |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   0    | 0    |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   0    | 0    |

### smell_complexity

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |   8 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |  15 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |      0 |    0 |

### code_mass

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |   8 |      0 |  878.5 | 91.44 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |  15 |      0 |  153.8 | 13.63 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  804.6 | 64.33 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  168.4 |  7.44 |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |  780.4 | 59.94 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |  168   |  8.6  |

### predictions_correct_rate

| kata                         | cell_workflow                        | cell_model                   |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |   8 | 581 | 598 |      0 |     97.2 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |  15 | 258 | 258 |      0 |    100   |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 | 360 | 402 |      0 |     89.6 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |  93 |  94 |      0 |     98.9 |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 | 321 | 340 |      0 |     94.4 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |  96 |  96 |      0 |    100   |

### tests_passing

| kata                         | cell_workflow                        | cell_model                   |   n |   k |   null |   rate_% |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |   8 |   8 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |  15 |  15 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |

### verification_pct

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |   8 |      0 |   0.96 | 0.09 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |  15 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   0.99 | 0.03 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   0.99 | 0.03 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   1    | 0    |

### duration_seconds

| kata                         | cell_workflow                        | cell_model                   |   n |   null |    mean |      sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|--------:|--------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |   8 |      0 | 2530.38 |  401.16 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |  15 |      0 |  717.27 |  171.17 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 | 5284.2  | 2336.56 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 | 1063.8  |  153.55 |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 | 3013.6  |  685.38 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 | 1331.6  |  148.81 |

### total_tokens

| kata                         | cell_workflow                        | cell_model                   |   n |   null |        mean |          sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |   8 |      0 | 5.22518e+07 | 5.60009e+06 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-portkey-no-thinking |  15 |      0 | 1.13281e+07 | 2.28464e+06 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 | 1.20136e+08 | 2.26897e+07 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-portkey-no-thinking |   5 |      0 | 1.53417e+07 | 2.52783e+06 |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 | 5.27905e+07 | 7.4886e+06  |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-7-portkey-no-thinking |   5 |      0 | 1.83304e+07 | 1.98088e+06 |
