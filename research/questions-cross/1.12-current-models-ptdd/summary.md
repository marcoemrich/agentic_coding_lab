# RQ-current-models-ptdd — Aggregation

_How do the current commercial and open-weight coding models differ in correctness and code quality on claim-office under the maintained EXACT Coding Predictive TDD workflow, each reached over its own native route?_

Generated: 2026-10-23T07:56:44Z

Cells declared: 10 · matched runs: 51 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking | 6 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |   0.99 | 0.03 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |   0.8  | 0.45 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |   0.77 | 0.44 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |   1    | 0    |

### verification_passed

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   15   | 0    |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   15   | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   15   | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |   15   | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |   14.8 | 0.45 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |   15   | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |   12   | 6.71 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |   11.6 | 6.54 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |   15   | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |   15   | 0    |

### verification_total

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |     15 |    0 |

### tests_passing

| kata                         | cell_workflow    | cell_model             |   n |   k |   null |   rate_% |
|:-----------------------------|:-----------------|:-----------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |   4 |      0 |       80 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |   5 |      0 |      100 |

### production_loc

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |  184.8 |  19.66 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |  219.8 |  52.39 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |  130.2 |   7.98 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |  325.8 |  27.27 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |  184.8 |  19.56 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |  273.4 |  42.85 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |  244.8 |  39.52 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |  269   | 132.05 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |  254.6 |  21.59 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |  264.4 |  39.92 |

### code_mass

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |  632.4 |  35.98 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |  645.4 |  74.87 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |  561.2 |  18.05 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |  713.4 |  77.71 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |  586.8 |  37.4  |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |  819   |  93.42 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |  680   | 117.76 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |  699   | 342.93 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |  761.4 |  65.88 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |  706.6 |  74.06 |

### smell_total

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |      0 |    0 |

### cognitive_max

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    2.4 | 0.55 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |    2.6 | 0.55 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |    3   | 1.41 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |    4.8 | 1.79 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |    8.6 | 1.14 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |    9   | 0.71 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |    4.8 | 2.05 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |    6.8 | 3.35 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |    6.8 | 1.3  |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |    4.6 | 1.52 |

### cognitive_avg

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   1.43 | 0.21 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   1.33 | 0.17 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   1.47 | 0.32 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |   1.85 | 0.35 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |   3.46 | 0.82 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |   3.1  | 0.26 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |   1.82 | 0.59 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |   2.6  | 0.9  |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |   2.6  | 0.41 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |   1.78 | 0.47 |

### mccabe_max

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    3.4 | 0.55 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |    3.6 | 0.55 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |    3.8 | 1.1  |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |    4.6 | 1.14 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |    6.8 | 0.84 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |    8   | 1.41 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |    4.4 | 1.14 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |    6   | 1.73 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |    6   | 1.73 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |    4.8 | 2.17 |

### unit_count

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   22.8 | 2.77 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   25   | 1.87 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   18.6 | 1.95 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |   21.4 | 4.28 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |   10.6 | 0.89 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |   18   | 4.24 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |   27.2 | 5.54 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |   16.4 | 8.17 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |   18.8 | 4.21 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |   22.6 | 3.05 |

### unit_size_max

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   13   |  1.58 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   12.6 |  1.14 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   12   |  1.87 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |   23.2 |  1.3  |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |   21.8 |  4.92 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |   24.2 |  1.92 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |   20   |  8.89 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |   22.8 | 10.16 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |   19.8 |  3.49 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |   24   |  6.63 |

### unit_size_avg

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   4.81 | 0.62 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   4.78 | 0.55 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   4.56 | 0.41 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |   5.69 | 0.79 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |   9.05 | 2.18 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |   8.53 | 2.44 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |   5.23 | 1.08 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |   7.45 | 2.35 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |   7.93 | 2.36 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |   6.11 | 1.57 |

