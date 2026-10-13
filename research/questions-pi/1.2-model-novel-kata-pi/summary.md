# RQ-model-novel-pi — Aggregation

_How do the models reachable via the pi harness (Requesty routing) differ in correctness and TDD discipline on claim-office-example-mapping with the exact-hybrid-v4-cleaned-pi workflow?_

Generated: 2026-10-13T13:28:30Z

Cells declared: 18 · matched runs: 86 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3 | 2 | 2 | ⚠️ below min_replicates (2/5) |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3-no-thinking | 4 | 4 | ⚠️ below min_replicates (4/5) |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8                    |   5 |      0 |   0.99 | 0.03 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking        |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty             |   5 |      0 |   0.96 | 0.09 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty-no-thinking |   5 |      0 |   0.96 | 0.09 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5                    |   5 |      0 |   0.72 | 0.19 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5-no-thinking        |   5 |      0 |   0.84 | 0.15 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7                   |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |      0 |   0.73 | 0.42 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3                  |   2 |      0 |   0.5  | 0.71 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3-no-thinking      |   4 |      0 |   0.97 | 0.07 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro             |   5 |      0 |   0.6  | 0.55 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |      0 |   0.8  | 0.45 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b                  |   5 |      0 |   0    | 0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |      0 |   0    | 0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2                     |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference            |   5 |      0 |   0.99 | 0.03 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol                 |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra               |   5 |      0 |   0.69 | 0.42 |

### verification_passed

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8                    |   5 |      0 |   14.8 |  0.45 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking        |   5 |      0 |   15   |  0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty             |   5 |      0 |   14.4 |  1.34 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty-no-thinking |   5 |      0 |   14.4 |  1.34 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5                    |   5 |      0 |   10.8 |  2.86 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5-no-thinking        |   5 |      0 |   12.6 |  2.3  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7                   |   5 |      0 |   15   |  0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |      0 |   11   |  6.36 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3                  |   2 |      0 |    7.5 | 10.61 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3-no-thinking      |   4 |      0 |   14.5 |  1    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro             |   5 |      0 |    9   |  8.22 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |      0 |   12   |  6.71 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b                  |   5 |      0 |    0   |  0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |      0 |    0   |  0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2                     |   5 |      0 |   15   |  0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference            |   5 |      0 |   14.8 |  0.45 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol                 |   5 |      0 |   15   |  0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra               |   5 |      0 |   10.4 |  6.31 |

### verification_total

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8                    |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking        |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty             |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty-no-thinking |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5                    |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5-no-thinking        |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7                   |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3                  |   2 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3-no-thinking      |   4 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro             |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b                  |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2                     |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference            |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol                 |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra               |   5 |      0 |     15 |    0 |

