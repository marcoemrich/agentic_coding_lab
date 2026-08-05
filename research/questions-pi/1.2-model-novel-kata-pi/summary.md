# RQ-model-novel-pi — Aggregation

_How do the models reachable via the pi harness (Requesty routing) differ in correctness and TDD discipline on claim-office-example-mapping with the v6.2-with-why-cleaned-pi workflow?_

Generated: 2026-08-04T23:56:25Z

Cells declared: 16 · matched runs: 80 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8 | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5 | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7 | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3 | 5 | 2 | ⚠️ nur 2/5 ohne Timeout |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3-no-thinking | 5 | 4 | ⚠️ nur 4/5 ohne Timeout |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2 | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k3-sference | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | cell_workflow                | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro             |   5 |   0.6  |  0    |     1 |  0.55 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |   0.8  |  0    |     1 |  0.45 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2                     |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol                 |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra               |   5 |   0.69 |  0    |     1 |  0.42 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7                   |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |   0.73 |  0    |     1 |  0.42 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k3-sference            |   5 |   0.99 |  0.93 |     1 |  0.03 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3                  |   5 |   0.2  |  0    |     1 |  0.45 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3-no-thinking      |   5 |   0.77 |  0    |     1 |  0.44 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8                    |   5 |   0.99 |  0.93 |     1 |  0.03 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking        |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b                  |   5 |   0    |  0    |     0 |  0    |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |   0    |  0    |     0 |  0    |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5                    |   5 |   0.72 |  0.47 |     1 |  0.19 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5-no-thinking        |   5 |   0.84 |  0.67 |     1 |  0.15 |

### verification_passed

| kata                         | cell_workflow                | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro             |   5 |    9   |     0 |    15 |  8.22 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |   12   |     0 |    15 |  6.71 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2                     |   5 |   15   |    15 |    15 |  0    |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol                 |   5 |   15   |    15 |    15 |  0    |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra               |   5 |   10.4 |     0 |    15 |  6.31 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7                   |   5 |   15   |    15 |    15 |  0    |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |   11   |     0 |    15 |  6.36 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k3-sference            |   5 |   14.8 |    14 |    15 |  0.45 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3                  |   5 |    3   |     0 |    15 |  6.71 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3-no-thinking      |   5 |   11.6 |     0 |    15 |  6.54 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8                    |   5 |   14.8 |    14 |    15 |  0.45 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking        |   5 |   15   |    15 |    15 |  0    |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b                  |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5                    |   5 |   10.8 |     7 |    15 |  2.86 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5-no-thinking        |   5 |   12.6 |    10 |    15 |  2.3  |

### verification_total

| kata                         | cell_workflow                | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro             |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2                     |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol                 |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra               |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7                   |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k3-sference            |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3                  |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3-no-thinking      |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8                    |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking        |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b                  |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5                    |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5-no-thinking        |   5 |     15 |    15 |    15 |     0 |

### code_mass

| kata                         | cell_workflow                | cell_model                  |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro             |   5 |  765.4 |   655 |   841 |  72.62 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |  619.4 |   119 |   900 | 293.79 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2                     |   5 |  761.4 |   616 |   872 |  97.29 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol                 |   5 |  462   |   359 |   545 |  66.84 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra               |   5 |  482.2 |   445 |   516 |  25.27 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7                   |   5 |  850.6 |   737 |   960 | 102.68 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |  622   |   102 |   878 | 305.56 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k3-sference            |   5 |  665.6 |   638 |   694 |  25.28 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3                  |   5 |  580.2 |   232 |   804 | 262.35 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3-no-thinking      |   5 |  700.4 |   281 |   919 | 256.03 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8                    |   5 |  782   |   653 |   866 |  85.84 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking        |   5 |  895.2 |   795 |  1012 |  85    |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b                  |   5 |  296.4 |    73 |   818 | 306.79 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |  251.4 |    66 |   431 | 172.34 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5                    |   5 |  867.6 |   755 |   938 |  79.44 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5-no-thinking        |   5 |  853   |   788 |   898 |  45.03 |

### cognitive_max

