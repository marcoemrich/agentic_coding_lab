# RQ-ptdd-refactor-subagent-cross-model — Aggregation

_Does isolating only the per-cycle Refactor phase improve PTDD v1 product structure enough to justify its context cost on native Opus and GPT-5.6 SOL/pi?_

Generated: 2026-10-12T08:37:45Z

Cells declared: 4 · matched runs: 45 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-no-thinking | 15 | 15 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking | 10 | 7 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex | 15 | 15 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      0 |   1    | 0.02 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |      0 |   0.99 | 0.03 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   1    | 0    |

### tests_passing

| kata                         | cell_workflow                        | cell_model         |   n |   k |   null |   rate_% |
|:-----------------------------|:-------------------------------------|:-------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |  15 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |   7 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |  15 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |   5 |      0 |      100 |

### avg_loc_per_function

| kata                         | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      0 |   5.82 | 0.78 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |      0 |   4.65 | 0.39 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      0 |   6.14 | 1.09 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   4.21 | 0.4  |

### median_loc_per_function

| kata                         | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      0 |   4.63 | 1.16 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |      0 |   3.29 | 0.39 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      0 |   5    | 1.66 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   3    | 0    |

### longest_function

| kata                         | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      0 |  17.93 | 4.93 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |      0 |  13.57 | 2.37 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      0 |  17.8  | 2.93 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |  15.8  | 3.56 |

### functions

| kata                         | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      0 |  25.87 | 4.03 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |      0 |  37.71 | 5.71 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      0 |  14.6  | 4.5  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |  32.2  | 4.66 |

### cognitive_max

| kata                         | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      0 |   3.07 | 0.96 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |      0 |   2.57 | 0.79 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      0 |   4.07 | 1.22 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   2.6  | 0.89 |

### cognitive_avg

| kata                         | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      0 |   1.48 | 0.24 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |      0 |   1.23 | 0.15 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      0 |   1.86 | 0.35 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   1.24 | 0.29 |

### mccabe_max

| kata                         | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      0 |   3.33 | 0.49 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |      0 |   3    | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      0 |   4.73 | 1.44 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |   3.6  | 0.55 |

### smell_total

| kata                         | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |

### code_mass

| kata                         | cell_workflow                        | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      0 | 712.67 |  70.77 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |      0 | 903.57 | 112.11 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      0 | 616.47 |  87.1  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 | 685.4  |  63.25 |

### production_loc

| kata                         | cell_workflow                        | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      0 | 248.87 |  31.17 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |      0 | 432.29 | 112.67 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      0 | 149.33 |  29.27 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 | 224    |  27.94 |

### predictions_correct_rate

| kata                         | cell_workflow                        | cell_model         |   n |    k |    t |   null |   rate_% |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-----:|-----:|-------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 | 1601 | 1618 |      0 |     98.9 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |  661 |  674 |      0 |     98.1 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 | 1204 | 1209 |      0 |     99.6 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |  370 |  370 |      0 |    100   |

### duration_seconds

| kata                         | cell_workflow                        | cell_model         |   n |   null |    mean |      sd |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|--------:|--------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      0 | 1234.4  |  267.31 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |      0 | 4747.71 | 1297.71 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      0 | 1573.93 |  495.01 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 | 4927    |  610.52 |

### total_tokens

| kata                         | cell_workflow                        | cell_model         |   n |   null |        mean |          sd |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      0 | 2.17703e+07 | 5.99959e+06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |      0 | 6.65498e+07 | 2.01813e+07 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      0 | 6.71986e+06 | 4.14218e+06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 | 1.7516e+07  | 4.15925e+06 |

### cost_usd

| kata                         | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      0 |  16.38 |  3.65 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |      0 |  61.51 | 16.4  |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      0 |   4.67 |  2.62 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |      0 |  18.27 |  3.05 |

### mutation_score

| kata                         | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      0 |   0.94 | 0.05 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |      0 |   0.88 | 0.08 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      0 |   0.81 | 0.23 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   4 |      1 |   0.88 | 0.02 |

### mutants_total

| kata                         | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      0 |  135.2 | 10.75 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |      0 |  155   | 17.28 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      0 |  128   | 20.17 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   4 |      1 |  143   | 19.58 |

### mutants_survived

| kata                         | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      0 |   8.4  |  7.57 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |      0 |  19.57 | 12.14 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      0 |  23.87 | 25.13 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   4 |      1 |  16.75 |  5.44 |

### mutants_no_coverage

| kata                         | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      0 |   4.27 |  5.79 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   7 |      0 |  14    | 12.37 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      0 |   4.6  |  2.59 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   4 |      1 |   4    |  1.41 |
