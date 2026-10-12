# RQ-refactor-vocab-v62 — Aggregation

_Does an additive vocabulary block in the refactor agent (cyclomatic + cognitive complexity, single responsibility, smell→move table) improve code quality on the exact-hybrid-v4-cleaned-cc base without significantly impairing correctness or cost?_

Generated: 2026-10-12T16:44:07Z

Cells declared: 4 · matched runs: 28 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-7-portkey-no-thinking | 8 | 8 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### cognitive_max

| kata                         | cell_workflow                       | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |  10 |      0 |    4.3 | 2.79 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |   8 |      0 |    5   | 1.77 |
| game-of-life-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 |    4.2 | 2.17 |
| claim-office-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 |    2.4 | 0.89 |

### cognitive_avg

| kata                         | cell_workflow                       | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |  10 |      0 |   2.9  | 1.67 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |   8 |      0 |   1.91 | 0.75 |
| game-of-life-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   2.9  | 0.82 |
| claim-office-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   1.52 | 0.42 |

### mccabe_max

| kata                         | cell_workflow                       | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |  10 |      0 |    4.2 | 1.32 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |   8 |      0 |    4.5 | 0.76 |
| game-of-life-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 |    3.8 | 0.45 |
| claim-office-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 |    2.8 | 0.45 |

### mccabe_avg

| kata                         | cell_workflow                       | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |  10 |      0 |   2.01 | 0.58 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |   8 |      0 |   1.53 | 0.2  |
| game-of-life-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   1.67 | 0.42 |
| claim-office-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   1.49 | 0.13 |

### longest_function

| kata                         | cell_workflow                       | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |  10 |      0 |  12.2  | 6.89 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |   8 |      0 |  12.38 | 1.41 |
| game-of-life-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  10    | 5.61 |
| claim-office-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  10.2  | 2.59 |

### avg_loc_per_function

| kata                         | cell_workflow                       | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |  10 |      0 |   5.2  | 1.98 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |   8 |      0 |   4.22 | 0.3  |
| game-of-life-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   4.42 | 2.15 |
| claim-office-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   4.35 | 1.04 |

### smell_total

| kata                         | cell_workflow                       | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |  10 |      0 |   2.4  | 0.52 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |   8 |      0 |   0.38 | 0.74 |
| game-of-life-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   2.2  | 0.45 |
| claim-office-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   0    | 0    |

### code_mass

| kata                         | cell_workflow                       | cell_model                   |   n |   null |   mean |     sd |
|:-----------------------------|:------------------------------------|:-----------------------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |  10 |      0 |  153.3 |  13.83 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |   8 |      0 |  878.5 |  91.44 |
| game-of-life-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  171.6 |  26.02 |
| claim-office-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  372   | 232.12 |

### predictions_correct_rate

| kata                         | cell_workflow                       | cell_model                   |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:------------------------------------|:-----------------------------|----:|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |  10 | 170 | 170 |      0 |    100   |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |   8 | 581 | 598 |      0 |     97.2 |
| game-of-life-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |  90 |  92 |      0 |     97.8 |
| claim-office-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 | 153 | 156 |      0 |     98.1 |

### tests_passing

| kata                         | cell_workflow                       | cell_model                   |   n |   k |   null |   rate_% |
|:-----------------------------|:------------------------------------|:-----------------------------|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |  10 |  10 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |   8 |   8 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |

### verification_pct

| kata                         | cell_workflow                       | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |  10 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |   8 |      0 |   0.96 | 0.09 |
| game-of-life-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   0.23 | 0.4  |

### duration_seconds

| kata                         | cell_workflow                       | cell_model                   |   n |   null |    mean |     sd |
|:-----------------------------|:------------------------------------|:-----------------------------|----:|-------:|--------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |  10 |      0 |  627    | 117.15 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |   8 |      0 | 2530.38 | 401.16 |
| game-of-life-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  715.8  |  70.48 |
| claim-office-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 | 1141.6  | 754.24 |

### total_tokens

| kata                         | cell_workflow                       | cell_model                   |   n |   null |        mean |          sd |
|:-----------------------------|:------------------------------------|:-----------------------------|----:|-------:|------------:|------------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |  10 |      0 | 1.04769e+07 | 2.07624e+06 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc          | opus-4-7-portkey-no-thinking |   8 |      0 | 5.22518e+07 | 5.60009e+06 |
| game-of-life-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 | 1.2272e+07  | 1.64883e+06 |
| claim-office-example-mapping | exact-hybrid-v4.1-refactor-vocab-cc | opus-4-7-portkey-no-thinking |   5 |      0 | 2.25735e+07 | 1.72796e+07 |