| kata                         | cell_workflow                | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro             |   5 |   27.4 |    11 |    63 | 21.56 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |   41.4 |     5 |    74 | 25.94 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2                     |   5 |    6.4 |     4 |     9 |  2.07 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol                 |   5 |    9.2 |     4 |    16 |  4.32 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra               |   5 |   11.6 |     0 |    17 |  7.02 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7                   |   5 |    5.2 |     3 |     7 |  1.64 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |    7   |     4 |     9 |  1.87 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k3-sference            |   5 |    3.4 |     3 |     4 |  0.55 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3                  |   5 |    6.4 |     5 |     8 |  1.14 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3-no-thinking      |   5 |    7   |     3 |    10 |  2.55 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8                    |   5 |    3.6 |     3 |     6 |  1.34 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking        |   5 |    4.6 |     3 |     9 |  2.51 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b                  |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |    4.6 |     0 |    11 |  4.72 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5                    |   5 |    4.2 |     3 |     5 |  1.1  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5-no-thinking        |   5 |    5.4 |     3 |     8 |  2.41 |

### mccabe_max

| kata                         | cell_workflow                | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro             |   5 |   14.4 |     6 |    26 |  7.54 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |   18   |     5 |    29 |  9.14 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2                     |   5 |    5.4 |     4 |     7 |  1.34 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol                 |   5 |    6.8 |     5 |     9 |  2.05 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra               |   5 |    9   |     0 |    12 |  5.1  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7                   |   5 |    5   |     4 |     6 |  0.71 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |    5.8 |     4 |     7 |  1.1  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k3-sference            |   5 |    3.6 |     3 |     4 |  0.55 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3                  |   5 |    5.4 |     5 |     7 |  0.89 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3-no-thinking      |   5 |    6.8 |     4 |     9 |  1.92 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8                    |   5 |    3.8 |     3 |     6 |  1.3  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking        |   5 |    4.4 |     3 |     7 |  1.52 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b                  |   5 |    0.4 |     0 |     2 |  0.89 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |    4.2 |     0 |     9 |  4.09 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5                    |   5 |    4.8 |     4 |     6 |  0.84 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5-no-thinking        |   5 |    4.8 |     4 |     7 |  1.3  |

### cc_longest_function

| kata                         | cell_workflow                | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro             |   5 |   57   |    27 |    92 | 25.17 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |   77.6 |    26 |   124 | 36    |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2                     |   5 |   24   |    19 |    32 |  6.04 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol                 |   5 |   24   |    16 |    33 |  7.42 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra               |   5 |   18.2 |    16 |    21 |  1.92 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7                   |   5 |   19.4 |    15 |    22 |  2.7  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |   22.4 |    19 |    30 |  4.98 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k3-sference            |   5 |   21.4 |    17 |    30 |  5.32 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3                  |   5 |   21.2 |    14 |    27 |  4.97 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3-no-thinking      |   5 |   29.4 |    20 |    36 |  6.07 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8                    |   5 |   22   |    17 |    25 |  4.12 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking        |   5 |   18.2 |    13 |    28 |  5.89 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b                  |   5 |   33   |     3 |    78 | 28.04 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |   33.2 |     3 |    55 | 27.22 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5                    |   5 |   20.6 |    10 |    37 | 10.41 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5-no-thinking        |   5 |   21.2 |    16 |    32 |  6.69 |

### lines_of_code

| kata                         | cell_workflow                | cell_model                  |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro             |   5 |  247.8 |   188 |   303 |  47.14 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |  194.6 |    83 |   250 |  64.63 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2                     |   5 |  236.8 |   210 |   269 |  29.51 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol                 |   5 |  104.4 |    93 |   138 |  19.14 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra               |   5 |   80.2 |    71 |   101 |  12.05 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7                   |   5 |  262.6 |   209 |   301 |  36.75 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |  199.4 |    45 |   272 |  90.24 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k3-sference            |   5 |  247.4 |   197 |   281 |  34.24 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3                  |   5 |  239.8 |   122 |   378 | 101.74 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3-no-thinking      |   5 |  286.6 |   161 |   389 |  83.87 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8                    |   5 |  271.6 |   257 |   292 |  16.76 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking        |   5 |  303.6 |   271 |   369 |  38.49 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b                  |   5 |  117.8 |    27 |   331 | 125.18 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |   84   |    28 |   145 |  54.54 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5                    |   5 |  304.4 |   267 |   363 |  42.05 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5-no-thinking        |   5 |  325.2 |   315 |   350 |  14.22 |