### unit_size_median

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    3.8 | 1.1  |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |    3.4 | 1.14 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |    3.5 | 0.61 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |    3   | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |    7.4 | 2.43 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |    6.5 | 3.16 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |    3   | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |    5.5 | 1.9  |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |    6.9 | 2.61 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |    4.3 | 1.57 |

### longest_function

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   13   |  1.58 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   12.6 |  1.14 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   12   |  1.87 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |   23.2 |  1.3  |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |   21.8 |  4.92 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |   24.2 |  1.92 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |   20   |  8.89 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |   22.8 | 10.16 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |   19.8 |  3.49 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |   24   |  6.63 |

### tests_total

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   47.8 |  1.64 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   57.6 |  6.35 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   48.8 |  1.1  |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |   40.4 |  6.5  |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |   40   |  1.87 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |   45.4 |  3.21 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |   44.2 |  4.32 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |   54.6 | 31.88 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |   45.2 |  5.89 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |   40.2 |  1.64 |

### test_lines

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |  276.8 |  37.63 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |  391.8 |  97.15 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |  148.2 |  54.73 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |  791.6 |  75.63 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |  481.6 | 131.6  |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |  545.8 | 187.34 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |  375.2 |  35.81 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |  665.4 | 352.23 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |  472   |  93.98 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |  506.6 | 206.43 |

### mutation_score

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   0.94 |   0.05 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      5 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   0.54 |   0.49 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      5 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      5 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      5 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      5 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      5 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      5 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   0 |      5 | nan    | nan    |

### mutants_total

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    124 |   4.9  |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      5 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |    113 |   3.81 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      5 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      5 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      5 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      5 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      5 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      5 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   0 |      5 |    nan | nan    |

### mutants_survived

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    7.8 |   6.3  |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      5 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   51.4 |  54.45 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      5 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      5 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      5 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      5 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      5 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      5 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   0 |      5 |  nan   | nan    |

### mutants_no_coverage

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    2.8 |   3.83 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      5 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |    1.8 |   1.64 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      5 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      5 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      5 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      5 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      5 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      5 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   0 |      5 |  nan   | nan    |

### tdd_discipline

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   0.63 | 0.01 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   0.64 | 0.02 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   0.63 | 0.01 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |   0.72 | 0.03 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |   0.58 | 0.05 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |   0.52 | 0.05 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |   0.7  | 0.16 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |   0.43 | 0.2  |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   4 |      1 |   0.54 | 0.04 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |   0.56 | 0.11 |

### tdd_discipline_step

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   4 |      1 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |      1 |    0 |

### tdd_discipline_closure

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   0.49 | 0.02 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   0.5  | 0.02 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   0.49 | 0.01 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |   0.61 | 0.04 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |   0.44 | 0.06 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |   0.36 | 0.05 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |   0.58 | 0.21 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |   0.27 | 0.15 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |   0.31 | 0.18 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |   0.41 | 0.12 |

### test_first_rate

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   0.51 | 0.02 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   0.52 | 0.02 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   0.51 | 0.01 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |   0.62 | 0.04 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |   0.45 | 0.06 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |   0.39 | 0.06 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |   0.62 | 0.21 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |   0.33 | 0.18 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |   0.33 | 0.19 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |   0.43 | 0.12 |

### red_batch_size

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   4 |      1 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |      1 |    0 |

### red_batch_max

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |    1.2 | 0.45 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |    1.4 | 0.89 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |    2   | 2.24 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   4 |      1 |    1   | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |    1   | 0    |

### green_batch_size

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    1   |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |    4.9 |  8.72 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   10.2 | 12.6  |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |    1   |  0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |    3.5 |  5.59 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |    1   |  0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |    1   |  0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |    1   |  0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   4 |      1 |    1   |  0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |    1   |  0    |

### cycles_total

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   49.6 |  2.19 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   58.8 |  5.63 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   50.6 |  1.14 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |   41.4 |  6.5  |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |   41   |  1.87 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |   47   |  4.06 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |   37.2 |  8.17 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |   34   | 22.26 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |   33.8 | 18.78 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |   41.2 |  1.64 |

