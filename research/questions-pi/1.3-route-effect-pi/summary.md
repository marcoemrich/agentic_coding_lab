# RQ-route-effect-pi — Aggregation

_How do transport route and reasoning channel each affect code quality, TDD discipline, throughput and correctness for one and the same model (GPT-5.6 Sol), at constant harness, workflow, kata and prompt style?_

Generated: 2026-10-23T00:54:30Z

Cells declared: 3 · matched runs: 15 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### duration_seconds

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |  252.8 |  52.16 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |  286   |  55.93 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |  615.6 | 106.46 |

### total_tokens

| kata                         | cell_workflow                           | cell_model                    |   n |   null |             mean |     sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-----------------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 | 855358           | 165796 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 | 823081           | 103790 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |      1.25998e+06 | 278297 |

### code_mass

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |  138.8 | 16.8  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |  126.4 | 21.49 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |  153.2 |  6.72 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |    9   | 5.57 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |   10.6 | 6.11 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |    4.4 | 1.52 |

### cognitive_avg

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |   4.87 | 2.96 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |   5.62 | 3.25 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |   2.47 | 0.62 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |    6.8 | 2.77 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |    8   | 3.81 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |    4.6 | 0.55 |

### mccabe_avg

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |   2.82 | 1.08 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |   3.29 | 0.69 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |   2.38 | 0.24 |

### longest_function

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |   18.8 | 3.7  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |   21.6 | 3.36 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |   20.8 | 6.22 |

### avg_loc_per_function

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |  14.14 | 7.05 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |  15.3  | 4.6  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |  11.53 | 3.67 |

### median_loc_per_function

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |   13.7 | 7.71 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |   15.3 | 4.6  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |   11.1 | 4.56 |

### lines_of_code

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |   30.6 | 8.93 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |   27.2 | 2.77 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |   41.6 | 5.77 |

### smell_total

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |    2.4 | 1.67 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |    2.8 | 1.1  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |    0.6 | 1.34 |

### verification_pct

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |      1 |    0 |

### tests_passing

| kata                         | cell_workflow                           | cell_model                    |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |   5 |      0 |      100 |

### tests_total

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |    8.4 | 0.55 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |    8.4 | 1.52 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |    9.8 | 1.3  |

### predictions_correct

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |   10   | 2.45 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |    8.6 | 1.67 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |   13   | 2.65 |

### predictions_total

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |   10   | 2.45 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |    8.8 | 1.79 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |   13.2 | 2.28 |

### cost_usd

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |   0.79 | 0.15 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |   0.79 | 0.1  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |   2.02 | 0.39 |
