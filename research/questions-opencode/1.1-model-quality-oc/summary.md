# RQ-model-quality-oc — Aggregation

_Wie unterscheiden sich fünf via OpenCode-Harness erreichbare Modelle (Opus 4.7 via Portkey + vier Nicht-Anthropic-Modelle aus dem Portkey-Catalog) in Code-Qualität und TDD-Disziplin auf game-of-life-example-mapping mit dem v5.1-testlist-scope-fix-oc-Workflow?_

Generated: 2026-05-28T06:02:04Z

Cells declared: 6 · matched runs: 30 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey | 5 | 5 | ✅ |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6 | 5 | 5 | ✅ |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1 | 5 | 5 | ✅ |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash | 5 | 5 | ✅ |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash | 5 | 5 | ✅ |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro | 5 | 4 | ⚠️ nur 4/5 ohne Timeout |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |  189.4 |   158 |   226 | 33.38 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 |  124   |    68 |   145 | 32.09 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |  200   |   155 |   254 | 36.02 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |  193.4 |   174 |   239 | 25.95 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 |  111   |    24 |   240 | 95.22 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |  160.4 |   140 |   182 | 15.18 |

### cognitive_max

| kata                         | workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |   13.2 |     9 |    18 |  3.7  |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 |   11.4 |     5 |    17 |  5.37 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |   16   |     8 |    20 |  4.69 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |   11.6 |     6 |    19 |  4.72 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 |    9.4 |     2 |    20 |  8.23 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |   11.4 |     6 |    19 |  4.83 |

### cognitive_avg

| kata                         | workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |   8.78 |  5.25 |    14 |  3.47 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 |  10.6  |  5    |    17 |  6.07 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |  14.07 |  6.33 |    20 |  4.97 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |   7.8  |  4    |    11 |  2.93 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 |   8.4  |  2    |    16 |  6.8  |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |   8.03 |  4    |    11 |  3.07 |

### mccabe_max

| kata                         | workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |    9.4 |     9 |    11 |  0.89 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 |    8.6 |     5 |    11 |  2.51 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |   10.4 |     8 |    14 |  2.19 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |    7   |     5 |     8 |  1.41 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 |    7.6 |     3 |    12 |  4.28 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |    7.6 |     4 |    10 |  2.3  |

### mccabe_avg

| kata                         | workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |   3.99 |  3.5  |  4.33 |  0.36 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 |   3.28 |  2.75 |  3.67 |  0.39 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |   6    |  4.5  |  8    |  1.66 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |   3.39 |  2.33 |  5    |  1.1  |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 |   4.85 |  3    | 10    |  3    |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |   2.91 |  1.56 |  4.33 |  1    |

### cc_longest_function

| kata                         | workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |   27.6 |    22 |    31 |  3.44 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 |   15   |     2 |    24 |  9.19 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |   18.6 |     8 |    40 | 12.88 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |   19.8 |    12 |    32 |  9.09 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 |   15.2 |     5 |    29 | 12.66 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |   18.6 |    13 |    21 |  3.58 |

### cc_avg_loc_per_function

| kata                         | workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |  13.1  | 10.67 | 16.5  |  2.24 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 |   9.53 |  1.33 | 21    |  7.14 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |  15.63 |  5.5  | 40    | 14    |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |  10.05 |  7.5  | 14.67 |  3.06 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 |   9.9  |  5    | 19.5  |  6.09 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |   7.59 |  5    |  9.33 |  1.76 |

### cc_median_loc_per_function

| kata                         | workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |    9.8 |   7   |  16.5 |  3.95 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 |    7   |   1   |  21   |  8.46 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |   14.9 |   4.5 |  40   | 14.32 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |    8.5 |   6   |  10   |  1.73 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 |    8.3 |   4   |  19.5 |  6.44 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |    3.3 |   2   |   4   |  0.97 |

### lines_of_code

| kata                         | workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |   44.8 |    40 |    51 |  4.21 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 |   24.6 |    10 |    29 |  8.17 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |   52.2 |    42 |    68 | 10.45 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |   46.4 |    38 |    54 |  6.07 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 |   22.4 |     7 |    46 | 19.81 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |   38.2 |    34 |    44 |  4.02 |

### smell_total

| kata                         | workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |    4   |     2 |     6 |  1.58 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 |    4.2 |     2 |     9 |  2.86 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |    4   |     0 |     5 |  2.24 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |    2.8 |     0 |     6 |  2.68 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 |    4.4 |     2 |     9 |  2.88 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |    3.6 |     2 |     5 |  1.14 |

### smell_complexity

