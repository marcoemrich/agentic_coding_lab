# RQ-model-novel-oc — Aggregation

_Wie unterscheiden sich fünf via OpenCode-Harness erreichbare Modelle in Korrektheit und TDD-Disziplin auf claim-office-example-mapping mit dem v5.1-testlist-scope-fix-oc-Workflow?_

Generated: 2026-05-28T08:50:22Z

Cells declared: 8 · matched runs: 40 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey | 5 | 5 | ✅ |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6 | 5 | 5 | ✅ |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7 | 5 | 5 | ✅ |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash | 5 | 5 | ✅ |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1 | 5 | 5 | ✅ |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | mistral-medium-3-5 | 5 | 5 | ✅ |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash | 5 | 5 | ✅ |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | workflow                   | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash  |   5 |   0.6  |   0   |   1   |  0.55 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro    |   5 |   0.6  |   0   |   1   |  0.55 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash   |   5 |   0.8  |   0   |   1   |  0.45 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1            |   5 |   1    |   1   |   1   |  0    |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6          |   5 |   0.84 |   0.4 |   1   |  0.26 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7       |   5 |   0.04 |   0   |   0.2 |  0.09 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | mistral-medium-3-5 |   5 |   0.95 |   0.8 |   1   |  0.09 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey   |   5 |   1    |   1   |   1   |  0    |

### verification_passed

| kata                         | workflow                   | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash  |   5 |    9   |     0 |    15 |  8.22 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro    |   5 |    9   |     0 |    15 |  8.22 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash   |   5 |   12   |     0 |    15 |  6.71 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1            |   5 |   15   |    15 |    15 |  0    |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6          |   5 |   12.6 |     6 |    15 |  3.91 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7       |   5 |    0.6 |     0 |     3 |  1.34 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | mistral-medium-3-5 |   5 |   14.2 |    12 |    15 |  1.3  |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey   |   5 |   15   |    15 |    15 |  0    |

### verification_total

| kata                         | workflow                   | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash  |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro    |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash   |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1            |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6          |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7       |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | mistral-medium-3-5 |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey   |   5 |     15 |    15 |    15 |     0 |

### code_mass

| kata                         | workflow                   | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:---------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash  |   5 |  566.2 |     0 |   740 | 320.83 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro    |   5 |  554.6 |     0 |   844 | 322.51 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash   |   5 |  526   |     3 |   680 | 293.09 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1            |   5 |  816   |   705 |   877 |  68.63 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6          |   5 |  741   |   674 |   800 |  57.62 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7       |   5 |  364.4 |    18 |   700 | 290.21 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | mistral-medium-3-5 |   5 |  721.8 |   589 |   923 | 133.34 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey   |   5 |  759.6 |   717 |   797 |  33.82 |

### cognitive_max

| kata                         | workflow                   | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash  |   5 |   11.6 |     0 |    18 |  6.95 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro    |   5 |   17.4 |     0 |    29 | 10.78 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash   |   5 |   40.2 |     0 |    81 | 34.02 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1            |   5 |   12.2 |     8 |    18 |  4.15 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6          |   5 |   21.8 |    19 |    26 |  2.59 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7       |   5 |   11.4 |     0 |    19 |  9.13 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | mistral-medium-3-5 |   5 |   77.6 |    54 |   107 | 23.35 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey   |   5 |    9.8 |     8 |    12 |  1.79 |

### mccabe_max

| kata                         | workflow                   | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash  |   5 |    9.2 |     0 |    14 |  5.45 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro    |   5 |   11   |     0 |    17 |  6.67 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash   |   5 |   23.4 |     1 |    39 | 15.73 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1            |   5 |    9.2 |     7 |    14 |  2.77 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6          |   5 |   17.6 |    15 |    22 |  2.7  |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7       |   5 |    7.6 |     1 |    12 |  4.83 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | mistral-medium-3-5 |   5 |   34.6 |    27 |    44 |  6.8  |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey   |   5 |    7.6 |     6 |     9 |  1.14 |

### cc_longest_function

| kata                         | workflow                   | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:---------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash  |   5 |   31.6 |     0 |    55 |  22.01 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro    |   5 |   42.2 |     0 |    68 |  25.97 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash   |   5 |   98.4 |     7 |   189 |  72.94 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1            |   5 |   28.8 |    23 |    39 |   6.22 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6          |   5 |   54.4 |    25 |    79 |  21.62 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7       |   5 |   30   |     5 |    54 |  21.7  |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | mistral-medium-3-5 |   5 |  122.8 |     0 |   256 | 116.43 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey   |   5 |   25.4 |    22 |    31 |   3.36 |

### lines_of_code

| kata                         | workflow                   | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:---------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash  |   5 |  179.8 |     0 |   257 | 102.24 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro    |   5 |  191.6 |     0 |   309 | 115.7  |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash   |   5 |  181.4 |     7 |   258 |  99.49 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1            |   5 |  228.8 |   201 |   277 |  31.47 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6          |   5 |  249.4 |   221 |   286 |  29.52 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7       |   5 |  141.2 |    39 |   244 |  82.27 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | mistral-medium-3-5 |   5 |  220   |   152 |   279 |  57.08 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey   |   5 |  260.2 |   200 |   305 |  41.14 |

### smell_total

| kata                         | workflow                   | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash  |   5 |   13.4 |     0 |    20 |  7.77 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro    |   5 |   16.6 |     0 |    25 |  9.86 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash   |   5 |   18   |     0 |    29 | 10.75 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1            |   5 |    4   |     0 |    14 |  6.16 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6          |   5 |   20   |    16 |    27 |  4.36 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7       |   5 |   10.2 |     0 |    20 |  8.73 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | mistral-medium-3-5 |   5 |   23.8 |    19 |    32 |  5.63 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey   |   5 |    0.8 |     0 |     1 |  0.45 |

