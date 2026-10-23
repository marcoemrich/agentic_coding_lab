# RQ-current-models-ptdd — Aggregation

_How do the current commercial and open-weight coding models differ in correctness and code quality on claim-office under the maintained EXACT Coding Predictive TDD workflow, each reached over its own native route?_

Generated: 2026-10-23T02:10:27Z

Cells declared: 10 · matched runs: 16 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking | 1 | 1 | ⚠️ below min_replicates (1/5) |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon | 0 | 0 | ❌ no runs |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4 | 0 | 0 | ❌ no runs |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference | 1 | 1 | ⚠️ below min_replicates (1/5) |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3 | 1 | 1 | ⚠️ below min_replicates (1/5) |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash | 1 | 1 | ⚠️ below min_replicates (1/5) |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3 | 1 | 1 | ⚠️ below min_replicates (1/5) |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8 | 1 | 1 | ⚠️ below min_replicates (1/5) |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   1    |    0 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |   1    |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   1    |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 | nan    |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 | nan    |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |   0.93 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |   1    |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |   1    |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |   0.87 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |   1    |  nan |

### verification_passed

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |     15 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |     14 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |     15 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |     15 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |     13 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |     15 |  nan |

### verification_total

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |     15 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |     15 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |     15 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |     15 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |     15 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |     15 |  nan |

### tests_passing

| kata                         | cell_workflow    | cell_model             |   n |   k |   null |   rate_% |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|----:|-------:|---------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |   5 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |   1 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |   5 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |   1 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |   1 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |   1 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |   1 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |   1 |      0 |      100 |    nan |  nan |

### production_loc

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |  184.8 |  19.66 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |  164   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |  130.2 |   7.98 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |  181   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |  236   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |  196   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |  277   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |  253   | nan    |

### code_mass

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |  632.4 |  35.98 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |  597   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |  561.2 |  18.05 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |  599   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |  821   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |  609   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |  803   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |  826   | nan    |

### smell_total

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |      0 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |      0 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |      0 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |      0 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |      0 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |      0 |  nan |

### cognitive_max

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    2.4 |   0.55 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |    3   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |    3   |   1.41 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |    9   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |    8   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |    3   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |    8   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |    9   | nan    |

### cognitive_avg

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   1.43 |   0.21 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |   1.38 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   1.47 |   0.32 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |   2.8  | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |   3.09 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |   1.5  | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |   3    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |   2.86 | nan    |

### mccabe_max

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    3.4 |   0.55 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |    4   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |    3.8 |   1.1  |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |    7   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |    7   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |    4   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |    7   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |    9   | nan    |

### unit_count

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   22.8 |   2.77 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |   22   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   18.6 |   1.95 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |   12   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |   12   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |   22   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |   18   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |   14   | nan    |

### unit_size_max

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |     13 |   1.58 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |     14 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |     12 |   1.87 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |     21 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |     25 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |     15 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |     29 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |     22 | nan    |

### unit_size_avg

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   4.81 |   0.62 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |   4.55 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   4.56 |   0.41 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |   9.83 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |  12.58 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |   5.18 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |   7.94 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |  11.71 | nan    |

### unit_size_median

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    3.8 |   1.1  |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |    3   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |    3.5 |   0.61 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |    7.5 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |   11.5 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |    3   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |    6.5 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |   11.5 | nan    |

### longest_function

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |     13 |   1.58 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |     14 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |     12 |   1.87 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |     21 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |     25 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |     15 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |     29 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |     22 | nan    |

### tests_total

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   47.8 |   1.64 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |   54   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   48.8 |   1.1  |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |   42   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |   45   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |   40   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |   58   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |   51   | nan    |

### test_lines

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |  276.8 |  37.63 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |  278   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |  148.2 |  54.73 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |  515   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |  461   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |  362   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |  552   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |  420   | nan    |

### mutation_score

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   0.94 |   0.05 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      1 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   0.54 |   0.49 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      1 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      1 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      1 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      1 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      1 | nan    | nan    |

### mutants_total

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    124 |   4.9  |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      1 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |    113 |   3.81 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      1 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      1 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      1 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      1 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      1 |    nan | nan    |

### mutants_survived

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    7.8 |   6.3  |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      1 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   51.4 |  54.45 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      1 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      1 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      1 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      1 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      1 |  nan   | nan    |

