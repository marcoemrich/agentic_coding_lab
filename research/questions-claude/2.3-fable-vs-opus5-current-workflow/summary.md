# RQ-fable-vs-opus5 — Aggregation

_How do Fable 5, Fable 5.1, Opus 5 and Sonnet 5 (each no-thinking, on the Claude Max subscription) differ in correctness and code quality on the novel claim-office kata under the current exact-coding baseline workflow?_

Generated: 2026-09-30T21:57:00Z

Cells declared: 4 · matched runs: 20 · min_replicates: 5

## Cell coverage

| kata | workflow | model | harness | n | n_ok | status |
|---|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking | 2.1.267 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking | 2.1.267 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking | 2.1.267 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267 | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |   0.93 |  0.8  |     1 |  0.08 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |   0.87 |  0.73 |     1 |  0.12 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |   0.95 |  0.93 |     1 |  0.03 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |   0.85 |  0.53 |     1 |  0.21 |

### verification_passed

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |   14   |    12 |    15 |  1.22 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |   13   |    11 |    15 |  1.87 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |   14.2 |    14 |    15 |  0.45 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |   12.8 |     8 |    15 |  3.19 |

### verification_total

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |     15 |    15 |    15 |     0 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |   3.63 |  3.03 |  4.21 |  0.43 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |   4.79 |  4.07 |  5.62 |  0.75 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |   3.45 |  2.64 |  4.28 |  0.64 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |   6.5  |  4.68 |  8.29 |  1.39 |

### cc_longest_function

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |   14.4 |    10 |    17 |  2.61 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |   17.6 |    14 |    22 |  3.21 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |   13.6 |     8 |    25 |  6.62 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |   26.2 |     9 |    36 | 11.86 |

### cognitive_max

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |    2.6 |     1 |     3 |  0.89 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |    3.2 |     3 |     4 |  0.45 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |    2.8 |     2 |     4 |  0.84 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |    4.2 |     4 |     5 |  0.45 |

### mccabe_max

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |    3.2 |     2 |     4 |  0.84 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |    3.8 |     3 |     5 |  0.84 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |    3   |     3 |     3 |  0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |    4.4 |     4 |     5 |  0.55 |

### smell_total

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |    0.6 |     0 |     2 |  0.89 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |    0.2 |     0 |     1 |  0.45 |

### code_mass

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |  805.2 |   736 |   895 | 61.41 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |  659   |   639 |   672 | 12.92 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |  848.4 |   734 |   949 | 79.93 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |  817.2 |   734 |   885 | 73.36 |

### refactorings_applied

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |   25.4 |    23 |    28 |  1.95 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |   23.8 |    22 |    26 |  1.48 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |   27.2 |    21 |    46 | 10.57 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |   21.4 |    10 |    27 |  6.91 |

### cycle_count

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |   43.8 |    41 |    45 |  1.64 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |   38.6 |    36 |    40 |  1.95 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |   46.4 |    40 |    50 |  3.91 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |   41.6 |    36 |    48 |  4.28 |

### tests_passing (rate %)

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |       5 |      100 |

### duration_seconds

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   mean |   min |   max |     std |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|------:|------:|--------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 | 4042   |  3762 |  4357 |  211.65 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 | 4950.4 |  2424 |  8386 | 3004.58 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 | 2552.4 |  2188 |  3471 |  530.7  |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 | 2276.6 |  1421 |  2949 |  562.97 |

### total_tokens

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |        mean |      min |       max |         std |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|------------:|---------:|----------:|------------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 | 6.68828e+07 | 61221761 |  75524761 | 6.42148e+06 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 | 7.49477e+07 | 70175566 |  83308845 | 5.07121e+06 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 | 8.44787e+07 | 63263584 | 101206718 | 1.37173e+07 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 | 1.10552e+08 | 67899248 | 139824027 | 3.07101e+07 |

### cost_usd

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   mean |    min |    max |   std |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|-------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |  43.72 |  39.34 |  50.72 |  4.65 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 | 109.96 | 102.87 | 120.98 |  7.05 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |  58.86 |  46.35 |  74.32 | 10.1  |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |  28.28 |  17.9  |  34.72 |  6.96 |