### code_mass

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8                    |   5 |      0 | 782    |  85.84 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking        |   5 |      0 | 895.2  |  85    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty             |   5 |      0 | 765.6  |  42.65 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty-no-thinking |   5 |      0 | 762.2  |  77.39 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5                    |   5 |      0 | 867.6  |  79.44 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5-no-thinking        |   5 |      0 | 853    |  45.03 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7                   |   5 |      0 | 850.6  | 102.68 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |      0 | 622    | 305.56 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3                  |   2 |      0 | 776    |  39.6  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3-no-thinking      |   4 |      0 | 805.25 | 118.81 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro             |   5 |      0 | 765.4  |  72.62 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |      0 | 619.4  | 293.79 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b                  |   5 |      0 | 296.4  | 306.79 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |      0 | 251.4  | 172.34 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2                     |   5 |      0 | 761.4  |  97.29 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference            |   5 |      0 | 665.6  |  25.28 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol                 |   5 |      0 | 462    |  66.84 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra               |   5 |      0 | 482.2  |  25.27 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8                    |   5 |      0 |    3.6 |  1.34 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking        |   5 |      0 |    4.6 |  2.51 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty             |   5 |      0 |    2.8 |  1.3  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty-no-thinking |   5 |      0 |    3   |  1    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5                    |   5 |      0 |    4.2 |  1.1  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5-no-thinking        |   5 |      0 |    5.4 |  2.41 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7                   |   5 |      0 |    5.2 |  1.64 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |      0 |    7   |  1.87 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3                  |   2 |      0 |    7   |  1.41 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3-no-thinking      |   4 |      0 |    8   |  1.41 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro             |   5 |      0 |   27.4 | 21.56 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |      0 |   41.4 | 25.94 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b                  |   5 |      0 |    0.2 |  0.45 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |      0 |    4.6 |  4.72 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2                     |   5 |      0 |    6.4 |  2.07 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference            |   5 |      0 |    3.4 |  0.55 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol                 |   5 |      0 |    9.2 |  4.32 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra               |   5 |      0 |   11.6 |  7.02 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8                    |   5 |      0 |   3.8  | 1.3  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking        |   5 |      0 |   4.4  | 1.52 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty             |   5 |      0 |   3.4  | 0.89 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty-no-thinking |   5 |      0 |   3.6  | 0.55 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5                    |   5 |      0 |   4.8  | 0.84 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5-no-thinking        |   5 |      0 |   4.8  | 1.3  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7                   |   5 |      0 |   5    | 0.71 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |      0 |   5.8  | 1.1  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3                  |   2 |      0 |   6    | 1.41 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3-no-thinking      |   4 |      0 |   6.75 | 2.22 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro             |   5 |      0 |  14.4  | 7.54 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |      0 |  18    | 9.14 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b                  |   5 |      0 |   0.4  | 0.89 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |      0 |   4.2  | 4.09 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2                     |   5 |      0 |   5.4  | 1.34 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference            |   5 |      0 |   3.6  | 0.55 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol                 |   5 |      0 |   6.8  | 2.05 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra               |   5 |      0 |   9    | 5.1  |

### longest_function

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8                    |   5 |      0 |  22    |  4.12 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking        |   5 |      0 |  18.2  |  5.89 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty             |   5 |      0 |  12.8  |  2.49 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty-no-thinking |   5 |      0 |   9.2  |  1.1  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5                    |   5 |      0 |  20.6  | 10.41 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5-no-thinking        |   5 |      0 |  21.2  |  6.69 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7                   |   5 |      0 |  19.4  |  2.7  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |      0 |  22.4  |  4.98 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3                  |   2 |      0 |  25.5  |  2.12 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3-no-thinking      |   4 |      0 |  27.75 |  5.56 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro             |   5 |      0 |  57    | 25.17 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |      0 |  77.6  | 36    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b                  |   5 |      0 |  33    | 28.04 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |      0 |  33.2  | 27.22 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2                     |   5 |      0 |  24    |  6.04 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference            |   5 |      0 |  21.4  |  5.32 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol                 |   5 |      0 |  24    |  7.42 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra               |   5 |      0 |  18.2  |  1.92 |

### lines_of_code

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8                    |   5 |      0 |  271.6 |  16.76 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking        |   5 |      0 |  303.6 |  38.49 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty             |   5 |      0 |  295   |  35.18 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty-no-thinking |   5 |      0 |  311.8 |  29.6  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5                    |   5 |      0 |  304.4 |  42.05 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5-no-thinking        |   5 |      0 |  325.2 |  14.22 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7                   |   5 |      0 |  262.6 |  36.75 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |      0 |  199.4 |  90.24 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3                  |   2 |      0 |  335.5 |  60.1  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3-no-thinking      |   4 |      0 |  318   |  52.98 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro             |   5 |      0 |  247.8 |  47.14 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |      0 |  194.6 |  64.63 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b                  |   5 |      0 |  117.8 | 125.18 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |      0 |   84   |  54.54 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2                     |   5 |      0 |  236.8 |  29.51 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference            |   5 |      0 |  247.4 |  34.24 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol                 |   5 |      0 |  104.4 |  19.14 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra               |   5 |      0 |   80.2 |  12.05 |