### smell_total

| kata                         | cell_workflow                | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro             |   5 |   12.2 |     4 |    21 |  6.53 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |   15.6 |     0 |    26 | 10.78 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2                     |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol                 |   5 |   15.4 |    14 |    18 |  1.67 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra               |   5 |   14   |     0 |    26 |  9.25 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7                   |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |    2.6 |     0 |     5 |  2.41 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k3-sference            |   5 |    0.4 |     0 |     1 |  0.55 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3                  |   5 |    0.4 |     0 |     2 |  0.89 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3-no-thinking      |   5 |    4.4 |     0 |    17 |  7.09 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8                    |   5 |    0.4 |     0 |     2 |  0.89 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking        |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b                  |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |    4.6 |     0 |    11 |  4.67 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5                    |   5 |    0.8 |     0 |     2 |  0.84 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5-no-thinking        |   5 |    0.8 |     0 |     4 |  1.79 |

### cycle_count

| kata                         | cell_workflow                | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro             |   5 |   27.8 |    21 |    36 |  6.38 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |   35.8 |     0 |    70 | 28.02 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2                     |   5 |   44.8 |    25 |    66 | 17.4  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol                 |   5 |   17.8 |     8 |    32 |  9.28 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra               |   5 |    5.8 |     1 |    15 |  5.59 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7                   |   5 |   23.4 |     1 |    38 | 15.18 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |   24.8 |     1 |    63 | 25.22 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k3-sference            |   5 |   46.8 |    32 |    54 |  8.98 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3                  |   5 |   31.2 |    17 |    50 | 16.77 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3-no-thinking      |   5 |   33   |    21 |    42 | 10.56 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8                    |   5 |   40.2 |    32 |    44 |  4.76 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking        |   5 |   51   |    37 |    74 | 15.03 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b                  |   5 |    2.8 |     0 |    11 |  4.6  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |    8.6 |     1 |    26 | 10.97 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5                    |   5 |   47.4 |     1 |    69 | 26.67 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5-no-thinking        |   5 |   48.6 |    34 |    62 | 10.09 |

### refactorings_applied

| kata                         | cell_workflow                | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro             |   5 |    8.2 |     5 |    13 |  3.27 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |    6.4 |     0 |    10 |  3.78 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2                     |   5 |   16.2 |    15 |    18 |  1.3  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol                 |   5 |    8.4 |     5 |    13 |  3.44 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra               |   5 |    5   |     1 |    15 |  5.7  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7                   |   5 |   18.4 |    16 |    21 |  1.95 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |   12.8 |     0 |    21 |  8.5  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k3-sference            |   5 |   17.2 |    13 |    21 |  3.35 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3                  |   5 |   10.2 |     0 |    17 |  6.57 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3-no-thinking      |   5 |   13.2 |    10 |    17 |  3.11 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8                    |   5 |   19.4 |    14 |    27 |  5.18 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking        |   5 |   15.8 |     8 |    22 |  5.02 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b                  |   5 |    4.6 |     0 |    16 |  7.06 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |    6.4 |     0 |    13 |  6.02 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5                    |   5 |   19.6 |     0 |    30 | 11.84 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5-no-thinking        |   5 |   19.2 |    14 |    25 |  3.96 |

### predictions_correct

| kata                         | cell_workflow                | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro             |   5 |   22.6 |    14 |    32 |  6.47 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |   19.6 |     0 |    28 | 12.03 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2                     |   5 |   31.2 |    26 |    34 |  3.35 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol                 |   5 |   20.8 |    12 |    26 |  5.4  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra               |   5 |    5.4 |     0 |    13 |  4.98 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7                   |   5 |   37.6 |     0 |    66 | 24.1  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |   18.6 |     0 |    36 | 14.52 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k3-sference            |   5 |   33.2 |    25 |    39 |  5.81 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3                  |   5 |   18.4 |     0 |    36 | 17.34 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3-no-thinking      |   5 |   31.8 |     3 |    78 | 28.99 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8                    |   5 |   69.6 |    35 |    87 | 20.97 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking        |   5 |   63.2 |    36 |    86 | 25.24 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b                  |   5 |   10.6 |     0 |    35 | 15.19 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |   12.2 |     2 |    28 | 11.1  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5                    |   5 |   37.4 |     2 |    56 | 21.09 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5-no-thinking        |   5 |   36.6 |    28 |    42 |  5.46 |

