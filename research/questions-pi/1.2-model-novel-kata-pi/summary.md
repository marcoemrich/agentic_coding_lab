# RQ-model-novel-pi — Aggregation

_Wie unterscheiden sich die via pi-Harness (Requesty-Routing) erreichbaren Modelle in Korrektheit und TDD-Disziplin auf claim-office-example-mapping mit dem v6.2-with-why-cleaned-pi-Workflow?_

Generated: 2026-07-25T08:31:48Z

Cells declared: 15 · matched runs: 75 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8 | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5 | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7 | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3 | 5 | 2 | ⚠️ nur 2/5 ohne Timeout |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3-no-thinking | 5 | 4 | ⚠️ nur 4/5 ohne Timeout |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | glm-5-2 | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-terra | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | workflow                 | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro             |   5 |   0.6  |  0    |     1 |  0.55 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro-no-thinking |   5 |   0.8  |  0    |     1 |  0.45 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | glm-5-2                     |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol                 |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-terra               |   5 |   0.69 |  0    |     1 |  0.42 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7                   |   5 |   0.6  |  0    |     1 |  0.55 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7-no-thinking       |   5 |   0.73 |  0    |     1 |  0.42 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3                  |   5 |   0.2  |  0    |     1 |  0.45 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3-no-thinking      |   5 |   0.6  |  0    |     1 |  0.55 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8                    |   5 |   0.99 |  0.93 |     1 |  0.03 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-no-thinking        |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b                  |   5 |   0    |  0    |     0 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b-no-thinking      |   5 |   0    |  0    |     0 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5                    |   5 |   0.72 |  0.47 |     1 |  0.19 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5-no-thinking        |   5 |   0.84 |  0.67 |     1 |  0.15 |

### verification_passed

| kata                         | workflow                 | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro             |   5 |    9   |     0 |    15 |  8.22 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro-no-thinking |   5 |   12   |     0 |    15 |  6.71 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | glm-5-2                     |   5 |   15   |    15 |    15 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol                 |   5 |   15   |    15 |    15 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-terra               |   5 |   10.4 |     0 |    15 |  6.31 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7                   |   5 |    9   |     0 |    15 |  8.22 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7-no-thinking       |   5 |   11   |     0 |    15 |  6.36 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3                  |   5 |    3   |     0 |    15 |  6.71 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3-no-thinking      |   5 |    9   |     0 |    15 |  8.22 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8                    |   5 |   14.8 |    14 |    15 |  0.45 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-no-thinking        |   5 |   15   |    15 |    15 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b                  |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b-no-thinking      |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5                    |   5 |   10.8 |     7 |    15 |  2.86 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5-no-thinking        |   5 |   12.6 |    10 |    15 |  2.3  |

### verification_total

| kata                         | workflow                 | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro             |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | glm-5-2                     |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol                 |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-terra               |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7                   |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7-no-thinking       |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3                  |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3-no-thinking      |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8                    |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-no-thinking        |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b                  |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b-no-thinking      |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5                    |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5-no-thinking        |   5 |     15 |    15 |    15 |     0 |

### code_mass

| kata                         | workflow                 | cell_model                  |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------|:----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro             |   5 |  765.4 |   655 |   841 |  72.62 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro-no-thinking |   5 |  619.4 |   119 |   900 | 293.79 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | glm-5-2                     |   5 |  761.4 |   616 |   872 |  97.29 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol                 |   5 |  462   |   359 |   545 |  66.84 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-terra               |   5 |  482.2 |   445 |   516 |  25.27 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7                   |   5 |  527.2 |     0 |   960 | 489.08 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7-no-thinking       |   5 |  622   |   102 |   878 | 305.56 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3                  |   5 |  580.2 |   232 |   804 | 262.35 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3-no-thinking      |   5 |  516.6 |     0 |   833 | 366.09 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8                    |   5 |  782   |   653 |   866 |  85.84 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-no-thinking        |   5 |  895.2 |   795 |  1012 |  85    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b                  |   5 |   17   |     0 |    85 |  38.01 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b-no-thinking      |   5 |    0   |     0 |     0 |   0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5                    |   5 |  867.6 |   755 |   938 |  79.44 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5-no-thinking        |   5 |  853   |   788 |   898 |  45.03 |

