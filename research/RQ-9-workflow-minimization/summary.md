# RQ-9 — Aggregation

_Trägt der verbose Instruktions-Inhalt eines TDD-Workflows zur Code-Qualität und TDD-Disziplin bei, oder ist er entbehrlich?_

Generated: 2026-05-11T02:37:29Z

Cells declared: 4 · matched runs: 16 · min_replicates: 4

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-6-portkey | 4 | 4 | ✅ |
| game-of-life-example-mapping | v4.1-minimized | opus-4-6-portkey | 4 | 4 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey | 4 | 4 | ✅ |
| game-of-life-example-mapping | v5.1-minimized | opus-4-6-portkey | 4 | 4 | ✅ |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow                | model            |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:-----------------|----:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey |   4 |       4 |      100 |
| game-of-life-example-mapping | v4.1-minimized          | opus-4-6-portkey |   4 |       4 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey |   4 |       4 |      100 |
| game-of-life-example-mapping | v5.1-minimized          | opus-4-6-portkey |   4 |       4 |      100 |

### cc_loc

| kata                         | workflow                | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey |   4 |  29.5  |    20 |    36 |  7.51 |
| game-of-life-example-mapping | v4.1-minimized          | opus-4-6-portkey |   4 |  35.25 |    28 |    42 |  6.8  |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey |   4 |  25.5  |    21 |    35 |  6.4  |
| game-of-life-example-mapping | v5.1-minimized          | opus-4-6-portkey |   4 |  28    |    21 |    34 |  6.06 |

### cc_avg_loc_per_function

| kata                         | workflow                | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey |   4 |   9.98 |  3.8  | 23    |  8.83 |
| game-of-life-example-mapping | v4.1-minimized          | opus-4-6-portkey |   4 |   9.92 |  8.8  | 11.67 |  1.27 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey |   4 |  12.69 |  8.75 | 24    |  7.54 |
| game-of-life-example-mapping | v5.1-minimized          | opus-4-6-portkey |   4 |  11.03 |  3.6  | 24    |  8.96 |

### cc_longest_function

| kata                         | workflow                | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey |   4 |  16.75 |    11 |    23 |  6.13 |
| game-of-life-example-mapping | v4.1-minimized          | opus-4-6-portkey |   4 |  25.25 |    23 |    28 |  2.22 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey |   4 |  22.75 |    19 |    24 |  2.5  |
| game-of-life-example-mapping | v5.1-minimized          | opus-4-6-portkey |   4 |  17.5  |    10 |    24 |  7.05 |

### mccabe_max

| kata                         | workflow                | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey |   4 |   7.5  |     5 |    11 |  2.65 |
| game-of-life-example-mapping | v4.1-minimized          | opus-4-6-portkey |   4 |   9.25 |     6 |    14 |  3.95 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey |   4 |  10.25 |     8 |    11 |  1.5  |
| game-of-life-example-mapping | v5.1-minimized          | opus-4-6-portkey |   4 |   8    |     5 |    11 |  3.46 |

### mccabe_avg

| kata                         | workflow                | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey |   4 |   4.23 |  1.54 | 11    |  4.53 |
| game-of-life-example-mapping | v4.1-minimized          | opus-4-6-portkey |   4 |   3.25 |  2.25 |  4.25 |  0.84 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey |   4 |   3.88 |  2.5  |  6    |  1.49 |
| game-of-life-example-mapping | v5.1-minimized          | opus-4-6-portkey |   4 |   3.27 |  1.7  |  6    |  1.99 |

### cognitive_max

| kata                         | workflow                | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey |   4 |  11.75 |     7 |    17 |  5.5  |
| game-of-life-example-mapping | v4.1-minimized          | opus-4-6-portkey |   4 |  14    |     9 |    20 |  5.35 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey |   4 |  16.75 |    16 |    17 |  0.5  |
| game-of-life-example-mapping | v5.1-minimized          | opus-4-6-portkey |   4 |  12    |     7 |    17 |  5.77 |

### cognitive_avg

| kata                         | workflow                | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey |   4 |   7.58 |  2.5  |    17 |  6.47 |
| game-of-life-example-mapping | v4.1-minimized          | opus-4-6-portkey |   4 |  12.42 |  5.67 |    20 |  7.15 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey |   4 |  14    |  5    |    17 |  6    |
| game-of-life-example-mapping | v5.1-minimized          | opus-4-6-portkey |   4 |  11.29 |  4.67 |    17 |  6.63 |

### smell_total