### predictions_total

| kata                         | cell_workflow                | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro             |   5 |   22.6 |    14 |    32 |  6.47 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |   19.8 |     0 |    29 | 12.21 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2                     |   5 |   31.2 |    26 |    34 |  3.35 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol                 |   5 |   20.8 |    12 |    26 |  5.4  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra               |   5 |   11.8 |     2 |    30 | 11.05 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7                   |   5 |   37.6 |     0 |    66 | 24.1  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |   19   |     0 |    38 | 15.13 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k3-sference            |   5 |   33.6 |    25 |    40 |  6.27 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3                  |   5 |   18.4 |     0 |    36 | 17.34 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3-no-thinking      |   5 |   31.8 |     3 |    78 | 28.99 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8                    |   5 |   70   |    36 |    87 | 20.7  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking        |   5 |   63.2 |    36 |    86 | 25.24 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b                  |   5 |   10.8 |     0 |    36 | 15.59 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |   14.8 |     2 |    28 | 12.05 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5                    |   5 |   38.2 |     2 |    58 | 21.71 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5-no-thinking        |   5 |   36.8 |    28 |    42 |  5.4  |

### tests_passing (rate %)

| kata                         | cell_workflow                | cell_model                  |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro             |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |       4 |       80 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2                     |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol                 |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra               |   5 |       4 |       80 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7                   |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |       4 |       80 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k3-sference            |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3                  |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3-no-thinking      |   5 |       4 |       80 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8                    |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking        |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b                  |   5 |       0 |        0 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |       0 |        0 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5                    |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5-no-thinking        |   5 |       5 |      100 |

### tests_total

| kata                         | cell_workflow                | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro             |   5 |   43.8 |    42 |    45 |  1.3  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |   36.4 |     0 |    48 | 20.5  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2                     |   5 |   32   |     5 |    42 | 15.22 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol                 |   5 |   19.8 |    11 |    34 |  8.84 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra               |   5 |   15.2 |     3 |    22 |  7.56 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7                   |   5 |   36.4 |    30 |    45 |  5.81 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |   29.4 |     0 |    41 | 16.71 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k3-sference            |   5 |   33.8 |    31 |    36 |  2.17 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3                  |   5 |   21.8 |     0 |    48 | 18.89 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3-no-thinking      |   5 |   19.6 |     3 |    41 | 13.85 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8                    |   5 |   39.4 |    32 |    43 |  4.28 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking        |   5 |   41   |    37 |    45 |  3.39 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b                  |   5 |    0.6 |     0 |     1 |  0.55 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |    9.8 |     1 |    18 |  8.17 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5                    |   5 |   23.4 |     5 |    42 | 14.69 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5-no-thinking        |   5 |   21.4 |     5 |    39 | 13.79 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                | cell_model                  |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro             |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2                     |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol                 |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra               |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7                   |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k3-sference            |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3                  |   5 |       2 |       40 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3-no-thinking      |   5 |       4 |       80 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8                    |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking        |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b                  |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5                    |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5-no-thinking        |   5 |       5 |      100 |

### duration_seconds

