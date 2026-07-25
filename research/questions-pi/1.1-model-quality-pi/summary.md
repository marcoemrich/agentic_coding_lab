# RQ-model-quality-pi — Aggregation

_Wie unterscheiden sich die via pi-Harness (Requesty-Routing) erreichbaren Modelle in Code-Qualität und TDD-Disziplin auf game-of-life-example-mapping mit dem v6.2.1-phase-continuation-pi-Workflow?_

Generated: 2026-07-25T18:24:11Z

Cells declared: 10 · matched runs: 50 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8 | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5 | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1 | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2 | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7 | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3 | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | cell_workflow                | cell_model      |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:----------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |  158.4 |   151 |   164 |   4.83 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |  144.8 |     0 |   195 |  82.39 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |  178.2 |   144 |   218 |  28.91 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |  134.8 |   129 |   139 |   3.77 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |  136.4 |   113 |   162 |  18.01 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |  150.4 |   132 |   174 |  16.46 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |  212.2 |   160 |   303 |  60.95 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |  149.2 |   132 |   164 |  13.08 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |  206.6 |     8 |   315 | 116.64 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |  183   |   169 |   202 |  12.57 |

### cognitive_max

| kata                         | cell_workflow                | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |   14   |    10 |    20 |  4.69 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |    7.2 |     0 |    12 |  4.44 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |    7.8 |     3 |    10 |  2.77 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |   13.4 |     4 |    17 |  5.68 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |    7.8 |     0 |    14 |  5.76 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |   10.8 |     7 |    17 |  3.9  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |    6.6 |     3 |    12 |  3.36 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |    9.6 |     7 |    15 |  3.71 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |    6.4 |     0 |    32 | 14.31 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |    6.6 |     3 |    12 |  3.78 |

### cognitive_avg

| kata                         | cell_workflow                | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |  12.6  |  5.5  | 20    |  6.14 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |   4.25 |  0    |  7.5  |  2.82 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |   5.35 |  3    |  9    |  2.22 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |  12.07 |  2.33 | 17    |  6.95 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |   3.8  |  0    |  6    |  2.57 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |   6.2  |  3.33 |  9    |  2.65 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |   3.93 |  2    |  5.67 |  1.44 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |   5.57 |  4    |  8.5  |  1.87 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |   3.3  |  0    | 16.5  |  7.38 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |   4.57 |  2    |  7.5  |  2.25 |

### mccabe_max

| kata                         | cell_workflow                | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |   10.2 |     7 |    14 |  2.86 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |    6   |     0 |     9 |  3.54 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |    6.6 |     4 |     9 |  2.07 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |    9.4 |     5 |    12 |  2.88 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |    6   |     0 |    10 |  4.06 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |    7.2 |     5 |    11 |  2.39 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |    5.2 |     3 |     7 |  1.48 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |    6.8 |     5 |     9 |  1.48 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |    3.4 |     0 |    17 |  7.6  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |    5   |     3 |     7 |  2    |

### mccabe_avg

| kata                         | cell_workflow                | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |   4.17 |  2.33 |  7.5  |  1.97 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |   2.31 |  0    |  3.5  |  1.34 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |   2.69 |  1.71 |  4    |  0.98 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |   3.99 |  2.17 |  6    |  1.53 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |   2.93 |  0    |  6    |  2.21 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |   2.8  |  2.14 |  3.33 |  0.48 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |   2.41 |  1.75 |  2.75 |  0.45 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |   2.9  |  2.33 |  3.4  |  0.39 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |   1.33 |  0    |  6.67 |  2.98 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |   2.2  |  1.55 |  2.67 |  0.55 |

### cc_longest_function

| kata                         | cell_workflow                | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |   25.4 |    16 |    35 |  7.33 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |   22.2 |     0 |    33 | 12.79 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |   22.6 |     9 |    26 |  7.6  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |   21.2 |    18 |    23 |  2.17 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |   23.2 |    16 |    31 |  5.36 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |   21.6 |    11 |    29 |  6.77 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |   15   |     2 |    24 |  8.28 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |   17.4 |    10 |    22 |  5.5  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |   42.4 |     3 |    60 | 22.58 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |   19.6 |    14 |    27 |  5.68 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |  14.31 |  6.2  | 35    | 11.75 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |   8.88 |  0    | 14.33 |  5.37 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |  10.27 |  4    | 14    |  3.85 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |  13.7  | 10    | 23    |  5.29 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |  12.17 |  6.33 | 17    |  3.82 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |   8.52 |  5.67 | 11.33 |  2.46 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |   5.56 |  1.67 |  7.75 |  2.29 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |   6.89 |  4.2  |  8.33 |  1.69 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |  32.4  |  3    | 60    | 22.52 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |   7.94 |  6.38 | 10.5  |  1.69 |

