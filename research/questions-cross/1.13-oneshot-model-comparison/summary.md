# RQ-oneshot-models — Aggregation

_How do the current commercial and open-weight coding models differ in correctness and code quality on claim-office when they are given no workflow at all — one prompt, no TDD, no phase structure — each model reached over its own native route?_

Generated: 2026-11-13T11:52:05Z

Cells declared: 11 · matched runs: 15 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking | 5 | 5 | ✅ |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking | 5 | 5 | ✅ |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking | 5 | 5 | ✅ |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex | 0 | 0 | ❌ no runs |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon | 0 | 0 | ❌ no runs |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference | 0 | 0 | ❌ no runs |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3 | 0 | 0 | ❌ no runs |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash | 0 | 0 | ❌ no runs |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3 | 0 | 0 | ❌ no runs |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8 | 0 | 0 | ❌ no runs |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next | 0 | 0 | ❌ no runs |

## Outcome pivots (per cell)

### verification_pct

| kata               | cell_workflow          | cell_model             |   n |   null |   mean |     sd |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   5 |      0 |   0.27 |   0    |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   0.24 |   0.04 |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   0.31 |   0.04 |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 | nan    | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 | nan    | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 | nan    | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 | nan    | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 | nan    | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 | nan    | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 | nan    | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 | nan    | nan    |

### verification_passed

| kata               | cell_workflow          | cell_model             |   n |   null |   mean |     sd |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   5 |      0 |    4   |   0    |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    3.6 |   0.55 |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |    4.6 |   0.55 |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 |  nan   | nan    |

### verification_total

| kata               | cell_workflow          | cell_model             |   n |   null |   mean |   sd |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|-------:|-----:|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   5 |      0 |     15 |    0 |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   5 |      0 |     15 |    0 |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |     15 |    0 |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 |    nan |  nan |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 |    nan |  nan |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 |    nan |  nan |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 |    nan |  nan |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 |    nan |  nan |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 |    nan |  nan |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 |    nan |  nan |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 |    nan |  nan |

### tests_passing

| kata               | cell_workflow          | cell_model             |   n |   k |   null |   rate_% |   mean |   sd |
|:-------------------|:-----------------------|:-----------------------|----:|----:|-------:|---------:|-------:|-----:|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   5 |   5 |      0 |      100 |    nan |  nan |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   5 |   5 |      0 |      100 |    nan |  nan |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   5 |   5 |      0 |      100 |    nan |  nan |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 | nan |      0 |      nan |    nan |  nan |

### production_loc

| kata               | cell_workflow          | cell_model             |   n |   null |   mean |     sd |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   5 |      0 |  385.8 |  42.07 |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   5 |      0 |  161.8 |  19.92 |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |  111.8 |   7.98 |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 |  nan   | nan    |

### code_mass

| kata               | cell_workflow          | cell_model             |   n |   null |   mean |     sd |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   5 |      0 | 1103.2 | 115.09 |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   5 |      0 |  619   |  34.53 |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |  474   |  37.17 |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 |  nan   | nan    |

### smell_total

| kata               | cell_workflow          | cell_model             |   n |   null |   mean |     sd |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   5 |      0 |    0   |   0    |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    0   |   0    |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   18.2 |   3.49 |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 |  nan   | nan    |

### cognitive_max

| kata               | cell_workflow          | cell_model             |   n |   null |   mean |     sd |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   5 |      0 |    3   |   1    |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    5.6 |   0.55 |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |    8.4 |   2.61 |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 |  nan   | nan    |

### cognitive_avg

| kata               | cell_workflow          | cell_model             |   n |   null |   mean |     sd |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   5 |      0 |   1.45 |   0.13 |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   2.95 |   0.18 |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   3.87 |   1.29 |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 | nan    | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 | nan    | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 | nan    | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 | nan    | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 | nan    | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 | nan    | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 | nan    | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 | nan    | nan    |

### mccabe_max

| kata               | cell_workflow          | cell_model             |   n |   null |   mean |     sd |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   5 |      0 |    4.6 |   0.55 |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    6   |   0.71 |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |    8   |   2.55 |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 |  nan   | nan    |

### longest_function

| kata               | cell_workflow          | cell_model             |   n |   null |   mean |     sd |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   5 |      0 |   12.4 |   2.88 |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   20.6 |   3.36 |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   25.4 |   6.35 |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 |  nan   | nan    |

### unit_count