| kata                         | cell_workflow                | cell_model                  |   n |   mean |   min |   max |     std |
|:-----------------------------|:-----------------------------|:----------------------------|----:|-------:|------:|------:|--------:|
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro             |   5 |  745.6 |   582 |   871 |  114.61 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |  561.2 |    56 |   913 |  319.36 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2                     |   5 | 2817.8 |  2238 |  3278 |  431.31 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol                 |   5 |  503.4 |   368 |   724 |  144.93 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra               |   5 |  216.6 |   126 |   355 |  103.54 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7                   |   5 | 2214.2 |  1498 |  3158 |  848.19 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 | 1477.6 |    81 |  3206 | 1150.4  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k3-sference            |   5 | 1929.2 |  1258 |  2411 |  427.26 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3                  |   5 | 8480.6 |  7206 | 13297 | 2695.19 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3-no-thinking      |   5 | 8090.2 |  6008 | 13707 | 3176.79 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8                    |   5 | 1883.8 |  1435 |  2375 |  392.48 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking        |   5 | 1656   |  1032 |  1961 |  382.66 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b                  |   5 |  679.2 |    19 |  2158 |  876.71 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |  409   |    73 |   757 |  272.54 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5                    |   5 | 5787.4 |  4065 |  7341 | 1380.77 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5-no-thinking        |   5 | 4866.4 |  4059 |  6036 |  830.1  |

### total_tokens

| kata                         | cell_workflow                | cell_model                  |   n |             mean |      min |      max |              std |
|:-----------------------------|:-----------------------------|:----------------------------|----:|-----------------:|---------:|---------:|-----------------:|
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro             |   5 |      1.46158e+07 | 10448957 | 18603325 |      3.19643e+06 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |      9.47146e+06 |   162369 | 16033125 |      6.41141e+06 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2                     |   5 |      1.53202e+07 |  3470550 | 26439317 |      1.01938e+07 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol                 |   5 |      2.08521e+06 |  1145350 |  3325566 | 801525           |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra               |   5 | 809357           |   228031 |  1485822 | 502409           |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7                   |   5 |      1.77036e+07 | 13050493 | 24677166 |      4.73805e+06 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |      1.09921e+07 |   180023 | 18589006 |      7.0597e+06  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k3-sference            |   5 |      8.34828e+06 |  6312161 | 11057115 |      1.86471e+06 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3                  |   5 |      7.27703e+06 |   710090 | 15505282 |      5.98934e+06 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3-no-thinking      |   5 |      1.27888e+07 |  8757216 | 19487070 |      4.79597e+06 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8                    |   5 |      1.3833e+07  | 10251676 | 18310499 |      3.09284e+06 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking        |   5 |      1.36489e+07 |  8774145 | 17479172 |      3.40331e+06 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b                  |   5 |      1.0336e+07  |   106782 | 26757422 |      1.2803e+07  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |      4.58033e+06 |   702061 |  9693824 |      3.24081e+06 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5                    |   5 |      2.88842e+07 |   585789 | 40068004 |      1.6135e+07  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5-no-thinking        |   5 |      2.4437e+07  | 16800301 | 32696958 |      7.7755e+06  |

### cost_usd

| kata                         | cell_workflow                | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro             |   5 |   7.19 |  5.27 |  9.05 |  1.47 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | deepseek-v4-pro-no-thinking |   5 |   4.74 |  0.12 |  7.74 |  3.1  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | glm-5-2                     |   5 |   7.76 |  2.57 | 12.58 |  4.51 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol                 |   5 |   2.54 |  1.87 |  3.55 |  0.65 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-terra               |   5 |   0.6  |  0.19 |  1.25 |  0.4  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7                   |   5 |   6.79 |  5.28 |  8.99 |  1.46 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k2-7-no-thinking       |   5 |   4.32 |  0.11 |  7.14 |  2.75 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | kimi-k3-sference            |   5 |   3.56 |  2.83 |  4.29 |  0.54 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3                  |   5 |   1.1  |  0.1  |  2.09 |  0.8  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | minimax-m3-no-thinking      |   5 |   1.71 |  1.22 |  2.48 |  0.51 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8                    |   5 |  14.43 | 11.04 | 18.67 |  2.98 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking        |   5 |  13.68 |  8.68 | 16.73 |  3.17 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b                  |   5 |   2.08 |  0.02 |  5.4  |  2.57 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | qwen3-235b-no-thinking      |   5 |   0.93 |  0.14 |  1.96 |  0.66 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5                    |   5 |  13.68 |  0.76 | 20.24 |  7.57 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | sonnet-5-no-thinking        |   5 |  13.21 | 10.13 | 16.43 |  2.71 |
