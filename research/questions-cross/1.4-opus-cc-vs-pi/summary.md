# RQ-model-quality-cc-vs-pi — Aggregation

_Does the code-quality profile of Opus (opus-4-8) differ between the Claude Code and the pi harness, each with and without thinking, at a constant workflow generation (v6.2)?_

Generated: 2026-07-26T10:34:56Z

Cells declared: 4 · matched runs: 20 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-8-requesty | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8 | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### cognitive_max

| kata                         | cell_workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-no-thinking |   5 |    5.6 |     4 |     7 |  1.52 |
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-requesty    |   5 |    5   |     3 |     7 |  1.87 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8             |   5 |    9.6 |     7 |    15 |  3.71 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking |   5 |    8.2 |     4 |    17 |  5.36 |

### cognitive_avg

| kata                         | cell_workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-no-thinking |   5 |   3.87 |  2.33 |   6   |  1.43 |
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-requesty    |   5 |   3.17 |  2.67 |   4.5 |  0.76 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8             |   5 |   5.57 |  4    |   8.5 |  1.87 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking |   5 |   7.4  |  3    |  17   |  5.9  |

### mccabe_max

| kata                         | cell_workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-no-thinking |   5 |    5   |     4 |     7 |  1.41 |
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-requesty    |   5 |    4.6 |     4 |     6 |  0.89 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8             |   5 |    6.8 |     5 |     9 |  1.48 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking |   5 |    6.6 |     4 |    11 |  2.97 |

### mccabe_avg

| kata                         | cell_workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-no-thinking |   5 |   2.11 |  1.4  |  3.6  |  0.88 |
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-requesty    |   5 |   2.16 |  1.38 |  2.75 |  0.61 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8             |   5 |   2.9  |  2.33 |  3.4  |  0.39 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking |   5 |   3.13 |  2.4  |  4.33 |  0.8  |

### cc_longest_function

| kata                         | cell_workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-no-thinking |   5 |   11.8 |     2 |    19 |  6.5  |
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-requesty    |   5 |   11.6 |    10 |    14 |  1.52 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8             |   5 |   17.4 |    10 |    22 |  5.5  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking |   5 |   17.8 |    12 |    22 |  5.31 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-no-thinking |   5 |   4.89 |  2    |  7.8  |  2.06 |
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-requesty    |   5 |   5.44 |  4.25 |  7.75 |  1.43 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8             |   5 |   6.89 |  4.2  |  8.33 |  1.69 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking |   5 |   8.19 |  5.8  | 11    |  2.01 |

### lines_of_code

| kata                         | cell_workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-no-thinking |   5 |   40   |    35 |    48 |  5.7  |
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-requesty    |   5 |   44.6 |    32 |    55 |  8.2  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8             |   5 |   35.2 |    31 |    38 |  2.77 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking |   5 |   42.2 |    27 |    50 | 10.28 |

### code_mass

| kata                         | cell_workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-no-thinking |   5 |  171.8 |   150 |   198 | 19.41 |
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-requesty    |   5 |  158.6 |   136 |   171 | 13.58 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8             |   5 |  149.2 |   132 |   164 | 13.08 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking |   5 |  159.6 |   137 |   179 | 17.64 |

### smell_total

| kata                         | cell_workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-no-thinking |   5 |    2   |     0 |     3 |  1.22 |
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-requesty    |   5 |    2.2 |     2 |     3 |  0.45 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8             |   5 |    3.4 |     2 |     5 |  1.52 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking |   5 |    1.2 |     0 |     4 |  1.79 |

### tests_passing (rate %)

| kata                         | cell_workflow                | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-requesty    |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8             |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking |   5 |       5 |      100 |

### tests_total

| kata                         | cell_workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-no-thinking |   5 |    8.8 |     8 |     9 |  0.45 |
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-requesty    |   5 |    8.8 |     8 |     9 |  0.45 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8             |   5 |    8.6 |     8 |     9 |  0.55 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking |   5 |    8.8 |     8 |     9 |  0.45 |

### verification_pct (rate %)

| kata                         | cell_workflow                | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-requesty    |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8             |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking |   5 |       5 |      100 |

### cycle_count

| kata                         | cell_workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-no-thinking |   5 |    8.8 |     8 |     9 |  0.45 |
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-requesty    |   5 |    8.8 |     8 |     9 |  0.45 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8             |   5 |    8.6 |     8 |     9 |  0.55 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking |   5 |    8.8 |     8 |     9 |  0.45 |

### refactorings_applied

| kata                         | cell_workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-no-thinking |   5 |    5.6 |     3 |     9 |  3.13 |
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-requesty    |   5 |    8.8 |     8 |     9 |  0.45 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8             |   5 |    3   |     3 |     3 |  0    |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking |   5 |    3   |     3 |     3 |  0    |

### predictions_correct

| kata                         | cell_workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-no-thinking |   5 |   13.8 |     0 |    18 |  7.76 |
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-requesty    |   5 |   17.6 |    16 |    18 |  0.89 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8             |   5 |   19.4 |    16 |    29 |  5.46 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking |   5 |   16.8 |    12 |    18 |  2.68 |

### predictions_total

| kata                         | cell_workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-no-thinking |   5 |   14   |     0 |    18 |  7.87 |
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-requesty    |   5 |   17.6 |    16 |    18 |  0.89 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8             |   5 |   19.4 |    16 |    29 |  5.46 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking |   5 |   16.8 |    12 |    18 |  2.68 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-requesty    |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8             |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking |   5 |       5 |      100 |

### duration_seconds

| kata                         | cell_workflow                | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-no-thinking |   5 |  579.2 |   453 |   757 | 157.85 |
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-requesty    |   5 |  718.6 |   661 |   739 |  32.53 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8             |   5 |  339.4 |   289 |   412 |  45.72 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking |   5 |  318   |   298 |   344 |  21.71 |

### total_tokens

| kata                         | cell_workflow                | cell_model           |   n |        mean |     min |     max |              std |
|:-----------------------------|:-----------------------------|:---------------------|----:|------------:|--------:|--------:|-----------------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-no-thinking |   5 | 7.36288e+06 | 4688656 | 8809447 |      1.67922e+06 |
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-requesty    |   5 | 4.09249e+06 | 3434019 | 4609405 | 519750           |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8             |   5 | 1.23042e+06 |  992904 | 1651260 | 277681           |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking |   5 | 1.26613e+06 | 1179367 | 1361035 |  76766.8         |

### cost_usd

| kata                         | cell_workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned        | opus-4-8-requesty    |   5 |   3.45 |  3.07 |  3.77 |  0.34 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8             |   5 |   2    |  1.77 |  2.3  |  0.25 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-4-8-no-thinking |   5 |   0    |  0    |  0    |  0    |
