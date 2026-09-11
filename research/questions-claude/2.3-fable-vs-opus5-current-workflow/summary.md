# RQ-fable-vs-opus5 — Aggregation

_How do Fable 5, Fable 5.1 and Opus 5 (each no-thinking, on the Claude Max subscription) differ in correctness and code quality on the novel claim-office kata under the current exact-coding baseline workflow?_

Generated: 2026-09-10T23:50:04Z

Cells declared: 3 · matched runs: 15 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | harness | n | n_ok | status |
|---|---|---|---|---:|---:|---|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking | 2.1.267 | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-no-thinking | 2.1.267 | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-1-no-thinking | 2.1.267 | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | cell_workflow                  | cell_model            | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:----------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-1-no-thinking | 2.1.267        |   5 |   0.93 |  0.8  |     1 |  0.08 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-no-thinking   | 2.1.267        |   5 |   0.87 |  0.73 |     1 |  0.12 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking    | 2.1.267        |   5 |   0.95 |  0.93 |     1 |  0.03 |

### verification_passed

| kata                         | cell_workflow                  | cell_model            | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:----------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-1-no-thinking | 2.1.267        |   5 |   14   |    12 |    15 |  1.22 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-no-thinking   | 2.1.267        |   5 |   13   |    11 |    15 |  1.87 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking    | 2.1.267        |   5 |   14.2 |    14 |    15 |  0.45 |

### verification_total

| kata                         | cell_workflow                  | cell_model            | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:----------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-1-no-thinking | 2.1.267        |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-no-thinking   | 2.1.267        |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking    | 2.1.267        |   5 |     15 |    15 |    15 |     0 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                  | cell_model            | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:----------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-1-no-thinking | 2.1.267        |   5 |   3.63 |  3.03 |  4.21 |  0.43 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-no-thinking   | 2.1.267        |   5 |   4.79 |  4.07 |  5.62 |  0.75 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking    | 2.1.267        |   5 |   3.45 |  2.64 |  4.28 |  0.64 |

### cc_longest_function

| kata                         | cell_workflow                  | cell_model            | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:----------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-1-no-thinking | 2.1.267        |   5 |   14.4 |    10 |    17 |  2.61 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-no-thinking   | 2.1.267        |   5 |   17.6 |    14 |    22 |  3.21 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking    | 2.1.267        |   5 |   13.6 |     8 |    25 |  6.62 |

### cognitive_max

| kata                         | cell_workflow                  | cell_model            | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:----------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-1-no-thinking | 2.1.267        |   5 |    2.6 |     1 |     3 |  0.89 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-no-thinking   | 2.1.267        |   5 |    3.2 |     3 |     4 |  0.45 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking    | 2.1.267        |   5 |    2.8 |     2 |     4 |  0.84 |

### mccabe_max

| kata                         | cell_workflow                  | cell_model            | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:----------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-1-no-thinking | 2.1.267        |   5 |    3.2 |     2 |     4 |  0.84 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-no-thinking   | 2.1.267        |   5 |    3.8 |     3 |     5 |  0.84 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking    | 2.1.267        |   5 |    3   |     3 |     3 |  0    |

### smell_total

| kata                         | cell_workflow                  | cell_model            | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:----------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-1-no-thinking | 2.1.267        |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-no-thinking   | 2.1.267        |   5 |    0.6 |     0 |     2 |  0.89 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking    | 2.1.267        |   5 |    0   |     0 |     0 |  0    |

### code_mass

| kata                         | cell_workflow                  | cell_model            | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:----------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-1-no-thinking | 2.1.267        |   5 |  805.2 |   736 |   895 | 61.41 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-no-thinking   | 2.1.267        |   5 |  659   |   639 |   672 | 12.92 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking    | 2.1.267        |   5 |  848.4 |   734 |   949 | 79.93 |

### refactorings_applied

| kata                         | cell_workflow                  | cell_model            | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:----------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-1-no-thinking | 2.1.267        |   5 |   25.4 |    23 |    28 |  1.95 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-no-thinking   | 2.1.267        |   5 |   23.8 |    22 |    26 |  1.48 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking    | 2.1.267        |   5 |   27.2 |    21 |    46 | 10.57 |

### cycle_count

| kata                         | cell_workflow                  | cell_model            | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:----------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-1-no-thinking | 2.1.267        |   5 |   43.8 |    41 |    45 |  1.64 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-no-thinking   | 2.1.267        |   5 |   38.6 |    36 |    40 |  1.95 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking    | 2.1.267        |   5 |   46.4 |    40 |    50 |  3.91 |

### tests_passing (rate %)

| kata                         | cell_workflow                  | cell_model            | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:----------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-1-no-thinking | 2.1.267        |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-no-thinking   | 2.1.267        |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking    | 2.1.267        |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                  | cell_model            | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:----------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-1-no-thinking | 2.1.267        |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-no-thinking   | 2.1.267        |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking    | 2.1.267        |   5 |       5 |      100 |

### duration_seconds

| kata                         | cell_workflow                  | cell_model            | cell_harness   |   n |   mean |   min |   max |     std |
|:-----------------------------|:-------------------------------|:----------------------|:---------------|----:|-------:|------:|------:|--------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-1-no-thinking | 2.1.267        |   5 | 4042   |  3762 |  4357 |  211.65 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-no-thinking   | 2.1.267        |   5 | 4950.4 |  2424 |  8386 | 3004.58 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking    | 2.1.267        |   5 | 2552.4 |  2188 |  3471 |  530.7  |

### total_tokens

| kata                         | cell_workflow                  | cell_model            | cell_harness   |   n |        mean |      min |      max |         std |
|:-----------------------------|:-------------------------------|:----------------------|:---------------|----:|------------:|---------:|---------:|------------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-1-no-thinking | 2.1.267        |   5 | 6.12833e+07 | 55741821 | 68473309 | 5.84841e+06 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-no-thinking   | 2.1.267        |   5 | 6.29998e+07 | 59504100 | 70699545 | 4.45868e+06 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking    | 2.1.267        |   5 | 7.22159e+07 | 51719658 | 81047575 | 1.1792e+07  |

### cost_usd

| kata                         | cell_workflow                  | cell_model            | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:----------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-1-no-thinking | 2.1.267        |   5 |  29.44 | 26.52 | 32.33 |  2.62 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | fable-5-no-thinking   | 2.1.267        |   5 |  76.93 | 72.39 | 84.79 |  4.68 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking    | 2.1.267        |   5 |  42.68 | 31.43 | 47.31 |  6.48 |
