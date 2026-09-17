# RQ-v62-cleanup-validation-gol — Aggregation

_Does the cleanup equivalence result from RQ-1.6 (claim-office) also generalize to the training-known game-of-life kata, or does exact-hybrid-v4-cleaned-cc show a different effect there than on claim-office?_

Generated: 2026-09-17T01:17:54Z

Cells declared: 2 · matched runs: 15 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |

## Outcome pivots (per cell)

### code_mass

| kata                         | cell_workflow               | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |  151   |   139 |   166 | 11.25 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |  153.3 |   129 |   170 | 13.83 |

### smell_total

| kata                         | cell_workflow               | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |    2.8 |     2 |     4 |  0.84 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |    2.4 |     2 |     3 |  0.52 |

### cc_longest_function

| kata                         | cell_workflow               | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |    9.4 |     2 |    22 |  8.29 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |   12.2 |     2 |    24 |  6.89 |

### cognitive_max

| kata                         | cell_workflow               | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |    4.8 |     1 |    15 |  5.81 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |    4.3 |     1 |    10 |  2.79 |

### mccabe_max

| kata                         | cell_workflow               | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |    4.6 |     2 |    10 |  3.13 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |    4.2 |     2 |     6 |  1.32 |

### tests_passing (rate %)

| kata                         | cell_workflow               | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow               | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow               | cell_model                   |   n |   correct |   total |   rate_% |
|:-----------------------------|:----------------------------|:-----------------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |        83 |      84 |     98.8 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |       170 |     170 |    100   |

### refactorings_applied

| kata                         | cell_workflow               | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |    6.4 |     2 |     9 |  3.21 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |    7.9 |     4 |     9 |  1.85 |

### tests_passed_immediately

| kata                         | cell_workflow               | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |    2.2 |     0 |     6 |  3.03 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |    0.7 |     0 |     7 |  2.21 |

### cycle_count

| kata                         | cell_workflow               | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |    8.4 |     8 |     9 |  0.55 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |    8.5 |     5 |    10 |  1.35 |

### duration_seconds

| kata                         | cell_workflow               | cell_model                   |   n |   mean |   min |   max |    std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 |  568.6 |   321 |   713 | 171.02 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 |  627   |   442 |   783 | 117.15 |

### total_tokens

| kata                         | cell_workflow               | cell_model                   |   n |        mean |     min |     max |         std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|------------:|--------:|--------:|------------:|
| game-of-life-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   5 | 7.56447e+06 | 4907326 | 9546565 | 1.88171e+06 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |  10 | 8.31736e+06 | 4985045 | 9943890 | 1.61451e+06 |