| kata                         | workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |    1   |     0 |     3 |  1.22 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 |    0.8 |     0 |     2 |  1.1  |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |    1.6 |     0 |     2 |  0.89 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |    1.2 |     0 |     3 |  1.3  |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 |    0.6 |     0 |     2 |  0.89 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |    1.2 |     0 |     3 |  1.3  |

### smell_magic_numbers

| kata                         | workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |    2.8 |     2 |     3 |  0.45 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 |    3.4 |     2 |     9 |  3.13 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |    2.4 |     0 |     3 |  1.34 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |    1.6 |     0 |     3 |  1.52 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 |    3.8 |     2 |     9 |  2.95 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |    2.4 |     2 |     3 |  0.55 |

### smell_duplication (rate %)

| kata                         | workflow                   | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:---------------------------|:------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |       0 |        0 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 |       0 |        0 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |       0 |        0 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |       0 |        0 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 |       0 |        0 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |       0 |        0 |

### verification_pct

| kata                         | workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 |   0.85 |  0.27 |     1 |  0.33 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 |   0.57 |  0.2  |     1 |  0.4  |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                         | workflow                   | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:---------------------------|:------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |       5 |      100 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 |       4 |       80 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |       5 |      100 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |       5 |      100 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 |       5 |      100 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |       5 |      100 |

### tests_total

| kata                         | workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |    9.2 |     9 |    10 |  0.45 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 |    8.6 |     7 |    12 |  1.95 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |    8.4 |     8 |     9 |  0.55 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |    9.8 |     9 |    11 |  0.84 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 |    7   |     4 |     9 |  2.74 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |    9.4 |     9 |    10 |  0.55 |

### cycle_count

| kata                         | workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |    5.4 |     2 |     8 |  2.7  |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 |    7.6 |     6 |     9 |  1.14 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |    7   |     1 |     9 |  3.39 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |    2.2 |     1 |     4 |  1.1  |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 |    5   |     2 |     9 |  2.65 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |    3   |     1 |    10 |  3.94 |

### refactorings_applied

| kata                         | workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |    4.8 |     1 |     7 |  3.03 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 |    4.6 |     3 |     7 |  1.52 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |    3.6 |     2 |     6 |  1.52 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |    2.4 |     1 |     4 |  1.14 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 |    3.4 |     2 |     6 |  1.67 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |    1.6 |     1 |     4 |  1.34 |

### predictions_correct

| kata                         | workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |    1.4 |     0 |     3 |  1.34 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 |    5.6 |     2 |    11 |  3.78 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |    0.4 |     0 |     2 |  0.89 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |    4.4 |     2 |     8 |  2.19 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 |    2   |     0 |    10 |  4.47 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |    4.8 |     2 |    11 |  3.7  |

### predictions_total

| kata                         | workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |    1.4 |     0 |     3 |  1.34 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 |    6.2 |     3 |    11 |  3.96 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |    0.4 |     0 |     2 |  0.89 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |    4.4 |     2 |     8 |  2.19 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 |    2   |     0 |    10 |  4.47 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |    4.8 |     2 |    11 |  3.7  |

### completed_within_budget (rate %)

| kata                         | workflow                   | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:---------------------------|:------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |       5 |      100 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 |       4 |       80 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |       5 |      100 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |       5 |      100 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 |       5 |      100 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |       5 |      100 |

### duration_seconds

| kata                         | workflow                   | cell_model        |   n |   mean |   min |   max |     std |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|------:|------:|--------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 |  612.4 |   540 |   680 |   57.98 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 | 2381.2 |   854 |  7202 | 2703.66 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 |  153.2 |   110 |   182 |   28.3  |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 |  835   |   576 |  1059 |  171.89 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 | 1083   |   845 |  1878 |  445.65 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 |  231   |   199 |   280 |   31.29 |

### total_tokens

| kata                         | workflow                   | cell_model        |   n |        mean |     min |     max |              std |
|:-----------------------------|:---------------------------|:------------------|----:|------------:|--------:|--------:|-----------------:|
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-flash |   5 | 2.71113e+06 | 1968154 | 3638603 | 742313           |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | deepseek-v4-pro   |   5 | 2.81853e+06 | 2095409 | 3821174 | 697009           |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash  |   5 | 2.79807e+06 | 1867916 | 3501664 | 615760           |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | glm-5-1           |   5 | 2.95986e+06 | 2091737 | 3388331 | 581347           |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6         |   5 | 2.28135e+06 | 1015709 | 3954014 |      1.34618e+06 |
| game-of-life-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey  |   5 | 1.81543e+06 | 1267074 | 3092261 | 732188           |
