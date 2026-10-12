# RQ-gpt6-sol-vs-gpt56-sol — Aggregation

_Does GPT-6 Sol match or beat GPT-5.6 Sol on the canonical Predictive TDD workflow (exact-ptdd-v1-pi) — in correctness, code quality and cost?_

Generated: 2026-10-12T08:37:48Z

Cells declared: 4 · matched runs: 20 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow    | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |

### tests_passing

| kata                         | cell_workflow    | cell_model        |   n |   k |   null |   rate_% |
|:-----------------------------|:-----------------|:------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |

### code_mass

| kata                         | cell_workflow    | cell_model        |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |  655.6 | 272.36 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |  154   |  15.89 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |  583.2 |  65.66 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |  183.6 |  22.41 |

### smell_total

| kata                         | cell_workflow    | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |

### production_loc

| kata                         | cell_workflow    | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |  112.8 | 31.04 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   37   |  4.3  |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |  143.2 | 33.9  |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |   43.8 |  4.15 |

### cognitive_max

| kata                         | cell_workflow    | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |    4.6 | 1.52 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |    6   | 0.71 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |    4.4 | 1.52 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |    4.6 | 1.82 |

### cognitive_avg

| kata                         | cell_workflow    | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   2.1  | 0.28 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   2.77 | 0.38 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |   1.93 | 0.32 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |   2.8  | 1.08 |

### mccabe_max

| kata                         | cell_workflow    | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |    4.4 | 0.55 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |    4.2 | 0.45 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |    4.2 | 1.1  |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |    4.6 | 0.55 |

### avg_loc_per_function

| kata                         | cell_workflow    | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   5.57 | 0.69 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   6.83 | 1.03 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |   5.58 | 0.27 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |   5.81 | 0.81 |

### longest_function

| kata                         | cell_workflow    | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   20   | 10.32 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   12.2 |  2.17 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |   16.6 |  3.85 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |   12.8 |  1.1  |

### functions

| kata                         | cell_workflow    | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   12.2 | 3.96 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |    4.8 | 1.1  |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |   16.4 | 5.27 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |    6.4 | 1.34 |

### tests_total

| kata                         | cell_workflow    | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   34.6 | 18.9  |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   14   |  0.71 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |   39.6 |  2.51 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |   11.2 |  0.84 |

### test_lines

| kata                         | cell_workflow    | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   93.2 | 53.28 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   56.2 |  3.27 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |  211.6 | 99.51 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |   58.2 |  4.38 |

### mutation_score

| kata                         | cell_workflow    | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   0.46 | 0.44 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   0.95 | 0.03 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |   0.87 | 0.04 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |   0.95 | 0.01 |

### mutants_total

| kata                         | cell_workflow    | cell_model        |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |  135.2 | 104.24 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   59.2 |  15.16 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |  122.6 |  11.61 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |   56.6 |   5.46 |

### mutants_survived

| kata                         | cell_workflow    | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   61.2 | 56.57 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |    3.4 |  3.13 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |   16.2 |  4.09 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |    3   |  0.71 |

### mutants_no_coverage

| kata                         | cell_workflow    | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   19.6 | 38.86 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |    0   |  0    |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |    4   |  1.22 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |    0   |  0    |

### cycle_count

| kata                         | cell_workflow    | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   31   | 17.99 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   14   |  0.71 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |   39.8 |  2.49 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |   11.2 |  0.84 |

### refactorings_applied

| kata                         | cell_workflow    | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   28   | 16.57 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   14   |  0.71 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |   40   |  2.92 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |   11.4 |  1.14 |

### predictions_correct_rate

| kata                         | cell_workflow    | cell_model        |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:-----------------|:------------------|----:|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 | 277 | 278 |      0 |     99.6 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 | 140 | 140 |      0 |    100   |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 | 395 | 397 |      0 |     99.5 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 | 113 | 114 |      0 |     99.1 |

### duration_seconds

| kata                         | cell_workflow    | cell_model        |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------|:------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 | 1300.6 | 588.54 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |  573   |  37.72 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 | 1749.8 | 536.99 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |  727   |  32.98 |

### total_tokens

| kata                         | cell_workflow    | cell_model        |   n |   null |        mean |               sd |
|:-----------------------------|:-----------------|:------------------|----:|-------:|------------:|-----------------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 | 4.19828e+06 |      2.24845e+06 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 | 1.45364e+06 | 127077           |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 | 6.40822e+06 |      4.62266e+06 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 | 1.44698e+06 | 126560           |

### cost_usd

| kata                         | cell_workflow    | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   1.24 | 0.56 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |   0.49 | 0.05 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |   4.49 | 3.04 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |   1.49 | 0.15 |