### cognitive_max

| kata                         | workflow                 | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro             |   5 |   27.4 |    11 |    63 | 21.56 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro-no-thinking |   5 |   41.4 |     5 |    74 | 25.94 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | glm-5-2                     |   5 |    6.4 |     4 |     9 |  2.07 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol                 |   5 |    9.2 |     4 |    16 |  4.32 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-terra               |   5 |   11.6 |     0 |    17 |  7.02 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7                   |   5 |    3.4 |     0 |     7 |  3.29 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7-no-thinking       |   5 |    7   |     4 |     9 |  1.87 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3                  |   5 |    6.4 |     5 |     8 |  1.14 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3-no-thinking      |   5 |    5.4 |     0 |    10 |  3.91 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8                    |   5 |    3.6 |     3 |     6 |  1.34 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-no-thinking        |   5 |    4.6 |     3 |     9 |  2.51 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b                  |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b-no-thinking      |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5                    |   5 |    4.2 |     3 |     5 |  1.1  |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5-no-thinking        |   5 |    5.4 |     3 |     8 |  2.41 |

### mccabe_max

| kata                         | workflow                 | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro             |   5 |   14.4 |     6 |    26 |  7.54 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro-no-thinking |   5 |   18   |     5 |    29 |  9.14 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | glm-5-2                     |   5 |    5.4 |     4 |     7 |  1.34 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol                 |   5 |    6.8 |     5 |     9 |  2.05 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-terra               |   5 |    9   |     0 |    12 |  5.1  |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7                   |   5 |    3.2 |     0 |     6 |  2.95 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7-no-thinking       |   5 |    5.8 |     4 |     7 |  1.1  |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3                  |   5 |    5.4 |     5 |     7 |  0.89 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3-no-thinking      |   5 |    5   |     0 |     8 |  3.16 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8                    |   5 |    3.8 |     3 |     6 |  1.3  |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-no-thinking        |   5 |    4.4 |     3 |     7 |  1.52 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b                  |   5 |    0.4 |     0 |     2 |  0.89 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b-no-thinking      |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5                    |   5 |    4.8 |     4 |     6 |  0.84 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5-no-thinking        |   5 |    4.8 |     4 |     7 |  1.3  |

### cc_longest_function

| kata                         | workflow                 | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro             |   5 |   57   |    27 |    92 | 25.17 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro-no-thinking |   5 |   77.6 |    26 |   124 | 36    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | glm-5-2                     |   5 |   24   |    19 |    32 |  6.04 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol                 |   5 |   24   |    16 |    33 |  7.42 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-terra               |   5 |   18.2 |    16 |    21 |  1.92 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7                   |   5 |   12.4 |     0 |    22 | 11.37 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7-no-thinking       |   5 |   22.4 |    19 |    30 |  4.98 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3                  |   5 |   21.2 |    14 |    27 |  4.97 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3-no-thinking      |   5 |   25.4 |     0 |    36 | 14.52 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8                    |   5 |   22   |    17 |    25 |  4.12 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-no-thinking        |   5 |   18.2 |    13 |    28 |  5.89 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b                  |   5 |    3.8 |     0 |    19 |  8.5  |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b-no-thinking      |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5                    |   5 |   20.6 |    10 |    37 | 10.41 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5-no-thinking        |   5 |   21.2 |    16 |    32 |  6.69 |

### lines_of_code

