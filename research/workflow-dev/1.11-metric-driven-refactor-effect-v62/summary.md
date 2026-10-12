# RQ-metric-driven-refactor-v62 — Aggregation

_Does a refactor agent that measures deterministic metrics itself pre/post (ESLint smells, SonarJS cognitive complexity, McCabe cyclomatic complexity) and reports APP mass alongside them improve code quality on claim-office relative to the baseline exact-hybrid-v4-cleaned-cc workflow — without damaging correctness or TDD discipline?_

Generated: 2026-10-12T16:44:07Z

Cells declared: 2 · matched runs: 13 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-7-no-thinking | 8 | 8 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### cognitive_max

| kata                         | cell_workflow                        | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-no-thinking |   8 |      0 |    5   | 1.77 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-no-thinking |   5 |      0 |    2.4 | 1.34 |

### cognitive_avg

| kata                         | cell_workflow                        | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-no-thinking |   8 |      0 |   1.91 | 0.75 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-no-thinking |   5 |      0 |   1.27 | 0.27 |

### mccabe_max

| kata                         | cell_workflow                        | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-no-thinking |   8 |      0 |    4.5 | 0.76 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-no-thinking |   5 |      0 |    3   | 1    |

### mccabe_avg

| kata                         | cell_workflow                        | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-no-thinking |   8 |      0 |   1.53 | 0.2  |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-no-thinking |   5 |      0 |   1.4  | 0.13 |

### longest_function

| kata                         | cell_workflow                        | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-no-thinking |   8 |      0 |  12.38 | 1.41 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-no-thinking |   5 |      0 |  13    | 3.08 |

### avg_loc_per_function

| kata                         | cell_workflow                        | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-no-thinking |   8 |      0 |   4.22 | 0.3  |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-no-thinking |   5 |      0 |   4.37 | 0.52 |

### smell_total

| kata                         | cell_workflow                        | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-no-thinking |   8 |      0 |   0.38 | 0.74 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-no-thinking |   5 |      0 |   0    | 0    |

### code_mass

| kata                         | cell_workflow                        | cell_model           |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-no-thinking |   8 |      0 |  878.5 | 91.44 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-no-thinking |   5 |      0 |  804.6 | 64.33 |

### predictions_correct_rate

| kata                         | cell_workflow                        | cell_model           |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:-------------------------------------|:---------------------|----:|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-no-thinking |   8 | 581 | 598 |      0 |     97.2 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-no-thinking |   5 | 360 | 402 |      0 |     89.6 |

### tests_passing

| kata                         | cell_workflow                        | cell_model           |   n |   k |   null |   rate_% |
|:-----------------------------|:-------------------------------------|:---------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-no-thinking |   8 |   8 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-no-thinking |   5 |   5 |      0 |      100 |

### verification_pct

| kata                         | cell_workflow                        | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-no-thinking |   8 |      0 |   0.96 | 0.09 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-no-thinking |   5 |      0 |   0.99 | 0.03 |

### duration_seconds

| kata                         | cell_workflow                        | cell_model           |   n |   null |    mean |      sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|--------:|--------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-no-thinking |   8 |      0 | 2530.38 |  401.16 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-no-thinking |   5 |      0 | 5284.2  | 2336.56 |

### total_tokens

| kata                         | cell_workflow                        | cell_model           |   n |   null |      mean |          sd |
|:-----------------------------|:-------------------------------------|:---------------------|----:|-------:|----------:|------------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc           | opus-4-7-no-thinking |   8 |      0 |  52251790 | 5.60009e+06 |
| claim-office-example-mapping | exact-hybrid-v4.4-metric-refactor-cc | opus-4-7-no-thinking |   5 |      0 | 120136061 | 2.26897e+07 |
