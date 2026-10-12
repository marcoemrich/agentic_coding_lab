# RQ-model-quality-cc-vs-pi — Aggregation

_Does the code-quality profile of Opus (opus-4-8) differ between the Claude Code and the pi harness, each with and without thinking, at a constant workflow generation (hybrid-v4)?_

Generated: 2026-10-12T10:46:35Z

Cells declared: 4 · matched runs: 20 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8 | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### cognitive_max

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-requesty    |   5 |      0 |    5   | 1.87 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-no-thinking |   5 |      0 |    5.6 | 1.52 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8             |   5 |      0 |    9.6 | 3.71 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking |   5 |      0 |    8.2 | 5.36 |

### cognitive_avg

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-requesty    |   5 |      0 |   3.17 | 0.76 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-no-thinking |   5 |      0 |   3.87 | 1.43 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8             |   5 |      0 |   5.57 | 1.87 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking |   5 |      0 |   7.4  | 5.9  |

### mccabe_max

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-requesty    |   5 |      0 |    4.6 | 0.89 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-no-thinking |   5 |      0 |    5   | 1.41 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8             |   5 |      0 |    6.8 | 1.48 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking |   5 |      0 |    6.6 | 2.97 |

### mccabe_avg

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-requesty    |   5 |      0 |   2.16 | 0.61 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-no-thinking |   5 |      0 |   2.11 | 0.88 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8             |   5 |      0 |   2.9  | 0.39 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking |   5 |      0 |   3.13 | 0.8  |

### longest_function

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-requesty    |   5 |      0 |   11.6 | 1.52 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-no-thinking |   5 |      0 |   11.8 | 6.5  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8             |   5 |      0 |   17.4 | 5.5  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking |   5 |      0 |   17.8 | 5.31 |

### avg_loc_per_function

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-requesty    |   5 |      0 |   5.44 | 1.43 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-no-thinking |   5 |      0 |   4.89 | 2.06 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8             |   5 |      0 |   6.89 | 1.69 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking |   5 |      0 |   8.19 | 2.01 |

### lines_of_code

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-requesty    |   5 |      0 |   44.6 |  8.2  |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-no-thinking |   5 |      0 |   40   |  5.7  |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8             |   5 |      0 |   35.2 |  2.77 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking |   5 |      0 |   42.2 | 10.28 |

### code_mass

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-requesty    |   5 |      0 |  158.6 | 13.58 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-no-thinking |   5 |      0 |  171.8 | 19.41 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8             |   5 |      0 |  149.2 | 13.08 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking |   5 |      0 |  159.6 | 17.64 |

### smell_total

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-requesty    |   5 |      0 |    2.2 | 0.45 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-no-thinking |   5 |      0 |    2   | 1.22 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8             |   5 |      0 |    3.4 | 1.52 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking |   5 |      0 |    1.2 | 1.79 |

### tests_passing

| kata                         | cell_workflow                           | cell_model           |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:---------------------|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-requesty    |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8             |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking |   5 |   5 |      0 |      100 |

### tests_total

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-requesty    |   5 |      0 |    8.8 | 0.45 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-no-thinking |   5 |      0 |    8.8 | 0.45 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8             |   5 |      0 |    8.6 | 0.55 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking |   5 |      0 |    8.8 | 0.45 |

### verification_pct

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-requesty    |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-no-thinking |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8             |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking |   5 |      0 |      1 |    0 |

### predictions_correct

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-requesty    |   5 |      0 |   17.6 | 0.89 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-no-thinking |   5 |      0 |   13.8 | 7.76 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8             |   5 |      0 |   19.4 | 5.46 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking |   5 |      0 |   16.8 | 2.68 |

### predictions_total

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-requesty    |   5 |      0 |   17.6 | 0.89 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-no-thinking |   5 |      0 |   14   | 7.87 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8             |   5 |      0 |   19.4 | 5.46 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking |   5 |      0 |   16.8 | 2.68 |

### duration_seconds

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-requesty    |   5 |      0 |  718.6 |  32.53 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-no-thinking |   5 |      0 |  579.2 | 157.85 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8             |   5 |      0 |  339.4 |  45.72 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking |   5 |      0 |  318   |  21.71 |

### total_tokens

| kata                         | cell_workflow                           | cell_model           |   n |   null |        mean |               sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|------------:|-----------------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-requesty    |   5 |      0 | 5.21111e+06 | 589288           |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-no-thinking |   5 |      0 | 8.96174e+06 |      2.15189e+06 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8             |   5 |      0 | 1.23042e+06 | 277681           |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking |   5 |      0 | 1.26613e+06 |  76766.8         |

### cost_usd

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-requesty    |   5 |      0 |   5.53 |  0.51 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc              | opus-4-8-no-thinking |   5 |      0 |  15.82 | 15.52 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8             |   5 |      0 |   2    |  0.25 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | opus-4-8-no-thinking |   5 |      0 |   2    |  0.09 |