| kata                         | workflow                | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey |   4 |   3.75 |     2 |     6 |  1.71 |
| game-of-life-example-mapping | v4.1-minimized          | opus-4-6-portkey |   4 |   3.5  |     2 |     5 |  1.29 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey |   4 |   4.5  |     4 |     6 |  1    |
| game-of-life-example-mapping | v5.1-minimized          | opus-4-6-portkey |   4 |   3.5  |     3 |     4 |  0.58 |

### cycle_count

| kata                         | workflow                | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey |   4 |   8.5  |     7 |     9 |  1    |
| game-of-life-example-mapping | v4.1-minimized          | opus-4-6-portkey |   4 |   9.75 |     9 |    11 |  0.96 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey |   4 |   7    |     6 |     8 |  1.15 |
| game-of-life-example-mapping | v5.1-minimized          | opus-4-6-portkey |   4 |   8.5  |     8 |     9 |  0.58 |

### refactorings_applied

| kata                         | workflow                | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey |   4 |   6    |     3 |     9 |  2.58 |
| game-of-life-example-mapping | v4.1-minimized          | opus-4-6-portkey |   4 |   2.25 |     1 |     3 |  0.96 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey |   4 |   5.5  |     3 |     8 |  2.08 |
| game-of-life-example-mapping | v5.1-minimized          | opus-4-6-portkey |   4 |   5.75 |     2 |     9 |  3.77 |

### predictions_correct

| kata                         | workflow                | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey |   4 |   18   |    14 |    22 |  3.27 |
| game-of-life-example-mapping | v4.1-minimized          | opus-4-6-portkey |   4 |   20.5 |    18 |    23 |  2.89 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey |   4 |   13.5 |    12 |    15 |  1.73 |
| game-of-life-example-mapping | v5.1-minimized          | opus-4-6-portkey |   4 |   17   |    16 |    18 |  1.15 |

### predictions_total

| kata                         | workflow                | model            |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey |   4 |   18   |    14 |    22 |  3.27 |
| game-of-life-example-mapping | v4.1-minimized          | opus-4-6-portkey |   4 |   20.5 |    18 |    23 |  2.89 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey |   4 |   14   |    12 |    16 |  2.31 |
| game-of-life-example-mapping | v5.1-minimized          | opus-4-6-portkey |   4 |   17   |    16 |    18 |  1.15 |

### predictions_correct_rate (pooled %)

| kata                         | workflow                | model            |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------------|:-----------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey |   4 |        72 |      72 |    100   |
| game-of-life-example-mapping | v4.1-minimized          | opus-4-6-portkey |   4 |        82 |      82 |    100   |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey |   4 |        54 |      56 |     96.4 |
| game-of-life-example-mapping | v5.1-minimized          | opus-4-6-portkey |   4 |        68 |      68 |    100   |

### duration_seconds

| kata                         | workflow                | model            |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------------|:-----------------|----:|--------:|------:|------:|-------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey |   4 | 1115.75 |   858 |  1321 | 191.94 |
| game-of-life-example-mapping | v4.1-minimized          | opus-4-6-portkey |   4 |  656.25 |   509 |   790 | 136.9  |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey |   4 |  618.5  |   390 |   725 | 154.74 |
| game-of-life-example-mapping | v5.1-minimized          | opus-4-6-portkey |   4 |  498    |   363 |   738 | 164.97 |

### total_tokens

| kata                         | workflow                | model            |   n |        mean |     min |      max |              std |
|:-----------------------------|:------------------------|:-----------------|----:|------------:|--------:|---------:|-----------------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey |   4 | 4.79718e+06 | 3533177 |  5494710 | 871145           |
| game-of-life-example-mapping | v4.1-minimized          | opus-4-6-portkey |   4 | 3.7449e+06  | 3239657 |  4685845 | 650107           |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey |   4 | 1.17988e+07 | 7360637 | 14043233 |      3.03699e+06 |
| game-of-life-example-mapping | v5.1-minimized          | opus-4-6-portkey |   4 | 1.05015e+07 | 7374895 | 14526499 |      3.06114e+06 |

### completed_within_budget (rate %)

| kata                         | workflow                | model            |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:-----------------|----:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-6-portkey |   4 |       4 |      100 |
| game-of-life-example-mapping | v4.1-minimized          | opus-4-6-portkey |   4 |       4 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-6-portkey |   4 |       4 |      100 |
| game-of-life-example-mapping | v5.1-minimized          | opus-4-6-portkey |   4 |       4 |      100 |
