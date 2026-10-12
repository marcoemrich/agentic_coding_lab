# RQ-astra-pi — Aggregation

_On the OpenAI subscription route, how does GPT-6 Astra compare to the strongest references reachable on the pi harness — Sol on the same route, Sol on Requesty in both reasoning states, and Opus 5 on Requesty — at constant harness, workflow, kata and prompt style?_

Generated: 2026-10-12T08:37:50Z

Cells declared: 5 · matched runs: 25 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### cognitive_max

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |    7   | 2.24 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |    4.4 | 1.52 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |    9   | 5.57 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |   10.6 | 6.11 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty               |   5 |      0 |    2.4 | 0.89 |

### cognitive_avg

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |   2.96 | 0.29 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |   2.47 | 0.62 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |   4.87 | 2.96 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |   5.62 | 3.25 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty               |   5 |      0 |   2.2  | 0.45 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |    4.6 | 1.34 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |    4.6 | 0.55 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |    6.8 | 2.77 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |    8   | 3.81 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty               |   5 |      0 |    3.4 | 0.89 |

### mccabe_avg

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |   3.15 | 0.31 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |   2.38 | 0.24 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |   2.82 | 1.08 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |   3.29 | 0.69 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty               |   5 |      0 |   1.31 | 0.24 |

### longest_function

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |   19.4 | 3.21 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |   20.8 | 6.22 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |   18.8 | 3.7  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |   21.6 | 3.36 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty               |   5 |      0 |    5.8 | 3.63 |

### avg_loc_per_function

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |  18    | 5    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |  11.53 | 3.67 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |  14.14 | 7.05 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |  15.3  | 4.6  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty               |   5 |      0 |   2.62 | 0.62 |

### median_loc_per_function

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |   18   | 5    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |   11.1 | 4.56 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |   13.7 | 7.71 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |   15.3 | 4.6  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty               |   5 |      0 |    2   | 0    |

### smell_total

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |    2.4 | 0.89 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |    0.6 | 1.34 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |    2.4 | 1.67 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |    2.8 | 1.1  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty               |   5 |      0 |    2   | 0    |

### smell_complexity

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |    0.2 | 0.45 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |    0.8 | 1.1  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |    0.8 | 1.1  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty               |   5 |      0 |    0   | 0    |

### smell_magic_numbers

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |    2.2 | 0.45 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |    0.6 | 1.34 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |    1.6 | 0.89 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |    2   | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty               |   5 |      0 |    2   | 0    |

### smell_duplication

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty               |   5 |      0 |      0 |    0 |

### lines_of_code

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |   22.4 | 3.44 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |   41.6 | 5.77 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |   30.6 | 8.93 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |   27.2 | 2.77 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty               |   5 |      0 |   39.8 | 4.38 |

### code_mass

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |   99.4 | 15.13 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |  153.2 |  6.72 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |  138.8 | 16.8  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |  126.4 | 21.49 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty               |   5 |      0 |  151.8 | 10.83 |

### verification_pct

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty               |   5 |      0 |      1 |    0 |

### tests_passing

| kata                         | cell_workflow                           | cell_model                    |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty               |   5 |   5 |      0 |      100 |

### tests_total

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |   14   | 0.71 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |    9.8 | 1.3  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |    8.4 | 0.55 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |    8.4 | 1.52 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty               |   5 |      0 |   10.2 | 0.45 |

### cycle_count

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |   14   | 0.71 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |    9.8 | 1.3  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |    8.4 | 0.55 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |    8.4 | 1.52 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty               |   5 |      0 |   10.2 | 0.45 |

### refactorings_applied

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |    4   | 0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |    7   | 1.58 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |    5   | 1.22 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |    4.4 | 0.89 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty               |   5 |      0 |    3.8 | 0.45 |

### predictions_correct_rate

| kata                         | cell_workflow                           | cell_model                    |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 | 118 | 122 |      0 |     96.7 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |  65 |  66 |      0 |     98.5 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |  50 |  50 |      0 |    100   |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |  43 |  44 |      0 |     97.7 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty               |   5 |  32 |  32 |      0 |    100   |

### duration_seconds

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |  496.2 |  17.15 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |  615.6 | 106.46 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |  252.8 |  52.16 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |  286   |  55.93 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty               |   5 |      0 |  436.2 |  78.66 |

### total_tokens

| kata                         | cell_workflow                           | cell_model                    |   n |   null |             mean |       sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-----------------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 | 970722           |  71421.9 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |      1.25998e+06 | 278297   |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 | 855358           | 165796   |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 | 823081           | 103790   |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-5-requesty               |   5 |      0 |      2.21753e+06 | 414527   |