### mutants_no_coverage

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    2.8 |   3.83 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      1 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |    1.8 |   1.64 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      1 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      1 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      1 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      1 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      1 |  nan   | nan    |

### tdd_discipline

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   0.63 |   0.01 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |   0.65 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   0.63 |   0.01 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |   0.53 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |   0.52 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |   0.55 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |   0.47 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      1 | nan    | nan    |

### tdd_discipline_step

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |      1 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |      1 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |      1 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |      1 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |      1 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      1 |    nan |  nan |

### tdd_discipline_closure

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   0.49 |   0.02 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |   0.52 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   0.49 |   0.01 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |   0.37 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |   0.35 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |   0.39 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |   0.32 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |   0    | nan    |

### test_first_rate

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   0.51 |   0.02 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |   0.54 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   0.51 |   0.01 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |   0.4  | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |   0.4  | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |   0.41 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |   0.32 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |   0    | nan    |

### red_batch_size

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |      1 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |      1 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |      1 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |      1 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |      1 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      1 |    nan |  nan |

### red_batch_max

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |      1 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |      1 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |      1 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |      1 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |      6 |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      1 |    nan |  nan |

### green_batch_size

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    1   |   0   |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |    1   | nan   |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   10.2 |  12.6 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan   |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |  nan   | nan   |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |   13.5 | nan   |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |    1   | nan   |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |    1   | nan   |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |    1   | nan   |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      1 |  nan   | nan   |

### cycles_total

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   49.6 |   2.19 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |   56   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   50.6 |   1.14 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |   43   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |   46   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |   41   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |   37   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |    2   | nan    |

### cycles_closed

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   24.2 |   1.64 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |   29   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   25   |   1    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |   16   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |   16   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |   16   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |   12   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |    0   | nan    |

### refactor_events

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   16.6 |   2.41 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |   15   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   19.6 |   3.36 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |    7   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |    4   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |   14   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |   10   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |    0   | nan    |

### skip_events

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   23.8 |   1.3  |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |   22   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   23   |   1.41 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |   26   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |   28   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |   24   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |   21   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |    0   | nan    |

### chain_suite_runs

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   95.4 |   5.41 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |  103   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |  123.6 |  11.87 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |   95   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |   78   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |   78   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |   65   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |    3   | nan    |

### chain_deviations

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   24.6 |   1.34 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |   26   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   24.6 |   0.89 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |   26   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |   31   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |   24   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |   27   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |    1   | nan    |

### chain_opens_red

| kata                         | cell_workflow    | cell_model             |   n |   k |   null |   rate_% |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|----:|-------:|---------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |   0 |      0 |        0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |   0 |      0 |        0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |   0 |      0 |        0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |   0 |      0 |        0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |   0 |      0 |        0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |   0 |      0 |        0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |   0 |      0 |        0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |   0 |      0 |        0 |    nan |  nan |

### chain_ends_green

| kata                         | cell_workflow    | cell_model             |   n |   k |   null |   rate_% |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|----:|-------:|---------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |   5 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |   1 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |   5 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |   1 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |   1 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |   1 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |   1 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |   1 |      0 |      100 |    nan |  nan |

### duration_seconds

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |  922.2 |  80.42 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 | 1159   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 | 2171.4 | 190.46 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 | 1479   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |  526   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 | 2072   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 | 1905   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 | 1761   | nan    |

### total_tokens

| kata                         | cell_workflow    | cell_model             |   n |   null |             mean |            sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-----------------:|--------------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |      2.44e+07    |   1.83647e+06 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |      3.60166e+07 | nan           |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |      8.97392e+06 |   3.43777e+06 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 |    nan           | nan           |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 |    nan           | nan           |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |      6.49166e+06 | nan           |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |      7.41398e+06 | nan           |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |      1.14228e+07 | nan           |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 | 507557           | nan           |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |      8.74635e+06 | nan           |

### cost_usd

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   9.79 |   0.49 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   1 |      0 |  10.66 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   1.47 |   0.58 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gemini-4-argon         |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | mistral-large-4        |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   1 |      0 |   3.81 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   1 |      0 |   2.21 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   1 |      0 |   1.34 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   1 |      0 |   0.05 | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   1 |      0 |   5.89 | nan    |