| kata                         | workflow                 | cell_model                  |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------|:----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro             |   5 |  247.8 |   188 |   303 |  47.14 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro-no-thinking |   5 |  194.6 |    83 |   250 |  64.63 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | glm-5-2                     |   5 |  236.8 |   210 |   269 |  29.51 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol                 |   5 |  104.4 |    93 |   138 |  19.14 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-terra               |   5 |   80.2 |    71 |   101 |  12.05 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7                   |   5 |  160.2 |     0 |   301 | 150.53 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7-no-thinking       |   5 |  199.4 |    45 |   272 |  90.24 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3                  |   5 |  239.8 |   122 |   378 | 101.74 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3-no-thinking      |   5 |  208.8 |     0 |   325 | 131.84 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8                    |   5 |  271.6 |   257 |   292 |  16.76 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-no-thinking        |   5 |  303.6 |   271 |   369 |  38.49 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b                  |   5 |    5.4 |     0 |    27 |  12.07 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b-no-thinking      |   5 |    0   |     0 |     0 |   0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5                    |   5 |  304.4 |   267 |   363 |  42.05 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5-no-thinking        |   5 |  325.2 |   315 |   350 |  14.22 |

### smell_total

| kata                         | workflow                 | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro             |   5 |   12.2 |     4 |    21 |  6.53 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro-no-thinking |   5 |   15.6 |     0 |    26 | 10.78 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | glm-5-2                     |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol                 |   5 |   15.4 |    14 |    18 |  1.67 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-terra               |   5 |   14   |     0 |    26 |  9.25 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7                   |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7-no-thinking       |   5 |    2.6 |     0 |     5 |  2.41 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3                  |   5 |    0.4 |     0 |     2 |  0.89 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3-no-thinking      |   5 |    4.2 |     0 |    17 |  7.22 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8                    |   5 |    0.4 |     0 |     2 |  0.89 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-no-thinking        |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b                  |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b-no-thinking      |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5                    |   5 |    0.8 |     0 |     2 |  0.84 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5-no-thinking        |   5 |    0.8 |     0 |     4 |  1.79 |

### cycle_count

| kata                         | workflow                 | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro             |   5 |   27.8 |    21 |    36 |  6.38 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro-no-thinking |   5 |   35.8 |     0 |    70 | 28.02 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | glm-5-2                     |   5 |   12   |     0 |    60 | 26.83 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol                 |   5 |   17.8 |     8 |    32 |  9.28 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-terra               |   5 |    5.8 |     1 |    15 |  5.59 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7                   |   5 |   13   |     0 |    33 | 16.93 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7-no-thinking       |   5 |   24.8 |     1 |    63 | 25.22 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3                  |   5 |   31.2 |    17 |    50 | 16.77 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3-no-thinking      |   5 |   12.2 |     0 |    39 | 17.46 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8                    |   5 |   40.2 |    32 |    44 |  4.76 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-no-thinking        |   5 |   51   |    37 |    74 | 15.03 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b                  |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b-no-thinking      |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5                    |   5 |   47.4 |     1 |    69 | 26.67 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5-no-thinking        |   5 |   48.6 |    34 |    62 | 10.09 |

### refactorings_applied

| kata                         | workflow                 | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro             |   5 |    8.2 |     5 |    13 |  3.27 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro-no-thinking |   5 |    6.4 |     0 |    10 |  3.78 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | glm-5-2                     |   5 |    3   |     0 |    15 |  6.71 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol                 |   5 |    8.4 |     5 |    13 |  3.44 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-terra               |   5 |    5   |     1 |    15 |  5.7  |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7                   |   5 |   10.4 |     0 |    19 |  9.56 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7-no-thinking       |   5 |   12.8 |     0 |    21 |  8.5  |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3                  |   5 |   10.2 |     0 |    17 |  6.57 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3-no-thinking      |   5 |    6.2 |     0 |    17 |  8.56 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8                    |   5 |   19.4 |    14 |    27 |  5.18 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-no-thinking        |   5 |   15.8 |     8 |    22 |  5.02 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b                  |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b-no-thinking      |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5                    |   5 |   19.6 |     0 |    30 | 11.84 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5-no-thinking        |   5 |   19.2 |    14 |    25 |  3.96 |

