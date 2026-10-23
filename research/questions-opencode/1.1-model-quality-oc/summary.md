# RQ-model-quality-oc — Aggregation

_How do five models reachable via the OpenCode harness (Opus 4.7 via Portkey + four non-Anthropic models from the Portkey catalog) differ in code quality and TDD discipline on game-of-life-example-mapping with the exact-single-context-v2-testlist-fix-oc workflow?_

Generated: 2026-10-19T08:16:09Z

Cells declared: 6 · matched runs: 30 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6 | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1 | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash-requesty | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro-requesty | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### code_mass

| kata                         | cell_workflow                           | cell_model                 |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:---------------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey           |   5 |      0 |  160.4 | 15.18 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6                  |   5 |      0 |  111   | 95.22 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1                    |   5 |      0 |  193.4 | 25.95 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash           |   5 |      0 |  200   | 36.02 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash-requesty |   5 |      0 |  177.6 | 26.95 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro-requesty   |   5 |      0 |  171.6 | 31.1  |

### cognitive_max

| kata                         | cell_workflow                           | cell_model                 |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey           |   5 |      0 |   11.4 | 4.83 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6                  |   5 |      0 |    9.4 | 8.23 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1                    |   5 |      0 |   11.6 | 4.72 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash           |   5 |      0 |   16   | 4.69 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash-requesty |   5 |      0 |    8.2 | 1.64 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro-requesty   |   5 |      0 |    9.6 | 4.72 |

### cognitive_avg

| kata                         | cell_workflow                           | cell_model                 |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey           |   5 |      0 |   8.03 | 3.07 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6                  |   5 |      0 |   8.4  | 6.8  |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1                    |   5 |      0 |   7.8  | 2.93 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash           |   5 |      0 |  14.07 | 4.97 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash-requesty |   5 |      0 |   5.23 | 2.18 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro-requesty   |   5 |      0 |   6.17 | 2.87 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model                 |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey           |   5 |      0 |    7.6 | 2.3  |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6                  |   5 |      0 |    7.6 | 4.28 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1                    |   5 |      0 |    7   | 1.41 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash           |   5 |      0 |   10.4 | 2.19 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash-requesty |   5 |      0 |    7.6 | 2.07 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro-requesty   |   5 |      0 |    8.2 | 2.68 |

### mccabe_avg

| kata                         | cell_workflow                           | cell_model                 |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey           |   5 |      0 |   2.91 | 1    |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6                  |   5 |      0 |   4.85 | 3    |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1                    |   5 |      0 |   3.39 | 1.1  |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash           |   5 |      0 |   6    | 1.66 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash-requesty |   5 |      0 |   3.2  | 1.35 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro-requesty   |   5 |      0 |   3.35 | 0.84 |

### longest_function

| kata                         | cell_workflow                           | cell_model                 |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:---------------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey           |   5 |      0 |   18.6 |  3.58 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6                  |   5 |      0 |   15.2 | 12.66 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1                    |   5 |      0 |   19.8 |  9.09 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash           |   5 |      0 |   18.6 | 12.88 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash-requesty |   5 |      0 |   15.2 | 11.32 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro-requesty   |   5 |      0 |   20.8 |  4.15 |

### avg_loc_per_function

| kata                         | cell_workflow                           | cell_model                 |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:---------------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey           |   5 |      0 |   7.59 |  1.76 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6                  |   5 |      0 |   9.9  |  6.09 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1                    |   5 |      0 |  10.05 |  3.06 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash           |   5 |      0 |  15.63 | 14    |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash-requesty |   5 |      0 |  12.52 | 11.63 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro-requesty   |   5 |      0 |  12    |  3.19 |

### median_loc_per_function

| kata                         | cell_workflow                           | cell_model                 |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:---------------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey           |   5 |      0 |    3.3 |  0.97 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6                  |   5 |      0 |    8.3 |  6.44 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1                    |   5 |      0 |    8.5 |  1.73 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash           |   5 |      0 |   14.9 | 14.32 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash-requesty |   5 |      0 |   11.8 | 12.11 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro-requesty   |   5 |      0 |   11.6 |  3.73 |

