# RQ-model-quality-oc — Aggregation

_How do five models reachable via the OpenCode harness (Opus 4.7 via Portkey + four non-Anthropic models from the Portkey catalog) differ in code quality and TDD discipline on game-of-life-example-mapping with the exact-single-context-v2-testlist-fix-oc workflow?_

Generated: 2026-10-12T10:46:37Z

Cells declared: 6 · matched runs: 30 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6 | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1 | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro | 5 | 4 | ⚠️ below min_replicates (4/5) |

## Outcome pivots (per cell)

### code_mass

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey  |   5 |      0 |  160.4 | 15.18 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6         |   5 |      0 |  111   | 95.22 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1           |   5 |      0 |  193.4 | 25.95 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash  |   5 |      0 |  200   | 36.02 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash |   5 |      0 |  189.4 | 33.38 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro   |   4 |      0 |  138   |  8.12 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey  |   5 |      0 |   11.4 | 4.83 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6         |   5 |      0 |    9.4 | 8.23 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1           |   5 |      0 |   11.6 | 4.72 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash  |   5 |      0 |   16   | 4.69 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash |   5 |      0 |   13.2 | 3.7  |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro   |   4 |      0 |   13   | 4.62 |

### cognitive_avg

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey  |   5 |      0 |   8.03 | 3.07 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6         |   5 |      0 |   8.4  | 6.8  |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1           |   5 |      0 |   7.8  | 2.93 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash  |   5 |      0 |  14.07 | 4.97 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash |   5 |      0 |   8.78 | 3.47 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro   |   4 |      0 |  12    | 6    |

### mccabe_max

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey  |   5 |      0 |    7.6 | 2.3  |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6         |   5 |      0 |    7.6 | 4.28 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1           |   5 |      0 |    7   | 1.41 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash  |   5 |      0 |   10.4 | 2.19 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash |   5 |      0 |    9.4 | 0.89 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro   |   4 |      0 |    9.5 | 1.73 |

### mccabe_avg

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey  |   5 |      0 |   2.91 | 1    |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6         |   5 |      0 |   4.85 | 3    |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1           |   5 |      0 |   3.39 | 1.1  |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash  |   5 |      0 |   6    | 1.66 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash |   5 |      0 |   3.99 | 0.36 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro   |   4 |      0 |   3.35 | 0.41 |

### longest_function

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey  |   5 |      0 |   18.6 |  3.58 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6         |   5 |      0 |   15.2 | 12.66 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1           |   5 |      0 |   19.8 |  9.09 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash  |   5 |      0 |   18.6 | 12.88 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash |   5 |      0 |   27.6 |  3.44 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro   |   4 |      0 |   16.5 |  9.88 |

### avg_loc_per_function

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey  |   5 |      0 |   7.59 |  1.76 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6         |   5 |      0 |   9.9  |  6.09 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1           |   5 |      0 |  10.05 |  3.06 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash  |   5 |      0 |  15.63 | 14    |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash |   5 |      0 |  13.1  |  2.24 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro   |   4 |      0 |   9.66 |  8.24 |

### median_loc_per_function

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey  |   5 |      0 |    3.3 |  0.97 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6         |   5 |      0 |    8.3 |  6.44 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1           |   5 |      0 |    8.5 |  1.73 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash  |   5 |      0 |   14.9 | 14.32 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash |   5 |      0 |    9.8 |  3.95 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro   |   4 |      0 |    6.5 |  9.68 |

### lines_of_code

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey  |   5 |      0 |  38.2  |  4.02 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6         |   5 |      0 |  22.4  | 19.81 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1           |   5 |      0 |  46.4  |  6.07 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash  |   5 |      0 |  52.2  | 10.45 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash |   5 |      0 |  44.8  |  4.21 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro   |   4 |      0 |  28.25 |  0.5  |

### smell_total

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey  |   5 |      0 |    3.6 | 1.14 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6         |   5 |      0 |    4.4 | 2.88 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1           |   5 |      0 |    2.8 | 2.68 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash  |   5 |      0 |    4   | 2.24 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash |   5 |      0 |    4   | 1.58 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro   |   4 |      0 |    3   | 1.15 |

### smell_complexity

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey  |   5 |      0 |    1.2 | 1.3  |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6         |   5 |      0 |    0.6 | 0.89 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1           |   5 |      0 |    1.2 | 1.3  |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash  |   5 |      0 |    1.6 | 0.89 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash |   5 |      0 |    1   | 1.22 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro   |   4 |      0 |    1   | 1.15 |

### smell_magic_numbers

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey  |   5 |      0 |    2.4 | 0.55 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6         |   5 |      0 |    3.8 | 2.95 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1           |   5 |      0 |    1.6 | 1.52 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash  |   5 |      0 |    2.4 | 1.34 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash |   5 |      0 |    2.8 | 0.45 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro   |   4 |      0 |    2   | 0    |

### smell_duplication

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey  |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6         |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1           |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash  |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro   |   4 |      0 |      0 |    0 |

### verification_pct

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey  |   5 |      0 |   1    |  0   |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6         |   5 |      0 |   0.57 |  0.4 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1           |   5 |      0 |   1    |  0   |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash  |   5 |      0 |   1    |  0   |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash |   5 |      0 |   1    |  0   |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro   |   4 |      0 |   1    |  0   |

### tests_passing

| kata                         | cell_workflow                           | cell_model        |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:------------------|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey  |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6         |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1           |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash  |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro   |   4 |   4 |      0 |      100 |

### tests_total

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey  |   5 |      0 |   9.4  | 0.55 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6         |   5 |      0 |   7    | 2.74 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1           |   5 |      0 |   9.8  | 0.84 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash  |   5 |      0 |   8.4  | 0.55 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash |   5 |      0 |   9.2  | 0.45 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro   |   4 |      0 |   8.75 | 2.22 |

### predictions_correct

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey  |   5 |      0 |    4.8 | 3.7  |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6         |   5 |      0 |    2   | 4.47 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1           |   5 |      0 |    4.4 | 2.19 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash  |   5 |      0 |    0.4 | 0.89 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash |   5 |      0 |    1.4 | 1.34 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro   |   4 |      0 |    6   | 4.24 |

### predictions_total

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey  |   5 |      0 |   4.8  | 3.7  |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6         |   5 |      0 |   2    | 4.47 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1           |   5 |      0 |   4.4  | 2.19 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash  |   5 |      0 |   0.4  | 0.89 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash |   5 |      0 |   1.4  | 1.34 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro   |   4 |      0 |   6.75 | 4.35 |

### duration_seconds

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey  |   5 |      0 |  231   |  31.29 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6         |   5 |      0 | 1083   | 445.65 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1           |   5 |      0 |  835   | 171.89 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash  |   5 |      0 |  153.2 |  28.3  |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash |   5 |      0 |  612.4 |  57.98 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro   |   4 |      0 | 1176   | 251.02 |

### total_tokens

| kata                         | cell_workflow                           | cell_model        |   n |   null |        mean |               sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------------:|-----------------:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey  |   5 |      0 | 1.81543e+06 | 732188           |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6         |   5 |      0 | 2.28135e+06 |      1.34618e+06 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1           |   5 |      0 | 2.95986e+06 | 581347           |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash  |   5 |      0 | 2.79807e+06 | 615760           |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash |   5 |      0 | 2.71113e+06 | 742313           |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro   |   4 |      0 | 2.99931e+06 | 655657           |