### smell_total

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8                    |   5 |      0 |   0.4  |  0.89 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking        |   5 |      0 |   0    |  0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty             |   5 |      0 |   2.4  |  5.37 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty-no-thinking |   5 |      0 |   0    |  0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5                    |   5 |      0 |   0.8  |  0.84 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5-no-thinking        |   5 |      0 |   0.8  |  1.79 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7                   |   5 |      0 |   0    |  0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |      0 |   2.6  |  2.41 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3                  |   2 |      0 |   0    |  0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3-no-thinking      |   4 |      0 |   1.25 |  0.96 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro             |   5 |      0 |  12.2  |  6.53 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |      0 |  15.6  | 10.78 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b                  |   5 |      0 |   0    |  0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |      0 |   4.6  |  4.67 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2                     |   5 |      0 |   0.2  |  0.45 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference            |   5 |      0 |   0.4  |  0.55 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol                 |   5 |      0 |  15.4  |  1.67 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra               |   5 |      0 |  14    |  9.25 |

### predictions_correct

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8                    |   5 |      0 |  69.6  | 20.97 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking        |   5 |      0 |  63.2  | 25.24 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty             |   5 |      0 |  52.2  | 19.08 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty-no-thinking |   5 |      0 |  52.8  | 17.91 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5                    |   5 |      0 |  37.4  | 21.09 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5-no-thinking        |   5 |      0 |  36.6  |  5.46 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7                   |   5 |      0 |  37.6  | 24.1  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |      0 |  18.6  | 14.52 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3                  |   2 |      0 |   0    |  0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3-no-thinking      |   4 |      0 |  31.75 | 33.47 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro             |   5 |      0 |  22.6  |  6.47 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |      0 |  19.6  | 12.03 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b                  |   5 |      0 |  10.6  | 15.19 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |      0 |  12.2  | 11.1  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2                     |   5 |      0 |  31.2  |  3.35 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference            |   5 |      0 |  33.2  |  5.81 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol                 |   5 |      0 |  20.8  |  5.4  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra               |   5 |      0 |   5.4  |  4.98 |

### predictions_total

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8                    |   5 |      0 |  70    | 20.7  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking        |   5 |      0 |  63.2  | 25.24 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty             |   5 |      0 |  52.4  | 18.94 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty-no-thinking |   5 |      0 |  53.2  | 17.75 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5                    |   5 |      0 |  38.2  | 21.71 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5-no-thinking        |   5 |      0 |  36.8  |  5.4  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7                   |   5 |      0 |  37.6  | 24.1  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |      0 |  19    | 15.13 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3                  |   2 |      0 |   0    |  0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3-no-thinking      |   4 |      0 |  31.75 | 33.47 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro             |   5 |      0 |  22.6  |  6.47 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |      0 |  19.8  | 12.21 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b                  |   5 |      0 |  10.8  | 15.59 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |      0 |  14.8  | 12.05 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2                     |   5 |      0 |  31.2  |  3.35 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference            |   5 |      0 |  33.6  |  6.27 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol                 |   5 |      0 |  20.8  |  5.4  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra               |   5 |      0 |  11.8  | 11.05 |

### tests_passing

| kata                         | cell_workflow                           | cell_model                  |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8                    |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty             |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5                    |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5-no-thinking        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7                   |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |   4 |      0 |       80 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3                  |   2 |   2 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3-no-thinking      |   4 |   3 |      0 |       75 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro             |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |   4 |      0 |       80 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b                  |   5 |   0 |      0 |        0 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |   0 |      0 |        0 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2                     |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference            |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol                 |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra               |   5 |   4 |      0 |       80 |

### tests_total

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8                    |   5 |      0 |  39.4  |  4.28 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking        |   5 |      0 |  41    |  3.39 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty             |   5 |      0 |  39.6  |  3.21 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty-no-thinking |   5 |      0 |  39.6  |  4.16 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5                    |   5 |      0 |  23.4  | 14.69 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5-no-thinking        |   5 |      0 |  21.4  | 13.79 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7                   |   5 |      0 |  36.4  |  5.81 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |      0 |  29.4  | 16.71 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3                  |   2 |      0 |  29.5  | 26.16 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3-no-thinking      |   4 |      0 |  19.75 | 15.99 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro             |   5 |      0 |  43.8  |  1.3  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |      0 |  36.4  | 20.5  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b                  |   5 |      0 |   0.6  |  0.55 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |      0 |   9.8  |  8.17 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2                     |   5 |      0 |  32    | 15.22 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference            |   5 |      0 |  33.8  |  2.17 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol                 |   5 |      0 |  19.8  |  8.84 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra               |   5 |      0 |  15.2  |  7.56 |