### cycles_closed

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   24.2 | 1.64 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   29.6 | 2.51 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   25   | 1    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |   25   | 2.55 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |   17.8 | 1.79 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |   17   | 2.12 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |   20.4 | 4.34 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |    7.6 | 6.43 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |   13.2 | 8.17 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |   16.8 | 4.49 |

### refactor_events

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   16.6 | 2.41 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   15.2 | 3.11 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   19.6 | 3.36 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |   20.8 | 4.44 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |    5.4 | 1.52 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |    6.2 | 2.59 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |    9   | 4    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |    6   | 3.87 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |    4.2 | 3.03 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |    9.6 | 5.46 |

### skip_events

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   23.8 |  1.3  |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   26.4 |  4.16 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   23   |  1.41 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |   13   |  4.3  |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |   22.6 |  3.65 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |   28.2 |  3.42 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |   15   | 10.61 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |   24.4 | 20.46 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |   17.4 | 10.48 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |   23.2 |  5.63 |

### chain_suite_runs

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   95.4 |  5.41 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |  107.4 | 10.16 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |  123.6 | 11.87 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |   88.4 | 12.66 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |   86.4 | 17.37 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |   90.4 | 22.3  |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |   87.6 | 23.71 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |   56.8 | 34.43 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |   66   | 44.5  |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |   76.6 | 11.15 |

### chain_deviations

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   24.6 |  1.34 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   28.4 |  3.51 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   24.6 |  0.89 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |   15.6 |  3.78 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |   23   |  3.81 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |   30.4 |  4.34 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |   21.2 |  7.05 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |   28   | 21.05 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |   20.4 | 11.48 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |   24   |  5.48 |

### chain_opens_red

| kata                         | cell_workflow    | cell_model             |   n |   k |   null |   rate_% |
|:-----------------------------|:-----------------|:-----------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |   0 |      0 |        0 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |   0 |      0 |        0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |   0 |      0 |        0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |   0 |      0 |        0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |   0 |      0 |        0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |   0 |      0 |        0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |   0 |      0 |        0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |   0 |      0 |        0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |   0 |      0 |        0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |   0 |      0 |        0 |

### chain_ends_green

| kata                         | cell_workflow    | cell_model             |   n |   k |   null |   rate_% |
|:-----------------------------|:-----------------|:-----------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |   4 |      0 |       80 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |   5 |      0 |      100 |

### duration_seconds

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |  922.2 |  80.42 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 | 1198   | 211.6  |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 | 2171.4 | 190.46 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 | 3679   | 377.03 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 | 1238   | 453.12 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |  987.6 | 267.15 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 | 1218.8 | 669.59 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 | 1803.6 | 790.55 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 | 1000.6 | 490.22 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 | 1473.8 | 285.75 |

### total_tokens

| kata                         | cell_workflow    | cell_model             |   n |   null |        mean |          sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 | 2.44e+07    | 1.83647e+06 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 | 4.93319e+07 | 1.43322e+07 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 | 8.97392e+06 | 3.43777e+06 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 | 1.35483e+07 | 4.69011e+06 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 | 6.02449e+06 | 1.23002e+06 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 | 1.00833e+07 | 3.56431e+06 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 | 9.58133e+06 | 3.09388e+06 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 | 8.22447e+06 | 1.1785e+07  |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 | 1.15076e+07 | 6.18185e+06 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 | 1.62772e+07 | 3.84499e+06 |

### cost_usd

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   9.79 | 0.49 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |  14.59 | 4.26 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   1.47 | 0.58 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   5 |      0 |   3.48 | 1.29 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   5 |      0 |   3.61 | 0.62 |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   5 |      0 |   3.08 | 0.96 |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   5 |      0 |   0.86 | 0.34 |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   5 |      0 |   0.92 | 1.27 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   5 |      0 |   7.8  | 4.12 |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8-flash-next     |   5 |      0 |   0.9  | 0.2  |
