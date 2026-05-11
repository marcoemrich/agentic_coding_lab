# RQ-9.1 — Aggregation

_Lässt sich der Subagent-Workflow (v4) ohne Qualitätsverlust reduzieren, wenn nur echte Redundanz entfernt wird?_

Generated: 2026-05-11T06:36:15Z

Cells declared: 2 · matched runs: 8 · min_replicates: 4

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey | 4 | 4 | ✅ |
| game-of-life-example-mapping | v4.2-conservative | opus-4-6-portkey | 4 | 4 | ✅ |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow           | model            |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:-----------------|----:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   4 |       4 |      100 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   4 |       4 |      100 |

### code_mass

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   4 | 157.75 |   106 |   191 | 38.59 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   4 | 157    |   128 |   191 | 29.56 |

### cc_loc

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   4 |  29.5  |    20 |    36 |  7.51 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   4 |  36.25 |    28 |    49 |  9.54 |

### cc_avg_loc_per_function

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   4 |   9.98 |   3.8 | 23    |  8.83 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   4 |   9.38 |   4.5 | 13.67 |  3.8  |

### cc_longest_function

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   4 |  16.75 |    11 |    23 |  6.13 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   4 |  20.25 |     9 |    28 |  8.18 |

### mccabe_max

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   4 |   7.5  |     5 |    11 |  2.65 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   4 |   8.75 |     7 |    11 |  1.71 |

### mccabe_avg

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   4 |   4.23 |  1.54 |  11   |  4.53 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   4 |   3.02 |  2.75 |   3.5 |  0.34 |

### cognitive_max

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   4 |  11.75 |     7 |    17 |  5.5  |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   4 |  11.75 |     8 |    17 |  4.11 |

### cognitive_avg

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   4 |   7.58 |  2.5  |    17 |  6.47 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   4 |   9.83 |  5.33 |    17 |  5.02 |

### smell_total

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   4 |   3.75 |     2 |     6 |  1.71 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   4 |   3.25 |     2 |     5 |  1.5  |

### cycle_count

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   4 |   8.5  |     7 |     9 |   1   |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   4 |   8.75 |     8 |     9 |   0.5 |

### refactorings_applied

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   4 |    6   |     3 |     9 |  2.58 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   4 |    2.5 |     2 |     3 |  0.58 |

### predictions_correct

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   4 |   18   |    14 |    22 |  3.27 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   4 |   17.5 |    16 |    18 |  1    |

### predictions_total

| kata                         | workflow           | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   4 |   18   |    14 |    22 |  3.27 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   4 |   17.5 |    16 |    18 |  1    |

### predictions_correct_rate (pooled %)

| kata                         | workflow           | model            |   n |   correct |   total |   rate_% |
|:-----------------------------|:-------------------|:-----------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   4 |        72 |      72 |      100 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   4 |        70 |      70 |      100 |

### duration_seconds

| kata                         | workflow           | model            |   n |    mean |   min |   max |    std |
|:-----------------------------|:-------------------|:-----------------|----:|--------:|------:|------:|-------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   4 | 1115.75 |   858 |  1321 | 191.94 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   4 |  842.25 |   742 |   929 |  81.89 |

### total_tokens

| kata                         | workflow           | model            |   n |        mean |     min |     max |    std |
|:-----------------------------|:-------------------|:-----------------|----:|------------:|--------:|--------:|-------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   4 | 4.79718e+06 | 3533177 | 5494710 | 871145 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   4 | 5.0123e+06  | 4124992 | 5412065 | 598730 |

### completed_within_budget (rate %)

| kata                         | workflow           | model            |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:-----------------|----:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey |   4 |       4 |      100 |
| game-of-life-example-mapping | v4.2-conservative  | opus-4-6-portkey |   4 |       4 |      100 |