### predictions_correct

| kata                         | workflow                 | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro             |   5 |   22.6 |    14 |    32 |  6.47 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro-no-thinking |   5 |   19.6 |     0 |    28 | 12.03 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | glm-5-2                     |   5 |    6   |     0 |    30 | 13.42 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol                 |   5 |   20.8 |    12 |    26 |  5.4  |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-terra               |   5 |    5.4 |     0 |    13 |  4.98 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7                   |   5 |   20   |     0 |    66 | 29.63 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7-no-thinking       |   5 |   18.6 |     0 |    36 | 14.52 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3                  |   5 |   18.4 |     0 |    36 | 17.34 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3-no-thinking      |   5 |    8.8 |     0 |    32 | 13.97 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8                    |   5 |   69.6 |    35 |    87 | 20.97 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-no-thinking        |   5 |   63.2 |    36 |    86 | 25.24 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b                  |   5 |    0.4 |     0 |     2 |  0.89 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b-no-thinking      |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5                    |   5 |   37.4 |     2 |    56 | 21.09 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5-no-thinking        |   5 |   36.6 |    28 |    42 |  5.46 |

### predictions_total

| kata                         | workflow                 | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro             |   5 |   22.6 |    14 |    32 |  6.47 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro-no-thinking |   5 |   19.8 |     0 |    29 | 12.21 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | glm-5-2                     |   5 |    6   |     0 |    30 | 13.42 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol                 |   5 |   20.8 |    12 |    26 |  5.4  |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-terra               |   5 |   11.8 |     2 |    30 | 11.05 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7                   |   5 |   20   |     0 |    66 | 29.63 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7-no-thinking       |   5 |   19   |     0 |    38 | 15.13 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3                  |   5 |   18.4 |     0 |    36 | 17.34 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3-no-thinking      |   5 |    8.8 |     0 |    32 | 13.97 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8                    |   5 |   70   |    36 |    87 | 20.7  |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-no-thinking        |   5 |   63.2 |    36 |    86 | 25.24 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b                  |   5 |    0.4 |     0 |     2 |  0.89 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b-no-thinking      |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5                    |   5 |   38.2 |     2 |    58 | 21.71 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5-no-thinking        |   5 |   36.8 |    28 |    42 |  5.4  |

### tests_passing (rate %)

| kata                         | workflow                 | cell_model                  |   n |   match |   rate_% |
|:-----------------------------|:-------------------------|:----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro             |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro-no-thinking |   5 |       4 |       80 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | glm-5-2                     |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol                 |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-terra               |   5 |       4 |       80 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7                   |   5 |       3 |       60 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7-no-thinking       |   5 |       4 |       80 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3                  |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3-no-thinking      |   5 |       4 |       80 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8                    |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-no-thinking        |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b                  |   5 |       0 |        0 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b-no-thinking      |   5 |       0 |        0 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5                    |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5-no-thinking        |   5 |       5 |      100 |

### tests_total

| kata                         | workflow                 | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro             |   5 |   43.8 |    42 |    45 |  1.3  |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro-no-thinking |   5 |   36.4 |     0 |    48 | 20.5  |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | glm-5-2                     |   5 |   32   |     5 |    42 | 15.22 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol                 |   5 |   19.8 |    11 |    34 |  8.84 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-terra               |   5 |   15.2 |     3 |    22 |  7.56 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7                   |   5 |   22   |     0 |    45 | 20.8  |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7-no-thinking       |   5 |   29.4 |     0 |    41 | 16.71 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3                  |   5 |   21.8 |     0 |    48 | 18.89 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3-no-thinking      |   5 |   15.4 |     0 |    41 | 16.29 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8                    |   5 |   39.4 |    32 |    43 |  4.28 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-no-thinking        |   5 |   41   |    37 |    45 |  3.39 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b                  |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b-no-thinking      |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5                    |   5 |   23.4 |     5 |    42 | 14.69 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5-no-thinking        |   5 |   21.4 |     5 |    39 | 13.79 |

