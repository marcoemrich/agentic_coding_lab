# RQ-model-quality-pi — Aggregation

_How do the models reachable via the pi harness (Requesty routing) differ in code quality and TDD discipline on game-of-life-example-mapping with the exact-hybrid-v4.2-phase-continuation-pi workflow?_

Generated: 2026-10-12T08:37:47Z

Cells declared: 12 · matched runs: 60 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8 | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5 | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1 | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2 | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7 | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3 | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### code_mass

| kata                         | cell_workflow                           | cell_model       |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |  149.2 | 13.08 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |  151.8 | 10.83 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 |  183   | 12.57 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 |  134.8 |  3.77 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 |  136.4 | 18.01 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 |  183.2 | 16.15 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |  178.2 | 28.91 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |  150.4 | 16.46 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |  143.8 | 12.19 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 |  212.2 | 60.95 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |  158.4 |  4.83 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |  248   | 40.24 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model       |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |    9.6 |  3.71 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |    2.4 |  0.89 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 |    6.6 |  3.78 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 |   13.4 |  5.68 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 |    7.8 |  5.76 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 |    9.6 |  2.3  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |    7.8 |  2.77 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |   10.8 |  3.9  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |    7   |  2.12 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 |    6.6 |  3.36 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |   14   |  4.69 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |    6.4 | 14.31 |

### cognitive_avg

| kata                         | cell_workflow                           | cell_model       |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |   5.57 | 1.87 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |   2.2  | 0.45 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 |   4.57 | 2.25 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 |  12.07 | 6.95 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 |   3.8  | 2.57 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 |   5.72 | 1.76 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |   5.35 | 2.22 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |   6.2  | 2.65 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |   4.7  | 2.59 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 |   3.93 | 1.44 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |  12.6  | 6.14 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |   3.3  | 7.38 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model       |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |    6.8 | 1.48 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |    3.4 | 0.89 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 |    5   | 2    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 |    9.4 | 2.88 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 |    6   | 4.06 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 |    7.6 | 1.14 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |    6.6 | 2.07 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |    7.2 | 2.39 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |    5.8 | 1.48 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 |    5.2 | 1.48 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |   10.2 | 2.86 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |    3.4 | 7.6  |

### mccabe_avg

| kata                         | cell_workflow                           | cell_model       |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |   2.9  | 0.39 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |   1.31 | 0.24 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 |   2.2  | 0.55 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 |   3.99 | 1.53 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 |   2.93 | 2.21 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 |   2.98 | 0.41 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |   2.69 | 0.98 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |   2.8  | 0.48 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |   2.3  | 0.58 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 |   2.41 | 0.45 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |   4.17 | 1.97 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |   1.33 | 2.98 |

### longest_function

| kata                         | cell_workflow                           | cell_model       |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |   17.4 |  5.5  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |    5.8 |  3.63 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 |   19.6 |  5.68 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 |   21.2 |  2.17 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 |   23.2 |  5.36 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 |   27.2 |  3.35 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |   22.6 |  7.6  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |   21.6 |  6.77 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |   15   |  8.43 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 |   15   |  8.28 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |   25.4 |  7.33 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |   46.6 | 13.58 |

### avg_loc_per_function

| kata                         | cell_workflow                           | cell_model       |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |   6.89 |  1.69 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |   2.62 |  0.62 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 |   7.94 |  1.69 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 |  13.7  |  5.29 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 |  12.17 |  3.82 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 |  10.58 |  2.35 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |  10.27 |  3.85 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |   8.52 |  2.46 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |   7.11 |  3.89 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 |   5.56 |  2.29 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |  14.31 | 11.75 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |  34.5  | 19.36 |

### median_loc_per_function

| kata                         | cell_workflow                           | cell_model       |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |    2.7 |  1.3  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |    2   |  0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 |    5   |  1.37 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 |   13.7 |  5.29 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 |   11.3 |  5.56 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 |    4.8 |  1.44 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |    6.3 |  5.12 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |    3.4 |  0.42 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |    4.9 |  3.85 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 |    3.2 |  1.79 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |   10.5 | 13.92 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |   33.3 | 20.49 |

### lines_of_code

| kata                         | cell_workflow                           | cell_model       |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |   35.2 |  2.77 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |   39.8 |  4.38 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 |   58.8 |  8.53 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 |   26   |  1.58 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 |   30   |  4.53 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 |   52.4 |  5.68 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |   47   |  7.52 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |   48   |  7.65 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |   41   |  6.48 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 |   64.6 | 20.31 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |   37   |  2.55 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |   52.6 | 16.23 |

### smell_total

| kata                         | cell_workflow                           | cell_model       |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |    3.4 |  1.52 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |    2   |  0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 |    2.2 |  2.17 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 |    3.6 |  0.89 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 |    6   |  5.34 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 |    3.2 |  1.3  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |    1   |  1.41 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |    3   |  1    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |    2.4 |  0.55 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 |    8.4 | 13.83 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |    4   |  1    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |    1.8 |  4.02 |

### smell_complexity

| kata                         | cell_workflow                           | cell_model       |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |    0.8 | 1.1  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 |    0.4 | 0.89 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 |    1.6 | 0.89 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 |    0.8 | 1.1  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 |    0.6 | 0.89 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |    0.6 | 0.89 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 |    0.4 | 0.89 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |    1.2 | 1.1  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |    1   | 2.24 |