### cc_median_loc_per_function

| kata                         | cell_workflow                | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |   10.5 |     2 |  35   | 13.92 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |    4.1 |     0 |   7   |  2.61 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |    6.3 |     2 |  14   |  5.12 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |   13.7 |    10 |  23   |  5.29 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |   11.3 |     2 |  17   |  5.56 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |    3.4 |     3 |   4   |  0.42 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |    3.2 |     2 |   6   |  1.79 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |    2.7 |     2 |   5   |  1.3  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |   31.2 |     3 |  60   | 23.36 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |    5   |     3 |   6.5 |  1.37 |

### lines_of_code

| kata                         | cell_workflow                | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |   37   |    34 |    40 |  2.55 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |   40.8 |     0 |    57 | 23.3  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |   47   |    39 |    57 |  7.52 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |   26   |    24 |    28 |  1.58 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |   30   |    26 |    37 |  4.53 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |   48   |    41 |    60 |  7.65 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |   64.6 |    39 |    95 | 20.31 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |   35.2 |    31 |    38 |  2.77 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |   48   |     4 |    69 | 25.76 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |   58.8 |    47 |    70 |  8.53 |

### smell_total

| kata                         | cell_workflow                | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |    4   |     3 |     5 |  1    |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |    2.2 |     0 |     4 |  1.48 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |    1   |     0 |     3 |  1.41 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |    3.6 |     2 |     4 |  0.89 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |    6   |     0 |    12 |  5.34 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |    3   |     2 |     4 |  1    |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |    8.4 |     0 |    33 | 13.83 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |    3.4 |     2 |     5 |  1.52 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |    1.8 |     0 |     9 |  4.02 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |    2.2 |     0 |     5 |  2.17 |

### smell_complexity

| kata                         | cell_workflow                | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |    1.2 |     0 |     2 |  1.1  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |    0.2 |     0 |     1 |  0.45 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |    1.6 |     0 |     2 |  0.89 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |    0.8 |     0 |     2 |  1.1  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |    0.6 |     0 |     2 |  0.89 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |    0.4 |     0 |     2 |  0.89 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |    0.8 |     0 |     2 |  1.1  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |    1   |     0 |     5 |  2.24 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |    0.4 |     0 |     2 |  0.89 |

### smell_magic_numbers

| kata                         | cell_workflow                | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |    2.8 |     2 |     3 |  0.45 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |    2   |     0 |     3 |  1.22 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |    1   |     0 |     3 |  1.41 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |    2   |     2 |     2 |  0    |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |    5.2 |     0 |    12 |  5.07 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |    2.4 |     2 |     3 |  0.55 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |    8   |     0 |    33 | 14.02 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |    2.6 |     2 |     3 |  0.55 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |    0.6 |     0 |     3 |  1.34 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |    1.8 |     0 |     3 |  1.64 |

### smell_duplication (rate %)

| kata                         | cell_workflow                | cell_model      |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:----------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |       0 |        0 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |       0 |        0 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |       0 |        0 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |       0 |        0 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |       0 |        0 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |       0 |        0 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |       0 |        0 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |       0 |        0 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |       1 |       20 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |       0 |        0 |

### verification_pct

| kata                         | cell_workflow                | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |   0.8  |  0    |     1 |  0.45 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |   0.59 |  0    |     1 |  0.46 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |   0.87 |  0.33 |     1 |  0.3  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |   0.4  |  0    |     1 |  0.55 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                         | cell_workflow                | cell_model      |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:----------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |       4 |       80 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |       4 |       80 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |       0 |        0 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |       5 |      100 |

### tests_total

| kata                         | cell_workflow                | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |    8.6 |     7 |    10 |  1.14 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |   10.2 |     0 |    15 |  5.97 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |    9.2 |     9 |    10 |  0.45 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |    9   |     7 |    10 |  1.22 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |    8   |     7 |     9 |  0.71 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |    9.8 |     8 |    11 |  1.3  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |   11   |    10 |    14 |  1.73 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |    8.6 |     8 |     9 |  0.55 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |    7   |     1 |    10 |  3.54 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |    9.8 |     9 |    10 |  0.45 |

### cycle_count

| kata                         | cell_workflow                | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |   12.4 |     7 |    17 |  4.62 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |   12.8 |     1 |    25 |  8.61 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |   10.8 |     9 |    15 |  2.68 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |    9   |     7 |    10 |  1.22 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |    9.4 |     8 |    13 |  2.07 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |    9.6 |     7 |    11 |  1.67 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |   13.4 |     9 |    16 |  3.58 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |    8.6 |     8 |     9 |  0.55 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |    5.6 |     1 |     9 |  4.22 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |   14.8 |     9 |    18 |  4.09 |

