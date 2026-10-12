# RQ-model-novel-oc — Aggregation

_How do five models reachable via the OpenCode harness differ in correctness and TDD discipline on claim-office-example-mapping with the exact-single-context-v2-testlist-fix-oc workflow?_

Generated: 2026-10-12T07:27:56Z

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

| kata                         | cell_workflow                           | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |   0.75 |   0   |   1   |  0.5  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |   0.75 |   0   |   1   |  0.5  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |   0.8  |   0   |   1   |  0.45 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |   1    |   1   |   1   |  0    |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |   0.84 |   0.4 |   1   |  0.26 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |   0.04 |   0   |   0.2 |  0.09 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |   0.95 |   0.8 |   1   |  0.09 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |   1    |   1   |   1   |  0    |

### verification_passed

| kata                         | cell_workflow                           | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |  11.25 |     0 |    15 |  7.5  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |  11.25 |     0 |    15 |  7.5  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |  12    |     0 |    15 |  6.71 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |  15    |    15 |    15 |  0    |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |  12.6  |     6 |    15 |  3.91 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |   0.6  |     0 |     3 |  1.34 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |  14.2  |    12 |    15 |  1.3  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |  15    |    15 |    15 |  0    |

### verification_total

| kata                         | cell_workflow                           | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |     15 |    15 |    15 |     0 |

### code_mass

| kata                         | cell_workflow                           | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 | 707.75 |   617 |   740 |  60.52 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 | 693.25 |   616 |   844 | 102.59 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 | 526    |     3 |   680 | 293.09 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 | 816    |   705 |   877 |  68.63 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 | 741    |   674 |   800 |  57.62 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 | 364.4  |    18 |   700 | 290.21 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 | 721.8  |   589 |   923 | 133.34 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 | 759.6  |   717 |   797 |  33.82 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |  14.5  |    11 |    18 |  2.89 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |  21.75 |    16 |    29 |  5.38 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |  40.2  |     0 |    81 | 34.02 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |  12.2  |     8 |    18 |  4.15 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |  21.8  |    19 |    26 |  2.59 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |  11.4  |     0 |    19 |  9.13 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |  77.6  |    54 |   107 | 23.35 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |   9.8  |     8 |    12 |  1.79 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |  11.5  |     9 |    14 |  2.08 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |  13.75 |    10 |    17 |  2.99 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |  23.4  |     1 |    39 | 15.73 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |   9.2  |     7 |    14 |  2.77 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |  17.6  |    15 |    22 |  2.7  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |   7.6  |     1 |    12 |  4.83 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |  34.6  |    27 |    44 |  6.8  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |   7.6  |     6 |     9 |  1.14 |

### longest_function

| kata                         | cell_workflow                           | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |  39.5  |    20 |    55 |  15.15 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |  52.75 |    39 |    68 |  12.55 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |  98.4  |     7 |   189 |  72.94 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |  28.8  |    23 |    39 |   6.22 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |  54.4  |    25 |    79 |  21.62 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |  30    |     5 |    54 |  21.7  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 | 122.8  |     0 |   256 | 116.43 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |  25.4  |    22 |    31 |   3.36 |

### lines_of_code

| kata                         | cell_workflow                           | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 | 224.75 |   211 |   257 | 21.61 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 | 239.5  |   189 |   309 | 50.53 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 | 181.4  |     7 |   258 | 99.49 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 | 228.8  |   201 |   277 | 31.47 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 | 249.4  |   221 |   286 | 29.52 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 | 141.2  |    39 |   244 | 82.27 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 | 220    |   152 |   279 | 57.08 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 | 260.2  |   200 |   305 | 41.14 |

### smell_total

| kata                         | cell_workflow                           | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |  16.75 |    15 |    20 |  2.36 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |  20.75 |    17 |    25 |  3.86 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |  18    |     0 |    29 | 10.75 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |   4    |     0 |    14 |  6.16 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |  20    |    16 |    27 |  4.36 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |  10.2  |     0 |    20 |  8.73 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |  23.8  |    19 |    32 |  5.63 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |   0.8  |     0 |     1 |  0.45 |

### legacy_cycle_count