| kata               | cell_workflow          | cell_model             |   n |   null |   mean |     sd |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   5 |      0 |   36.4 |   7.23 |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   11.6 |   1.52 |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |    7.4 |   1.82 |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 |  nan   | nan    |

### unit_size_max

| kata               | cell_workflow          | cell_model             |   n |   null |   mean |     sd |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   5 |      0 |   12.4 |   2.88 |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   20.6 |   3.36 |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   25.4 |   6.35 |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 |  nan   | nan    |

### unit_size_avg

| kata               | cell_workflow          | cell_model             |   n |   null |   mean |     sd |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   5 |      0 |   5.91 |   0.72 |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   6.82 |   0.85 |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   9.99 |   2.59 |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 | nan    | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 | nan    | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 | nan    | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 | nan    | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 | nan    | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 | nan    | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 | nan    | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 | nan    | nan    |

### unit_size_median

| kata               | cell_workflow          | cell_model             |   n |   null |   mean |     sd |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   5 |      0 |    5.6 |   1.29 |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   5 |      0 |    4.2 |   0.91 |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |    6   |   2.21 |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 |  nan   | nan    |

### tests_total

| kata               | cell_workflow          | cell_model             |   n |   null |   mean |     sd |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   5 |      0 |   67.4 |  12.52 |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   14.2 |   3.11 |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |    4.2 |   1.1  |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 |  nan   | nan    |

### test_lines

| kata               | cell_workflow          | cell_model             |   n |   null |   mean |     sd |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   5 |      0 |  626.6 | 100.52 |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   95.8 |  17.85 |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   40.6 |   9.91 |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 |  nan   | nan    |

### mutation_score

| kata               | cell_workflow          | cell_model             |   n |   null | mean   | sd   |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|:-------|:-----|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   0 |      5 |        |      |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   0 |      5 |        |      |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   0 |      5 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 |        |      |

### mutants_total

| kata               | cell_workflow          | cell_model             |   n |   null | mean   | sd   |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|:-------|:-----|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   0 |      5 |        |      |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   0 |      5 |        |      |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   0 |      5 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 |        |      |

### mutants_survived

| kata               | cell_workflow          | cell_model             |   n |   null | mean   | sd   |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|:-------|:-----|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   0 |      5 |        |      |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   0 |      5 |        |      |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   0 |      5 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 |        |      |

### mutants_no_coverage

| kata               | cell_workflow          | cell_model             |   n |   null | mean   | sd   |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|:-------|:-----|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   0 |      5 |        |      |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   0 |      5 |        |      |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   0 |      5 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 |        |      |

### duration_seconds

| kata               | cell_workflow          | cell_model             |   n |   null |   mean |     sd |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|-------:|-------:|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   5 |      0 |  367.2 |  43.22 |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   5 |      0 |   88.2 |  11.76 |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   5 |      0 |   39.2 |   5.4  |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 |  nan   | nan    |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 |  nan   | nan    |

### total_tokens

| kata               | cell_workflow          | cell_model             |   n |   null |             mean |       sd |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|-----------------:|---------:|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   5 |      0 |      2.12057e+06 | 441480   |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   5 |      0 | 441155           |  68034.2 |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   5 |      0 | 269930           |  64516.8 |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 |    nan           |    nan   |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 |    nan           |    nan   |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 |    nan           |    nan   |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 |    nan           |    nan   |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 |    nan           |    nan   |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 |    nan           |    nan   |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 |    nan           |    nan   |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 |    nan           |    nan   |

### cost_usd

| kata               | cell_workflow          | cell_model             |   n |   null | mean   | sd   |
|:-------------------|:-----------------------|:-----------------------|----:|-------:|:-------|:-----|
| claim-office-prose | baseline-oneshot-v1-cc | fable-5-2-no-thinking  |   0 |      5 |        |      |
| claim-office-prose | baseline-oneshot-v1-cc | opus-5-5-no-thinking   |   0 |      5 |        |      |
| claim-office-prose | baseline-oneshot-v1-cc | sonnet-5-5-no-thinking |   0 |      5 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | gpt-6-1-sol-codex      |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | gemini-4-argon         |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | kimi-k3-sference       |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | glm-5-3                |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | deepseek-v4-1-flash    |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | minimax-m3             |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8                |   0 |      0 |        |      |
| claim-office-prose | baseline-oneshot-v1-pi | qwen3-8-flash-next     |   0 |      0 |        |      |