### smell_magic_numbers

| kata                         | cell_workflow                           | cell_model       |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |    2.6 |  0.55 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |    2   |  0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 |    1.8 |  1.64 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 |    2   |  0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 |    5.2 |  5.07 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 |    2.6 |  0.55 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |    1   |  1.41 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |    2.4 |  0.55 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |    2.4 |  0.55 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 |    8   | 14.02 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |    2.8 |  0.45 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |    0.6 |  1.34 |

### smell_duplication

| kata                         | cell_workflow                           | cell_model       |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |    0.2 | 0.45 |

### verification_pct

| kata                         | cell_workflow                           | cell_model       |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 |   0.59 | 0.46 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 |   0.87 | 0.3  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |   0.4  | 0.55 |

### tests_passing

| kata                         | cell_workflow                           | cell_model       |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:-----------------|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |   4 |      0 |       80 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |   0 |      0 |        0 |

### tests_total

| kata                         | cell_workflow                           | cell_model       |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |    8.6 | 0.55 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |   10.2 | 0.45 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 |    9.8 | 0.45 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 |    9   | 1.22 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 |    8   | 0.71 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 |   12.6 | 1.82 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |    9.2 | 0.45 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |    9.8 | 1.3  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |    9.4 | 1.14 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 |   11   | 1.73 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |    8.6 | 1.14 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |    8.8 | 1.3  |

### cycle_count

| kata                         | cell_workflow                           | cell_model       |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |    8.6 | 0.55 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |   10.2 | 0.45 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 |   14.8 | 4.09 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 |    9   | 1.22 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 |    9.4 | 2.07 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 |   15   | 5.79 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |   10.8 | 2.68 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |    9.6 | 1.67 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |   14.6 | 2.97 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 |   13.4 | 3.58 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |   12.4 | 4.62 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |    7.4 | 3.65 |

### refactorings_applied

| kata                         | cell_workflow                           | cell_model       |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |    3   | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |    3.8 | 0.45 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 |    3.2 | 0.45 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 |    5   | 0.71 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 |    5.8 | 1.92 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 |    3.4 | 0.55 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |    5.8 | 1.64 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |    3.4 | 1.14 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |    3   | 0.71 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 |    5.8 | 3.9  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |    3   | 1.87 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |    7   | 3.32 |

### predictions_correct

| kata                         | cell_workflow                           | cell_model       |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |   19.4 |  5.46 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |    6.4 |  0.89 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 |    4.6 |  0.89 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 |   10   |  1.41 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 |    9   |  6.56 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 |   26.6 |  3.85 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |   11.2 |  3.03 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |   13.6 |  7.13 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |    8.2 |  6.65 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 |   22.6 | 13.37 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |   13.4 |  5.27 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |   14   |  4.42 |

### predictions_total

| kata                         | cell_workflow                           | cell_model       |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |   19.4 |  5.46 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |    6.4 |  0.89 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 |    4.8 |  1.1  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 |   10   |  1.41 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 |   12.4 |  4.34 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 |   26.8 |  3.63 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |   11.2 |  3.03 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |   13.6 |  7.13 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |    8.2 |  6.65 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 |   22.8 | 13.31 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |   13.8 |  5.67 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |   15.2 |  5.22 |

### duration_seconds

| kata                         | cell_workflow                           | cell_model       |   n |   null |   mean |      sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-------:|--------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |  339.4 |   45.72 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |  436.2 |   78.66 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 | 1216   |  349.45 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 |  240.4 |   56.57 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 |  215.6 |   54.8  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 | 1649.2 |  454.33 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |  883.4 |  268.67 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |  233.8 |   49.99 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |  359   |   99.15 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 | 4120.6 | 1939.34 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |  200   |   73    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |  549.6 |  164.24 |

### total_tokens

| kata                         | cell_workflow                           | cell_model       |   n |   null |             mean |               sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-----------------:|-----------------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |      1.23042e+06 | 277681           |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |      2.21753e+06 | 414527           |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 |      3.664e+06   |      1.44702e+06 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 | 661453           | 237856           |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 | 942638           | 230641           |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 |      1.414e+06   | 204413           |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |      4.36055e+06 |      1.50027e+06 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |      1.3388e+06  | 340395           |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |      1.01617e+06 | 342494           |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 |      4.67698e+06 |      1.89744e+06 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |      1.37887e+06 | 464938           |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |      4.71415e+06 |      1.70572e+06 |

### cost_usd

| kata                         | cell_workflow                           | cell_model       |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8         |   5 |      0 |   2    | 0.25 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty  |   5 |      0 |   3.1  | 0.58 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5         |   5 |      0 |   2.83 | 0.78 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol      |   5 |      0 |   1.09 | 0.29 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra    |   5 |      0 |   0.67 | 0.18 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-1          |   5 |      0 |   2.1  | 0.3  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2          |   5 |      0 |   2.53 | 0.72 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7        |   5 |      0 |   0.6  | 0.14 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference |   5 |      0 |   0.64 | 0.16 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3       |   5 |      0 |   0.77 | 0.32 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro  |   5 |      0 |   0.83 | 0.27 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b       |   5 |      0 |   0.96 | 0.34 |