### completed_within_budget (rate %)

| kata                         | workflow                 | cell_model                  |   n |   match |   rate_% |
|:-----------------------------|:-------------------------|:----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro             |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | glm-5-2                     |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol                 |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-terra               |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7                   |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7-no-thinking       |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3                  |   5 |       2 |       40 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3-no-thinking      |   5 |       4 |       80 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8                    |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-no-thinking        |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b                  |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b-no-thinking      |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5                    |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5-no-thinking        |   5 |       5 |      100 |

### duration_seconds

| kata                         | workflow                 | cell_model                  |   n |   mean |   min |   max |     std |
|:-----------------------------|:-------------------------|:----------------------------|----:|-------:|------:|------:|--------:|
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro             |   5 |  745.6 |   582 |   871 |  114.61 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro-no-thinking |   5 |  561.2 |    56 |   913 |  319.36 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | glm-5-2                     |   5 | 2817.8 |  2238 |  3278 |  431.31 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol                 |   5 |  503.4 |   368 |   724 |  144.93 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-terra               |   5 |  216.6 |   126 |   355 |  103.54 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7                   |   5 | 1593.4 |    20 |  3158 | 1547.16 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7-no-thinking       |   5 | 1477.6 |    81 |  3206 | 1150.4  |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3                  |   5 | 8480.6 |  7206 | 13297 | 2695.19 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3-no-thinking      |   5 | 5466   |   586 |  7202 | 2770.4  |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8                    |   5 | 1883.8 |  1435 |  2375 |  392.48 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-no-thinking        |   5 | 1656   |  1032 |  1961 |  382.66 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b                  |   5 |   34.2 |    15 |    59 |   16.1  |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b-no-thinking      |   5 |   36   |    15 |    95 |   33.6  |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5                    |   5 | 5787.4 |  4065 |  7341 | 1380.77 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5-no-thinking        |   5 | 4866.4 |  4059 |  6036 |  830.1  |

### total_tokens

| kata                         | workflow                 | cell_model                  |   n |             mean |     min |     max |              std |
|:-----------------------------|:-------------------------|:----------------------------|----:|-----------------:|--------:|--------:|-----------------:|
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro             |   5 | 818370           |  528135 | 1188234 | 252033           |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | deepseek-v4-pro-no-thinking |   5 | 693610           |   15296 | 1079391 | 414188           |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | glm-5-2                     |   5 | 439138           |       0 | 2195688 | 981942           |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol                 |   5 | 424218           |  266511 |  653559 | 165148           |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-terra               |   5 | 256822           |   49256 |  789973 | 304386           |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7                   |   5 |      2.18604e+06 |   13368 | 4158102 |      2.05325e+06 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | kimi-k2-7-no-thinking       |   5 |      2.25457e+06 |   23185 | 3654839 |      1.52533e+06 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3                  |   5 |      2.08977e+06 |   46128 | 2956880 |      1.16502e+06 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | minimax-m3-no-thinking      |   5 |      1.05553e+06 |       0 | 2750748 |      1.43306e+06 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8                    |   5 |      1.61214e+06 | 1208517 | 2159286 | 395046           |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-no-thinking        |   5 |      1.43302e+06 |  717591 | 1944318 | 445573           |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b                  |   5 |  14117.6         |   11254 |   19688 |   3679.36        |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | qwen3-235b-no-thinking      |   5 |  11572           |   10891 |   13177 |    942.32        |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5                    |   5 |      2.86202e+06 |   66695 | 4520083 |      1.73406e+06 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | sonnet-5-no-thinking        |   5 |      3.17892e+06 | 2614111 | 3800219 | 540672           |