### refactorings_applied

| kata                         | cell_workflow                | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |    3   |     1 |     5 |  1.87 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |    2.8 |     0 |     4 |  1.64 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |    5.8 |     3 |     7 |  1.64 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |    5   |     4 |     6 |  0.71 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |    5.8 |     3 |     8 |  1.92 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |    3.4 |     2 |     5 |  1.14 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |    5.8 |     2 |    12 |  3.9  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |    3   |     3 |     3 |  0    |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |    4.8 |     0 |    10 |  3.63 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |    3.2 |     3 |     4 |  0.45 |

### predictions_correct

| kata                         | cell_workflow                | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |   13.4 |     8 |    20 |  5.27 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |   22   |     0 |    30 | 12.73 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |   11.2 |     6 |    14 |  3.03 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |   10   |     8 |    12 |  1.41 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |    9   |     0 |    16 |  6.56 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |   13.6 |     6 |    20 |  7.13 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |   22.6 |     6 |    42 | 13.37 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |   19.4 |    16 |    29 |  5.46 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |   10.4 |     2 |    15 |  5.5  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |    4.6 |     4 |     6 |  0.89 |

### predictions_total

| kata                         | cell_workflow                | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |   13.8 |     8 |    21 |  5.67 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |   22   |     0 |    30 | 12.73 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |   11.2 |     6 |    14 |  3.03 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |   10   |     8 |    12 |  1.41 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |   12.4 |     6 |    16 |  4.34 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |   13.6 |     6 |    20 |  7.13 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |   22.8 |     6 |    42 | 13.31 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |   19.4 |    16 |    29 |  5.46 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |   11.6 |     2 |    20 |  6.99 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |    4.8 |     4 |     6 |  1.1  |

### completed_within_budget (rate %)

| kata                         | cell_workflow                | cell_model      |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:----------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |       5 |      100 |

### duration_seconds

| kata                         | cell_workflow                | cell_model      |   n |   mean |   min |   max |     std |
|:-----------------------------|:-----------------------------|:----------------|----:|-------:|------:|------:|--------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |  200   |   140 |   295 |   73    |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 | 1479.8 |   299 |  2373 |  750.33 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |  883.4 |   532 |  1274 |  268.67 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |  240.4 |   169 |   325 |   56.57 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |  215.6 |   180 |   311 |   54.8  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |  233.8 |   167 |   286 |   49.99 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 | 4120.6 |  2243 |  6556 | 1939.34 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |  339.4 |   289 |   412 |   45.72 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |  430   |    41 |   758 |  267.89 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 | 1216   |   774 |  1734 |  349.45 |

### total_tokens

| kata                         | cell_workflow                | cell_model      |   n |             mean |     min |     max |              std |
|:-----------------------------|:-----------------------------|:----------------|----:|-----------------:|--------:|--------:|-----------------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |      1.37887e+06 |  862748 | 2000519 | 464938           |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |      1.17434e+06 |   36004 | 1676813 | 660783           |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |      4.36055e+06 | 2325073 | 6425912 |      1.50027e+06 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 | 661453           |  374855 |  902304 | 237856           |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 | 942638           |  653356 | 1256752 | 230641           |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |      1.3388e+06  | 1008800 | 1862935 | 340395           |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |      4.67698e+06 | 3044008 | 7676085 |      1.89744e+06 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |      1.23042e+06 |  992904 | 1651260 | 277681           |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |      3.55122e+06 |   60076 | 6535630 |      2.50945e+06 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |      3.664e+06   | 2306184 | 5454604 |      1.44702e+06 |

### cost_usd

| kata                         | cell_workflow                | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro |   5 |   0.83 |  0.55 |  1.19 |  0.27 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-1         |   5 |   1.74 |  0.08 |  2.5  |  0.97 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2         |   5 |   2.53 |  1.48 |  3.45 |  0.72 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol     |   5 |   1.09 |  0.71 |  1.47 |  0.29 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra   |   5 |   0.67 |  0.44 |  0.9  |  0.18 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7       |   5 |   0.6  |  0.47 |  0.82 |  0.14 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3      |   5 |   0.77 |  0.47 |  1.21 |  0.32 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8        |   5 |   2    |  1.77 |  2.3  |  0.25 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b      |   5 |   0.72 |  0.01 |  1.32 |  0.51 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5        |   5 |   2.83 |  1.79 |  3.88 |  0.78 |
