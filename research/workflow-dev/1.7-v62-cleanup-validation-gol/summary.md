# RQ-v62-cleanup-validation-gol — Aggregation

_Does the cleanup equivalence result from RQ-1.6 (claim-office) also generalize to the training-known game-of-life kata, or does exact-hybrid-v4-cleaned-cc show a different effect there than on claim-office?_

Generated: 2026-10-12T08:38:01Z

Cells declared: 2 · matched runs: 15 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |

## Outcome pivots (per cell)

### code_mass

| kata                         | cell_workflow               | cell_model                   |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  151   | 11.25 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |      0 |  153.3 | 13.83 |

### smell_total

| kata                         | cell_workflow               | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |      0 |    2.8 | 0.84 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |      0 |    2.4 | 0.52 |

### longest_function

| kata                         | cell_workflow               | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |      0 |    9.4 | 8.29 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |      0 |   12.2 | 6.89 |

### cognitive_max

| kata                         | cell_workflow               | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |      0 |    4.8 | 5.81 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |      0 |    4.3 | 2.79 |

### mccabe_max

| kata                         | cell_workflow               | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |      0 |    4.6 | 3.13 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |      0 |    4.2 | 1.32 |

### tests_passing

| kata                         | cell_workflow               | cell_model                   |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------|:-----------------------------|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |  10 |      0 |      100 |

### predictions_correct_rate

| kata                         | cell_workflow               | cell_model                   |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:----------------------------|:-----------------------------|----:|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |  83 |  84 |      0 |     98.8 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 | 170 | 170 |      0 |    100   |

### refactorings_applied

| kata                         | cell_workflow               | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |      0 |    6.4 | 3.21 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |      0 |    7.9 | 1.85 |

### tests_passed_immediately

| kata                         | cell_workflow               | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |      0 |    2.2 | 3.03 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |      0 |    0.7 | 2.21 |

### cycle_count

| kata                         | cell_workflow               | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |      0 |    8.4 | 0.55 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |      0 |    8.5 | 1.35 |

### duration_seconds

| kata                         | cell_workflow               | cell_model                   |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  568.6 | 171.02 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |      0 |  627   | 117.15 |

### total_tokens

| kata                         | cell_workflow               | cell_model                   |   n |   null |        mean |          sd |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------------:|------------:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |      0 | 9.50379e+06 | 2.68066e+06 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |      0 | 1.04769e+07 | 2.07624e+06 |
