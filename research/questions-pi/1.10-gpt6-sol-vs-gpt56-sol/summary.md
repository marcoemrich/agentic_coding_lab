# RQ-gpt6-sol-vs-gpt56-sol — Aggregation

_Does GPT-6 Sol match or beat GPT-5.6 Sol on the canonical Predictive TDD workflow (exact-ptdd-v1-pi) — in correctness, code quality and cost?_

Generated: 2026-09-23T15:03:11Z

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

| kata                         | cell_workflow    | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      1 |     1 |     1 |     0 |

### tests_passing (rate %)

| kata                         | cell_workflow    | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:-----------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow    | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:-----------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |       5 |      100 |

### code_mass

| kata                         | cell_workflow    | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |  583.2 |   519 |   694 |  65.66 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |  655.6 |   496 |  1139 | 272.36 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |  183.6 |   157 |   212 |  22.41 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |  154   |   136 |   175 |  15.89 |

### smell_total

| kata                         | cell_workflow    | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |      0 |     0 |     0 |     0 |

### cc_loc

| kata                         | cell_workflow    | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |  143.2 |   100 |   184 | 33.9  |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |  112.8 |    82 |   163 | 31.04 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   43.8 |    37 |    48 |  4.15 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   37   |    31 |    42 |  4.3  |

### cognitive_max

| kata                         | cell_workflow    | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |    4.4 |     3 |     7 |  1.52 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |    4.6 |     3 |     7 |  1.52 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |    4.6 |     3 |     7 |  1.82 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |    6   |     5 |     7 |  0.71 |

### cognitive_avg

| kata                         | cell_workflow    | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   1.93 |  1.4  |  2.17 |  0.32 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   2.1  |  1.86 |  2.56 |  0.28 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   2.8  |  2    |  4.67 |  1.08 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   2.77 |  2.5  |  3.33 |  0.38 |

### mccabe_max

| kata                         | cell_workflow    | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |    4.2 |     3 |     6 |  1.1  |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |    4.4 |     4 |     5 |  0.55 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |    4.6 |     4 |     5 |  0.55 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |    4.2 |     4 |     5 |  0.45 |

### cc_avg_loc_per_function

| kata                         | cell_workflow    | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   5.58 |  5.19 |  5.91 |  0.27 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   5.57 |  4.56 |  6.25 |  0.69 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   5.81 |  5.14 |  7.2  |  0.81 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   6.83 |  6.2  |  8.67 |  1.03 |

### cc_longest_function

| kata                         | cell_workflow    | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   16.6 |    12 |    21 |  3.85 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   20   |    13 |    38 | 10.32 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   12.8 |    12 |    14 |  1.1  |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   12.2 |     9 |    15 |  2.17 |

### cc_functions

| kata                         | cell_workflow    | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   16.4 |    11 |    22 |  5.27 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   12.2 |     9 |    19 |  3.96 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |    6.4 |     5 |     8 |  1.34 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |    4.8 |     3 |     6 |  1.1  |

### tests_total

| kata                         | cell_workflow    | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   39.6 |    38 |    44 |  2.51 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   34.6 |     1 |    46 | 18.9  |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   11.2 |    10 |    12 |  0.84 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   14   |    13 |    15 |  0.71 |

### test_lines

| kata                         | cell_workflow    | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |  211.6 |    75 |   349 | 99.51 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   93.2 |    46 |   184 | 53.28 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   58.2 |    52 |    64 |  4.38 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   56.2 |    53 |    60 |  3.27 |

### mutation_score

| kata                         | cell_workflow    | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   0.87 |  0.83 |  0.91 |  0.04 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   0.46 |  0    |  0.9  |  0.44 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   0.95 |  0.93 |  0.96 |  0.01 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   0.95 |  0.89 |  0.97 |  0.03 |

### mutants_total

| kata                         | cell_workflow    | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |  122.6 |   111 |   139 |  11.61 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |  135.2 |    42 |   314 | 104.24 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   56.6 |    51 |    64 |   5.46 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   59.2 |    46 |    85 |  15.16 |

### mutants_survived

| kata                         | cell_workflow    | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   16.2 |    12 |    21 |  4.09 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   61.2 |    11 |   144 | 56.57 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |    3   |     2 |     4 |  0.71 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |    3.4 |     2 |     9 |  3.13 |

### mutants_no_coverage

| kata                         | cell_workflow    | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |    4   |     3 |     6 |  1.22 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   19.6 |     0 |    89 | 38.86 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |    0   |     0 |     0 |  0    |

### cycle_count

| kata                         | cell_workflow    | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   39.8 |    38 |    44 |  2.49 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   31   |     3 |    46 | 17.99 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   11.2 |    10 |    12 |  0.84 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   14   |    13 |    15 |  0.71 |

### refactorings_applied

| kata                         | cell_workflow    | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   40   |    38 |    45 |  2.92 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   28   |     4 |    46 | 16.57 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   11.4 |    10 |    13 |  1.14 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   14   |    13 |    15 |  0.71 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow    | cell_model        |   n |   correct |   total |   rate_% |
|:-----------------------------|:-----------------|:------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |       395 |     397 |     99.5 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |       277 |     278 |     99.6 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |       113 |     114 |     99.1 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |       140 |     140 |    100   |

### duration_seconds

| kata                         | cell_workflow    | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 | 1749.8 |   844 |  2208 | 536.99 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 | 1300.6 |   376 |  1906 | 588.54 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |  727   |   687 |   768 |  32.98 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |  573   |   541 |   634 |  37.72 |

### total_tokens

| kata                         | cell_workflow    | cell_model        |   n |        mean |     min |      max |              std |
|:-----------------------------|:-----------------|:------------------|----:|------------:|--------:|---------:|-----------------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 | 6.40822e+06 | 1379745 | 10949010 |      4.62266e+06 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 | 4.19828e+06 |  732743 |  6331495 |      2.24845e+06 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 | 1.44698e+06 | 1261449 |  1618255 | 126560           |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 | 1.45364e+06 | 1290697 |  1627342 | 127077           |

### cost_usd

| kata                         | cell_workflow    | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   4.49 |  0.87 |  7.47 |  3.04 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   1.24 |  0.36 |  1.82 |  0.56 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex |   5 |   1.49 |  1.38 |  1.75 |  0.15 |
| game-of-life-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex   |   5 |   0.49 |  0.45 |  0.56 |  0.05 |
