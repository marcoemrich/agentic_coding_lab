# RQ-9.2 — Aggregation

_Stellt die gezielte Wiederherstellung der drei identifizierten tragenden Inhalte die Refactoring-Disziplin und Funktionslänge wieder her?_

Generated: 2026-05-11T11:12:33Z

Cells declared: 3 · matched runs: 24 · min_replicates: 8

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey | 8 | 8 | ✅ |
| game-of-life-example-mapping | v4.2-conservative | opus-4-6-portkey | 8 | 8 | ✅ |
| game-of-life-example-mapping | v4.3-targeted | opus-4-6-portkey | 8 | 8 | ✅ |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow           | model            |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:-----------------|----:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   8 |       6 |       75 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   8 |       8 |      100 |
| game-of-life-example-mapping | v4.3-targeted      | opus-4-6-portkey |   8 |       8 |      100 |

### code_mass

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   6 | 153.83 |   106 |   191 | 32.55 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   8 | 168.5  |   128 |   208 | 29.84 |
| game-of-life-example-mapping | v4.3-targeted      | opus-4-6-portkey |   8 | 133.12 |   121 |   166 | 18.98 |

### cc_loc

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   6 |  29.67 |    20 |    38 |  7.71 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   8 |  37    |    27 |    49 |  7.89 |
| game-of-life-example-mapping | v4.3-targeted      | opus-4-6-portkey |   8 |  24.75 |    21 |    38 |  6.54 |

### cc_avg_loc_per_function

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   6 |  11.77 |  2.67 | 28    | 10.89 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   8 |   9.33 |  2.33 | 14.33 |  4.18 |
| game-of-life-example-mapping | v4.3-targeted      | opus-4-6-portkey |   8 |  20.5  |  2.33 | 26    |  8.32 |

### cc_longest_function

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   6 |  16.5  |     4 |    28 |  8.96 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   8 |  21.25 |     4 |    31 |  9.79 |
| game-of-life-example-mapping | v4.3-targeted      | opus-4-6-portkey |   8 |  22.62 |     3 |    30 |  8.18 |

### mccabe_max

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   6 |   8.5  |     5 |    12 |  2.74 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   8 |   8.5  |     6 |    11 |  1.85 |
| game-of-life-example-mapping | v4.3-targeted      | opus-4-6-portkey |   8 |  10.12 |     6 |    11 |  1.81 |

### mccabe_avg

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   6 |   4.4  |  1.54 |  11   |  3.69 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   8 |   2.94 |  2.25 |   3.5 |  0.42 |
| game-of-life-example-mapping | v4.3-targeted      | opus-4-6-portkey |   8 |   5.18 |  2    |   6   |  1.57 |

### cognitive_max

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   6 |  13.17 |     7 |    18 |  4.96 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   8 |  13.25 |     8 |    18 |  4.1  |
| game-of-life-example-mapping | v4.3-targeted      | opus-4-6-portkey |   8 |  16.12 |     9 |    18 |  2.9  |

### cognitive_avg

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   6 |  10.39 |  2.5  |    18 |  6.75 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   8 |   9.71 |  5.33 |    17 |  4.69 |
| game-of-life-example-mapping | v4.3-targeted      | opus-4-6-portkey |   8 |  14.25 |  5    |    17 |  5.12 |

### smell_total

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   6 |   3.83 |     2 |     6 |  1.33 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   8 |   4    |     2 |     6 |  1.6  |
| game-of-life-example-mapping | v4.3-targeted      | opus-4-6-portkey |   8 |   4.12 |     3 |     6 |  0.83 |

### cycle_count

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   6 |   8    |     5 |     9 |  1.67 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   8 |   8.62 |     7 |     9 |  0.74 |
| game-of-life-example-mapping | v4.3-targeted      | opus-4-6-portkey |   8 |   8.75 |     7 |    10 |  0.89 |

### refactorings_applied

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   6 |   4.83 |     2 |     9 |  2.71 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   8 |   2.75 |     2 |     3 |  0.46 |
| game-of-life-example-mapping | v4.3-targeted      | opus-4-6-portkey |   8 |   2.12 |     1 |     3 |  0.64 |

### predictions_correct

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   6 |  16.67 |    10 |    22 |  4.13 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   8 |  17.25 |    14 |    18 |  1.49 |
| game-of-life-example-mapping | v4.3-targeted      | opus-4-6-portkey |   8 |  17.5  |    14 |    20 |  1.77 |

### predictions_total

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   6 |  16.67 |    10 |    22 |  4.13 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   8 |  17.25 |    14 |    18 |  1.49 |
| game-of-life-example-mapping | v4.3-targeted      | opus-4-6-portkey |   8 |  17.5  |    14 |    20 |  1.77 |

### predictions_correct_rate (pooled %)

| kata                         | workflow           | model            |   n |   correct |   total |   rate_% |
|:-----------------------------|:-------------------|:-----------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   6 |       100 |     100 |      100 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   8 |       138 |     138 |      100 |
| game-of-life-example-mapping | v4.3-targeted      | opus-4-6-portkey |   8 |       140 |     140 |      100 |

### duration_seconds

| kata                         | workflow           | model            |   n |    mean |   min |   max |    std |
|:-----------------------------|:-------------------|:-----------------|----:|--------:|------:|------:|-------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   6 | 1008.5  |   739 |  1321 | 225.65 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   8 |  847.88 |   722 |   954 |  87.21 |
| game-of-life-example-mapping | v4.3-targeted      | opus-4-6-portkey |   8 |  834.62 |   554 |  1108 | 167.76 |

### total_tokens

| kata                         | workflow           | model            |   n |        mean |         min |         max |    std |
|:-----------------------------|:-------------------|:-----------------|----:|------------:|------------:|------------:|-------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   6 | 4.37914e+06 | 3.386e+06   | 5.49471e+06 | 940537 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   8 | 4.69143e+06 | 3.53239e+06 | 5.41206e+06 | 640203 |
| game-of-life-example-mapping | v4.3-targeted      | opus-4-6-portkey |   8 | 4.01594e+06 | 2.75723e+06 | 5.00025e+06 | 650732 |

### completed_within_budget (rate %)

| kata                         | workflow           | model            |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:-----------------|----:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   8 |       8 |      100 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   8 |       8 |      100 |
| game-of-life-example-mapping | v4.3-targeted      | opus-4-6-portkey |   8 |       8 |      100 |
