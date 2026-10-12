# RQ-model-novel-oc — Aggregation

_How do five models reachable via the OpenCode harness differ in correctness and TDD discipline on claim-office-example-mapping with the exact-single-context-v2-testlist-fix-oc workflow?_

Generated: 2026-10-12T08:37:47Z

Cells declared: 8 · matched runs: 38 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash | 4 | 4 | ⚠️ below min_replicates (4/5) |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro | 4 | 4 | ⚠️ below min_replicates (4/5) |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |      0 |   0.84 | 0.26 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |      0 |   0.04 | 0.09 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |      0 |   0.8  | 0.45 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |      0 |   0.95 | 0.09 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |      0 |   0.75 | 0.5  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |      0 |   0.75 | 0.5  |

### verification_passed

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |      0 |  15    | 0    |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |      0 |  12.6  | 3.91 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |      0 |   0.6  | 1.34 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |      0 |  12    | 6.71 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |      0 |  15    | 0    |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |      0 |  14.2  | 1.3  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |      0 |  11.25 | 7.5  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |      0 |  11.25 | 7.5  |

### verification_total

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |      0 |     15 |    0 |

### code_mass

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |      0 | 759.6  |  33.82 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |      0 | 741    |  57.62 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |      0 | 364.4  | 290.21 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |      0 | 526    | 293.09 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |      0 | 816    |  68.63 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |      0 | 721.8  | 133.34 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |      0 | 707.75 |  60.52 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |      0 | 693.25 | 102.59 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |      0 |   9.8  |  1.79 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |      0 |  21.8  |  2.59 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |      0 |  11.4  |  9.13 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |      0 |  40.2  | 34.02 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |      0 |  12.2  |  4.15 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |      0 |  77.6  | 23.35 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |      0 |  14.5  |  2.89 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |      0 |  21.75 |  5.38 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |      0 |   7.6  |  1.14 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |      0 |  17.6  |  2.7  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |      0 |   7.6  |  4.83 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |      0 |  23.4  | 15.73 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |      0 |   9.2  |  2.77 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |      0 |  34.6  |  6.8  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |      0 |  11.5  |  2.08 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |      0 |  13.75 |  2.99 |

### longest_function

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |      0 |  25.4  |   3.36 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |      0 |  54.4  |  21.62 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |      0 |  30    |  21.7  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |      0 |  98.4  |  72.94 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |      0 |  28.8  |   6.22 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |      0 | 122.8  | 116.43 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |      0 |  39.5  |  15.15 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |      0 |  52.75 |  12.55 |

### lines_of_code

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |      0 | 260.2  | 41.14 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |      0 | 249.4  | 29.52 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |      0 | 141.2  | 82.27 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |      0 | 181.4  | 99.49 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |      0 | 228.8  | 31.47 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |      0 | 220    | 57.08 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |      0 | 224.75 | 21.61 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |      0 | 239.5  | 50.53 |

### smell_total

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |      0 |   0.8  |  0.45 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |      0 |  20    |  4.36 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |      0 |  10.2  |  8.73 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |      0 |  18    | 10.75 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |      0 |   4    |  6.16 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |      0 |  23.8  |  5.63 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |      0 |  16.75 |  2.36 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |      0 |  20.75 |  3.86 |

### cycle_count

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |      0 |   1.2  | 0.45 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |      0 |   2    | 0.71 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |      0 |   4.8  | 7.4  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |      0 |   2.2  | 1.1  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |      0 |   2    | 0.71 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |      0 |   1.4  | 0.55 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |      0 |   4    | 2.16 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |      0 |   3.25 | 1.26 |

### refactorings_applied

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |      0 |   1.8  | 0.45 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |      0 |   1.4  | 0.55 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |      0 |   2.4  | 1.34 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |      0 |   2.8  | 1.92 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |      0 |   1.2  | 0.45 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |      0 |   2.75 | 0.96 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |      0 |   1.5  | 0.58 |

### predictions_correct

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |      0 |   2.4  | 0.89 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |      0 |   0.4  | 0.89 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |      0 |   2.2  | 1.48 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |      0 |   0.4  | 0.89 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |      0 |   4    | 1.87 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |      0 |   1.6  | 1.67 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |      0 |   2.5  | 2.38 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |      0 |   3.25 | 0.96 |

### predictions_total

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |      0 |   2.4  | 0.89 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |      0 |   0.4  | 0.89 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |      0 |   2.6  | 0.89 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |      0 |   0.4  | 0.89 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |      0 |   4    | 1.87 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |      0 |   1.6  | 1.67 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |      0 |   2.5  | 2.38 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |      0 |   3.25 | 0.96 |

### tests_passing

| kata                         | cell_workflow                           | cell_model         |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:-------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |   4 |      0 |       80 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |   4 |      0 |       80 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |   4 |      0 |       80 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |   4 |      0 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |   4 |      0 |      100 |

### tests_total

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |      0 |  25.6  | 17.16 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |      0 |  43.2  |  2.17 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |      0 |  30.8  | 19.69 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |      0 |  27    | 14.18 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |      0 |  40.2  |  3.96 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |      0 |  42.8  | 19.02 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |      0 |  42.25 |  9.36 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |      0 |  34.75 | 12.58 |

### duration_seconds

| kata                         | cell_workflow                           | cell_model         |   n |   null |   mean |      sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|-------:|--------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |      0 |  664.4 |  101.24 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |      0 | 1811.2 |  559.87 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |      0 | 1428   |  989.72 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |      0 |  395.2 |  182.12 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |      0 | 1726   |  274.66 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |      0 | 5746.8 | 4005.13 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |      0 | 1598.5 |   59.89 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |      0 | 1194   |  227.65 |

### total_tokens

| kata                         | cell_workflow                           | cell_model         |   n |   null |        mean |          sd |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |      0 | 8.05745e+06 | 2.34205e+06 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |      0 | 6.67278e+06 | 4.10705e+06 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |      0 | 8.52001e+06 | 5.8202e+06  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |      0 | 7.04797e+06 | 4.16653e+06 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |      0 | 1.09697e+07 | 2.62243e+06 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |      0 | 1.58422e+07 | 4.79893e+06 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |      0 | 8.45628e+06 | 2.38703e+06 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |      0 | 5.56924e+06 | 2.1871e+06  |