### lines_of_code

| kata                         | cell_workflow                           | cell_model                 |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:---------------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey           |   5 |      0 |   38.2 |  4.02 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6                  |   5 |      0 |   22.4 | 19.81 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1                    |   5 |      0 |   46.4 |  6.07 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash           |   5 |      0 |   52.2 | 10.45 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash-requesty |   5 |      0 |   39   |  6.78 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro-requesty   |   5 |      0 |   40   |  9.14 |

### smell_total

| kata                         | cell_workflow                           | cell_model                 |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey           |   5 |      0 |    3.6 | 1.14 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6                  |   5 |      0 |    4.4 | 2.88 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1                    |   5 |      0 |    2.8 | 2.68 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash           |   5 |      0 |    4   | 2.24 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash-requesty |   5 |      0 |    0.4 | 0.89 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro-requesty   |   5 |      0 |    0.8 | 1.79 |

### verification_pct

| kata                         | cell_workflow                           | cell_model                 |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey           |   5 |      0 |   1    |  0   |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6                  |   5 |      0 |   0.57 |  0.4 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1                    |   5 |      0 |   1    |  0   |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash           |   5 |      0 |   1    |  0   |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash-requesty |   5 |      0 |   1    |  0   |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro-requesty   |   5 |      0 |   1    |  0   |

### tests_passing

| kata                         | cell_workflow                           | cell_model                 |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:---------------------------|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey           |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6                  |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1                    |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash           |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash-requesty |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro-requesty   |   5 |   5 |      0 |      100 |

### tests_total

| kata                         | cell_workflow                           | cell_model                 |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey           |   5 |      0 |    9.4 | 0.55 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6                  |   5 |      0 |    7   | 2.74 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1                    |   5 |      0 |    9.8 | 0.84 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash           |   5 |      0 |    8.4 | 0.55 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash-requesty |   5 |      0 |    9   | 1    |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro-requesty   |   5 |      0 |    9.8 | 2.59 |

### predictions_correct

| kata                         | cell_workflow                           | cell_model                 |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey           |   5 |      0 |    4.8 | 3.7  |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6                  |   5 |      0 |    2   | 4.47 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1                    |   5 |      0 |    4.4 | 2.19 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash           |   5 |      0 |    0.4 | 0.89 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash-requesty |   5 |      0 |    5.8 | 5.22 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro-requesty   |   5 |      0 |    1.6 | 0.89 |

### predictions_total

| kata                         | cell_workflow                           | cell_model                 |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey           |   5 |      0 |    4.8 | 3.7  |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6                  |   5 |      0 |    2   | 4.47 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1                    |   5 |      0 |    4.4 | 2.19 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash           |   5 |      0 |    0.4 | 0.89 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash-requesty |   5 |      0 |    5.8 | 5.22 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro-requesty   |   5 |      0 |    1.8 | 1.1  |

### duration_seconds

| kata                         | cell_workflow                           | cell_model                 |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------------|:---------------------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey           |   5 |      0 |  231   |  31.29 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6                  |   5 |      0 | 1083   | 445.65 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1                    |   5 |      0 |  835   | 171.89 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash           |   5 |      0 |  153.2 |  28.3  |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash-requesty |   5 |      0 |  407.4 |  75.39 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro-requesty   |   5 |      0 |  126   |   6.04 |

### total_tokens

| kata                         | cell_workflow                           | cell_model                 |   n |   null |        mean |               sd |
|:-----------------------------|:----------------------------------------|:---------------------------|----:|-------:|------------:|-----------------:|
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | opus-4-7-portkey           |   5 |      0 | 1.81543e+06 | 732188           |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | kimi-k2-6                  |   5 |      0 | 2.28135e+06 |      1.34618e+06 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | glm-5-1                    |   5 |      0 | 2.95986e+06 | 581347           |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | gemini-3-5-flash           |   5 |      0 | 2.79807e+06 | 615760           |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-flash-requesty |   5 |      0 | 2.45445e+06 | 483669           |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-oc | deepseek-v4-pro-requesty   |   5 |      0 | 1.62437e+06 | 414260           |
