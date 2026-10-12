# RQ-ponytail-sol-pi — Aggregation

_When Ponytail full is forcibly loaded into the Sol-originated EXACT Coding workflow on pi, does it improve code quality without reducing correctness, test strength, TDD discipline or completion reliability, and at what cost?_

Generated: 2026-10-12T16:44:08Z

Cells declared: 4 · matched runs: 20 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |

### tests_passing

| kata                         | cell_workflow                   | cell_model        |   n |   k |   null |   rate_% |
|:-----------------------------|:--------------------------------|:------------------|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |

### mutation_score

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   0.91 | 0.09 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   0.88 | 0.05 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |   0.95 | 0.04 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |   0.87 | 0.05 |

### mutants_total

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   53.2 | 11.12 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |  116.6 | 17.3  |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |   39   |  1.87 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |  116.6 | 10.64 |

### mutants_survived

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |    5.4 | 6.5  |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   14   | 8.22 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |    2   | 1.41 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |   15.6 | 6.8  |

### code_mass

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |  155.4 |  9.24 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |  566.6 | 51.91 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |  139.8 | 12.03 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |  532   | 37.85 |

### production_loc

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   34   |  3.32 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |  131.6 | 19.06 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |   23.4 |  1.67 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |   96.8 | 11.69 |

### functions

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |    4   | 0.71 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |    8.4 | 1.95 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |    2.2 | 0.84 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |    5.6 | 1.52 |

### avg_loc_per_function

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   6.63 | 1.41 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   7.69 | 1.42 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |   9.53 | 4.27 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |   8.7  | 1.92 |

### median_loc_per_function

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |    4.6 | 1.52 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |    5.7 | 1.3  |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |    7.6 | 6.19 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |    8.5 | 3.43 |

### longest_function

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   13   | 4    |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   17   | 2.83 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |   16.4 | 1.52 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |   17   | 2.45 |

### cognitive_max

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |    4.2 | 1.79 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |    4.2 | 0.84 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |    4   | 0    |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |    5.8 | 2.05 |

### cognitive_avg

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   2.77 | 0.52 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   2.16 | 0.36 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |   2.87 | 0.3  |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |   2.69 | 0.62 |

### cognitive_high_count

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |

### mccabe_max

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |    4.4 | 0.55 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |    4.6 | 0.55 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |    4   | 0    |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |    6.2 | 1.64 |

### mccabe_avg

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   2.06 | 0.3  |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   1.95 | 0.31 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |   2    | 0    |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |   1.95 | 0.33 |

### mccabe_high_count

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |

### smell_total

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |

### test_lines

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   53.4 |  8.99 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |  192.4 | 34.31 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |   45.2 |  2.95 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |  199.8 | 25.83 |

### predictions_correct_rate

| kata                         | cell_workflow                   | cell_model        |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:--------------------------------|:------------------|----:|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |  50 |  50 |      0 |    100   |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 | 173 | 173 |      0 |    100   |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |  42 |  42 |      0 |    100   |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 | 140 | 142 |      0 |     98.6 |

### duration_seconds

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |  416.8 |  56.81 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 | 1158.8 | 200.8  |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |  502.8 | 119.21 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 | 1048.8 |  91.76 |

### total_tokens

| kata                         | cell_workflow                   | cell_model        |   n |   null |        mean |               sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------------:|-----------------:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 | 1.03646e+06 | 213561           |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 | 4.92493e+06 |      1.07327e+06 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 | 1.07202e+06 | 111657           |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 | 5.41491e+06 |      1.10447e+06 |

### cost_usd

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   1.1  | 0.15 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   3.65 | 0.7  |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |   1.14 | 0.13 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |   4.02 | 0.77 |
