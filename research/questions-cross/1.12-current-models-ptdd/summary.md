# RQ-current-models-ptdd — Aggregation

_How do the current commercial and open-weight coding models differ in correctness and code quality on claim-office under the maintained EXACT Coding Predictive TDD workflow, each reached over its own native route?_

Generated: 2026-10-23T01:15:47Z

Cells declared: 8 · matched runs: 10 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking | 0 | 0 | ❌ no runs |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference | 0 | 0 | ❌ no runs |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3 | 0 | 0 | ❌ no runs |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash | 0 | 0 | ❌ no runs |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3 | 0 | 0 | ❌ no runs |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8 | 0 | 0 | ❌ no runs |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |    nan |  nan |

### verification_passed

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |    nan |  nan |

### verification_total

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |    nan |  nan |

### tests_passing

| kata                         | cell_workflow    | cell_model             |   n |   k |   null |   rate_% |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|----:|-------:|---------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |   5 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |   5 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 | nan |      0 |      nan |    nan |  nan |

### production_loc

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |  184.8 |  19.66 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |  130.2 |   7.98 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |

### code_mass

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |  632.4 |  35.98 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |  561.2 |  18.05 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |

### smell_total

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |    nan |  nan |

### cognitive_max

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    2.4 |   0.55 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |    3   |   1.41 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |

### cognitive_avg

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   1.43 |   0.21 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   1.47 |   0.32 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 | nan    | nan    |

### mccabe_max

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    3.4 |   0.55 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |    3.8 |   1.1  |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |

### unit_count

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   22.8 |   2.77 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   18.6 |   1.95 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |

### unit_size_max

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |     13 |   1.58 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |     12 |   1.87 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |    nan | nan    |

### unit_size_avg

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   4.81 |   0.62 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   4.56 |   0.41 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 | nan    | nan    |

### unit_size_median

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    3.8 |   1.1  |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |    3.5 |   0.61 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |

### longest_function

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |     13 |   1.58 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |     12 |   1.87 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |    nan | nan    |

### tests_total

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   47.8 |   1.64 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   48.8 |   1.1  |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |

### test_lines

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |  276.8 |  37.63 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |  148.2 |  54.73 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |

### mutation_score

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   0.94 |   0.05 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   0.54 |   0.49 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 | nan    | nan    |

### mutants_total

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    124 |   4.9  |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |    113 |   3.81 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |    nan | nan    |

### mutants_survived

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    7.8 |   6.3  |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   51.4 |  54.45 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |

### mutants_no_coverage

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    2.8 |   3.83 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |    1.8 |   1.64 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |

### tdd_discipline

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   0.63 |   0.01 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   0.63 |   0.01 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 | nan    | nan    |

### tdd_discipline_step

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |    nan |  nan |

### tdd_discipline_closure

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   0.49 |   0.02 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   0.49 |   0.01 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 | nan    | nan    |

### test_first_rate

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   0.51 |   0.02 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   0.51 |   0.01 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 | nan    | nan    |

### red_batch_size

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |    nan |  nan |

### red_batch_max

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |    nan |  nan |

### green_batch_size

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    1   |   0   |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |  nan   | nan   |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   10.2 |  12.6 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan   |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan   |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan   |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan   |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan   |

### cycles_total

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   49.6 |   2.19 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   50.6 |   1.14 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |

### cycles_closed

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   24.2 |   1.64 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   25   |   1    |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |

### refactor_events

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   16.6 |   2.41 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   19.6 |   3.36 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |

### skip_events

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   23.8 |   1.3  |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   23   |   1.41 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |

### chain_suite_runs

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   95.4 |   5.41 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |  123.6 |  11.87 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |

### chain_deviations

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   24.6 |   1.34 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   24.6 |   0.89 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |

### chain_opens_red

| kata                         | cell_workflow    | cell_model             |   n |   k |   null |   rate_% |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|----:|-------:|---------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |   0 |      0 |        0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |   0 |      0 |        0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 | nan |      0 |      nan |    nan |  nan |

### chain_ends_green

| kata                         | cell_workflow    | cell_model             |   n |   k |   null |   rate_% |   mean |   sd |
|:-----------------------------|:-----------------|:-----------------------|----:|----:|-------:|---------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |   5 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |   5 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 | nan |      0 |      nan |    nan |  nan |

### duration_seconds

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |  922.2 |  80.42 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 | 2171.4 | 190.46 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |

### total_tokens

| kata                         | cell_workflow    | cell_model             |   n |   null |          mean |            sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|--------------:|--------------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   2.44e+07    |   1.83647e+06 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 | nan           | nan           |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   8.97392e+06 |   3.43777e+06 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 | nan           | nan           |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 | nan           | nan           |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 | nan           | nan           |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 | nan           | nan           |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 | nan           | nan           |

### cost_usd

| kata                         | cell_workflow    | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   9.79 |   0.49 |
| claim-office-example-mapping | exact-ptdd-v1-cc | sonnet-5-5-no-thinking |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex      |   5 |      0 |   1.47 |   0.58 |
| claim-office-example-mapping | exact-ptdd-v1-pi | kimi-k3-sference       |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | glm-5-3                |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | deepseek-v4-1-flash    |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | minimax-m3             |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi | qwen3-8                |   0 |      0 | nan    | nan    |
