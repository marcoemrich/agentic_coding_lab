# RQ-end-refactor-opus48 — Aggregation

_Does the exact-hybrid-v5-end-refactor-cc result from RQ-1.12 (correctness intact, code quality >= hybrid-v4, token cost ~hybrid-v4) hold on Opus 4.8 (no-thinking) — or does the additional end-refactor pass fake claim-office completeness on the new model (the bundle-break pattern from RQ-1.9/RQ-1.10)?_

Generated: 2026-10-12T10:46:44Z

Cells declared: 6 · matched runs: 29 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-no-thinking | 4 | 4 | ⚠️ below min_replicates (4/5) |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc | opus-4-8-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc | opus-4-8-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                        | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   4 |      0 |   0.75 |  0.5 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   5 |      0 |   1    |  0   |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 |   1    |  0   |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 |   1    |  0   |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 |   1    |  0   |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 |   1    |  0   |

### tests_passing

| kata                         | cell_workflow                        | cell_model           |   n |   k |   null |   rate_% |
|:-----------------------------|:-------------------------------------|:---------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   4 |   4 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |   5 |      0 |      100 |

### cognitive_max

| kata                         | cell_workflow                        | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   4 |      0 |   3.25 | 0.96 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   5 |      0 |   5.6  | 1.52 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 |   3.6  | 0.89 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 |   3.2  | 1.3  |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 |   2.8  | 0.84 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 |   2.4  | 1.34 |

### cognitive_avg

| kata                         | cell_workflow                        | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   4 |      0 |   1.47 | 0.31 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   5 |      0 |   3.87 | 1.43 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 |   1.62 | 0.29 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 |   2.7  | 1.15 |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 |   1.4  | 0.49 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 |   2.1  | 1.02 |

### mccabe_max

| kata                         | cell_workflow                        | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   4 |      0 |   3.75 | 0.5  |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   5 |      0 |   5    | 1.41 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 |   4    | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 |   3.6  | 0.89 |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 |   3.2  | 0.45 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 |   3.4  | 1.14 |

### mccabe_avg

| kata                         | cell_workflow                        | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   4 |      0 |   1.5  | 0.12 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   5 |      0 |   2.11 | 0.88 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 |   1.48 | 0.19 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 |   1.7  | 0.56 |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 |   1.47 | 0.17 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 |   1.76 | 0.84 |

### longest_function

| kata                         | cell_workflow                        | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   4 |      0 |   23.5 | 8.35 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   5 |      0 |   11.8 | 6.5  |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 |   15.6 | 3.05 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 |    8.6 | 4.67 |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 |   16   | 4.74 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 |    9.4 | 1.67 |

### avg_loc_per_function

| kata                         | cell_workflow                        | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   4 |      0 |   4.38 | 0.69 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   5 |      0 |   4.89 | 2.06 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 |   4.44 | 1.41 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 |   4.75 | 2.05 |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 |   3.81 | 0.48 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 |   4.76 | 0.89 |

### smell_total

| kata                         | cell_workflow                        | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   4 |      0 |   1.25 | 0.5  |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   5 |      0 |   2    | 1.22 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 |   0    | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 |   0    | 0    |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 |   0    | 0    |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 |   0    | 0    |

### smell_complexity

| kata                         | cell_workflow                        | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   4 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 |      0 |    0 |

### code_mass

| kata                         | cell_workflow                        | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   4 |      0 |  882   | 112.7  |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   5 |      0 |  171.8 |  19.41 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 |  843   |  53.4  |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 |  164.2 |   9.96 |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 |  872.6 |  91.61 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 |  168.4 |  18.01 |

### predictions_correct_rate

| kata                         | cell_workflow                        | cell_model           |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:-------------------------------------|:---------------------|----:|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   4 | 298 | 299 |      0 |     99.7 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   4 |  69 |  70 |      1 |     98.6 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 | 408 | 409 |      0 |     99.8 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |  90 |  90 |      0 |    100   |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 | 376 | 378 |      0 |     99.5 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |  83 |  85 |      0 |     97.6 |

### duration_seconds

| kata                         | cell_workflow                        | cell_model           |   n |   null |   mean |      sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|-------:|--------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   4 |      0 | 3399   | 1041.67 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   5 |      0 |  579.2 |  157.85 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 | 3064.2 |  836.22 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 |  679.2 |  129.78 |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 | 3220.6 |  378.15 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 |  746.8 |  122.59 |

### total_tokens

| kata                         | cell_workflow                        | cell_model           |   n |   null |        mean |          sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   4 |      0 | 9.98548e+07 | 3.84779e+07 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-8-no-thinking |   5 |      0 | 8.96174e+06 | 2.15189e+06 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 | 9.92818e+07 | 3.40069e+07 |
| game-of-life-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-8-no-thinking |   5 |      0 | 1.13553e+07 | 1.89397e+06 |
| claim-office-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 | 9.83907e+07 | 1.38351e+07 |
| game-of-life-example-mapping | exact-hybrid-v5-end-refactor-cc      | opus-4-8-no-thinking |   5 |      0 | 1.16075e+07 | 1.64131e+06 |