### duration_seconds

| kata                         | cell_workflow                           | cell_model                  |   n |   null |     mean |      sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|---------:|--------:|
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8                    |   5 |      0 |  1883.8  |  392.48 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking        |   5 |      0 |  1656    |  382.66 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty             |   5 |      0 |  2801.6  |  132.12 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty-no-thinking |   5 |      0 |  3142.2  |  395.97 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5                    |   5 |      0 |  5787.4  | 1380.77 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5-no-thinking        |   5 |      0 |  4866.4  |  830.1  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7                   |   5 |      0 |  2214.2  |  848.19 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |      0 |  1477.6  | 1150.4  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3                  |   2 |      0 | 10392    | 4108.29 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3-no-thinking      |   4 |      0 |  8312.25 | 3623.16 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro             |   5 |      0 |   745.6  |  114.61 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |      0 |   561.2  |  319.36 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b                  |   5 |      0 |   679.2  |  876.71 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |      0 |   409    |  272.54 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2                     |   5 |      0 |  2817.8  |  431.31 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference            |   5 |      0 |  1929.2  |  427.26 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol                 |   5 |      0 |   503.4  |  144.93 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra               |   5 |      0 |   216.6  |  103.54 |

### total_tokens

| kata                         | cell_workflow                           | cell_model                  |   n |   null |             mean |               sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-----------------:|-----------------:|
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8                    |   5 |      0 |      1.3833e+07  |      3.09284e+06 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking        |   5 |      0 |      1.36489e+07 |      3.40331e+06 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty             |   5 |      0 |      1.60094e+07 |      2.31311e+06 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty-no-thinking |   5 |      0 |      1.91457e+07 |      2.72463e+06 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5                    |   5 |      0 |      2.88842e+07 |      1.6135e+07  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5-no-thinking        |   5 |      0 |      2.4437e+07  |      7.7755e+06  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7                   |   5 |      0 |      1.77036e+07 |      4.73805e+06 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |      0 |      1.09921e+07 |      7.0597e+06  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3                  |   2 |      0 |      2.13038e+06 |      2.00859e+06 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3-no-thinking      |   4 |      0 |      1.37967e+07 |      4.88836e+06 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro             |   5 |      0 |      1.46158e+07 |      3.19643e+06 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |      0 |      9.47146e+06 |      6.41141e+06 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b                  |   5 |      0 |      1.0336e+07  |      1.2803e+07  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |      0 |      4.58033e+06 |      3.24081e+06 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2                     |   5 |      0 |      1.53202e+07 |      1.01938e+07 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference            |   5 |      0 |      8.34828e+06 |      1.86471e+06 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol                 |   5 |      0 |      2.08521e+06 | 801525           |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra               |   5 |      0 | 809357           | 502409           |

### cost_usd

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8                    |   5 |      0 |  14.43 | 2.98 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking        |   5 |      0 |  13.68 | 3.17 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty             |   5 |      0 |  18.53 | 1.64 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty-no-thinking |   5 |      0 |  21.43 | 3.21 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5                    |   5 |      0 |  13.68 | 7.57 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | sonnet-5-no-thinking        |   5 |      0 |  13.21 | 2.71 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7                   |   5 |      0 |   6.79 | 1.46 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |      0 |   4.32 | 2.75 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3                  |   2 |      0 |   0.37 | 0.38 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | minimax-m3-no-thinking      |   4 |      0 |   1.8  | 0.55 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro             |   5 |      0 |   7.19 | 1.47 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |      0 |   4.74 | 3.1  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b                  |   5 |      0 |   2.08 | 2.57 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |      0 |   0.93 | 0.66 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | glm-5-2                     |   5 |      0 |   7.76 | 4.51 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | kimi-k3-sference            |   5 |      0 |   3.56 | 0.54 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol                 |   5 |      0 |   2.54 | 0.65 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-terra               |   5 |      0 |   0.6  | 0.4  |