| kata                         | cell_workflow                           | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |   4    |     2 |     7 |  2.16 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |   3.25 |     2 |     5 |  1.26 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |   2.2  |     1 |     4 |  1.1  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |   2    |     1 |     3 |  0.71 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |   2    |     1 |     3 |  0.71 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |   4.8  |     1 |    18 |  7.4  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |   1.4  |     1 |     2 |  0.55 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |   1.2  |     1 |     2 |  0.45 |

### legacy_refactorings_applied

| kata                         | cell_workflow                           | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |   2.75 |     2 |     4 |  0.96 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |   1.5  |     1 |     2 |  0.58 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |   2.4  |     1 |     4 |  1.34 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |   2.8  |     1 |     6 |  1.92 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |   1.8  |     1 |     2 |  0.45 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |   1.4  |     1 |     2 |  0.55 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |   1.2  |     1 |     2 |  0.45 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |   1    |     1 |     1 |  0    |

### predictions_correct

| kata                         | cell_workflow                           | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |   2.5  |     0 |     5 |  2.38 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |   3.25 |     2 |     4 |  0.96 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |   0.4  |     0 |     2 |  0.89 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |   4    |     2 |     6 |  1.87 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |   0.4  |     0 |     2 |  0.89 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |   2.2  |     0 |     4 |  1.48 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |   1.6  |     0 |     4 |  1.67 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |   2.4  |     2 |     4 |  0.89 |

### predictions_total

| kata                         | cell_workflow                           | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |   2.5  |     0 |     5 |  2.38 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |   3.25 |     2 |     4 |  0.96 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |   0.4  |     0 |     2 |  0.89 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |   4    |     2 |     6 |  1.87 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |   0.4  |     0 |     2 |  0.89 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |   2.6  |     2 |     4 |  0.89 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |   1.6  |     0 |     4 |  1.67 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |   2.4  |     2 |     4 |  0.89 |

### tests_passing (rate %)

| kata                         | cell_workflow                           | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:----------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |       4 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |       4 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |       4 |       80 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |       5 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |       5 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |       4 |       80 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |       4 |       80 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |       5 |      100 |

### tests_total

| kata                         | cell_workflow                           | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 |  42.25 |    33 |    53 |  9.36 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 |  34.75 |    23 |    50 | 12.58 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |  27    |     2 |    36 | 14.18 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 |  40.2  |    35 |    44 |  3.96 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 |  43.2  |    40 |    46 |  2.17 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 |  30.8  |     2 |    54 | 19.69 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 |  42.8  |    23 |    66 | 19.02 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |  25.6  |     4 |    39 | 17.16 |

### duration_seconds

| kata                         | cell_workflow                           | cell_model         |   n |   mean |   min |   max |     std |
|:-----------------------------|:----------------------------------------|:-------------------|----:|-------:|------:|------:|--------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 | 1598.5 |  1533 |  1665 |   59.89 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 | 1194   |   894 |  1431 |  227.65 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 |  395.2 |   110 |   603 |  182.12 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 | 1726   |  1363 |  2109 |  274.66 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 | 1811.2 |  1163 |  2349 |  559.87 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 | 1428   |   303 |  2713 |  989.72 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 | 5746.8 |  2053 | 12529 | 4005.13 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 |  664.4 |   503 |   769 |  101.24 |

### total_tokens

| kata                         | cell_workflow                           | cell_model         |   n |        mean |      min |      max |         std |
|:-----------------------------|:----------------------------------------|:-------------------|----:|------------:|---------:|---------:|------------:|
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash  |   4 | 8.45628e+06 |  6937973 | 12017927 | 2.38703e+06 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro    |   4 | 5.56924e+06 |  3350867 |  8495227 | 2.1871e+06  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash   |   5 | 7.04797e+06 |   746077 | 12473291 | 4.16653e+06 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1            |   5 | 1.09697e+07 |  7999255 | 15137424 | 2.62243e+06 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6          |   5 | 6.67278e+06 |  2590768 | 12520963 | 4.10705e+06 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | minimax-m2-7       |   5 | 8.52001e+06 |   883444 | 15728474 | 5.8202e+06  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | mistral-medium-3-5 |   5 | 1.58422e+07 | 10685238 | 20505846 | 4.79893e+06 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey   |   5 | 8.05745e+06 |  4350494 | 10691586 | 2.34205e+06 |