### cycle_count

| kata                         | workflow                   | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash  |   5 |    3.2 |     0 |     7 |  2.59 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro    |   5 |    2.6 |     0 |     5 |  1.82 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash   |   5 |    2.2 |     1 |     4 |  1.1  |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1            |   5 |    2   |     1 |     3 |  0.71 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6          |   5 |    2   |     1 |     3 |  0.71 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7       |   5 |    4.8 |     1 |    18 |  7.4  |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | mistral-medium-3-5 |   5 |    1.4 |     1 |     2 |  0.55 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey   |   5 |    1.2 |     1 |     2 |  0.45 |

### refactorings_applied

| kata                         | workflow                   | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash  |   5 |    2.2 |     0 |     4 |  1.48 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro    |   5 |    1.2 |     0 |     2 |  0.84 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash   |   5 |    2.4 |     1 |     4 |  1.34 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1            |   5 |    2.8 |     1 |     6 |  1.92 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6          |   5 |    1.8 |     1 |     2 |  0.45 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7       |   5 |    1.4 |     1 |     2 |  0.55 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | mistral-medium-3-5 |   5 |    1.2 |     1 |     2 |  0.45 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey   |   5 |    1   |     1 |     1 |  0    |

### predictions_correct

| kata                         | workflow                   | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash  |   5 |    2   |     0 |     5 |  2.35 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro    |   5 |    2.6 |     0 |     4 |  1.67 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash   |   5 |    0.4 |     0 |     2 |  0.89 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1            |   5 |    4   |     2 |     6 |  1.87 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6          |   5 |    0.4 |     0 |     2 |  0.89 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7       |   5 |    2.2 |     0 |     4 |  1.48 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | mistral-medium-3-5 |   5 |    1.6 |     0 |     4 |  1.67 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey   |   5 |    2.4 |     2 |     4 |  0.89 |

### predictions_total

| kata                         | workflow                   | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash  |   5 |    2   |     0 |     5 |  2.35 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro    |   5 |    2.6 |     0 |     4 |  1.67 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash   |   5 |    0.4 |     0 |     2 |  0.89 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1            |   5 |    4   |     2 |     6 |  1.87 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6          |   5 |    0.4 |     0 |     2 |  0.89 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7       |   5 |    2.6 |     2 |     4 |  0.89 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | mistral-medium-3-5 |   5 |    1.6 |     0 |     4 |  1.67 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey   |   5 |    2.4 |     2 |     4 |  0.89 |

### tests_passing (rate %)

| kata                         | workflow                   | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:---------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash  |   5 |       4 |       80 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro    |   5 |       4 |       80 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash   |   5 |       4 |       80 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1            |   5 |       5 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6          |   5 |       5 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7       |   5 |       4 |       80 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | mistral-medium-3-5 |   5 |       4 |       80 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey   |   5 |       5 |      100 |

### tests_total

| kata                         | workflow                   | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash  |   5 |   33.8 |     0 |    53 | 20.56 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro    |   5 |   27.8 |     0 |    50 | 18.98 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash   |   5 |   27   |     2 |    36 | 14.18 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1            |   5 |   40.2 |    35 |    44 |  3.96 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6          |   5 |   43.2 |    40 |    46 |  2.17 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7       |   5 |   30.8 |     2 |    54 | 19.69 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | mistral-medium-3-5 |   5 |   42.8 |    23 |    66 | 19.02 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey   |   5 |   25.6 |     4 |    39 | 17.16 |

### completed_within_budget (rate %)

| kata                         | workflow                   | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:---------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash  |   5 |       5 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro    |   5 |       5 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash   |   5 |       5 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1            |   5 |       5 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6          |   5 |       5 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7       |   5 |       5 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | mistral-medium-3-5 |   5 |       5 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey   |   5 |       5 |      100 |

### duration_seconds

| kata                         | workflow                   | cell_model         |   n |   mean |   min |   max |     std |
|:-----------------------------|:---------------------------|:-------------------|----:|-------:|------:|------:|--------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash  |   5 | 1279.4 |     3 |  1665 |  715.41 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro    |   5 |  955.6 |     2 |  1431 |  568.37 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash   |   5 |  395.2 |   110 |   603 |  182.12 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1            |   5 | 1726   |  1363 |  2109 |  274.66 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6          |   5 | 1811.2 |  1163 |  2349 |  559.87 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7       |   5 | 1428   |   303 |  2713 |  989.72 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | mistral-medium-3-5 |   5 | 5746.8 |  2053 | 12529 | 4005.13 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey   |   5 |  664.4 |   503 |   769 |  101.24 |

### total_tokens

| kata                         | workflow                   | cell_model         |   n |        mean |      min |      max |         std |
|:-----------------------------|:---------------------------|:-------------------|----:|------------:|---------:|---------:|------------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash  |   5 | 6.76503e+06 |        0 | 12017927 | 4.30989e+06 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro    |   5 | 4.4554e+06  |        0 |  8495227 | 3.12903e+06 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash   |   5 | 7.04797e+06 |   746077 | 12473291 | 4.16653e+06 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1            |   5 | 1.09697e+07 |  7999255 | 15137424 | 2.62243e+06 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6          |   5 | 6.67278e+06 |  2590768 | 12520963 | 4.10705e+06 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7       |   5 | 8.52001e+06 |   883444 | 15728474 | 5.8202e+06  |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | mistral-medium-3-5 |   5 | 1.58422e+07 | 10685238 | 20505846 | 4.79893e+06 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey   |   5 | 8.05745e+06 |  4350494 | 10691586 | 2.34205e+06 |
