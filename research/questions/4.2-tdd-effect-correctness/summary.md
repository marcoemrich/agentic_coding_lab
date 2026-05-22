# RQ-tdd-correctness — Aggregation

_Unterscheidet sich die externe Korrektheit (verification_pct) zwischen TDD-Workflow-Varianten auf der neuartigen claim-office-Kata?_

Generated: 2026-05-22T20:19:42Z

Cells declared: 4 · matched runs: 19 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v3-basic-tdd | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v5.1-testlist-scope-fix | opus-4-7-portkey-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking | 3 | 3 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |   1    |   1   |     1 |  0    |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   0.96 |   0.8 |     1 |  0.09 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |   1    |   1   |     1 |  0    |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |   1    |   1   |     1 |  0    |

### verification_passed

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |   15   |    15 |    15 |  0    |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   14.4 |    12 |    15 |  1.34 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |   15   |    15 |    15 |  0    |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |   15   |    15 |    15 |  0    |

### verification_total

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |     15 |    15 |    15 |     0 |

### tests_passing (rate %)

| kata                         | workflow                       | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |       6 |      100 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |       3 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow                       | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |       6 |      100 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |       3 |      100 |

### cycle_count

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |   3.8  |     3 |     6 |  1.3  |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  44.6  |    34 |    55 |  8.59 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |   5.5  |     2 |    19 |  6.66 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |  24.67 |     5 |    43 | 19.04 |

### refactorings_applied

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |   1.8  |     1 |     2 |  0.45 |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   6.8  |     2 |    19 |  7.09 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |   2.17 |     1 |     3 |  0.75 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |  10.67 |     4 |    17 |  6.51 |

### predictions_correct_rate (pooled %)

| kata                         | workflow                       | cell_model                   |   n |   correct |   total |   rate_% |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |       302 |     325 |     92.9 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |        39 |      39 |    100   |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |       131 |     138 |     94.9 |

### tests_passed_immediately

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |   0.6  |     0 |     2 |  0.89 |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  22.2  |    15 |    29 |  6.14 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |   1.67 |     0 |     9 |  3.61 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |  13    |     1 |    26 | 12.53 |

### duration_seconds

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 |  312.4 |   257 |   381 |  53.36 |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 | 3228.8 |  2180 |  4333 | 919.93 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |  641   |   525 |   872 | 122.02 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 | 1424   |   556 |  2071 | 781.3  |

### total_tokens

| kata                         | workflow                       | cell_model                   |   n |        mean |      min |      max |              std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|------------:|---------:|---------:|-----------------:|
| claim-office-example-mapping | v3-basic-tdd                   | opus-4-7-portkey-no-thinking |   5 | 3.28141e+06 |  2734813 |  4185323 | 545757           |
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 | 1.41003e+07 | 11422803 | 18869365 |      2.99239e+06 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 | 1.87267e+07 | 14120743 | 28366021 |      5.35498e+06 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 | 3.01633e+07 |  9306264 | 44845398 |      1.85568e+07 |
